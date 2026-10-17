# TELKİN Yönlü Karakter Paketi Standardı — v5.3

Her ana karakter için hedef minimum 12 kare:

- front-idle.webp
- front-walk1.webp
- front-walk2.webp
- back-idle.webp
- back-walk1.webp
- back-walk2.webp
- left-idle.webp
- left-walk1.webp
- left-walk2.webp
- right-idle.webp
- right-walk1.webp
- right-walk2.webp

Sonraki oyunculuk paketi `poses/` altında: `talk.webp`, `listen.webp`, `fear.webp`, `shock.webp`, `grief.webp`, `sit.webp`.

## Görsel süreklilik kuralları
- Aynı yüz, saç, yaş, beden oranı ve kıyafet tüm yönlerde korunur.
- Arka görünüş gerçekten arkadan üretilir; ön görünüş çevrilip sahte arka yapılmaz.
- Sol/sağ yalnız ayna olmak zorunda değildir; kıyafet ve saç asimetrileri korunur.
- Ayak tabanı hizası bütün karelerde aynı olmalıdır.
- Arka plan gerçek alfa/transparan olmalıdır; koyu halo bırakılmamalıdır.
- Telefon için kare başına makul WebP bütçesi hedeflenir.

Motor, eksik kare varsa güvenli fallback uygular: aynı yön idle → front aynı state → front idle → legacy sprite. Böylece üretim adım adım yapılabilir ve oyun kırılmaz.
