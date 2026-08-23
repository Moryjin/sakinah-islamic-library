import type { LibraryKind } from "@/data/sakinah-library";

export type BookCatalogEntry = {
  kind: LibraryKind;
  title: string;
  description: string;
  catalogLabel: string;
  catalogUrl: string;
  localStatus: "available" | "source-only";
};

export const bookCatalog: Record<LibraryKind, BookCatalogEntry> = {
  quran: { kind: "quran", title: "القرآن الكريم", description: "المصحف كاملًا داخل سَكينة مع حزمة محلية اختيارية.", catalogLabel: "فتح قارئ المصحف", catalogUrl: "https://api.alquran.cloud/v1/surah", localStatus: "available" },
  qiraat: { kind: "qiraat", title: "القراءات العشر", description: "فهرس مرجعي للقراءات والروايات من المصدر المصحفي.", catalogLabel: "فتح فهرس القراءات", catalogUrl: "https://qurancomplex.gov.sa/", localStatus: "source-only" },
  tafsir: { kind: "tafsir", title: "كتب التفسير", description: "مداخل تفسيرية موثقة مع وصول إلى فهرس جامعة الملك سعود.", catalogLabel: "فتح فهرس التفاسير", catalogUrl: "https://quran.ksu.edu.sa/tafseer/", localStatus: "source-only" },
  bukhari: { kind: "bukhari", title: "صحيح البخاري", description: "النص وفهرس ٩٧ كتابًا داخل سَكينة مع تنزيل اختياري.", catalogLabel: "فتح قارئ البخاري", catalogUrl: "https://github.com/fawazahmed0/hadith-api", localStatus: "available" },
  muslim: { kind: "muslim", title: "صحيح مسلم", description: "النص والفهرس داخل سَكينة مع تنزيل اختياري.", catalogLabel: "فتح قارئ مسلم", catalogUrl: "https://github.com/fawazahmed0/hadith-api", localStatus: "available" },
  adhkar: { kind: "adhkar", title: "الأذكار والأدعية", description: "فهرس حصن المسلم ونصوصه الموثقة داخل التطبيق.", catalogLabel: "فتح فهرس الأذكار", catalogUrl: "https://hisnmuslim.com/i/ar/1", localStatus: "source-only" },
  "daily-ward": { kind: "daily-ward", title: "الورد اليومي", description: "يفتح المصحف المتسلسل ويعمل دون اتصال بعد تنزيل الحزمة.", catalogLabel: "فتح الورد", catalogUrl: "https://api.alquran.cloud/v1/surah", localStatus: "available" },
  bidaya: { kind: "bidaya", title: "البداية والنهاية", description: "وصول إلى فهرس الكتاب كاملًا ومواضعه من المصدر المكتبي.", catalogLabel: "فتح فهرس البداية والنهاية", catalogUrl: "https://shamela.ws/book/23708", localStatus: "source-only" },
  "ibn-taymiyyah": { kind: "ibn-taymiyyah", title: "مؤلفات ابن تيمية", description: "وصول موثق إلى مجموع الفتاوى وفهرس الكتب والرسائل والمسائل.", catalogLabel: "فتح مجموع الفتاوى", catalogUrl: "https://shamela.ws/book/7289", localStatus: "source-only" },
  nawawi: { kind: "nawawi", title: "مؤلفات الإمام النووي", description: "فهرس مؤلف يجمع الأذكار والأربعين والمجموع والروضة وشرح مسلم وغيرها.", catalogLabel: "فتح فهرس مؤلفات النووي", catalogUrl: "https://shamela.ws/author/44", localStatus: "source-only" },
  "ibn-baz": { kind: "ibn-baz", title: "مؤلفات الشيخ ابن باز", description: "فهرس رسمي للكتب العربية والمترجمة مع صفحات PDF فردية من الموقع الرسمي.", catalogLabel: "فتح فهرس كتب ابن باز", catalogUrl: "https://binbaz.org.sa/books", localStatus: "source-only" },
  fatwa: { kind: "fatwa", title: "الفتاوى الموثقة", description: "وصول مباشر إلى فهرس الفتاوى الرسمي مع حفظ المصدر والموضع.", catalogLabel: "فتح فهرس الفتاوى", catalogUrl: "https://binbaz.org.sa/fatwas", localStatus: "source-only" },
  hanafi: { kind: "hanafi", title: "المذهب الحنفي", description: "فهرس مؤلفات أبي حنيفة المتاحة ومداخل الكتب المعتمدة في المذهب.", catalogLabel: "فتح فهرس أبي حنيفة", catalogUrl: "https://shamela.ws/author/602", localStatus: "source-only" },
  maliki: { kind: "maliki", title: "المذهب المالكي", description: "فهرس مؤلفات الإمام مالك، ومنها الموطأ، في المصدر المكتبي.", catalogLabel: "فتح فهرس الإمام مالك", catalogUrl: "https://shamela.ws/author/214", localStatus: "source-only" },
  shafii: { kind: "shafii", title: "المذهب الشافعي", description: "فهرس مؤلفات الإمام الشافعي في المصدر المكتبي، ومنها الأم والرسالة.", catalogLabel: "فتح فهرس الإمام الشافعي", catalogUrl: "https://shamela.ws/author/20", localStatus: "source-only" },
  hanbali: { kind: "hanbali", title: "المذهب الحنبلي", description: "فهرس مؤلفات الإمام أحمد، ومنها المسند والعلل والمسائل، في المصدر المكتبي.", catalogLabel: "فتح فهرس الإمام أحمد", catalogUrl: "https://shamela.ws/author/220", localStatus: "source-only" },
  tawhid: { kind: "tawhid", title: "كتاب التوحيد", description: "فهرس أبواب كتاب التوحيد وبياناته المرجعية من المصدر المكتبي.", catalogLabel: "فتح فهرس كتاب التوحيد", catalogUrl: "https://shamela.ws/book/11318", localStatus: "source-only" },
};
