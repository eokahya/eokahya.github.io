# Ders sayfası bakım kılavuzu (MYZ 310E)

Bu kılavuz terminal gerektirmez; her şey GitHub web arayüzünden yapılabilir. Siteyi herkes okuyabilir, ama dosya ekleme/değiştirme yalnızca `eokahya/eokahya.github.io` deposuna yazma yetkisi olan GitHub hesabıyla mümkündür.

## 1. Haftalık ders notu PDF'i yüklemek (ör. `week-03.pdf`)

1. https://github.com/eokahya/eokahya.github.io adresine gidin ve giriş yapın.
2. Şu klasörü açın: `public/teaching/myz-310e/2026-fall/notes/`
3. Sağ üstte **Add file → Upload files**'a tıklayın.
4. PDF'i sürükleyin. Dosya adı tam olarak şu biçimde olmalı:
   - Ana not: `week-01.pdf`, `week-02.pdf`, … `week-14.pdf` (hafta numarası **iki haneli**)
   - Ek not: `week-03--worked-examples.pdf` (iki tire, sonra küçük harf ve tirelerle bir açıklama)
5. Alttaki **Commit changes** kutusuna kısa bir not yazın (ör. "Week 3 notes") ve **Commit changes**'e basın.
6. **Actions** sekmesinde "Verify and deploy GitHub Pages" iş akışının yeşil tikle bitmesini bekleyin (genellikle birkaç dakika).
7. Ders sayfasını açın: https://eokahya.github.io/teaching/myz-310e/2026-fall/#lecture-notes — ilgili haftada **Open PDF** ve **Download** bağlantıları görünür. Sayfa eski görünüyorsa tarayıcıyı yenileyin.

Notlar:
- HTML veya JSON düzenlemeniz gerekmez; liste derleme sırasında klasördeki gerçek dosyalardan otomatik üretilir.
- Başlık: PDF'in kendi "Title" metadata'sı varsa o kullanılır; yoksa ek notlarda dosya adındaki açıklama ("Worked Examples"), ana notlarda haftalık plandaki başlık gösterilir.
- PDF olmayan, boş, bozuk veya şifreli bir dosya ya da hatalı bir ad (ör. `week-3.pdf`, `Week03.pdf`) derlemeyi **durdurur** ve yayın yapılmaz; Actions günlüğünde hangi dosyanın sorunlu olduğu yazar. Dosyayı silin veya adını düzeltin.
- Bir notu kaldırmak için dosyayı açıp çöp kutusu simgesiyle silin ve commit edin; bağlantı listeden kalkar.
- Sunum ve klinik haftalarına (7–14) da not eklenebilir.

## 2. Syllabus, değerlendirme ve takvim

Tek kaynak `src/data/course.ts` dosyasıdır. Ders sayfası, "Assessment at a glance" kutusu, değerlendirme tablosu, 14 haftalık şerit ve PDF syllabus **aynı veriden** üretilir; elle tutulan ikinci bir kopya yoktur.

- Dosyayı GitHub'da açıp kalem (Edit) simgesine basın, değişikliği yapın, commit edin.
- `sourceVersion` (ör. `2026-fall-v2`) ve `updatedOn` (ör. `2026-10-15`) alanlarını her anlamlı değişiklikte güncelleyin; PDF'in altbilgisinde ve sayfada görünür.
- Değişmez kurallar `assessment` altında: arasınav 30, iki sunum toplam 30, final makalesi 40; finale giriş şartı arasınavda en az %40 (30 üzerinden 12) **ve** iki sunumun tamamlanması. Testler bu kuralları denetler; yanlışlıkla değişirse derleme durur.
- Provizyonel tercihler `planning` altında: 15+15 bölünmesi, hafta pencereleri, rubrikler, 4–6 sayfa makale biçimi. `...Provisional: true` bayrakları sayfada "provisional" ibaresini gösterir.
- Saat, derslik ve ofis saatleri belli olduğunda `timetable` metnini güncelleyin. Takvim tarihleri hiçbir yerde uydurulmamıştır.

## 3. Duyuru eklemek

`src/data/course.ts` içindeki `announcements: []` dizisine bir kayıt ekleyin:

```ts
announcements: [
  { title: 'Midterm date', text: 'The midterm will be held on … in room …', date: '2026-11-05' },
],
```

Liste boşken sayfada "No announcements yet" yazar.

## 4. Yayın eklemek

`src/data/publications.ts` içindeki diziye mevcut kayıtlara benzer bir nesne ekleyin (başlık, yazarlar, yıl, `link`, `type`, varsa `journal`/`volume`/`articleNumber` veya `pages`, `doi`, `arxiv`, `topics`, `sourceUrls`, `verifiedOn`). `selected: true` olan kayıtlar ana sayfadaki "Selected work" bölümünde gösterilir. Testler tekrar eden DOI/arXiv kimliklerini ve eksik alanları yakalar.

## 5. Bilim iletişimi listesi

`src/data/outreach.ts` dosyası Teke Tek Bilim programlarının ve kendi kanalınızdaki videoların tarihli bir snapshot'ıdır (izlenme sayıları 2 Ekim 2026 tarihlidir). Yeni bir Bilim Ekstra bölümü için `bilimEkstra` dizisine aynı biçimde bir satır ekleyin (`id` = YouTube video kimliği). İzlenme sayılarını güncellerseniz `outreachSnapshot.checkedOn` tarihini de değiştirin.

## 6. Yeni dönem (ör. Spring 2027) ve arşivleme

1. `src/pages/teaching/myz-310e/2026-fall/` klasörünü yeni dönem adıyla (ör. `2027-spring/`) kopyalayın.
2. `public/teaching/myz-310e/2026-fall/notes/` yerine yeni dönem için `public/teaching/myz-310e/2027-spring/notes/` klasörünü oluşturun (içine boş bir `.gitkeep`).
3. `src/data/course.ts`'de yeni dönemin `term`, `termPath`, `notesPath`, `syllabusPath`, `printPath`, `sourceVersion` değerlerini güncelleyin; eski dönemin kalıcı sayfası ve PDF notları yerinde kalır, bağlantıları bozulmaz.
4. Eski dönem sayfasının kendi veri kopyasıyla dondurulması isteniyorsa `course.ts`'nin o dönemki halini ayrı bir dosyaya (ör. `course-2026-fall.ts`) kaydedip eski sayfanın onu kullanmasını sağlayın.

Bu adım bir kez yapılır; isterseniz Claude/Codex'ten "yeni dönemi aç" diye isteyebilirsiniz.
