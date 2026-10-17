# TELKİN Ses Sistemi — v5.6

Ses sistemi artık `src/audio/presets.js` + `src/audio/manager.js` tarafından yönetilir.

## Katmanlar
- `ambience/` — gerçek ortam loop dosyaları için.
- `sfx/` — kapı, zar, kayıt glitch, UI, adım gibi dosya tabanlı efektler için.
- `music/` — bölüm/motif müzikleri için.
- `voice/tr/` — Türkçe karakter seslendirmeleri.
- `voice/en/` — İngilizce karakter seslendirmeleri.

## Şu anda çalışan gerçek zamanlı katman
Harici ses dosyası olmadan çalışan WebAudio fallback sistemi vardır:
- mekâna göre çapraz geçişli yağmur / rüzgâr / şehir / su / ateş / oda havası / hum / mağara / Doku katmanları,
- yüzeye göre ayak sesleri,
- kapı aç/kapat/kilit,
- zar yuvarlama,
- kamera glitch / anomali / Nihyel,
- UI ve arcade başarı/başarısızlık cue’ları.

Bunlar geçici "beep" yerine katmanlı prosedürel seslerdir. Gerçek kayıtlar geldiğinde `audio/manifest.json` ve aynı API üzerinden lazy-load edilebilir.

## Seslendirme
`VOICE_NAMING.md` standardını kullanır. Gerçek ses dosyası yoksa motor hata vermez ve sessiz devam eder.
