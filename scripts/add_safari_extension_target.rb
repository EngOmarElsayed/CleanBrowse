# Adds the "CleanBrowse Extension" Safari web extension target to the Xcode
# project: native handler + CoreML model in Sources, built extension JS +
# manifest in Resources, BlurShieldKit local package linked, appex embedded in
# the CleanBrowse app. Idempotent — safe to re-run.
#
# Run from repo root: LC_ALL=en_US.UTF-8 ruby scripts/add_safari_extension_target.rb
require 'xcodeproj'

EXT_NAME = 'CleanBrowse Extension'
EXT_BUNDLE_ID = 'com.omarelsayed.cleanbrowse.extension'
MACOS_TARGET = '14.6'
TEAM = '9PYC9KWKRS'

project = Xcodeproj::Project.open('App/CleanBrowse.xcodeproj')
app = project.targets.find { |t| t.name == 'CleanBrowse' } or abort 'app target not found'

# ── extension target ──────────────────────────────────────────────────────
ext = project.targets.find { |t| t.name == EXT_NAME }
unless ext
  ext = project.new_target(:app_extension, EXT_NAME, :osx, MACOS_TARGET)

  # Handler sources (paths relative to the project dir, App/)
  ext_group = project.main_group.new_group(EXT_NAME, EXT_NAME)
  handler_ref = ext_group.new_file('SafariWebExtensionHandler.swift')
  ext_group.new_file('Info.plist')
  ext.source_build_phase.add_file_reference(handler_ref)

  # CoreML model — compiled by Xcode, so it belongs in the Sources phase
  models_group = project.main_group.new_group('Models', '../Models')
  ml_ref = models_group.new_file('BlurShieldNSFW.mlpackage')
  ext.source_build_phase.add_file_reference(ml_ref)

  # Extension JS bundle (esbuild output — run `npm run build` before building)
  js_group = project.main_group.new_group('extension', '../extension')
  %w[manifest.json content.js background.js].each do |name|
    ext.resources_build_phase.add_file_reference(js_group.new_file(name))
  end

  shared = {
    # The JS resources make coremlc mis-detect the target language as TypeScript
    'COREML_CODEGEN_LANGUAGE' => 'Swift',
    'CURRENT_PROJECT_VERSION' => '2',
    'ENABLE_APP_SANDBOX' => 'YES',
    'ENABLE_HARDENED_RUNTIME' => 'YES',
    'ENABLE_USER_SELECTED_FILES' => 'readonly',
    'GENERATE_INFOPLIST_FILE' => 'YES',
    'INFOPLIST_FILE' => "#{EXT_NAME}/Info.plist",
    'INFOPLIST_KEY_CFBundleDisplayName' => 'CleanBrowse Extension',
    'INFOPLIST_KEY_NSHumanReadableCopyright' => '',
    'LD_RUNPATH_SEARCH_PATHS' => [
      '$(inherited)',
      '@executable_path/../Frameworks',
      '@executable_path/../../../../Frameworks',
    ],
    'MACOSX_DEPLOYMENT_TARGET' => MACOS_TARGET,
    'MARKETING_VERSION' => '1.2.0',
    'OTHER_LDFLAGS' => ['-framework', 'SafariServices'],
    'PRODUCT_BUNDLE_IDENTIFIER' => EXT_BUNDLE_ID,
    'PRODUCT_NAME' => '$(TARGET_NAME)',
    'SKIP_INSTALL' => 'YES',
    'STRING_CATALOG_GENERATE_SYMBOLS' => 'YES',
    'SWIFT_APPROACHABLE_CONCURRENCY' => 'YES',
    'SWIFT_EMIT_LOC_STRINGS' => 'YES',
    'SWIFT_UPCOMING_FEATURE_MEMBER_IMPORT_VISIBILITY' => 'YES',
    'SWIFT_VERSION' => '5.0',
  }
  ext.build_configurations.each do |config|
    config.build_settings.merge!(shared)
    if config.name == 'Debug'
      config.build_settings.merge!(
        'CODE_SIGN_STYLE' => 'Automatic',
        'CODE_SIGN_IDENTITY' => 'Apple Development',
        'DEVELOPMENT_TEAM' => TEAM,
      )
    else # Release — same manual Developer ID pattern as the other targets
      config.build_settings.merge!(
        'CODE_SIGN_STYLE' => 'Manual',
        'CODE_SIGN_IDENTITY' => 'Apple Development',
        'CODE_SIGN_IDENTITY[sdk=macosx*]' => 'Developer ID Application',
        'DEVELOPMENT_TEAM' => '',
        'DEVELOPMENT_TEAM[sdk=macosx*]' => TEAM,
        'PROVISIONING_PROFILE_SPECIFIER' => '',
      )
    end
  end
end

# ── BlurShieldKit local package + product dependency ─────────────────────
unless project.root_object.package_references.any? { |r| r.respond_to?(:relative_path) && r.relative_path == '../BlurShieldKit' }
  pkg = project.new(Xcodeproj::Project::Object::XCLocalSwiftPackageReference)
  pkg.relative_path = '../BlurShieldKit'
  project.root_object.package_references << pkg
end
unless ext.package_product_dependencies.any? { |d| d.product_name == 'BlurShieldKit' }
  dep = project.new(Xcodeproj::Project::Object::XCSwiftPackageProductDependency)
  dep.product_name = 'BlurShieldKit'
  ext.package_product_dependencies << dep
  build_file = project.new(Xcodeproj::Project::Object::PBXBuildFile)
  build_file.product_ref = dep
  ext.frameworks_build_phase.files << build_file
end

# ── embed the appex in the app ────────────────────────────────────────────
app.add_dependency(ext) unless app.dependencies.any? { |d| d.target == ext }
embed = app.copy_files_build_phases.find { |p| p.name == 'Embed Foundation Extensions' } \
  or abort 'Embed Foundation Extensions phase not found'
unless embed.files_references.include?(ext.product_reference)
  build_file = embed.add_file_reference(ext.product_reference)
  build_file.settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
end

project.save

# ── shared scheme for the extension target (packages only resolve in scheme
# builds, and the CleanBrowse scheme's post-action dittos to /Applications) ──
scheme_path = Xcodeproj::XCScheme.shared_data_dir(project.path) + "#{EXT_NAME}.xcscheme"
unless File.exist?(scheme_path)
  scheme = Xcodeproj::XCScheme.new
  scheme.add_build_target(ext)
  scheme.save_as(project.path, EXT_NAME, true)
end

puts "added: #{EXT_NAME} (handler + model + extension JS + BlurShieldKit), embedded in CleanBrowse.app"
