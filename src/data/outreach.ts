/**
 * Science-communication snapshot: public YouTube watch pages, read on 2026-10-02.
 * View counts change daily — they are shown as a dated snapshot, never as live numbers.
 * Titles are the original Turkish titles with the repeated programme suffix removed;
 * originalTitle keeps the exact YouTube title for verification. See docs/SOURCES.md.
 */
export type OutreachTheme = 'cosmos' | 'thinking' | 'quantum' | 'nobel' | 'ai' | 'sinanoglu' | 'academia' | 'history';
export type LessonTopic = 'intro' | 'field' | 'gauss' | 'potential' | 'math';

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
}

export const outreachSnapshot = {
  checkedOn: '2026-10-02',
  source: 'Public YouTube watch pages and the public Bilim Ekstra playlist',
} as const;

export const channels = {
  tekeTekBilim: { name: 'Teke Tek Bilim', handle: '@TekeTekBilim', url: 'https://www.youtube.com/@TekeTekBilim' },
  bilimEkstraPlaylist: { name: 'Prof. Dr. Emre Onur Kahya ile Bilim Ekstra', url: 'https://www.youtube.com/playlist?list=PLIWPLnDgfo-UvehLkGjmXCRuW2pAA6MGJ' },
  own: { name: 'Emre Onur Kahya', handle: '@emreonurkahya', url: 'https://www.youtube.com/@emreonurkahya', playlists: 'https://www.youtube.com/@emreonurkahya/playlists' },
  instagram: { name: 'Instagram', handle: '@emreokahya', url: 'https://www.instagram.com/emreokahya/' },
  x: { name: 'X', handle: '@EmreOnurKahya', url: 'https://x.com/EmreOnurKahya' },
} as const;

