/**
 * Five research projects with open repositories. Every sentence and number below was checked
 * against the repository it links to (README, README_TR and the findings/results files) on
 * 2026-11-01; see docs/SOURCES.md. The texts are deliberately short: the repositories hold the
 * derivations, code, protocols and limitations.
 */
import type { Lang } from '../i18n';

export interface ProjectFact { value: string; label: string }
export interface ProjectText {
  kind: string;
  /** Short name for the scene caption and the chapter rail. */
  short: string;
  title: string;
  question: string;
  summary: string;
  /** Plain-language verdict shown next to the repository's own label. */
  verdictPlain: string;
  /** Plain-language result for readers outside the field. */
  result: string;
  /** Optional technical version of the result, shown with the numbers under “Details”. */
  detail?: string;
  facts: readonly ProjectFact[];
  /** Toggle that switches the schematic to its alternative view, and what each view shows. */
  focusLabel: string;
  captionOff: string;
  captionOn: string;
}
export interface Project {
  id: string;
  numeral: string;
  year: number;
  /** CSS colour token that marks the project across the page (matches its particle colour). */
  tint: 'accent' | 'violet' | 'cyan' | 'green' | 'coral';
  /** The repository's own verdict label, if it has one (shown verbatim, in monospace). */
  verdict?: string;
  repo: string;
  en: ProjectText;
  tr: ProjectText;
}

