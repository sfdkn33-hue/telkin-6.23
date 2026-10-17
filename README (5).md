# LOCATION PACK SPEC v1

Her gerçek mekân paketi en az şu yapıyı taşır:

- `scene.json`: gerçek ölçek, zonlar, anchor noktaları, bütçe ve asset slotları
- `models/`: optimize `.glb`
- `textures/`: `.webp` PBR/atlas dokuları
- `props/`: tekrar kullanılabilen düşük poligon objeler
- `audio/`: mekân ambience/room tone
- `preview.webp`: geliştirme/menü önizlemesi

Mobil hedef: tek aktif hero set için model+texture bütçesi ideal olarak 12–22 MB; aynı anda yalnız aktif paket bellekte tutulur. Ana görev koridoru asset değişiminde de korunmalıdır.
