# Kamuya açık akademik kaynaklar

Kontrol tarihi: **2 Ekim 2026** (`2026-10-02`, Europe/Istanbul).

Bu dosya, sitedeki akademik içeriğin kaynak ve kapsam kaydıdır. Veriler bir defa doğrulanıp `src/data/profile.ts`, `src/data/research.ts` ve `src/data/publications.ts` içine yerel snapshot olarak yazılmıştır. Build canlı ORCID, INSPIRE, DOI veya İTÜ API erişimi gerektirmez. Metinler kaynak özetlerinin kopyası değil, bu site için yazılmış kısa açıklamalardır. Görsel bilim anlatısı araştırma sonucu olarak sunulmaz.

## Kimlik eşleştirmesi

- [İTÜ Akademi profili](https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya): Prof. Dr. Emre Onur Kahya; Fizik Mühendisliği; 2018'den itibaren profesörlük. Lisans 2000, yüksek lisans 2002, Florida doktorası 2008 doğrulanır. Bu profil, görev ve temel fizik eğitimi için kurumsal kaynaktır.
- [İTÜ araştırma profili](https://research.itu.edu.tr/tr/persons/eokahya/): ad, profesör unvanı, kurum, bölüm ve **0000-0003-2760-7091** ORCID bağlantısı eşleşir.
- [ORCID](https://orcid.org/0000-0003-2760-7091) ve [public v3 record](https://pub.orcid.org/v3.0/0000-0003-2760-7091/record): Emre Onur / Kahya adı ve `eokahya@itu.edu.tr` kamuya açık doğrulanmış e-postası eşleşir. Bu kayıtta yayın listesi boştur; ORCID'de olmayan yayınlar varmış gibi gösterilmedi. Public eğitim kaydı Montréal bilgisayar bilimi yüksek lisansını 2019–2020 olarak verir ve tez DOI'sine bağlanır.
- [INSPIRE yazar profili 1039459](https://inspirehep.net/authors/1039459), [public API](https://inspirehep.net/api/authors/1039459): **E.O.Kahya.1**, tam ad, İTÜ, Florida ve Jena geçmişi kurumsal kaynakla eşleşir. Soyadına yapılan genel arama başka kişileri de getirdiği için kullanılmadı. Yayın sorgusu tam BAI ile yapıldı: [a E.O.Kahya.1 — public API, 100 kayıt üst sınırı](https://inspirehep.net/api/literature?q=a%20E.O.Kahya.1&size=100&sort=mostrecent).
- [Quantization of Carrollian fermions — INSPIRE 2878317](https://inspirehep.net/literature/2878317): APS kaynaklı yazar metaverisi Emre Onur Kahya için yukarıdaki ORCID'yi, **1039459** yazar ilişkisini ve İTÜ adresini birlikte içerir. [ArXiv kaydı](https://arxiv.org/abs/2502.05645) aynı üç yazarı gösterir. Bu, ORCID ve INSPIRE kimlik zincirinin doğrudan eşleşmesidir.

Yayın adaylarının **39/39** INSPIRE kaydında `authors[].record.$ref` alanı tam olarak `https://inspirehep.net/api/authors/1039459` yazarını içerdi; yerel doğrulama bu koşulu kontrol etti. Benzer soyadlı araştırmacılara ait kayıtlar eklenmedi. Atıf sayıları ve h-index güncel tutma yükü nedeniyle kullanılmadı.

## Bibliyografya kapsamı ve metaveri kontrolleri

Yerel liste **42 ayrı eser** içerir: **35 dergi makalesi, 4 preprint, 1 konferans makalesi ve 2 tez**. Bu sayı bir bibliyometrik başarı göstergesi değildir. Liste, eşleşen INSPIRE profilinin kontrol günü döndürdüğü 39 kaydın tamamı ile aşağıda doğrulanan üç ek eserden oluşur. Site bunu kapsamı açık bir *verified bibliography snapshot* olarak tanımlar; bütün hayat boyu akademik faaliyetlerin eksiksiz CV'si olduğu iddia edilmez. Konuşmalar, öğrenci tez danışmanlık listeleri ve doğrulanmamış adaylar eklenmedi.

- [Light-curve makalesinin İTÜ kaydı](https://research.itu.edu.tr/en/publications/on-the-classification-and-feature-relevance-of-multiband-light-cu/): üç yazar, 2021, Astronomical Journal 161(4), 168 ve [10.3847/1538-3881/abdecf DOI](https://doi.org/10.3847/1538-3881/abdecf) doğrulanır. DOI metaverisi de aynı başlığı ve Emre O. Kahya'yı gösterir.
- [Identifying electrons with deep learning methods](https://doi.org/10.71781/10723): ORCID eğitim kaydının doğrudan verdiği tez DOI'sidir. [DataCite kaydı](https://api.datacite.org/dois/10.71781/10723), Emre Onur Kahya adını, tam başlığı ve **2020** tez yılını verir. DOI [Université de Montréal'in kurumsal kaydına](https://umontreal.scholaris.ca/items/be193d07-3f61-4b33-b05d-00f5ab7e3c6a) yönlendi; public shell fetch başarılıydı. Bazı bölüm personel sayfaları arşivlenen tezi 2021 başlığı altında listeler; yayın veri dosyasında tez/degree yılı olan 2020 kullanıldı. Tez bir dergi makalesi olarak sınıflandırılmadı.
- [Satellite collision-risk arXiv kaydı](https://arxiv.org/abs/2609.13191): dört yazar ve 2026 doğrulanır. [Public tam metnin yazar başlığı](https://arxiv.org/html/2609.13191v1), Emre O. Kahya'yı İTÜ Fizik Mühendisliği profesörü ve aynı kurumsal e-posta ile eşleştirir. ArXiv yorumlarında konferans kabulü bildirilir; site bunu bir preprint olarak gösterir ve dergi yayını/DOI uydurmaz.

37 farklı journal DOI/erratum DOI'si Crossref public registry ile sorgulandı; **31** metaveri cevabı başarıyla okunup ad, başlık ve yıl incelendi. **6** DOI isteği `429 Too Many Requests` döndürdü. Bu cevaplar kaydın yokluğu anlamına gelmez; ilgili eserler aşağıdaki kimliği eşleşmiş INSPIRE kayıtlarıyla doğrulanmıştır. Crossref cevabı alınamayan DOI'ler: `10.1016/j.dark.2025.101965`, `10.1063/1.3681886`, `10.1103/PhysRevD.72.104001`, `10.1103/PhysRevD.92.103511`, `10.1142/S0219887814500613`, `10.1155/2014/282675`. Bu altı kayıt için Crossref doğrulaması başarıyla tamamlandı denmez.

DOI/arXiv kopyaları tek kayıtta birleştirildi; aynı DOI ya da arXiv kimliğinin iki eser kaydında bulunmadığı yerel olarak kontrol edildi. 2017 mode-equations makalesinin 2018 erratum'u ayrı yeni eser sayılmadı; ilgili kaydın `notes` alanından bağlantı verildi. CosmoVerse büyük yazar listesi, INSPIRE'ın verdiği kolektif **CosmoVerse Network** kredisiyle gösterilir; bireysel Emre Onur Kahya yazar ilişkisi ayrıca kontrol edildi. Tam yazar listesi asıl kayıtta bulunur.

## Çözülen tarih / başlık farklılıkları

- **Holographic boundary conformal field theory within Horndeski gravity**: İTÜ Pure ve INSPIRE'ın bazı normalize alanları 2025 gösterirken [yayıncı kaynaklı DOI metaverisi](https://api.crossref.org/works/10.1007%2FJHEP12%282024%29217) **30 Aralık 2024** verir. [Yayıncı PDF'nin ilk sayfası](https://inspirehep.net/files/5a750eb6dea287232820e38485c45087) da bu tarihi ve JHEP12(2024)217'yi doğrular. Yerel kayıt **2024** olarak düzeltildi.
- **The ζ–ζ correlator is time dependent**: INSPIRE'ın yıl alanı 2011; [DOI registry](https://api.crossref.org/works/10.1016%2Fj.physletb.2010.09.050) ve İTÜ Akademi kaydı yayım yılını **2010** verir. Yerel snapshot yayımlanma yılı olarak **2010** kullanır; DOI ve arXiv tek eser olarak kalır.
- **One loop corrected mode functions for scalar QED during inflation** ve 2008 **dark matter emulators** konferans makalesi başlıkları, arXiv/INSPIRE varyantları yerine yayıncı kaynaklı Crossref başlığıyla kaydedildi. Matematik içeren başlıklardaki XML/MathML ve TeX, anlamı korunarak okunabilir Unicode/düz metne dönüştürüldü.

## Araştırma metinlerinin dayanakları

- **Quantum Fields and Gravitation**: [2017 mode equations](https://inspirehep.net/literature/1614630), [2014 conformally coupled scalar self-mass](https://inspirehep.net/literature/1319289), [2012 graviton propagator](https://inspirehep.net/literature/1082014) ve [2025 Carrollian fermions](https://arxiv.org/abs/2502.05645). Açıklamalar başlık/abstract kapsamından türetildi; yeni bir sonuç eklenmedi.
- **Cosmology and Modified Gravity**: [f(R) theories](https://inspirehep.net/literature/1768430), [GW170817](https://inspirehep.net/literature/1631136), [IceCube Shapiro delay](https://inspirehep.net/literature/1682331), [Horndeski holography](https://arxiv.org/abs/2410.18781) ve [2026 cosmology preprint](https://arxiv.org/abs/2604.12987). GW170817 sonucu belirli bir teori sınıfına ilişkin olarak anlatıldı; bütün modified gravity modellerinin çürütüldüğü iddia edilmedi.
- **Machine Learning for Physics**: light-curve makalesi, yazarın elektron tanımlama tezi ve 2026 uydu preprint'i. CERN'deki kamuya açık [2019 electron-identification sunumu](https://indico.cern.ch/event/860279/contributions/3623134/attachments/1936757/3209907/el_id.pdf) de Emre Onur Kahya'yı isimle gösterir; sunum bibliyografyaya ayrı dergi makalesi gibi eklenmedi.
- **Mechanistic Interpretability and Reliable AI**: kullanıcının `WEBSITE_BRIEF.md` içinde belirttiği **güncel araştırma yönelimi**. Bu yönde yayımlanmış sonuç veya güvenlik garantisi oluşturulmadı; `evidence` alanı bilerek boştur ve `status` açıkça `Current research direction` değeridir.

## Erişim sınırlamaları

ORCID'nin normal HTML sayfası JavaScript gerektirdi; public API başarıyla okundu. İTÜ Pure'ın bütün-yayınlar alt sayfası bazı araçlarda **403** döndürdü; açılabilen profil ve eser sayfaları, İTÜ Akademi ve INSPIRE kullanıldı. Üniversite tez kaydı web-reader'da 403 döndürmesine rağmen aynı public URL shell üzerinden 200 ile okunabildi ve DataCite ile eşleşti. 403/429, akademik kaydın olmadığı şeklinde yorumlanmadı. Üçüncü taraf PDF'ler, tez tam metinleri ve kitaplar siteye aynalanmadı; asıl kaynaklarına bağlantı verildi.

## Eser bazında kaynak izi

Her satır **2026-10-02** tarihinde kontrol edildi. “Crossref” publisher-deposited DOI metaverisinin okunduğunu; “INSPIRE” kimliği eşleşmiş yazar-kayıt ilişkisini; “DataCite” tez DOI registry'sini gösterir. DOI bağlantısı ek kaynak, HTTP erişilebilirliğinin sürekli garantisi değildir.

| Eser / yıl | Kimlik ve metaveri kanıtı | Kaynaklar |
| --- | --- | --- |
| Do equation of state parametrizations of dark energy faithfully capture the dynamics of the late universe? (2026) | INSPIRE: exact author 1039459; arXiv title/authors | [INSPIRE](https://inspirehep.net/literature/3144795), [arXiv](https://arxiv.org/abs/2604.12987) |
| Early Prediction of Satellite Collision Probability Using a Hybrid TCN-Transformer Model for a CDM-Based Conjunction Analysis Framework (2026) | arXiv full text: same name, İTÜ affiliation and email | [arXiv](https://arxiv.org/abs/2609.13191), [Full text](https://arxiv.org/html/2609.13191v1) |
| Hints of sign-changing scalar field energy density and a transient acceleration phase at z ∼ 2 from model-agnostic reconstructions (2026) | INSPIRE: exact author 1039459; arXiv title/authors | [INSPIRE](https://inspirehep.net/literature/3117757), [arXiv](https://arxiv.org/abs/2602.08928) |
| Stationary solutions in the small-c expansion of GR (2026) | INSPIRE: exact author 1039459; arXiv title/authors | [INSPIRE](https://inspirehep.net/literature/3149343), [arXiv](https://arxiv.org/abs/2604.23677) |
| Quantization of Carrollian fermions (2025) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/2878317), [DOI](https://doi.org/10.1103/PhysRevD.111.105019), [arXiv](https://arxiv.org/abs/2502.05645) |
| The CosmoVerse White Paper: Addressing observational tensions in cosmology with systematics and fundamental physics (2025) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/2907383), [DOI](https://doi.org/10.1016/j.dark.2025.101965), [arXiv](https://arxiv.org/abs/2504.01669) |
| Holographic boundary conformal field theory within Horndeski gravity (2024) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/2842587), [DOI](https://doi.org/10.1007/JHEP12(2024)217), [arXiv](https://arxiv.org/abs/2410.18781) |
| On the Classification and Feature Relevance of Multiband Light Curves (2021) | İTÜ author profile; Crossref | [İTÜ](https://research.itu.edu.tr/en/publications/on-the-classification-and-feature-relevance-of-multiband-light-cu/), [DOI](https://doi.org/10.3847/1538-3881/abdecf) |
| Identifying electrons with deep learning methods (2020) | ORCID education DOI; DataCite; institutional thesis | [DOI](https://doi.org/10.71781/10723), [DataCite](https://api.datacite.org/dois/10.71781/10723), [ORCID](https://orcid.org/0000-0003-2760-7091) |
| Superconformal generalizations of auxiliary vector modified polynomial f(R) theories (2020) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1768430), [DOI](https://doi.org/10.1088/1475-7516/2020/04/005), [arXiv](https://arxiv.org/abs/1912.01919) |
| Constraints on differential Shapiro delay between neutrinos and photons from IceCube-170922A (2019) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1682331), [DOI](https://doi.org/10.1140/epjc/s10052-019-6695-6), [arXiv](https://arxiv.org/abs/1807.05201) |
| Galactic Shapiro delay to the Crab pulsar and limit on weak equivalence principle violation (2018) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1502315), [DOI](https://doi.org/10.1140/epjc/s10052-018-5571-0), [arXiv](https://arxiv.org/abs/1612.02532) |
| GW170817 falsifies dark matter emulators (2018) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1631136), [DOI](https://doi.org/10.1103/PhysRevD.97.041501), [arXiv](https://arxiv.org/abs/1710.06168) |
| Loop corrections to primordial non-Gaussianity (2018) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1413719), [DOI](https://doi.org/10.1103/PhysRevD.97.043507), [arXiv](https://arxiv.org/abs/1601.01106) |
| Broken scale invariance, α-attractors and vector impurity (2017) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1470921), [DOI](https://doi.org/10.1140/epjc/s10052-017-4874-x), [arXiv](https://arxiv.org/abs/1606.05308) |
| One loop corrected conformally coupled scalar mode equations during inflation (2017) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1614630), [DOI](https://doi.org/10.1103/PhysRevD.96.105003), [arXiv](https://arxiv.org/abs/1708.01831) |
| Quantum gravity corrections to the conformally coupled scalar self-mass-squared on de Sitter background. II. Kinetic conformal cross terms (2017) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1593746), [DOI](https://doi.org/10.1103/PhysRevD.96.025001), [arXiv](https://arxiv.org/abs/1704.05880) |
| Constraints on frequency-dependent violations of Shapiro delay from GW150914 (2016) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1421643), [DOI](https://doi.org/10.1016/j.physletb.2016.03.033), [arXiv](https://arxiv.org/abs/1602.04779) |
| Galactic one-way Shapiro delay to PSR B1937+21 (2016) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1401199), [DOI](https://doi.org/10.1142/S0217732316500838), [arXiv](https://arxiv.org/abs/1510.08228) |
| Constructing an Inflaton Potential by Mimicking Modified Chaplygin Gas (2015) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/1359425), [DOI](https://doi.org/10.1103/PhysRevD.92.103511), [arXiv](https://arxiv.org/abs/1504.03412) |
| Higher order corrections of the extended Chaplygin gas cosmology with varying G and Λ (2015) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1280920), [DOI](https://doi.org/10.1140/epjc/s10052-015-3263-6), [arXiv](https://arxiv.org/abs/1402.2592) |
| The universe dominated by the extended Chaplygin gas (2015) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1342929), [DOI](https://doi.org/10.1142/S0217732315500704), [arXiv](https://arxiv.org/abs/1502.01189) |
| Extended Chaplygin gas model (2014) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1309518), [DOI](https://doi.org/10.1016/j.rinp.2014.05.007) |
| FRW Cosmology with the Extended Chaplygin Gas (2014) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1294132), [DOI](https://doi.org/10.1155/2014/231452), [arXiv](https://arxiv.org/abs/1405.0667) |
| Interacting two-component fluid models with varying EoS parameter (2014) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/1267496), [DOI](https://doi.org/10.1142/S0219887814500613), [arXiv](https://arxiv.org/abs/1312.1162) |
| Observational constraints on the extended Chaplygin gas inflation (2014) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1316411), [DOI](https://doi.org/10.1007/s10509-014-2069-6) |
| Quantum gravity corrections to the conformally coupled scalar self-mass-squared on de Sitter background (2014) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/1319289), [DOI](https://doi.org/10.1103/PhysRevD.90.124054), [arXiv](https://arxiv.org/abs/1409.7753) |
| Testing a Dilaton Gravity Model using Nucleosynthesis (2014) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/1261851), [DOI](https://doi.org/10.1155/2014/282675), [arXiv](https://arxiv.org/abs/1310.6145) |
| The Coincidence Limit of the Graviton Propagator in de Donder Gauge on de Sitter Background (2012) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/1082014), [DOI](https://doi.org/10.1063/1.3681886), [arXiv](https://arxiv.org/abs/1112.4420) |
| A useful guide for gravitational wave observers to test modified gravity models (2011) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/841841), [DOI](https://doi.org/10.1016/j.physletb.2011.05.073), [arXiv](https://arxiv.org/abs/1001.0725) |
| Completely regular quantum stress tensor with w < −1 (2010) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/819121), [DOI](https://doi.org/10.1103/PhysRevD.81.023508), [arXiv](https://arxiv.org/abs/0904.4811) |
| The ζ–ζ correlator is time dependent (2010) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/858985), [DOI](https://doi.org/10.1016/j.physletb.2010.09.050), [arXiv](https://arxiv.org/abs/1006.3999) |
| A decisive test to confirm or rule out the existence of dark matter emulators using gravitational wave observations (2008) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/777331), [DOI](https://doi.org/10.1088/0264-9381/25/18/184008), [arXiv](https://arxiv.org/abs/0801.1984) |
| Quantum Gravitational Correction to Scalar Field Equations during Inflation (2008) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/1263713) |
| Reduced time delay for gravitational waves with dark matter emulators (2008) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/784182), [DOI](https://doi.org/10.1103/PhysRevD.77.124041), [arXiv](https://arxiv.org/abs/0804.3804) |
| Scalar field equations from quantum gravity during inflation (2008) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/765838), [DOI](https://doi.org/10.1103/PhysRevD.77.084012), [arXiv](https://arxiv.org/abs/0710.5282) |
| A generic test of modified gravity models which emulate dark matter (2007) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/749690), [DOI](https://doi.org/10.1016/j.physletb.2007.07.029), [arXiv](https://arxiv.org/abs/0705.0153) |
| Quantum gravity corrections to the one loop scalar self-mass during inflation (2007) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/759916), [DOI](https://doi.org/10.1103/PhysRevD.76.124005), [arXiv](https://arxiv.org/abs/0709.0536) |
| Quantum stability of a w < −1 phase of cosmic acceleration (2007) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/733341), [DOI](https://doi.org/10.1103/PhysRevD.76.043512), [arXiv](https://arxiv.org/abs/gr-qc/0612026) |
| One loop corrected mode functions for scalar QED during inflation (2006) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/723503), [DOI](https://doi.org/10.1103/PhysRevD.74.084012), [arXiv](https://arxiv.org/abs/gr-qc/0608049) |
| Charged scalar self-mass during inflation (2005) | INSPIRE: exact author 1039459 | [INSPIRE](https://inspirehep.net/literature/688934), [DOI](https://doi.org/10.1103/PhysRevD.72.104001), [arXiv](https://arxiv.org/abs/gr-qc/0508015) |
| Higher dimensional metrics of colliding gravitational plane waves (2002) | INSPIRE: exact author 1039459; Crossref | [INSPIRE](https://inspirehep.net/literature/585315), [DOI](https://doi.org/10.1103/PhysRevD.66.024029), [arXiv](https://arxiv.org/abs/gr-qc/0204041) |

## Ders kaynakları — 2026-10-02

- https://ninova.itu.edu.tr/en/courses/faculty-of-science-and-letters/37319/myz-310e/ — MYZ310E, Machine Learning in Physics; coordinator Emre Onur Kahya; English. Public page read. The copyright footer2026 does not prove that every course-plan item is a2026 offering.
- https://ninova.itu.edu.tr/en/courses/faculty-of-science-and-letters/37319/myz-310e/form — public course-information form read through direct shell fetch after the web reader could not open it. Neither this form nor older evaluation pages override the instructor-specified30/30/40 and midterm40% AND both-presentations rules in WEBSITE_BRIEF.md.
- https://mitliagkas.github.io/ift6390-ml-class/ — page title explicitly says **Automne2023**, with a note about2024 teaching. Its public foundation topics informed the selective adaptation; it is not presented as a2026 syllabus. Its quizzes/homework/competition/examination scheme is not imported into MYZ310E.
- https://probml.github.io/pml-book/book1.html and https://www.deeplearningbook.org/ — original supplementary book sites, HTTP200 verified. No copied textbook files or invented chapter assignments.
- https://transformerlensorg.github.io/TransformerLens/ — official tool documentation and introductory mechanistic-interpretability materials read; original link only.

All profile and course resource URLs returned HTTP 200 in the direct link check on 2026-10-02 (the GitHub profile after one transient 504).

---

# Ek doğrulamalar (bu sürüm, 2 Ekim 2026)

Bu bölüm, yukarıdaki doğrulanmış snapshot'ın üzerine bu sürümde yapılan ek kontrolleri kaydeder.

## Crossref ile yeniden karşılaştırma

Dergi kaydı olan 36 DOI'nin tamamı 2 Ekim 2026'da Crossref public API'sinden (`https://api.crossref.org/works/<DOI>`) bu kez hatasız okundu (daha önce 429 dönen altı DOI dahil). Başlık, dergi, cilt, makale numarası/sayfa ve yıl alanları yerel kayıtlarla karşılaştırıldı:

- **35/36 kayıt birebir uyumlu.**
- **Düzeltilen hata:** *A generic test of modified gravity models which emulate dark matter* (Physics Letters B 652, 2007; DOI 10.1016/j.physletb.2007.07.029). Önceki snapshot'ta `articleNumber: "24157"` yazıyordu; yayıncı kaydı sayfa aralığını **213–216** verir. Kayıt düzeltildi ve `notes` alanına not düşüldü.
- JCAP kaydında cilt alanı derginin `04 (2020) 005` atıf biçimine göre tutuldu; Hindawi (Advances in High Energy Physics) kayıtlarında makale kimliği (231452, 282675) makale numarası olarak gösterilir.

## Profil ayrıntıları

- [İTÜ Akademi profili](https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya) "Alınan Ödüller" bölümü: Mustafa Parlar Araştırma Teşvik Ödülü (ODTÜ Prof. Dr. Mustafa N. Parlar Eğitim ve Araştırma Vakfı, 2017); Genç Bilim İnsanı Ödülü (Bilim Kahramanları Derneği, 2016); Tübitak Teşvik (TÜBİTAK, 2016); Üstün Başarılı Genç Bilim İnsanı Ödülü – GEBİP (Türkiye Bilimler Akademisi, 2015). Aynı sayfadaki görevler: Öğretim Görevlisi İTÜ 2012–2013, Doçent 2013–2018, Profesör 2018–; Koç Üniversitesi 2008–2009 ve Friedrich-Schiller-Universität Jena 2009–2012 "Öğretim Görevlisi (Dr)"; ODTÜ araştırma görevlisi 2000–2002; UF araştırma görevlisi ve doktora 2002–2008; ODTÜ lisans 1996–2000.
- [INSPIRE yazar kaydı (API)](https://inspirehep.net/api/authors/1039459): Koç ve Jena pozisyonları `POSTDOC` olarak kayıtlı; site bu iki görevi "Postdoctoral researcher" olarak gösterir.
- [INSPIRE doktora tezi kaydı 1263713 (API)](https://inspirehep.net/api/literature/1263713): `thesis_info` = PhD, Florida U., 2008; Richard P. Woodard `supervisor` rolüyle listelenir.
- [X profili](https://x.com/EmreOnurKahya): "PhD in Physics @UF, MSc in Computer Science (AI) @Mila_Quebec" — eğitim bilgisiyle tutarlı. [Instagram profili](https://www.instagram.com/emreokahya/) bio'su Teke Tek Bilim oynatma listesine bağlantı verir.

## Bilim iletişimi snapshot'ı (`src/data/outreach.ts`)

Kaynaklar, 2 Ekim 2026'da tarayıcıda ve kamuya açık YouTube izleme sayfalarından (`ytInitialPlayerResponse` içindeki `videoDetails` / `microformat` alanları) okundu:

- [Teke Tek Bilim kanal araması: "Emre Onur Kahya"](https://www.youtube.com/@TekeTekBilim/search?query=Emre%20Onur%20Kahya) ve [Prof. Dr. Emre Onur Kahya ile Bilim Ekstra oynatma listesi](https://www.youtube.com/playlist?list=PLIWPLnDgfo-UvehLkGjmXCRuW2pAA6MGJ) (48 video). Oynatma listesinde olmayan bir Bilim Ekstra bölümü (*Zeeman etkisi ve Heisenberg resmi*, `gC3xApCbPgg`) arama sonucunda bulundu ve eklendi: **49 Bilim Ekstra bölümü**.
- **7 uzun Teke Tek Bilim programı**: başlıkta adı geçenler ve başlıkta adı geçmese de açıklamasında konuk olarak adı geçen iki program (`MsMYj4Ac2b4`: 1 Ağustos 2021 yayını, konuklar Prof. Dr. Tekin Dereli, Prof. Dr. Emre Onur Kahya, Dr. Can Kozcaz; `kPym_ScuZqE`: 12 Eylül 2021 yayını, konuklar Prof. Dr. İbrahim Semiz, Prof. Dr. Emre Onur Kahya, Prof. Dr. Erkcan Özcan). Bu iki programın YouTube'a yükleme tarihi 2023'tür; sitede yayın tarihi (aired) gösterilir.
- **5 kısa klip** (shorts) bu programlardan kesilmiştir; "program" sayısına dahil edilmez, izlenme toplamına dahildir.
- Başlıklar orijinal Türkçe başlıklardır; tekrarlayan "/ Prof. Dr. Emre Onur Kahya ile Bilim Ekstra" gibi ekler kısaltılmış, tam başlık `originalTitle` alanında tutulmuştur. YouTube'un otomatik İngilizce çevirileri kullanılmadı (orijinal başlıklar oEmbed ile doğrulandı).
- Toplamlar (2 Ekim 2026): uzun programlar 2.078.322; klipler 2.489.637; Bilim Ekstra 1.116.033 izlenme → **5.683.992** (sitede aşağı yuvarlanarak "5.6M+" gösterilir). Kendi kanalınız [@emreonurkahya](https://www.youtube.com/@emreonurkahya): 17 Elektrik ve Manyetizma/matematik videosu, toplam 26.917 izlenme.
- Kullanıcının "40 civarı program" ifadesi yerine sitede verideki sayılar kullanılır: 7 uzun program + 49 Bilim Ekstra = **56 program**.
- Tema grupları (Uzay-zaman, Kuantumun öncüleri, Nobel tarihi, Yapay zekâ, Fizikçi gibi düşünmek, Oktay Sinanoğlu, Türkiye'de üniversite ve bilim) başlıklara göre yapılmış editoryal bir gruplamadır.
- Site YouTube oynatıcısı, küçük resmi veya üçüncü taraf betiği gömmez; yalnızca bağlantı verir.

## Özgeçmişler (CV) — 2 Ekim 2026

Kullanıcının kendi özgeçmiş dosyaları bu sürümün birincil kaynağıdır ve sitede **olduğu gibi** yayımlanır:

| Dosya (sitede) | Özgün dosya | PDF oluşturma tarihi | SHA-256 |
| --- | --- | --- | --- |
| `public/cv/Emre-Onur-Kahya-CV-EN.pdf` | `cv_eng_kahya.pdf` | 28 Ağustos 2026 | `d22ecb0f339c6a07313b579625de01cf82b15497d728b2e0794c6f4ab11555f6` |
| `public/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf` | `CV_Emre_Onur_Kahya.pdf` | 2 Eylül 2026 | `55a0e4b02f6bcc7c8bd45d8f63742bb266213c2bd52e2235a578a1c5a9bd0856` |

Yayımlamadan önce iki dosyanın tüm metni ve PDF metaverisi tarandı: doğum tarihi, kimlik numarası, ev adresi, kişisel telefon veya kişisel e-posta yok; iletişim bilgileri kurumsaldır (İTÜ telefon/faks, Ayazağa adresi, `eokahya@itu.edu.tr`). `npm test` (`tests/cv.test.ts`), sitede gösterilen her konuşmanın, basın haberinin, ödülün, projenin, tezin ve hakemlik yapılan derginin PDF metninde gerçekten geçtiğini denetler.

Özgeçmişten alınanlar: iletişim bilgileri; eğitim (2021 Mila/Université de Montréal bilgisayar bilimi yüksek lisansı dahil); araştırma alanları; iş geçmişi; 5 ödül; 6 araştırma projesi (destek tutarları sitede gösterilmez); hakemlik yapılan 4 dergi; 26 konuşma (13 davetli konuşma + 13 seminer/konferans sunumu, davetli olanlar CV'deki gibi işaretli); 7 basın haberi.

Kaynaklar arasındaki farklar ve sitedeki karar:

- **Bilgisayar bilimi yüksek lisansı:** CV 2021 (derece yılı), DataCite tez kaydı 2020, ORCID eğitim kaydı 2019–2020 der. Zaman çizelgesi CV'yi izler ("2019–2021 · M.Sc. 2021"); yayın listesindeki tez kaydı DataCite'taki 2020 yılını korur.
- **Bilim Kahramanları Derneği ödülü:** CV "2015 Yılın Bilim İnsanı Ödülü", İTÜ Akademi profili "Genç Bilim İnsanı Ödülü (2016)" der. Site, yazarın kendi belgesi olan CV'yi izler. *Kullanıcının teyit etmesi önerilir.*
- **"En Değerli Hakem" (Astroparticle Physics, 2010)** yalnızca CV'de geçer; CV'deki gibi listelendi.
- **ODTÜ ve UF görevleri:** İngilizce CV "Teaching Assistant", Türkçe CV "Öğretim Görevlisi", İTÜ profili "araştırma görevlisi" der; sitedeki iki dil kendi CV'sini izler.
- **11. Workshop on Quantization, Dualities and Integrable Systems (Pamukkale):** iki CV de tarihi "21–23 Nisan 2012" verir; 12. çalıştay da 20–22 Nisan 2012'dedir. Aynı hafta sonuna denk gelen iki ardışık çalıştay olası bir yazım hatasına işaret eder (11. çalıştay 2011 olabilir); doğrulanamadığı için CV'deki tarih kullanıldı. *Kullanıcının teyit etmesi önerilir.*
- **GR21 konuşma başlığı:** İngilizce CV "Effects of Time-Dependent Scalar Mode Functions on Non-Gaussianity", Türkçe CV "Time-Dependent Scalar Mode Functions effect to Non-Gaussianity" der; konuşma başlıkları her iki dilde de İngilizce CV'deki özgün biçimiyle gösterilir.
- **IVADO projesi:** Türkçe CV'de "Jean-Franois Arguin" yazılır; doğru yazım İngilizce CV'deki "Jean-François Arguin"dir.
- **Basın haberleri:** Physics World ve Smithsonian Magazine bağlantıları açılıp başlık ve tarihle eşleştirildi ve bağlantı verildi. MIT Technology Review, Forbes, Alphr ve New Scientist haberleri ile insan doğrulaması (CAPTCHA) isteyen Ars Technica sayfası doğrulanamadığı için bağlantısız, CV'deki başlık ve tarihle listelenir.

## Türkçe sürüm

Türkçe metinler İngilizce metinlerin çevirisi değil, aynı olguların Türkçe anlatımıdır; olgular (tarihler, sayılar, başlıklar) aynı veri dosyalarından gelir. Yayın, video ve konuşma başlıkları özgün dillerinde gösterilir ve `lang` özniteliğiyle işaretlenir. Kurum ve ödül adlarının Türkçesi Türkçe CV'den ve İTÜ profilinden alındı.
