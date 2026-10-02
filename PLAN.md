# Plan, kabul ölçütleri ve doğrulanmış durum (Claude sürümü)

Hedef: https://eokahya.github.io/ için GPT sürümünün işlevlerini koruyan, görsel olarak çok daha güçlü, kaydırdıkça gerçekten dönüşen ve **bilim iletişimi** bölümü eklenmiş yeni bir sürüm. Bu klasör (`claude-site/`) GPT'nin dosyalarına dokunmadan, ayrı bir proje olarak kuruldu.

## Plan

1. Canlı siteyi ve `websitesi/` kaynak kodunu incele; doğrulanmış verileri (yayınlar, ders modeli) devral, sunum katmanını sıfırdan yaz.
2. Bilim iletişimi verisini kamuya açık YouTube/Instagram/X sayfalarından topla; tarihli snapshot olarak sakla.
3. Tek bir WebGL parçacık sistemiyle beş aşamalı kaydırma yolculuğu; WebGL/JS yoksa statik SVG levhalar.
4. İç sayfalar: Research, Publications (filtre + yıl grafiği), Teaching, MYZ 310E (dönem sayfası + takma ad + print/PDF), Outreach, About, Contact, 404.
5. Testler, PDF, bağlantı, tarayıcı, erişilebilirlik ve Lighthouse kontrolleri; iki görsel iyileştirme turu.
6. GitHub'a yükleme **yalnızca kullanıcı onayından sonra**.
7. (İkinci istek) Tıklayınca Türkçeye geçen dil seçeneği: tüm sayfaların Türkçe sürümü `/tr/` altında; kullanıcının iki özgeçmişi (EN/TR) sitede indirilebilir, içerikleri (projeler, konuşmalar, basın, ödüller, iletişim) sayfalara işlendi.

## Kabul ölçütleri ve sonuçlar (2 Ekim 2026, yerel, iki dilli sürüm)

| Ölçüt | Sonuç |
| --- | --- |
| Typecheck, üretim derlemesi | PASS — typecheck 0 hata / 0 uyarı / 0 ipucu; 18 sayfa (7 İngilizce + 7 Türkçe + 3 ders sayfası + 404) |
| Birim ve entegrasyon testleri | PASS — 31/31 (önceki 25 + Türkçe metin eksiksizliği, dil adresleri, dil düğmesi, özgeçmiş PDF'leri ile içerik eşleşmesi) |
| İç bağlantı / asset / anchor | PASS — 18 sayfa, 685 referans |
| İki dil denetimi (`check:i18n`) | PASS — 16 sayfada doğru `<html lang>`, karşılıklı hreflang, dil düğmesi doğru karşılığa gider, Türkçe menüde İngilizce etiket yok, iki CV byte byte aynı, site haritasında tüm Türkçe sayfalar |
| Syllabus PDF | PASS — 6 A4 sayfa, kurallar course.ts ile aynı |
| Tarayıcı kabul testleri | PASS — Chromium + WebKit: 332 PASS, 0 FAIL, 1 NOT RUN (axe yalnız Chromium'da) |
| 375 / 768 / 1440 px, iki tema, 17 sayfa (EN + TR) | PASS — yatay taşma yok, tek h1, doğru dil, konsol hatası yok |
| axe-core (WCAG 2.2 AA), iki tema, masaüstü + mobil | PASS — 17 sayfanın hiçbirinde ciddi/kritik ihlal yok |
| Dil düğmesi | PASS — About → Hakkında → About; mobil menüdeki dil bağlantısı; Türkçe ana sayfada sahne duyuruları Türkçe; `/tr/…` altındaki 404 Türkçe |
| Gerçek sahne dönüşümü, pause, reduced-motion, JS kapalı, klavye | PASS — önceki sürümdeki gibi; JS kapalıyken Türkçe ana sayfa da okunur |
| Mobil Lighthouse (gzip'li yerel sunucu) | 10 sayfada (EN + TR) performans 98; erişilebilirlik, en iyi uygulamalar, SEO 100; CLS 0–0,001 |
| Yavaş bağlantıda yazı tipi kayması | 1,6 Mbit/s + 4× CPU yavaşlatmalı mobil yüklemede CLS 0,27 → ~0 (Hakkında); masaüstünde ≤ 0,08 |
| Gizli bilgi taraması | PASS |

## Bilinen sınırlar ve kararlar

- Lighthouse yerel sunucuda ölçüldü; canlı GitHub Pages değerleri ağ koşullarına göre birkaç puan değişebilir.
- WebKit testleri masaüstü otomasyonudur; fiziksel iPhone testi değildir.
- Özgeçmişteki iki olası tutarsızlık (Bilim Kahramanları ödülünün yılı/adı; 11. çalıştayın yılı) `docs/SOURCES.md` içinde not edildi; site CV'yi izler.
- Ders sayfaları yalnızca İngilizcedir (ders İngilizce yürütülür); Türkçe Öğretim sayfası özet verir ve bağlanır.
- İzlenme sayıları 2 Ekim 2026 snapshot'ıdır; "40 civarı" yerine verideki sayı (7 uzun program + 49 Bilim Ekstra = 56) kullanıldı.
- Seçili yayınlar (6) ve yayın konu etiketleri editoryal seçimdir; `publications.ts` içinden değiştirilebilir.
- Provizyonel ders tercihleri (15+15, hafta pencereleri, rubrikler, 4–6 sayfa) sayfada ve PDF'te "provisional" olarak işaretlidir.

## Durum

**LIVE (2 Ekim 2026).** Bu sürüm `eokahya/eokahya.github.io` deposunun `main` dalına normal commit'lerle yüklendi (force push yok, geçmiş korunuyor) ve GitHub Actions'taki tüm kontrollerden geçerek https://eokahya.github.io/ adresinde yayımlandı. Linux üzerindeki CI'da da 31/31 test, PDF tablo denetimi ve 332 tarayıcı kontrolü (0 FAIL) geçti; canlı sitede 17 sayfa (EN + TR), iki CV (byte byte aynı), syllabus PDF, iki dilde 404, dil düğmesi ve WebGL sahnesi ayrıca doğrulandı.

CI'da bulunup düzeltilenler: başsız Chromium'un Linux'ta yazı tiplerini tam piksele oturtması PDF'in metin katmanını bozuyordu ("Midt erm") — PDF artık `--font-render-hinting=none` ile üretiliyor; Chromium için macOS'a özgü bir GPU bayrağı yalnızca macOS'ta kullanılıyor.
