# Ders ve içerik bakım kılavuzu

Site İngilizcedir. Düzenlemeler, `eokahya/eokahya.github.io` repository'sine yapılan commit sonrasında GitHub Actions ile yeniden hazırlanır. Okuma herkese açıktır; dosya yükleme veya değiştirme için bu repository üzerinde GitHub yazma yetkisi gerekir. Site içinde bir yönetici yükleme formu yoktur.

## Haftalık PDF notu yükleme

1. GitHub'da `https://github.com/eokahya/eokahya.github.io` adresini açın. Repository'nin yayım workflow'unda belirtilen dalını seçin.
2. Şu klasöre gidin: **public → teaching → myz-310e → 2026-fall → notes**.
3. **Add file → Upload files** seçin. Örneğin `week-03.pdf` dosyasını sürükleyip bırakın. Standart dosya adları `week-01.pdf`, `week-02.pdf`, …, `week-14.pdf` biçimindedir.
4. Ek dosya gerekiyorsa farklı bir ad kullanın: `week-03--worked-examples.pdf`. Böylece ana PDF silinmez. Ek dosya adında küçük İngilizce harfler, rakamlar ve tire kullanın.
5. Commit mesajını yazın; örneğin “Add week 3 lecture notes”. Yetkili yayım dalına commit yapın. Dal koruması doğrudan commit'e izin vermiyorsa GitHub'ın önerdiği pull request'i açıp repository kurallarına göre birleştirin.
6. **Actions** sekmesinde bu commit için yayım çalışmasını açın. Test, build ve syllabus PDF üretimi bittikten sonra başarılı deployment'ı kontrol edin. Yeşil çalışma sonucu oluşmadan dosyanın yayımlandığını varsaymayın.
7. Canlı dönem sayfasını açın: `https://eokahya.github.io/teaching/myz-310e/2026-fall/`. **Lecture Notes → Week 3 → Open PDF** ve **Download** bağlantılarını deneyin. Eski görünüm kalırsa sayfayı yenileyin.

HTML veya JSON not listesi düzenlemeniz gerekmez. Build klasörü tarar; yalnızca gerçek PDF'leri listeler. PDF metadata'sında başlık varsa kullanır, yoksa ana dosyanın başlığını haftalık plandan ve ek dosyanın başlığını dosya adından türetir. Dosya boyutu gerçek dosyadan okunur. Yükleme tarihi uydurulmaz.

PDF olmayan, boş, bozuk, şifreli veya yanlış adlandırılmış dosya build'i durdurur; Actions hata mesajında dosya adı görünür. Bu dosyayı düzeltip yeniden commit yapın. `.gitkeep` klasörü boşken korur ve taramaya katılmaz. Klasöre test PDF'si, öğrenci çalışması, not listesi veya özel belge koymayın.

Bir notu kaldırmak için GitHub'da ilgili PDF'yi açıp **Delete file** ile silin ve commit yapın. Sonraki başarılı build'de bağlantısı da kalkar. Dosyayı değiştirmek için aynı ada yeni PDF yükleyin. Sunum ve proje kliniği haftalarında da not eklenebilir.

## Ders içeriği ve syllabus

`src/data/course.ts`, MYZ 310E'nin tek içerik kaynağıdır. GitHub'da dosyayı açıp kalem simgesiyle düzenleyebilirsiniz. Ders HTML'i, özet kutusu, değerlendirme tablosu, yazdırılabilir syllabus ve PDF aynı kaynaktan üretilir. PDF'yi ayrıca elle düzenlemeyin.

