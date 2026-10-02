# eokahya.github.io — Emre Onur Kahya

Prof. Dr. Emre Onur Kahya'nın kişisel akademik web sitesi. Astro + TypeScript ile üretilen, tamamen statik bir GitHub Pages **kullanıcı sitesi** (`base` alt yolu yoktur). Sunucu, veritabanı, çerez, analitik veya API anahtarı yoktur.

Site iki dillidir: İngilizce (kök adresler, ör. `/about/`) ve Türkçe (`/tr/` altında Türkçe adresler, ör. `/tr/hakkinda/`). Her sayfanın sağ üstündeki **TR / EN** düğmesi (mobilde menünün içinde) aynı sayfanın öteki diline geçer. MYZ 310E ders sayfaları, ders İngilizce yürütüldüğü için yalnızca İngilizcedir; Türkçe Öğretim sayfası dersi özetleyip onlara bağlanır.

Ana sayfa, kaydırdıkça dönüşen tek bir WebGL parçacık sahnesi üzerine kuruludur: **uzay-zaman dokusu → erken evren küresi → öğrenilmiş temsil kümeleri → katmanlı ağ ve izlenebilir devre → insanlara ulaşan dalgalar**. Sahne şematiktir; simülasyon veya ölçülmüş bir model değildir. Ayrıntılar: [`docs/DESIGN_TR.md`](docs/DESIGN_TR.md).

## Kurulum ve geliştirme

Node 24 LTS (`.nvmrc`) ve npm kullanın; tek lockfile `package-lock.json`'dır.

```sh
npm ci
npx playwright install chromium webkit
npm run dev            # http://127.0.0.1:4321
```

## Kontroller ve üretim derlemesi

```sh
npm run typecheck      # astro check + tsc
npm test               # ders kuralları, not tarama (gerçek izole Astro derlemeleriyle), veri ve sahne testleri
npm run check:secrets  # kimlik bilgisi / .env taraması
npm run build          # astro build → syllabus PDF → iç bağlantı/asset/anchor denetimi → iki dil denetimi
npm run check:pdf      # PDF metni ve değerlendirme tablosu course.ts ile aynı mı?
npm run check:browser  # Chromium + WebKit kabul testleri (dist üzerinde)
npm run check:lighthouse
npm run serve          # dist/ klasörünü http://127.0.0.1:4173 adresinde sunar (gzip ile)
```

`build`, akademik API'lere bağlanmaz; tüm içerik yerel veri dosyalarından gelir. PDF üretimi başarısız olursa eski PDF silinir ve derleme hata verir; eski bir syllabus asla yayımlanmaz.

## İçeriği nereden düzenlerim?

| Ne | Dosya |
| --- | --- |
| Biyografi, zaman çizelgesi, ödüller, projeler, profil bağlantıları (her metnin EN ve TR hâli) | `src/data/profile.ts` |
| Özgeçmiş PDF'leri (EN ve TR; site bunları olduğu gibi yayımlar) | `public/cv/Emre-Onur-Kahya-CV-EN.pdf`, `public/cv/Emre-Onur-Kahya-Ozgecmis-TR.pdf` |
| Davetli konuşmalar ve basında çıkan haberler (özgeçmişten) | `src/data/talks.ts` |
| Dört araştırma yönü (EN ve TR) | `src/data/research.ts` |
| Yayınlar (doğrulanmış snapshot; `selected: true` ana sayfada gösterilir) | `src/data/publications.ts` |
| MYZ 310E: syllabus, kurallar, haftalık plan, rubrikler, duyurular | `src/data/course.ts` |
| Haftalık ders notu PDF'leri | `public/teaching/myz-310e/2026-fall/notes/week-03.pdf` gibi |
| Teke Tek Bilim / YouTube video listesi ve izlenme snapshot'ı | `src/data/outreach.ts` |
| Menü, düğme ve ortak arayüz metinleri (EN ve TR) | `src/i18n/ui.ts` |
| Ana sayfa metinleri (EN ve TR) | `src/i18n/copy/home.ts` |
| İç sayfaların metinleri (EN ve TR) | `src/i18n/copy/pages.ts` |
| Dil adresleri (`/research/` ↔ `/tr/arastirma/` …) | `src/i18n/index.ts` |
| Site başlığı | `src/data/site.ts` |

Sayfaların düzeni `src/views/` altındadır; her görünüm hem İngilizce (`src/pages/…`) hem Türkçe (`src/pages/tr/…`) sayfa tarafından `lang="en"` ya da `lang="tr"` ile kullanılır, yani tasarım değişikliği tek yerde yapılır. Yeni bir İngilizce metin eklendiğinde Türkçesi de eklenmelidir: `npm test` eksik ya da boş Türkçe metni hata olarak bildirir.

**Özgeçmişi güncellemek:** yeni PDF'yi aynı adla `public/cv/` altına koyun ve `src/data/profile.ts` içindeki `cv.updated.en` ya da `cv.updated.tr` tarihini değiştirin. `npm test`, sitede listelenen konuşmaların, ödüllerin, projelerin ve tezlerin özgeçmiş PDF'lerinde gerçekten geçtiğini denetler; sitede bir şey PDF'de yoksa test başarısız olur.

Ders notu yükleme ve dönem bakımı için teknik olmayan, adım adım kılavuz: [`docs/TEACHING_GUIDE_TR.md`](docs/TEACHING_GUIDE_TR.md). Kaynak doğrulamaları: [`docs/SOURCES.md`](docs/SOURCES.md). Üçüncü taraf lisansları: [`docs/THIRD_PARTY_NOTICES.md`](docs/THIRD_PARTY_NOTICES.md).

## Yayın

`.github/workflows/deploy.yml` yalnızca `eokahya/eokahya.github.io` deposunun varsayılan dalında çalışır: kurulum → typecheck → test → gizli bilgi taraması → derleme + PDF + bağlantı denetimi → PDF denetimi → tarayıcı testleri → Pages artifact → deploy. Herhangi bir adım başarısız olursa yayın yapılmaz. Build işi yalnızca `contents: read`, deploy işi yalnızca `pages: write` ve `id-token: write` izni kullanır. GitHub'da *Settings → Pages → Source: GitHub Actions* seçili olmalıdır.

Kod, metin ve PDF'lere kendiliğinden bir açık lisans atanmamıştır.
