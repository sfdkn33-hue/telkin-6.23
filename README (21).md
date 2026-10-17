{
  "schema": "telkin-location-pack/1",
  "pack": "hospital",
  "version": "5.4.0",
  "runtime": "procedural-pro",
  "gltfRuntime": "reserved",
  "displayName": "Hastane / Klinik Oda",
  "scale": "1 unit ≈ 1 meter",
  "dimensions": [
    14,
    3,
    14
  ],
  "zones": [
    "patient-bed",
    "monitor",
    "doctor-desk",
    "curtain-service"
  ],
  "anchors": {
    "spawn": [
      0,
      5.2
    ],
    "bed": [
      -2.6,
      2.25
    ],
    "monitor": [
      0.05,
      0.55
    ],
    "doctorDesk": [
      4.2,
      -3.7
    ]
  },
  "assetSlots": [
    "models/hospital-room.glb",
    "textures/clinic.webp",
    "audio/hospital-roomtone.ogg"
  ],
  "productionNote": "Tıbbi cihazlar atmosfer unsurudur; kullanıcı etkileşimleri yalnız hikâyenin gerektirdiği nesnelere bağlanır."
}