# Arcade

TELKİN v5.5 staging arcade salonu 14 oyundan oluşur.

- Katalog/metadata: `../src/arcade/catalog.js`
- Makine manifesti: `manifest.json`
- TAŞ STRATEJİ: `tas-strateji/index.html` (bağımsız iframe oyunu)
- Diğer 13 oyun: şu an güvenli geçiş için ana runtime içinde; sonraki refaktörde `arcade/<oyun>/` paketlerine ayrılacak.

Temel kural: Arcade hiçbir zaman hikâye kapısı değildir. Kazanmak yalnız bölüm hedef işaretlerini ve yön yardımını açar.
