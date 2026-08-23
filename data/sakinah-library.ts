export type LibraryKind =
  | "quran"
  | "qiraat"
  | "tafsir"
  | "bukhari"
  | "muslim"
  | "adhkar"
  | "daily-ward"
  | "bidaya"
  | "ibn-taymiyyah"
  | "nawawi"
  | "ibn-baz"
  | "fatwa"
  | "hanafi"
  | "maliki"
  | "shafii"
  | "hanbali"
  | "tawhid";

export type SourceMeta = {
  label: string;
  reference: string;
  url: string;
  site: string;
  note: string;
};

export type HadithMeta = {
  isnad: string;
  narrator: string;
  sourceBook: string;
  chapter: string;
  number: string;
  grade: string;
  grader: string;
  takhrij: string;
  verifierUrl: string;
  isnadUrl: string;
  reminderEligible: boolean;
};

export type TafsirMeta = {
  tafsirName: string;
  scholar: string;
  ayahRange: string;
  tafsirUrl: string;
};

export type BookMeta = {
  author: string;
  edition: string;
  publisher?: string;
  location: string;
};

export type QiraatMeta = {
  qari: string;
  riwayah: string;
  tariq: string;
  locus: string;
  qiraatSource: string;
};

export type ReminderMeta = {
  category: string;
  suggestedTime: string;
  repetitions: string;
};

export type RecitationMeta = {
  title: string;
  reciter: string;
  riwayah: string;
  publisher: string;
  license: string;
  licenseUrl: string;
  sourcePage: string;
  audioUrl: string;
  note: string;
};

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  source: SourceMeta;
  tags: string[];
  hadith?: HadithMeta;
  tafsir?: TafsirMeta;
  book?: BookMeta;
  qiraat?: QiraatMeta;
  reminder?: ReminderMeta;
  recitations?: RecitationMeta[];
};

export const sourceDirectory = [
  { id: "alquran-cloud", name: "Al Quran Cloud API", scope: "عرض نص المصحف كاملًا داخل التطبيق عبر واجهة عامة", url: "https://alquran.cloud/api", icon: "menu-book", allowed: true },
  { id: "quran-complex", name: "مجمع الملك فهد لطباعة المصحف الشريف", scope: "نص القرآن والقراءات والروايات", url: "https://qurancomplex.gov.sa/", icon: "auto-stories", allowed: true },
  { id: "ksu-quran", name: "مشروع المصحف الإلكتروني بجامعة الملك سعود", scope: "نص القرآن والتفاسير", url: "https://quran.ksu.edu.sa/", icon: "menu-book", allowed: true },
  { id: "dorar", name: "الموسوعة الحديثية · الدرر السنية", scope: "التخريج ودرجة الحديث", url: "https://dorar.net/hadith", icon: "verified-user", allowed: true },
  { id: "hisn", name: "حصن المسلم · من أذكار الكتاب والسنة", scope: "فهرسة أبواب الأذكار والأدعية", url: "https://hisnmuslim.com/i/ar/1", icon: "wb-sunny", allowed: true },
  { id: "sunnah", name: "نصوص الأسانيد في دواوين الحديث", scope: "السند العربي والموضع في الصحيحين", url: "https://sunnah.com/", icon: "account-tree", allowed: true },
  { id: "shamela", name: "المكتبة الشاملة", scope: "الكتب التراثية وبيانات الطبعات والفهارس", url: "https://shamela.ws/", icon: "account-balance", allowed: true },
  { id: "binbaz", name: "الموقع الرسمي للشيخ ابن باز", scope: "المؤلفات والفتاوى المنسوبة للشيخ", url: "https://binbaz.org.sa/", icon: "library-books", allowed: true },
  { id: "commons-audio", name: "ويكيميديا كومنز", scope: "ملفات تلاوة برخص ظاهرة في صفحة الملف", url: "https://commons.wikimedia.org/", icon: "volume-up", allowed: true },
] as const;

// صفحة الملف في كومنز تبقى مرجع الترخيص، بينما يقدم upload.wikimedia.org
// ملف الصوت النهائي عبر HTTPS بلا إعادة توجيه داخل المشغل.
export const allowedSourceHosts = [...sourceDirectory.map((source) => new URL(source.url).hostname), "api.alquran.cloud", "upload.wikimedia.org"];