export const projects: readonly Project[] = [
  {
    id: 'quantum-gravity-audit',
    numeral: 'I',
    year: 2026,
    tint: 'accent',
    repo: 'https://github.com/eokahya/claude-audits-quantum-gravity',
    en: {
      kind: 'Physics audit',
      short: 'Graviton loop audit',
      title: 'A one-loop quantum gravity calculation, re-derived',
      question: 'If a published quantum gravity calculation is redone line by line, does its conclusion still hold?',
      summary: 'Two 2007–08 papers by Kahya and Woodard asked whether gravitons, the quanta of gravity, change how a simple field behaves during cosmic inflation. Their calculation was redone step by step with Claude and checked with independent code.',
      verdictPlain: 'Main conclusion holds; corrections needed',
      result: 'The conclusion holds: at late times there is no significant change. Along the way the audit found a sign error, two wrong table entries and an argument that does not work; none of them changes the late-time conclusion.',
      detail: 'Re-derived from the Feynman rules to the late-time mode function, with SymPy/mpmath checks. The printed self-mass has the opposite sign to the paper’s own definition, two entries of the final table need fixing, and the argument for one shortcut fails, although its result holds. The appendix bookkeeping tables were audited rather than redone.',
      facts: [
        { value: '4', label: 'substantive findings' },
        { value: '6', label: 'finite errors absorbed into counterterms' },
        { value: '38', label: 'automated check runs' },
      ],
      focusLabel: 'Show the corrections',
      captionOff: 'Schematic: the calculation as a chain of steps, each one re-checked.',
      captionOn: 'The corrections sit inside the chain; the late-time endpoint does not move.',
    },
    tr: {
      kind: 'Fizik denetimi',
      short: 'Graviton döngüsü denetimi',
      title: 'Tek ilmekli bir kuantum kütleçekimi hesabı, yeniden türetildi',
      question: 'Yayımlanmış bir kuantum kütleçekimi hesabı satır satır yeniden yapılırsa, vardığı sonuç yine geçerli mi?',
      summary: 'Kahya ve Woodard’ın 2007–08 tarihli iki makalesi, kütleçekimin kuantumları olan gravitonların kozmik şişme sırasında basit bir alanın davranışını değiştirip değiştirmediğini soruyordu. Hesap Claude ile adım adım yeniden yapıldı ve bağımsız kodla sınandı.',
      verdictPlain: 'Ana sonuç geçerli; düzeltmeler gerekli',
      result: 'Sonuç geçerli: geç zamanlarda kayda değer bir değişiklik yok. Denetim yol boyunca bir işaret hatası, iki yanlış tablo girdisi ve tutmayan bir gerekçe buldu; hiçbiri geç zaman sonucunu değiştirmiyor.',
      detail: 'Feynman kurallarından geç zamandaki mod fonksiyonuna kadar yeniden türetildi, SymPy/mpmath ile sınandı. Basılı öz-kütlenin işareti makalenin kendi tanımının tersi, son tablodaki iki girdi düzeltilmeli ve bir kısaltmanın gerekçesi tutmuyor; kısaltmanın sonucu ise doğru. Ekteki hesap tabloları baştan yapılmadı, denetlendi.',
      facts: [
        { value: '4', label: 'esaslı bulgu' },
        { value: '6', label: 'karşı terimlere soğurulan sonlu hata' },
        { value: '38', label: 'otomatik denetim koşusu' },
      ],
      focusLabel: 'Düzeltmeleri göster',
      captionOff: 'Şematik: hesap, her halkası yeniden denetlenen bir zincir.',
      captionOn: 'Düzeltmeler zincirin içinde kalıyor; geç zamandaki uç nokta yerinden oynamıyor.',
    },
  },
  {
    id: 'conformal-scalar-audit',
    numeral: 'II',
    year: 2026,
    tint: 'violet',
    repo: 'https://github.com/eokahya/claude-audits-conformal-scalar',
    en: {
      kind: 'Physics audit',
      short: 'Conformal scalar audit',
      title: 'Quantum gravity and a conformally coupled scalar: an audit',
      question: 'Does gravity make a certain field keep growing during inflation, as an earlier paper concluded?',
      summary: 'A 2017 paper, built on two earlier ones and co-authored by Emre Onur Kahya, concluded that quantum gravity makes a “conformally coupled” field keep growing during inflation. The calculations of all three were redone blind, step by step, with Claude.',
      verdictPlain: 'The claimed growth is not there',
      result: 'The claimed growth does not survive: in the corrected calculation the field keeps fading as the universe expands. A small leftover correction is not a prediction, because its size depends on a free constant that the calculation leaves open.',
      detail: 'Three papers and the 2018 erratum to the third, one-loop corrections in de Sitter space. The building blocks hold, but 43 substantive errors turned up. Corrected, the mode keeps redshifting; the remaining relative ln a term is set by a free finite counterterm and vanishes for one choice of it.',
      facts: [
        { value: '158', label: 'findings in all' },
        { value: '43', label: 'substantive errors' },
        { value: '33 + 12', label: 'sequential tasks + global tests' },
      ],
      focusLabel: 'Show the published claim',
      captionOff: 'Schematic: in the corrected calculation the mode keeps fading as space expands.',
      captionOn: 'Dashed: the growth claimed in print. It does not survive the correction.',
    },
    tr: {
      kind: 'Fizik denetimi',
      short: 'Konformal skaler denetimi',
      title: 'Kuantum kütleçekimi ve konformal bağlaşımlı skaler alan: bir denetim',
      question: 'Kütleçekim, daha önceki bir makalenin vardığı gibi, kozmik şişme sırasında belirli bir alanı durmadan büyütür mü?',
      summary: 'Emre Onur Kahya’nın ortak yazarı olduğu ve iki önceki çalışmaya dayanan 2017 tarihli bir makale, kuantum kütleçekiminin “konformal bağlaşımlı” bir alanı kozmik şişme boyunca büyütmeyi sürdürdüğü sonucuna varmıştı. Üç makalenin hesapları da Claude ile kör biçimde, adım adım yeniden yapıldı.',
      verdictPlain: 'İddia edilen büyüme yok',
      result: 'İddia edilen büyüme ayakta kalmıyor: düzeltilmiş hesapta alan, evren genişledikçe sönmeyi sürdürüyor. Geriye kalan küçük düzeltme bir öngörü değil; büyüklüğü, hesabın belirlemediği serbest bir sabite bağlı.',
      detail: 'Üç makale ve üçüncüsüne ait 2018 düzeltme notu; de Sitter uzayında tek ilmek düzeltmeleri. Yapı taşları sağlam, ancak 43 esaslı hata bulundu. Düzeltilmiş hesapta mod kırmızıya kaymayı sürdürüyor; kalan göreli ln a terimi serbest, sonlu bir karşı terime bağlı ve belirli bir seçimde sıfırlanıyor.',
      facts: [
        { value: '158', label: 'toplam bulgu' },
        { value: '43', label: 'esaslı hata' },
        { value: '33 + 12', label: 'ardışık görev + genel test' },
      ],
      focusLabel: 'Yayımlanan iddiayı göster',
      captionOff: 'Şematik: düzeltilmiş hesapta mod, uzay genişledikçe sönmeyi sürdürüyor.',
      captionOn: 'Kesikli çizgi: basılı makalede iddia edilen büyüme. Düzeltmeden sonra ayakta kalmıyor.',
    },
  },
  {
    id: 'moe-rotation-pilot',
    numeral: 'III',
    year: 2026,
    tint: 'cyan',
    verdict: 'NO_SUPPORT_FOR_BANK',
    repo: 'https://github.com/eokahya/moe-transformation-supervision-mnist-pilot',
    en: {
      kind: 'ML experiment · pre-registered',
      short: 'Rotation-supervised experts',
      title: 'Rotation-supervised experts: a negative MNIST pilot',
      question: 'Does a bank of four experts, with a gate trained on the rotation label, beat simpler networks of equal size?',
      summary: 'A small pre-registered pilot on MNIST digits rotated in 90-degree steps: six model arms, three seeds, 18 runs under rules fixed before training, pitting a rotation-supervised mixture of experts against matched controls.',
      verdictPlain: 'Expert bank not supported; line closed',
      result: 'Supervision lifted the same mixture of experts by 4.49 percentage points, but a parameter-matched control using one shared network did better in all three seeds (96.11% vs 95.70%). The bank was not supported; this line of research was closed.',
      facts: [
        { value: '+4.49 pp', label: 'gain from rotation supervision, same mixture of experts' },
        { value: '96.11% vs 95.70%', label: 'shared-network control vs supervised expert bank' },
        { value: '18', label: 'pre-registered runs (6 arms × 3 seeds)' },
      ],
      focusLabel: 'Remove the rotation supervision',
      captionOff: 'Schematic: four expert lanes (left) and one shared, parameter-matched network (right) land close together; the shared one slightly ahead.',
      captionOn: 'Without rotation supervision the digits are no longer sorted by orientation and the bank lands lower: supervision helped the bank, but not enough to beat the shared network.',
    },
    tr: {
      kind: 'ML deneyi · önkayıtlı',
      short: 'Dönüş denetimli uzmanlar',
      title: 'Dönüş denetimli uzmanlar: MNIST’te olumsuz sonuçlanan bir pilot',
      question: 'Dönüş etiketiyle eğitilen bir yönlendiricinin iş dağıttığı dört uzman ağ, eşit boyutlu basit ağları geçer mi?',
      summary: '90 derecelik adımlarla döndürülmüş MNIST rakamlarında küçük, önceden kayda geçirilmiş bir pilot: altı model, üç başlangıç tohumu (seed), kuralları eğitimden önce sabitlenmiş 18 koşu. Dönüş denetimli uzman karışımı (MoE), parametre sayısı eşlenmiş kontrollerle karşılaştırıldı.',
      verdictPlain: 'Uzman bankası desteklenmedi; araştırma dalı kapatıldı',
      result: 'Dönüş denetimi aynı uzman karışımını 4,49 yüzde puan iyileştirdi; ancak tek ortak ağa dayanan, parametre sayısı eşlenmiş kontrol üç seed’de de daha iyiydi (%96,11’e karşı %95,70). Uzman bankası desteklenmedi; araştırma dalı kapatıldı.',
      facts: [
        { value: '+4,49 yp', label: 'dönüş denetiminin aynı uzman karışımına kazancı' },
        { value: '%96,11 / %95,70', label: 'ortak ağlı kontrol ve denetimli uzman bankası' },
        { value: '18', label: 'önkayıtlı koşu (6 model × 3 seed)' },
      ],
      focusLabel: 'Dönüş denetimini kaldır',
      captionOff: 'Şematik: dört uzman kulvarı (solda) ve parametre sayısı eşlenmiş tek ortak ağ (sağda) birbirine yakın sonuçlanıyor; ortak ağ biraz önde.',
      captionOn: 'Dönüş denetimi olmadan rakamlar artık yönlerine göre ayrılmıyor ve banka daha aşağıda kalıyor: denetim bankaya yaradı, ama ortak ağı geçmesine yetmedi.',
    },
  },
  {
    id: 'split-or-enrich',
    numeral: 'IV',
    year: 2026,
    tint: 'green',
    verdict: 'NO_ADDED_UTILITY',
    repo: 'https://github.com/eokahya/split-or-enrich-kronecker-expert-selection',
    en: {
      kind: 'ML experiment · pre-registered',
      short: 'Split or enrich',
      title: 'Split or enrich: sizing experts before training',
      question: 'With a fixed parameter budget, can a quick look before training say whether to use more or bigger experts?',
      summary: 'A frozen, pre-registered synthetic test: a score from initial gradients picks among nine Kronecker-factored mixture-of-experts layouts with equal parameter counts, across 24 linear environments and 432 training runs.',
      verdictPlain: 'Good choices, but no added benefit shown',
      result: 'The selector chose well in all 24 environments, but a simple covariance-corrected score was strong too, and the pre-registered requirement of an added benefit over it was not met. The language-model stage was not started.',
      detail: 'Regret is the chosen layout’s extra test loss over the best trained layout, as a fraction of a reference loss. On the 12 anisotropic environments the tested score’s mean regret was 0.00040 and the covariance-corrected score’s 0.00038, a gap too small to show either superiority or equivalence. Because the baseline was already far inside the required 0.01 margin, no selector could have passed this test; the threshold was not changed afterwards. The four-small-experts layout never won in any environment.',
      facts: [
        { value: '24 / 24', label: 'environments chosen well (regret ≤ 0.02)' },
        { value: '9', label: 'candidate layouts, equal parameter count' },
        { value: '432', label: 'training runs in the frozen experiment' },
      ],
      focusLabel: 'Show the initial gradients',
      captionOff: 'Schematic: one fixed budget, arranged as fewer larger or more smaller experts. Both selectors find good layouts, not always the same one.',
      captionOn: 'Both scores decide from a quick look at the initial gradients; the test could not show that the new one adds anything.',
    },
    tr: {
      kind: 'ML deneyi · önkayıtlı',
      short: 'Böl ya da zenginleştir',
      title: 'Bölmek mi, zenginleştirmek mi: uzman düzenini eğitimden önce seçmek',
      question: 'Parametre bütçesi sabitken, eğitim öncesi hızlı bir ölçüm uzmanları çoğaltmayı mı büyütmeyi mi önerebilir?',
      summary: 'Dondurulmuş, önkayıtlı sentetik bir sınama: başlangıç gradyanlarından hesaplanan bir skor, parametre sayısı eşit dokuz uzman karışımı (MoE) düzeni arasından seçim yapıyor; uzmanlar Kronecker çarpanlarıyla kurulu. 24 doğrusal ortam, 432 eğitim koşusu.',
      verdictPlain: 'İyi seçim, ama ek fayda gösterilemedi',
      result: 'Seçici 24 ortamın hepsinde iyi seçim yaptı; ancak basit, kovaryans düzeltmeli bir skor da güçlüydü ve önceden konan “ek fayda” koşulu sağlanamadı. Dil modeli aşaması başlatılmadı.',
      detail: 'Regret, seçilen düzenin test kaybının eğitilmiş en iyi düzeninkini ne kadar aştığını bir referans kaybın kesri olarak ölçer. 12 anizotropik ortamda sınanan skorun ortalama regret’i 0,00040, kovaryans düzeltmeli skorunki 0,00038 idi; bu fark ne üstünlüğü ne de denkliği gösterecek büyüklükte. Karşılaştırıcı, istenen 0,01’lik farkın zaten çok altında olduğundan hiçbir seçici bu koşulu sağlayamazdı; eşik sonradan değiştirilmedi. Dört küçük uzmanlı düzen hiçbir ortamda en iyi çıkmadı.',
      facts: [
        { value: '24 / 24', label: 'iyi seçim yapılan ortam (regret ≤ 0,02)' },
        { value: '9', label: 'aday düzen, parametre sayısı eşit' },
        { value: '432', label: 'dondurulmuş deneydeki eğitim koşusu' },
      ],
      focusLabel: 'Başlangıç gradyanlarını göster',
      captionOff: 'Şematik: aynı sabit bütçe, daha az sayıda büyük ya da daha çok sayıda küçük uzmana dağıtılıyor. İki seçici de iyi düzenler buluyor, ama her zaman aynısını değil.',
      captionOn: 'İki skor da başlangıç gradyanlarına hızlı bir bakışla karar veriyor; sınama yeni skorun ek bir katkısını gösteremedi.',
    },
  },
  {
    id: 'gpt2-spectral-audit',
    numeral: 'V',
    year: 2026,
    tint: 'coral',
    verdict: 'NO-GO',
    repo: 'https://github.com/eokahya/gpt2-spectral-mean-causal-audit',
    en: {
      kind: 'ML experiment · pre-registered',
      short: 'GPT-2 stand-ins',
      title: 'GPT-2: a mean or a Gaussian for discarded directions?',
      question: 'When a layer is cut to its strongest directions, what should stand in for the rest: a mean or a Gaussian?',
      summary: 'A pre-registered causal audit of GPT-2 small (block-9 MLP, SVD rank 192): the discarded part was replaced by its calibrated mean or a Gaussian expectation, and the response to a year-swap intervention was compared with the full model on sealed test prompts.',
      verdictPlain: 'Large error either way; Gaussian slightly worse',
      result: 'In the main SVD comparison both stand-ins left a large error, and the Gaussian made it slightly larger than the mean. A different basis, PCA plus mean, chosen after calibration, met only a narrow scalar tolerance; its response vectors still had about 14–15% relative error. A separate follow-up was inconclusive, and a second, exploratory branch was closed.',
      detail: 'Main test (SVD, rank 192, last token): RMS error 1.275 with the mean and 1.301 with the Gaussian, against an original response RMS of 1.758. The PCA + mean result (RMS 0.068, under a tolerance of 0.090) is a secondary arm chosen after calibration, not the main comparison.',
      facts: [
        { value: '1.275 / 1.301 vs 1.758', label: 'RMS error with the mean / Gaussian stand-in vs RMS of the original response' },
        { value: '+0.0268', label: 'RMS error, Gaussian minus mean (95% CI 0.0235–0.0302)' },
        { value: '13.8% / 15.3%', label: 'relative error of the response vector, PCA + mean (MLP output / logits)' },
        { value: 'INCONCLUSIVE', label: 'separate follow-up study' },
      ],
      focusLabel: 'Use a Gaussian stand-in',
      captionOff: 'Schematic: with the discarded directions replaced by their mean, the reduced model’s response to the year swap (its echo) lands well away from the original’s.',
      captionOn: 'A Gaussian stand-in moves it slightly further away still.',
    },
    tr: {
      kind: 'ML deneyi · önkayıtlı',
      short: 'GPT-2 vekilleri',
      title: 'GPT-2: atılan yönlere ortalama mı, Gauss mu?',
      question: 'Bir katman en güçlü yönlerine indirildiğinde, atılan kısmın yerini ortalama mı tutmalı, Gauss mu?',
      summary: 'GPT-2 small üzerinde önceden kayda geçirilmiş bir nedensel denetim (blok 9 MLP, SVD ile rank 192): atılan kısmın yerine kalibre edilmiş ortalaması ya da Gauss beklenen değeri kondu; yıl değişimi müdahalesine verilen yanıt, mühürlü test istemlerinde (prompt) tam modelinkiyle karşılaştırıldı.',
      verdictPlain: 'İki durumda da hata büyük; Gauss biraz daha kötü',
      result: 'Ana SVD karşılaştırmasında iki vekil de büyük bir hata bıraktı ve Gauss hatayı ortalamaya göre biraz daha artırdı. Kalibrasyondan sonra seçilen farklı bir baz, PCA ile ortalama, yalnızca dar bir skaler toleransı geçti; yanıt vektörlerinde yine yaklaşık %14–15 bağıl hata kaldı. Ayrı bir takip çalışması kesin sonuç vermedi; keşif amaçlı ikinci bir dal da kapatıldı.',
      detail: 'Ana sınama (SVD, rank 192, son token): RMS hata ortalamayla 1,275, Gauss ile 1,301; özgün yanıtın RMS değeri 1,758. PCA + ortalama sonucu (RMS 0,068; 0,090 toleransının altında), kalibrasyondan sonra seçilmiş ikincil bir koldur, ana karşılaştırma değildir.',
      facts: [
        { value: '1,275 / 1,301 / 1,758', label: 'ortalama / Gauss vekiliyle RMS hata ve özgün yanıtın RMS değeri' },
        { value: '+0,0268', label: 'RMS hata farkı, Gauss eksi ortalama (%95 GA 0,0235–0,0302)' },
        { value: '%13,8 / %15,3', label: 'yanıt vektörünün bağıl hatası, PCA + ortalama (MLP çıktısı / logitler)' },
        { value: 'INCONCLUSIVE', label: 'ayrı takip çalışması (kesin sonuç vermedi)' },
      ],
      focusLabel: 'Gauss vekili kullan',
      captionOff: 'Şematik: atılan yönlerin yerine ortalamaları konduğunda, küçültülmüş modelin yıl değişimine verdiği yanıt (yankısı) özgün modelinkinden belirgin biçimde uzağa düşüyor.',
      captionOn: 'Gauss vekili onu biraz daha uzağa itiyor.',
    },
  },
];

export const projectText = (project: Project, lang: Lang) => project[lang];
