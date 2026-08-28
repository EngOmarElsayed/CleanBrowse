// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "BlurShieldKit",
    platforms: [.macOS(.v14)],
    products: [.library(name: "BlurShieldKit", targets: ["BlurShieldKit"])],
    targets: [.target(name: "BlurShieldKit")]
)
