# TELKİN — Seslendirme dosya standardı

Gerçek seslendirme dosyaları hazır olduğunda motor bunları bölüm/cue bazında lazy-load eder.

Örnek:

`audio/voice/tr/mahir/chapter-001/cue-01.ogg`

`audio/voice/en/nisan/chapter-011/cue-04.ogg`

## Kural
- Dil: `tr`, `en` vb.
- Karakter klasörü: küçük harf, Türkçe işaretsiz (`kayitci`, `muhafiz`).
- Bölüm: üç haneli (`chapter-001`).
- Replik: iki haneli (`cue-01`).
- Tercih edilen biçim: OGG. MP3 yedek olabilir.
- Dosya yoksa oyun kırılmaz; seslendirme sessizce atlanır.
- Gerçek seslendirme eklenmeden yapay/uydurma karakter sesi paketlenmez.