export const sectionMeta: Record<LibraryKind, { title: string; shortTitle: string; color: string; icon: string; description: string }> = {
  quran: { title: "القرآن الكريم", shortTitle: "القرآن", color: "#0F5B4C", icon: "menu-book", description: "نص الآية ورقمها ومصدر المصحف." },
  qiraat: { title: "القراءات العشر", shortTitle: "القراءات", color: "#6B4E19", icon: "record-voice-over", description: "القارئ والرواية والطريق والموضع، مع مصدر مصحفي." },
  tafsir: { title: "التفسير", shortTitle: "التفسير", color: "#416B67", icon: "auto-stories", description: "تفاسير مسندة إلى اسم المفسر وموضع الآية." },
  bukhari: { title: "صحيح البخاري", shortTitle: "البخاري", color: "#6A5A2B", icon: "format-quote", description: "الحديث كاملاً مع السند والتخريج والدرجة." },
  muslim: { title: "صحيح مسلم", shortTitle: "مسلم", color: "#376B7A", icon: "format-quote", description: "الحديث كاملاً مع السند والتخريج والدرجة." },
  adhkar: { title: "الأذكار والأدعية", shortTitle: "الأذكار", color: "#7A5560", icon: "wb-sunny", description: "أذكار مصنفة بحسب الوقت والمناسبة مع المصدر." },
  "daily-ward": { title: "الورد اليومي", shortTitle: "الورد", color: "#36744F", icon: "event-available", description: "ورد قرآني موثق ومتابعة إنجاز محلية." },
  bidaya: { title: "البداية والنهاية", shortTitle: "ابن كثير", color: "#8A5A43", icon: "account-balance", description: "فهرس الكتاب وبيانات الطبعة والموضع." },
  "ibn-taymiyyah": { title: "مؤلفات ابن تيمية", shortTitle: "ابن تيمية", color: "#4E5D79", icon: "library-books", description: "كتب وفهارس موثقة ببيانات الطبعة والموضع." },
  nawawi: { title: "مؤلفات الإمام النووي", shortTitle: "النووي", color: "#5B6E39", icon: "collections-bookmark", description: "كتب النووي مع بيانات التحقيق والمواضع." },
  "ibn-baz": { title: "مؤلفات الشيخ ابن باز", shortTitle: "ابن باز", color: "#525F6C", icon: "article", description: "فتاوى ومؤلفات من المصدر الرسمي فقط." },
  fatwa: { title: "الفتاوى الموثقة", shortTitle: "الفتاوى", color: "#7B5B48", icon: "fact-check", description: "إحالات موثقة فقط إلى فتاوى ابن باز ونقول من مجموع فتاوى ابن تيمية." },
  hanafi: { title: "المذهب الحنفي", shortTitle: "حنفي", color: "#715C37", icon: "gavel", description: "كتب المذهب مع نسبة دقيقة للمؤلف." },
  maliki: { title: "المذهب المالكي", shortTitle: "مالكي", color: "#526C45", icon: "gavel", description: "كتب المذهب وبيانات التحقيق والطبعة." },
  shafii: { title: "المذهب الشافعي", shortTitle: "شافعي", color: "#506B82", icon: "gavel", description: "كتب الإمام الشافعي والمذهب بمراجعها." },
  hanbali: { title: "المذهب الحنبلي", shortTitle: "حنبلي", color: "#7A4C46", icon: "gavel", description: "كتب الإمام أحمد والمذهب مع توثيقها." },
  tawhid: { title: "كتاب التوحيد", shortTitle: "التوحيد", color: "#534D83", icon: "book", description: "فهرس أبواب كتاب التوحيد وبيانات المصدر." },
};

export const collectionMeta = sectionMeta;

