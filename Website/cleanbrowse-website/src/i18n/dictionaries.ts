import type { Locale } from "./config";

const en = {
  meta: {
    title: "CleanBrowse — Free Adult Content Blocker for macOS",
    description:
      "A free macOS menu bar app that blocks adult content at the DNS level — across every browser and app. Now out of beta, in six languages, with configurable SafeSearch. Made by Omar Elsayed.",
  },
  nav: {
    whatsNew: "What's new",
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
    badge: "Out of beta — 1.0 is our first full release",
    title: "The internet, minus the worst of it",
    titlePunct: ".",
    subtitle:
      "CleanBrowse lives in your Mac's menu bar and blocks adult content at the DNS level — in every browser, in every app. Free, private, and now speaking your language.",
    ctaNote: "Free forever · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "domains blocked",
    statRegionsValue: "190+",
    statRegions: "SafeSearch regions",
    statDataValue: "0",
    statData: "data collected",
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
  whatsNew: {
    eyebrow: "New in version 1.0",
    title: "Out of beta. Lighter, faster, and in six languages.",
    intro:
      "CleanBrowse has left beta — 1.0 is the first full release. It rebuilds the engine to be faster and lighter, opens the app to five new languages, and puts SafeSearch under your control.",
    langTitle: "Speaks your language",
    langBody:
      "The full app — settings, alerts, everything — is now available in six languages, right-to-left included.",
    safeTitle: "SafeSearch, your rules",
    safeBody:
      "Decide exactly how strict search should be. Toggle SafeSearch enforcement per engine — Google, YouTube, Bing, and DuckDuckGo — from the new settings panel.",
    safeOn: "on",
    perfTitle: "Lighter on your Mac",
    perfBody:
      "The DNS engine was rebuilt for 1.0 — queries resolve faster, memory use is down, and the app stays invisible in your menu bar until you need it.",
    perfPoints: [
      "Faster DNS resolution",
      "Lower memory footprint",
      "Minimal battery impact",
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "Three layers. No way around them.",
    intro:
      "Browser extensions can be uninstalled and settings can be reset. CleanBrowse works below all of that — at the system level — so the protection holds everywhere.",
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
    ],
  },
  maker: {
    eyebrow: "From the maker",
    quote:
      "“Everyone should have the tools to protect themselves and their loved ones online — without a subscription, and without handing their data to anyone.”",
    body: "CleanBrowse is built and maintained by one person, and it's completely free. No accounts, no analytics on your browsing, nothing leaves your Mac.",
    name: "Omar Elsayed",
    role: "Creator of CleanBrowse",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Version 1.0 is just the start.",
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
    body: "Download CleanBrowse 1.0 for free — or leave your email and hear about new features first.",
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
    motto: "Free forever · No accounts · No tracking",
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
    title: "CleanBrowse — حاجب مجاني للمحتوى الإباحي لنظام macOS",
    description:
      "تطبيق مجاني في شريط قوائم macOS يحجب المحتوى الإباحي على مستوى DNS — في كل متصفح وكل تطبيق. خرج الآن من النسخة التجريبية، بست لغات وبحث آمن قابل للتخصيص. من تطوير عمر السيد.",
  },
  nav: {
    whatsNew: "الجديد",
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
    badge: "خرجنا من التجريبي — 1.0 هو أول إصدار كامل",
    title: "الإنترنت، من دون أسوأ ما فيه",
    titlePunct: ".",
    subtitle:
      "يعيش CleanBrowse في شريط قوائم جهاز Mac ويحجب المحتوى الإباحي على مستوى DNS — في كل متصفح وكل تطبيق. مجاني، خاص، ويتحدث لغتك الآن.",
    ctaNote: "مجاني للأبد · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "نطاق محجوب",
    statRegionsValue: "190+",
    statRegions: "منطقة للبحث الآمن",
    statDataValue: "0",
    statData: "بيانات مُجمَّعة",
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
  whatsNew: {
    eyebrow: "الجديد في الإصدار 1.0",
    title: "خرجنا من التجريبي. أخف وأسرع وبست لغات.",
    intro:
      "غادر CleanBrowse المرحلة التجريبية — الإصدار 1.0 هو أول إصدار كامل. محرك أعيد بناؤه ليكون أسرع وأخف، وخمس لغات جديدة، وتحكم كامل في البحث الآمن.",
    langTitle: "يتحدث لغتك",
    langBody:
      "التطبيق بالكامل — الإعدادات والتنبيهات وكل شيء — متاح الآن بست لغات، بما فيها الكتابة من اليمين إلى اليسار.",
    safeTitle: "البحث الآمن، بقواعدك",
    safeBody:
      "حدّد بدقة مدى صرامة البحث. فعّل أو عطّل فرض البحث الآمن لكل محرك — Google وYouTube وBing وDuckDuckGo — من لوحة الإعدادات الجديدة.",
    safeOn: "مفعّل",
    perfTitle: "أخف على جهازك",
    perfBody:
      "أعيد بناء محرك DNS في الإصدار 1.0 — الاستعلامات تُحلّ أسرع، واستهلاك الذاكرة أقل، ويبقى التطبيق غير مرئي في شريط القوائم حتى تحتاجه.",
    perfPoints: [
      "حلّ أسرع لاستعلامات DNS",
      "استهلاك أقل للذاكرة",
      "تأثير ضئيل على البطارية",
    ],
  },
  how: {
    eyebrow: "كيف يعمل",
    title: "ثلاث طبقات. لا سبيل لتجاوزها.",
    intro:
      "إضافات المتصفح يمكن حذفها، والإعدادات يمكن إعادة ضبطها. يعمل CleanBrowse تحت كل ذلك — على مستوى النظام — فتبقى الحماية قائمة في كل مكان.",
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
    ],
  },
  maker: {
    eyebrow: "من صانع التطبيق",
    quote:
      "«يجب أن يمتلك الجميع الأدوات لحماية أنفسهم وأحبائهم على الإنترنت — من دون اشتراك، ومن دون تسليم بياناتهم لأي جهة.»",
    body: "‏CleanBrowse من تطوير وصيانة شخص واحد، وهو مجاني بالكامل. لا حسابات، ولا تتبع لتصفحك، ولا شيء يغادر جهازك.",
    name: "عمر السيد",
    role: "صانع CleanBrowse",
  },
  roadmap: {
    eyebrow: "خارطة الطريق",
    title: "الإصدار 1.0 مجرد البداية.",
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
    body: "حمّل CleanBrowse 1.0 مجانًا — أو اترك بريدك الإلكتروني لتكون أول من يعرف بالميزات الجديدة.",
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
    motto: "مجاني للأبد · بلا حسابات · بلا تتبع",
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
    title: "CleanBrowse — Bloqueur gratuit de contenu adulte pour macOS",
    description:
      "Une app gratuite dans la barre de menus de macOS qui bloque le contenu adulte au niveau DNS — dans tous les navigateurs et toutes les apps. Désormais hors bêta, en six langues, avec SafeSearch configurable. Créée par Omar Elsayed.",
  },
  nav: {
    whatsNew: "Nouveautés",
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
    badge: "Fin de la bêta — la 1.0 est notre première version complète",
    title: "Internet, sans ce qu'il a de pire",
    titlePunct: ".",
    subtitle:
      "CleanBrowse vit dans la barre de menus de votre Mac et bloque le contenu adulte au niveau DNS — dans chaque navigateur, dans chaque app. Gratuit, privé, et désormais dans votre langue.",
    ctaNote: "Gratuit pour toujours · macOS 14+",
    statDomainsValue: "249 000+",
    statDomains: "domaines bloqués",
    statRegionsValue: "190+",
    statRegions: "régions SafeSearch",
    statDataValue: "0",
    statData: "donnée collectée",
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
  whatsNew: {
    eyebrow: "Nouveau dans la version 1.0",
    title: "Fin de la bêta. Plus léger, plus rapide, en six langues.",
    intro:
      "CleanBrowse sort de bêta — la 1.0 est la première version complète. Le moteur a été reconstruit pour être plus rapide et plus léger, l'app s'ouvre à cinq nouvelles langues, et SafeSearch passe sous votre contrôle.",
    langTitle: "Parle votre langue",
    langBody:
      "Toute l'app — réglages, alertes, tout — est désormais disponible en six langues, écriture de droite à gauche comprise.",
    safeTitle: "SafeSearch, selon vos règles",
    safeBody:
      "Décidez exactement du niveau de rigueur de la recherche. Activez ou désactivez SafeSearch moteur par moteur — Google, YouTube, Bing et DuckDuckGo — depuis le nouveau panneau de réglages.",
    safeOn: "activé",
    perfTitle: "Plus léger sur votre Mac",
    perfBody:
      "Le moteur DNS a été reconstruit pour la 1.0 — les requêtes se résolvent plus vite, la mémoire consommée baisse, et l'app reste invisible dans votre barre de menus jusqu'à ce que vous en ayez besoin.",
    perfPoints: [
      "Résolution DNS plus rapide",
      "Empreinte mémoire réduite",
      "Impact minimal sur la batterie",
    ],
  },
  how: {
    eyebrow: "Fonctionnement",
    title: "Trois couches. Aucun moyen de les contourner.",
    intro:
      "Les extensions de navigateur peuvent être désinstallées et les réglages réinitialisés. CleanBrowse agit en dessous de tout cela — au niveau du système — pour une protection qui tient partout.",
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
    ],
  },
  maker: {
    eyebrow: "Le mot du créateur",
    quote:
      "« Chacun devrait avoir les outils pour se protéger, soi et ses proches, en ligne — sans abonnement, et sans confier ses données à qui que ce soit. »",
    body: "CleanBrowse est développé et maintenu par une seule personne, et il est entièrement gratuit. Pas de compte, aucune analyse de votre navigation, rien ne quitte votre Mac.",
    name: "Omar Elsayed",
    role: "Créateur de CleanBrowse",
  },
  roadmap: {
    eyebrow: "Feuille de route",
    title: "La version 1.0 n'est que le début.",
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
    body: "Téléchargez CleanBrowse 1.0 gratuitement — ou laissez votre e-mail pour être informé des nouveautés en premier.",
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
    motto: "Gratuit pour toujours · Sans compte · Sans pistage",
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
    title: "CleanBrowse — Bloqueador gratuito de contenido adulto para macOS",
    description:
      "Una app gratuita en la barra de menús de macOS que bloquea el contenido adulto a nivel de DNS — en todos los navegadores y apps. Ya fuera de beta, en seis idiomas y con SafeSearch configurable. Creada por Omar Elsayed.",
  },
  nav: {
    whatsNew: "Novedades",
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
    badge: "Fuera de beta — la 1.0 es nuestra primera versión completa",
    title: "Internet, sin lo peor que tiene",
    titlePunct: ".",
    subtitle:
      "CleanBrowse vive en la barra de menús de tu Mac y bloquea el contenido adulto a nivel de DNS — en cada navegador, en cada app. Gratis, privado y ahora en tu idioma.",
    ctaNote: "Gratis para siempre · macOS 14+",
    statDomainsValue: "249.000+",
    statDomains: "dominios bloqueados",
    statRegionsValue: "190+",
    statRegions: "regiones con SafeSearch",
    statDataValue: "0",
    statData: "datos recopilados",
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
  whatsNew: {
    eyebrow: "Nuevo en la versión 1.0",
    title: "Fuera de beta. Más ligero, más rápido y en seis idiomas.",
    intro:
      "CleanBrowse sale de beta — la 1.0 es la primera versión completa. Reconstruye el motor para ser más rápido y ligero, abre la app a cinco idiomas nuevos y pone SafeSearch bajo tu control.",
    langTitle: "Habla tu idioma",
    langBody:
      "Toda la app — ajustes, avisos, todo — está ahora disponible en seis idiomas, incluida la escritura de derecha a izquierda.",
    safeTitle: "SafeSearch, con tus reglas",
    safeBody:
      "Decide exactamente cuán estricta debe ser la búsqueda. Activa o desactiva SafeSearch por buscador — Google, YouTube, Bing y DuckDuckGo — desde el nuevo panel de ajustes.",
    safeOn: "activado",
    perfTitle: "Más ligero en tu Mac",
    perfBody:
      "El motor DNS se reconstruyó para la 1.0 — las consultas se resuelven más rápido, el uso de memoria baja y la app permanece invisible en tu barra de menús hasta que la necesitas.",
    perfPoints: [
      "Resolución DNS más rápida",
      "Menor consumo de memoria",
      "Impacto mínimo en la batería",
    ],
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "Tres capas. Sin forma de esquivarlas.",
    intro:
      "Las extensiones del navegador se pueden desinstalar y los ajustes se pueden restablecer. CleanBrowse trabaja por debajo de todo eso — a nivel del sistema — para que la protección se mantenga en todas partes.",
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
    ],
  },
  maker: {
    eyebrow: "Del creador",
    quote:
      "«Todo el mundo debería tener las herramientas para protegerse y proteger a los suyos en línea — sin suscripciones y sin entregar sus datos a nadie.»",
    body: "CleanBrowse lo desarrolla y mantiene una sola persona, y es completamente gratis. Sin cuentas, sin análisis de tu navegación, nada sale de tu Mac.",
    name: "Omar Elsayed",
    role: "Creador de CleanBrowse",
  },
  roadmap: {
    eyebrow: "Hoja de ruta",
    title: "La versión 1.0 es solo el principio.",
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
    body: "Descarga CleanBrowse 1.0 gratis — o deja tu correo y entérate antes que nadie de las novedades.",
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
    motto: "Gratis para siempre · Sin cuentas · Sin rastreo",
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
    title: "CleanBrowse — 免费的 macOS 成人内容拦截工具",
    description:
      "一款免费的 macOS 菜单栏应用，在 DNS 层面拦截成人内容——覆盖所有浏览器和应用。现已正式发布，支持六种语言和可配置的安全搜索。由 Omar Elsayed 开发。",
  },
  nav: {
    whatsNew: "新功能",
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
    badge: "告别测试版——1.0 是首个正式版本",
    title: "互联网，去掉最糟的部分",
    titlePunct: "。",
    subtitle:
      "CleanBrowse 常驻于 Mac 菜单栏，在 DNS 层面拦截成人内容——覆盖每个浏览器、每个应用。免费、私密，现在还说你的语言。",
    ctaNote: "永久免费 · macOS 14+",
    statDomainsValue: "249,000+",
    statDomains: "个域名被拦截",
    statRegionsValue: "190+",
    statRegions: "个安全搜索地区",
    statDataValue: "0",
    statData: "数据收集",
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
  whatsNew: {
    eyebrow: "1.0 版新功能",
    title: "正式发布。更轻、更快，支持六种语言。",
    intro:
      "CleanBrowse 已结束测试——1.0 是首个正式版本。全新重写的引擎更快更轻，新增五种语言，并让安全搜索完全由你掌控。",
    langTitle: "说你的语言",
    langBody:
      "整个应用——设置、提醒、一切——现已支持六种语言，包括从右到左的文字。",
    safeTitle: "安全搜索，由你定规则",
    safeBody:
      "精确决定搜索的严格程度。在新的设置面板中，为每个引擎单独开关安全搜索——Google、YouTube、Bing 和 DuckDuckGo。",
    safeOn: "开启",
    perfTitle: "对 Mac 更轻量",
    perfBody:
      "1.0 版重写了 DNS 引擎——查询解析更快，内存占用更低，应用安静地待在菜单栏里，直到你需要它。",
    perfPoints: ["更快的 DNS 解析", "更低的内存占用", "对电池影响极小"],
  },
  how: {
    eyebrow: "工作原理",
    title: "三层防护。无从绕过。",
    intro:
      "浏览器扩展可以被卸载，设置可以被重置。CleanBrowse 工作在这一切之下——系统层面——所以防护在任何地方都有效。",
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
    ],
  },
  maker: {
    eyebrow: "来自开发者",
    quote:
      "“每个人都应该拥有在网络上保护自己和家人的工具——不需要订阅，也不用把数据交给任何人。”",
    body: "CleanBrowse 由一个人开发和维护，并且完全免费。没有账号，不分析你的浏览记录，任何数据都不会离开你的 Mac。",
    name: "Omar Elsayed",
    role: "CleanBrowse 开发者",
  },
  roadmap: {
    eyebrow: "路线图",
    title: "1.0 版只是开始。",
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
    body: "免费下载 CleanBrowse 1.0——或留下邮箱，第一时间了解新功能。",
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
    motto: "永久免费 · 无账号 · 无跟踪",
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
    title: "CleanBrowse — Kostenloser Blocker für nicht jugendfreie Inhalte auf macOS",
    description:
      "Eine kostenlose macOS-Menüleisten-App, die nicht jugendfreie Inhalte auf DNS-Ebene blockiert — in jedem Browser und jeder App. Jetzt raus aus der Beta, in sechs Sprachen und mit konfigurierbarer SafeSearch. Entwickelt von Omar Elsayed.",
  },
  nav: {
    whatsNew: "Neuigkeiten",
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
    badge: "Raus aus der Beta — 1.0 ist unsere erste Vollversion",
    title: "Das Internet, ohne das Schlimmste daran",
    titlePunct: ".",
    subtitle:
      "CleanBrowse lebt in der Menüleiste deines Macs und blockiert nicht jugendfreie Inhalte auf DNS-Ebene — in jedem Browser, in jeder App. Kostenlos, privat und jetzt in deiner Sprache.",
    ctaNote: "Für immer kostenlos · macOS 14+",
    statDomainsValue: "249.000+",
    statDomains: "blockierte Domains",
    statRegionsValue: "190+",
    statRegions: "SafeSearch-Regionen",
    statDataValue: "0",
    statData: "gesammelte Daten",
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
  whatsNew: {
    eyebrow: "Neu in Version 1.0",
    title: "Raus aus der Beta. Leichter, schneller, in sechs Sprachen.",
    intro:
      "CleanBrowse hat die Beta hinter sich — 1.0 ist die erste Vollversion. Die Engine wurde neu gebaut: schneller und leichter, mit fünf neuen Sprachen und SafeSearch unter deiner Kontrolle.",
    langTitle: "Spricht deine Sprache",
    langBody:
      "Die komplette App — Einstellungen, Hinweise, alles — ist jetzt in sechs Sprachen verfügbar, rechts-nach-links-Schrift inklusive.",
    safeTitle: "SafeSearch nach deinen Regeln",
    safeBody:
      "Bestimme genau, wie streng die Suche sein soll. Schalte SafeSearch pro Suchmaschine ein oder aus — Google, YouTube, Bing und DuckDuckGo — im neuen Einstellungsbereich.",
    safeOn: "an",
    perfTitle: "Leichter für deinen Mac",
    perfBody:
      "Die DNS-Engine wurde für 1.0 neu gebaut — Anfragen werden schneller aufgelöst, der Speicherverbrauch sinkt, und die App bleibt unsichtbar in der Menüleiste, bis du sie brauchst.",
    perfPoints: [
      "Schnellere DNS-Auflösung",
      "Geringerer Speicherverbrauch",
      "Minimale Auswirkung auf den Akku",
    ],
  },
  how: {
    eyebrow: "So funktioniert's",
    title: "Drei Schichten. Kein Weg vorbei.",
    intro:
      "Browser-Erweiterungen lassen sich deinstallieren, Einstellungen zurücksetzen. CleanBrowse arbeitet unterhalb von alldem — auf Systemebene — damit der Schutz überall hält.",
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
    ],
  },
  maker: {
    eyebrow: "Vom Entwickler",
    quote:
      "„Jeder sollte die Werkzeuge haben, um sich und seine Liebsten online zu schützen — ohne Abo und ohne seine Daten irgendwem zu überlassen.“",
    body: "CleanBrowse wird von einer einzigen Person entwickelt und gepflegt — und ist komplett kostenlos. Keine Konten, keine Auswertung deines Surfverhaltens, nichts verlässt deinen Mac.",
    name: "Omar Elsayed",
    role: "Entwickler von CleanBrowse",
  },
  roadmap: {
    eyebrow: "Roadmap",
    title: "Version 1.0 ist erst der Anfang.",
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
    body: "Lade CleanBrowse 1.0 kostenlos herunter — oder hinterlasse deine E-Mail und erfahre als Erster von neuen Funktionen.",
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
    motto: "Für immer kostenlos · Keine Konten · Kein Tracking",
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
