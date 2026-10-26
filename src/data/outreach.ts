/**
 * Science communication on YouTube (and Instagram cross-posts). The lists below hold the fixed facts
 * (titles, durations, dates); view counts live in ./outreach-views.json, a dated snapshot of the public
 * YouTube watch pages that `npm run refresh:views` renews (CI does so on every deploy and weekly).
 * Titles are the original Turkish titles with the repeated programme suffix removed;
 * originalTitle keeps the exact YouTube title for verification. See docs/SOURCES.md.
 */
import snapshot from './outreach-views.json';

export type OutreachTheme = 'cosmos' | 'thinking' | 'quantum' | 'nobel' | 'ai' | 'sinanoglu' | 'academia' | 'history';
export type LessonTopic = 'intro' | 'field' | 'gauss' | 'potential' | 'math';
export type OtherGroupId = 'haberturk' | 'muhakeme' | 'taslaman' | 'interviews' | 'vav' | 'literat';

export interface Video {
  id: string;
  title: string;
  originalTitle: string;
  lang: 'tr' | 'en';
  /** Other people named in the title or description. */
  with?: readonly string[];
  durationSeconds: number;
  views: number;
  /** YouTube publication date (Europe/Istanbul). */
  published: string;
  /** Original broadcast date stated in the video description, when it differs. */
  aired?: string;
  theme?: OutreachTheme;
  topic?: LessonTopic;
  /** Optional illustration for the card (see VideoCard). */
  glyph?: 'sun' | 'halo' | 'bubbles' | 'expansion' | 'ladder' | 'curve';
  format: 'short' | 'video';
  /** Channel, when it is not Teke Tek Bilim or the personal channel. */
  channel?: string;
  /** Television or YouTube programme on that channel (other channels only). */
  programme?: string;
  /** Block of the "other channels" section (see otherChannelGroups). */
  group?: OtherGroupId;
  /** The same clip posted on Instagram, with its view count as Instagram shows it (see instagramSnapshot). */
  instagram?: { url: string; views: number };
}

/** A video as written below; its view count is added from the snapshot. */
type Entry = Omit<Video, 'views'>;
const counts: Record<string, number> = snapshot.views;
const withViews = (list: readonly Entry[]): readonly Video[] => list.map((video) => ({ ...video, views: counts[video.id] ?? 0 }));
/** Most watched first, as of the current snapshot. */
const byViews = (list: readonly Video[]): readonly Video[] => [...list].sort((a, b) => b.views - a.views);

export const outreachSnapshot = {
  checkedOn: snapshot.checkedOn,
  source: snapshot.source,
} as const;

/** Instagram shows view counts only to signed-in users: these figures are entered by hand. */
export const instagramSnapshot = {
  checkedOn: '2026-10-26',
  source: 'The Instagram app (reels tab of @teketektv), as reported by the author',
} as const;

export const channels = {
  tekeTekBilim: { name: 'Teke Tek Bilim', handle: '@TekeTekBilim', url: 'https://www.youtube.com/@TekeTekBilim' },
  bilimEkstraPlaylist: { name: 'Prof. Dr. Emre Onur Kahya ile Bilim Ekstra', url: 'https://www.youtube.com/playlist?list=PLIWPLnDgfo-UvehLkGjmXCRuW2pAA6MGJ' },
  own: { name: 'Emre Onur Kahya', handle: '@emreonurkahya', url: 'https://www.youtube.com/@emreonurkahya', playlists: 'https://www.youtube.com/@emreonurkahya/playlists' },
  instagram: { name: 'Instagram', handle: '@emreokahya', url: 'https://www.instagram.com/emreokahya/' },
  x: { name: 'X', handle: '@EmreOnurKahya', url: 'https://x.com/EmreOnurKahya' },
  literat: { name: 'Literat', handle: '@Literatsf', url: 'https://www.youtube.com/@Literatsf' },
  haberGlobal: { name: 'Haber Global', handle: '@haberglobal', url: 'https://www.youtube.com/@haberglobal' },
} as const;