export const libraryItems: LibraryItem[] = [
  {
    id: "quran-fatiha",
    kind: "quran",
    title: "سورة الفاتحة",
    subtitle: "مكية · ٧ آيات",
    excerpt: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ · الرَّحْمَٰنِ الرَّحِيمِ",
    body: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    source: { label: "القرآن الكريم", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://qurancomplex.gov.sa/", site: "مجمع الملك فهد لطباعة المصحف الشريف", note: "النص القرآني موثق باسم السورة وأرقام الآيات." },
    tags: ["القرآن", "الفاتحة", "صلاة"],
    recitations: [
      { title: "تلاوة سورة الفاتحة", reciter: "لم يُذكر قارئ محدد في صفحة المصدر", riwayah: "لم تُذكر في صفحة المصدر", publisher: "Ibrahimmusa4 عبر ويكيميديا كومنز", license: "CC0 1.0 · ملكية عامة مكرسة", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", sourcePage: "https://commons.wikimedia.org/wiki/File:AlF%C4%81tihatulKit%C4%81b.ogg", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/AlF%C4%81tihatulKit%C4%81b.ogg", note: "تعرض البطاقة اسم الناشر كما ورد، ولا تنسب التسجيل إلى قارئ محدد بلا تصريح في المصدر." },
      { title: "الفاتحة بأسلوب قراءة حمزة الكوفي", reciter: "أسلوب حمزة الكوفي بحسب وصف الملف", riwayah: "أسلوب قراءة حمزة الكوفي كما وصف المصدر", publisher: "PeaceSeekers عبر ويكيميديا كومنز", license: "CC0 1.0 · ملكية عامة مكرسة", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", sourcePage: "https://commons.wikimedia.org/wiki/File:Al_Fatiha_in_Hamzah_al-Kufi_qiraat_style_or_harf.ogg", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Al_Fatiha_in_Hamzah_al-Kufi_qiraat_style_or_harf.ogg", note: "صفحة الملف تصفه بأنه تلاوة الفاتحة بأسلوب حمزة الكوفي؛ لا تضاف رواية أو طريق أكثر تحديدًا من دون مرجع صريح." },
    ],
  },
  {
    id: "tafsir-fatiha-saadi",
    kind: "tafsir",
    title: "تفسير السعدي للفـاتحة",
    subtitle: "تفسير تيسير الكريم الرحمن · الآيات ١–٧",
    excerpt: "بطاقة إحالة إلى تفسير السعدي لآيات الفاتحة من المصدر المحدد.",
    body: "هذه مادة تفسيرية مربوطة بتفسير السعدي للفاتحة. يفتح التطبيق المرجع الموثق لعرض نص التفسير في موضعه، ويحفظ اسم المفسر ورقم السورة ومدى الآيات بجانب المادة.",
    source: { label: "تفسير السعدي", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://quran.ksu.edu.sa/tafseer/saadi/sura1-aya1.html", site: "مشروع المصحف الإلكتروني بجامعة الملك سعود", note: "التفسير منفصل عن نص القرآن، ويظهر باسمه وموضع الآيات." },
    tags: ["تفسير", "السعدي", "الفاتحة"],
    tafsir: { tafsirName: "تيسير الكريم الرحمن في تفسير كلام المنان", scholar: "عبد الرحمن بن ناصر السعدي", ayahRange: "الفاتحة ١–٧", tafsirUrl: "https://quran.ksu.edu.sa/tafseer/saadi/sura1-aya1.html" },
  },
  {
    id: "tafsir-fatiha-katheer",
    kind: "tafsir",
    title: "تفسير ابن كثير للفاتحة",
    subtitle: "تفسير القرآن العظيم · الآيات ١–٧",
    excerpt: "بطاقة إحالة موثقة إلى تفسير ابن كثير لآيات الفاتحة.",
    body: "هذه بطاقة فهرسية لتفسير ابن كثير للفاتحة. يفتح التطبيق المصدر الموثق لعرض النص في موضعه، مع الفصل التام بين متن القرآن ونص التفسير.",
    source: { label: "تفسير ابن كثير", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://quran.ksu.edu.sa/tafseer/katheer/sura1-aya1.html", site: "مشروع المصحف الإلكتروني بجامعة الملك سعود", note: "التفسير مرتبط باسم المفسر وموضع الآيات والرابط." },
    tags: ["تفسير", "ابن كثير", "الفاتحة"],
    tafsir: { tafsirName: "تفسير القرآن العظيم", scholar: "إسماعيل بن كثير", ayahRange: "الفاتحة ١–٧", tafsirUrl: "https://quran.ksu.edu.sa/tafseer/katheer/sura1-aya1.html" },
  },
  {
    id: "tafsir-fatiha-baghawy",
    kind: "tafsir",
    title: "تفسير البغوي للفاتحة",
    subtitle: "معالم التنزيل · الآيات ١–٧",
    excerpt: "بطاقة إحالة موثقة إلى تفسير البغوي لآيات الفاتحة.",
    body: "هذه بطاقة فهرسية لتفسير البغوي للفاتحة. تظهر بيانات اسم المفسر وموضع الآيات قبل فتح النص من مصدره المحدد.",
    source: { label: "تفسير البغوي", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://quran.ksu.edu.sa/tafseer/baghawy/sura1-aya1.html", site: "مشروع المصحف الإلكتروني بجامعة الملك سعود", note: "يحافظ التطبيق على الفصل بين الآية والتفسير والمصدر." },
    tags: ["تفسير", "البغوي", "الفاتحة"],
    tafsir: { tafsirName: "معالم التنزيل", scholar: "الحسين بن مسعود البغوي", ayahRange: "الفاتحة ١–٧", tafsirUrl: "https://quran.ksu.edu.sa/tafseer/baghawy/sura1-aya1.html" },
  },
  {
    id: "tafsir-fatiha-tabary",
    kind: "tafsir",
    title: "تفسير الطبري للفاتحة",
    subtitle: "جامع البيان · الآيات ١–٧",
    excerpt: "بطاقة إحالة موثقة إلى تفسير الطبري لآيات الفاتحة.",
    body: "هذه بطاقة فهرسية لتفسير الطبري للفاتحة، تتضمن المرجع المباشر وموضع الآيات وتمنع عرض أي شرح بلا اسم المصدر.",
    source: { label: "تفسير الطبري", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://quran.ksu.edu.sa/tafseer/tabary/sura1-aya1.html", site: "مشروع المصحف الإلكتروني بجامعة الملك سعود", note: "يظهر اسم الكتاب والمفسر وموضع الآيات في بطاقة التوثيق." },
    tags: ["تفسير", "الطبري", "الفاتحة"],
    tafsir: { tafsirName: "جامع البيان عن تأويل آي القرآن", scholar: "محمد بن جرير الطبري", ayahRange: "الفاتحة ١–٧", tafsirUrl: "https://quran.ksu.edu.sa/tafseer/tabary/sura1-aya1.html" },
  },
  {
    id: "tafsir-fatiha-qortobi",
    kind: "tafsir",
    title: "تفسير القرطبي للفاتحة",
    subtitle: "الجامع لأحكام القرآن · الآيات ١–٧",
    excerpt: "بطاقة إحالة موثقة إلى تفسير القرطبي لآيات الفاتحة.",
    body: "هذه بطاقة فهرسية لتفسير القرطبي للفاتحة. يسمح التطبيق بالرجوع إلى الموضع الأصلي من المصدر المحدد، مع حفظ اسم المفسر وموضع الآيات.",
    source: { label: "تفسير القرطبي", reference: "سورة الفاتحة، الآيات ١–٧", url: "https://quran.ksu.edu.sa/tafseer/qortobi/sura1-aya1.html", site: "مشروع المصحف الإلكتروني بجامعة الملك سعود", note: "تظهر بيانات التفسير والآية والرابط بصيغة منفصلة عن نص القرآن." },
    tags: ["تفسير", "القرطبي", "الفاتحة"],
    tafsir: { tafsirName: "الجامع لأحكام القرآن", scholar: "محمد بن أحمد القرطبي", ayahRange: "الفاتحة ١–٧", tafsirUrl: "https://quran.ksu.edu.sa/tafseer/qortobi/sura1-aya1.html" },
  },
  {
    id: "qiraat-ten",
    kind: "qiraat",
    title: "مدخل إلى القراءات العشر",
    subtitle: "بطاقة توثيق للقراءة والرواية والطريق",
    excerpt: "نافع، وابن كثير، وأبو عمرو، وابن عامر، وعاصم، وحمزة، والكسائي، وأبو جعفر، ويعقوب، وخلف العاشر.",
    body: "القراء العشرة: نافع المدني، وابن كثير المكي، وأبو عمرو البصري، وابن عامر الدمشقي، وعاصم الكوفي، وحمزة الكوفي، والكسائي، وأبو جعفر المدني، ويعقوب الحضرمي، وخلف العاشر. عند إضافة أي وجه قراءة، تسجل البيانات الآتية إلزاميًا: اسم القارئ، الرواية، الطريق، موضع الآية، ومرجع المصحف أو المصدر العلمي الذي اعتمد عليه.",
    source: { label: "القراءات العشر", reference: "إصدارات مصاحف الروايات والقراءات", url: "https://qurancomplex.gov.sa/", site: "مجمع الملك فهد لطباعة المصحف الشريف", note: "تقتصر الإحالات على المصادر المصحفية أو العلمية المعتمدة في قائمة التطبيق." },
    tags: ["قراءات", "روايات", "مصاحف"],
    qiraat: { qari: "نافع، ابن كثير، أبو عمرو، ابن عامر، عاصم، حمزة، الكسائي، أبو جعفر، يعقوب، خلف العاشر", riwayah: "تسجل الرواية المعتمدة مع كل موضع قرائي", tariq: "يسجل الطريق المعتمد مع كل رواية", locus: "فهرس القراءات العشر؛ تضاف الآيات بصيغتها المرجعية عند إدراجها", qiraatSource: "https://qurancomplex.gov.sa/" },
  },
  {
    id: "bukhari-1",
    kind: "bukhari",
    title: "الأعمال بالنيات",
    subtitle: "كتاب بدء الوحي · حديث ١",
    excerpt: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",
    body: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه.",
    source: { label: "صحيح البخاري", reference: "كتاب بدء الوحي، باب كيف كان بدء الوحي، حديث ١", url: "https://dorar.net/hadith", site: "الموسوعة الحديثية · الدرر السنية", note: "بطاقة الحديث تعرض المصدر والتخريج والدرجة والسند الكامل من رابط النص المسند." },
    tags: ["البخاري", "النية", "هجرة"],
    hadith: { isnad: "الحميدي عبد الله بن الزبير ← سفيان ← يحيى بن سعيد الأنصاري ← محمد بن إبراهيم التيمي ← علقمة بن وقاص الليثي ← عمر بن الخطاب رضي الله عنه ← النبي ﷺ", narrator: "عمر بن الخطاب رضي الله عنه", sourceBook: "صحيح البخاري", chapter: "كتاب بدء الوحي، باب كيف كان بدء الوحي", number: "١", grade: "صحيح", grader: "أخرجه الإمام البخاري في صحيحه", takhrij: "صحيح البخاري ١؛ والحديث مخرج كذلك في صحيح مسلم بمعنى مقارب.", verifierUrl: "https://dorar.net/hadith", isnadUrl: "https://sunnah.com/bukhari:1", reminderEligible: false },
  },
  {
    id: "muslim-2699",
    kind: "muslim",
    title: "فضل الاجتماع على التلاوة والذكر",
    subtitle: "كتاب الذكر والدعاء · حديث ٢٦٩٩ أ",
    excerpt: "وما اجتمع قوم في بيت من بيوت الله يتلون كتاب الله ويتدارسونه بينهم إلا نزلت عليهم السكينة.",
    body: "من نفس عن مؤمن كربة من كرب الدنيا نفس الله عنه كربة من كرب يوم القيامة، ومن يسر على معسر يسر الله عليه في الدنيا والآخرة، ومن ستر مسلما ستره الله في الدنيا والآخرة، والله في عون العبد ما كان العبد في عون أخيه، ومن سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة، وما اجتمع قوم في بيت من بيوت الله يتلون كتاب الله ويتدارسونه بينهم إلا نزلت عليهم السكينة وغشيتهم الرحمة وحفتهم الملائكة وذكرهم الله فيمن عنده، ومن بطأ به عمله لم يسرع به نسبه.",
    source: { label: "صحيح مسلم", reference: "كتاب الذكر والدعاء والتوبة والاستغفار، باب فضل الاجتماع على تلاوة القرآن وعلى الذكر، حديث ٢٦٩٩ أ", url: "https://dorar.net/hadith", site: "الموسوعة الحديثية · الدرر السنية", note: "يعرض السند والتخريج ورقم الكتاب والباب والحديث في بطاقة التوثيق." },
    tags: ["مسلم", "علم", "قرآن", "سكينة"],
    hadith: { isnad: "يحيى بن يحيى التميمي، وأبو بكر بن أبي شيبة، ومحمد بن العلاء الهمداني ← أبو معاوية ← الأعمش ← أبو صالح ← أبو هريرة رضي الله عنه ← النبي ﷺ", narrator: "أبو هريرة رضي الله عنه", sourceBook: "صحيح مسلم", chapter: "كتاب الذكر والدعاء والتوبة والاستغفار، باب فضل الاجتماع على تلاوة القرآن وعلى الذكر", number: "٢٦٩٩ أ", grade: "صحيح", grader: "أخرجه الإمام مسلم في صحيحه", takhrij: "صحيح مسلم ٢٦٩٩ أ؛ الكتاب ٤٨، الباب ١١.", verifierUrl: "https://dorar.net/hadith", isnadUrl: "https://sunnah.com/muslim:2699", reminderEligible: false },
  },
  {
    id: "dhikr-sayyid-istighfar",
    kind: "adhkar",
    title: "سيد الاستغفار",
    subtitle: "استغفار · صباحًا ومساءً",
    excerpt: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك.",
    body: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
    source: { label: "صحيح البخاري", reference: "كتاب الدعوات، باب أفضل الاستغفار، حديث ٦٣٠٦", url: "https://dorar.net/hadith", site: "الموسوعة الحديثية · الدرر السنية", note: "يُفعّل كتذكير اختياري بعد مراجعة الدرجة والتخريج داخل البطاقة." },
    tags: ["أذكار", "استغفار", "صباح", "مساء"],
    reminder: { category: "الاستغفار", suggestedTime: "صباحًا أو مساءً", repetitions: "مرة واحدة" },
    hadith: { isnad: "أبو معمر ← عبد الوارث ← الحسين ← عبد الله بن بريدة ← بشير بن كعب العدوي ← شداد بن أوس رضي الله عنه ← النبي ﷺ", narrator: "شداد بن أوس رضي الله عنه", sourceBook: "صحيح البخاري", chapter: "كتاب الدعوات، باب أفضل الاستغفار", number: "٦٣٠٦", grade: "صحيح", grader: "أخرجه الإمام البخاري في صحيحه", takhrij: "صحيح البخاري ٦٣٠٦؛ الكتاب ٨٠، الحديث ٣ في ترقيم المصدر.", verifierUrl: "https://dorar.net/hadith", isnadUrl: "https://sunnah.com/bukhari:6306", reminderEligible: true },
  },
  {
    id: "dhikr-subhanallah",
    kind: "adhkar",
    title: "التسبيح صباحًا ومساءً",
    subtitle: "ذكر مطلق · ١٠٠ مرة",
    excerpt: "سبحان الله وبحمده.",
    body: "سبحان الله وبحمده.",
    source: { label: "صحيح مسلم", reference: "كتاب الذكر والدعاء، باب فضل التهليل والتسبيح والدعاء، حديث ٢٦٩٢", url: "https://dorar.net/hadith", site: "الموسوعة الحديثية · الدرر السنية", note: "تظهر درجة الحديث وسنده وعدد التكرار في بطاقة التذكير." },
    tags: ["أذكار", "تسبيح", "صباح", "مساء"],
    reminder: { category: "أذكار الصباح والمساء", suggestedTime: "بعد الفجر أو قبل الغروب", repetitions: "١٠٠ مرة" },
    hadith: { isnad: "محمد بن عبد الملك الأموي ← عبد العزيز بن المختار ← سهيل ← سمي ← أبو صالح ← أبو هريرة رضي الله عنه ← النبي ﷺ", narrator: "أبو هريرة رضي الله عنه", sourceBook: "صحيح مسلم", chapter: "كتاب الذكر والدعاء والتوبة والاستغفار، باب فضل التهليل والتسبيح والدعاء", number: "٢٦٩٢", grade: "صحيح", grader: "أخرجه الإمام مسلم في صحيحه", takhrij: "صحيح مسلم ٢٦٩٢؛ الكتاب ٤٨، الحديث ٣٩ في ترقيم المصدر.", verifierUrl: "https://dorar.net/hadith", isnadUrl: "https://sunnah.com/muslim:2692", reminderEligible: true },
  },
  {
    id: "dhikr-salawat",
    kind: "adhkar",
    title: "الصلاة على النبي ﷺ",
    subtitle: "ذكر عام · تذكير اختياري",
    excerpt: "من صلى علي واحدة صلى الله عليه عشرا.",
    body: "من صلى علي واحدة صلى الله عليه عشرا.",
    source: { label: "صحيح مسلم", reference: "كتاب الصلاة، باب الصلاة على النبي بعد التشهد، حديث ٤٠٨", url: "https://dorar.net/hadith", site: "الموسوعة الحديثية · الدرر السنية", note: "تظهر درجة الحديث والسند والتخريج قبل تفعيل التذكير." },
    tags: ["أذكار", "الصلاة على النبي", "تنبيه"],
    reminder: { category: "الصلاة على النبي ﷺ", suggestedTime: "وقت يحدده المستخدم", repetitions: "يحدده المستخدم" },
    hadith: { isnad: "يحيى بن أيوب، وقتيبة، وابن حجر ← إسماعيل بن جعفر ← العلاء ← أبوه ← أبو هريرة رضي الله عنه ← النبي ﷺ", narrator: "أبو هريرة رضي الله عنه", sourceBook: "صحيح مسلم", chapter: "كتاب الصلاة، باب الصلاة على النبي ﷺ بعد التشهد", number: "٤٠٨", grade: "صحيح", grader: "أخرجه الإمام مسلم في صحيحه", takhrij: "صحيح مسلم ٤٠٨؛ الكتاب ٤، الحديث ٧٤ في ترقيم المصدر.", verifierUrl: "https://dorar.net/hadith", isnadUrl: "https://sunnah.com/muslim:408", reminderEligible: true },
  },
  {
    id: "daily-ward-ikhlas",
    kind: "daily-ward",
    title: "ورد قرآني قصير",
    subtitle: "سورة الإخلاص · ٤ آيات",
    excerpt: "قُلْ هُوَ اللَّهُ أَحَدٌ · اللَّهُ الصَّمَدُ",
    body: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    source: { label: "القرآن الكريم", reference: "سورة الإخلاص، الآيات ١–٤", url: "https://qurancomplex.gov.sa/", site: "مجمع الملك فهد لطباعة المصحف الشريف", note: "الورد القرآني يظهر باسم السورة والآيات ورابط المصدر." },
    tags: ["ورد", "القرآن", "الإخلاص"],
    reminder: { category: "ورد القرآن", suggestedTime: "وقت يحدده المستخدم", repetitions: "قراءة السورة" },
  },
  {
    id: "bidaya-beginning",
    kind: "bidaya",
    title: "كتاب المبتدأ وقصص الأنبياء",
    subtitle: "البداية والنهاية · ابن كثير",
    excerpt: "بطاقة فهرسية موثقة للانتقال إلى أبواب المبتدأ وقصص الأنبياء.",
    body: "بطاقة فهرسية للرجوع إلى موضع كتاب المبتدأ وقصص الأنبياء من البداية والنهاية. لا يقدم التطبيق اقتباسًا من الكتاب إلا مع اسم الطبعة والجزء والصفحة أو عنوان الباب والرابط المرجعي.",
    source: { label: "البداية والنهاية", reference: "ابن كثير، طبعة السعادة، كتاب المبتدأ وقصص الأنبياء", url: "https://shamela.ws/book/23708", site: "المكتبة الشاملة", note: "مرجع طبعة الكتاب والفهرس متاحان من الرابط." },
    tags: ["ابن كثير", "تاريخ", "أنبياء"],
    book: { author: "عماد الدين إسماعيل بن كثير", edition: "طبعة السعادة", publisher: "مطبعة السعادة، القاهرة", location: "كتاب المبتدأ وقصص الأنبياء" },
  },
  {
    id: "ibn-taymiyyah-majmu",
    kind: "ibn-taymiyyah",
    title: "مجموع فتاوى شيخ الإسلام ابن تيمية",
    subtitle: "فهرس الكتاب · الجزء ١ نموذجًا",
    excerpt: "بطاقة فهرسية إلى مجموع الفتاوى مع بيانات الجمع والترتيب والنشر.",
    body: "فهرس موثق لمجموع الفتاوى. يعرض أي نقل من الكتاب مع الجزء والصفحة أو عنوان المسألة، ولا يعرض في التطبيق بوصفه حكمًا جديدًا أو فتوى معاصرة.",
    source: { label: "مجموع الفتاوى", reference: "الجزء ١، فهرس الكتب والرسائل والمسائل", url: "https://shamela.ws/book/7289", site: "المكتبة الشاملة", note: "بيانات الجمع والترتيب والناشر تظهر ضمن بطاقة المصدر." },
    tags: ["ابن تيمية", "فتاوى", "عقيدة"],
    book: { author: "أحمد بن تيمية", edition: "جمع وترتيب عبد الرحمن بن محمد بن قاسم", publisher: "مجمع الملك فهد لطباعة المصحف الشريف، ١٤٢٥ هـ", location: "الجزء ١، فهرس الكتب والرسائل والمسائل" },
  },
  {
    id: "nawawi-riyad",
    kind: "nawawi",
    title: "رياض الصالحين",
    subtitle: "الإمام النووي · باب الإخلاص",
    excerpt: "بطاقة فهرسية لمؤلف الإمام النووي مع بيانات التحقيق والموضع.",
    body: "فهرس موثق لرياض الصالحين. عند عرض أي حديث من الكتاب تُفتح بطاقة الحديث الأصلية بالسند والمصدر والدرجة، ولا يكفي اسم الكتاب وحده لتوثيق متن الحديث.",
    source: { label: "رياض الصالحين", reference: "باب الإخلاص وإحضار النية", url: "https://shamela.ws/book/2348", site: "المكتبة الشاملة", note: "تظهر بيانات المحقق والكتاب والباب، ثم بطاقة الحديث المفصلة لكل نص نبوي." },
    tags: ["النووي", "رياض الصالحين", "حديث"],
    book: { author: "يحيى بن شرف النووي", edition: "تحقيق ماهر ياسين الفحل", location: "باب الإخلاص وإحضار النية" },
  },
  {
    id: "ibn-baz-fatwas",
    kind: "ibn-baz",
    title: "مجموع فتاوى الشيخ ابن باز",
    subtitle: "فهرس الفتاوى من الموقع الرسمي",
    excerpt: "بوابة موثقة للفتاوى والمقالات المنشورة في الموقع الرسمي للشيخ.",
    body: "فهرس إحالي فقط لمجموع فتاوى الشيخ عبد العزيز بن باز من موقعه الرسمي. أي مادة تعرض داخل التطبيق تحمل رابطها المباشر وتاريخ الاطلاع وبيان نوعها، ولا يستخرج التطبيق فتوى من دون رابط المصدر الأصلي.",
    source: { label: "موقع الشيخ ابن باز", reference: "مجموع الفتاوى", url: "https://binbaz.org.sa/fatwas/kind/1", site: "الموقع الرسمي للشيخ ابن باز", note: "المحتوى يقتصر على الرابط الرسمي في قائمة المصادر المسموحة." },
    tags: ["ابن باز", "فتاوى", "مؤلفات"],
    book: { author: "عبد العزيز بن عبد الله بن باز", edition: "فهرس الموقع الرسمي", location: "مجموع الفتاوى" },
  },
  {
    id: "fatwa-ibn-baz-index",
    kind: "fatwa",
    title: "فتاوى الشيخ ابن باز",
    subtitle: "فهرس رسمي · موقع الشيخ ابن باز",
    excerpt: "إحالة موثقة إلى فهرس الفتاوى المنشورة في الموقع الرسمي للشيخ.",
    body: "هذا مدخل فهرسي للفتاوى المنشورة في الموقع الرسمي للشيخ عبد العزيز بن باز. لا يعرض التطبيق فتوى مفردة إلا برابطها المباشر وعنوانها ونوعها وموضعها في المصدر، ولا يقدم جوابًا مخصصًا عن النوازل الشخصية.",
    source: { label: "موقع الشيخ ابن باز", reference: "فهرس مجموع الفتاوى", url: "https://binbaz.org.sa/fatwas/kind/1", site: "الموقع الرسمي للشيخ ابن باز", note: "المادة إحالية إلى المصدر الرسمي، وليست فتوى مولّدة أو جوابًا شخصيًا." },
    tags: ["فتاوى", "ابن باز", "مصدر رسمي"],
    book: { author: "عبد العزيز بن عبد الله بن باز", edition: "فهرس الموقع الرسمي", location: "مجموع الفتاوى" },
  },
  {
    id: "fatwa-ibn-taymiyyah-index",
    kind: "fatwa",
    title: "نقول من مجموع فتاوى ابن تيمية",
    subtitle: "فهرس موثق · لاستخراج الموضع فقط",
    excerpt: "إحالة موثقة إلى فهرس مجموع الفتاوى مع اشتراط ذكر الجزء والصفحة أو عنوان المسألة.",
    body: "هذا مدخل فهرسي لمجموع فتاوى ابن تيمية. أي نقل مفرد يضاف إلى التطبيق يجب أن يحمل الجزء والصفحة أو عنوان المسألة ورابطًا مباشرًا، ولا يوضع في صيغة فتوى معاصرة أو حكم خاص بحالة المستخدم.",
    source: { label: "مجموع فتاوى شيخ الإسلام ابن تيمية", reference: "فهرس الكتب والرسائل والمسائل", url: "https://shamela.ws/book/7289", site: "المكتبة الشاملة", note: "يظهر المصدر وموضع النص وبيانات الطبعة قبل أي اقتباس." },
    tags: ["فتاوى", "ابن تيمية", "مراجع"],
    book: { author: "أحمد بن تيمية", edition: "جمع وترتيب عبد الرحمن بن محمد بن قاسم", publisher: "مجمع الملك فهد لطباعة المصحف الشريف، ١٤٢٥ هـ", location: "فهرس الكتب والرسائل والمسائل" },
  },
  {
    id: "maliki-muwatta",
    kind: "maliki",
    title: "الموطأ",
    subtitle: "الإمام مالك · كتاب وقوت الصلاة",
    excerpt: "بطاقة فهرسية موثقة لكتاب الموطأ برواية يحيى وتحقيق محمد فؤاد عبد الباقي.",
    body: "فهرس موثق للموطأ. الأحاديث داخله لا تُعرض بوصفها مادة مستقلة إلا مع رقمها وسندها وتخريجها ودرجة الحديث في البطاقة المفصلة.",
    source: { label: "الموطأ", reference: "رواية يحيى، كتاب وقوت الصلاة", url: "https://shamela.ws/book/1699", site: "المكتبة الشاملة", note: "تظهر بيانات التحقيق والنشر وفهرس الأبواب في المصدر." },
    tags: ["مالك", "مالكي", "موطأ"],
    book: { author: "مالك بن أنس", edition: "رواية يحيى، تحقيق محمد فؤاد عبد الباقي", publisher: "دار إحياء التراث العربي، ١٤٠٦ هـ", location: "كتاب وقوت الصلاة" },
  },
  {
    id: "shafii-umm",
    kind: "shafii",
    title: "الأم",
    subtitle: "الإمام الشافعي · فهرس الكتاب",
    excerpt: "بطاقة فهرسية إلى كتاب الأم مع بيانات المؤلف والطبعة المرجعية.",
    body: "فهرس موثق لكتاب الأم. تعرض المواد الفقهية باسم الكتاب والباب والموضع، ولا تتحول بطاقة الفهرس إلى فتوى شخصية أو جواب مخصص للمستخدم.",
    source: { label: "الأم", reference: "فهرس الكتاب", url: "https://shamela.ws/book/1655", site: "المكتبة الشاملة", note: "المرجع يبين نسبة الكتاب إلى الإمام الشافعي وبيانات طبعة دار الفكر." },
    tags: ["شافعي", "الشافعي", "فقه"],
    book: { author: "محمد بن إدريس الشافعي", edition: "طبعة دار الفكر", publisher: "دار الفكر، بيروت", location: "فهرس الكتاب" },
  },
  {
    id: "hanbali-musnad",
    kind: "hanbali",
    title: "مسند الإمام أحمد",
    subtitle: "الإمام أحمد بن حنبل · طبعة الرسالة",
    excerpt: "بطاقة فهرسية لمسند الإمام أحمد مع بيانات التحقيق المرجعي.",
    body: "فهرس موثق لمسند الإمام أحمد. كل رواية حديثية من المسند تتطلب بطاقة حديث مستقلة بالسند والمصدر والتخريج والدرجة، ولا يكتفى بعنوان المسند لتقرير صحة الحديث.",
    source: { label: "مسند الإمام أحمد", reference: "طبعة الرسالة", url: "https://shamela.ws/book/25794", site: "المكتبة الشاملة", note: "تظهر بيانات التحقيق وموضع الرواية في المرجع." },
    tags: ["أحمد", "حنبلي", "مسند"],
    book: { author: "أحمد بن حنبل", edition: "تحقيق شعيب الأرنؤوط وآخرين، طبعة الرسالة", location: "فهرس المسند" },
  },
  {
    id: "hanafi-mabsut",
    kind: "hanafi",
    title: "المبسوط للسرخسي",
    subtitle: "من كتب المذهب الحنفي",
    excerpt: "بطاقة فهرسية إلى المبسوط بوصفه من كتب المذهب الحنفي لا تأليفًا مباشرًا للإمام أبي حنيفة.",
    body: "فهرس موثق للمبسوط. يحافظ التطبيق على النسبة العلمية الدقيقة: الكتاب لشمس الأئمة السرخسي، وهو من الكتب المعتمدة في المذهب الحنفي، ولا ينسب إلى الإمام أبي حنيفة مباشرة.",
    source: { label: "المبسوط", reference: "فهرس الكتاب", url: "https://shamela.ws/book/5423", site: "المكتبة الشاملة", note: "تظهر بيانات المؤلف والناشر والمواضع في المصدر." },
    tags: ["حنفي", "السرخسي", "فقه"],
    book: { author: "شمس الأئمة السرخسي", edition: "طبعة مطبعة السعادة", publisher: "مطبعة السعادة، مصر", location: "فهرس الكتاب" },
  },
  {
    id: "tawhid-book",
    kind: "tawhid",
    title: "كتاب التوحيد",
    subtitle: "محمد بن عبد الوهاب · باب فضل التوحيد",
    excerpt: "بطاقة فهرسية موثقة إلى كتاب التوحيد وأبوابه في المصدر المرجعي.",
    body: "فهرس موثق لكتاب التوحيد المطبوع ضمن مؤلفات الشيخ محمد بن عبد الوهاب. أي نص أو استدلال من أبوابه يتطلب ذكر الباب والموضع والرابط ومرجع الآية أو الحديث الوارد فيه.",
    source: { label: "كتاب التوحيد", reference: "باب فضل التوحيد وما يكفر الذنوب", url: "https://shamela.ws/book/11318", site: "المكتبة الشاملة", note: "يظهر المؤلف وفهرس الأبواب في المصدر، وتوثق النصوص الشرعية داخله بصورة مستقلة." },
    tags: ["توحيد", "محمد بن عبد الوهاب", "عقيدة"],
    book: { author: "محمد بن عبد الوهاب بن سليمان التميمي النجدي", edition: "مطبوع ضمن مؤلفات الشيخ محمد بن عبد الوهاب، الجزء الأول", location: "باب فضل التوحيد وما يكفر الذنوب" },
  },
];

export function isAllowedSourceUrl(url: string) {
  try {
    return allowedSourceHosts.includes(new URL(url).hostname as (typeof allowedSourceHosts)[number]);
  } catch {
    return false;
  }
}

export function hasCompleteCitation(item: LibraryItem) {
  const basic = Boolean(item.source.label && item.source.reference && item.source.site && isAllowedSourceUrl(item.source.url));
  if (!basic) return false;
  if (item.hadith) {
    return Boolean(item.hadith.isnad && item.hadith.narrator && item.hadith.sourceBook && item.hadith.chapter && item.hadith.number && item.hadith.grade && item.hadith.grader && item.hadith.takhrij && isAllowedSourceUrl(item.hadith.verifierUrl) && isAllowedSourceUrl(item.hadith.isnadUrl));
  }
  if (item.tafsir) return Boolean(item.tafsir.tafsirName && item.tafsir.scholar && item.tafsir.ayahRange && isAllowedSourceUrl(item.tafsir.tafsirUrl));
  if (item.book) return Boolean(item.book.author && item.book.edition && item.book.location);
  if (item.qiraat) return Boolean(item.qiraat.qari && item.qiraat.riwayah && item.qiraat.tariq && item.qiraat.locus && isAllowedSourceUrl(item.qiraat.qiraatSource));
  if (item.recitations) return item.recitations.every((recording) => Boolean(recording.title && recording.reciter && recording.riwayah && recording.publisher && recording.license && recording.note && isAllowedSourceUrl(recording.sourcePage) && isAllowedSourceUrl(recording.audioUrl) && /^https:\/\/creativecommons\.org\//.test(recording.licenseUrl)));
  return true;
}

export const verifiedLibraryItems = libraryItems.filter(hasCompleteCitation);
