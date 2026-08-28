import type { Locale } from "./config";

const en = {
  meta: {
    title: "CleanBrowse — Free Adult Content Blocker & NSFW Image Blur for macOS",
    description:
      "A free macOS menu bar app that blocks adult content at the DNS level and blurs NSFW images in Safari with on-device AI — on Google, social media, and streaming platforms like Netflix. In six languages, with configurable SafeSearch. Made by Omar Elsayed.",
    keywords: [
      "adult content blocker macOS",
      "NSFW image blur",
      "Safari extension",
      "blur explicit images",
      "SafeSearch enforcement",
      "DNS content filter",
      "parental controls Mac",
    ],
  },
  nav: {
    whatsNew: "What's new",
    blur: "Image blur",
    how: "How it works",
    roadmap: "Roadmap",
    maker: "About",
    contact: "Contact",
    download: "Download",
    downloadForMac: "Download for macOS",
    viewOnGitHub: "View on GitHub",
    language: "Language",
  },
  hero: {
    badge: "New in 1.3.0 — Safari now blurs explicit images",
    title: "The internet, minus the worst of it",
    titlePunct: ".",
    subtitle:
      "CleanBrowse lives in your Mac's menu bar and blocks adult content at the DNS level — in every browser, in every app. And in Safari, it now blurs explicit images before you ever see them. Free, private, in your language.",
    ctaNote: "Free forever · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "domains blocked",
    statRegionsValue: "190+",
    statRegions: "SafeSearch regions",
    statDataValue: "0",
    statData: "browsing data collected",
    chipProtected: "Protected",
    chipSafeSearch: "SafeSearch",
    chipEnforced: "Enforced",
    screenshotAlt:
      "The CleanBrowse menu bar popover showing protection enabled and the Configure Safe Search panel with per-engine toggles",
  },
  dns: {
    eyebrow: "Under the hood",
    title: "Every DNS query on your Mac, answered the right way.",
    body: "CleanBrowse sits between your Mac and the internet. Adult domains never resolve, search engines are locked to their safe endpoints, and everything else passes through untouched — with no measurable slowdown.",
    adult: "Adult content",
    adultResult: "NXDOMAIN",
    search: "Search engines",
    searchResult: "SafeSearch endpoints",
    other: "Everything else",
    otherResult: "resolves normally",
    srNote:
      "Simulated DNS query log: adult domains resolve to NXDOMAIN, search engines are rewritten to their SafeSearch endpoints, and everything else resolves normally.",
  },
  blur: {
    eyebrow: "New — Safari extension",
    title: "Explicit images, blurred before you see them.",
    intro:
      "Blocking sites isn't enough — explicit images hide on pages you actually use. The new Safari extension classifies every image and video frame with on-device machine learning, and blurs anything explicit before it's rendered.",
    points: [
      {
        title: "Blur first, reveal later",
        body: "Every image starts blurred and is only revealed once the model clears it. Video frames are checked while they play, so explicit scenes are caught mid-stream.",
      },
      {
        title: "Everywhere Safari goes",
        body: "Google Images, social media feeds, streaming platforms like Netflix — if Safari can show it, the filter has already checked it.",
      },
      {
        title: "Private by design",
        body: "Classification runs entirely on your Mac with Core ML. No image, no URL, no pixel ever leaves your machine — and anything that can't be checked stays blurred.",
      },
    ],
    chips: ["Google Images", "Social media", "Netflix & streaming"],
    demoBadge: "Core ML · on-device",
    demoBlurred: "Blurred",
    demoNote:
      "Illustration of Safari image results: explicit images appear blurred while safe images stay visible.",
  },
  whatsNew: {
    eyebrow: "New in version 1.3.0",
    title: "The blocker just learned to see.",
    intro:
      "CleanBrowse 1.3.0 adds a fourth layer of protection — a Safari extension that blurs NSFW images using on-device machine learning — and makes the app easier to manage and update from the menu bar.",
    blurTitle: "NSFW image blur in Safari",
    blurBody:
      "The headline feature of 1.3.0: images and video frames are classified on-device and blurred before they reach your screen — on search, social media, and streaming sites.",
    blurTag: "Blurred",
    menuTitle: "One click from the menu bar",
    menuBody:
      "A new shortcut in the popover takes you straight to Safari's extension settings, so turning the image filter on takes seconds.",
    updateTitle: "Updates from the settings panel",
    updateBody:
      "Check for new versions right inside CleanBrowse — new protections reach you the moment they ship, no re-downloading from the site.",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "How it works",
    title: "Four layers. No way around them.",
    intro:
      "Browser extensions can be uninstalled and settings can be reset. CleanBrowse works below all of that — at the system level — so the protection holds everywhere. And in Safari, a fourth layer catches what a blocklist never could.",
    layerLabel: "Layer",
    layers: [
      {
        title: "Hosts file blocking",
        body: "Over 249,000 known adult domains are redirected to localhost through the system hosts file — the first wall, and it covers every application on your Mac.",
      },
      {
        title: "System-wide DNS proxy",
        body: "A local DNS proxy inspects every query type — including encrypted DNS — and answers NXDOMAIN for anything on the blocklist. What can't resolve can't load.",
      },
      {
        title: "Enforced SafeSearch",
        body: "Google, YouTube, Bing, and DuckDuckGo are pinned to their SafeSearch endpoints at the IP level, across 190+ country domains. Search results stay clean too.",
      },
      {
        title: "On-device image blur",
        body: "A Safari extension classifies every image and video frame with on-device machine learning and blurs explicit content before it's rendered — even on sites no blocklist would ever block.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "We count clicks, not people.",
    body: "Your browsing never leaves your Mac — every site you visit, every DNS query, every blocked domain stays on your machine. The only thing CleanBrowse shares is an anonymous tally of feature usage through Aptabase, a privacy-first, open-source analytics service. It tells the maker which features matter — and nothing about who you are.",
    stayTitle: "Stays on your Mac",
    stayPoints: [
      "Every site you visit",
      "Every DNS query and blocked domain",
      "All of your settings",
    ],
    countTitle: "Counted anonymously",
    countPoints: [
      "Which features get used",
      "App and macOS version",
      "Nothing that can identify you",
    ],
    note: "No identifiers, no profiles, no cookies — nothing can be traced back to you.",
    linkLabel: "How Aptabase handles data",
  },
  maker: {
    eyebrow: "From the maker",
    quote:
      "“Everyone should have the tools to protect themselves and their loved ones online — without a subscription, and without handing their data to anyone.”",
    body: "CleanBrowse is built and maintained by one person, and it's completely free. No accounts, no tracking of your browsing — what you do online never leaves your Mac.",
    name: "Omar Elsayed",
    role: "Creator of CleanBrowse",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Version 1.3.0 is just the start.",
    items: [
      {
        title: "Custom DNS resolver",
        body: "Choose the upstream DNS you trust — Cloudflare 1.1.1.1, Google, or any resolver you like.",
        status: "Coming soon",
        active: true,
      },
      {
        title: "Protect me from myself",
        body: "Lock your own settings so protection can't be switched off in a weak moment.",
        status: "In development",
        active: true,
      },
      {
        title: "Import any blocklist",
        body: "Bring your own lists — import any blocklist and CleanBrowse enforces it system-wide.",
        status: "Planned",
        active: false,
      },
      {
        title: "Blocked-domain explorer",
        body: "Browse everything CleanBrowse blocks, and instantly check whether a domain is on the list.",
        status: "Planned",
        active: false,
      },
    ],
  },
  cta: {
    title: "Ready for a cleaner internet?",
    body: "Download CleanBrowse 1.3.0 for free — or leave your email and hear about new features first.",
  },
  signup: {
    placeholder: "Enter your email",
    button: "Notify me",
    sending: "Sending...",
    success: "You're on the list!",
    error: "Something went wrong. Try again.",
  },
  footer: {
    taglinePre: "A free, system-level adult content blocker for macOS. Designed and built by",
    taglinePost: ".",
    rights: "All rights reserved.",
    motto: "Free forever · No accounts · No personal data",
  },
  contact: {
    metaTitle: "Contact — CleanBrowse",
    metaDescription: "Get in touch with Omar Elsayed, the maker of CleanBrowse.",
    eyebrow: "Contact",
    title: "Say hello.",
    body: "Questions, feedback, or a feature you'd love to see? Every message goes straight to the maker.",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Your message",
    send: "Send message",
    sending: "Sending...",
    error: "Something went wrong. Please try again.",
    successTitle: "Message sent",
    successBody: "Thanks for reaching out. You'll hear back soon.",
    sendAnother: "Send another message",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  meta: {
    title: "CleanBrowse — حاجب مجاني للمحتوى الإباحي وتمويه الصور غير اللائقة لنظام macOS",
    description:
      "تطبيق مجاني في شريط قوائم macOS يحجب المحتوى الإباحي على مستوى DNS ويموّه الصور غير اللائقة في Safari بذكاء اصطناعي يعمل على جهازك — في Google وشبكات التواصل ومنصات البث مثل Netflix. بست لغات وبحث آمن قابل للتخصيص. من تطوير عمر السيد.",
    keywords: [
      "حاجب المحتوى الإباحي macOS",
      "تمويه الصور غير اللائقة",
      "ملحق Safari",
      "تمويه الصور الفاضحة",
      "فرض البحث الآمن",
      "فلترة DNS",
      "الرقابة الأبوية على Mac",
    ],
  },
  nav: {
    whatsNew: "الجديد",
    blur: "تمويه الصور",
    how: "كيف يعمل",
    roadmap: "خارطة الطريق",
    maker: "حول",
    contact: "تواصل",
    download: "تحميل",
    downloadForMac: "تحميل لنظام macOS",
    viewOnGitHub: "شاهده على GitHub",
    language: "اللغة",
  },
  hero: {
    badge: "جديد في 1.3.0 — Safari يموّه الصور غير اللائقة الآن",
    title: "الإنترنت، من دون أسوأ ما فيه",
    titlePunct: ".",
    subtitle:
      "يعيش CleanBrowse في شريط قوائم جهاز Mac ويحجب المحتوى الإباحي على مستوى DNS — في كل متصفح وكل تطبيق. وفي Safari، يموّه الآن الصور غير اللائقة قبل أن تراها. مجاني، خاص، وبلغتك.",
    ctaNote: "مجاني للأبد · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "نطاق محجوب",
    statRegionsValue: "190+",
    statRegions: "منطقة للبحث الآمن",
    statDataValue: "0",
    statData: "بيانات تصفح مُجمَّعة",
    chipProtected: "محمي",
    chipSafeSearch: "البحث الآمن",
    chipEnforced: "مفعّل",
    screenshotAlt:
      "نافذة CleanBrowse في شريط القوائم تُظهر الحماية مفعّلة ولوحة إعداد البحث الآمن مع مفاتيح لكل محرك",
  },
  dns: {
    eyebrow: "خلف الكواليس",
    title: "كل استعلام DNS على جهازك، يُجاب بالطريقة الصحيحة.",
    body: "يقف CleanBrowse بين جهازك والإنترنت. النطاقات الإباحية لا تُحلّ أبدًا، ومحركات البحث مقيّدة بنقاطها الآمنة، وكل ما عدا ذلك يمر دون أي تدخل — وبلا أي بطء ملحوظ.",
    adult: "المحتوى الإباحي",
    adultResult: "NXDOMAIN",
    search: "محركات البحث",
    searchResult: "نقاط البحث الآمن",
    other: "كل شيء آخر",
    otherResult: "يُحلّ بشكل طبيعي",
    srNote:
      "سجل استعلامات DNS تجريبي: النطاقات الإباحية تُجاب بـ NXDOMAIN، ومحركات البحث تُعاد كتابتها إلى نقاط البحث الآمن، وكل ما عدا ذلك يُحلّ بشكل طبيعي.",
  },
  blur: {
    eyebrow: "جديد — ملحق Safari",
    title: "الصور غير اللائقة، تُموَّه قبل أن تراها.",
    intro:
      "حجب المواقع لا يكفي — فالصور غير اللائقة تختبئ في صفحات تستخدمها فعلًا. ملحق Safari الجديد يصنّف كل صورة وكل إطار فيديو بتعلّم آلي يعمل على جهازك، ويموّه أي محتوى فاضح قبل أن يُعرض.",
    points: [
      {
        title: "التمويه أولًا، ثم الكشف",
        body: "كل صورة تبدأ مموّهة ولا تُكشف إلا بعد أن يجيزها النموذج. وتُفحص إطارات الفيديو أثناء التشغيل، فتُلتقط المشاهد الفاضحة في منتصف البث.",
      },
      {
        title: "أينما ذهب Safari",
        body: "صور Google، وخلاصات شبكات التواصل، ومنصات البث مثل Netflix — إن كان Safari قادرًا على عرضه، فالمرشّح قد فحصه مسبقًا.",
      },
      {
        title: "خصوصية في التصميم",
        body: "يعمل التصنيف بالكامل على جهازك عبر Core ML. لا صورة ولا رابط ولا بكسل يغادر جهازك — وكل ما يتعذّر فحصه يبقى مموّهًا.",
      },
    ],
    chips: ["صور Google", "شبكات التواصل", "Netflix ومنصات البث"],
    demoBadge: "Core ML · على الجهاز",
    demoBlurred: "مموّهة",
    demoNote:
      "رسم توضيحي لنتائج الصور في Safari: تظهر الصور الفاضحة مموّهة بينما تبقى الصور الآمنة ظاهرة.",
  },
  whatsNew: {
    eyebrow: "الجديد في الإصدار 1.3.0",
    title: "الحاجب تعلّم أن يرى.",
    intro:
      "يضيف الإصدار 1.3.0 من CleanBrowse طبقة حماية رابعة — ملحق Safari يموّه الصور غير اللائقة بتعلّم آلي يعمل على جهازك — ويجعل إدارة التطبيق وتحديثه من شريط القوائم أسهل من أي وقت مضى.",
    blurTitle: "تمويه الصور غير اللائقة في Safari",
    blurBody:
      "الميزة الأبرز في 1.3.0: تُصنَّف الصور وإطارات الفيديو على جهازك وتُموَّه قبل أن تصل إلى شاشتك — في البحث وشبكات التواصل ومواقع البث.",
    blurTag: "مموّهة",
    menuTitle: "نقرة واحدة من شريط القوائم",
    menuBody:
      "اختصار جديد في النافذة ينقلك مباشرة إلى إعدادات ملحقات Safari، فتفعيل مرشّح الصور يستغرق ثوانٍ.",
    updateTitle: "التحديثات من لوحة الإعدادات",
    updateBody:
      "تحقق من الإصدارات الجديدة من داخل CleanBrowse مباشرة — تصلك وسائل الحماية الجديدة فور صدورها، دون إعادة التنزيل من الموقع.",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "كيف يعمل",
    title: "أربع طبقات. لا سبيل لتجاوزها.",
    intro:
      "إضافات المتصفح يمكن حذفها، والإعدادات يمكن إعادة ضبطها. يعمل CleanBrowse تحت كل ذلك — على مستوى النظام — فتبقى الحماية قائمة في كل مكان. وفي Safari، طبقة رابعة تلتقط ما لا تستطيع قوائم الحجب التقاطه.",
    layerLabel: "الطبقة",
    layers: [
      {
        title: "الحجب عبر ملف hosts",
        body: "أكثر من 249,000 نطاق إباحي معروف يُعاد توجيهها إلى localhost عبر ملف hosts في النظام — الجدار الأول، ويغطي كل تطبيق على جهازك.",
      },
      {
        title: "وكيل DNS على مستوى النظام",
        body: "وكيل DNS محلي يفحص كل أنواع الاستعلامات — بما فيها DNS المشفّر — ويرد بـ NXDOMAIN على كل ما في قائمة الحجب. ما لا يُحلّ لا يمكن تحميله.",
      },
      {
        title: "فرض البحث الآمن",
        body: "تُثبَّت Google وYouTube وBing وDuckDuckGo على نقاط البحث الآمن على مستوى IP، عبر أكثر من 190 نطاقًا إقليميًا. نتائج البحث تبقى نظيفة أيضًا.",
      },
      {
        title: "تمويه الصور على الجهاز",
        body: "ملحق Safari يصنّف كل صورة وكل إطار فيديو بتعلّم آلي يعمل على جهازك ويموّه المحتوى الفاضح قبل عرضه — حتى في المواقع التي لن تحجبها أي قائمة.",
      },
    ],
  },
  privacy: {
    eyebrow: "الخصوصية",
    title: "نحصي النقرات، لا الأشخاص.",
    body: "تصفحك لا يغادر جهازك أبدًا — كل موقع تزوره، وكل استعلام DNS، وكل نطاق محجوب يبقى على جهازك. الشيء الوحيد الذي يشاركه CleanBrowse هو إحصاء مجهول الهوية لاستخدام الميزات عبر Aptabase، وهي خدمة تحليلات مفتوحة المصدر تُعلي الخصوصية. يخبر هذا الإحصاء صانع التطبيق أي الميزات تهمك — ولا شيء عن هويتك.",
    stayTitle: "يبقى على جهازك",
    stayPoints: [
      "كل موقع تزوره",
      "كل استعلام DNS وكل نطاق محجوب",
      "جميع إعداداتك",
    ],
    countTitle: "يُحصى بشكل مجهول",
    countPoints: [
      "أي الميزات تُستخدم",
      "إصدار التطبيق وإصدار macOS",
      "لا شيء يمكن أن يكشف هويتك",
    ],
    note: "بلا مُعرِّفات، بلا ملفات تعريف، بلا كوكيز — لا شيء يمكن تتبعه وصولًا إليك.",
    linkLabel: "كيف يتعامل Aptabase مع البيانات",
  },
  maker: {
    eyebrow: "من صانع التطبيق",
    quote:
      "«يجب أن يمتلك الجميع الأدوات لحماية أنفسهم وأحبائهم على الإنترنت — من دون اشتراك، ومن دون تسليم بياناتهم لأي جهة.»",
    body: "‏CleanBrowse من تطوير وصيانة شخص واحد، وهو مجاني بالكامل. لا حسابات، ولا تتبع لتصفحك — ما تفعله على الإنترنت لا يغادر جهازك أبدًا.",
    name: "عمر السيد",
    role: "صانع CleanBrowse",
  },
  roadmap: {
    eyebrow: "خارطة الطريق",
    title: "الإصدار 1.3.0 مجرد البداية.",
    items: [
      {
        title: "خادم DNS مخصص",
        body: "اختر خادم DNS الذي تثق به — Cloudflare 1.1.1.1 أو Google أو أي خادم تفضّله.",
        status: "قريبًا",
        active: true,
      },
      {
        title: "احمِني من نفسي",
        body: "اقفل إعداداتك بنفسك حتى لا يمكن إيقاف الحماية في لحظة ضعف.",
        status: "قيد التطوير",
        active: true,
      },
      {
        title: "استيراد أي قائمة حجب",
        body: "أحضر قوائمك الخاصة — استورد أي قائمة حجب وسيفرضها CleanBrowse على مستوى النظام.",
        status: "مخطط له",
        active: false,
      },
      {
        title: "استعراض النطاقات المحجوبة",
        body: "تصفّح كل ما يحجبه CleanBrowse، وتحقق فورًا مما إذا كان نطاق ما ضمن القائمة.",
        status: "مخطط له",
        active: false,
      },
    ],
  },
  cta: {
    title: "جاهز لإنترنت أنظف؟",
    body: "حمّل CleanBrowse 1.3.0 مجانًا — أو اترك بريدك الإلكتروني لتكون أول من يعرف بالميزات الجديدة.",
  },
  signup: {
    placeholder: "أدخل بريدك الإلكتروني",
    button: "أعلمني",
    sending: "جارٍ الإرسال...",
    success: "أنت على القائمة!",
    error: "حدث خطأ ما. حاول مرة أخرى.",
  },
  footer: {
    taglinePre: "حاجب مجاني للمحتوى الإباحي على مستوى النظام لنظام macOS. صمّمه وطوّره",
    taglinePost: ".",
    rights: "جميع الحقوق محفوظة.",
    motto: "مجاني للأبد · بلا حسابات · بلا بيانات شخصية",
  },
  contact: {
    metaTitle: "تواصل — CleanBrowse",
    metaDescription: "تواصل مع عمر السيد، صانع CleanBrowse.",
    eyebrow: "تواصل",
    title: "قل مرحبًا.",
    body: "أسئلة أو ملاحظات أو ميزة تودّ رؤيتها؟ كل رسالة تصل مباشرة إلى صانع التطبيق.",
    namePlaceholder: "اسمك",
    emailPlaceholder: "بريدك الإلكتروني",
    messagePlaceholder: "رسالتك",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال...",
    error: "حدث خطأ ما. حاول مرة أخرى.",
    successTitle: "تم إرسال الرسالة",
    successBody: "شكرًا لتواصلك. سنرد عليك قريبًا.",
    sendAnother: "إرسال رسالة أخرى",
  },
};

const fr: Dictionary = {
  meta: {
    title: "CleanBrowse — Bloqueur gratuit de contenu adulte et floutage d'images NSFW pour macOS",
    description:
      "Une app gratuite dans la barre de menus de macOS qui bloque le contenu adulte au niveau DNS et floute les images NSFW dans Safari grâce à une IA locale — sur Google, les réseaux sociaux et les plateformes de streaming comme Netflix. En six langues, avec SafeSearch configurable. Créée par Omar Elsayed.",
    keywords: [
      "bloqueur de contenu adulte macOS",
      "floutage d'images NSFW",
      "extension Safari",
      "flouter les images explicites",
      "SafeSearch",
      "filtrage DNS",
      "contrôle parental Mac",
    ],
  },
  nav: {
    whatsNew: "Nouveautés",
    blur: "Floutage d'images",
    how: "Fonctionnement",
    roadmap: "Feuille de route",
    maker: "À propos",
    contact: "Contact",
    download: "Télécharger",
    downloadForMac: "Télécharger pour macOS",
    viewOnGitHub: "Voir sur GitHub",
    language: "Langue",
  },
  hero: {
    badge: "Nouveau en 1.3.0 — Safari floute désormais les images explicites",
    title: "Internet, sans ce qu'il a de pire",
    titlePunct: ".",
    subtitle:
      "CleanBrowse vit dans la barre de menus de votre Mac et bloque le contenu adulte au niveau DNS — dans chaque navigateur, dans chaque app. Et dans Safari, il floute désormais les images explicites avant même que vous les voyiez. Gratuit, privé, dans votre langue.",
    ctaNote: "Gratuit pour toujours · macOS 14+",
    statDomainsValue: "249 000+",
    statDomains: "domaines bloqués",
    statRegionsValue: "190+",
    statRegions: "régions SafeSearch",
    statDataValue: "0",
    statData: "donnée de navigation collectée",
    chipProtected: "Protégé",
    chipSafeSearch: "SafeSearch",
    chipEnforced: "Activé",
    screenshotAlt:
      "La fenêtre CleanBrowse dans la barre de menus montrant la protection active et le panneau de configuration SafeSearch avec un réglage par moteur",
  },
  dns: {
    eyebrow: "Sous le capot",
    title: "Chaque requête DNS de votre Mac reçoit la bonne réponse.",
    body: "CleanBrowse se place entre votre Mac et Internet. Les domaines adultes ne se résolvent jamais, les moteurs de recherche sont verrouillés sur leurs points d'accès sécurisés, et tout le reste passe sans être touché — sans aucun ralentissement mesurable.",
    adult: "Contenu adulte",
    adultResult: "NXDOMAIN",
    search: "Moteurs de recherche",
    searchResult: "points d'accès SafeSearch",
    other: "Tout le reste",
    otherResult: "se résout normalement",
    srNote:
      "Journal DNS simulé : les domaines adultes se résolvent en NXDOMAIN, les moteurs de recherche sont réécrits vers leurs points d'accès SafeSearch, et tout le reste se résout normalement.",
  },
  blur: {
    eyebrow: "Nouveau — Extension Safari",
    title: "Les images explicites, floutées avant que vous les voyiez.",
    intro:
      "Bloquer des sites ne suffit pas — les images explicites se cachent sur des pages que vous utilisez vraiment. La nouvelle extension Safari classe chaque image et chaque frame vidéo grâce à l'apprentissage automatique local, et floute tout contenu explicite avant son affichage.",
    points: [
      {
        title: "Flouter d'abord, révéler ensuite",
        body: "Chaque image démarre floutée et n'est révélée qu'une fois validée par le modèle. Les frames vidéo sont vérifiées pendant la lecture — les scènes explicites sont interceptées en plein flux.",
      },
      {
        title: "Partout où va Safari",
        body: "Google Images, les fils des réseaux sociaux, les plateformes de streaming comme Netflix — si Safari peut l'afficher, le filtre l'a déjà vérifié.",
      },
      {
        title: "Privé par conception",
        body: "La classification s'exécute entièrement sur votre Mac avec Core ML. Aucune image, aucune URL, aucun pixel ne quitte votre machine — et ce qui ne peut pas être vérifié reste flouté.",
      },
    ],
    chips: ["Google Images", "Réseaux sociaux", "Netflix & streaming"],
    demoBadge: "Core ML · en local",
    demoBlurred: "Floutée",
    demoNote:
      "Illustration de résultats d'images Safari : les images explicites apparaissent floutées tandis que les images sûres restent visibles.",
  },
  whatsNew: {
    eyebrow: "Nouveau dans la version 1.3.0",
    title: "Le bloqueur a appris à voir.",
    intro:
      "CleanBrowse 1.3.0 ajoute une quatrième couche de protection — une extension Safari qui floute les images NSFW grâce à l'apprentissage automatique local — et simplifie plus que jamais la gestion et la mise à jour de l'app depuis la barre de menus.",
    blurTitle: "Floutage d'images NSFW dans Safari",
    blurBody:
      "La fonctionnalité phare de la 1.3.0 : les images et les frames vidéo sont classées en local et floutées avant d'atteindre votre écran — sur la recherche, les réseaux sociaux et les sites de streaming.",
    blurTag: "Floutée",
    menuTitle: "Un clic depuis la barre de menus",
    menuBody:
      "Un nouveau raccourci dans la fenêtre vous amène directement aux réglages des extensions Safari — activer le filtre d'images prend quelques secondes.",
    updateTitle: "Mises à jour depuis les réglages",
    updateBody:
      "Vérifiez les nouvelles versions directement dans CleanBrowse — les nouvelles protections vous parviennent dès leur sortie, sans retélécharger depuis le site.",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "Fonctionnement",
    title: "Quatre couches. Aucun moyen de les contourner.",
    intro:
      "Les extensions de navigateur peuvent être désinstallées et les réglages réinitialisés. CleanBrowse agit en dessous de tout cela — au niveau du système — pour une protection qui tient partout. Et dans Safari, une quatrième couche attrape ce qu'aucune liste de blocage ne pourrait attraper.",
    layerLabel: "Couche",
    layers: [
      {
        title: "Blocage par fichier hosts",
        body: "Plus de 249 000 domaines adultes connus sont redirigés vers localhost via le fichier hosts du système — le premier rempart, qui couvre chaque application de votre Mac.",
      },
      {
        title: "Proxy DNS à l'échelle du système",
        body: "Un proxy DNS local inspecte chaque type de requête — DNS chiffré compris — et répond NXDOMAIN pour tout ce qui figure sur la liste de blocage. Ce qui ne se résout pas ne peut pas se charger.",
      },
      {
        title: "SafeSearch imposé",
        body: "Google, YouTube, Bing et DuckDuckGo sont verrouillés sur leurs points d'accès SafeSearch au niveau IP, sur plus de 190 domaines nationaux. Les résultats de recherche restent propres aussi.",
      },
      {
        title: "Floutage d'images en local",
        body: "Une extension Safari classe chaque image et chaque frame vidéo grâce à l'apprentissage automatique local et floute le contenu explicite avant son affichage — même sur des sites qu'aucune liste ne bloquerait.",
      },
    ],
  },
  privacy: {
    eyebrow: "Confidentialité",
    title: "Nous comptons des clics, pas des personnes.",
    body: "Votre navigation ne quitte jamais votre Mac — chaque site visité, chaque requête DNS, chaque domaine bloqué reste sur votre machine. La seule chose que CleanBrowse partage, c'est un décompte anonyme de l'utilisation des fonctionnalités via Aptabase, un service d'analyse open source qui respecte la vie privée. Il indique au créateur quelles fonctionnalités comptent — et rien sur qui vous êtes.",
    stayTitle: "Reste sur votre Mac",
    stayPoints: [
      "Chaque site que vous visitez",
      "Chaque requête DNS et domaine bloqué",
      "Tous vos réglages",
    ],
    countTitle: "Compté anonymement",
    countPoints: [
      "Les fonctionnalités utilisées",
      "La version de l'app et de macOS",
      "Rien qui puisse vous identifier",
    ],
    note: "Pas d'identifiants, pas de profils, pas de cookies — rien ne peut remonter jusqu'à vous.",
    linkLabel: "Comment Aptabase traite les données",
  },
  maker: {
    eyebrow: "Le mot du créateur",
    quote:
      "« Chacun devrait avoir les outils pour se protéger, soi et ses proches, en ligne — sans abonnement, et sans confier ses données à qui que ce soit. »",
    body: "CleanBrowse est développé et maintenu par une seule personne, et il est entièrement gratuit. Pas de compte, aucun pistage de votre navigation — ce que vous faites en ligne ne quitte jamais votre Mac.",
    name: "Omar Elsayed",
    role: "Créateur de CleanBrowse",
  },
  roadmap: {
    eyebrow: "Feuille de route",
    title: "La version 1.3.0 n'est que le début.",
    items: [
      {
        title: "Résolveur DNS personnalisé",
        body: "Choisissez le DNS en amont de confiance — Cloudflare 1.1.1.1, Google ou tout autre résolveur.",
        status: "Bientôt",
        active: true,
      },
      {
        title: "Protégez-moi de moi-même",
        body: "Verrouillez vos propres réglages pour que la protection ne puisse pas être désactivée dans un moment de faiblesse.",
        status: "En développement",
        active: true,
      },
      {
        title: "Importer n'importe quelle liste de blocage",
        body: "Apportez vos propres listes — importez n'importe quelle liste de blocage et CleanBrowse l'applique à l'échelle du système.",
        status: "Prévu",
        active: false,
      },
      {
        title: "Explorateur de domaines bloqués",
        body: "Parcourez tout ce que CleanBrowse bloque et vérifiez instantanément si un domaine figure sur la liste.",
        status: "Prévu",
        active: false,
      },
    ],
  },
  cta: {
    title: "Prêt pour un Internet plus propre ?",
    body: "Téléchargez CleanBrowse 1.3.0 gratuitement — ou laissez votre e-mail pour être informé des nouveautés en premier.",
  },
  signup: {
    placeholder: "Votre adresse e-mail",
    button: "Prévenez-moi",
    sending: "Envoi...",
    success: "Vous êtes sur la liste !",
    error: "Une erreur est survenue. Réessayez.",
  },
  footer: {
    taglinePre:
      "Un bloqueur gratuit de contenu adulte au niveau système pour macOS. Conçu et développé par",
    taglinePost: ".",
    rights: "Tous droits réservés.",
    motto: "Gratuit pour toujours · Sans compte · Aucune donnée personnelle",
  },
  contact: {
    metaTitle: "Contact — CleanBrowse",
    metaDescription: "Contactez Omar Elsayed, le créateur de CleanBrowse.",
    eyebrow: "Contact",
    title: "Dites bonjour.",
    body: "Des questions, des retours, ou une fonctionnalité que vous aimeriez voir ? Chaque message arrive directement au créateur.",
    namePlaceholder: "Votre nom",
    emailPlaceholder: "Votre e-mail",
    messagePlaceholder: "Votre message",
    send: "Envoyer le message",
    sending: "Envoi...",
    error: "Une erreur est survenue. Réessayez.",
    successTitle: "Message envoyé",
    successBody: "Merci de nous avoir écrit. Vous aurez une réponse bientôt.",
    sendAnother: "Envoyer un autre message",
  },
};

const es: Dictionary = {
  meta: {
    title: "CleanBrowse — Bloqueador gratuito de contenido adulto y difuminado de imágenes NSFW para macOS",
    description:
      "Una app gratuita en la barra de menús de macOS que bloquea el contenido adulto a nivel de DNS y difumina imágenes NSFW en Safari con IA local — en Google, redes sociales y plataformas de streaming como Netflix. En seis idiomas y con SafeSearch configurable. Creada por Omar Elsayed.",
    keywords: [
      "bloqueador de contenido adulto macOS",
      "difuminar imágenes NSFW",
      "extensión de Safari",
      "difuminar imágenes explícitas",
      "SafeSearch",
      "filtrado DNS",
      "control parental Mac",
    ],
  },
  nav: {
    whatsNew: "Novedades",
    blur: "Difuminado de imágenes",
    how: "Cómo funciona",
    roadmap: "Hoja de ruta",
    maker: "Acerca de",
    contact: "Contacto",
    download: "Descargar",
    downloadForMac: "Descargar para macOS",
    viewOnGitHub: "Ver en GitHub",
    language: "Idioma",
  },
  hero: {
    badge: "Nuevo en 1.3.0 — Safari ahora difumina las imágenes explícitas",
    title: "Internet, sin lo peor que tiene",
    titlePunct: ".",
    subtitle:
      "CleanBrowse vive en la barra de menús de tu Mac y bloquea el contenido adulto a nivel de DNS — en cada navegador, en cada app. Y en Safari, ahora difumina las imágenes explícitas antes de que las veas. Gratis, privado y en tu idioma.",
    ctaNote: "Gratis para siempre · macOS 14+",
    statDomainsValue: "249.000+",
    statDomains: "dominios bloqueados",
    statRegionsValue: "190+",
    statRegions: "regiones con SafeSearch",
    statDataValue: "0",
    statData: "datos de navegación recopilados",
    chipProtected: "Protegido",
    chipSafeSearch: "SafeSearch",
    chipEnforced: "Activado",
    screenshotAlt:
      "La ventana de CleanBrowse en la barra de menús mostrando la protección activada y el panel de configuración de SafeSearch con interruptores por buscador",
  },
  dns: {
    eyebrow: "Bajo el capó",
    title: "Cada consulta DNS de tu Mac, respondida como debe ser.",
    body: "CleanBrowse se sitúa entre tu Mac e Internet. Los dominios adultos nunca se resuelven, los buscadores quedan fijados a sus puntos seguros, y todo lo demás pasa intacto — sin ninguna ralentización apreciable.",
    adult: "Contenido adulto",
    adultResult: "NXDOMAIN",
    search: "Buscadores",
    searchResult: "puntos de SafeSearch",
    other: "Todo lo demás",
    otherResult: "se resuelve con normalidad",
    srNote:
      "Registro DNS simulado: los dominios adultos se resuelven como NXDOMAIN, los buscadores se reescriben hacia sus puntos de SafeSearch y todo lo demás se resuelve con normalidad.",
  },
  blur: {
    eyebrow: "Nuevo — Extensión de Safari",
    title: "Imágenes explícitas, difuminadas antes de que las veas.",
    intro:
      "Bloquear sitios no basta — las imágenes explícitas se esconden en páginas que sí usas. La nueva extensión de Safari clasifica cada imagen y cada fotograma de vídeo con aprendizaje automático local, y difumina todo contenido explícito antes de mostrarlo.",
    points: [
      {
        title: "Primero difuminar, luego revelar",
        body: "Cada imagen empieza difuminada y solo se revela cuando el modelo la aprueba. Los fotogramas de vídeo se comprueban durante la reproducción — las escenas explícitas se interceptan en pleno streaming.",
      },
      {
        title: "Allá donde vaya Safari",
        body: "Google Imágenes, los feeds de redes sociales, plataformas de streaming como Netflix — si Safari puede mostrarlo, el filtro ya lo ha comprobado.",
      },
      {
        title: "Privado por diseño",
        body: "La clasificación se ejecuta por completo en tu Mac con Core ML. Ninguna imagen, URL ni píxel sale de tu equipo — y lo que no se puede comprobar permanece difuminado.",
      },
    ],
    chips: ["Google Imágenes", "Redes sociales", "Netflix y streaming"],
    demoBadge: "Core ML · en local",
    demoBlurred: "Difuminada",
    demoNote:
      "Ilustración de resultados de imágenes en Safari: las imágenes explícitas aparecen difuminadas mientras las seguras permanecen visibles.",
  },
  whatsNew: {
    eyebrow: "Nuevo en la versión 1.3.0",
    title: "El bloqueador aprendió a ver.",
    intro:
      "CleanBrowse 1.3.0 añade una cuarta capa de protección — una extensión de Safari que difumina imágenes NSFW con aprendizaje automático local — y hace más fácil que nunca gestionar y actualizar la app desde la barra de menús.",
    blurTitle: "Difuminado de imágenes NSFW en Safari",
    blurBody:
      "La función estrella de la 1.3.0: las imágenes y los fotogramas de vídeo se clasifican en tu equipo y se difuminan antes de llegar a tu pantalla — en buscadores, redes sociales y sitios de streaming.",
    blurTag: "Difuminada",
    menuTitle: "A un clic desde la barra de menús",
    menuBody:
      "Un nuevo atajo en la ventana te lleva directo a los ajustes de extensiones de Safari — activar el filtro de imágenes lleva segundos.",
    updateTitle: "Actualizaciones desde los ajustes",
    updateBody:
      "Comprueba si hay versiones nuevas desde el propio CleanBrowse — las nuevas protecciones te llegan en cuanto se publican, sin volver a descargar desde la web.",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "Cuatro capas. Sin forma de esquivarlas.",
    intro:
      "Las extensiones del navegador se pueden desinstalar y los ajustes se pueden restablecer. CleanBrowse trabaja por debajo de todo eso — a nivel del sistema — para que la protección se mantenga en todas partes. Y en Safari, una cuarta capa atrapa lo que ninguna lista de bloqueo podría atrapar.",
    layerLabel: "Capa",
    layers: [
      {
        title: "Bloqueo por archivo hosts",
        body: "Más de 249.000 dominios adultos conocidos se redirigen a localhost mediante el archivo hosts del sistema — el primer muro, y cubre todas las aplicaciones de tu Mac.",
      },
      {
        title: "Proxy DNS a nivel de sistema",
        body: "Un proxy DNS local inspecciona cada tipo de consulta — incluido el DNS cifrado — y responde NXDOMAIN a todo lo que esté en la lista de bloqueo. Lo que no se resuelve no puede cargarse.",
      },
      {
        title: "SafeSearch obligatorio",
        body: "Google, YouTube, Bing y DuckDuckGo quedan fijados a sus puntos de SafeSearch a nivel de IP, en más de 190 dominios por país. Los resultados de búsqueda también se mantienen limpios.",
      },
      {
        title: "Difuminado de imágenes en local",
        body: "Una extensión de Safari clasifica cada imagen y cada fotograma de vídeo con aprendizaje automático local y difumina el contenido explícito antes de mostrarlo — incluso en sitios que ninguna lista bloquearía.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privacidad",
    title: "Contamos clics, no personas.",
    body: "Tu navegación nunca sale de tu Mac — cada sitio que visitas, cada consulta DNS, cada dominio bloqueado se queda en tu equipo. Lo único que CleanBrowse comparte es un recuento anónimo del uso de funciones a través de Aptabase, un servicio de analítica de código abierto centrado en la privacidad. Le dice al creador qué funciones importan — y nada sobre quién eres.",
    stayTitle: "Se queda en tu Mac",
    stayPoints: [
      "Cada sitio que visitas",
      "Cada consulta DNS y dominio bloqueado",
      "Todos tus ajustes",
    ],
    countTitle: "Contado de forma anónima",
    countPoints: [
      "Qué funciones se usan",
      "Versión de la app y de macOS",
      "Nada que pueda identificarte",
    ],
    note: "Sin identificadores, sin perfiles, sin cookies — nada puede rastrearse hasta ti.",
    linkLabel: "Cómo trata Aptabase los datos",
  },
  maker: {
    eyebrow: "Del creador",
    quote:
      "«Todo el mundo debería tener las herramientas para protegerse y proteger a los suyos en línea — sin suscripciones y sin entregar sus datos a nadie.»",
    body: "CleanBrowse lo desarrolla y mantiene una sola persona, y es completamente gratis. Sin cuentas, sin rastreo de tu navegación — lo que haces en línea nunca sale de tu Mac.",
    name: "Omar Elsayed",
    role: "Creador de CleanBrowse",
  },
  roadmap: {
    eyebrow: "Hoja de ruta",
    title: "La versión 1.3.0 es solo el principio.",
    items: [
      {
        title: "Resolutor DNS personalizado",
        body: "Elige el DNS de confianza — Cloudflare 1.1.1.1, Google o el resolutor que prefieras.",
        status: "Muy pronto",
        active: true,
      },
      {
        title: "Protégeme de mí mismo",
        body: "Bloquea tus propios ajustes para que la protección no pueda desactivarse en un momento de debilidad.",
        status: "En desarrollo",
        active: true,
      },
      {
        title: "Importa cualquier lista de bloqueo",
        body: "Trae tus propias listas — importa cualquier lista de bloqueo y CleanBrowse la aplica a nivel de sistema.",
        status: "Planificado",
        active: false,
      },
      {
        title: "Explorador de dominios bloqueados",
        body: "Consulta todo lo que CleanBrowse bloquea y comprueba al instante si un dominio está en la lista.",
        status: "Planificado",
        active: false,
      },
    ],
  },
  cta: {
    title: "¿Listo para un Internet más limpio?",
    body: "Descarga CleanBrowse 1.3.0 gratis — o deja tu correo y entérate antes que nadie de las novedades.",
  },
  signup: {
    placeholder: "Escribe tu correo",
    button: "Avísame",
    sending: "Enviando...",
    success: "¡Estás en la lista!",
    error: "Algo salió mal. Inténtalo de nuevo.",
  },
  footer: {
    taglinePre:
      "Un bloqueador gratuito de contenido adulto a nivel de sistema para macOS. Diseñado y desarrollado por",
    taglinePost: ".",
    rights: "Todos los derechos reservados.",
    motto: "Gratis para siempre · Sin cuentas · Sin datos personales",
  },
  contact: {
    metaTitle: "Contacto — CleanBrowse",
    metaDescription: "Ponte en contacto con Omar Elsayed, el creador de CleanBrowse.",
    eyebrow: "Contacto",
    title: "Saluda.",
    body: "¿Preguntas, comentarios o una función que te encantaría ver? Cada mensaje llega directamente al creador.",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu correo",
    messagePlaceholder: "Tu mensaje",
    send: "Enviar mensaje",
    sending: "Enviando...",
    error: "Algo salió mal. Inténtalo de nuevo.",
    successTitle: "Mensaje enviado",
    successBody: "Gracias por escribir. Tendrás respuesta pronto.",
    sendAnother: "Enviar otro mensaje",
  },
};

const zh: Dictionary = {
  meta: {
    title: "CleanBrowse — 免费的 macOS 成人内容拦截与 NSFW 图片模糊工具",
    description:
      "一款免费的 macOS 菜单栏应用：在 DNS 层面拦截成人内容，并通过本地 AI 在 Safari 中模糊 NSFW 图片——覆盖 Google、社交媒体以及 Netflix 等流媒体平台。支持六种语言和可配置的安全搜索。由 Omar Elsayed 开发。",
    keywords: [
      "macOS 成人内容拦截",
      "NSFW 图片模糊",
      "Safari 扩展",
      "模糊露骨图片",
      "安全搜索",
      "DNS 过滤",
      "Mac 家长控制",
    ],
  },
  nav: {
    whatsNew: "新功能",
    blur: "图片模糊",
    how: "工作原理",
    roadmap: "路线图",
    maker: "关于",
    contact: "联系",
    download: "下载",
    downloadForMac: "下载 macOS 版",
    viewOnGitHub: "在 GitHub 上查看",
    language: "语言",
  },
  hero: {
    badge: "1.3.0 新功能——Safari 现可模糊露骨图片",
    title: "互联网，去掉最糟的部分",
    titlePunct: "。",
    subtitle:
      "CleanBrowse 常驻于 Mac 菜单栏，在 DNS 层面拦截成人内容——覆盖每个浏览器、每个应用。现在，它还能在 Safari 中先于你的目光模糊露骨图片。免费、私密、说你的语言。",
    ctaNote: "永久免费 · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "个域名被拦截",
    statRegionsValue: "190+",
    statRegions: "个安全搜索地区",
    statDataValue: "0",
    statData: "浏览数据收集",
    chipProtected: "已保护",
    chipSafeSearch: "安全搜索",
    chipEnforced: "已强制",
    screenshotAlt:
      "CleanBrowse 菜单栏窗口，显示保护已开启以及可按引擎开关的安全搜索设置面板",
  },
  dns: {
    eyebrow: "幕后原理",
    title: "Mac 上的每一次 DNS 查询，都得到正确的回应。",
    body: "CleanBrowse 位于你的 Mac 与互联网之间。成人域名永远无法解析，搜索引擎被锁定到安全端点，其余一切原样通过——没有任何可感知的延迟。",
    adult: "成人内容",
    adultResult: "NXDOMAIN",
    search: "搜索引擎",
    searchResult: "安全搜索端点",
    other: "其余一切",
    otherResult: "正常解析",
    srNote:
      "模拟 DNS 查询日志：成人域名解析为 NXDOMAIN，搜索引擎被重写到安全搜索端点，其余一切正常解析。",
  },
  blur: {
    eyebrow: "新功能——Safari 扩展",
    title: "露骨图片，在你看到之前就已模糊。",
    intro:
      "仅仅拦截网站还不够——露骨图片就藏在你日常使用的页面里。全新的 Safari 扩展用本地机器学习对每张图片和每一帧视频进行分类，在渲染之前模糊一切露骨内容。",
    points: [
      {
        title: "先模糊，后揭示",
        body: "每张图片都从模糊开始，只有通过模型审核后才会显示。视频帧在播放过程中持续检查——露骨画面会在播放途中被拦下。",
      },
      {
        title: "Safari 所到之处",
        body: "Google 图片、社交媒体信息流、Netflix 等流媒体平台——只要 Safari 能显示，过滤器就已提前检查。",
      },
      {
        title: "隐私为先的设计",
        body: "分类完全通过 Core ML 在你的 Mac 上运行。任何图片、网址或像素都不会离开你的设备——无法检查的内容将保持模糊。",
      },
    ],
    chips: ["Google 图片", "社交媒体", "Netflix 等流媒体"],
    demoBadge: "Core ML · 本地运行",
    demoBlurred: "已模糊",
    demoNote:
      "Safari 图片结果示意图：露骨图片显示为模糊，安全图片保持可见。",
  },
  whatsNew: {
    eyebrow: "1.3.0 版新功能",
    title: "拦截器学会了看。",
    intro:
      "CleanBrowse 1.3.0 加入第四层防护——一个用本地机器学习模糊 NSFW 图片的 Safari 扩展——并让你在菜单栏中更轻松地管理和更新应用。",
    blurTitle: "Safari 中的 NSFW 图片模糊",
    blurBody:
      "1.3.0 的重磅功能：图片和视频帧在本地完成分类，并在抵达屏幕之前被模糊——覆盖搜索、社交媒体和流媒体网站。",
    blurTag: "已模糊",
    menuTitle: "菜单栏一键直达",
    menuBody:
      "弹窗中新增的快捷按钮可直接打开 Safari 扩展设置——启用图片过滤只需几秒。",
    updateTitle: "在设置面板中更新",
    updateBody:
      "直接在 CleanBrowse 内检查新版本——新的防护在发布后第一时间送达，无需再从网站重新下载。",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "工作原理",
    title: "四层防护。无从绕过。",
    intro:
      "浏览器扩展可以被卸载，设置可以被重置。CleanBrowse 工作在这一切之下——系统层面——所以防护在任何地方都有效。而在 Safari 中，第四层防护还能拦下任何拦截列表都无法拦下的内容。",
    layerLabel: "防护层",
    layers: [
      {
        title: "hosts 文件拦截",
        body: "超过 249,000 个已知成人域名通过系统 hosts 文件被重定向到 localhost——这是第一道墙，覆盖 Mac 上的每一个应用。",
      },
      {
        title: "系统级 DNS 代理",
        body: "本地 DNS 代理检查每一种查询类型——包括加密 DNS——对拦截列表中的一切返回 NXDOMAIN。无法解析的内容就无法加载。",
      },
      {
        title: "强制安全搜索",
        body: "Google、YouTube、Bing 和 DuckDuckGo 在 IP 层面被固定到各自的安全搜索端点，覆盖 190 多个国家域名。搜索结果同样保持干净。",
      },
      {
        title: "本地图片模糊",
        body: "Safari 扩展用本地机器学习对每张图片和每一帧视频进行分类，在渲染之前模糊露骨内容——即使是任何列表都不会拦截的网站。",
      },
    ],
  },
  privacy: {
    eyebrow: "隐私",
    title: "我们统计点击，不统计人。",
    body: "你的浏览记录永远不会离开你的 Mac——你访问的每个网站、每次 DNS 查询、每个被拦截的域名都留在你的设备上。CleanBrowse 唯一分享的，是通过 Aptabase（一个注重隐私的开源分析服务）进行的匿名功能使用统计。它只告诉开发者哪些功能重要——而对你是谁一无所知。",
    stayTitle: "留在你的 Mac 上",
    stayPoints: [
      "你访问的每个网站",
      "每次 DNS 查询和被拦截的域名",
      "你的全部设置",
    ],
    countTitle: "匿名统计",
    countPoints: [
      "哪些功能被使用",
      "应用版本与 macOS 版本",
      "没有任何能识别你的信息",
    ],
    note: "没有标识符，没有用户画像，没有 Cookie——任何数据都无法追溯到你。",
    linkLabel: "了解 Aptabase 如何处理数据",
  },
  maker: {
    eyebrow: "来自开发者",
    quote:
      "“每个人都应该拥有在网络上保护自己和家人的工具——不需要订阅，也不用把数据交给任何人。”",
    body: "CleanBrowse 由一个人开发和维护，并且完全免费。没有账号，不跟踪你的浏览——你在网上做什么，永远不会离开你的 Mac。",
    name: "Omar Elsayed",
    role: "CleanBrowse 开发者",
  },
  roadmap: {
    eyebrow: "路线图",
    title: "1.3.0 版只是开始。",
    items: [
      {
        title: "自定义 DNS 解析器",
        body: "选择你信任的上游 DNS——Cloudflare 1.1.1.1、Google 或任何你喜欢的解析器。",
        status: "即将推出",
        active: true,
      },
      {
        title: "自我约束模式",
        body: "锁定你自己的设置，让防护无法在一时冲动中被关闭。",
        status: "开发中",
        active: true,
      },
      {
        title: "导入任意拦截列表",
        body: "使用你自己的列表——导入任意拦截列表，CleanBrowse 会在系统层面强制执行。",
        status: "计划中",
        active: false,
      },
      {
        title: "已拦截域名一览",
        body: "浏览 CleanBrowse 拦截的全部内容，并即时查询某个域名是否在列表中。",
        status: "计划中",
        active: false,
      },
    ],
  },
  cta: {
    title: "准备好迎接更干净的互联网了吗？",
    body: "免费下载 CleanBrowse 1.3.0——或留下邮箱，第一时间了解新功能。",
  },
  signup: {
    placeholder: "输入你的邮箱",
    button: "通知我",
    sending: "发送中...",
    success: "你已加入名单！",
    error: "出了点问题，请重试。",
  },
  footer: {
    taglinePre: "一款免费的 macOS 系统级成人内容拦截工具。设计与开发：",
    taglinePost: "。",
    rights: "保留所有权利。",
    motto: "永久免费 · 无账号 · 无个人数据",
  },
  contact: {
    metaTitle: "联系 — CleanBrowse",
    metaDescription: "联系 CleanBrowse 的开发者 Omar Elsayed。",
    eyebrow: "联系",
    title: "打个招呼。",
    body: "有问题、反馈，或想要的新功能？每一条消息都会直接送达开发者。",
    namePlaceholder: "你的名字",
    emailPlaceholder: "你的邮箱",
    messagePlaceholder: "你的留言",
    send: "发送消息",
    sending: "发送中...",
    error: "出了点问题，请重试。",
    successTitle: "消息已发送",
    successBody: "感谢你的来信，我们会尽快回复。",
    sendAnother: "再发一条消息",
  },
};

const de: Dictionary = {
  meta: {
    title: "CleanBrowse — Kostenloser Blocker für nicht jugendfreie Inhalte & NSFW-Bildfilter für macOS",
    description:
      "Eine kostenlose macOS-Menüleisten-App, die nicht jugendfreie Inhalte auf DNS-Ebene blockiert und NSFW-Bilder in Safari mit lokaler KI unscharf macht — auf Google, in sozialen Netzwerken und auf Streaming-Plattformen wie Netflix. In sechs Sprachen, mit konfigurierbarer SafeSearch. Entwickelt von Omar Elsayed.",
    keywords: [
      "Blocker für nicht jugendfreie Inhalte macOS",
      "NSFW-Bilder weichzeichnen",
      "Safari-Erweiterung",
      "explizite Bilder unscharf machen",
      "SafeSearch",
      "DNS-Filter",
      "Kindersicherung Mac",
    ],
  },
  nav: {
    whatsNew: "Neuigkeiten",
    blur: "Bildfilter",
    how: "So funktioniert's",
    roadmap: "Roadmap",
    maker: "Über mich",
    contact: "Kontakt",
    download: "Laden",
    downloadForMac: "Für macOS laden",
    viewOnGitHub: "Auf GitHub ansehen",
    language: "Sprache",
  },
  hero: {
    badge: "Neu in 1.3.0 — Safari macht explizite Bilder jetzt unscharf",
    title: "Das Internet, ohne das Schlimmste daran",
    titlePunct: ".",
    subtitle:
      "CleanBrowse lebt in der Menüleiste deines Macs und blockiert nicht jugendfreie Inhalte auf DNS-Ebene — in jedem Browser, in jeder App. Und in Safari macht es explizite Bilder jetzt unscharf, bevor du sie überhaupt siehst. Kostenlos, privat, in deiner Sprache.",
    ctaNote: "Für immer kostenlos · macOS 14+",
    statDomainsValue: "249.000+",
    statDomains: "blockierte Domains",
    statRegionsValue: "190+",
    statRegions: "SafeSearch-Regionen",
    statDataValue: "0",
    statData: "gesammelte Browsing-Daten",
    chipProtected: "Geschützt",
    chipSafeSearch: "SafeSearch",
    chipEnforced: "Aktiv",
    screenshotAlt:
      "Das CleanBrowse-Menüleistenfenster mit aktivem Schutz und dem SafeSearch-Einstellungsbereich mit Schaltern pro Suchmaschine",
  },
  dns: {
    eyebrow: "Unter der Haube",
    title: "Jede DNS-Anfrage deines Macs bekommt die richtige Antwort.",
    body: "CleanBrowse sitzt zwischen deinem Mac und dem Internet. Nicht jugendfreie Domains werden nie aufgelöst, Suchmaschinen sind auf ihre sicheren Endpunkte festgelegt, und alles andere passiert unangetastet — ohne messbare Verlangsamung.",
    adult: "Nicht jugendfreie Inhalte",
    adultResult: "NXDOMAIN",
    search: "Suchmaschinen",
    searchResult: "SafeSearch-Endpunkte",
    other: "Alles andere",
    otherResult: "wird normal aufgelöst",
    srNote:
      "Simuliertes DNS-Protokoll: Nicht jugendfreie Domains werden als NXDOMAIN beantwortet, Suchmaschinen auf ihre SafeSearch-Endpunkte umgeschrieben, alles andere wird normal aufgelöst.",
  },
  blur: {
    eyebrow: "Neu — Safari-Erweiterung",
    title: "Explizite Bilder, unscharf bevor du sie siehst.",
    intro:
      "Websites zu blockieren reicht nicht — explizite Bilder verstecken sich auf Seiten, die du tatsächlich nutzt. Die neue Safari-Erweiterung klassifiziert jedes Bild und jedes Videobild mit lokalem maschinellem Lernen und macht alles Explizite unscharf, bevor es angezeigt wird.",
    points: [
      {
        title: "Erst unscharf, dann freigeben",
        body: "Jedes Bild startet unscharf und wird erst angezeigt, wenn das Modell es freigibt. Videobilder werden während der Wiedergabe geprüft — explizite Szenen werden mitten im Stream abgefangen.",
      },
      {
        title: "Überall, wo Safari hinkommt",
        body: "Google Bilder, Social-Media-Feeds, Streaming-Plattformen wie Netflix — wenn Safari es anzeigen kann, hat der Filter es bereits geprüft.",
      },
      {
        title: "Privat durch Design",
        body: "Die Klassifizierung läuft vollständig auf deinem Mac mit Core ML. Kein Bild, keine URL, kein Pixel verlässt dein Gerät — und was sich nicht prüfen lässt, bleibt unscharf.",
      },
    ],
    chips: ["Google Bilder", "Soziale Netzwerke", "Netflix & Streaming"],
    demoBadge: "Core ML · lokal",
    demoBlurred: "Unscharf",
    demoNote:
      "Illustration von Safari-Bildergebnissen: Explizite Bilder erscheinen unscharf, sichere Bilder bleiben sichtbar.",
  },
  whatsNew: {
    eyebrow: "Neu in Version 1.3.0",
    title: "Der Blocker hat sehen gelernt.",
    intro:
      "CleanBrowse 1.3.0 ergänzt eine vierte Schutzschicht — eine Safari-Erweiterung, die NSFW-Bilder mit lokalem maschinellem Lernen unscharf macht — und macht Verwaltung und Updates der App aus der Menüleiste einfacher denn je.",
    blurTitle: "NSFW-Bildfilter in Safari",
    blurBody:
      "Das Highlight von 1.3.0: Bilder und Videobilder werden lokal klassifiziert und unscharf gemacht, bevor sie deinen Bildschirm erreichen — bei der Suche, in sozialen Netzwerken und auf Streaming-Seiten.",
    blurTag: "Unscharf",
    menuTitle: "Ein Klick aus der Menüleiste",
    menuBody:
      "Ein neuer Shortcut im Fenster bringt dich direkt zu den Safari-Erweiterungseinstellungen — den Bildfilter zu aktivieren dauert Sekunden.",
    updateTitle: "Updates aus den Einstellungen",
    updateBody:
      "Prüfe direkt in CleanBrowse auf neue Versionen — neue Schutzfunktionen erreichen dich, sobald sie erscheinen, ohne erneuten Download von der Website.",
    updateFrom: "v1.2.0",
    updateTo: "v1.3.0",
  },
  how: {
    eyebrow: "So funktioniert's",
    title: "Vier Schichten. Kein Weg vorbei.",
    intro:
      "Browser-Erweiterungen lassen sich deinstallieren, Einstellungen zurücksetzen. CleanBrowse arbeitet unterhalb von alldem — auf Systemebene — damit der Schutz überall hält. Und in Safari fängt eine vierte Schicht ab, was keine Sperrliste je erfassen könnte.",
    layerLabel: "Schicht",
    layers: [
      {
        title: "Blockierung per Hosts-Datei",
        body: "Über 249.000 bekannte nicht jugendfreie Domains werden über die Hosts-Datei des Systems auf localhost umgeleitet — die erste Mauer, und sie deckt jede Anwendung auf deinem Mac ab.",
      },
      {
        title: "Systemweiter DNS-Proxy",
        body: "Ein lokaler DNS-Proxy prüft jeden Anfragetyp — auch verschlüsseltes DNS — und antwortet mit NXDOMAIN auf alles auf der Sperrliste. Was sich nicht auflösen lässt, kann nicht laden.",
      },
      {
        title: "Erzwungene SafeSearch",
        body: "Google, YouTube, Bing und DuckDuckGo werden auf IP-Ebene auf ihre SafeSearch-Endpunkte festgelegt, über 190+ Länderdomains hinweg. Auch die Suchergebnisse bleiben sauber.",
      },
      {
        title: "Lokaler Bildfilter",
        body: "Eine Safari-Erweiterung klassifiziert jedes Bild und jedes Videobild mit lokalem maschinellem Lernen und macht explizite Inhalte unscharf, bevor sie angezeigt werden — selbst auf Seiten, die keine Sperrliste je blockieren würde.",
      },
    ],
  },
  privacy: {
    eyebrow: "Privatsphäre",
    title: "Wir zählen Klicks, keine Menschen.",
    body: "Dein Surfverhalten verlässt nie deinen Mac — jede besuchte Seite, jede DNS-Anfrage, jede blockierte Domain bleibt auf deinem Gerät. Das Einzige, was CleanBrowse teilt, ist eine anonyme Zählung der Funktionsnutzung über Aptabase, einen datenschutzfreundlichen Open-Source-Analysedienst. Sie verrät dem Entwickler, welche Funktionen wichtig sind — und nichts darüber, wer du bist.",
    stayTitle: "Bleibt auf deinem Mac",
    stayPoints: [
      "Jede Seite, die du besuchst",
      "Jede DNS-Anfrage und blockierte Domain",
      "All deine Einstellungen",
    ],
    countTitle: "Anonym gezählt",
    countPoints: [
      "Welche Funktionen genutzt werden",
      "App- und macOS-Version",
      "Nichts, was dich identifizieren kann",
    ],
    note: "Keine Identifikatoren, keine Profile, keine Cookies — nichts lässt sich zu dir zurückverfolgen.",
    linkLabel: "Wie Aptabase mit Daten umgeht",
  },
  maker: {
    eyebrow: "Vom Entwickler",
    quote:
      "„Jeder sollte die Werkzeuge haben, um sich und seine Liebsten online zu schützen — ohne Abo und ohne seine Daten irgendwem zu überlassen.“",
    body: "CleanBrowse wird von einer einzigen Person entwickelt und gepflegt — und ist komplett kostenlos. Keine Konten, kein Tracking deines Surfverhaltens — was du online tust, verlässt nie deinen Mac.",
    name: "Omar Elsayed",
    role: "Entwickler von CleanBrowse",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Version 1.3.0 ist erst der Anfang.",
    items: [
      {
        title: "Eigener DNS-Resolver",
        body: "Wähle den Upstream-DNS deines Vertrauens — Cloudflare 1.1.1.1, Google oder jeden anderen Resolver.",
        status: "Bald verfügbar",
        active: true,
      },
      {
        title: "Schütz mich vor mir selbst",
        body: "Sperre deine eigenen Einstellungen, damit der Schutz in einem schwachen Moment nicht abgeschaltet werden kann.",
        status: "In Entwicklung",
        active: true,
      },
      {
        title: "Beliebige Blockliste importieren",
        body: "Bring deine eigenen Listen mit — importiere jede Blockliste und CleanBrowse setzt sie systemweit durch.",
        status: "Geplant",
        active: false,
      },
      {
        title: "Blockierte Domains einsehen",
        body: "Sieh alles ein, was CleanBrowse blockiert, und prüfe sofort, ob eine Domain auf der Liste steht.",
        status: "Geplant",
        active: false,
      },
    ],
  },
  cta: {
    title: "Bereit für ein saubereres Internet?",
    body: "Lade CleanBrowse 1.3.0 kostenlos herunter — oder hinterlasse deine E-Mail und erfahre als Erster von neuen Funktionen.",
  },
  signup: {
    placeholder: "Deine E-Mail-Adresse",
    button: "Benachrichtige mich",
    sending: "Wird gesendet...",
    success: "Du bist auf der Liste!",
    error: "Etwas ist schiefgelaufen. Versuch es erneut.",
  },
  footer: {
    taglinePre:
      "Ein kostenloser, systemweiter Blocker für nicht jugendfreie Inhalte auf macOS. Entworfen und entwickelt von",
    taglinePost: ".",
    rights: "Alle Rechte vorbehalten.",
    motto: "Für immer kostenlos · Keine Konten · Keine persönlichen Daten",
  },
  contact: {
    metaTitle: "Kontakt — CleanBrowse",
    metaDescription: "Kontaktiere Omar Elsayed, den Entwickler von CleanBrowse.",
    eyebrow: "Kontakt",
    title: "Sag Hallo.",
    body: "Fragen, Feedback oder ein Funktionswunsch? Jede Nachricht geht direkt an den Entwickler.",
    namePlaceholder: "Dein Name",
    emailPlaceholder: "Deine E-Mail",
    messagePlaceholder: "Deine Nachricht",
    send: "Nachricht senden",
    sending: "Wird gesendet...",
    error: "Etwas ist schiefgelaufen. Bitte versuch es erneut.",
    successTitle: "Nachricht gesendet",
    successBody: "Danke für deine Nachricht. Du hörst bald von uns.",
    sendAnother: "Weitere Nachricht senden",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar, fr, es, zh, de };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
