import type { LibraryKind } from "@/data/sakinah-library";

export type BookDelivery = {
  kind: LibraryKind;
  onlineMode: "direct" | "source-link";
  localMode: "available" | "not-licensed" | "planned";
  sourceLabel: string;
  sourceUrl: string;
  note: string;
};

export const bookDelivery: BookDelivery[] = [
  { kind: "quran", onlineMode: "direct", localMode: "available", sourceLabel: "Al Quran Cloud · مجمع الملك فهد", sourceUrl: "https://api.alquran.cloud/v1/surah", note: "المصحف الكامل يعرض داخل سَكينة بآيات متسلسلة، مع تنزيل اختياري لقراءته دون اتصال." },
  { kind: "qiraat", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "مجمع الملك فهد لطباعة المصحف", sourceUrl: "https://qurancomplex.gov.sa/", note: "قراءة مرجعية من المصدر المصحفي؛ لا يعاد توزيع ملفات القراءات بلا رخصة صريحة." },
  { kind: "tafsir", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "مشروع المصحف الإلكتروني · جامعة الملك سعود", sourceUrl: "https://quran.ksu.edu.sa/tafseer/", note: "مسارات قراءة السعدي والبغوي وابن كثير والقرطبي والطبري موثقة من المصدر." },
  { kind: "bukhari", onlineMode: "direct", localMode: "available", sourceLabel: "Hadith API · ara-bukhari", sourceUrl: "https://github.com/fawazahmed0/hadith-api", note: "النص العربي الكامل وفهرس ٩٧ كتابًا متاحان داخل التطبيق مع تنزيل اختياري." },
  { kind: "muslim", onlineMode: "direct", localMode: "available", sourceLabel: "Hadith API · ara-muslim", sourceUrl: "https://github.com/fawazahmed0/hadith-api", note: "النص العربي الكامل وفهرس الكتب متاحان داخل التطبيق مع تنزيل اختياري." },
  { kind: "adhkar", onlineMode: "direct", localMode: "planned", sourceLabel: "حصن المسلم", sourceUrl: "https://hisnmuslim.com/i/ar/1", note: "فهرس الأبواب والنصوص يظهر داخل التطبيق من المصدر الشبكي؛ حزمة أوفلاين منظمة قيد الإعداد." },
  { kind: "daily-ward", onlineMode: "direct", localMode: "available", sourceLabel: "مصحف سَكينة", sourceUrl: "https://api.alquran.cloud/v1/surah", note: "الورد يفتح قارئ المصحف المتسلسل ويعمل دون اتصال بعد تنزيل حزمة المصحف." },
  { kind: "bidaya", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرسة ووصول شبكي من المصدر؛ لا تنزّل نسخة النص إلا عند رخصة إعادة توزيع صريحة." },
  { kind: "ibn-taymiyyah", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "مسار قراءة وفهرسة شبكي موثق لمؤلفات ابن تيمية." },
  { kind: "nawawi", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "مسار قراءة وفهرسة شبكي موثق لمؤلفات الإمام النووي." },
  { kind: "ibn-baz", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "الموقع الرسمي للشيخ ابن باز", sourceUrl: "https://binbaz.org.sa/books", note: "كتب وملفات PDF رسمية مع شرط ذكر المصدر كما يوضحه الموقع." },
  { kind: "fatwa", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "الموقع الرسمي للشيخ ابن باز", sourceUrl: "https://binbaz.org.sa/fatwas", note: "وصول شبكي مباشر إلى الفتاوى الرسمية؛ لا تحفظ محليًا بلا ترخيص صريح." },
  { kind: "hanafi", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرس ووصول شبكي للكتب المنسوبة للمذهب الحنفي." },
  { kind: "maliki", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرس ووصول شبكي للكتب المنسوبة للمذهب المالكي." },
  { kind: "shafii", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرس ووصول شبكي للكتب المنسوبة للمذهب الشافعي." },
  { kind: "hanbali", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرس ووصول شبكي للكتب المنسوبة للمذهب الحنبلي." },
  { kind: "tawhid", onlineMode: "source-link", localMode: "not-licensed", sourceLabel: "المكتبة الشاملة", sourceUrl: "https://shamela.ws/", note: "فهرس ووصول شبكي لكتاب التوحيد مع حفظ بيانات المصدر." },
];
