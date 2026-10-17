# TELKİN v5.4 · Mekân paketleri

Mekân sistemi artık iki katmanlıdır:

1. **Çalışan procedural-pro set**: mevcut WebGL renderer gerçek dünya ölçeği, işlevsel zonlar, yaşanmışlık ayrıntıları ve sahneye özgü ışıkla ortamı kurar.
2. **Lazy asset slotu**: her paket `scene.json` üzerinden ileride eklenecek GLB/PBR model, doku ve ambience dosyalarını tanımlar. Büyük varlıklar başlangıçta yüklenmez.

`src/data/location-packs.js` 108 mekânın tamamının manifestidir. Hero paketler: office, lab, home, hospital, university, archive, cafe, bakery-street, school-night, station, management.

> Dürüstlük notu: v5.4 henüz tam glTF/GLB renderer değildir. Gerçek model dosyaları yoksa oyun mevcut procedural-pro seti kullanır. Uydurma model adıyla sahte 3D varlık gösterilmez.