/** Long-form Teke Tek Bilim conversations, most watched first. */
export const conversations: readonly Video[] = byViews(withViews([
  { id: "qp0k-ak7f7c", title: "Yapay zeka 2030'da insanlığı yok edecek mi?", originalTitle: "Yapay zeka 2030'da insanlığı yok edecek mi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 4865, published: '2026-09-27', theme: 'ai', format: 'video' },
  { id: "kPym_ScuZqE", title: "Zamanın olmadığı bir evren var mı? Çoklu evren gerçekten var mıdır?", originalTitle: "Zamanın olmadığı bir evren var mı? Çoklu evren gerçekten var mıdır?  - Teke Tek Bilim", lang: 'tr', with: ["Prof. Dr. İbrahim Semiz", "Prof. Dr. Erkcan Özcan", "Fatih Altaylı"], durationSeconds: 6152, published: '2023-08-16', aired: '2021-09-12', theme: 'cosmos', glyph: 'bubbles', format: 'video' },
  { id: "82JvCjvvl-4", title: "Güneş patlaması?", originalTitle: "Güneş patlaması? / Prof. Dr. Emre Onur Kahya & Dr. Umut Yıldız & Fatih Altaylı - Teke Tek Bilim", lang: 'tr', with: ["Dr. Umut Yıldız", "Fatih Altaylı"], durationSeconds: 5173, published: '2023-12-24', theme: 'cosmos', glyph: 'sun', format: 'video' },
  { id: "d7j3j0-rhb8", title: "Karanlık madde evreni nasıl şekillendiriyor?", originalTitle: "Karanlık madde evreni nasıl şekillendiriyor? / Prof. Dr. Bora Işıldak & Prof. Dr. Emre Onur Kahya", lang: 'tr', with: ["Prof. Dr. Bora Işıldak"], durationSeconds: 5792, published: '2025-04-13', theme: 'cosmos', glyph: 'halo', format: 'video' },
  { id: "4ajZtcQ3bPU", title: "Modern bilimin doğuşu", originalTitle: "Modern bilimin doğuşu / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 7297, published: '2025-08-24', theme: 'history', format: 'video' },
  { id: "yhBXgsPVruU", title: "Fizik ve yapay zeka?", originalTitle: "Fizik ve yapay zeka? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı - Teke Tek Bilim", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 4636, published: '2024-03-24', theme: 'ai', format: 'video' },
  { id: "MsMYj4Ac2b4", title: "Bilime yön veren buluşlar neler? Einstein'ı farklı kılan neydi?", originalTitle: "Bilime yön veren buluşlar neler? Einstein'ı farklı kılan neydi?  - Teke Tek Bilim", lang: 'tr', with: ["Prof. Dr. Tekin Dereli", "Dr. Can Kozcaz", "Fatih Altaylı"], durationSeconds: 5950, published: '2023-08-20', aired: '2021-08-01', theme: 'history', format: 'video' },
]));

/** Short clips cut from the conversations above, most watched first. */
export const clips: readonly Video[] = byViews(withViews([
  { id: "Jb4xXribPwk", title: "Evren hızlanarak genişler mi?", originalTitle: "Evren hızlanarak genişler mi? / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 90, published: '2025-08-24', theme: 'cosmos', glyph: 'expansion', format: 'short', instagram: { url: 'https://www.instagram.com/teketektv/reel/DNulCieWIA5/', views: 206_000 } },
  { id: "bvol2_D9gmo", title: "Yapay zekanın fişi çekilebilir mi?", originalTitle: "Yapay zekanın fişi çekilebilir mi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 75, published: '2026-09-27', theme: 'ai', format: 'short', instagram: { url: 'https://www.instagram.com/teketektv/reel/Dd_hKMlO3Zm/', views: 768_000 } },
  { id: "aCB1NGFv5bg", title: "Yapay zeka Hugging Face'i nasıl hackledi?", originalTitle: "Yapay zeka Hugging Face'i nasıl hackledi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 108, published: '2026-09-27', theme: 'ai', format: 'short', instagram: { url: 'https://www.instagram.com/teketektv/reel/DdyJ3LbO8RP/', views: 1_000_000 } },
  { id: "THYGEmgNYBM", title: "Einstein & Newton fiziği farkı", originalTitle: "Einstein & Newton fiziği farkı / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 90, published: '2025-08-24', theme: 'history', glyph: 'curve', format: 'short', instagram: { url: 'https://www.instagram.com/teketektv/reel/DN7cFl9DA_A/', views: 87_900 } },
  { id: "oWuN0gZTxKQ", title: "Kozmik merdivende sapmayı nasıl bulabiliyoruz?", originalTitle: "Kozmik merdivende sapmayı nasıl bulabiliyoruz? / Prof. Dr. Bora Işıldak & Prof. Dr. Emre Onur Kahya", lang: 'tr', with: ["Prof. Dr. Bora Işıldak"], durationSeconds: 60, published: '2025-04-13', theme: 'cosmos', glyph: 'ladder', format: 'short' },
]));

export const bilimEkstraThemes: readonly { id: OutreachTheme; title: string; titleTr: string }[] = [
  { id: 'cosmos', title: "Spacetime, light and the cosmos", titleTr: "Uzay-zaman, ışık ve evren" },
  { id: 'quantum', title: "Pioneers of quantum physics", titleTr: "Kuantumun öncüleri" },
  { id: 'nobel', title: "A history of the Nobel Prize in Physics", titleTr: "Nobel Fizik Ödülü'nün tarihi" },
  { id: 'ai', title: "Artificial intelligence", titleTr: "Yapay zekâ" },
  { id: 'thinking', title: "Thinking like a physicist", titleTr: "Fizikçi gibi düşünmek" },
  { id: 'sinanoglu', title: "Oktay Sinanoğlu", titleTr: "Oktay Sinanoğlu" },
  { id: 'academia', title: "Universities and science in Türkiye", titleTr: "Türkiye'de üniversite ve bilim" },
];

/** Bilim Ekstra — the Teke Tek Bilim series with Emre Onur Kahya, in publication order. */
export const bilimEkstra: readonly Video[] = withViews([
  { id: "nJQPGsmmdPQ", title: "Einstein hatalı mı?", originalTitle: "Einstein hatalı mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1179, published: '2024-02-14', theme: 'cosmos', format: 'video' },
  { id: "JADuyTQfguY", title: "Işık hızına ulaşılabilir mi?", originalTitle: "Işık hızına ulaşılabilir mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1248, published: '2024-02-21', theme: 'cosmos', format: 'video' },
  { id: "PmNw8fFhs0k", title: "Uzay - zaman nedir?", originalTitle: "Uzay - zaman nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1291, published: '2024-02-28', theme: 'cosmos', format: 'video' },
  { id: "1Xx2tlbfDNw", title: "Kara deliklerin içerisinde ne var?", originalTitle: "Kara deliklerin içerisinde ne var? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1479, published: '2024-03-06', theme: 'cosmos', format: 'video' },
  { id: "lRbrbHrbbKY", title: "Fizikçi gibi düşünmek?", originalTitle: "Fizikçi gibi düşünmek? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1370, published: '2024-03-13', theme: 'thinking', format: 'video' },
  { id: "KqeaH-YvDPU", title: "Fizikçi gibi düşünen insanlar?", originalTitle: "Fizikçi gibi düşünen insanlar? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1073, published: '2024-03-15', theme: 'thinking', format: 'video' },
  { id: "Lv_NxqHj_qM", title: "Yapay zeka fizikçi gibi düşünebilir mi?", originalTitle: "Yapay zeka fizikçi gibi düşünebilir mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1240, published: '2024-04-03', theme: 'ai', format: 'video' },
  { id: "EuyMFspKzDs", title: "Anti-maddenin babası: Paul Dirac", originalTitle: "Anti-maddenin babası: Paul Dirac / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1521, published: '2024-04-17', theme: 'quantum', format: 'video' },
  { id: "cC4NBjfPWlk", title: "Dirac'ın bilime katkıları?", originalTitle: "Dirac'ın bilime katkıları? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1523, published: '2024-04-24', theme: 'quantum', format: 'video' },
  { id: "xQbsIa2IoRo", title: "Türk Einstein'ı Oktay Sinanoğlu'nun eğitimi? (Bölüm 1)", originalTitle: "Türk Einstein'ı Oktay Sinanoğlu'nun eğitimi? (Bölüm 1) / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1682, published: '2024-05-01', theme: 'sinanoglu', format: 'video' },
  { id: "mXGI39n7Pvo", title: "Oktay Sinanoğlu'nun bilimsel çalışmaları?", originalTitle: "Oktay Sinanoğlu'nun bilimsel çalışmaları? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1285, published: '2024-05-08', theme: 'sinanoglu', format: 'video' },
  { id: "2XeZPcLvWL0", title: "Oktay Sinanoğlu ve Türk dili?", originalTitle: "Oktay Sinanoğlu ve Türk dili? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1329, published: '2024-05-15', theme: 'sinanoglu', format: 'video' },
  { id: "ml1VdqDPhck", title: "Karanlık Madde nedir?", originalTitle: "Karanlık Madde nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1537, published: '2024-05-22', theme: 'cosmos', format: 'video' },
  { id: "sX36LuMZfGc", title: "Karanlık Enerji nedir?", originalTitle: "Karanlık Enerji nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1227, published: '2024-05-29', theme: 'cosmos', format: 'video' },
  { id: "cos6T0a09Ds", title: "Paralel evrenler?", originalTitle: "Paralel evrenler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1264, published: '2024-06-05', theme: 'cosmos', format: 'video' },
  { id: "2Xn5jPMbXJI", title: "Kuantum ve paralel evren?", originalTitle: "Kuantum ve paralel evren? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1132, published: '2024-06-12', theme: 'cosmos', format: 'video' },
  { id: "NpDgs_wL07g", title: "Yapay zekanın son yıllardaki gelişimi?", originalTitle: "Yapay zekanın son yıllardaki gelişimi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2091, published: '2024-06-26', theme: 'ai', format: 'video' },
  { id: "QqmJR5PzgnE", title: "Yapay zekanın geleceği?", originalTitle: "Yapay zekanın geleceği? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1709, published: '2024-07-03', theme: 'ai', format: 'video' },
  { id: "DadYoGonAv0", title: "Yapay zeka dost mu düşman mı?", originalTitle: "Yapay zeka dost mu düşman mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2012, published: '2024-07-10', theme: 'ai', format: 'video' },
  { id: "2wCCPh-s3ZE", title: "Yapay zeka ile yok olacak meslekler?", originalTitle: "Yapay zeka ile yok olacak meslekler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2130, published: '2024-07-17', theme: 'ai', format: 'video' },
  { id: "ryeEbu0PO4A", title: "Üniversite ve bölüm tercihlerimizi nasıl yapmalıyız?", originalTitle: "Üniversite ve bölüm tercihlerimizi nasıl yapmalıyız? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1904, published: '2024-07-24', theme: 'academia', format: 'video' },
  { id: "OHTeQcTq3tw", title: "Sizden gelen sorular?", originalTitle: "Sizden gelen sorular? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2104, published: '2024-07-31', theme: 'thinking', format: 'video' },
  { id: "Gv622j1Xc1k", title: "Bilincin kaynağı kuantum mu?", originalTitle: "Bilincin kaynağı kuantum mu? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1319, published: '2024-08-14', theme: 'thinking', format: 'video' },
  { id: "IvBqqQ6nk0M", title: "Astroloji ve Bilim?", originalTitle: "Astroloji ve Bilim? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1367, published: '2024-08-21', theme: 'thinking', format: 'video' },
  { id: "Fdrkc1SXFYM", title: "Yapay zekayı öğrenmeye nereden başlanır?", originalTitle: "Yapay zekayı öğrenmeye nereden başlanır? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1809, published: '2024-08-28', theme: 'ai', format: 'video' },
  { id: "RaGohz1XYyU", title: "Algoritma nasıl çalışır?", originalTitle: "Algoritma nasıl çalışır? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1215, published: '2024-09-04', theme: 'ai', format: 'video' },
  { id: "bO6KqytsoEQ", title: "Akademik makale nasıl değerlendirilir?", originalTitle: "Akademik makale nasıl değerlendirilir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1506, published: '2024-09-18', theme: 'academia', format: 'video' },
  { id: "0LUQTDDcR7o", title: "Türkiye’deki üniversitelerin 2024 karnesi?", originalTitle: "Türkiye’deki üniversitelerin 2024 karnesi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1365, published: '2024-09-25', theme: 'academia', format: 'video' },
  { id: "nqKShJxGhUk", title: "Türkiye'de fiziksel bilimler?", originalTitle: "Türkiye'de fiziksel bilimler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1286, published: '2024-10-02', theme: 'academia', format: 'video' },
  { id: "ve19jk24oYA", title: "Tarihin en tartışmalı Nobel Fizik Ödülü?", originalTitle: "Tarihin en tartışmalı Nobel Fizik Ödülü? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1231, published: '2024-10-16', theme: 'nobel', format: 'video' },
  { id: "_svlbBq3oVU", title: "Bilgisayarın Nobel'i nedir?", originalTitle: "Bilgisayarın Nobel'i nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 930, published: '2024-10-23', theme: 'nobel', format: 'video' },
  { id: "WeT9WQniVtE", title: "1927 Solvay Konferansı’ndan önce neler oldu?", originalTitle: "1927 Solvay Konferansı’ndan önce neler oldu? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2169, published: '2024-11-13', theme: 'nobel', format: 'video' },
  { id: "qpqdNgCJUho", title: "1928'den 1950'ye Nobel ödülleri?", originalTitle: "1928'den 1950'ye Nobel ödülleri? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1193, published: '2024-11-20', theme: 'nobel', format: 'video' },
  { id: "rK-s10cdHn0", title: "1950'den 1970'e Nobel ödülleri", originalTitle: "1950'den 1970'e Nobel ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2458, published: '2024-12-04', theme: 'nobel', format: 'video' },
  { id: "FuzQvRkgVG8", title: "1970'ten 1990'a Nobel ödülleri", originalTitle: "1970'ten 1990'a Nobel ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1852, published: '2024-12-11', theme: 'nobel', format: 'video' },
  { id: "hlYtcBTaTLY", title: "1990'dan 2007'ye Nobel Ödülleri", originalTitle: "1990'dan 2007'ye Nobel Ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1813, published: '2025-01-08', theme: 'nobel', format: 'video' },
  { id: "OhAbNkbT924", title: "2008'den 2024'e Nobel Ödülleri", originalTitle: "2008'den 2024'e Nobel Ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2012, published: '2025-01-15', theme: 'nobel', format: 'video' },
  { id: "SzF6f3cHwos", title: "DeepSeek: Çin’in Manhattan Projesi anı geldi mi?", originalTitle: "DeepSeek: Çin’in Manhattan Projesi anı geldi mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1271, published: '2025-02-05', theme: 'ai', format: 'video' },
  { id: "YGfVRbl9hN8", title: "DeepSeek: Geleceğin Teknolojisi – Teknik İnceleme", originalTitle: "DeepSeek: Geleceğin Teknolojisi – Teknik İnceleme / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2104, published: '2025-02-12', theme: 'ai', format: 'video' },
  { id: "gb8PTa25Tvc", title: "Geleceğin İş Akışları: Agentik Yapay Zeka Devrimi", originalTitle: "Geleceğin İş Akışları: Agentik Yapay Zeka Devrimi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1872, published: '2025-03-12', theme: 'ai', format: 'video' },
  { id: "YQDCGieAV_Y", title: "Türkiye’deki üniversitelerde son durum ne?", originalTitle: "Türkiye’deki üniversitelerde son durum ne? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 565, published: '2025-04-09', theme: 'academia', format: 'video' },
  { id: "G_64kC8jp9Y", title: "Türkiye yapay zekaya hazır mı?", originalTitle: "Türkiye yapay zekaya hazır mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1176, published: '2025-06-04', theme: 'ai', format: 'video' },
  { id: "9FbjIpiC06g", title: "Heisenberg'in belirsizlik prensibi", originalTitle: "Heisenberg'in belirsizlik prensibi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1217, published: '2025-06-11', theme: 'quantum', format: 'video' },
  { id: "kcB-_cu1ZHg", title: "Heisenberg ve kuantumun doğuşu", originalTitle: "Heisenberg ve kuantumun doğuşu / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1451, published: '2025-06-25', theme: 'quantum', format: 'video' },
  { id: "83OnhVX1QSo", title: "Heisenberg ve kuantum devrimi", originalTitle: "Heisenberg ve kuantum devrimi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1295, published: '2025-07-02', theme: 'quantum', format: 'video' },
  { id: "sWs-N3y9glw", title: "İTÜ'de yapay zeka yaz okulu", originalTitle: "İTÜ'de yapay zeka yaz okulu / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1112, published: '2025-07-09', theme: 'ai', format: 'video' },
  { id: "gC3xApCbPgg", title: "Zeeman etkisi ve Heisenberg resmi", originalTitle: "Zeeman etkisi ve Heisenberg resmi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1227, published: '2025-07-23', theme: 'quantum', format: 'video' },
  { id: "glIpq6ODzco", title: "Türkiye’deki üniversitelerin son durumu ne?", originalTitle: "Türkiye’deki üniversitelerin son durumu ne? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1039, published: '2025-10-15', theme: 'academia', format: 'video' },
  { id: "o5LcbUuZ5Z0", title: "Heisenberg'in bilime katkıları neler?", originalTitle: "Heisenberg'in bilime katkıları neler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2598, published: '2025-10-23', theme: 'quantum', format: 'video' },
]);

export const lessonTopics: readonly { id: LessonTopic; title: string; titleTr: string }[] = [
  { id: 'field', title: "Electric field", titleTr: "Elektrik alanı" },
  { id: 'gauss', title: "Gauss's law", titleTr: "Gauss yasası" },
  { id: 'potential', title: "Electric potential", titleTr: "Elektrik potansiyeli" },
  { id: 'math', title: "Mathematical tools", titleTr: "Matematiksel araçlar" },
  { id: 'intro', title: "About the channel", titleTr: "Kanal tanıtımı" },
];

/** Worked electricity-and-magnetism problems on the personal channel (English). */
export const lessons: readonly Video[] = withViews([
  { id: "UV9JOs2d7po", title: "Channel Description Video - Electricity and Magnetism", originalTitle: "Channel Description Video - Electricity and Magnetism", lang: 'en', durationSeconds: 251, published: '2023-03-21', topic: 'intro', format: 'video' },
  { id: "63cSFsfonr4", title: "Electric Field - Charged Rod", originalTitle: "Electric Field - Charged Rod", lang: 'en', durationSeconds: 1011, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "Ktqtkbt2sZQ", title: "Electric Field - Charged Rod 2", originalTitle: "Electric Field - Charged Rod 2", lang: 'en', durationSeconds: 1183, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "cQeSt2ssCfQ", title: "Electric Field - Charged Quarter Ring", originalTitle: "Electric Field - Charged Quarter Ring", lang: 'en', durationSeconds: 831, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "Wx7oiJIQ-5k", title: "Electric Field due to Uniformly Charged Ring", originalTitle: "Electric Field due to Uniformly Charged Ring", lang: 'en', durationSeconds: 675, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "tkjP04_4tFY", title: "Electric Field due to Uniformly Charged Disk", originalTitle: "Electric Field due to Uniformly Charged Disk", lang: 'en', durationSeconds: 1002, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "WEfPTxUuaCE", title: "Gauss's Law - Concentric Conductors", originalTitle: "Gauss's Law -  Concentric Conductors", lang: 'en', durationSeconds: 616, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "B64ZJrCVEVM", title: "Gauss's Law - Coaxial Cylindrical Shells", originalTitle: "Gauss's Law - Coaxial Cylindrical Shells", lang: 'en', durationSeconds: 714, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "tX4L0M4g9vY", title: "Gauss's Law - Uniform Charge Density of a Cylinder", originalTitle: "Gauss's Law - Uniform Charge Density of a Cylinder", lang: 'en', durationSeconds: 835, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "URGa1LMBnzs", title: "Gauss's Law - Non-uniform Charge Density of a Cylinder", originalTitle: "Gauss's Law - Non-uniform Charge Density of a Cylinder", lang: 'en', durationSeconds: 1085, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "KE1UlvvQh3o", title: "Non-conducting Cylindrical Shell and a Thin Cable", originalTitle: "Non-conducting Cylindrical Shell  and a Thin Cable", lang: 'en', durationSeconds: 1039, published: '2023-04-03', topic: 'gauss', format: 'video' },
  { id: "-Au4z2wC1uU", title: "Gauss's Law - Non-uniform Charge Density of a Sphere", originalTitle: "Gauss's Law - Non-uniform Charge Density of a Sphere", lang: 'en', durationSeconds: 1218, published: '2023-04-06', topic: 'gauss', format: 'video' },
  { id: "ps27Xg0kHYM", title: "Electric Potential of a One Third of a Uniformly Charged Ring", originalTitle: "Electric Potential of a One Third of a Uniformly Charged Ring", lang: 'en', durationSeconds: 409, published: '2023-04-01', topic: 'potential', format: 'video' },
  { id: "MGqMI5cF3Ic", title: "Integrating r² / (r + c)", originalTitle: "Integrating rˆ2 / (r + c)", lang: 'en', durationSeconds: 456, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "1D0jll6VrlY", title: "Binomial Expansion of 1/1-x and 1/1+x", originalTitle: "Binomial Expansion of 1/1-x and 1/1+x", lang: 'en', durationSeconds: 255, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "fDE-GQ5G1PE", title: "Series expansion of Log(1+x)", originalTitle: "Series expansion of Log(1+x)", lang: 'en', durationSeconds: 298, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "tTOJWFKgyvA", title: "Taking the small argument limit of Log Term", originalTitle: "Taking the small argument limit of Log Term", lang: 'en', durationSeconds: 326, published: '2023-04-07', topic: 'math', format: 'video' },
]);

/** Appearances on other YouTube channels — television programmes, interviews and lighter formats — shown by group. */
export const otherChannels: readonly Video[] = withViews([
  { id: "qmL8q4E0hQU", title: "Zamanda yolculuk mümkün mü?", originalTitle: "Zamanda Yolculuk Mümkün Mü? | Başka Meseleler - 5 Ocak 2025", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. İbrahim Semiz", "Dr. Tevfik Uyar"], channel: "Habertürk TV", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 11167, published: '2025-01-06', aired: '2025-01-05', format: 'video' },
  { id: "H_1oENzMOqA", title: "Bilim ile din çatışır mı?", originalTitle: "Bilim İle Din Çatışır Mı? | Başka Meseleler - 9 Mart 2025", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. Caner Taslaman"], channel: "Habertürk TV", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 10233, published: '2025-03-10', aired: '2025-03-09', format: 'video' },
  { id: "0bxtAS73Npg", title: "Terminatör senaryosu: Gerçek mi oluyor?", originalTitle: "Terminatör Senaryosu: Gerçek Mi Oluyor? | Habertürk Manşet - 14 Ekim 2026", lang: 'tr', channel: "Habertürk TV", programme: "Habertürk Manşet", group: 'haberturk', durationSeconds: 3328, published: '2026-10-14', format: 'video' },
  { id: "VEd8GB8sLc4", title: "Zamanın bir kıyameti olacak mı, zamanın sonu var mı? Kur'an'a göre zamanda yolculuk mümkün mü?", originalTitle: "Zamanın Bir Kıyameti Olacak Mı, Zamanın  Sonu Var Mı? Kur'an'a Göre Zamanda Yolculuk Mümkün Mü?", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. İbrahim Semiz", "Dr. Tevfik Uyar"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 10864, published: '2025-01-12', format: 'video' },
  { id: "H-AsdD9H4cI", title: "Zamanın bir kıyameti olacak mı, zamanın sonu var mı? Zamanın akışına müdahale edilebilir mi?", originalTitle: "Zamanın Bir Kıyameti Olacak Mı, Zamanın Sonu Var Mı? Zamanın Akışına Müdahale Edilebilir Mi?", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. İbrahim Semiz", "Dr. Tevfik Uyar"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 2787, published: '2025-01-07', format: 'video' },
  { id: "a4APOL4Nh40", title: "Bilim, Tanrı için ne diyor? Kur'an ve bilime göre evren nasıl yaratıldı?", originalTitle: "Bilim, Tanrı İçin Ne Diyor ? Kur'an Ve Bilime Göre Evren Nasıl Yaratıldı ?", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. Caner Taslaman"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 1969, published: '2025-03-10', format: 'video' },
  { id: "5DflZWs_e5s", title: "Einstein ve Newton'a göre evren nasıl oluştu?", originalTitle: "Einstein Ve Newton'a Göre Evren Nasıl Oluştu ?", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. Caner Taslaman"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 2620, published: '2025-03-12', format: 'video' },
  { id: "epfI0TshIPo", title: "Kur'an dünya dışı varlıklardan bahseder mi? Evrende yalnız mıyız?", originalTitle: "Kur'an Dünya Dışı Varlıklardan Bahseder Mi Evrende Yalnız Mıyız ? Sorusuna Kur'an Ve Bilim Ne Diyor", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. Caner Taslaman"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 2762, published: '2025-03-14', format: 'video' },
  { id: "oaoEiCUjW_k", title: "Einstein ve Newton'a göre evren nasıl oluştu? Bilim, Tanrı için ne diyor?", originalTitle: "Einstein Ve Newton'a Göre Evren Nasıl Oluştu ?Bilim,Tanrı İçin Ne Diyor? Kur'an Ve Bilime Göre Evren", lang: 'tr', with: ["Mesut Yar", "Prof. Dr. Caner Taslaman"], channel: "HT Bilim Tarih Felsefe", programme: "Başka Meseleler", group: 'haberturk', durationSeconds: 10213, published: '2025-03-20', format: 'video' },
  { id: "ZOoKtLruiIQ", title: "Tv8 32. Program: Yapay zeka ve savaşlar", originalTitle: "Tv8 32. Program: Yapay zeka ve savaşlar | Emre Onur Kahya | Caner Taslaman", lang: 'tr', with: ["Prof. Dr. Caner Taslaman"], channel: "Caner Taslaman", programme: "Tv8", group: 'taslaman', durationSeconds: 3677, published: '2026-10-13', format: 'video' },
  { id: "qKoWja630E0", title: "Tv8 29. Program: Yapay zeka", originalTitle: "Tv8 29. Program: Yapay Zeka | Emre Onur Kahya | Caner Taslaman", lang: 'tr', with: ["Prof. Dr. Caner Taslaman"], channel: "Caner Taslaman", programme: "Tv8", group: 'taslaman', durationSeconds: 3583, published: '2026-09-17', format: 'video' },
  { id: "XtsaoUtAJdU", title: "Tv8 28. Program: Fizik ve evren", originalTitle: "Tv8 28. Program: Fizik ve Evren | Emre Onur Kahya | Caner Taslaman", lang: 'tr', with: ["Prof. Dr. Caner Taslaman"], channel: "Caner Taslaman", programme: "Tv8", group: 'taslaman', durationSeconds: 3719, published: '2026-09-09', format: 'video' },
  { id: "9ZoufUoBa_8", title: "Sonsuz evrenler tartışmaları hakkında", originalTitle: "Sonsuz Evrenler Tartışmaları Hakkında / Emre Onur Kahya, Caner Taslaman", lang: 'tr', with: ["Prof. Dr. Caner Taslaman"], channel: "Caner Taslaman", group: 'taslaman', durationSeconds: 470, published: '2021-12-08', format: 'video' },
  { id: "9m5eeOgzvrc", title: "Evrenin gizemi", originalTitle: "Evrenin Gizemi / Emre Onur Kahya, Caner Taslaman, Emre Dorman ve Birün Aktaş", lang: 'tr', with: ["Prof. Dr. Caner Taslaman", "Emre Dorman", "Birün Aktaş"], channel: "Caner Taslaman", group: 'taslaman', durationSeconds: 3319, published: '2021-11-24', format: 'video' },
  { id: "3FbqmGvSK9Y", title: "Yarının zekası", originalTitle: "Yarının Zekası - Prof. Dr. Emre Onur Kahya | 11 Ekim 2026", lang: 'tr', channel: "BloombergHT", programme: "Yarının Zekası", group: 'interviews', durationSeconds: 2148, published: '2026-10-11', format: 'video' },
  { id: "5zrw1GldexI", title: "Ramazan'a veda ederken... Bilim dini inancımızı nasıl etkiliyor?", originalTitle: "Ramazan'a Veda Ederken... Bilim Dini İnancımızı Nasıl Etkiliyor? | Sahur Vakti", lang: 'tr', channel: "A Haber", programme: "Sahur Vakti", group: 'interviews', durationSeconds: 5486, published: '2026-03-09', format: 'video' },
  { id: "-lnA3shtGF8", title: "Fizik bilimi ve evren hakkında en çok merak edilenler", originalTitle: "Fizik Bilimi ve Evren Hakkında En Çok Merak Edilenler / Emre Onur Kahya", lang: 'tr', with: ["Emre Dorman"], channel: "Emre Dorman", programme: "Aklımdaki Sorular", group: 'interviews', durationSeconds: 2495, published: '2025-01-20', format: 'video' },
  { id: "hXt4N1UCiAg", title: "Evrenin anlaşılmasında fizik bilimi", originalTitle: "Evrenin Anlaşılmasında Fizik Bilimi | Bilim ve Ötesi (9. Bölüm)", lang: 'tr', channel: "Vav TV", programme: "Bilim ve Ötesi", group: 'vav', durationSeconds: 3089, published: '2023-07-14', format: 'video' },
  { id: "2mGMBmD8Q_0", title: "Fizik bilimine dair", originalTitle: "Fizik Bilimine Dair | Prof. Dr. Emre Onur Kahya - Asıl Mesele (29. Bölüm)", lang: 'tr', channel: "Vav TV", programme: "Asıl Mesele", group: 'vav', durationSeconds: 6586, published: '2021-08-04', format: 'video' },
  { id: "JBROioD-Azc", title: "Evrende dünya dışında canlı yaşamı olabilir mi?", originalTitle: "Evrende dünya dışında canlı yaşamı olabilir mi? | Prof. Dr. Emre Onur Kahya|Fatih Ergenekon|Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3267, published: '2024-10-07', format: 'video' },
  { id: "6KZXDjJZabs", title: "Fizikte yeni gelişmeler var mı?", originalTitle: "Fizikte yeni gelişmeler var mı? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3036, published: '2024-05-20', format: 'video' },
  { id: "sCU2xA2S1BM", title: "Din ve bilim ilişkisi", originalTitle: "Din ve bilim ilişkisi | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3096, published: '2024-04-29', format: 'video' },
  { id: "zmZGCZ-rKXI", title: "Türk astronot Alper Gezeravcı'nın uzay yolculuğu", originalTitle: "Türk astronot Alper Gezeravcı'nın uzay yolculuğu | Prof. Dr. Emre O. Kahya |Fatih Ergenekon|Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3030, published: '2024-02-19', format: 'video' },
  { id: "AQ8wz7YzCqk", title: "Din ve bilim ilişkisi", originalTitle: "Din ve Bilim İlişkisi | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3149, published: '2024-01-15', format: 'video' },
  { id: "LbKhtruq3h8", title: "Güneş sistemi ve gezegenler", originalTitle: "Güneş Sistemi ve Gezegenler | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3354, published: '2024-01-03', format: 'video' },
  { id: "28CIC1rmpwI", title: "Matematik ve evren ilişkisi", originalTitle: "Matematik ve Evren İlişkisi | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3165, published: '2023-11-13', format: 'video' },
  { id: "ZuuOLR8UbTg", title: "Yapay zeka bilinç kazanabilir mi?", originalTitle: "Yapay zeka bilinç kazanabilir mi? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2999, published: '2023-09-25', format: 'video' },
  { id: "FFZt-9gvEGM", title: "Kara delikler Dünya için tehdit mi?", originalTitle: "Kara delikler Dünya için tehdit mi? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3059, published: '2023-09-05', format: 'video' },
  { id: "NUkGXGPs8Pk", title: "Stephen Hawking'den korkutan kehanet", originalTitle: "Stephen Hawking'den korkutan kehanet | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3215, published: '2023-08-22', format: 'video' },
  { id: "WARCckd3UL8", title: "Din ve bilim ilişkisi", originalTitle: "Din ve Bilim İlişkisi | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2730, published: '2024-04-08', format: 'video' },
  { id: "X_0CQnJco2o", title: "Gezegenlerin hareketi insanları etkiler mi?", originalTitle: "Gezegenlerin hareketi insanları etkiler mi? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3156, published: '2024-06-20', format: 'video' },
  { id: "yj7zLdGA74k", title: "İnsan zihni ve evren arasındaki ilişki", originalTitle: "İnsan zihni ve evren arasındaki ilişki | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3053, published: '2023-07-09', format: 'video' },
  { id: "GCPMZjS_tgw", title: "Yapay zeka insan gibi düşünebilir mi?", originalTitle: "Yapay zeka insan gibi düşünebilir mi? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3146, published: '2023-04-10', format: 'video' },
  { id: "k6H4j6KtT5I", title: "Evren ve bilim", originalTitle: "Evren ve Bilim | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2948, published: '2023-03-27', format: 'video' },
  { id: "X1Fll7WdAVQ", title: "İnsan zihninin zaman ve mekan algısı", originalTitle: "İnsan zihninin zaman ve mekan algısı | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3026, published: '2022-05-06', format: 'video' },
  { id: "UbwiDMTeZdA", title: "Evreni anlamada fizik biliminin rolü", originalTitle: "Evreni anlamada fizik biliminin rolü | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2793, published: '2022-04-29', format: 'video' },
  { id: "IAvF9grmvzM", title: "Modern kozmoloji ve din", originalTitle: "Modern kozmoloji ve din | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2876, published: '2022-04-20', format: 'video' },
  { id: "AwPr9uoM3oM", title: "Evren ve bilim ilişkisi", originalTitle: "Evren ve bilim ilişkisi | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 2962, published: '2025-02-18', format: 'video' },
  { id: "xC-o087bouQ", title: "Evren gerçekten sonsuz mudur?", originalTitle: "Evren gerçekten sonsuz mudur? | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3056, published: '2025-04-02', format: 'video' },
  { id: "_aT8jl-qy5s", title: "Evrenin oluşum ve gelişim süreci", originalTitle: "Evrenin Oluşum ve Gelişim Süreci | Prof. Dr. Emre Onur Kahya | Fatih Ergenekon | Muhakeme", lang: 'tr', with: ["Fatih Ergenekon"], channel: "EKOTÜRK TV", programme: "Muhakeme", group: 'muhakeme', durationSeconds: 3178, published: '2025-06-23', format: 'video' },
  { id: "5_JWbA8hU6w", title: "Zaman nedir nasıl geçer?", originalTitle: "Zaman Nedir Nasıl Geçer? Okan Bayülgen ile Muhabbet Kralı", lang: 'tr', with: ["Okan Bayülgen"], channel: 'Haber Global', programme: 'Muhabbet Kralı', group: 'interviews', durationSeconds: 6039, published: '2022-05-30', format: 'video' },
  { id: "uS4WaHeeRxQ", title: "Fizik mühendisi atom bombası sahnelerini izliyor!", originalTitle: "FİZİK MÜHENDİSİ ATOM BOMBASI SAHNELERİNİ İZLİYOR!", lang: 'tr', channel: 'Literat', group: 'literat', durationSeconds: 1128, published: '2024-05-22', format: 'video' },
  { id: "rXjrqzaE464", title: "Fizik mühendisi, zamanda yolculuk sahnelerini izliyor!", originalTitle: "FİZİK MÜHENDİSİ, ZAMANDA YOLCULUK SAHNELERİNİ İZLİYOR!", lang: 'tr', channel: 'Literat', group: 'literat', durationSeconds: 852, published: '2024-11-06', format: 'video' },
]);

/**
 * Blocks of the "other channels" section, in display order: television programmes first, the lighter Literat
 * format last. Within a block the most watched come first; `visible` rows are shown and the rest fold away.
 */
export const otherGroups: readonly {
  id: OtherGroupId; title: { en: string; tr: string }; url?: string; note: { en: string; tr: string };
  /** Show channel and programme on each row (blocks that mix programmes). */
  labelRows: boolean; visible?: number;
}[] = [
  { id: 'haberturk', title: { en: 'Habertürk', tr: 'Habertürk' }, url: 'https://www.youtube.com/@haberturktv', labelRows: true,
    note: { en: 'Başka Meseleler with Mesut Yar and Habertürk Manşet; segments of Başka Meseleler on HT Bilim Tarih Felsefe.', tr: 'Mesut Yar ile Başka Meseleler ve Habertürk Manşet; Başka Meseleler kesitleri HT Bilim Tarih Felsefe kanalında.' } },
  { id: 'muhakeme', title: { en: 'Muhakeme · EKOTÜRK TV', tr: 'Muhakeme · EKOTÜRK TV' }, url: 'https://www.youtube.com/playlist?list=PLbB3LzyLbpBQg2AY6sZUmBnPYa7XCC3iM', labelRows: false, visible: 6,
    note: { en: 'A regular guest of Fatih Ergenekon, 2022–2025.', tr: 'Fatih Ergenekon’un konuğu olarak, 2022–2025.' } },
  { id: 'taslaman', title: { en: 'Caner Taslaman', tr: 'Caner Taslaman' }, url: 'https://www.youtube.com/@Caner.Taslaman', labelRows: false,
    note: { en: 'Tv8 programmes with Prof. Dr. Caner Taslaman (2026) and earlier conversations.', tr: 'Prof. Dr. Caner Taslaman ile Tv8 programları (2026) ve önceki sohbetler.' } },
  { id: 'interviews', title: { en: 'Interviews', tr: 'Söyleşiler' }, labelRows: true,
    note: { en: 'BloombergHT, A Haber, Emre Dorman, and Okan Bayülgen on Haber Global (one of four guests).', tr: 'BloombergHT, A Haber, Emre Dorman ve Haber Global’de Okan Bayülgen (dört konuktan biri olarak).' } },
  { id: 'vav', title: { en: 'Vav TV', tr: 'Vav TV' }, url: 'https://www.youtube.com/@vavtv', labelRows: true,
    note: { en: 'Asıl Mesele (2021) and Bilim ve Ötesi (2023).', tr: 'Asıl Mesele (2021) ve Bilim ve Ötesi (2023).' } },
  { id: 'literat', title: { en: 'Literat', tr: 'Literat' }, url: 'https://www.youtube.com/@Literatsf', labelRows: false,
    note: { en: 'I comment on the physics in film and TV scenes.', tr: 'Film ve dizi sahnelerindeki fiziği yorumluyorum.' } },
];

/** The other-channel videos of each block, most watched first. */
export const otherChannelGroups = () => otherGroups.map((group) => ({
  ...group,
  videos: byViews(otherChannels.filter((video) => video.group === group.id)),
}));

const sum = (list: readonly Video[]) => list.reduce((total, video) => total + video.views, 0);

/** Every YouTube video on the site, for the snapshot refresh and the totals. */
export const allYouTubeVideos = (): Video[] => [...conversations, ...clips, ...bilimEkstra, ...lessons, ...otherChannels];

export const watchUrl = (video: Pick<Video, 'id' | 'format'>) =>
  video.format === 'short' ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`;

export const tekeTekBilimVideos = (): Video[] => [...conversations, ...clips, ...bilimEkstra];

export function outreachTotals() {
  const youtube = sum(allYouTubeVideos());
  const instagram = clips.reduce((total, video) => total + (video.instagram?.views ?? 0), 0);
  return {
    conversations: conversations.length,
    bilimEkstra: bilimEkstra.length,
    clips: clips.length,
    programmes: conversations.length + bilimEkstra.length,
    tekeTekBilimViews: sum(conversations) + sum(clips) + sum(bilimEkstra),
    conversationViews: sum(conversations),
    lessonCount: lessons.length,
    lessonViews: sum(lessons),
    otherChannelViews: sum(otherChannels),
    /** Every listed YouTube video: Teke Tek Bilim (with clips), the personal channel and other channels. */
    youtubeViews: youtube,
    /** Instagram reels of the clips, as reported (instagramSnapshot). */
    instagramViews: instagram,
    /** The headline figure: YouTube and Instagram together. */
    allViews: youtube + instagram,
    instagramReels: clips.filter((video) => video.instagram).length,
    firstAired: [...conversations, ...bilimEkstra].map((video) => video.aired ?? video.published).sort()[0]!,
  };
}

type Lang = 'en' | 'tr';
const decimal = (value: number, lang: Lang) => value.toFixed(1).replace(/\.0$/, '').replace('.', lang === 'tr' ? ',' : '.');

/** Compact view counts: 996121 → "996K" / "996 bin", 1116033 → "1.1M" / "1,1 milyon". */
export function formatViews(views: number, lang: Lang = 'en'): string {
  const [k, m] = lang === 'tr' ? [' bin', ' milyon'] : ['K', 'M'];
  if (views >= 1_000_000) return `${decimal(views / 1_000_000, lang)}${m}`;
  if (views >= 10_000) return `${Math.round(views / 1000)}${k}`;
  if (views >= 1000) return `${decimal(views / 1000, lang)}${k}`;
  return String(views);
}

/** Floors to one decimal so that a headline figure never overstates: 5683992 → "5.6M" / "5,6 milyon". */
export function formatViewsFloor(views: number, lang: Lang = 'en'): string {
  const [k, m] = lang === 'tr' ? [' bin', ' milyon'] : ['K', 'M'];
  if (views >= 1_000_000) return `${decimal(Math.floor(views / 100_000) / 10, lang)}${m}`;
  if (views >= 1000) return `${Math.floor(views / 1000)}${k}`;
  return String(views);
}

export function formatDuration(seconds: number, lang: Lang = 'en'): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  const [hu, mu] = lang === 'tr' ? ['sa', 'dk'] : ['h', 'min'];
  return h > 0 ? `${h} ${hu} ${String(m).padStart(2, '0')} ${mu}` : `${Math.max(1, m)} ${mu}`;
}

const months: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
};
/** "2026-09-27" → "Sep 2026" / "Eyl 2026" (no locale data needed at build time). */
export function formatMonth(isoDate: string, lang: Lang = 'en'): string {
  const [year, month] = isoDate.split('-');
  return `${months[lang][Number(month) - 1]} ${year}`;
}
