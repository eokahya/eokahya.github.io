/**
 * Public academic identity. Facts are taken from the author's own CVs (public/cv/, 28 August and
 * 2 September 2026) and cross-checked against the İTÜ academic profile, INSPIRE-HEP and ORCID on 2026-10-02
 * (see docs/SOURCES.md). Each text has an English and a Turkish version.
 */
export interface ProfileLink {
  label: string;
  labelTr?: string;
  handle?: string;
  url: string;
  kind: 'academic' | 'code' | 'video' | 'social';
}

export interface TimelineEntry {
  period: string;
  /** Sort key: the first year of the period. */
  start: number;
  title: string;
  titleTr: string;
  institution: string;
  institutionTr: string;
  detail?: string;
  detailTr?: string;
  kind: 'education' | 'position';
  sourceUrl: string;
}

export interface Award {
  year: number;
  title: string;
  titleTr: string;
  awardedBy: string;
  awardedByTr: string;
}

export interface Project {
  period: string;
  title: string;
  titleTr: string;
  funder: string;
  funderTr: string;
  role: 'PI' | 'Researcher';
  number?: string;
  team?: string;
}

const ituAkademi = 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya';
const inspireAuthor = 'https://inspirehep.net/authors/1039459';
const cv = '/cv/Emre-Onur-Kahya-CV-EN.pdf';

