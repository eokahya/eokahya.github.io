# Emre Onur Kahya — akademik web sitesi

Astro + TypeScript, statik GitHub Pages kullanıcı sitesi. Hedef yalnızca **eokahya/eokahya.github.io**, adres **https://eokahya.github.io/**. `base` alt yolu yok. Kullanıcının brief ve syllabus taslağı korunmuştur; kod/metin/PDF için otomatik açık lisans atanmadı.

## Kurulum ve çalışma

Node24 LTS (`.nvmrc`) ve npm kullanın. Tek lockfile: `package-lock.json`.

```sh
npm ci
npx playwright install chromium webkit
npm run dev
```

## Gerçek kontroller ve build

```sh
npm run typecheck
npm test
npm run check:secrets
npm run build
npm run check:pdf
```

`build`: statik HTML üretir → geçici yerel HTTP sunucusunda print syllabus'tan Chromium ile PDF üretir → PDF dahil tüm iç bağlantı/asset/anchor yollarını kontrol eder. Akademik API çağrısı yapmaz. PDF hatasında eski çıktıyı sunmaz; build başarısız olur. PDF yalnızca `dist/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf` altında oluşur; `public` içinde elle çoğaltılmaz.

`npm test`, geçici bir proje içinde dört gerçek Astro build ile PDF not ekleme/silme ve bozuk dosyada build durdurma yaşam döngüsünü de sınar. Test PDF’leri yayımlanan klasöre girmez.

Tarayıcı kabul kontrolleri için iki terminalde:

```sh
node scripts/static-server.mjs
npm run check:browser
npm run check:lighthouse
```

375/768/1440 Chromium ve WebKit, açık/koyu axe, JS kapalı içerik, klavye/menü, pause/reduced-motion, gerçek sahne geçişi ve ders kuralları denetlenir. Sonuçlar `artifacts/` altında (gitignore). WebKit masaüstü otomasyonudur; fiziksel iPhone testi değildir.

## Düzenlenecek dosyalar

- `src/data/profile.ts`: biyografi/profil bağlantıları.
- `src/data/research.ts`: dört araştırma yönü.
- `src/data/publications.ts`: doğrulanmış yerel yayın snapshot'ı.
- `src/data/course.ts`: syllabus, sabit kurallar, provisional plan ve duyuruların tek kaynağı.
- `public/teaching/myz-310e/2026-fall/notes/`: gerçek `week-03.pdf` veya `week-03--worked-examples.pdf` dosyaları; HTML/JSON elle düzenlenmez.

Kaynak doğrulamaları: `docs/SOURCES.md`. Teknik kaynaklar: `docs/TECHNICAL_SOURCES.md`. Öğretim üyesi için GitHub arayüzünde not yükleme ve dönem bakımı: `docs/TEACHING_GUIDE_TR.md`. Gerçek durum: `PLAN.md`, `docs/QA.md`, `docs/VERIFICATION_TR.md`.

## Yayım güvenliği

`.github/workflows/deploy.yml` yalnızca **eokahya/eokahya.github.io** repository'sinin gerçek varsayılan branch'inde çalışır. Testler, typecheck, tarayıcı/PDF/link kontrolü ve PDF üretimi geçmeden dist artifact'i yüklenmez. Build yetkisi contents:read; deploy yalnızca pages:write/id-token:write. GitHub Settings → Pages → Source: GitHub Actions seçilmelidir. Hosting ücretsiz statik Pages; CMS, backend, token, analytics veya öğrenci bilgisi yok.

GitHub kimliği doğrulanmadan public repository oluşturulmaz, commit/push yapılmaz. Mevcut repository önce incelenir; private→public değişimi, force push ve geçmiş silme yapılmaz.
