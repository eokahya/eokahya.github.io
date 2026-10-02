# Tasarım ve sahne notları

## Fikir: "uzay-zamandan öğrenilmiş temsillere — ve insanlara"

Ana sayfa beş "levha" (plate) olarak kurgulanmış bir yolculuktur. Aynı ~24.000 parçacık (mobilde ~11.000) her levhada başka bir şekle girer; geçişler gerçek bir dönüşümdür, iki resim arasında geçiş efekti değildir.

| Levha | Bölüm | Şekil | İmza denklemi |
| --- | --- | --- | --- |
| I | Hero | İkili bir kaynağın büktüğü ve iki kollu dalgalarla dalgalandırdığı noktalı uzay-zaman dokusu | (yok) |
| II | Alanlar ve erken evren | Doku eşit alanlı bir dönüşümle küreye sarılır; "sıcaklık" lekeleri | ds² = −dt² + a²(t)dx² |
| III | Fiziksel veriden öğrenmek | Kürenin boylam dilimleri eğri bir manifold üzerinde beş kümeye yoğunlaşır | θ* = arg min Σ ℓ(f(x), y) |
| IV | Modelin içi | Kümeler katmanlı bir ağın kenarlarına dönüşür; aktivasyonlar kenarlarda akar; bir devre izlenebilir ve bir birim "ablate" edilebilir | do(h ← h̃) ⟹ Δy |
| V | Bilim iletişimi | Bir kaynaktan yayılan dalga cepheleri, geçtikleri "dinleyici" noktalarını aydınlatır | □ψ = 0 |

Her geçişin kendi uzamsal sırası vardır (doku kuyudan dışa doğru, kümeler sırayla, ağ katman katman soldan sağa, dalgalar merkezden dışa); bu yüzden yarım kalmış bir geçiş bile yapı gösterir. Görseller şematiktir; herhangi bir model analizi veya fizik simülasyonu iddiası yoktur ve sayfada bu açıkça yazılıdır.

## Dosyalar

- `src/scripts/journey/targets.ts` — beş şeklin geometrisi (deterministik; her ziyaret aynı sahne).
- `src/scripts/journey/shaders.ts` — GLSL ES 1.00 (WebGL 1 ve 2). Zamanla değişen kısımlar (dalgalanma, yörünge, aktivasyon akışı, dalga cepheleri) burada.
- `src/scripts/journey/engine.ts` — üç çizim çağrısı (arka ışıma, ağ çizgileri, parçacıklar) ve her levhanın kamera ayarı (`desktopCameras`).
- `src/scripts/journey/index.ts` — kaydırma konumunu okur (kaydırmayı asla ele geçirmez), duraklatma, reduced-motion, görünürlük ve uyarlamalı kalite.
- `src/lib/plates.ts` — aynı geometrinin statik SVG versiyonları: araştırma sayfasındaki görseller ve WebGL/JavaScript yoksa ana sayfadaki yedek görüntüler.

## Erişilebilirlik ve hareket

- `prefers-reduced-motion`: otonom hareket yok; o an görünen bölümün statik levhası gösterilir ve yalnızca bölüm değişince (kısa bir solmayla) değişir.
- "Pause animation" düğmesi tercihi tarayıcıda hatırlar.
- Sekme görünmezken veya sahne ekran dışındayken çizim durur. İlk saniyelerde kare süresi yavaşsa parçacık sayısı ve çözünürlük düşürülür.
- Canvas `aria-hidden`; anlam taşıyan her şey normal HTML'dedir. JavaScript kapalıyken tüm içerik ve statik levhalar görünür.
- Ders, yayın ve iletişim sayfalarında hareketli sahne yoktur.

## Görsel dil

- Koyu tema ("gece levhası") varsayılandır; açık tema ("kâğıt levha") parçacıkları mürekkep renklerinde, normal karışımla çizer.
- Yazı tipleri: Fraunces (başlıklar, optik boyutlu değişken), IBM Plex Sans (metin), IBM Plex Mono (etiketler). Türkçe ve İngilizce için alt kümelenmiş dört dosya, toplam ~205 KB. İki Fraunces dosyası önceden yüklenir (her başlıkta hem düz hem italik kesim var). Syllabus PDF'i `--font-render-hinting=none` ile üretilir: başsız Chromium, Linux'ta (yayımlanan PDF orada üretilir) varsayılan olarak tam ipucu (hinting) uygular ve harfleri tam piksellere yerleştirir; bu hem harf aralıklarını düzensizleştiriyor hem de PDF'in metin katmanında "Midt erm examinat ion" gibi bölünmelere yol açıyordu.
- **Yazı tipi gelirken kayma yok:** web fontu gelene kadar başlıklar Georgia (macOS/iOS/Windows) ya da Noto Serif (Android), metin Arial ya da Roboto ile, Fraunces ve IBM Plex genişliğine ölçeklenmiş olarak dizilir (`size-adjust`; değerler `scripts/fallback-metrics.py` ile sitenin kendi başlık ve paragraflarından hesaplanır). Fraunces büyük punto için daralan optik boyutlara sahip olduğundan h1 için ekran genişliğine göre üç ayar (S < 840 px, M 840–1199 px, L ≥ 1200 px) vardır. Başlık genişlik sınırları `ch` yerine `em` ile verilir; `ch`, yedek fontun dar "0" rakamıyla değişip satır kırılımını bozuyordu. Sonuç: yavaş mobil bağlantıda ölçülen CLS 0,27'den ~0'a indi.
- **İki dil:** her sayfa düzeni `src/views/` altında bir kez yazılır ve `lang` ile iki dilde üretilir. Türkçe büyük harf dönüşümü (`text-transform: uppercase`) `lang="tr"` altında doğru "İ" üretir; İngilizce özel adlar (ör. basın kuruluşları) `lang="en"` ile işaretlenir, böylece "PHYSİCS" gibi hatalar oluşmaz.
- Renkler `src/styles/tokens.css` içinde; her iki tema için WCAG AA kontrastı axe-core ile denetlenir.
