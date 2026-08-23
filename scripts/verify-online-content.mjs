const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

const quranResponse = await fetch("https://api.alquran.cloud/v1/surah");
expect(quranResponse.ok, `فشل فهرس القرآن: ${quranResponse.status}`);
const quranPayload = await quranResponse.json();
expect(Array.isArray(quranPayload.data) && quranPayload.data.length === 114, "فهرس القرآن لا يحتوي ١١٤ سورة");

const bukhariResponse = await fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json");
expect(bukhariResponse.ok, `فشل فهرس البخاري: ${bukhariResponse.status}`);
const bukhariPayload = await bukhariResponse.json();
const books = Object.keys(bukhariPayload.metadata.sections).filter((id) => Number(id) > 0);
expect(books.length === 97, "فهرس البخاري لا يحتوي ٩٧ كتابًا");

console.log(JSON.stringify({ quranSurahs: quranPayload.data.length, bukhariBooks: books.length }));
