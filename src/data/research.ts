/**
 * Research directions, in English and Turkish. Texts are original summaries of verified, published
 * work; the fourth direction is the stated current research direction and is labelled as such.
 * `evidence` lists publication ids (publications.ts); `projects` lists funded projects (profile.ts).
 */
export type ResearchId = 'quantum-fields' | 'cosmology' | 'machine-learning' | 'interpretability';
export type PlateName = 'spacetime' | 'cosmos' | 'manifold' | 'circuit' | 'waves';

interface Text { title: string; short: string; description: string[]; keywords: string[]; status: string }

export interface ResearchArea {
  id: ResearchId;
  numeral: string;
  en: Text;
  tr: Text;
  evidence: string[];
  projects: string[];
  current: boolean;
  plate: PlateName;
  /** English title, kept for metadata and tests. */
  title: string;
}

const areas: Omit<ResearchArea, 'title'>[] = [
  {
    id: 'quantum-fields',
    numeral: 'A',
    en: {
      title: 'Quantum Fields and Gravitation',
      short: 'Quantum fields in curved spacetime, quantum-gravitational corrections during inflation and the structure of non-Lorentzian theories.',
      description: [
        'How does a quantum field evolve when spacetime itself is dynamical? My published work examines quantum corrections to scalar fields during inflation, including scalar self-mass calculations and corrected mode equations on de Sitter backgrounds.',
        'Related work studies the graviton propagator and, more recently, the quantization of Carrollian fermions and stationary solutions in the small-c expansion of general relativity. These problems use quantum field theory to investigate how geometry, symmetry and interactions constrain physical descriptions.',
      ],
      keywords: ['QFT in curved spacetime', 'de Sitter', 'loop corrections', 'graviton propagator', 'Carrollian limits'],
      status: 'Published work',
    },
    tr: {
      title: 'Kuantum Alanlar ve Kütleçekim',
      short: 'Eğri uzay-zamanda kuantum alanlar, enflasyon sırasında kuantum kütleçekimsel düzeltmeler ve Lorentz dışı kuramların yapısı.',
      description: [
        'Uzay-zamanın kendisi dinamikken bir kuantum alanı nasıl evrilir? Yayımlanmış çalışmalarım enflasyon sırasında skaler alanlara gelen kuantum düzeltmelerini inceliyor; de Sitter arka planında skaler öz-kütle hesapları ve düzeltilmiş mod denklemleri bunların başında geliyor.',
        'İlgili çalışmalar graviton yayıcısını ve son dönemde Carroll fermiyonlarının kuantumlanmasını ve genel göreliliğin küçük-c açılımındaki durağan çözümleri ele alıyor. Bu problemlerde kuantum alan kuramıyla geometrinin, simetrinin ve etkileşimlerin fiziksel betimlemeleri nasıl kısıtladığını araştırıyorum.',
      ],
      keywords: ['eğri uzay-zamanda KAK', 'de Sitter', 'ilmek düzeltmeleri', 'graviton yayıcısı', 'Carroll limitleri'],
      status: 'Yayımlanmış çalışmalar',
    },
    evidence: ['inspire-1614630', 'inspire-1319289', 'inspire-1082014', 'inspire-2878317'],
    projects: ['Carrollian Field Theories', 'Quantum Effects in the Early Universe', 'Marie Curie International Reintegration Grant'],
    current: false,
    plate: 'spacetime',
  },
  {
    id: 'cosmology',
    numeral: 'B',
    en: {
      title: 'Cosmology and Modified Gravity',
      short: 'Inflation, cosmological models and observational tests of gravitational theories beyond general relativity.',
      description: [
        'My work connects cosmological model building with tests that distinguish competing gravitational descriptions. Published studies include inflationary potentials, modified f(R) theories and differential Shapiro-delay constraints using multimessenger observations.',
        'The GW170817 study tests a specific class of dark-matter-emulating theories; it was widely covered in the press, from Forbes and Ars Technica to Smithsonian Magazine. Work on holographic boundary conformal field theory investigates Horndeski gravity; recent preprints examine reconstruction and parametrization choices in late-universe cosmology. The papers specify the assumptions and scope of each result.',
      ],
      keywords: ['inflation', 'f(R) gravity', 'dark-matter emulators', 'Shapiro delay', 'late-universe reconstruction'],
      status: 'Published work',
    },
    tr: {
      title: 'Kozmoloji ve Değiştirilmiş Kütleçekim',
      short: 'Enflasyon, kozmolojik modeller ve genel göreliliğin ötesindeki kütleçekim kuramlarının gözlemsel testleri.',
      description: [
        'Çalışmalarım kozmolojik model kurmayı, rakip kütleçekim betimlemelerini birbirinden ayıran testlerle buluşturuyor. Yayımlanmış çalışmalar arasında enflasyon potansiyelleri, değiştirilmiş f(R) kuramları ve çoklu haberci gözlemleriyle diferansiyel Shapiro gecikmesi kısıtları var.',
        "GW170817 çalışması, karanlık maddeyi taklit eden belirli bir kuram sınıfını sınıyor; sonuç Forbes ve Ars Technica'dan Smithsonian Magazine'e kadar basında geniş yer buldu. Holografik sınır konformal alan kuramı üzerine çalışma Horndeski kütleçekimini inceliyor; son ön baskılar geç evren kozmolojisinde yeniden kurgulama ve parametrizasyon seçimlerini ele alıyor. Her sonucun varsayımları ve kapsamı makalelerde açıkça belirtiliyor.",
      ],
      keywords: ['enflasyon', 'f(R) kütleçekimi', 'karanlık madde taklitçileri', 'Shapiro gecikmesi', 'geç evren yeniden kurgulaması'],
      status: 'Yayımlanmış çalışmalar',
    },
    evidence: ['inspire-1631136', 'inspire-1768430', 'inspire-1682331', 'inspire-2842587', 'inspire-3144795'],
    projects: ['Inflation and Supersymmetric Attractors'],
    current: false,
    plate: 'cosmos',
  },
  {
    id: 'machine-learning',
    numeral: 'C',
    en: {
      title: 'Machine Learning for Physics',
      short: 'Learning from physical data: astronomical time series, electron identification and physically grounded prediction tasks.',
      description: [
        'Machine learning is useful in physics when the data, baseline and evaluation reflect the scientific question. My published light-curve study investigates classification and feature relevance using neural networks and tree-based methods on multiband astronomical data.',
        'My computer-science master’s thesis applies deep learning to signal-electron identification in ATLAS data and investigates generalization; it was written at Mila during the IVADO project on machine learning for Large Hadron Collider data (2019–2021). A recent public preprint explores a hybrid temporal convolutional network and transformer for satellite conjunction-risk prediction. These are distinct applications, each with its own evidence and limitations.',
      ],
      keywords: ['light curves', 'electron identification', 'feature relevance', 'time-series forecasting'],
      status: 'Published work',
    },
    tr: {
      title: 'Fizik için Makine Öğrenmesi',
      short: 'Fiziksel veriden öğrenmek: astronomik zaman serileri, elektron tanımlama ve fiziğe dayanan tahmin problemleri.',
      description: [
        'Makine öğrenmesi, veri, karşılaştırma ölçütü ve değerlendirme bilimsel soruyu yansıttığında fizikte işe yarar. Yayımlanmış ışık eğrisi çalışmam, çok bantlı astronomik veride sinir ağları ve ağaç tabanlı yöntemlerle sınıflandırmayı ve özniteliklerin önemini inceliyor.',
        "Bilgisayar bilimi yüksek lisans tezim, ATLAS verisinde sinyal elektronlarının derin öğrenmeyle tanımlanmasını ve genelleme sorununu ele alıyor; tez, Büyük Hadron Çarpıştırıcısı verileri için makine öğrenmesi üzerine yürütülen IVADO projesi (2019–2021) sırasında Mila'da yazıldı. Kamuya açık yeni bir ön baskı, uydu yakın geçiş riskini öngörmek için hibrit bir zamansal evrişimli ağ ve transformer modelini araştırıyor. Bunlar her biri kendi kanıtı ve sınırlılıkları olan ayrı uygulamalar.",
      ],
      keywords: ['ışık eğrileri', 'elektron tanımlama', 'öznitelik önemi', 'zaman serisi tahmini'],
      status: 'Yayımlanmış çalışmalar',
    },
    evidence: ['light-curves-2021', 'electron-identification-2020', 'satellite-collision-2026'],
    projects: ['Machine learning for the analysis of the Large Hadron Collider data at CERN', 'Optimization Methods in Machine Learning'],
    current: false,
    plate: 'manifold',
  },
  {
    id: 'interpretability',
    numeral: 'D',
    en: {
      title: 'Mechanistic Interpretability and Reliable AI',
      short: 'A current direction: learned representations, causal interventions and testable explanations of model behaviour.',
      description: [
        'My current research direction concerns the internal computations of learned models: how representations support behaviour, and what controlled interventions can reveal about those mechanisms. Activation analysis, ablation and patching offer ways to move from descriptive patterns toward testable causal hypotheses.',
        'The emphasis is on careful baselines, matched controls, uncertainty and reproducibility. This is an ongoing research direction rather than a claim of established interpretability results. Its connection to physics is methodological — controlled experiments and explicit assumptions — without asserting an equivalence between a physical theory and a neural network.',
      ],
      keywords: ['representations', 'ablation & patching', 'probes vs. causal tests', 'reproducibility'],
      status: 'Current research direction',
    },
    tr: {
      title: 'Mekanistik Yorumlanabilirlik ve Güvenilir Yapay Zekâ',
      short: 'Güncel bir yönelim: öğrenilmiş temsiller, nedensel müdahaleler ve model davranışının test edilebilir açıklamaları.',
      description: [
        'Güncel araştırma yönelimim öğrenilmiş modellerin iç hesaplamalarıyla ilgili: temsillerin davranışı nasıl desteklediği ve kontrollü müdahalelerin bu mekanizmalar hakkında neyi ortaya koyabileceği. Aktivasyon analizi, ablasyon ve yama (patching), betimleyici örüntülerden test edilebilir nedensel hipotezlere geçmenin yollarını sunuyor.',
        'Vurgu dikkatli karşılaştırma ölçütleri, eşleştirilmiş kontroller, belirsizlik ve tekrarlanabilirlik üzerinde. Bu, yerleşik yorumlanabilirlik sonuçları iddiası değil, süren bir araştırma yönelimi. Fizikle bağlantısı yöntemsel — kontrollü deneyler ve açık varsayımlar —; bir fizik kuramıyla bir sinir ağı arasında eşdeğerlik iddiası taşımıyor.',
      ],
      keywords: ['temsiller', 'ablasyon ve yama', 'yoklama ile nedensel test', 'tekrarlanabilirlik'],
      status: 'Güncel araştırma yönelimi',
    },
    evidence: [],
    projects: [],
    current: true,
    plate: 'circuit',
  },
];

export const researchAreas: ResearchArea[] = areas.map((area) => ({ ...area, title: area.en.title }));
export const research = researchAreas;
export const researchById = (id: ResearchId) => researchAreas.find((area) => area.id === id)!;