/** Long-form Teke Tek Bilim conversations, ordered by views at the snapshot date. */
export const conversations: readonly Video[] = [
  { id: "qp0k-ak7f7c", title: "Yapay zeka 2030'da insanlığı yok edecek mi?", originalTitle: "Yapay zeka 2030'da insanlığı yok edecek mi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 4865, views: 654372, published: '2026-09-27', theme: 'ai', format: 'video' },
  { id: "kPym_ScuZqE", title: "Zamanın olmadığı bir evren var mı? Çoklu evren gerçekten var mıdır?", originalTitle: "Zamanın olmadığı bir evren var mı? Çoklu evren gerçekten var mıdır?  - Teke Tek Bilim", lang: 'tr', with: ["Prof. Dr. İbrahim Semiz", "Prof. Dr. Erkcan Özcan", "Fatih Altaylı"], durationSeconds: 6152, views: 573439, published: '2023-08-16', aired: '2021-09-12', theme: 'cosmos', glyph: 'bubbles', format: 'video' },
  { id: "82JvCjvvl-4", title: "Güneş patlaması?", originalTitle: "Güneş patlaması? / Prof. Dr. Emre Onur Kahya & Dr. Umut Yıldız & Fatih Altaylı - Teke Tek Bilim", lang: 'tr', with: ["Dr. Umut Yıldız", "Fatih Altaylı"], durationSeconds: 5173, views: 320745, published: '2023-12-24', theme: 'cosmos', glyph: 'sun', format: 'video' },
  { id: "d7j3j0-rhb8", title: "Karanlık madde evreni nasıl şekillendiriyor?", originalTitle: "Karanlık madde evreni nasıl şekillendiriyor? / Prof. Dr. Bora Işıldak & Prof. Dr. Emre Onur Kahya", lang: 'tr', with: ["Prof. Dr. Bora Işıldak"], durationSeconds: 5792, views: 202568, published: '2025-04-13', theme: 'cosmos', glyph: 'halo', format: 'video' },
  { id: "4ajZtcQ3bPU", title: "Modern bilimin doğuşu", originalTitle: "Modern bilimin doğuşu / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 7297, views: 175295, published: '2025-08-24', theme: 'history', format: 'video' },
  { id: "yhBXgsPVruU", title: "Fizik ve yapay zeka?", originalTitle: "Fizik ve yapay zeka? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı - Teke Tek Bilim", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 4636, views: 125337, published: '2024-03-24', theme: 'ai', format: 'video' },
  { id: "MsMYj4Ac2b4", title: "Bilime yön veren buluşlar neler? Einstein'ı farklı kılan neydi?", originalTitle: "Bilime yön veren buluşlar neler? Einstein'ı farklı kılan neydi?  - Teke Tek Bilim", lang: 'tr', with: ["Prof. Dr. Tekin Dereli", "Dr. Can Kozcaz", "Fatih Altaylı"], durationSeconds: 5950, views: 26566, published: '2023-08-20', aired: '2021-08-01', theme: 'history', format: 'video' },
];

/** Short clips cut from the conversations above. */
export const clips: readonly Video[] = [
  { id: "Jb4xXribPwk", title: "Evren hızlanarak genişler mi?", originalTitle: "Evren hızlanarak genişler mi? / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 90, views: 996121, published: '2025-08-24', theme: 'cosmos', glyph: 'expansion', format: 'short' },
  { id: "bvol2_D9gmo", title: "Yapay zekanın fişi çekilebilir mi?", originalTitle: "Yapay zekanın fişi çekilebilir mi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 75, views: 648063, published: '2026-09-27', theme: 'ai', format: 'short' },
  { id: "aCB1NGFv5bg", title: "Yapay zeka Hugging Face'i nasıl hackledi?", originalTitle: "Yapay zeka Hugging Face'i nasıl hackledi? / Prof. Dr. Emre Onur Kahya & Fatih Altaylı", lang: 'tr', with: ["Fatih Altaylı"], durationSeconds: 108, views: 403854, published: '2026-09-27', theme: 'ai', format: 'short' },
  { id: "THYGEmgNYBM", title: "Einstein & Newton fiziği farkı", originalTitle: "Einstein & Newton fiziği farkı / Prof. Dr. Emre Onur Kahya & Emrah Safa Gürkan - Teke Tek Bilim", lang: 'tr', with: ["Emrah Safa Gürkan"], durationSeconds: 90, views: 397477, published: '2025-08-24', theme: 'history', glyph: 'curve', format: 'short' },
  { id: "oWuN0gZTxKQ", title: "Kozmik merdivende sapmayı nasıl bulabiliyoruz?", originalTitle: "Kozmik merdivende sapmayı nasıl bulabiliyoruz? / Prof. Dr. Bora Işıldak & Prof. Dr. Emre Onur Kahya", lang: 'tr', with: ["Prof. Dr. Bora Işıldak"], durationSeconds: 60, views: 44122, published: '2025-04-13', theme: 'cosmos', glyph: 'ladder', format: 'short' },
];

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
export const bilimEkstra: readonly Video[] = [
  { id: "nJQPGsmmdPQ", title: "Einstein hatalı mı?", originalTitle: "Einstein hatalı mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1179, views: 46646, published: '2024-02-14', theme: 'cosmos', format: 'video' },
  { id: "JADuyTQfguY", title: "Işık hızına ulaşılabilir mi?", originalTitle: "Işık hızına ulaşılabilir mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1248, views: 39402, published: '2024-02-21', theme: 'cosmos', format: 'video' },
  { id: "PmNw8fFhs0k", title: "Uzay - zaman nedir?", originalTitle: "Uzay - zaman nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1291, views: 46645, published: '2024-02-28', theme: 'cosmos', format: 'video' },
  { id: "1Xx2tlbfDNw", title: "Kara deliklerin içerisinde ne var?", originalTitle: "Kara deliklerin içerisinde ne var? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1479, views: 34243, published: '2024-03-06', theme: 'cosmos', format: 'video' },
  { id: "lRbrbHrbbKY", title: "Fizikçi gibi düşünmek?", originalTitle: "Fizikçi gibi düşünmek? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1370, views: 16668, published: '2024-03-13', theme: 'thinking', format: 'video' },
  { id: "KqeaH-YvDPU", title: "Fizikçi gibi düşünen insanlar?", originalTitle: "Fizikçi gibi düşünen insanlar? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1073, views: 18760, published: '2024-03-15', theme: 'thinking', format: 'video' },
  { id: "Lv_NxqHj_qM", title: "Yapay zeka fizikçi gibi düşünebilir mi?", originalTitle: "Yapay zeka fizikçi gibi düşünebilir mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1240, views: 14147, published: '2024-04-03', theme: 'ai', format: 'video' },
  { id: "EuyMFspKzDs", title: "Anti-maddenin babası: Paul Dirac", originalTitle: "Anti-maddenin babası: Paul Dirac / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1521, views: 22885, published: '2024-04-17', theme: 'quantum', format: 'video' },
  { id: "cC4NBjfPWlk", title: "Dirac'ın bilime katkıları?", originalTitle: "Dirac'ın bilime katkıları? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1523, views: 15119, published: '2024-04-24', theme: 'quantum', format: 'video' },
  { id: "xQbsIa2IoRo", title: "Türk Einstein'ı Oktay Sinanoğlu'nun eğitimi? (Bölüm 1)", originalTitle: "Türk Einstein'ı Oktay Sinanoğlu'nun eğitimi? (Bölüm 1) / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1682, views: 30854, published: '2024-05-01', theme: 'sinanoglu', format: 'video' },
  { id: "mXGI39n7Pvo", title: "Oktay Sinanoğlu'nun bilimsel çalışmaları?", originalTitle: "Oktay Sinanoğlu'nun bilimsel çalışmaları? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1285, views: 21161, published: '2024-05-08', theme: 'sinanoglu', format: 'video' },
  { id: "2XeZPcLvWL0", title: "Oktay Sinanoğlu ve Türk dili?", originalTitle: "Oktay Sinanoğlu ve Türk dili? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1329, views: 15785, published: '2024-05-15', theme: 'sinanoglu', format: 'video' },
  { id: "ml1VdqDPhck", title: "Karanlık Madde nedir?", originalTitle: "Karanlık Madde nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1537, views: 34673, published: '2024-05-22', theme: 'cosmos', format: 'video' },
  { id: "sX36LuMZfGc", title: "Karanlık Enerji nedir?", originalTitle: "Karanlık Enerji nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1227, views: 19475, published: '2024-05-29', theme: 'cosmos', format: 'video' },
  { id: "cos6T0a09Ds", title: "Paralel evrenler?", originalTitle: "Paralel evrenler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1264, views: 31443, published: '2024-06-05', theme: 'cosmos', format: 'video' },
  { id: "2Xn5jPMbXJI", title: "Kuantum ve paralel evren?", originalTitle: "Kuantum ve paralel evren? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1132, views: 25002, published: '2024-06-12', theme: 'cosmos', format: 'video' },
  { id: "NpDgs_wL07g", title: "Yapay zekanın son yıllardaki gelişimi?", originalTitle: "Yapay zekanın son yıllardaki gelişimi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2091, views: 17934, published: '2024-06-26', theme: 'ai', format: 'video' },
  { id: "QqmJR5PzgnE", title: "Yapay zekanın geleceği?", originalTitle: "Yapay zekanın geleceği? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1709, views: 21265, published: '2024-07-03', theme: 'ai', format: 'video' },
  { id: "DadYoGonAv0", title: "Yapay zeka dost mu düşman mı?", originalTitle: "Yapay zeka dost mu düşman mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2012, views: 14895, published: '2024-07-10', theme: 'ai', format: 'video' },
  { id: "2wCCPh-s3ZE", title: "Yapay zeka ile yok olacak meslekler?", originalTitle: "Yapay zeka ile yok olacak meslekler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2130, views: 32740, published: '2024-07-17', theme: 'ai', format: 'video' },
  { id: "ryeEbu0PO4A", title: "Üniversite ve bölüm tercihlerimizi nasıl yapmalıyız?", originalTitle: "Üniversite ve bölüm tercihlerimizi nasıl yapmalıyız? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1904, views: 12199, published: '2024-07-24', theme: 'academia', format: 'video' },
  { id: "OHTeQcTq3tw", title: "Sizden gelen sorular?", originalTitle: "Sizden gelen sorular? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2104, views: 18167, published: '2024-07-31', theme: 'thinking', format: 'video' },
  { id: "Gv622j1Xc1k", title: "Bilincin kaynağı kuantum mu?", originalTitle: "Bilincin kaynağı kuantum mu? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1319, views: 34404, published: '2024-08-14', theme: 'thinking', format: 'video' },
  { id: "IvBqqQ6nk0M", title: "Astroloji ve Bilim?", originalTitle: "Astroloji ve Bilim? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1367, views: 24453, published: '2024-08-21', theme: 'thinking', format: 'video' },
  { id: "Fdrkc1SXFYM", title: "Yapay zekayı öğrenmeye nereden başlanır?", originalTitle: "Yapay zekayı öğrenmeye nereden başlanır? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1809, views: 107281, published: '2024-08-28', theme: 'ai', format: 'video' },
  { id: "RaGohz1XYyU", title: "Algoritma nasıl çalışır?", originalTitle: "Algoritma nasıl çalışır? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1215, views: 23925, published: '2024-09-04', theme: 'ai', format: 'video' },
  { id: "bO6KqytsoEQ", title: "Akademik makale nasıl değerlendirilir?", originalTitle: "Akademik makale nasıl değerlendirilir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1506, views: 11193, published: '2024-09-18', theme: 'academia', format: 'video' },
  { id: "0LUQTDDcR7o", title: "Türkiye’deki üniversitelerin 2024 karnesi?", originalTitle: "Türkiye’deki üniversitelerin 2024 karnesi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1365, views: 11022, published: '2024-09-25', theme: 'academia', format: 'video' },
  { id: "nqKShJxGhUk", title: "Türkiye'de fiziksel bilimler?", originalTitle: "Türkiye'de fiziksel bilimler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1286, views: 8091, published: '2024-10-02', theme: 'academia', format: 'video' },
  { id: "ve19jk24oYA", title: "Tarihin en tartışmalı Nobel Fizik Ödülü?", originalTitle: "Tarihin en tartışmalı Nobel Fizik Ödülü? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1231, views: 24093, published: '2024-10-16', theme: 'nobel', format: 'video' },
  { id: "_svlbBq3oVU", title: "Bilgisayarın Nobel'i nedir?", originalTitle: "Bilgisayarın Nobel'i nedir? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 930, views: 10194, published: '2024-10-23', theme: 'nobel', format: 'video' },
  { id: "WeT9WQniVtE", title: "1927 Solvay Konferansı’ndan önce neler oldu?", originalTitle: "1927 Solvay Konferansı’ndan önce neler oldu? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2169, views: 11589, published: '2024-11-13', theme: 'nobel', format: 'video' },
  { id: "qpqdNgCJUho", title: "1928'den 1950'ye Nobel ödülleri?", originalTitle: "1928'den 1950'ye Nobel ödülleri? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1193, views: 13906, published: '2024-11-20', theme: 'nobel', format: 'video' },
  { id: "rK-s10cdHn0", title: "1950'den 1970'e Nobel ödülleri", originalTitle: "1950'den 1970'e Nobel ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2458, views: 8729, published: '2024-12-04', theme: 'nobel', format: 'video' },
  { id: "FuzQvRkgVG8", title: "1970'ten 1990'a Nobel ödülleri", originalTitle: "1970'ten 1990'a Nobel ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1852, views: 7644, published: '2024-12-11', theme: 'nobel', format: 'video' },
  { id: "hlYtcBTaTLY", title: "1990'dan 2007'ye Nobel Ödülleri", originalTitle: "1990'dan 2007'ye Nobel Ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1813, views: 7685, published: '2025-01-08', theme: 'nobel', format: 'video' },
  { id: "OhAbNkbT924", title: "2008'den 2024'e Nobel Ödülleri", originalTitle: "2008'den 2024'e Nobel Ödülleri / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2012, views: 7045, published: '2025-01-15', theme: 'nobel', format: 'video' },
  { id: "SzF6f3cHwos", title: "DeepSeek: Çin’in Manhattan Projesi anı geldi mi?", originalTitle: "DeepSeek: Çin’in Manhattan Projesi anı geldi mi? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1271, views: 31826, published: '2025-02-05', theme: 'ai', format: 'video' },
  { id: "YGfVRbl9hN8", title: "DeepSeek: Geleceğin Teknolojisi – Teknik İnceleme", originalTitle: "DeepSeek: Geleceğin Teknolojisi – Teknik İnceleme / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2104, views: 23483, published: '2025-02-12', theme: 'ai', format: 'video' },
  { id: "gb8PTa25Tvc", title: "Geleceğin İş Akışları: Agentik Yapay Zeka Devrimi", originalTitle: "Geleceğin İş Akışları: Agentik Yapay Zeka Devrimi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1872, views: 33541, published: '2025-03-12', theme: 'ai', format: 'video' },
  { id: "YQDCGieAV_Y", title: "Türkiye’deki üniversitelerde son durum ne?", originalTitle: "Türkiye’deki üniversitelerde son durum ne? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 565, views: 11031, published: '2025-04-09', theme: 'academia', format: 'video' },
  { id: "G_64kC8jp9Y", title: "Türkiye yapay zekaya hazır mı?", originalTitle: "Türkiye yapay zekaya hazır mı? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1176, views: 19472, published: '2025-06-04', theme: 'ai', format: 'video' },
  { id: "9FbjIpiC06g", title: "Heisenberg'in belirsizlik prensibi", originalTitle: "Heisenberg'in belirsizlik prensibi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1217, views: 27823, published: '2025-06-11', theme: 'quantum', format: 'video' },
  { id: "kcB-_cu1ZHg", title: "Heisenberg ve kuantumun doğuşu", originalTitle: "Heisenberg ve kuantumun doğuşu / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1451, views: 24952, published: '2025-06-25', theme: 'quantum', format: 'video' },
  { id: "83OnhVX1QSo", title: "Heisenberg ve kuantum devrimi", originalTitle: "Heisenberg ve kuantum devrimi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1295, views: 18726, published: '2025-07-02', theme: 'quantum', format: 'video' },
  { id: "sWs-N3y9glw", title: "İTÜ'de yapay zeka yaz okulu", originalTitle: "İTÜ'de yapay zeka yaz okulu / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1112, views: 20258, published: '2025-07-09', theme: 'ai', format: 'video' },
  { id: "gC3xApCbPgg", title: "Zeeman etkisi ve Heisenberg resmi", originalTitle: "Zeeman etkisi ve Heisenberg resmi / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1227, views: 14461, published: '2025-07-23', theme: 'quantum', format: 'video' },
  { id: "glIpq6ODzco", title: "Türkiye’deki üniversitelerin son durumu ne?", originalTitle: "Türkiye’deki üniversitelerin son durumu ne? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 1039, views: 11028, published: '2025-10-15', theme: 'academia', format: 'video' },
  { id: "o5LcbUuZ5Z0", title: "Heisenberg'in bilime katkıları neler?", originalTitle: "Heisenberg'in bilime katkıları neler? / Prof. Dr. Emre Onur Kahya ile Bilim Ekstra", lang: 'tr', durationSeconds: 2598, views: 18070, published: '2025-10-23', theme: 'quantum', format: 'video' },
];

export const lessonTopics: readonly { id: LessonTopic; title: string; titleTr: string }[] = [
  { id: 'field', title: "Electric field", titleTr: "Elektrik alanı" },
  { id: 'gauss', title: "Gauss's law", titleTr: "Gauss yasası" },
  { id: 'potential', title: "Electric potential", titleTr: "Elektrik potansiyeli" },
  { id: 'math', title: "Mathematical tools", titleTr: "Matematiksel araçlar" },
  { id: 'intro', title: "About the channel", titleTr: "Kanal tanıtımı" },
];

/** Worked electricity-and-magnetism problems on the personal channel (English). */
export const lessons: readonly Video[] = [
  { id: "UV9JOs2d7po", title: "Channel Description Video - Electricity and Magnetism", originalTitle: "Channel Description Video - Electricity and Magnetism", lang: 'en', durationSeconds: 251, views: 2181, published: '2023-03-21', topic: 'intro', format: 'video' },
  { id: "63cSFsfonr4", title: "Electric Field - Charged Rod", originalTitle: "Electric Field - Charged Rod", lang: 'en', durationSeconds: 1011, views: 2327, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "Ktqtkbt2sZQ", title: "Electric Field - Charged Rod 2", originalTitle: "Electric Field - Charged Rod 2", lang: 'en', durationSeconds: 1183, views: 1199, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "cQeSt2ssCfQ", title: "Electric Field - Charged Quarter Ring", originalTitle: "Electric Field - Charged Quarter Ring", lang: 'en', durationSeconds: 831, views: 4594, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "Wx7oiJIQ-5k", title: "Electric Field due to Uniformly Charged Ring", originalTitle: "Electric Field due to Uniformly Charged Ring", lang: 'en', durationSeconds: 675, views: 973, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "tkjP04_4tFY", title: "Electric Field due to Uniformly Charged Disk", originalTitle: "Electric Field due to Uniformly Charged Disk", lang: 'en', durationSeconds: 1002, views: 1006, published: '2023-03-21', topic: 'field', format: 'video' },
  { id: "WEfPTxUuaCE", title: "Gauss's Law - Concentric Conductors", originalTitle: "Gauss's Law -  Concentric Conductors", lang: 'en', durationSeconds: 616, views: 1297, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "B64ZJrCVEVM", title: "Gauss's Law - Coaxial Cylindrical Shells", originalTitle: "Gauss's Law - Coaxial Cylindrical Shells", lang: 'en', durationSeconds: 714, views: 1641, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "tX4L0M4g9vY", title: "Gauss's Law - Uniform Charge Density of a Cylinder", originalTitle: "Gauss's Law - Uniform Charge Density of a Cylinder", lang: 'en', durationSeconds: 835, views: 855, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "URGa1LMBnzs", title: "Gauss's Law - Non-uniform Charge Density of a Cylinder", originalTitle: "Gauss's Law - Non-uniform Charge Density of a Cylinder", lang: 'en', durationSeconds: 1085, views: 1549, published: '2023-03-22', topic: 'gauss', format: 'video' },
  { id: "KE1UlvvQh3o", title: "Non-conducting Cylindrical Shell and a Thin Cable", originalTitle: "Non-conducting Cylindrical Shell  and a Thin Cable", lang: 'en', durationSeconds: 1039, views: 696, published: '2023-04-03', topic: 'gauss', format: 'video' },
  { id: "-Au4z2wC1uU", title: "Gauss's Law - Non-uniform Charge Density of a Sphere", originalTitle: "Gauss's Law - Non-uniform Charge Density of a Sphere", lang: 'en', durationSeconds: 1218, views: 1114, published: '2023-04-06', topic: 'gauss', format: 'video' },
  { id: "ps27Xg0kHYM", title: "Electric Potential of a One Third of a Uniformly Charged Ring", originalTitle: "Electric Potential of a One Third of a Uniformly Charged Ring", lang: 'en', durationSeconds: 409, views: 512, published: '2023-04-01', topic: 'potential', format: 'video' },
  { id: "MGqMI5cF3Ic", title: "Integrating r² / (r + c)", originalTitle: "Integrating rˆ2 / (r + c)", lang: 'en', durationSeconds: 456, views: 380, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "1D0jll6VrlY", title: "Binomial Expansion of 1/1-x and 1/1+x", originalTitle: "Binomial Expansion of 1/1-x and 1/1+x", lang: 'en', durationSeconds: 255, views: 3842, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "fDE-GQ5G1PE", title: "Series expansion of Log(1+x)", originalTitle: "Series expansion of Log(1+x)", lang: 'en', durationSeconds: 298, views: 986, published: '2023-04-07', topic: 'math', format: 'video' },
  { id: "tTOJWFKgyvA", title: "Taking the small argument limit of Log Term", originalTitle: "Taking the small argument limit of Log Term", lang: 'en', durationSeconds: 326, views: 1765, published: '2023-04-07', topic: 'math', format: 'video' },
];

export const watchUrl = (video: Pick<Video, 'id' | 'format'>) =>
  video.format === 'short' ? `https://www.youtube.com/shorts/${video.id}` : `https://www.youtube.com/watch?v=${video.id}`;

export const tekeTekBilimVideos = (): Video[] => [...conversations, ...clips, ...bilimEkstra];

export function outreachTotals() {
  const sum = (list: readonly Video[]) => list.reduce((total, video) => total + video.views, 0);
  return {
    conversations: conversations.length,
    bilimEkstra: bilimEkstra.length,
    clips: clips.length,
    programmes: conversations.length + bilimEkstra.length,
    tekeTekBilimViews: sum(conversations) + sum(clips) + sum(bilimEkstra),
    conversationViews: sum(conversations),
    lessonCount: lessons.length,
    lessonViews: sum(lessons),
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