- `overview`, `recommendedBackground`, `learningOutcomes`: açıklama ve öğrenme çıktıları.
- `weeks`: haftalık başlıklar ve açıklamalar; not dosyalarının varsayılan başlıkları buradan gelir.
- `project`, `integrity`, `resources`: proje rehberi, araştırma dürüstlüğü ve kaynaklar.
- `announcements`: gerçek duyurular. Liste boşsa sayfa “No announcements yet” gösterir. Duyuru nesnesinde `title` ve `text` yazın; `date` yalnızca gerçek tarih biliniyorsa `YYYY-MM-DD` biçiminde eklenebilir.
- `assessment`: kesin ağırlıklar ve finale giriş kuralı. **Arasınav 30, iki sunum toplamı 30, final makalesi 40; toplam 100. Final makalesine giriş için arasınav en az 12/30 VE iki sunum tamamlanmış olmalıdır.** Bu kararlar ancak öğretim üyesinin açık değişikliğiyle değiştirilmelidir.
- `planning`: düzenlenebilir öneriler. Eşit 15+15 sunum dağılımı, aynı proje üzerindeki iki sunum, 14 haftalık plan, 7. haftada arasınav, 8–9 ve 12–13 sunum pencereleri, ayrıntılı rubrikler ve 4–6 sayfa ana metin biçimi **provisional** olarak gösterilir. Tarih, sınıf, teslim kanalı ve ekip düzeni henüz açıklanmamıştır.
- `sourceVersion` ve `updatedOn`: gerçek içerik güncellemesinden sonra sürümü ve gerçek güncelleme tarihini değiştirin. Dosya timestamp'ini ders veya yayın tarihi gibi kullanmayın.

Sunum puanları veya rubriklerini değiştirirken iki sunumun toplamını 30 ve her rubriğin toplamını ilgili değerlendirme puanıyla aynı tutun. Kesin kural ile öneriyi karıştırmayın. Devam oranı, geç teslim cezası, geçme notu veya ek final sınavı bu plana kendiliğinden eklenmemiştir.

Commit sonrası Actions sonucu ve canlı syllabus PDF'sini birlikte kontrol edin: `https://eokahya.github.io/teaching/myz-310e/2026-fall/myz-310e-syllabus.pdf`.

## Akademik kimlik ve yayınlar

Akademik profil `src/data/profile.ts`, araştırma başlıkları ve açıklamaları `src/data/research.ts`, yayın kayıtları `src/data/publications.ts`, ders içeriği ise `src/data/course.ts` dosyasındadır. Yeni yayın eklerken başlık, yazarlar, yıl ve gerçek DOI/arXiv/yayınevi bağlantısını doğrulayın; kontrol edilen kamuya açık kaynağı ve tarihi `docs/SOURCES.md` içine kaydedin. Benzer isimli yazarları ayırın; DOI/arXiv tekrarlarını tek kayıtta birleştirin. Doğrulanamayan yayını siteye eklemeyin.

Kişisel e-posta yerine öğrenci bilgisi, not, özel repository bağlantısı, token veya `.env` dosyası eklemeyin. Site içeriği ve tüm PDF notları kamuya açık olacaktır.

## Yeni dönem açma ve arşivi koruma

2026 güz dönemi bağlantısı kalıcıdır. Yeni dönemde mevcut `2026-fall` yolunu yeniden adlandırmayın ve bu klasördeki notları yeni dönem notlarıyla değiştirmeyin.

Yeni dönem oluşturulurken ders verisinin bir dönem snapshot'ı ayrı kaydedilir; yeni dönem için ayrı veri, route ve `public/teaching/myz-310e/<yeni-dönem>/notes/` klasörü hazırlanır. Güncel `/teaching/myz-310e/` adresi yeni döneme yönlendirilir. Aynı dönemin güncel sayfası ile kalıcı sayfasının içeriği ayrı kopyalar olarak düzenlenmez. Yeni dönemin PDF yolu ve workflow taraması da kontrol edilir. Bu ilk sürümde dönem ekleme kod değişikliği gerektirir; haftalık PDF yükleme için terminal veya kod değişikliği gerekmez.

Kurulum, yerel build ve test komutları için `README.md` dosyasına bakın.
