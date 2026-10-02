# GPT sürümü ile karşılaştırma (2 Ekim 2026)

Yan yana ekran görüntüleri: `artifacts/compare/desktop-side-by-side.png` ve `artifacts/compare/mobile-side-by-side.png` (yerel, Git'e girmez).

| Konu | GPT 6.1 sürümü (canlı) | Bu sürüm (yerel) |
| --- | --- | --- |
| Ana sahne | Sağ sütunda Canvas 2D tel kafes: ızgara → spiral → nokta ağı | Tam ekran WebGL, ~24 bin parçacık; beş levha: kütleçekim kuyusu + ikili kaynak ve dalgalar → evren küresi → manifold üzerinde kümeler → aktivasyonları akan ağ (devre izleme + ablation) → dinleyicilere ulaşan dalgalar. Her geçişin kendi uzamsal sırası var |
| Arka plan/renk | Tek renk koyu petrol | Her levhada değişen ortam ışıması; açık temada "kâğıt gravür" görünümü |
| Tipografi | Georgia + Arial (sistem) | Fraunces (optik boyutlu) + IBM Plex Sans/Mono, Türkçe için alt kümelenmiş |
| Bilim iletişimi | Yok | Ayrı sayfa + ana sayfa bölümü: 7 uzun program, 49 Bilim Ekstra bölümü, 5 klip, kendi kanalınızdaki 17 ders videosu, Instagram ve X; tarihli izlenme snapshot'ı (5,6M+) |
| Yayınlar | Liste | Yıl grafiği, tür/alan filtresi, arama, yıllara göre gruplama; PLB 652 sayfa hatası düzeltildi |
| Dil | Yalnızca İngilizce | İngilizce + Türkçe: her sayfada TR/EN düğmesi, `/tr/` altında Türkçe adresler, hreflang, Türkçe 404 |
| Hakkında | Kısa metin + liste | Zaman çizelgesi, 5 ödül, 6 araştırma projesi, 26 konuşma, hakemlik, iki özgeçmiş PDF'i (EN/TR) indirilebilir |
| Ders sayfası | Metin ve tablolar | Aynı tek kaynak + değerlendirme çubuğu, 14 haftalık faz şeridi, uygunluk "kapıları" diyagramı, yan gezinme |
| Syllabus PDF | 7 sayfa, 136 KB | 6 sayfa, ~574 KB (gömülü özel fontlar nedeniyle daha büyük) |
| JS kapalı / WebGL yok | Statik SVG | Her levha için statik SVG levha (koyu/açık) |
| Testler | 16 test, tarayıcı/PDF/link kontrolleri | 31 test (GPT'nin ders ve not testleri devralındı + veri, sahne, iki dil ve özgeçmiş testleri), Chromium + WebKit 332 kontrol, axe, iki dil denetimi |
| Mobil Lighthouse | GPT raporuna göre 100/100/100/100 | 98 / 100 / 100 / 100, CLS ~0 (WebGL sahnesine rağmen) |

Devralınanlar: GPT'nin doğruladığı yayın snapshot'ı, ders veri modeli (`course.ts`), not tarama mantığı ve testleri, kaynak belgesi. Görsel tasarım, sahne motoru, sayfalar, bilim iletişimi verisi, yeni testler ve dokümantasyon bu sürümde yazıldı.

Ödünleşimler: Ana sayfa artık WebGL kullanıyor (brief'teki "ölçülebilir gerekçe": 2D Canvas bu parçacık sayısını ve ışıma karışımını mobilde akıcı çizemez; üçüncü taraf kütüphane yok, sahne kodu ~26 KB). PDF daha büyük. Sayfalar CSS'i satır içi taşıdığı için HTML biraz büyük, ama ilk boyama daha hızlı.