export const profile = {
  name: 'Emre Onur Kahya',
  fullName: 'Prof. Dr. Emre Onur Kahya',
  shortName: 'E. O. Kahya',
  displayRole: 'Professor of Physics',
  affiliation: 'Department of Physics Engineering, Istanbul Technical University',
  department: 'Department of Physics Engineering',
  faculty: 'Faculty of Science and Letters',
  institution: 'Istanbul Technical University',
  institutionShort: 'İTÜ',
  email: 'eokahya@itu.edu.tr',
  phone: '+90 212 285 3214',
  fax: '+90 212 285 6386',
  address: { en: 'İTÜ Ayazağa Campus, 34469 Istanbul, Türkiye', tr: 'İTÜ Ayazağa Kampüsü, 34469 İstanbul, Türkiye' },
  location: 'Istanbul, Türkiye',
  orcid: '0000-0003-2760-7091',
  site: 'https://eokahya.github.io/',
  /** The CV PDFs as supplied by the author; `updated` is each file's creation date. */
  cv: { en: '/cv/Emre-Onur-Kahya-CV-EN.pdf', tr: '/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf', updated: { en: '2026-08-28', tr: '2026-09-02' } },

  summary: {
    en: 'Theoretical physicist working on quantum fields, gravitation and cosmology, on machine learning for physical data, and — as a current direction — on the mechanisms inside learned models.',
    tr: 'Kuantum alanlar, kütleçekim ve kozmoloji, fiziksel veri için makine öğrenmesi ve — güncel bir yönelim olarak — öğrenilmiş modellerin içindeki mekanizmalar üzerine çalışan bir kuramsal fizikçi.',
  },

  bio: {
    en: 'I study quantum fields, gravitation and cosmology, and develop machine-learning approaches to physical data. My current research direction asks how the internal mechanisms of learned models can be understood and tested. I also talk about physics and artificial intelligence for a broad Turkish-speaking audience.',
    tr: 'Kuantum alanları, kütleçekimi ve kozmolojiyi çalışıyor, fiziksel veriler için makine öğrenmesi yaklaşımları geliştiriyorum. Güncel araştırma yönelimim, öğrenilmiş modellerin iç mekanizmalarının nasıl anlaşılıp test edilebileceği sorusu. Fizik ve yapay zekâ üzerine geniş bir izleyici kitlesine Türkçe anlatımlar da yapıyorum.',
  },

  aboutBio: {
    en: [
      'I am a professor in the Department of Physics Engineering at Istanbul Technical University. I studied physics at Middle East Technical University and completed my Ph.D. at the University of Florida in 2008, with a thesis on quantum gravitational corrections to scalar field equations during inflation, supervised by Richard P. Woodard.',
      'After postdoctoral positions at Koç University and Friedrich Schiller University Jena, I joined İTÜ in 2012, where I became associate professor in 2013 and professor in 2018. My research spans quantum field theory in curved spacetime, quantum corrections during inflation, cosmology and observational tests of modified gravity.',
      'From 2019 to 2021 I was a visiting researcher at Mila – Quebec AI Institute, where I completed an M.Sc. in Computer Science at Université de Montréal with a thesis on identifying electrons with deep learning. Machine learning now runs through my work: from astronomical light curves to particle identification, and — as a current research direction — mechanistic interpretability and reliable AI.',
      'Outside the lecture hall I talk about physics, the history of science and artificial intelligence on Teke Tek Bilim, and I publish worked physics problems on my own YouTube channel.',
    ],
    tr: [
      "İstanbul Teknik Üniversitesi Fizik Mühendisliği Bölümü'nde profesörüm. Orta Doğu Teknik Üniversitesi'nde fizik okudum; doktoramı 2008'de University of Florida'da, Richard P. Woodard danışmanlığında, enflasyon sırasında skaler alan denklemlerine gelen kuantum kütleçekimsel düzeltmeler üzerine bir tezle tamamladım.",
      "Koç Üniversitesi ve Friedrich Schiller Üniversitesi Jena'daki doktora sonrası araştırmacılığımın ardından 2012'de İTÜ'ye katıldım; 2013'te doçent, 2018'de profesör oldum. Araştırmalarım eğri uzay-zamanda kuantum alan kuramını, enflasyon sırasındaki kuantum düzeltmeleri, kozmolojiyi ve değiştirilmiş kütleçekimin gözlemsel testlerini kapsıyor.",
      "2019–2021 arasında Mila – Quebec Yapay Zekâ Enstitüsü'nde misafir araştırmacı olarak bulundum ve Université de Montréal'de, derin öğrenmeyle elektron tanımlama üzerine bir tezle bilgisayar bilimi yüksek lisansımı tamamladım. Makine öğrenmesi bugün çalışmalarımın her yerinde: astronomik ışık eğrilerinden parçacık tanımlamaya ve güncel bir araştırma yönelimi olarak mekanistik yorumlanabilirlik ile güvenilir yapay zekâya kadar.",
      "Derslerin dışında Teke Tek Bilim'de fizik, bilim tarihi ve yapay zekâ üzerine konuşuyor, kendi YouTube kanalımda fizik problemlerini adım adım çözüyorum.",
    ],
  },

  researchInterests: {
    en: 'Machine learning, artificial intelligence, cosmology, alternative theories of gravity, quantum field theory',
    tr: 'Makine öğrenmesi, yapay zekâ, kozmoloji, alternatif kütleçekim kuramları, kuantum alan kuramı',
  },

  academicLinks: [
    { label: 'İTÜ academic profile', labelTr: 'İTÜ akademik profili', url: ituAkademi, kind: 'academic' },
    { label: 'İTÜ research profile', labelTr: 'İTÜ araştırma profili', url: 'https://research.itu.edu.tr/en/persons/eokahya/', kind: 'academic' },
    { label: 'ORCID', handle: '0000-0003-2760-7091', url: 'https://orcid.org/0000-0003-2760-7091', kind: 'academic' },
    { label: 'INSPIRE-HEP', handle: 'E.O.Kahya.1', url: inspireAuthor, kind: 'academic' },
    { label: 'GitHub', handle: 'eokahya', url: 'https://github.com/eokahya', kind: 'code' },
  ] satisfies ProfileLink[],

  socialLinks: [
    { label: 'YouTube', handle: '@emreonurkahya', url: 'https://www.youtube.com/@emreonurkahya', kind: 'video' },
    { label: 'Teke Tek Bilim', handle: '@TekeTekBilim', url: 'https://www.youtube.com/@TekeTekBilim', kind: 'video' },
    { label: 'X', handle: '@EmreOnurKahya', url: 'https://x.com/EmreOnurKahya', kind: 'social' },
    { label: 'Instagram', handle: '@emreokahya', url: 'https://www.instagram.com/emreokahya/', kind: 'social' },
  ] satisfies ProfileLink[],

  timeline: [
    { period: '1996–2000', start: 1996, title: 'B.Sc. in Physics', titleTr: 'Fizik lisans', institution: 'Middle East Technical University', institutionTr: 'Orta Doğu Teknik Üniversitesi', kind: 'education', sourceUrl: cv },
    { period: '2000–2002', start: 2000, title: 'M.Sc. in Physics', titleTr: 'Fizik yüksek lisans', institution: 'Middle East Technical University', institutionTr: 'Orta Doğu Teknik Üniversitesi', detail: 'Thesis: Higher dimensional metrics of colliding gravitational plane waves · teaching assistant', detailTr: 'Tez: Higher dimensional metrics of colliding gravitational plane waves · öğretim görevlisi', kind: 'education', sourceUrl: cv },
    { period: '2002–2008', start: 2002, title: 'Ph.D. in Physics', titleTr: 'Fizik doktora', institution: 'University of Florida', institutionTr: 'University of Florida', detail: 'Thesis: Quantum Gravitational Correction to Scalar Field Equations during Inflation · supervisor Richard P. Woodard · teaching assistant', detailTr: 'Tez: Quantum Gravitational Correction to Scalar Field Equations during Inflation · danışman Richard P. Woodard · öğretim görevlisi', kind: 'education', sourceUrl: 'https://inspirehep.net/literature/1263713' },
    { period: '2008–2009', start: 2008, title: 'Postdoctoral researcher', titleTr: 'Doktora sonrası araştırmacı', institution: 'Koç University', institutionTr: 'Koç Üniversitesi', kind: 'position', sourceUrl: cv },
    { period: '2009–2012', start: 2009, title: 'Postdoctoral researcher', titleTr: 'Doktora sonrası araştırmacı', institution: 'Friedrich Schiller University Jena', institutionTr: 'Friedrich-Schiller-Universität Jena', detail: 'Marie Curie International Reintegration Grant (PI)', detailTr: 'Marie Curie Uluslararası Geri Dönüş Bursu (yürütücü)', kind: 'position', sourceUrl: cv },
    { period: '2012–present', start: 2012, title: 'Faculty member', titleTr: 'Öğretim üyesi', institution: 'Istanbul Technical University', institutionTr: 'İstanbul Teknik Üniversitesi', detail: 'Department of Physics Engineering · associate professor 2013, professor 2018', detailTr: 'Fizik Mühendisliği Bölümü · 2013 doçent, 2018 profesör', kind: 'position', sourceUrl: ituAkademi },
    { period: '2019–2021', start: 2019, title: 'Visiting researcher; M.Sc. in Computer Science (2021)', titleTr: 'Misafir araştırmacı; bilgisayar bilimi yüksek lisans (2021)', institution: 'Mila – Quebec AI Institute, Université de Montréal', institutionTr: 'Mila – Quebec Yapay Zekâ Enstitüsü, Université de Montréal', detail: 'Thesis: Identifying Electrons with Deep Learning Methods', detailTr: 'Tez: Identifying Electrons with Deep Learning Methods', kind: 'education', sourceUrl: cv },
  ] satisfies TimelineEntry[],

  awards: [
    { year: 2017, title: 'Mustafa Parlar Research Incentive Award', titleTr: 'Mustafa Parlar Araştırma Teşvik Ödülü', awardedBy: 'METU Prof. Dr. Mustafa N. Parlar Education and Research Foundation', awardedByTr: 'ODTÜ Prof. Dr. Mustafa N. Parlar Eğitim ve Araştırma Vakfı' },
    { year: 2016, title: 'TÜBİTAK Science Incentive Award', titleTr: 'TÜBİTAK Bilim Teşvik Ödülü', awardedBy: 'Scientific and Technological Research Council of Türkiye', awardedByTr: 'Türkiye Bilimsel ve Teknolojik Araştırma Kurumu' },
    { year: 2015, title: 'Outstanding Young Scientist Award (TÜBA-GEBİP)', titleTr: 'Üstün Başarılı Genç Bilim İnsanı Ödülü (TÜBA-GEBİP)', awardedBy: 'Turkish Academy of Sciences', awardedByTr: 'Türkiye Bilimler Akademisi' },
    { year: 2015, title: 'Scientist of the Year Award', titleTr: '2015 Yılın Bilim İnsanı Ödülü', awardedBy: 'Science Heroes Association (Bilim Kahramanları Derneği)', awardedByTr: 'Bilim Kahramanları Derneği' },
    { year: 2010, title: 'Most Valuable Referee', titleTr: 'En Değerli Hakem', awardedBy: 'Astroparticle Physics (journal)', awardedByTr: 'Astroparticle Physics dergisi' },
  ] satisfies Award[],

  projects: [
    { period: '2026–2028', title: 'Carrollian Field Theories', titleTr: 'Carrollyen Alan Teorileri', funder: 'TÜBİTAK 1001', funderTr: 'TÜBİTAK 1001', role: 'PI' },
    { period: '2019–2023', title: 'Optimization Methods in Machine Learning', titleTr: 'Yapay Öğrenmede Optimizasyon Yöntemleri', funder: 'Project supported by higher-education institutions', funderTr: 'Yükseköğretim kurumları destekli proje', role: 'PI' },
    { period: '2019–2021', title: 'Machine learning for the analysis of the Large Hadron Collider data at CERN', titleTr: "CERN'deki Büyük Hadron Çarpıştırıcısı verilerinin makine öğrenmesiyle analizi", funder: 'IVADO', funderTr: 'IVADO', role: 'Researcher', team: 'Yoshua Bengio (PI), Jean-François Arguin (LR)' },
    { period: '2017–2019', title: 'Inflation and Supersymmetric Attractors', titleTr: 'Enflasyon ve Süpersimetrik Atraktörler', funder: 'TÜBİTAK 1001', funderTr: 'TÜBİTAK 1001', role: 'PI', number: '117F102' },
    { period: '2013–2015', title: 'Quantum Effects in the Early Universe', titleTr: 'İlk Dönem Evrendeki Kuantum Etkileri', funder: 'TÜBİTAK 1001', funderTr: 'TÜBİTAK 1001', role: 'PI', number: '112T817' },
    { period: '2009–2012', title: 'Marie Curie International Reintegration Grant', titleTr: 'Marie Curie Uluslararası Geri Dönüş Bursu', funder: 'European Union', funderTr: 'Avrupa Birliği', role: 'PI', number: 'IRG-247803' },
  ] satisfies Project[],

  refereeFor: ['Physical Review D', 'Physics Letters B', 'Classical and Quantum Gravity', 'Astroparticle Physics'],

  verifiedOn: '2026-10-02',
};

export const allProfileLinks: ProfileLink[] = [...profile.academicLinks, ...profile.socialLinks];
