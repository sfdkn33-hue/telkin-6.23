<!doctype html>
<html lang="tr" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TAŞ STRATEJİ</title>
<style>
:root{
  --bg:#111318;
  --panel:#1b1f27;
  --panel2:#242a35;
  --text:#f7f8fb;
  --muted:#aeb6c5;
  --you:#4eb7ff;
  --ai:#ff6b73;
  --gold:#ffd166;
  --line:#3a4352;
  --green:#63d69c;
  --choice:#ffe08a;
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
body{display:flex;justify-content:center}
.app{width:min(100%,620px);min-height:100vh;padding:max(14px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));background:linear-gradient(180deg,#171a20,#0e1014)}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
h1{font-size:24px;margin:0;letter-spacing:.5px}
button{font:inherit}
.smallBtn{
  border:1px solid #ffffff18;background:#ffffff0c;color:#fff;padding:9px 12px;border-radius:12px;font-weight:800
}
.scoreboard{
  display:grid;grid-template-columns:1fr auto 1fr;gap:9px;align-items:center;margin:10px 0 12px
}
.score{
  border:1px solid #ffffff12;background:var(--panel);border-radius:16px;padding:10px;text-align:center
}
.score .label{font-size:12px;color:var(--muted);font-weight:800}
.score .num{font-size:29px;font-weight:950;line-height:1.05;margin-top:3px}
.you .num{color:var(--you)} .ai .num{color:var(--ai)}
.turn{
  min-width:84px;text-align:center;font-size:12px;font-weight:950;padding:8px;border-radius:999px;
  background:#ffffff0d;border:1px solid #ffffff13
}
.status{
  min-height:56px;display:grid;place-items:center;text-align:center;color:#dfe5f1;
  background:#151920;border:1px solid #ffffff10;border-radius:14px;padding:8px 10px;margin-bottom:12px;
  font-size:14px;font-weight:750
}
.boardWrap{
  position:relative;background:#0b0d11;border:1px solid #ffffff12;border-radius:23px;padding:11px 11px 14px;
  box-shadow:0 18px 50px #0007
}
.ownerLabel{
  display:flex;justify-content:center;align-items:center;height:24px;font-size:12px;font-weight:900;letter-spacing:.6px
}
.ownerLabel.aiL{color:var(--ai)} .ownerLabel.youL{color:var(--you)}
.board{
  display:grid;grid-template-columns:repeat(4,1fr);gap:8px;position:relative;direction:ltr;
}
.rowGap{
  grid-column:1/-1;height:4px;border-radius:99px;background:linear-gradient(90deg,var(--ai),#ffffff22,var(--you));margin:1px 0 3px;
}
.cell{
  position:relative;aspect-ratio:1/1;border:none;border-radius:18px;background:var(--panel2);
  box-shadow:inset 0 0 0 1px #ffffff0d;
  color:white;padding:5px;overflow:hidden;transition:.16s transform,.16s box-shadow,.16s background;
}
.cell.aiCell{box-shadow:inset 0 0 0 1px #ff6b7330}
.cell.mine{box-shadow:inset 0 0 0 1px #4eb7ff30}
.cell.clickable{cursor:pointer}
.cell.clickable:active{transform:scale(.97)}
.cell.selected{box-shadow:inset 0 0 0 3px var(--gold),0 0 20px #ffd16635}
.cell.choice{
  box-shadow:inset 0 0 0 3px var(--choice), 0 0 18px #ffe08a55;
  background:#4e4230;
  animation:pulse 1s infinite;
  cursor:pointer;
  pointer-events:auto;
  z-index:6;
}
@keyframes pulse{50%{transform:translateY(-1px)}}
.cell.last{box-shadow:inset 0 0 0 3px var(--green),0 0 18px #63d69c3d}
.cell.capture{animation:cap .4s ease}
@keyframes cap{50%{transform:scale(1.06);background:#6c5824}}
.count{
  position:absolute;left:50%;top:6px;transform:translateX(-50%);
  font-size:12px;font-weight:1000;color:#fff;z-index:4;
  background:linear-gradient(180deg,#1a2130ee,#0d1119ee);
  border:1px solid #ffffff16;border-radius:999px;
  min-width:28px;height:22px;display:grid;place-items:center;padding:0 9px;
  box-shadow:0 6px 14px #0006
}
.stones{
  position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);
  width:44px;height:36px;pointer-events:none
}
.stone{
  position:absolute;
  width:16px;height:16px;border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#f5f7fb 0%,#d8dee8 38%,#aeb8c6 70%,#7c8797 100%);
  border:1px solid #ffffff22;
  box-shadow:
    inset 0 1px 2px #ffffffa8,
    inset -2px -2px 4px #00000012,
    0 3px 8px #0007;
  opacity:.98;
}
.stone::after{
  content:'';
  position:absolute;left:3px;top:2px;width:5px;height:5px;border-radius:50%;
  background:#ffffffd8;filter:blur(.2px);opacity:.95;
}
.more{
  position:absolute;right:-2px;bottom:-1px;
  font-size:10px;font-weight:1000;color:#eef3ff;
  background:linear-gradient(180deg,#1b2333e8,#0f1320e8);
  border-radius:999px;padding:2px 6px;border:1px solid #ffffff14;
  box-shadow:0 2px 8px #0004
}
/* Taş stilleri */
.theme-minimal .stone{
  background:radial-gradient(circle at 35% 30%,#f5f7fb 0%,#d8dee8 38%,#aeb8c6 70%,#7c8797 100%);
  border:1px solid #ffffff22;
  box-shadow:inset 0 1px 2px #ffffffa8, inset -2px -2px 4px #00000012, 0 3px 8px #0007;
}
.theme-minimal .stone::after{background:#ffffffd8}
.theme-minimal .more{
  background:linear-gradient(180deg,#1b2333e8,#0f1320e8); color:#eef3ff;
}

.theme-dark .stone{
  background:radial-gradient(circle at 35% 30%,#6b7381 0%,#3b4350 38%,#232933 72%,#11151c 100%);
  border:1px solid #a9b4c522;
  box-shadow:inset 0 1px 2px #ffffff22, inset -2px -2px 4px #0005, 0 3px 8px #0009;
}
.theme-dark .stone::after{background:#dce4f080}
.theme-dark .more{
  background:linear-gradient(180deg,#151b24ef,#090d13ef); color:#dde6f7;
}

.theme-glass .stone{
  background:radial-gradient(circle at 30% 26%,#ffffffea 0%,#d9f1ffb5 30%,#9ed4f199 60%,#5aa0c077 100%);
  border:1px solid #dff4ff77;
  box-shadow:inset 0 1px 5px #ffffffa0, inset -2px -2px 4px #5fa9c033, 0 3px 10px #8fd0ff33;
  backdrop-filter:blur(1px);
}
.theme-glass .stone::after{background:#ffffffef}
.theme-glass .more{
  background:linear-gradient(180deg,#d8f5ffcc,#7cb8d9bb); color:#143247; border:1px solid #effbff99;
}

.theme-color .stones.aiStones .stone{
  background:radial-gradient(circle at 35% 30%,#ffd7dc 0%,#ff8a96 38%,#e35766 70%,#8f2435 100%);
  border:1px solid #ffd9de33;
  box-shadow:inset 0 1px 2px #fff6, inset -2px -2px 4px #00000012, 0 3px 8px #0007;
}
.theme-color .stones.aiStones .stone::after{background:#fff4f5d8}
.theme-color .stones.humanStones .stone{
  background:radial-gradient(circle at 35% 30%,#d9efff 0%,#7fc8ff 38%,#3d8fe3 70%,#224c92 100%);
  border:1px solid #dceeff33;
  box-shadow:inset 0 1px 2px #fff6, inset -2px -2px 4px #00000012, 0 3px 8px #0007;
}
.theme-color .stones.humanStones .stone::after{background:#f3fbffd8}
.theme-color .more{
  background:linear-gradient(180deg,#1d2638e8,#111827e8); color:#eef3ff;
}

/* Genel uygulama temaları */
body.theme-neon{
  --bg:#111318;
  --panel:#1b1f27;
  --panel2:#242a35;
  --text:#f7f8fb;
  --muted:#aeb6c5;
  --you:#4eb7ff;
  --ai:#ff6b73;
  --gold:#ffd166;
  --green:#63d69c;
  --choice:#ffe08a;
}
body.theme-neon .app{background:linear-gradient(180deg,#171a20,#0e1014)}
body.theme-neon .boardWrap{background:#0b0d11}
body.theme-neon .status, body.theme-neon .score, body.theme-neon .menuCard, body.theme-neon .infoCard{box-shadow:0 18px 40px #0004}

body.theme-wood{
  --bg:#2a1f17;
  --panel:#3a2a20;
  --panel2:#5a4434;
  --text:#fff7ec;
  --muted:#d0bcab;
  --you:#69b7ff;
  --ai:#ff8d78;
  --gold:#f3c970;
  --green:#80d7a4;
  --choice:#ffdfa1;
}
body.theme-wood .app{
  background:linear-gradient(180deg,#3a2c22,#241912);
}
body.theme-wood .boardWrap{
  background:linear-gradient(180deg,#2d2118,#1d140e);
  border-color:#ffffff14;
  box-shadow:0 18px 50px #130b07aa;
}
body.theme-wood .status,
body.theme-wood .score,
body.theme-wood .menuCard,
body.theme-wood .infoCard{
  background:#36271d;
  border-color:#ffffff12;
}
body.theme-wood .cell{
  background:linear-gradient(180deg,#604631,#4d3828);
  box-shadow:inset 0 0 0 1px #ffffff10;
}
body.theme-wood .rowGap{background:linear-gradient(90deg,var(--ai),#ffffff22,var(--you))}
body.theme-wood .smallBtn,
body.theme-wood .diffBtn,
body.theme-wood .menuMain{
  background:#4b3729;
}

body.theme-frost{
  --bg:#0f1821;
  --panel:#162432;
  --panel2:#203546;
  --text:#eef7ff;
  --muted:#afc3d3;
  --you:#5fd4ff;
  --ai:#ff8db1;
  --gold:#d7f0ff;
  --green:#8df0cb;
  --choice:#dcf6ff;
}
body.theme-frost .app{
  background:linear-gradient(180deg,#122030,#0c141d);
}
body.theme-frost .boardWrap{
  background:linear-gradient(180deg,#0d1723,#09121b);
  border-color:#d9f3ff1c;
  box-shadow:0 18px 50px #051019aa;
}
body.theme-frost .status,
body.theme-frost .score,
body.theme-frost .menuCard,
body.theme-frost .infoCard{
  background:#142433;
  border-color:#dcf5ff1b;
}
body.theme-frost .cell{
  background:linear-gradient(180deg,#24384b,#1b2d3d);
}
body.theme-frost .smallBtn,
body.theme-frost .diffBtn,
body.theme-frost .menuMain{
  background:#203244;
}
body.theme-frost .brandMark{
  background:linear-gradient(135deg,#73dbff,#89b8ff);
  color:#123047;
}

body.theme-light{
  --bg:#eef2f7;
  --panel:#ffffff;
  --panel2:#e8edf5;
  --text:#17212d;
  --muted:#607286;
  --you:#2b8fff;
  --ai:#ef6471;
  --gold:#c99a2e;
  --green:#27b679;
  --choice:#f2d57d;
}
body.theme-light{
  color:var(--text);
}
body.theme-light .app{
  background:linear-gradient(180deg,#f5f8fc,#e9eef5);
}
body.theme-light .status,
body.theme-light .score,
body.theme-light .menuCard,
body.theme-light .infoCard{
  background:#ffffff;
  border-color:#d6e0ea;
  color:#1b2430;
  box-shadow:0 16px 35px #a8b7c71f;
}
body.theme-light .boardWrap{
  background:#f8fbff;
  border-color:#d6e0ea;
  box-shadow:0 18px 40px #a8b7c71f;
}
body.theme-light .cell{
  background:linear-gradient(180deg,#f3f7fc,#e3eaf4);
  color:#1b2430;
  box-shadow:inset 0 0 0 1px #cfd9e5;
}
body.theme-light .count{
  background:linear-gradient(180deg,#ffffffee,#e8eef7ee);
  border-color:#cad6e5;
  color:#17212d;
}
body.theme-light .smallBtn,
body.theme-light .diffBtn,
body.theme-light .menuMain{
  background:#ffffff;
  border-color:#d6e0ea;
  color:#1d2732;
}
body.theme-light .turn{
  background:#ffffff;
  border-color:#d6e0ea;
}
body.theme-light .note,
body.theme-light .status .label,
body.theme-light .menuCard .sub,
body.theme-light .infoCard .sub{
  color:#5d6f83;
}
body.theme-light .brandMark{
  background:linear-gradient(135deg,#4eb7ff,#8a9bff);
}





@media (max-width:430px){
  .stones{width:40px;height:32px;top:59%}
  .stone{width:14px;height:14px}
  .stone::after{width:4px;height:4px;left:2px;top:2px}
  .count{font-size:11px;min-width:24px;height:20px}
}

.topActions{display:flex;gap:7px}
.menuOverlay,.infoOverlay{
  position:fixed;inset:0;z-index:40;background:#05070be8;display:none;place-items:center;
  padding:20px;backdrop-filter:blur(8px)
}
.menuOverlay.show,.infoOverlay.show{display:grid}
.menuCard,.infoCard{
  width:min(94vw,430px);background:#1b1f27;border:1px solid #ffffff18;border-radius:28px;
  padding:24px;box-shadow:0 30px 90px #000b
}
.brandMark{
  width:78px;height:78px;margin:0 auto 12px;border-radius:24px;display:grid;place-items:center;
  background:linear-gradient(135deg,#4eb7ff,#7b6cff);font-weight:1000;font-size:32px;
  box-shadow:0 14px 35px #4e8cff33
}
.menuCard h2,.infoCard h2{text-align:center;margin:0 0 8px;font-size:30px}
.menuCard .sub,.infoCard .sub{text-align:center;color:var(--muted);line-height:1.45;margin:0 0 18px}
.compactMenu{padding:18px 18px 16px}
.compactBrand{width:60px;height:60px;font-size:26px;border-radius:18px;margin-bottom:8px}
.compactSub{margin-bottom:12px;font-size:13px;line-height:1.35}
.compactConfig{
  display:grid;
  gap:8px;
  margin-bottom:10px;
}
.cfgRow{
  display:grid;
  grid-template-columns:88px 1fr;
  gap:8px;
  align-items:center;
}
.cfgLabel{
  color:var(--muted);
  font-size:12px;
  font-weight:900;
}
.cfgSelect{
  width:100%;
  border:1px solid #ffffff18;
  border-radius:12px;
  background:var(--panel);
  color:var(--text);
  padding:10px 12px;
  font-size:13px;
  font-weight:900;
}
.compactSummary{
  text-align:center;
  margin:8px 0 4px;
  font-size:12px;
  font-weight:1000;
  color:var(--gold);
}
.compactMeta{
  display:flex;
  justify-content:center;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:10px;
}
.compactMeta span{
  font-size:11px;
  font-weight:900;
  color:#b8d7ff;
  background:#ffffff08;
  border:1px solid #ffffff12;
  border-radius:999px;
  padding:4px 8px;
}
.compactButtons{gap:8px}
.startGrid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.compactStart{
  padding:12px 12px;
  border-radius:14px;
}
.compactStart strong{font-size:15px}
.compactStart span{font-size:11px}
.compactMini{
  padding:11px 10px;
  text-align:center;
}
.compactMini strong{font-size:14px}
@media (max-width:430px){
  .menuCard.compactMenu{
    width:min(96vw,420px);
    padding:14px 14px 12px;
    border-radius:22px;
  }
  .compactBrand{width:54px;height:54px;font-size:24px;margin-bottom:6px}
  .menuCard.compactMenu h2{font-size:24px;margin-bottom:4px}
  .compactSub{font-size:12px;margin-bottom:10px}
  .cfgRow{grid-template-columns:78px 1fr;gap:6px}
  .cfgLabel{font-size:11px}
  .cfgSelect{padding:9px 10px;font-size:12px}
  .compactSummary{font-size:11px;margin-top:6px}
  .compactMeta{gap:6px;margin-bottom:8px}
  .compactMeta span{font-size:10px;padding:3px 7px}
  .startGrid{gap:6px}
  .compactStart{padding:10px 8px}
  .compactStart strong{font-size:14px}
  .compactStart span{font-size:10px}
  .compactMini{padding:9px 8px}
  .compactMini strong{font-size:13px}
}


.variantBlock{
  margin:0 0 14px;
  padding:10px;
  border:1px solid #ffffff12;
  background:#11151c;
  border-radius:18px;
}
.variantLabel{
  text-align:center;
  color:var(--muted);
  font-size:11px;
  font-weight:950;
  letter-spacing:.8px;
  margin-bottom:8px;
}
.variantSelect{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.variantSelect.boardSelect{
  grid-template-columns:repeat(3,1fr);
}
@media (max-width:430px){
  .variantSelect.boardSelect{
    grid-template-columns:1fr;
  }
}
.variantBtn{
  border:1px solid #ffffff16;
  border-radius:14px;
  background:#252b36;
  color:#fff;
  padding:11px 8px;
  font-weight:950;
  line-height:1.1;
}
.variantBtn span{
  display:block;
  margin-top:4px;
  color:var(--muted);
  font-size:10px;
  font-weight:750;
}
.variantBtn.active{
  background:#403821;
  box-shadow:inset 0 0 0 2px var(--gold);
  color:#fff1b7;
}
.variantBtn.active span{color:#eadba5}

.menuButtons{display:grid;gap:9px}
.menuMain{
  width:100%;border:1px solid #ffffff16;border-radius:16px;padding:14px 16px;color:#fff;
  background:#252b36;font-weight:950;font-size:16px;text-align:left
}
.menuMain strong{display:block;font-size:17px}
.menuMain span{display:block;color:var(--muted);font-size:12px;font-weight:700;margin-top:3px}
.menuMain.primaryMenu{background:linear-gradient(135deg,#347fc5,#695be0)}
.menuMain.compactContinue{
  text-align:center;background:linear-gradient(135deg,#1f8a63,#2c6f9f)
}
.resultMenuBtn{
  width:100%;border:1px solid #ffffff18;border-radius:15px;padding:12px;
  background:#252b36;color:var(--text);font-size:15px;font-weight:900;margin-top:8px
}
body.theme-light .resultMenuBtn{
  background:#fff;border-color:#d6e0ea;color:#1d2732
}
body.theme-light .stone{
  border-color:#7d8fa555;
  box-shadow:inset 0 1px 2px #fff, inset -2px -2px 4px #0001, 0 3px 8px #50607038;
}
body.theme-light .cell.choice{
  background:#fff3c4;
  color:#1b2430;
  box-shadow:inset 0 0 0 3px #a87900,0 0 18px #b58b2244;
}
html[dir="rtl"] .topbar,
html[dir="rtl"] .scoreboard{direction:ltr}
html[dir="rtl"] .topbar button,
html[dir="rtl"] .score .label,
html[dir="rtl"] .turn{unicode-bidi:plaintext}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
    scroll-behavior:auto !important;
  }
}

.menuRow{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.menuRow.singleActionRow{grid-template-columns:1fr}

.rulesInsideSettings{margin-top:14px}
.infoCard{
  max-height:88vh;
  overflow:auto;
}

.backBtn{
  width:100%;margin-top:14px;border:1px solid #ffffff16;border-radius:14px;padding:12px;
  background:#ffffff0b;color:#fff;font-weight:900
}
.ruleList{margin:14px 0 0;padding-left:20px;color:#d9deea;line-height:1.55;font-size:14px}
.ruleList li{margin-bottom:7px}
.settingRow{
  display:flex;justify-content:space-between;align-items:center;gap:14px;padding:13px 0;
  border-bottom:1px solid #ffffff0e
}
.settingRow:last-of-type{border-bottom:0}
.toggleBtn{
  border:1px solid #ffffff1a;background:#303743;color:#fff;border-radius:999px;padding:9px 14px;font-weight:950
}
.toggleBtn.on{background:#285c46;color:#caffdf}
.modeBadge{
  display:none;text-align:center;margin:-3px 0 10px;color:var(--muted);font-size:12px;font-weight:850
}
.modeBadge.show{display:block}

.difficulty{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:12px;
}
.diffBtn{
  border:1px solid #ffffff16;
  background:var(--panel);
  color:#fff;
  border-radius:14px;
  padding:11px 6px;
  font-size:13px;
  font-weight:950;
}
.diffBtn.active{
  box-shadow:inset 0 0 0 2px var(--gold);
  background:#3a3325;
  color:#fff3c4;
}

.overlay{
  position:fixed;inset:0;background:#05070bcb;display:none;place-items:center;padding:20px;z-index:20;backdrop-filter:blur(6px)
}
.overlay.show{display:grid}
.modal{
  width:min(92vw,400px);background:#1b1f27;border:1px solid #ffffff16;border-radius:24px;padding:24px;text-align:center;
  box-shadow:0 30px 90px #000
}
.modal h2{font-size:31px;margin:0 0 8px}
.modal p{color:var(--muted);line-height:1.5}
.primary{
  width:100%;border:0;border-radius:15px;padding:14px;background:linear-gradient(135deg,#4eb7ff,#7b6cff);color:white;
  font-size:17px;font-weight:950;margin-top:8px
}
.note{font-size:11px;color:#7f899c;margin-top:8px;text-align:center}
.hand{
  position:absolute;
  width:54px;height:54px;border-radius:50%;
  display:none;align-items:center;justify-content:center;
  font-size:30px;background:#ffffff0f;border:1px solid #ffffff33;backdrop-filter:blur(6px);
  transform:translate(-50%,-50%);
  z-index:10;pointer-events:none;transition:left .23s ease, top .23s ease, transform .23s ease;
  box-shadow:0 10px 30px #0008;
}
.hand.show{display:flex}
.handCount{
  position:absolute;right:-2px;bottom:-2px;min-width:24px;height:24px;padding:0 6px;border-radius:999px;
  display:grid;place-items:center;background:#ffd166;color:#231800;font-size:12px;font-weight:1000;border:1px solid #0004
}
</style>
</head>
<body>
<div class="app">
  <div class="topbar">
    <h1 id="gameTitle">24 TAŞ</h1>
    <div class="topActions">
      <button class="smallBtn" id="newGame">Yeni Oyun</button>
      <button class="smallBtn" id="menuBtn">Menü</button>
    </div>
  </div>

  <div class="scoreboard">
    <div class="score ai">
      <div class="label" id="topScoreLabel">BİLGİSAYAR</div>
      <div class="num" id="aiScore">0</div>
    </div>
    <div class="turn" id="turn">SENİN SIRAN</div>
    <div class="score you">
      <div class="label" id="bottomScoreLabel">SEN</div>
      <div class="num" id="youScore">0</div>
    </div>
  </div>

  <div class="modeBadge" id="modeBadge"></div>

  <div class="status" id="status" role="status" aria-live="polite" aria-atomic="true">Alt iki sıradan bir hane seç. Yol ayrımında oyun senden seçim isteyecek.</div>

  <div class="boardWrap" id="boardWrap">
    <div class="ownerLabel aiL" id="topOwnerLabel">BİLGİSAYARIN 8 HANESİ</div>
    <div class="board" id="board" role="group" aria-label="TAŞ STRATEJİ board"></div>
    <div class="ownerLabel youL" id="bottomOwnerLabel">SENİN 8 HANEN</div>
    <div class="hand" id="hand">🖐️<span class="handCount" id="handCount">0</span></div>
  </div>


  <div class="difficulty" id="difficultyPanel">
    <button class="diffBtn" data-level="easy">KOLAY</button>
    <button class="diffBtn active" data-level="medium">ORTA</button>
    <button class="diffBtn" data-level="hard">ZOR</button>
  </div>
</div>



<div class="menuOverlay show" id="menuOverlay">
  <div class="menuCard compactMenu">
    <div class="brandMark compactBrand" id="brandMark">24</div>
    <h2 id="menuGameTitle">24 TAŞ</h2>
    <p class="sub compactSub" id="menuSubtitle">Rotanı seç, zinciri sürdür, 24 taşı rakibinden önce topla.</p>

    <div class="compactConfig">
      <div class="cfgRow">
        <label class="cfgLabel" id="boardLabel" for="boardSelectCompact">Tahta</label>
        <select class="cfgSelect" id="boardSelectCompact">
          <option value="4">4 × 4</option>
          <option value="5">5 × 4</option>
          <option value="6">6 × 4</option>
        </select>
      </div>

      <div class="cfgRow">
        <label class="cfgLabel" id="stonesLabel" for="stonesSelectCompact">Taş / Hane</label>
        <select class="cfgSelect" id="stonesSelectCompact">
          <option value="3">3 taş</option>
          <option value="4">4 taş</option>
          <option value="5">5 taş</option>
          <option value="6">6 taş</option>
        </select>
      </div>

      <div class="cfgRow">
        <label class="cfgLabel" id="stoneStyleLabel" for="styleSelectCompact">Taş Stili</label>
        <select class="cfgSelect" id="styleSelectCompact">
          <option value="minimal">Modern</option>
          <option value="dark">Koyu</option>
          <option value="glass">Cam / Buz</option>
          <option value="color">Renkli</option>
        </select>
      </div>

      <div class="cfgRow">
        <label class="cfgLabel" id="themeLabel" for="themeSelectCompact">Tema</label>
        <select class="cfgSelect" id="themeSelectCompact">
          <option value="neon">Neon Gece</option>
          <option value="wood">Ahşap / Sıcak</option>
          <option value="frost">Buz / Soğuk</option>
          <option value="light">Minimal Açık</option>
        </select>
      </div>

      <div class="cfgRow">
        <label class="cfgLabel" id="startLabel" for="startSelectCompact">Başlangıç</label>
        <select class="cfgSelect" id="startSelectCompact">
          <option value="random">Rastgele</option>
          <option value="first">İlk ben / O1</option>
          <option value="second">İkinci ben / O2</option>
        </select>
      </div>

      <div class="cfgRow">
        <label class="cfgLabel" id="languageLabel" for="languageSelectCompact">Dil</label>
        <select class="cfgSelect" id="languageSelectCompact">
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="pt">Português (Brasil)</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </div>

    <div class="compactSummary" id="selectedMode">SEÇİLİ MOD: 24 TAŞ — KLASİK</div>
    <div class="compactMeta">
      <span id="selectedStyle">STİL: MODERN</span>
      <span id="selectedTheme">TEMA: NEON GECE</span>
    </div>

    <div class="menuButtons compactButtons">
      <button class="menuMain compactContinue" id="continueBtn" style="display:none">
        <strong id="continueTitle">▶️ Devam Et</strong>
        <span id="continueDesc">Mevcut oyuna dön</span>
      </button>
      <div class="startGrid">
        <button class="menuMain primaryMenu compactStart" id="singleBtn">
          <strong id="singleTitle">🤖 Tek Oyuncu</strong>
          <span id="singleDesc">Bilgisayara karşı başla</span>
        </button>
        <button class="menuMain compactStart" id="localBtn">
          <strong id="localTitle">👥 İki Oyuncu</strong>
          <span id="localDesc">Aynı cihazda oyna</span>
        </button>
      </div>
      <div class="menuRow compactRow singleActionRow">
        <button class="menuMain compactMini" id="settingsBtn"><strong id="settingsTitle">⚙️ Ayarlar</strong></button>
      </div>
    </div>
  </div>
</div>

<div class="infoOverlay" id="infoOverlay" role="dialog" aria-modal="true" aria-labelledby="infoTitle">

  <div class="infoCard">
    <h2 id="infoTitle">Nasıl Oynanır?</h2>
    <div id="infoBody"></div>
    <button class="backBtn" id="infoBack">Geri</button>
  </div>
</div>

<div class="overlay" id="overlay" role="dialog" aria-modal="true" aria-labelledby="resultTitle">
  <div class="modal">
    <h2 id="resultTitle">Kazandın!</h2>
    <p id="resultText"></p>
    <button class="primary" id="again">Tekrar Oyna</button>
    <button class="resultMenuBtn" id="resultMenu">Menüye Dön</button>
  </div>
</div>

<script>
const boardEl = document.getElementById('board');
const boardWrap = document.getElementById('boardWrap');
const statusEl = document.getElementById('status');
const youScoreEl = document.getElementById('youScore');
const aiScoreEl = document.getElementById('aiScore');
const turnEl = document.getElementById('turn');
const overlay = document.getElementById('overlay');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const handEl = document.getElementById('hand');
const handCountEl = document.getElementById('handCount');
const menuOverlay = document.getElementById('menuOverlay');
const infoOverlay = document.getElementById('infoOverlay');
const infoTitle = document.getElementById('infoTitle');
const infoBody = document.getElementById('infoBody');
const continueBtn = document.getElementById('continueBtn');
const resultMenuBtn = document.getElementById('resultMenu');
const difficultyPanel = document.getElementById('difficultyPanel');
const modeBadge = document.getElementById('modeBadge');
const topScoreLabel = document.getElementById('topScoreLabel');
const bottomScoreLabel = document.getElementById('bottomScoreLabel');
const topOwnerLabel = document.getElementById('topOwnerLabel');
const bottomOwnerLabel = document.getElementById('bottomOwnerLabel');
const gameTitle = document.getElementById('gameTitle');
const brandMark = document.getElementById('brandMark');
const menuGameTitle = document.getElementById('menuGameTitle');
const menuSubtitle = document.getElementById('menuSubtitle');
const selectedMode = document.getElementById('selectedMode');
const selectedStyle = document.getElementById('selectedStyle');
const selectedTheme = document.getElementById('selectedTheme');
const boardSelectCompact = document.getElementById('boardSelectCompact');
const stonesSelectCompact = document.getElementById('stonesSelectCompact');
const styleSelectCompact = document.getElementById('styleSelectCompact');
const themeSelectCompact = document.getElementById('themeSelectCompact');
const startSelectCompact = document.getElementById('startSelectCompact');
const languageSelectCompact = document.getElementById('languageSelectCompact');
const boardLabel = document.getElementById('boardLabel');
const stonesLabel = document.getElementById('stonesLabel');
const stoneStyleLabel = document.getElementById('stoneStyleLabel');
const themeLabel = document.getElementById('themeLabel');
const startLabel = document.getElementById('startLabel');
const languageLabel = document.getElementById('languageLabel');
const continueTitle = document.getElementById('continueTitle');
const continueDesc = document.getElementById('continueDesc');
const singleTitle = document.getElementById('singleTitle');
const singleDesc = document.getElementById('singleDesc');
const localTitle = document.getElementById('localTitle');
const localDesc = document.getElementById('localDesc');
const settingsTitle = document.getElementById('settingsTitle');

const BOARD_ROWS = 4;
let boardCols = 4;
let stonesPerHouse = 3;
let targetScore = 24;
let cells = [];
let score = {human:0, ai:0};
let current = 'human';
let locked = false;
let selectedSource = -1;
let choiceCells = [];
let lastIndex = -1;
let captureCol = -1;
let pendingChoice = null;
let waitingMode = '';
let aiThinking = false;
let difficulty = 'medium';
let stoneStyle = 'minimal';
let appTheme = 'neon';
let startPreference = 'random';
let gameMode = 'single'; // single | local
let gameStarted = false;
let gameOver = false;
let pausedBoardConfig = null;
let gameGeneration = 0;

const SETTINGS_STORAGE_KEY = 'tas-strateji-settings-v1';

function savePreferences(){
  try{
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
      boardCols, stonesPerHouse, difficulty, stoneStyle,
      appTheme, startPreference, soundEnabled
    }));
  }catch(e){}
}

function loadPreferences(){
  try{
    const raw=localStorage.getItem(SETTINGS_STORAGE_KEY);
    if(!raw) return;
    const p=JSON.parse(raw);
    if([4,5,6].includes(Number(p.boardCols))) boardCols=Number(p.boardCols);
    if([3,4,5,6].includes(Number(p.stonesPerHouse))) stonesPerHouse=Number(p.stonesPerHouse);
    if(['easy','medium','hard'].includes(p.difficulty)) difficulty=p.difficulty;
    if(['minimal','dark','glass','color'].includes(p.stoneStyle)) stoneStyle=p.stoneStyle;
    if(['neon','wood','frost','light'].includes(p.appTheme)) appTheme=p.appTheme;
    if(['random','first','second'].includes(p.startPreference)) startPreference=p.startPreference;
    if(typeof p.soundEnabled==='boolean') soundEnabled=p.soundEnabled;
  }catch(e){}
}

let soundEnabled = true;
let audioCtx = null;

const I18N = {
  tr: {
    board:'Tahta', boardAria:'Tahta, {cols} sütun ve {rows} satır', pitAria:'{owner}, hane {index}, {count} taş', stonesPit:'Taş / Hane', stoneStyle:'Taş Stili', theme:'Tema', start:'Başlangıç', language:'Dil',
    stonesN:'{n} taş', styleMinimal:'Modern', styleDark:'Koyu', styleGlass:'Cam / Buz', styleColor:'Renkli',
    themeNeon:'Neon Gece', themeWood:'Ahşap / Sıcak', themeFrost:'Buz / Soğuk', themeLight:'Minimal Açık',
    startRandom:'Rastgele', startFirstSingle:'İlk ben', startSecondSingle:'İkinci ben', startFirstLocal:'Oyuncu 1', startSecondLocal:'Oyuncu 2',
    continue:'▶️ Devam Et', continueDesc:'Mevcut oyuna dön', single:'🤖 Tek Oyuncu', singleDesc:'Bilgisayara karşı başla',
    local:'👥 İki Oyuncu', localDesc:'Aynı cihazda oyna', settings:'⚙️ Ayarlar', newGame:'Yeni Oyun', menu:'Menü',
    back:'Geri', again:'Tekrar Oyna', resultMenu:'Menüye Dön',
    easy:'Kolay', medium:'Orta', hard:'Zor', easyUpper:'KOLAY', mediumUpper:'ORTA', hardUpper:'ZOR',
    you:'Sen', computer:'Bilgisayar', player1:'Oyuncu 1', player2:'Oyuncu 2', yourTurn:'SENİN SIRAN',
    ownerComputer:'BİLGİSAYARIN {n} HANESİ', ownerYou:'SENİN {n} HANEN', ownerP1:'OYUNCU 1 — {n} HANE', ownerP2:'OYUNCU 2 — {n} HANE',
    singleMode:'TEK OYUNCU', localMode:'İKİ OYUNCU', stylePrefix:'STİL', themePrefix:'TEMA', selectedMode:'SEÇİLİ MOD',
    stoneUnit:'TAŞ', stonePerPit:'TAŞ/HANE',
    classic:'KLASİK', master:'USTA', wide:'GENİŞ TAHTA', grandMaster:'BÜYÜK USTA', longLine:'UZUN HAT',
    bigBoard:'BÜYÜK TAHTA', advanced:'İLERİ SEVİYE', marathon:'MARATON',
    descClassic:'Klasik mod: hızlı ve dengeli.', descCompact:'Kompakt tahtada daha uzun dağıtım zincirleri.',
    descWide:'Geniş tahtada daha uzun yatay rotalar ve daha çok yol hesabı.',
    descBig:'6×4 büyük tahtada uzun rotalar, çoklu yol ayrımları ve derin strateji.',
    collectBefore:'{n} taşı rakibinden önce topla.',
    firstRoute:'Taşları aldın. Parlayan komşu haneden ilk yolu seç.',
    branch:'Yol ayrımı! Rakibin tarafında olsa bile parlayan haneden devam edebilirsin.',
    captureYou:'Sütundaki diğer hanelerden {n} taş topladın; son taş masada kaldı.',
    captureOther:'{name} sütundaki diğer hanelerden {n} taş topladı; son taş masada kaldı.',
    fullYou:'Son taşı dolu haneye bıraktın; aynı yerden dağıtım sürüyor.',
    fullOther:'{name} son taşı dolu haneye bıraktı; aynı yerden dağıtım sürüyor.',
    rollback:'Geçerli devam yolu bulunamadı; hamle güvenli biçimde geri alındı.',
    humanTarget:'{target} taşı ilk sen topladın. Skor {h} - {a}.',
    otherTarget:'{name} {target} taşı ilk topladı. Skor {h} - {a}.',
    oneEach:"Her iki oyuncunun da kendi bölgesinde yalnızca 1'er taş kaldı. Oyun berabere bitti. Skor {h} - {a}.",
    cycleDraw:'Aynı hamle durumu üç kez tekrarlandı. Oyun beraberlikle sonuçlandı.',
    safeDraw:'Geçerli bir sonraki hamle üretilemedi. Oyun bütünlüğünü korumak için karşılaşma berabere sonlandırıldı.',
    humanEmptyYou:'Kendi {n} hanende taş bırakmadığın için oyunu kaybettin.',
    humanEmptyOther:'{name} kendi {n} hanesinde taş bırakmadığı için oyunu kaybetti.',
    scoreLine:'Skor: {human} {h} - {ai} {a}.', draw:'Berabere!', won:'Kazandın! 🎉', computerWon:'Bilgisayar kazandı.', playerWon:'{name} kazandı! 🎉',
    chooseOwnLocal:'{name}: kendi {n} hanenden birini seç.', chooseOwn:'Alt iki sıradaki kendi hanelerinden birini seç.',
    aiBranch:'Bilgisayar yol ayrımında karar veriyor...', aiThink:'Bilgisayar düşünüyor...', aiCalc:'Bilgisayar hesaplıyor...', aiDeep:'Bilgisayar derin hesap yapıyor...',
    aiRoute:'Bilgisayar geçerli bir rota seçiyor...', aiCapturePlan:'Bilgisayar taş toplamak için bir plan kurdu...', aiDefense:'Bilgisayar savunmalı bir hamle seçti...', aiRecalc:'Bilgisayar hamleyi yeniden hesaplıyor...',
    diffEasy:'Kolay seviye seçildi. Bilgisayar hata yapabilir.', diffMedium:'Orta seviye seçildi. Dengeli rakip.', diffHard:'Zor seviye seçildi. Bilgisayar ciddi oynayacak.',
    chooseStart:'Başlangıç tercihini seç ve oyunu başlat.', randomAI:'Rastgele seçim: Bilgisayar başlıyor...', aiStarts:'Bilgisayar başlıyor...',
    randomLocal:'Rastgele seçim: {name} başlıyor. Kendi {n} hanenden birini seç.', localStarts:'{name} başlıyor. Kendi {n} hanenden birini seç.',
    randomYou:'Rastgele seçim: Sen başlıyorsun. Alt iki sıradan bir hane seç.', youStart:'Sen başlıyorsun. Alt iki sıradan bir hane seç.',
    moveMenu:'Hamle sürüyor. Taşların dağıtımı tamamlanınca menüye dönebilirsin.', moveNew:'Hamle sürüyor. Önce mevcut dağıtımı tamamla.',
    startFirstName:'İLK BEN BAŞLARIM', startSecondName:'İKİNCİ BAŞLARIM', p1StartsName:'OYUNCU 1 BAŞLAR', p2StartsName:'OYUNCU 2 BAŞLAR', randomName:'RASTGELE',
    settingsTitle:'Ayarlar', sounds:'Oyun sesleri', soundsDesc:'Taş bırakma ve toplama sesleri', on:'AÇIK', off:'KAPALI',
    themeDesc:'Arka plan ve tahta görünümü', stoneStyleDesc:'Menüden değiştirilebilir', gameType:'Oyun türü',
    gameTypeDesc:'{cols}×{rows} tahta · hane başına {stones} taş', defaultAI:'Varsayılan yapay zekâ',
    defaultAIDesc:'Tek oyuncu modunda oyun içinden değiştirilebilir', startPref:'Başlangıç tercihi', startPrefDesc:'Yeni oyunda kim ilk hamleyi yapacak',
    showRules:'📖 Kuralları Göster', hideRules:'📖 Kuralları Gizle', rulesIntro:'Oyunu ilk kez oynuyorsan kısa kurallar burada.',
    rule1:'Hamleye yalnız kendi tarafındaki dolu bir haneden başlarsın.',
    rule2:'Seçtiğin hanedeki bütün taşları alıp komşu hanelere birer birer dağıtırsın.',
    rule3:'Satır değişimi yalnız sağ ve sol kenarlardan yapılır; yol ayrımında devam yönünü seçersin.',
    rule4:'Dağıtım sırasında rakibin tarafı dahil bütün tahta kullanılabilir.',
    rule5:'Son taş dolu haneye gelirse o hanedeki bütün taşları alıp dağıtmaya devam edersin.',
    rule6:'Son taş boş haneye gelirse o taş orada kalır; aynı sütundaki diğer taşları toplarsın ve sıra rakibe geçer.',
    rule7:'{target} taşı ilk toplayan kazanır.', rule8:"Her iki oyuncunun da kendi tarafında toplam yalnızca 1'er taş kalırsa oyun berabere biter.",
    rule9:'Aynı hamle durumu üç kez birebir tekrarlanırsa oyun berabere biter.', rule10:'Kendi tarafındaki bütün hanelerde taşı biten oyuncu kaybeder.'
  },
  en: {
    board:'Board', boardAria:'Board, {cols} columns and {rows} rows', pitAria:'{owner}, pit {index}, {count} stones', stonesPit:'Stones / Pit', stoneStyle:'Stone Style', theme:'Theme', start:'Starting Order', language:'Language',
    stonesN:'{n} stones', styleMinimal:'Modern', styleDark:'Dark', styleGlass:'Glass / Ice', styleColor:'Player Colors',
    themeNeon:'Neon Night', themeWood:'Wood / Warm', themeFrost:'Frost / Cold', themeLight:'Minimal Light',
    startRandom:'Random', startFirstSingle:'I Start First', startSecondSingle:'I Start Second', startFirstLocal:'Player 1', startSecondLocal:'Player 2',
    continue:'▶️ Continue', continueDesc:'Return to current game', single:'🤖 Single Player', singleDesc:'Play against the computer',
    local:'👥 Two Players', localDesc:'Play on the same device', settings:'⚙️ Settings', newGame:'New Game', menu:'Menu',
    back:'Back', again:'Play Again', resultMenu:'Back to Menu',
    easy:'Easy', medium:'Medium', hard:'Hard', easyUpper:'EASY', mediumUpper:'MEDIUM', hardUpper:'HARD',
    you:'You', computer:'Computer', player1:'Player 1', player2:'Player 2', yourTurn:'YOUR TURN',
    ownerComputer:"COMPUTER'S {n} PITS", ownerYou:'YOUR {n} PITS', ownerP1:'PLAYER 1 — {n} PITS', ownerP2:'PLAYER 2 — {n} PITS',
    singleMode:'SINGLE PLAYER', localMode:'TWO PLAYERS', stylePrefix:'STYLE', themePrefix:'THEME', selectedMode:'SELECTED MODE',
    stoneUnit:'STONES', stonePerPit:'STONES/PIT',
    classic:'CLASSIC', master:'MASTER', wide:'WIDE BOARD', grandMaster:'GRAND MASTER', longLine:'LONG LINE',
    bigBoard:'LARGE BOARD', advanced:'ADVANCED', marathon:'MARATHON',
    descClassic:'Classic mode: fast and balanced.', descCompact:'Longer relay chains on a compact board.',
    descWide:'A wider board with longer horizontal routes and more path planning.',
    descBig:'Long routes, multiple junctions and deeper strategy on the 6×4 board.',
    collectBefore:'Collect {n} stones before your opponent.',
    firstRoute:'You picked up the stones. Choose the first glowing neighboring pit.',
    branch:"Junction! Continue through any glowing pit, even on your opponent's side.",
    captureYou:'You collected {n} stones from the other pits in the column; the last stone stays on the board.',
    captureOther:'{name} collected {n} stones from the other pits in the column; the last stone stays on the board.',
    fullYou:'Your last stone landed in an occupied pit; continue distributing from that pit.',
    fullOther:"{name}'s last stone landed in an occupied pit; distribution continues from there.",
    rollback:'No valid continuation was found; the move was safely rolled back.',
    humanTarget:'You collected {target} stones first. Score {h} - {a}.',
    otherTarget:'{name} collected {target} stones first. Score {h} - {a}.',
    oneEach:'Each player has only 1 stone left in their own area. The game is a draw. Score {h} - {a}.',
    cycleDraw:'The same move state occurred three times. The game ends in a draw.',
    safeDraw:'No valid next move could be produced. The match ends in a draw to preserve game integrity.',
    humanEmptyYou:'You have no stones left in your own {n} pits, so you lose.',
    humanEmptyOther:'{name} has no stones left in their own {n} pits and loses.',
    scoreLine:'Score: {human} {h} - {ai} {a}.', draw:'Draw!', won:'You Won! 🎉', computerWon:'Computer Won.', playerWon:'{name} Won! 🎉',
    chooseOwnLocal:'{name}: choose one of your {n} non-empty pits.', chooseOwn:'Choose a non-empty pit from your bottom two rows.',
    aiBranch:'Computer is choosing a route...', aiThink:'Computer is thinking...', aiCalc:'Computer is calculating...', aiDeep:'Computer is calculating deeply...',
    aiRoute:'Computer is choosing a legal route...', aiCapturePlan:'Computer is planning a capture...', aiDefense:'Computer chose a defensive move...', aiRecalc:'Computer is recalculating...',
    diffEasy:'Easy selected. The computer may make mistakes.', diffMedium:'Medium selected. A balanced opponent.', diffHard:'Hard selected. The computer will play seriously.',
    chooseStart:'Choose the starting order and start the game.', randomAI:'Random choice: Computer starts...', aiStarts:'Computer starts...',
    randomLocal:'Random choice: {name} starts. Choose one of your {n} pits.', localStarts:'{name} starts. Choose one of your {n} pits.',
    randomYou:'Random choice: You start. Choose a pit from the bottom two rows.', youStart:'You start. Choose a pit from the bottom two rows.',
    moveMenu:'A move is in progress. You can return to the menu after distribution finishes.', moveNew:'A move is in progress. Finish the current distribution first.',
    startFirstName:'I START FIRST', startSecondName:'I START SECOND', p1StartsName:'PLAYER 1 STARTS', p2StartsName:'PLAYER 2 STARTS', randomName:'RANDOM',
    settingsTitle:'Settings', sounds:'Game Sounds', soundsDesc:'Stone placement and capture sounds', on:'ON', off:'OFF',
    themeDesc:'Background and board appearance', stoneStyleDesc:'Can be changed from the menu', gameType:'Game Type',
    gameTypeDesc:'{cols}×{rows} board · {stones} stones per pit', defaultAI:'Default AI',
    defaultAIDesc:'Can be changed during single-player games', startPref:'Starting Order', startPrefDesc:'Who makes the first move in a new game',
    showRules:'📖 Show Rules', hideRules:'📖 Hide Rules', rulesIntro:'New to the game? Here are the short rules.',
    rule1:'Start a move only from a non-empty pit on your own side.',
    rule2:'Pick up every stone in that pit and distribute them one by one into neighboring pits.',
    rule3:'You may change rows only at the left or right edge; choose your direction at junctions.',
    rule4:"During distribution, the entire board can be used, including your opponent's side.",
    rule5:'If the last stone lands in an occupied pit, pick up all stones there and continue distributing.',
    rule6:'If the last stone lands in an empty pit, it stays there; collect all other stones in the same column and pass the turn.',
    rule7:'The first player to collect {target} stones wins.', rule8:'If both players have exactly 1 stone left in their own area, the game is a draw.',
    rule9:'If the exact same move state occurs three times, the game is a draw.', rule10:'A player who has no stones left in their own pits loses.'
  },
  de: {
    board:'Brett', boardAria:'Brett, {cols} Spalten und {rows} Reihen', pitAria:'{owner}, Mulde {index}, {count} Steine', stonesPit:'Steine / Mulde', stoneStyle:'Steinstil', theme:'Thema', start:'Startreihenfolge', language:'Sprache',
    stonesN:'{n} Steine', styleMinimal:'Modern', styleDark:'Dunkel', styleGlass:'Glas / Eis', styleColor:'Spielerfarben',
    themeNeon:'Neon-Nacht', themeWood:'Holz / Warm', themeFrost:'Eis / Kalt', themeLight:'Minimal Hell',
    startRandom:'Zufällig', startFirstSingle:'Ich beginne', startSecondSingle:'Ich beginne als Zweiter', startFirstLocal:'Spieler 1', startSecondLocal:'Spieler 2',
    continue:'▶️ Fortsetzen', continueDesc:'Zum laufenden Spiel zurückkehren', single:'🤖 Einzelspieler', singleDesc:'Gegen den Computer spielen',
    local:'👥 Zwei Spieler', localDesc:'Auf demselben Gerät spielen', settings:'⚙️ Einstellungen', newGame:'Neues Spiel', menu:'Menü',
    back:'Zurück', again:'Nochmal spielen', resultMenu:'Zum Menü',
    easy:'Leicht', medium:'Mittel', hard:'Schwer', easyUpper:'LEICHT', mediumUpper:'MITTEL', hardUpper:'SCHWER',
    you:'Du', computer:'Computer', player1:'Spieler 1', player2:'Spieler 2', yourTurn:'DU BIST DRAN',
    ownerComputer:'{n} MULDEN DES COMPUTERS', ownerYou:'DEINE {n} MULDEN', ownerP1:'SPIELER 1 — {n} MULDEN', ownerP2:'SPIELER 2 — {n} MULDEN',
    singleMode:'EINZELSPIELER', localMode:'ZWEI SPIELER', stylePrefix:'STIL', themePrefix:'THEMA', selectedMode:'GEWÄHLTER MODUS',
    stoneUnit:'STEINE', stonePerPit:'STEINE/MULDE',
    classic:'KLASSISCH', master:'MEISTER', wide:'BREITES BRETT', grandMaster:'GROSSMEISTER', longLine:'LANGE LINIE',
    bigBoard:'GROSSES BRETT', advanced:'FORTGESCHRITTEN', marathon:'MARATHON',
    descClassic:'Klassischer Modus: schnell und ausgewogen.', descCompact:'Längere Verteilungsketten auf einem kompakten Brett.',
    descWide:'Breiteres Brett mit längeren horizontalen Wegen und mehr Routenplanung.',
    descBig:'Lange Wege, mehrere Abzweigungen und tiefere Strategie auf dem 6×4-Brett.',
    collectBefore:'Sammle {n} Steine vor deinem Gegner.',
    firstRoute:'Du hast die Steine aufgenommen. Wähle die erste leuchtende Nachbarmulde.',
    branch:'Abzweigung! Setze über eine leuchtende Mulde fort, auch auf der gegnerischen Seite.',
    captureYou:'Du hast {n} Steine aus den anderen Mulden der Spalte gesammelt; der letzte Stein bleibt liegen.',
    captureOther:'{name} hat {n} Steine aus den anderen Mulden der Spalte gesammelt; der letzte Stein bleibt liegen.',
    fullYou:'Dein letzter Stein landete in einer belegten Mulde; verteile von dort weiter.',
    fullOther:'Der letzte Stein von {name} landete in einer belegten Mulde; die Verteilung geht dort weiter.',
    rollback:'Kein gültiger Weg gefunden; der Zug wurde sicher zurückgesetzt.',
    humanTarget:'Du hast zuerst {target} Steine gesammelt. Stand {h} - {a}.', otherTarget:'{name} hat zuerst {target} Steine gesammelt. Stand {h} - {a}.',
    oneEach:'Jeder Spieler hat nur noch 1 Stein im eigenen Bereich. Unentschieden. Stand {h} - {a}.',
    cycleDraw:'Derselbe Zugzustand trat dreimal auf. Das Spiel endet unentschieden.',
    safeDraw:'Kein gültiger nächster Zug konnte erzeugt werden. Die Partie endet zur Sicherheit unentschieden.',
    humanEmptyYou:'Du hast in deinen {n} Mulden keine Steine mehr und verlierst.', humanEmptyOther:'{name} hat in den eigenen {n} Mulden keine Steine mehr und verliert.',
    scoreLine:'Stand: {human} {h} - {ai} {a}.', draw:'Unentschieden!', won:'Du hast gewonnen! 🎉', computerWon:'Computer gewinnt.', playerWon:'{name} gewinnt! 🎉',
    chooseOwnLocal:'{name}: Wähle eine deiner {n} nicht leeren Mulden.', chooseOwn:'Wähle eine nicht leere Mulde in deinen unteren zwei Reihen.',
    aiBranch:'Computer wählt eine Route...', aiThink:'Computer denkt nach...', aiCalc:'Computer berechnet...', aiDeep:'Computer berechnet intensiv...',
    aiRoute:'Computer wählt eine gültige Route...', aiCapturePlan:'Computer plant einen Fang...', aiDefense:'Computer wählt einen defensiven Zug...', aiRecalc:'Computer berechnet neu...',
    diffEasy:'Leicht gewählt. Der Computer kann Fehler machen.', diffMedium:'Mittel gewählt. Ausgewogener Gegner.', diffHard:'Schwer gewählt. Der Computer spielt ernst.',
    chooseStart:'Wähle die Startreihenfolge und starte das Spiel.', randomAI:'Zufall: Computer beginnt...', aiStarts:'Computer beginnt...',
    randomLocal:'Zufall: {name} beginnt. Wähle eine deiner {n} Mulden.', localStarts:'{name} beginnt. Wähle eine deiner {n} Mulden.',
    randomYou:'Zufall: Du beginnst. Wähle eine Mulde in den unteren zwei Reihen.', youStart:'Du beginnst. Wähle eine Mulde in den unteren zwei Reihen.',
    moveMenu:'Ein Zug läuft. Nach der Verteilung kannst du zum Menü zurückkehren.', moveNew:'Ein Zug läuft. Beende zuerst die aktuelle Verteilung.',
    startFirstName:'ICH BEGINNE', startSecondName:'ICH BEGINNE ALS ZWEITER', p1StartsName:'SPIELER 1 BEGINNT', p2StartsName:'SPIELER 2 BEGINNT', randomName:'ZUFÄLLIG',
    settingsTitle:'Einstellungen', sounds:'Spielklänge', soundsDesc:'Geräusche beim Verteilen und Sammeln', on:'AN', off:'AUS',
    themeDesc:'Hintergrund und Brettdarstellung', stoneStyleDesc:'Im Menü änderbar', gameType:'Spieltyp',
    gameTypeDesc:'{cols}×{rows}-Brett · {stones} Steine pro Mulde', defaultAI:'Standard-KI', defaultAIDesc:'Im Einzelspieler-Modus während des Spiels änderbar',
    startPref:'Startreihenfolge', startPrefDesc:'Wer im neuen Spiel den ersten Zug macht', showRules:'📖 Regeln zeigen', hideRules:'📖 Regeln ausblenden',
    rulesIntro:'Neu im Spiel? Hier sind die Kurzregeln.',
    rule1:'Beginne nur aus einer nicht leeren Mulde auf deiner eigenen Seite.', rule2:'Nimm alle Steine auf und verteile sie einzeln in benachbarte Mulden.',
    rule3:'Die Reihe darf nur am linken oder rechten Rand gewechselt werden; an Abzweigungen wählst du die Richtung.',
    rule4:'Beim Verteilen darf das ganze Brett benutzt werden, auch die gegnerische Seite.', rule5:'Landet der letzte Stein in einer belegten Mulde, nimm alle Steine dort auf und verteile weiter.',
    rule6:'Landet der letzte Stein in einer leeren Mulde, bleibt er dort; sammle alle anderen Steine derselben Spalte und gib den Zug ab.',
    rule7:'Wer zuerst {target} Steine sammelt, gewinnt.', rule8:'Haben beide Spieler genau 1 Stein im eigenen Bereich, endet das Spiel unentschieden.',
    rule9:'Wiederholt sich derselbe Zugzustand dreimal exakt, endet das Spiel unentschieden.', rule10:'Wer in den eigenen Mulden keine Steine mehr hat, verliert.'
  },
  es: {
    board:'Tablero', boardAria:'Tablero, {cols} columnas y {rows} filas', pitAria:'{owner}, casilla {index}, {count} piedras', stonesPit:'Piedras / Casilla', stoneStyle:'Estilo de piedras', theme:'Tema', start:'Orden de inicio', language:'Idioma',
    stonesN:'{n} piedras', styleMinimal:'Moderno', styleDark:'Oscuro', styleGlass:'Cristal / Hielo', styleColor:'Colores de jugador',
    themeNeon:'Noche Neón', themeWood:'Madera / Cálido', themeFrost:'Hielo / Frío', themeLight:'Minimal Claro',
    startRandom:'Aleatorio', startFirstSingle:'Empiezo primero', startSecondSingle:'Empiezo segundo', startFirstLocal:'Jugador 1', startSecondLocal:'Jugador 2',
    continue:'▶️ Continuar', continueDesc:'Volver a la partida actual', single:'🤖 Un jugador', singleDesc:'Jugar contra el ordenador',
    local:'👥 Dos jugadores', localDesc:'Jugar en el mismo dispositivo', settings:'⚙️ Ajustes', newGame:'Nueva partida', menu:'Menú',
    back:'Atrás', again:'Jugar de nuevo', resultMenu:'Volver al menú',
    easy:'Fácil', medium:'Medio', hard:'Difícil', easyUpper:'FÁCIL', mediumUpper:'MEDIO', hardUpper:'DIFÍCIL',
    you:'Tú', computer:'Ordenador', player1:'Jugador 1', player2:'Jugador 2', yourTurn:'TU TURNO',
    ownerComputer:'{n} CASILLAS DEL ORDENADOR', ownerYou:'TUS {n} CASILLAS', ownerP1:'JUGADOR 1 — {n} CASILLAS', ownerP2:'JUGADOR 2 — {n} CASILLAS',
    singleMode:'UN JUGADOR', localMode:'DOS JUGADORES', stylePrefix:'ESTILO', themePrefix:'TEMA', selectedMode:'MODO ELEGIDO',
    stoneUnit:'PIEDRAS', stonePerPit:'PIEDRAS/CASILLA',
    classic:'CLÁSICO', master:'MAESTRO', wide:'TABLERO ANCHO', grandMaster:'GRAN MAESTRO', longLine:'LÍNEA LARGA',
    bigBoard:'TABLERO GRANDE', advanced:'AVANZADO', marathon:'MARATÓN',
    descClassic:'Modo clásico: rápido y equilibrado.', descCompact:'Cadenas de reparto más largas en un tablero compacto.',
    descWide:'Tablero más ancho con rutas horizontales largas y más planificación.', descBig:'Rutas largas, varios cruces y estrategia profunda en el tablero 6×4.',
    collectBefore:'Reúne {n} piedras antes que tu rival.',
    firstRoute:'Has recogido las piedras. Elige la primera casilla vecina iluminada.', branch:'¡Cruce! Continúa por una casilla iluminada, incluso en el lado rival.',
    captureYou:'Has recogido {n} piedras de las otras casillas de la columna; la última piedra queda en el tablero.',
    captureOther:'{name} recogió {n} piedras de las otras casillas de la columna; la última piedra queda en el tablero.',
    fullYou:'Tu última piedra cayó en una casilla ocupada; continúa repartiendo desde allí.', fullOther:'La última piedra de {name} cayó en una casilla ocupada; el reparto continúa desde allí.',
    rollback:'No se encontró una continuación válida; el movimiento se revirtió de forma segura.',
    humanTarget:'Has reunido primero {target} piedras. Marcador {h} - {a}.', otherTarget:'{name} reunió primero {target} piedras. Marcador {h} - {a}.',
    oneEach:'Cada jugador tiene solo 1 piedra en su propia zona. Empate. Marcador {h} - {a}.', cycleDraw:'El mismo estado de jugada se repitió tres veces. La partida termina en empate.',
    safeDraw:'No se pudo generar una siguiente jugada válida. La partida termina en empate para proteger su integridad.',
    humanEmptyYou:'No te quedan piedras en tus {n} casillas y pierdes.', humanEmptyOther:'{name} no tiene piedras en sus {n} casillas y pierde.',
    scoreLine:'Marcador: {human} {h} - {ai} {a}.', draw:'¡Empate!', won:'¡Ganaste! 🎉', computerWon:'El ordenador ganó.', playerWon:'¡{name} ganó! 🎉',
    chooseOwnLocal:'{name}: elige una de tus {n} casillas no vacías.', chooseOwn:'Elige una casilla no vacía de tus dos filas inferiores.',
    aiBranch:'El ordenador está eligiendo una ruta...', aiThink:'El ordenador está pensando...', aiCalc:'El ordenador está calculando...', aiDeep:'El ordenador calcula en profundidad...',
    aiRoute:'El ordenador elige una ruta válida...', aiCapturePlan:'El ordenador prepara una captura...', aiDefense:'El ordenador eligió una jugada defensiva...', aiRecalc:'El ordenador recalcula...',
    diffEasy:'Fácil seleccionado. El ordenador puede cometer errores.', diffMedium:'Medio seleccionado. Rival equilibrado.', diffHard:'Difícil seleccionado. El ordenador jugará en serio.',
    chooseStart:'Elige el orden de inicio y comienza la partida.', randomAI:'Elección aleatoria: empieza el ordenador...', aiStarts:'Empieza el ordenador...',
    randomLocal:'Elección aleatoria: empieza {name}. Elige una de tus {n} casillas.', localStarts:'Empieza {name}. Elige una de tus {n} casillas.',
    randomYou:'Elección aleatoria: empiezas tú. Elige una casilla de las dos filas inferiores.', youStart:'Empiezas tú. Elige una casilla de las dos filas inferiores.',
    moveMenu:'Hay una jugada en curso. Podrás volver al menú cuando termine el reparto.', moveNew:'Hay una jugada en curso. Termina primero el reparto actual.',
    startFirstName:'EMPIEZO PRIMERO', startSecondName:'EMPIEZO SEGUNDO', p1StartsName:'EMPIEZA JUGADOR 1', p2StartsName:'EMPIEZA JUGADOR 2', randomName:'ALEATORIO',
    settingsTitle:'Ajustes', sounds:'Sonidos del juego', soundsDesc:'Sonidos al repartir y capturar piedras', on:'ACT.', off:'DESACT.',
    themeDesc:'Fondo y aspecto del tablero', stoneStyleDesc:'Se puede cambiar desde el menú', gameType:'Tipo de partida',
    gameTypeDesc:'Tablero {cols}×{rows} · {stones} piedras por casilla', defaultAI:'IA predeterminada', defaultAIDesc:'Se puede cambiar durante una partida de un jugador',
    startPref:'Orden de inicio', startPrefDesc:'Quién hace el primer movimiento en una nueva partida', showRules:'📖 Mostrar reglas', hideRules:'📖 Ocultar reglas',
    rulesIntro:'¿Primera partida? Aquí tienes las reglas breves.',
    rule1:'Empieza solo desde una casilla no vacía de tu lado.', rule2:'Recoge todas las piedras de esa casilla y repártelas una a una en casillas vecinas.',
    rule3:'Solo puedes cambiar de fila en el borde izquierdo o derecho; elige la dirección en los cruces.', rule4:'Durante el reparto puedes usar todo el tablero, incluido el lado rival.',
    rule5:'Si la última piedra cae en una casilla ocupada, recoge todas las piedras de allí y sigue repartiendo.',
    rule6:'Si la última piedra cae en una casilla vacía, se queda allí; recoge las demás piedras de esa columna y pasa el turno.',
    rule7:'Gana quien reúna primero {target} piedras.', rule8:'Si ambos jugadores tienen exactamente 1 piedra en su propia zona, la partida termina en empate.',
    rule9:'Si el mismo estado exacto se repite tres veces, la partida termina en empate.', rule10:'Pierde quien se quede sin piedras en sus propias casillas.'
  },
  fr: {
    board:'Plateau', boardAria:'Plateau, {cols} colonnes et {rows} rangées', pitAria:'{owner}, case {index}, {count} pierres', stonesPit:'Pierres / Case', stoneStyle:'Style des pierres', theme:'Thème', start:'Ordre de départ', language:'Langue',
    stonesN:'{n} pierres', styleMinimal:'Moderne', styleDark:'Sombre', styleGlass:'Verre / Glace', styleColor:'Couleurs joueurs',
    themeNeon:'Nuit Néon', themeWood:'Bois / Chaud', themeFrost:'Glace / Froid', themeLight:'Minimal Clair',
    startRandom:'Aléatoire', startFirstSingle:'Je commence', startSecondSingle:'Je joue en second', startFirstLocal:'Joueur 1', startSecondLocal:'Joueur 2',
    continue:'▶️ Continuer', continueDesc:'Revenir à la partie en cours', single:'🤖 Un joueur', singleDesc:"Jouer contre l'ordinateur",
    local:'👥 Deux joueurs', localDesc:'Jouer sur le même appareil', settings:'⚙️ Réglages', newGame:'Nouvelle partie', menu:'Menu',
    back:'Retour', again:'Rejouer', resultMenu:'Retour au menu',
    easy:'Facile', medium:'Moyen', hard:'Difficile', easyUpper:'FACILE', mediumUpper:'MOYEN', hardUpper:'DIFFICILE',
    you:'Vous', computer:'Ordinateur', player1:'Joueur 1', player2:'Joueur 2', yourTurn:'À VOUS',
    ownerComputer:"{n} CASES DE L'ORDINATEUR", ownerYou:'VOS {n} CASES', ownerP1:'JOUEUR 1 — {n} CASES', ownerP2:'JOUEUR 2 — {n} CASES',
    singleMode:'UN JOUEUR', localMode:'DEUX JOUEURS', stylePrefix:'STYLE', themePrefix:'THÈME', selectedMode:'MODE CHOISI',
    stoneUnit:'PIERRES', stonePerPit:'PIERRES/CASE',
    classic:'CLASSIQUE', master:'MAÎTRE', wide:'PLATEAU LARGE', grandMaster:'GRAND MAÎTRE', longLine:'LONGUE LIGNE',
    bigBoard:'GRAND PLATEAU', advanced:'AVANCÉ', marathon:'MARATHON',
    descClassic:'Mode classique : rapide et équilibré.', descCompact:'Chaînes de distribution plus longues sur un plateau compact.',
    descWide:'Plateau plus large, longues routes horizontales et davantage de planification.', descBig:'Longues routes, plusieurs embranchements et stratégie plus profonde sur le plateau 6×4.',
    collectBefore:'Collectez {n} pierres avant votre adversaire.',
    firstRoute:'Vous avez pris les pierres. Choisissez la première case voisine lumineuse.', branch:"Embranchement ! Continuez par une case lumineuse, même du côté adverse.",
    captureYou:'Vous avez collecté {n} pierres dans les autres cases de la colonne ; la dernière pierre reste sur le plateau.',
    captureOther:'{name} a collecté {n} pierres dans les autres cases de la colonne ; la dernière pierre reste sur le plateau.',
    fullYou:'Votre dernière pierre tombe dans une case occupée ; continuez la distribution depuis cette case.', fullOther:'La dernière pierre de {name} tombe dans une case occupée ; la distribution continue.',
    rollback:'Aucune continuation valide ; le coup a été annulé en toute sécurité.',
    humanTarget:'Vous avez collecté {target} pierres en premier. Score {h} - {a}.', otherTarget:'{name} a collecté {target} pierres en premier. Score {h} - {a}.',
    oneEach:"Chaque joueur n'a plus qu'1 pierre dans sa zone. Match nul. Score {h} - {a}.", cycleDraw:'Le même état de coup est apparu trois fois. La partie se termine par un nul.',
    safeDraw:'Aucun coup suivant valide ne peut être produit. La partie se termine par un nul pour préserver son intégrité.',
    humanEmptyYou:"Vous n'avez plus de pierres dans vos {n} cases et vous perdez.", humanEmptyOther:"{name} n'a plus de pierres dans ses {n} cases et perd.",
    scoreLine:'Score : {human} {h} - {ai} {a}.', draw:'Match nul !', won:'Vous avez gagné ! 🎉', computerWon:"L'ordinateur a gagné.", playerWon:'{name} a gagné ! 🎉',
    chooseOwnLocal:'{name} : choisissez une de vos {n} cases non vides.', chooseOwn:'Choisissez une case non vide dans vos deux rangées du bas.',
    aiBranch:"L'ordinateur choisit une route...", aiThink:"L'ordinateur réfléchit...", aiCalc:"L'ordinateur calcule...", aiDeep:"L'ordinateur calcule en profondeur...",
    aiRoute:"L'ordinateur choisit une route valide...", aiCapturePlan:"L'ordinateur prépare une capture...", aiDefense:"L'ordinateur choisit un coup défensif...", aiRecalc:"L'ordinateur recalcule...",
    diffEasy:"Facile sélectionné. L'ordinateur peut faire des erreurs.", diffMedium:'Moyen sélectionné. Adversaire équilibré.', diffHard:"Difficile sélectionné. L'ordinateur jouera sérieusement.",
    chooseStart:"Choisissez l'ordre de départ et lancez la partie.", randomAI:"Choix aléatoire : l'ordinateur commence...", aiStarts:"L'ordinateur commence...",
    randomLocal:'Choix aléatoire : {name} commence. Choisissez une de vos {n} cases.', localStarts:'{name} commence. Choisissez une de vos {n} cases.',
    randomYou:'Choix aléatoire : vous commencez. Choisissez une case dans les deux rangées du bas.', youStart:'Vous commencez. Choisissez une case dans les deux rangées du bas.',
    moveMenu:'Un coup est en cours. Vous pourrez revenir au menu après la distribution.', moveNew:"Un coup est en cours. Terminez d'abord la distribution.",
    startFirstName:'JE COMMENCE', startSecondName:'JE JOUE EN SECOND', p1StartsName:'JOUEUR 1 COMMENCE', p2StartsName:'JOUEUR 2 COMMENCE', randomName:'ALÉATOIRE',
    settingsTitle:'Réglages', sounds:'Sons du jeu', soundsDesc:'Sons de distribution et de capture', on:'ACTIF', off:'INACTIF',
    themeDesc:'Fond et apparence du plateau', stoneStyleDesc:'Modifiable depuis le menu', gameType:'Type de partie',
    gameTypeDesc:'Plateau {cols}×{rows} · {stones} pierres par case', defaultAI:'IA par défaut', defaultAIDesc:'Modifiable pendant une partie solo',
    startPref:'Ordre de départ', startPrefDesc:'Qui joue le premier coup dans une nouvelle partie', showRules:'📖 Afficher les règles', hideRules:'📖 Masquer les règles',
    rulesIntro:'Première partie ? Voici les règles courtes.',
    rule1:'Commencez uniquement depuis une case non vide de votre côté.', rule2:'Prenez toutes les pierres de cette case et distribuez-les une par une dans les cases voisines.',
    rule3:'Vous ne pouvez changer de rangée que sur les bords gauche ou droit ; choisissez votre direction aux embranchements.', rule4:'Pendant la distribution, tout le plateau peut être utilisé, y compris le côté adverse.',
    rule5:'Si la dernière pierre arrive dans une case occupée, prenez toutes les pierres de cette case et continuez.',
    rule6:'Si la dernière pierre arrive dans une case vide, elle y reste ; collectez toutes les autres pierres de la même colonne puis passez le tour.',
    rule7:'Le premier à collecter {target} pierres gagne.', rule8:"Si les deux joueurs n'ont exactement qu'1 pierre dans leur propre zone, la partie est nulle.",
    rule9:'Si le même état exact se répète trois fois, la partie est nulle.', rule10:"Un joueur qui n'a plus de pierres dans ses propres cases perd."
  },
  pt: {
    board:'Tabuleiro', boardAria:'Tabuleiro, {cols} colunas e {rows} fileiras', pitAria:'{owner}, casa {index}, {count} pedras', stonesPit:'Pedras / Casa', stoneStyle:'Estilo das pedras', theme:'Tema', start:'Ordem inicial', language:'Idioma',
    stonesN:'{n} pedras', styleMinimal:'Moderno', styleDark:'Escuro', styleGlass:'Vidro / Gelo', styleColor:'Cores dos jogadores',
    themeNeon:'Noite Neon', themeWood:'Madeira / Quente', themeFrost:'Gelo / Frio', themeLight:'Minimal Claro',
    startRandom:'Aleatório', startFirstSingle:'Eu começo', startSecondSingle:'Eu começo em segundo', startFirstLocal:'Jogador 1', startSecondLocal:'Jogador 2',
    continue:'▶️ Continuar', continueDesc:'Voltar ao jogo atual', single:'🤖 Um jogador', singleDesc:'Jogar contra o computador',
    local:'👥 Dois jogadores', localDesc:'Jogar no mesmo dispositivo', settings:'⚙️ Configurações', newGame:'Novo jogo', menu:'Menu',
    back:'Voltar', again:'Jogar novamente', resultMenu:'Voltar ao menu',
    easy:'Fácil', medium:'Médio', hard:'Difícil', easyUpper:'FÁCIL', mediumUpper:'MÉDIO', hardUpper:'DIFÍCIL',
    you:'Você', computer:'Computador', player1:'Jogador 1', player2:'Jogador 2', yourTurn:'SUA VEZ',
    ownerComputer:'{n} CASAS DO COMPUTADOR', ownerYou:'SUAS {n} CASAS', ownerP1:'JOGADOR 1 — {n} CASAS', ownerP2:'JOGADOR 2 — {n} CASAS',
    singleMode:'UM JOGADOR', localMode:'DOIS JOGADORES', stylePrefix:'ESTILO', themePrefix:'TEMA', selectedMode:'MODO SELECIONADO',
    stoneUnit:'PEDRAS', stonePerPit:'PEDRAS/CASA',
    classic:'CLÁSSICO', master:'MESTRE', wide:'TABULEIRO AMPLO', grandMaster:'GRÃO-MESTRE', longLine:'LINHA LONGA',
    bigBoard:'TABULEIRO GRANDE', advanced:'AVANÇADO', marathon:'MARATONA',
    descClassic:'Modo clássico: rápido e equilibrado.', descCompact:'Cadeias de distribuição mais longas em um tabuleiro compacto.',
    descWide:'Tabuleiro mais amplo, rotas horizontais longas e mais planejamento.', descBig:'Rotas longas, múltiplas bifurcações e estratégia profunda no tabuleiro 6×4.',
    collectBefore:'Colete {n} pedras antes do adversário.',
    firstRoute:'Você pegou as pedras. Escolha a primeira casa vizinha iluminada.', branch:'Bifurcação! Continue por uma casa iluminada, mesmo no lado do adversário.',
    captureYou:'Você coletou {n} pedras das outras casas da coluna; a última pedra permanece no tabuleiro.',
    captureOther:'{name} coletou {n} pedras das outras casas da coluna; a última pedra permanece no tabuleiro.',
    fullYou:'Sua última pedra caiu em uma casa ocupada; continue distribuindo a partir dela.', fullOther:'A última pedra de {name} caiu em uma casa ocupada; a distribuição continua dali.',
    rollback:'Nenhuma continuação válida foi encontrada; a jogada foi revertida com segurança.',
    humanTarget:'Você coletou {target} pedras primeiro. Placar {h} - {a}.', otherTarget:'{name} coletou {target} pedras primeiro. Placar {h} - {a}.',
    oneEach:'Cada jogador tem apenas 1 pedra em sua própria área. Empate. Placar {h} - {a}.', cycleDraw:'O mesmo estado da jogada ocorreu três vezes. A partida termina empatada.',
    safeDraw:'Não foi possível gerar uma próxima jogada válida. A partida termina empatada para preservar sua integridade.',
    humanEmptyYou:'Você ficou sem pedras em suas {n} casas e perdeu.', humanEmptyOther:'{name} ficou sem pedras em suas {n} casas e perdeu.',
    scoreLine:'Placar: {human} {h} - {ai} {a}.', draw:'Empate!', won:'Você venceu! 🎉', computerWon:'O computador venceu.', playerWon:'{name} venceu! 🎉',
    chooseOwnLocal:'{name}: escolha uma de suas {n} casas não vazias.', chooseOwn:'Escolha uma casa não vazia nas duas fileiras inferiores.',
    aiBranch:'O computador está escolhendo uma rota...', aiThink:'O computador está pensando...', aiCalc:'O computador está calculando...', aiDeep:'O computador está calculando profundamente...',
    aiRoute:'O computador escolhe uma rota válida...', aiCapturePlan:'O computador planeja uma captura...', aiDefense:'O computador escolheu uma jogada defensiva...', aiRecalc:'O computador está recalculando...',
    diffEasy:'Fácil selecionado. O computador pode cometer erros.', diffMedium:'Médio selecionado. Adversário equilibrado.', diffHard:'Difícil selecionado. O computador jogará sério.',
    chooseStart:'Escolha a ordem inicial e comece o jogo.', randomAI:'Escolha aleatória: o computador começa...', aiStarts:'O computador começa...',
    randomLocal:'Escolha aleatória: {name} começa. Escolha uma de suas {n} casas.', localStarts:'{name} começa. Escolha uma de suas {n} casas.',
    randomYou:'Escolha aleatória: você começa. Escolha uma casa nas duas fileiras inferiores.', youStart:'Você começa. Escolha uma casa nas duas fileiras inferiores.',
    moveMenu:'Há uma jogada em andamento. Você poderá voltar ao menu após a distribuição.', moveNew:'Há uma jogada em andamento. Termine primeiro a distribuição atual.',
    startFirstName:'EU COMEÇO', startSecondName:'EU COMEÇO EM SEGUNDO', p1StartsName:'JOGADOR 1 COMEÇA', p2StartsName:'JOGADOR 2 COMEÇA', randomName:'ALEATÓRIO',
    settingsTitle:'Configurações', sounds:'Sons do jogo', soundsDesc:'Sons de distribuição e captura', on:'LIG.', off:'DESL.',
    themeDesc:'Fundo e aparência do tabuleiro', stoneStyleDesc:'Pode ser alterado no menu', gameType:'Tipo de jogo',
    gameTypeDesc:'Tabuleiro {cols}×{rows} · {stones} pedras por casa', defaultAI:'IA padrão', defaultAIDesc:'Pode ser alterada durante jogos solo',
    startPref:'Ordem inicial', startPrefDesc:'Quem faz a primeira jogada em um novo jogo', showRules:'📖 Mostrar regras', hideRules:'📖 Ocultar regras',
    rulesIntro:'Primeira vez jogando? Aqui estão as regras resumidas.',
    rule1:'Comece apenas em uma casa não vazia do seu lado.', rule2:'Pegue todas as pedras dessa casa e distribua uma a uma nas casas vizinhas.',
    rule3:'Só é possível mudar de fileira nas bordas esquerda ou direita; escolha a direção nas bifurcações.', rule4:'Durante a distribuição, todo o tabuleiro pode ser usado, inclusive o lado adversário.',
    rule5:'Se a última pedra cair em uma casa ocupada, pegue todas as pedras dali e continue distribuindo.',
    rule6:'Se a última pedra cair em uma casa vazia, ela fica ali; colete todas as outras pedras da mesma coluna e passe a vez.',
    rule7:'Vence quem coletar {target} pedras primeiro.', rule8:'Se ambos os jogadores tiverem exatamente 1 pedra em sua própria área, a partida termina empatada.',
    rule9:'Se o mesmo estado exato da jogada ocorrer três vezes, a partida termina empatada.', rule10:'Quem ficar sem pedras em suas próprias casas perde.'
  },
  ar: {
    board:'اللوحة', boardAria:'اللوحة، {cols} أعمدة و{rows} صفوف', pitAria:'{owner}، الحفرة {index}، {count} حجارة', stonesPit:'الحجارة / حفرة', stoneStyle:'نمط الحجارة', theme:'السمة', start:'ترتيب البداية', language:'اللغة',
    stonesN:'{n} حجارة', styleMinimal:'حديث', styleDark:'داكن', styleGlass:'زجاج / جليد', styleColor:'ألوان اللاعبين',
    themeNeon:'ليل نيون', themeWood:'خشب / دافئ', themeFrost:'جليد / بارد', themeLight:'فاتح بسيط',
    startRandom:'عشوائي', startFirstSingle:'أبدأ أولاً', startSecondSingle:'أبدأ ثانياً', startFirstLocal:'اللاعب 1', startSecondLocal:'اللاعب 2',
    continue:'▶️ متابعة', continueDesc:'العودة إلى اللعبة الحالية', single:'🤖 لاعب واحد', singleDesc:'العب ضد الكمبيوتر',
    local:'👥 لاعبان', localDesc:'اللعب على الجهاز نفسه', settings:'⚙️ الإعدادات', newGame:'لعبة جديدة', menu:'القائمة',
    back:'رجوع', again:'العب مجدداً', resultMenu:'العودة إلى القائمة',
    easy:'سهل', medium:'متوسط', hard:'صعب', easyUpper:'سهل', mediumUpper:'متوسط', hardUpper:'صعب',
    you:'أنت', computer:'الكمبيوتر', player1:'اللاعب 1', player2:'اللاعب 2', yourTurn:'دورك',
    ownerComputer:'{n} حفر للكمبيوتر', ownerYou:'حُفرك: {n}', ownerP1:'اللاعب 1 — {n} حفر', ownerP2:'اللاعب 2 — {n} حفر',
    singleMode:'لاعب واحد', localMode:'لاعبان', stylePrefix:'النمط', themePrefix:'السمة', selectedMode:'الوضع المختار',
    stoneUnit:'حجارة', stonePerPit:'حجارة/حفرة',
    classic:'كلاسيكي', master:'محترف', wide:'لوحة عريضة', grandMaster:'خبير', longLine:'خط طويل',
    bigBoard:'لوحة كبيرة', advanced:'متقدم', marathon:'ماراثون',
    descClassic:'الوضع الكلاسيكي: سريع ومتوازن.', descCompact:'سلاسل توزيع أطول على لوحة مدمجة.',
    descWide:'لوحة أوسع مع مسارات أفقية أطول وتخطيط أكثر.', descBig:'مسارات طويلة وتفرعات متعددة واستراتيجية أعمق على لوحة 6×4.',
    collectBefore:'اجمع {n} حجارة قبل خصمك.',
    firstRoute:'التقطت الحجارة. اختر أول حفرة مجاورة مضيئة.', branch:'تفرع! تابع عبر أي حفرة مضيئة حتى لو كانت في جهة الخصم.',
    captureYou:'جمعت {n} حجارة من الحفر الأخرى في العمود؛ تبقى الحجرة الأخيرة على اللوحة.',
    captureOther:'جمع {name} عدد {n} من الحجارة من الحفر الأخرى في العمود؛ تبقى الحجرة الأخيرة على اللوحة.',
    fullYou:'وصلت حجرتك الأخيرة إلى حفرة مشغولة؛ تابع التوزيع منها.', fullOther:'وصلت الحجرة الأخيرة لـ{name} إلى حفرة مشغولة؛ يستمر التوزيع منها.',
    rollback:'لم يُعثر على مسار صالح؛ تم التراجع عن الحركة بأمان.',
    humanTarget:'جمعت {target} حجارة أولاً. النتيجة {h} - {a}.', otherTarget:'جمع {name} عدد {target} من الحجارة أولاً. النتيجة {h} - {a}.',
    oneEach:'بقيت حجرة واحدة فقط لكل لاعب في منطقته. تعادل. النتيجة {h} - {a}.', cycleDraw:'تكررت حالة الحركة نفسها ثلاث مرات. تنتهي اللعبة بالتعادل.',
    safeDraw:'تعذر إنشاء حركة تالية صالحة. تنتهي المباراة بالتعادل للحفاظ على سلامة اللعبة.',
    humanEmptyYou:'لم تعد لديك حجارة في حُفرك وعددها {n}، لذا تخسر.', humanEmptyOther:'لم تعد لدى {name} حجارة في حفره وعددها {n}، لذا يخسر.',
    scoreLine:'النتيجة: {human} {h} - {ai} {a}.', draw:'تعادل!', won:'فزت! 🎉', computerWon:'فاز الكمبيوتر.', playerWon:'فاز {name}! 🎉',
    chooseOwnLocal:'{name}: اختر حفرة غير فارغة من حُفرك وعددها {n}.', chooseOwn:'اختر حفرة غير فارغة من الصفين السفليين.',
    aiBranch:'الكمبيوتر يختار مساراً...', aiThink:'الكمبيوتر يفكر...', aiCalc:'الكمبيوتر يحسب...', aiDeep:'الكمبيوتر يجري حساباً أعمق...',
    aiRoute:'الكمبيوتر يختار مساراً صالحاً...', aiCapturePlan:'الكمبيوتر يخطط لالتقاط الحجارة...', aiDefense:'الكمبيوتر اختار حركة دفاعية...', aiRecalc:'الكمبيوتر يعيد الحساب...',
    diffEasy:'تم اختيار السهل. قد يخطئ الكمبيوتر.', diffMedium:'تم اختيار المتوسط. خصم متوازن.', diffHard:'تم اختيار الصعب. سيلعب الكمبيوتر بجدية.',
    chooseStart:'اختر ترتيب البداية ثم ابدأ اللعبة.', randomAI:'اختيار عشوائي: الكمبيوتر يبدأ...', aiStarts:'الكمبيوتر يبدأ...',
    randomLocal:'اختيار عشوائي: يبدأ {name}. اختر حفرة من حُفرك وعددها {n}.', localStarts:'يبدأ {name}. اختر حفرة من حُفرك وعددها {n}.',
    randomYou:'اختيار عشوائي: أنت تبدأ. اختر حفرة من الصفين السفليين.', youStart:'أنت تبدأ. اختر حفرة من الصفين السفليين.',
    moveMenu:'هناك حركة جارية. يمكنك العودة إلى القائمة بعد انتهاء التوزيع.', moveNew:'هناك حركة جارية. أنهِ التوزيع الحالي أولاً.',
    startFirstName:'أبدأ أولاً', startSecondName:'أبدأ ثانياً', p1StartsName:'اللاعب 1 يبدأ', p2StartsName:'اللاعب 2 يبدأ', randomName:'عشوائي',
    settingsTitle:'الإعدادات', sounds:'أصوات اللعبة', soundsDesc:'أصوات وضع الحجارة والتقاطها', on:'تشغيل', off:'إيقاف',
    themeDesc:'الخلفية ومظهر اللوحة', stoneStyleDesc:'يمكن تغييره من القائمة', gameType:'نوع اللعبة',
    gameTypeDesc:'لوحة {cols}×{rows} · {stones} حجارة لكل حفرة', defaultAI:'الذكاء الاصطناعي الافتراضي', defaultAIDesc:'يمكن تغييره أثناء اللعب الفردي',
    startPref:'ترتيب البداية', startPrefDesc:'من يقوم بالحركة الأولى في لعبة جديدة', showRules:'📖 عرض القواعد', hideRules:'📖 إخفاء القواعد',
    rulesIntro:'تلعب لأول مرة؟ إليك القواعد المختصرة.',
    rule1:'ابدأ الحركة فقط من حفرة غير فارغة في جهتك.', rule2:'التقط كل الحجارة في تلك الحفرة ووزعها واحدة تلو الأخرى في الحفر المجاورة.',
    rule3:'يمكن تغيير الصف فقط عند الحافة اليسرى أو اليمنى؛ اختر الاتجاه عند التفرعات.', rule4:'أثناء التوزيع يمكن استخدام اللوحة كلها، بما في ذلك جهة الخصم.',
    rule5:'إذا وصلت الحجرة الأخيرة إلى حفرة مشغولة، التقط كل الحجارة فيها وتابع التوزيع.',
    rule6:'إذا وصلت الحجرة الأخيرة إلى حفرة فارغة، تبقى هناك؛ اجمع كل الحجارة الأخرى في العمود نفسه ثم مرر الدور.',
    rule7:'يفوز أول من يجمع {target} حجارة.', rule8:'إذا بقيت حجرة واحدة بالضبط لكل لاعب في منطقته، تنتهي اللعبة بالتعادل.',
    rule9:'إذا تكررت حالة الحركة نفسها تماماً ثلاث مرات، تنتهي اللعبة بالتعادل.', rule10:'يخسر اللاعب الذي لا تبقى لديه حجارة في حفره.'
  }
};

const SUPPORTED_LANGUAGES = ['tr','en','de','es','fr','pt','ar'];

function detectLanguage(){
  try{
    const saved = localStorage.getItem('tas-strateji-language');
    if(SUPPORTED_LANGUAGES.includes(saved)) return saved;
  }catch(e){}
  const raw = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const base = raw.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'en';
}

let currentLanguage = detectLanguage();

function t(key, vars={}){
  const table = I18N[currentLanguage] || I18N.en;
  let value = table[key] ?? I18N.en[key] ?? I18N.tr[key] ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_,k)=> vars[k] ?? `{${k}}`);
}

function setLanguage(lang, persist=true){
  if(!SUPPORTED_LANGUAGES.includes(lang)) lang='en';
  currentLanguage=lang;
  document.documentElement.lang=lang==='pt' ? 'pt-BR' : lang;
  document.documentElement.dir=lang==='ar' ? 'rtl' : 'ltr';
  if(languageSelectCompact) languageSelectCompact.value=lang;
  if(persist){
    try{ localStorage.setItem('tas-strateji-language',lang); }catch(e){}
  }
  applyLanguageUI();
}

function setSelectText(select, values){
  if(!select) return;
  values.forEach(([value,text])=>{
    const opt = Array.from(select.options).find(o=>o.value===String(value));
    if(opt) opt.textContent=text;
  });
}

function difficultyName(level, upper=false){
  const suffix = upper ? 'Upper' : '';
  return t(level + suffix);
}

function applyLanguageUI(){
  boardLabel.textContent=t('board');
  stonesLabel.textContent=t('stonesPit');
  stoneStyleLabel.textContent=t('stoneStyle');
  themeLabel.textContent=t('theme');
  startLabel.textContent=t('start');
  languageLabel.textContent=t('language');

  document.getElementById('newGame').textContent=t('newGame');
  document.getElementById('menuBtn').textContent=t('menu');
  document.getElementById('infoBack').textContent=t('back');
  document.getElementById('again').textContent=t('again');
  document.getElementById('resultMenu').textContent=t('resultMenu');

  continueTitle.textContent=t('continue');
  continueDesc.textContent=t('continueDesc');
  singleTitle.textContent=t('single');
  singleDesc.textContent=t('singleDesc');
  localTitle.textContent=t('local');
  localDesc.textContent=t('localDesc');
  settingsTitle.textContent=t('settings');

  setSelectText(stonesSelectCompact, [[3,t('stonesN',{n:3})],[4,t('stonesN',{n:4})],[5,t('stonesN',{n:5})],[6,t('stonesN',{n:6})]]);
  setSelectText(styleSelectCompact, [['minimal',t('styleMinimal')],['dark',t('styleDark')],['glass',t('styleGlass')],['color',t('styleColor')]]);
  setSelectText(themeSelectCompact, [['neon',t('themeNeon')],['wood',t('themeWood')],['frost',t('themeFrost')],['light',t('themeLight')]]);
  setSelectText(startSelectCompact, [
    ['random',t('startRandom')],
    ['first',gameMode==='local'?t('startFirstLocal'):t('startFirstSingle')],
    ['second',gameMode==='local'?t('startSecondLocal'):t('startSecondSingle')]
  ]);

  document.querySelectorAll('.diffBtn').forEach(btn=>{
    btn.textContent=difficultyName(btn.dataset.level,true);
  });

  updateStoneStyleUI();
  updateThemeUI();
  updateGameConfigUI();
  updateDifficultyButtons();
  if(!gameStarted && !gameOver) statusEl.textContent=t('chooseStart');
  render();
}

if(languageSelectCompact){
  languageSelectCompact.addEventListener('change',()=>setLanguage(languageSelectCompact.value,true));
}

// Mod; tahta sütun sayısı (4/5) ve hane başına taş sayısıyla belirlenir.


function tone(freq=440,dur=.055,vol=.025,type='sine'){
  if(!soundEnabled) return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.setValueAtTime(vol,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
    o.connect(g);g.connect(audioCtx.destination);
    o.start();o.stop(audioCtx.currentTime+dur);
  }catch(e){}
}
function sideName(side){
  if(gameMode==='local') return side==='human' ? t('player1') : t('player2');
  return side==='human' ? t('you') : t('computer');
}
function isControlledByPerson(side){
  return side==='human' || gameMode==='local';
}

function stoneStyleInfo(){
  if(stoneStyle==='dark') return {name:t('styleDark').toUpperCase(), theme:'theme-dark'};
  if(stoneStyle==='glass') return {name:t('styleGlass').toUpperCase(), theme:'theme-glass'};
  if(stoneStyle==='color') return {name:t('styleColor').toUpperCase(), theme:'theme-color'};
  return {name:t('styleMinimal').toUpperCase(), theme:'theme-minimal'};
}

function updateStoneStyleUI(){
  const info = stoneStyleInfo();
  document.body.classList.remove('theme-minimal','theme-dark','theme-glass','theme-color');
  document.body.classList.add(info.theme);
  if(selectedStyle) selectedStyle.textContent = t('stylePrefix') + ': ' + info.name;
  if(styleSelectCompact) styleSelectCompact.value = stoneStyle;
}


function themeInfo(){
  if(appTheme==='wood') return {name:t('themeWood').toUpperCase(), cls:'theme-wood'};
  if(appTheme==='frost') return {name:t('themeFrost').toUpperCase(), cls:'theme-frost'};
  if(appTheme==='light') return {name:t('themeLight').toUpperCase(), cls:'theme-light'};
  return {name:t('themeNeon').toUpperCase(), cls:'theme-neon'};
}

function updateThemeUI(){
  const info = themeInfo();
  document.body.classList.remove('theme-neon','theme-wood','theme-frost','theme-light');
  document.body.classList.add(info.cls);
  if(selectedTheme) selectedTheme.textContent = t('themePrefix') + ': ' + info.name;
  if(themeSelectCompact) themeSelectCompact.value = appTheme;
}


function startPreferenceName(){
  if(startPreference==='first') return gameMode==='local' ? t('p1StartsName') : t('startFirstName');
  if(startPreference==='second') return gameMode==='local' ? t('p2StartsName') : t('startSecondName');
  return t('randomName');
}

function resolveStartingSide(){
  if(startPreference==='first') return 'human';
  if(startPreference==='second') return 'ai';
  return Math.random()<0.5 ? 'human' : 'ai';
}

function updateStartPreferenceUI(){
  if(startSelectCompact) startSelectCompact.value = startPreference;
}

if(startSelectCompact){
  startSelectCompact.addEventListener('change',()=>{
    if(aiThinking) return;
    startPreference = startSelectCompact.value;
    updateStartPreferenceUI();
    savePreferences();
  });
}

function cellCount(){ return BOARD_ROWS * boardCols; }
function sideCellCount(){ return (BOARD_ROWS/2) * boardCols; }

function modeInfo(){
  const scoreTarget = sideCellCount() * stonesPerHouse;
  const key = `${boardCols}x${BOARD_ROWS}-${stonesPerHouse}`;
  const special = {
    '4x4-3': t('classic'),
    '4x4-4': t('master'),
    '5x4-3': t('wide'),
    '5x4-4': t('grandMaster'),
    '6x4-3': t('longLine'),
    '6x4-4': t('bigBoard'),
    '6x4-5': t('advanced'),
    '6x4-6': t('marathon')
  };
  const label = special[key] || `${boardCols}×${BOARD_ROWS} · ${stonesPerHouse}`;
  const short = `${scoreTarget} ${t('stoneUnit')}`;

  let desc;
  if(boardCols===4 && stonesPerHouse===3) desc=t('descClassic');
  else if(boardCols===4) desc=t('descCompact');
  else if(boardCols===5) desc=t('descWide');
  else desc=t('descBig');

  return {name:`${short} — ${label}`, short, desc};
}

function updateModeUI(){
  const local = gameMode==='local';
  const info = modeInfo();
  const houses = sideCellCount();

  topScoreLabel.textContent = local ? t('player2').toUpperCase() : t('computer').toUpperCase();
  bottomScoreLabel.textContent = local ? t('player1').toUpperCase() : t('you').toUpperCase();
  topOwnerLabel.textContent = local ? t('ownerP2',{n:houses}) : t('ownerComputer',{n:houses});
  bottomOwnerLabel.textContent = local ? t('ownerP1',{n:houses}) : t('ownerYou',{n:houses});
  difficultyPanel.style.display = local ? 'none' : 'grid';
  modeBadge.textContent = info.name + ' · ' + (local ? t('localMode') : t('singleMode') + ' — ' + difficultyName(difficulty,true));
  modeBadge.classList.add('show');

  setSelectText(startSelectCompact, [
    ['random',t('startRandom')],
    ['first',local?t('startFirstLocal'):t('startFirstSingle')],
    ['second',local?t('startSecondLocal'):t('startSecondSingle')]
  ]);
}

function updateGameConfigUI(){
  targetScore = sideCellCount() * stonesPerHouse;
  const info = modeInfo();

  gameTitle.textContent = info.short;
  brandMark.textContent = targetScore;
  menuGameTitle.textContent = info.short;
  menuSubtitle.textContent = info.desc + ' ' + t('collectBefore',{n:targetScore});
  selectedMode.textContent = `${t('selectedMode')}: ${info.name} · ${boardCols}×${BOARD_ROWS} · ${stonesPerHouse} ${t('stonePerPit')}`;
  document.title = `TAŞ STRATEJİ · ${info.short}`;
  boardEl.setAttribute('aria-label', t('boardAria',{cols:boardCols,rows:BOARD_ROWS}));

  if(boardSelectCompact) boardSelectCompact.value = String(boardCols);
  if(stonesSelectCompact) stonesSelectCompact.value = String(stonesPerHouse);
  updateStartPreferenceUI();

  boardEl.style.gridTemplateColumns = `repeat(${boardCols},1fr)`;
  updateModeUI();
}

if(boardSelectCompact){
  boardSelectCompact.addEventListener('change',()=>{
    if(aiThinking) return;
    boardCols = Number(boardSelectCompact.value);
    updateGameConfigUI();
    savePreferences();
  });
}
if(stonesSelectCompact){
  stonesSelectCompact.addEventListener('change',()=>{
    if(aiThinking) return;
    stonesPerHouse = Number(stonesSelectCompact.value);
    updateGameConfigUI();
    savePreferences();
  });
}
if(styleSelectCompact){
  styleSelectCompact.addEventListener('change',()=>{
    if(aiThinking) return;
    stoneStyle = styleSelectCompact.value;
    updateStoneStyleUI();
    savePreferences();
  });
}
if(themeSelectCompact){
  themeSelectCompact.addEventListener('change',()=>{
    if(aiThinking) return;
    appTheme = themeSelectCompact.value;
    updateThemeUI();
    savePreferences();
  });
}

function ownerOf(i){ return i < sideCellCount() ? 'ai' : 'human'; }
function rowOf(i){ return Math.floor(i/boardCols); }
function colOf(i){ return i % boardCols; }
function idx(r,c){ return r*boardCols + c; }
function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

function generationAlive(generation){
  return generation===gameGeneration;
}

function scheduleForGeneration(fn, delay, generation=gameGeneration){
  setTimeout(()=>{
    if(!generationAlive(generation) || gameOver) return;
    fn();
  }, delay);
}

function yieldToUI(){
  return new Promise(resolve=>setTimeout(resolve,0));
}

function render(){
  boardEl.innerHTML = '';
  for(let i=0;i<cellCount();i++){
    if(i===sideCellCount()){
      const gap = document.createElement('div');
      gap.className = 'rowGap';
      boardEl.appendChild(gap);
    }
    const btn = document.createElement('button');
    btn.className = 'cell ' + (ownerOf(i)==='human' ? 'mine' : 'aiCell');
    if(i===selectedSource) btn.classList.add('selected');
    if(i===lastIndex) btn.classList.add('last');
    if(captureCol>=0 && colOf(i)===captureCol) btn.classList.add('capture');
    if(choiceCells.includes(i)) btn.classList.add('choice');

    const humanControlled = isControlledByPerson(current);
    const clickable =
      (!locked && humanControlled && ownerOf(i)===current && cells[i]>0 && waitingMode==='source') ||
      (humanControlled && choiceCells.includes(i) && (waitingMode==='branch' || waitingMode==='source-start'));
    if(clickable) btn.classList.add('clickable');

    btn.dataset.cellIndex=String(i);
    btn.setAttribute('aria-label',t('pitAria',{
      owner:sideName(ownerOf(i)),index:i+1,count:cells[i]
    }));
    btn.setAttribute('aria-disabled',clickable?'false':'true');
    if(i===selectedSource) btn.setAttribute('aria-pressed','true');

    btn.addEventListener('keydown',ev=>{
      let target=null;
      const r=rowOf(i),c=colOf(i);
      if(ev.key==='ArrowLeft' && c>0) target=idx(r,c-1);
      else if(ev.key==='ArrowRight' && c<boardCols-1) target=idx(r,c+1);
      else if(ev.key==='ArrowUp' && r>0) target=idx(r-1,c);
      else if(ev.key==='ArrowDown' && r<BOARD_ROWS-1) target=idx(r+1,c);
      else if(ev.key==='Home') target=idx(r,0);
      else if(ev.key==='End') target=idx(r,boardCols-1);
      if(target!==null){
        ev.preventDefault();
        const el=boardEl.querySelector(`[data-cell-index="${target}"]`);
        if(el) el.focus();
      }
    });

    const count = document.createElement('span');
    count.className='count';
    count.setAttribute('aria-hidden','true');
    count.textContent = cells[i];
    btn.appendChild(count);

    const stones = document.createElement('div');
    stones.className='stones ' + (ownerOf(i)==='human' ? 'humanStones' : 'aiStones');
    stones.setAttribute('aria-hidden','true');

    // Minimal-modern görünüm için en fazla 4 taş ikonu gösterilir.
    // Taşlar düzenli dizilmez; hafif üst üste yığılmış görünür.
    const show = Math.min(cells[i], 4);
    const pileLayouts = [
      [
        {left:7, top:8, rot:-12},
        {left:18, top:4, rot:11},
        {left:10, top:18, rot:7},
        {left:22, top:16, rot:-8},
      ],
      [
        {left:9, top:6, rot:-8},
        {left:21, top:7, rot:14},
        {left:13, top:18, rot:-10},
        {left:24, top:15, rot:6},
      ],
      [
        {left:8, top:7, rot:-15},
        {left:20, top:5, rot:7},
        {left:11, top:17, rot:4},
        {left:22, top:18, rot:-12},
      ],
      [
        {left:10, top:5, rot:-6},
        {left:22, top:8, rot:12},
        {left:8, top:18, rot:-11},
        {left:20, top:17, rot:5},
      ],
    ];
    const pile = pileLayouts[i % pileLayouts.length];
    for(let s=0;s<show;s++){
      const stone = document.createElement('span');
      stone.className='stone';
      const pos = pile[s];
      stone.style.left = pos.left + 'px';
      stone.style.top = pos.top + 'px';
      stone.style.transform = 'rotate(' + pos.rot + 'deg)';
      stone.style.zIndex = String(s + 1);
      stones.appendChild(stone);
    }
    if(cells[i]>4){
      const more = document.createElement('span');
      more.className='more';
      more.textContent='+'+(cells[i]-4);
      stones.appendChild(more);
    }
    btn.appendChild(stones);

    btn.addEventListener('click', ()=>cellClicked(i));
    boardEl.appendChild(btn);
  }

  youScoreEl.textContent = score.human;
  aiScoreEl.textContent = score.ai;
  turnEl.textContent = gameMode==='local'
    ? (current==='human' ? t('player1').toUpperCase() : t('player2').toUpperCase())
    : (current==='human' ? t('yourTurn') : t('computer').toUpperCase());
  turnEl.style.color = current==='human' ? 'var(--you)' : 'var(--ai)';
}

function cellClicked(i){
  if(gameOver) return;
  if(!isControlledByPerson(current)) return;

  // Hamlenin devamında rakibin tarafı dahil parlayan tüm geçerli haneler seçilebilir.
  if((waitingMode==='branch' || waitingMode==='source-start') && pendingChoice && choiceCells.includes(i)){
    const opt = pendingChoice.options.find(o => o.cell===i);
    if(!opt) return;

    const resolve = pendingChoice.resolve;
    pendingChoice = null;
    choiceCells = [];
    waitingMode = '';
    locked = true;
    render();
    resolve(opt);
    return;
  }

  // Yeni hamle yalnız oyuncunun kendi tarafındaki hanelerinden başlar.
  if(waitingMode==='source'){
    if(locked) return;
    if(ownerOf(i)!==current || cells[i]===0) return;
    runControlledMove(i);
  }
}

function getCellCenter(i){
  const cell = boardEl.querySelectorAll('.cell')[i];
  if(!cell) return {x:0,y:0};
  const cellRect = cell.getBoundingClientRect();
  const wrapRect = boardWrap.getBoundingClientRect();
  return {
    x: cellRect.left - wrapRect.left + cellRect.width/2,
    y: cellRect.top - wrapRect.top + cellRect.height/2
  };
}

function showHand(show=true){
  if(show) handEl.classList.add('show');
  else handEl.classList.remove('show');
}
function setHandCount(n){ handCountEl.textContent = n; }
async function moveHandTo(i, count, pop=false){
  const generation = gameGeneration;
  const p = getCellCenter(i);
  handEl.style.left = p.x+'px';
  handEl.style.top = p.y+'px';
  if(pop) handEl.style.transform = 'translate(-50%,-50%) scale(1.12)';
  setHandCount(count);
  showHand(true);
  await sleep(pop ? 190 : 240);
  if(!generationAlive(generation)){
    showHand(false);
    return false;
  }
  handEl.style.transform = 'translate(-50%,-50%) scale(1)';
  return true;
}
async function pickupFrom(i, count){
  tone(280,.05,.02,'triangle');
  await moveHandTo(i, count, true);
}
async function putStoneTo(i, remainingInHand){
  tone(520 + (remainingInHand%5)*25,.035,.014,'sine');
  await moveHandTo(i, remainingInHand, false);
}

function connectedNeighbors(cell){
  const r=rowOf(cell), c=colOf(cell);
  const opts=[];

  // Her satır kendi içinde yatay bağlıdır.
  if(c>0) opts.push({cell:idx(r,c-1)});
  if(c<boardCols-1) opts.push({cell:idx(r,c+1)});

  // Satırlar arası geçiş yalnızca sol ve sağ kenarlardan yapılabilir.
  if(c===0 || c===boardCols-1){
    if(r>0) opts.push({cell:idx(r-1,c)});
    if(r<BOARD_ROWS-1) opts.push({cell:idx(r+1,c)});
  }
  return opts;
}

function getStartOptions(source){
  // Hamle başladıktan sonra taşların hangi oyuncunun bölgesinde olduğu önemli değildir.
  // İlk adımda da tahtadaki gerçek komşuluk yolları kullanılır.
  return connectedNeighbors(source);
}

function nextOptions(cell, previousCell){
  const opts=connectedNeighbors(cell);

  // Oyun sırasında tek yasak, geldiğimiz haneye anında geri dönmektir.
  // Böylece 10→9 sonrasında 9'dan 5 veya 13; 9'a 5'ten gelindiyse
  // 5'ten 1 veya 6 seçilebilir.
  if(previousCell===null || previousCell===undefined) return opts;
  return opts.filter(o=>o.cell!==previousCell);
}

function cancelPendingChoice(){
  if(!pendingChoice) return;
  const resolve = pendingChoice.resolve;
  pendingChoice = null;
  choiceCells = [];
  waitingMode = '';
  try{ resolve(null); }catch(e){}
}

async function askChoice(options, text, mode){
  statusEl.textContent = text;
  waitingMode = mode;
  choiceCells = options.map(o=>o.cell);

  // Genel hamle sürüyor olsa da rota seçimi için bütün parlayan haneler
  // (rakibin tarafındakiler dahil) dokunulabilir olmalıdır.
  locked = false;
  render();

  return await new Promise(resolve=>{
    pendingChoice = {resolve, options};
  });
}

async function humanChooser(currentCell, previousCell, options){
  if(options.length===1) return options[0];
  const firstStep = previousCell===null;
  const who = gameMode==='local' ? sideName(current) + ': ' : '';
  const text = firstStep ? who + t('firstRoute') : who + t('branch');
  return await askChoice(options, text, firstStep ? 'source-start' : 'branch');
}

function makeAIPlanChooser(path){
  let k=0;
  return async function(currentCell, previousCell, options){
    const target = path[k];
    const found = options.find(o=>o.cell===target);
    if(found){ k++; return found; }
    if(options.length===1) return options[0];
    k++;
    return options[0];
  }
}

async function captureColumn(player, col, landingCell, generation=gameGeneration){
  captureCol = col;
  render();
  await sleep(250);
  if(!generationAlive(generation) || gameOver) return false;

  // Son taşın düştüğü boş hane korunur; o taş masada kalır.
  // Aynı sütundaki diğer hanelerde bulunan taşlar toplanır.
  let total = 0;
  for(let r=0;r<BOARD_ROWS;r++){
    const cell = idx(r,col);
    if(cell === landingCell) continue;
    total += cells[cell];
  }

  score[player] += total;
  if(total>0) tone(760,.12,.04,'triangle');

  for(let r=0;r<BOARD_ROWS;r++){
    const cell = idx(r,col);
    if(cell === landingCell) continue;
    cells[cell] = 0;
  }

  statusEl.textContent = (gameMode==='single' && player==='human')
    ? t('captureYou',{n:total})
    : t('captureOther',{name:sideName(player),n:total});
  render();
  await sleep(480);
  if(!generationAlive(generation) || gameOver) return false;
  captureCol = -1;
  return true;
}

function moveStateKey(hand, currentCell, previousCell){
  return hand + '|' + currentCell + '|' + (previousCell ?? -1) + '|' + cells.join(',');
}

async function executeMove(player, source, chooser, generation=gameGeneration){
  const boardSnapshot = cells.slice();
  const scoreSnapshot = {...score};

  selectedSource = source;
  lastIndex = -1;
  render();

  let hand = cells[source];
  cells[source] = 0;
  render();

  await pickupFrom(source, hand);
  if(!generationAlive(generation) || gameOver) return false;

  let currentCell = source;
  let previousCell = null;
  const stateVisits = new Map();

  // Uzun fakat geçerli zincirler sabit bir adım veya Map boyutu tavanıyla kesilmez.
  // Birebir aynı hamle durumu üçüncü kez görülürse gerçek tekrar döngüsü kabul edilir.
  // Bu Map yalnızca tek hamle boyunca yaşar ve hamle bitince tamamen serbest bırakılır.
  while(true){
    while(hand > 0){
      if(!generationAlive(generation) || gameOver) return false;

      const key = moveStateKey(hand, currentCell, previousCell);
      const visits = (stateVisits.get(key) || 0) + 1;
      stateVisits.set(key, visits);

      if(visits >= 3){
        selectedSource = -1;
        showHand(false);
        finish('cycleDraw');
        return false;
      }

      const options = nextOptions(currentCell, previousCell);
      if(options.length===0){
        // Bu grafikte teorik olarak ulaşılamaz. Yine de state bozulmasın.
        cells = boardSnapshot.slice();
        score = {...scoreSnapshot};
        selectedSource = -1;
        lastIndex = -1;
        showHand(false);
        statusEl.textContent = t('rollback');
        render();
        return false;
      }

      const chosen = await chooser(currentCell, previousCell, options, hand);
      if(!generationAlive(generation) || !chosen || gameOver) return false;

      const dest = chosen.cell;
      const wasEmpty = cells[dest]===0;

      await putStoneTo(dest, hand-1);
      if(!generationAlive(generation) || gameOver) return false;

      cells[dest]++;
      hand--;
      previousCell = currentCell;
      currentCell = dest;
      lastIndex = dest;
      render();
      await sleep(180);
      if(!generationAlive(generation) || gameOver) return false;

      if(hand===0){
        if(wasEmpty){
          showHand(false);
          const captured = await captureColumn(player, colOf(dest), dest, generation);
          if(!captured || !generationAlive(generation) || gameOver) return false;
          selectedSource = -1;
          render();
          return true;
        }else{
          hand = cells[dest];
          cells[dest] = 0;
          render();
          await sleep(180);
          if(!generationAlive(generation) || gameOver) return false;
          await pickupFrom(dest, hand);
          if(!generationAlive(generation) || gameOver) return false;
          statusEl.textContent = (gameMode==='single' && player==='human')
            ? t('fullYou')
            : t('fullOther',{name:sideName(player)});
        }
      }
    }
  }
  return false;
}

function totalOnBoard(){ return cells.reduce((a,b)=>a+b,0); }
function hasMove(player){
  for(let i=0;i<cellCount();i++){
    if(ownerOf(i)===player && cells[i]>0) return true;
  }
  return false;
}

function finish(reason='score'){
  gameOver = true;
  locked = false;
  waitingMode = '';
  choiceCells = [];
  cancelPendingChoice();
  showHand(false);
  tone(880,.18,.05,'triangle');

  let winner=null;
  let text='';

  if(reason==='human24'){
    winner='human';
    text = gameMode==='single'
      ? t('humanTarget',{target:targetScore,h:score.human,a:score.ai})
      : t('otherTarget',{name:sideName('human'),target:targetScore,h:score.human,a:score.ai});
  }else if(reason==='ai24'){
    winner='ai';
    text=t('otherTarget',{name:sideName('ai'),target:targetScore,h:score.human,a:score.ai});
  }else if(reason==='oneEachDraw'){
    text=t('oneEach',{h:score.human,a:score.ai});
  }else if(reason==='cycleDraw'){
    text=t('cycleDraw');
  }else if(reason==='safeDraw'){
    text=t('safeDraw');
  }else if(reason==='humanEmpty'){
    winner='ai';
    text = gameMode==='single'
      ? t('humanEmptyYou',{n:sideCellCount()})
      : t('humanEmptyOther',{name:sideName('human'),n:sideCellCount()});
  }else if(reason==='aiEmpty'){
    winner='human';
    text=t('humanEmptyOther',{name:sideName('ai'),n:sideCellCount()});
  }else{
    if(score.human>score.ai) winner='human';
    else if(score.ai>score.human) winner='ai';
    text=t('scoreLine',{human:sideName('human'),h:score.human,ai:sideName('ai'),a:score.ai});
  }

  resultTitle.textContent = !winner
    ? t('draw')
    : (gameMode==='single'
        ? (winner==='human' ? t('won') : t('computerWon'))
        : t('playerWon',{name:sideName(winner)}));
  resultText.textContent = text;
  overlay.classList.add('show');
  try{ if(window.parent!==window) window.parent.postMessage({type:'TELKIN_TAS_RESULT',winner,reason},'*'); }catch(e){}
  render();
}

function sideStoneCount(player){
  let total=0;
  for(let i=0;i<cellCount();i++){
    if(ownerOf(i)===player) total += cells[i];
  }
  return total;
}

function checkGameOver(){
  if(gameOver) return true;

  // 1) Hedef taşı ilk toplayan kazanır.
  if(score.human>=targetScore){
    finish('human24');
    return true;
  }
  if(score.ai>=targetScore){
    finish('ai24');
    return true;
  }

  // 2) Kilitlenme önleyici beraberlik:
  // Her iki oyuncunun da kendi bölgesinde toplam yalnızca 1'er taş kalırsa oyun berabere biter.
  if(sideStoneCount('human')===1 && sideStoneCount('ai')===1){
    finish('oneEachDraw');
    return true;
  }

  // 3) Kendi bölgesinde hiç taşı kalmayan oyuncu kaybeder.
  if(sideStoneCount('human')===0){
    finish('humanEmpty');
    return true;
  }
  if(sideStoneCount('ai')===0){
    finish('aiEmpty');
    return true;
  }

  // 4) Güvenlik: tahtada hiç taş kalmazsa normal skor karşılaştırması.
  if(totalOnBoard()===0){
    finish('score');
    return true;
  }

  return false;
}

function startControlledTurn(side){
  if(gameOver) return;
  if(checkGameOver()) return;

  if(!hasMove(side)){
    finish(side==='human' ? 'humanEmpty' : 'aiEmpty');
    return;
  }

  current=side;
  locked=false;
  waitingMode='source';
  choiceCells=[];
  selectedSource=-1;

  statusEl.textContent = gameMode==='local'
    ? t('chooseOwnLocal',{name:sideName(side),n:sideCellCount()})
    : t('chooseOwn');
  render();
}

function startHumanTurn(){
  startControlledTurn('human');
}

async function runControlledMove(source){
  const generation = gameGeneration;
  const mover=current;
  locked = true;
  waitingMode = '';
  choiceCells = [];
  render();

  const completed = await executeMove(mover, source, humanChooser, generation);

  if(!generationAlive(generation) || gameOver) return;

  if(!completed){
    current=mover;
    locked=false;
    waitingMode='source';
    choiceCells=[];
    selectedSource=-1;
    render();
    return;
  }

  if(checkGameOver() || !generationAlive(generation)) return;

  const next = mover==='human' ? 'ai' : 'human';
  current=next;
  render();

  if(gameMode==='single' && next==='ai'){
    scheduleForGeneration(aiTurn,700,generation);
  }else{
    scheduleForGeneration(()=>startControlledTurn(next),420,generation);
  }
}

function columnPrizeForEmptyTarget(board, target){
  if(board[target]!==0) return -1;
  const col=colOf(target);
  let total=0;
  for(let r=0;r<BOARD_ROWS;r++){
    const c=idx(r,col);
    if(c!==target) total += board[c];
  }
  return total;
}

function firstLegalAISource(){
  for(let i=0;i<sideCellCount();i++){
    if(cells[i]>0) return i;
  }
  return null;
}

function chooseAISource(){
  const candidates=[];
  for(let i=0;i<sideCellCount();i++){
    if(cells[i]<=0) continue;

    let value=Math.random()*2;
    const starts=getStartOptions(i);

    // Tek taşlı bir hane doğrudan boş hedefe gidebiliyorsa sütun kazancına öncelik ver.
    if(cells[i]===1){
      for(const opt of starts){
        const prize=columnPrizeForEmptyTarget(cells,opt.cell);
        if(prize>=0) value=Math.max(value, prize*50);
      }
    }

    // Çok büyük yığınları sürekli seçip oyunu uzatmasın.
    value += Math.max(0, 8-cells[i])*.25;
    candidates.push({source:i,value});
  }
  candidates.sort((a,b)=>b.value-a.value);
  return candidates.length ? candidates[0].source : null;
}

async function aiLiveChooser(currentCell, previousCell, options, hand){
  const generation = gameGeneration;
  if(options.length===1) return options[0];

  // Bilgisayarın yol ayrımı da görünür olsun.
  choiceCells=options.map(o=>o.cell);
  statusEl.textContent=t('aiBranch');
  render();
  await sleep(120);
  if(!generationAlive(generation) || gameOver) return null;

  let best=options[0];
  let bestValue=-Infinity;

  for(const opt of options){
    let value=Math.random()*3;

    // Eldeki son taşsa boş haneye bırakıp sütundan taş toplamak en güçlü tercih.
    if(hand===1 && cells[opt.cell]===0){
      value += columnPrizeForEmptyTarget(cells,opt.cell)*100 + 500;
    }else{
      // Son taş değilse küçük yığınlara yönelmek çoğu zaman daha kontrollü rota verir.
      value += Math.max(0,10-cells[opt.cell]);
    }

    if(value>bestValue){
      bestValue=value;
      best=opt;
    }
  }

  choiceCells=[];
  render();
  return best;
}


function simSideStoneCount(board, player){
  let total=0;
  for(let i=0;i<cellCount();i++){
    if(ownerOf(i)===player) total += board[i];
  }
  return total;
}


function sampleOneFullMove(state, source, randomness=0.35){
  const board=state.slice();
  let hand=board[source];
  if(hand<=0) return null;

  board[source]=0;
  let currentCell=source;
  let previousCell=null;
  let path=[];
  let captured=0;
  let safety=0;

  while(safety++<220){
    while(hand>0){
      let opts=nextOptions(currentCell, previousCell);
      if(!opts.length) return null;

      let chosen;

      if(opts.length===1){
        chosen=opts[0];
      }else{
        const scored=opts.map(opt=>{
          let v=Math.random()*randomness;

          // Son taşsa boş haneye düşüp sütun toplamak çok değerli.
          if(hand===1 && board[opt.cell]===0){
            const prize=columnPrizeForEmptyTarget(board,opt.cell);
            v += 1000 + Math.max(0,prize)*120;
          }else{
            // Dolu haneye son taş bırakmak yeni bir dağıtım zinciri yaratır.
            // Orta büyüklükte yığınlar çoğu zaman daha kontrollüdür.
            if(hand===1 && board[opt.cell]>0){
              const pickup=board[opt.cell]+1;
              v += 18 - Math.abs(pickup-4)*2;
            }

            // Büyük dolu hücrelere gereksiz taş yığmayı biraz cezalandır.
            v -= board[opt.cell]*0.7;
          }

          // Bilgisayar kendi tarafında en az birkaç taş bırakmaya çalışsın.
          if(ownerOf(opt.cell)==='ai') v += 0.6;

          return {opt,v};
        }).sort((a,b)=>b.v-a.v);

        // Bazen ikinci en iyi rota seçilerek farklı planlar örneklenir.
        if(scored.length>1 && Math.random()<randomness) chosen=scored[1].opt;
        else chosen=scored[0].opt;
      }

      const dest=chosen.cell;
      const wasEmpty=board[dest]===0;

      board[dest]++;
      hand--;
      path.push(dest);

      const old=currentCell;
      currentCell=dest;
      previousCell=old;

      if(hand===0){
        if(wasEmpty){
          const col=colOf(dest);
          for(let r=0;r<BOARD_ROWS;r++){
            const c=idx(r,col);
            if(c===dest) continue;
            captured += board[c];
            board[c]=0;
          }

          return {
            board,
            path,
            captured,
            source,
            endCell:dest
          };
        }else{
          hand=board[dest];
          board[dest]=0;
        }
      }
    }
  }

  return null;
}


function estimateHumanImmediateThreat(board, level){
  let best=0;
  const samples = level==='hard' ? 3 : level==='medium' ? 1 : 1;

  for(let source=sideCellCount();source<cellCount();source++){
    if(board[source]<=0) continue;
    for(let k=0;k<samples;k++){
      const sim=sampleOneFullMove(
        board,
        source,
        level==='easy' ? 0.9 : level==='medium' ? 0.7 : 0.55
      );
      if(sim && sim.captured>best) best=sim.captured;
    }
  }
  return best;
}

function scoreAIPlanHeuristic(plan, level){
  if(!plan) return -1e9;

  let value=0;
  const aiRemain=simSideStoneCount(plan.board,'ai');
  const humanRemain=simSideStoneCount(plan.board,'human');

  if(level==='easy'){
    value += plan.captured*65;
    if(score.ai + plan.captured >= targetScore) value += 5000;
    if(aiRemain===0) value -= 1500;

    // Kolay seviye bilinçli olarak kusursuz oynamaz.
    // Bu rastgelelik hata değil; oyuncuya daha affedici bir rakip üretir.
    value += Math.random()*180;
    return value;
  }

  if(level==='medium'){
    value += plan.captured*105;
    if(score.ai + plan.captured >= targetScore) value += 30000;
    if(aiRemain===0) value -= 30000;
    else value += Math.min(aiRemain,10)*2;
    if(humanRemain===0) value += 22000;
    value += Math.random()*22;
    return value;
  }

  value += plan.captured*140;
  if(score.ai + plan.captured >= targetScore) value += 100000;
  if(aiRemain===0) value -= 100000;
  else value += Math.min(aiRemain,10)*3;
  if(humanRemain===0) value += 80000;
  value -= Math.max(0,plan.path.length-cellCount())*0.4;
  value += Math.random()*4;
  return value;
}

function scoreAIPlanWithThreat(plan, level, threatCache){
  let value = plan.baseValue;
  if(level==='easy') return value;

  const key = plan.board.join(',');
  let humanThreat = threatCache.get(key);
  if(humanThreat===undefined){
    humanThreat = estimateHumanImmediateThreat(plan.board, level);
    threatCache.set(key, humanThreat);
  }

  if(level==='medium'){
    value -= humanThreat*22;
  }else{
    value -= humanThreat*48;
    if(score.human>=Math.floor(targetScore*0.75)) value -= humanThreat*30;
  }
  return value;
}

async function pickSmartAIMove(generation=gameGeneration){
  const candidates=[];
  const samples = difficulty==='easy' ? 6 : difficulty==='medium' ? 8 : 14;
  const randomness = difficulty==='easy' ? 0.95 : difficulty==='medium' ? 0.72 : 0.55;

  for(let source=0;source<sideCellCount();source++){
    if(!generationAlive(generation)) return null;
    if(cells[source]<=0) continue;

    for(let k=0;k<samples;k++){
      const plan=sampleOneFullMove(cells,source,randomness);
      if(!plan) continue;
      plan.baseValue = scoreAIPlanHeuristic(plan,difficulty);
      candidates.push(plan);
    }

    // Uzun hesapta tarayıcıya çizim/dokunma fırsatı ver.
    await yieldToUI();
  }

  if(!generationAlive(generation)) return null;

  if(difficulty==='easy' && candidates.length && Math.random()<0.28){
    const plan = candidates[Math.floor(Math.random()*candidates.length)];
    return {...plan, value:plan.baseValue};
  }

  if(candidates.length){
    candidates.sort((a,b)=>b.baseValue-a.baseValue);
    const shortlistSize = difficulty==='hard' ? 8 : difficulty==='medium' ? 6 : 1;
    const shortlist = candidates.slice(0,shortlistSize);
    const threatCache = new Map();

    let best=null;
    let bestValue=-Infinity;

    for(let i=0;i<shortlist.length;i++){
      if(!generationAlive(generation)) return null;
      const plan = shortlist[i];
      const value=scoreAIPlanWithThreat(plan,difficulty,threatCache);
      if(value>bestValue){
        bestValue=value;
        best={...plan,value};
      }
      if(i%2===1) await yieldToUI();
    }
    if(best) return best;
  }

  const fallbackSource = chooseAISource();
  if(fallbackSource !== null){
    return {source:fallbackSource,path:null,value:-1,captured:0,fallback:true};
  }
  return null;
}

async function aiTurn(){
  const generation = gameGeneration;

  if(gameOver || !generationAlive(generation)) return;
  if(checkGameOver()) return;
  if(aiThinking) return;

  aiThinking = true;
  locked = true;
  current = 'ai';
  waitingMode = '';
  choiceCells = [];
  selectedSource = -1;
  statusEl.textContent = difficulty==='easy'
    ? t('aiThink')
    : difficulty==='medium'
      ? t('aiCalc')
      : t('aiDeep');
  render();

  await sleep(420);
  if(!generationAlive(generation) || gameOver){
    aiThinking=false;
    return;
  }

  if(!hasMove('ai')){
    aiThinking = false;
    finish('aiEmpty');
    return;
  }

  let move = await pickSmartAIMove(generation);
  if(!generationAlive(generation) || gameOver){
    aiThinking=false;
    return;
  }

  // Plan örnekleyici herhangi bir sebeple sonuç vermezse AI asla
  // haksız yere kaybetmez ve kilitli durumda bırakılmaz.
  if(!move && hasMove('ai')){
    let fallbackSource = chooseAISource();

    // Akıllı kaynak seçici beklenmedik biçimde null dönerse bile
    // tahta doğrudan taranarak ilk yasal kaynak bulunur.
    if(fallbackSource === null){
      fallbackSource = firstLegalAISource();
    }

    if(fallbackSource !== null){
      move = {source:fallbackSource,path:null,value:-1,captured:0,fallback:true};
    }
  }

  if(!move){
    aiThinking = false;

    if(!hasMove('ai')){
      finish('aiEmpty');
    }else{
      // Bu dal normal oyun grafında oluşmamalıdır. Yine de kullanıcıyı
      // sonsuza kadar kilitlemek yerine adil ve güvenli bir sonuç üretir.
      locked = false;
      waitingMode = '';
      finish('safeDraw');
    }
    return;
  }

  statusEl.textContent = move.fallback
    ? t('aiRoute')
    : (move.captured>0 ? t('aiCapturePlan') : t('aiDefense'));
  render();

  await sleep(170);
  if(!generationAlive(generation) || gameOver){
    aiThinking=false;
    return;
  }

  const chooser = move.fallback ? aiLiveChooser : makeAIPlanChooser(move.path);
  const completed = await executeMove('ai', move.source, chooser, generation);

  aiThinking = false;
  choiceCells = [];

  if(!generationAlive(generation) || gameOver) return;

  if(!completed){
    current='ai';
    locked=true;
    statusEl.textContent=t('aiRecalc');
    render();
    scheduleForGeneration(aiTurn,320,generation);
    return;
  }

  if(checkGameOver() || !generationAlive(generation)) return;
  startHumanTurn();
}


function updateDifficultyButtons(){
  document.querySelectorAll('.diffBtn').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.level===difficulty);
  });
}

document.querySelectorAll('.diffBtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    if(aiThinking || current==='ai') return;
    difficulty=btn.dataset.level;
    updateDifficultyButtons();
    savePreferences();
    updateModeUI();
    statusEl.textContent =
      difficulty==='easy' ? t('diffEasy') :
      difficulty==='medium' ? t('diffMedium') :
      t('diffHard');
  });
});

function reset(launchTurn=true){
  gameGeneration++;
  cancelPendingChoice();
  gameOver = false;
  pausedBoardConfig = null;
  updateThemeUI();
  updateStoneStyleUI();
  updateGameConfigUI();
  cells = Array(cellCount()).fill(stonesPerHouse);
  score = {human:0, ai:0};
  locked = false;
  selectedSource = -1;
  choiceCells = [];
  lastIndex = -1;
  captureCol = -1;
  pendingChoice = null;
  aiThinking = false;
  overlay.classList.remove('show');
  showHand(false);
  updateDifficultyButtons();
  updateModeUI();

  if(!launchTurn){
    current = 'human';
    waitingMode = 'source';
    statusEl.textContent = t('chooseStart');
    render();
    return;
  }

  const starter = resolveStartingSide();
  current = starter;

  if(gameMode==='single' && starter==='ai'){
    locked = true;
    waitingMode = '';
    statusEl.textContent = startPreference==='random' ? t('randomAI') : t('aiStarts');
    render();
    scheduleForGeneration(aiTurn,650,gameGeneration);
    return;
  }

  locked = false;
  waitingMode = 'source';
  statusEl.textContent = gameMode==='local'
    ? (startPreference==='random'
        ? t('randomLocal',{name:sideName(starter),n:sideCellCount()})
        : t('localStarts',{name:sideName(starter),n:sideCellCount()}))
    : (startPreference==='random' ? t('randomYou') : t('youStart'));
  render();
}

function startGame(mode){
  gameMode=mode;
  gameStarted=true;
  gameOver=false;
  pausedBoardConfig=null;
  menuOverlay.classList.remove('show');
  infoOverlay.classList.remove('show');
  reset(true);
}

function moveInProgress(){
  if(gameOver) return false;
  return aiThinking || locked || waitingMode==='branch' || waitingMode==='source-start';
}

function updateContinueButton(){
  if(!continueBtn) return;
  continueBtn.style.display = (gameStarted && !gameOver) ? 'block' : 'none';
}

function showMenu(){
  // Sonuç kartı açıksa normal menü akışına girmeden önce onu kapat.
  // Böylece iki overlay hiçbir zaman üst üste kalmaz.
  if(gameOver && overlay.classList.contains('show')){
    showResultMenu();
    return;
  }

  if(moveInProgress()){
    statusEl.textContent = t('moveMenu');
    return;
  }

  pausedBoardConfig = (gameStarted && !gameOver)
    ? {boardCols, stonesPerHouse}
    : null;

  updateContinueButton();
  menuOverlay.classList.add('show');
}

function continueGame(){
  if(!gameStarted || gameOver) return;

  if(pausedBoardConfig){
    boardCols = pausedBoardConfig.boardCols;
    stonesPerHouse = pausedBoardConfig.stonesPerHouse;
    pausedBoardConfig = null;
    updateGameConfigUI();
    render();
  }

  menuOverlay.classList.remove('show');
}

function requestNewGame(){
  if(moveInProgress()){
    statusEl.textContent = t('moveNew');
    return;
  }
  gameStarted=true;
  reset(true);
}

function showResultMenu(){
  overlay.classList.remove('show');
  pausedBoardConfig = null;
  updateContinueButton();
  menuOverlay.classList.add('show');
}

document.getElementById('singleBtn').addEventListener('click',()=>startGame('single'));
document.getElementById('localBtn').addEventListener('click',()=>startGame('local'));
if(continueBtn) continueBtn.addEventListener('click', continueGame);
if(resultMenuBtn) resultMenuBtn.addEventListener('click', showResultMenu);

document.getElementById('settingsBtn').addEventListener('click',()=>{
  infoTitle.textContent=t('settingsTitle');
  infoBody.innerHTML=`
    <div class="settingRow">
      <div><strong>${t('sounds')}</strong><br><span style="color:var(--muted);font-size:12px">${t('soundsDesc')}</span></div>
      <button class="toggleBtn ${soundEnabled?'on':''}" id="soundToggle">${soundEnabled?t('on'):t('off')}</button>
    </div>
    <div class="settingRow">
      <div><strong>${t('theme')}</strong><br><span style="color:var(--muted);font-size:12px">${t('themeDesc')}</span></div>
      <span style="font-weight:950">${themeInfo().name}</span>
    </div>
    <div class="settingRow">
      <div><strong>${t('stoneStyle')}</strong><br><span style="color:var(--muted);font-size:12px">${t('stoneStyleDesc')}</span></div>
      <span style="font-weight:950">${stoneStyleInfo().name}</span>
    </div>
    <div class="settingRow">
      <div><strong>${t('gameType')}</strong><br><span style="color:var(--muted);font-size:12px">${t('gameTypeDesc',{cols:boardCols,rows:BOARD_ROWS,stones:stonesPerHouse})}</span></div>
      <span style="font-weight:950">${targetScore} ${t('stoneUnit')}</span>
    </div>
    <div class="settingRow">
      <div><strong>${t('defaultAI')}</strong><br><span style="color:var(--muted);font-size:12px">${t('defaultAIDesc')}</span></div>
      <span style="font-weight:950">${difficultyName(difficulty,true)}</span>
    </div>
    <div class="settingRow">
      <div><strong>${t('startPref')}</strong><br><span style="color:var(--muted);font-size:12px">${t('startPrefDesc')}</span></div>
      <span style="font-weight:950">${startPreferenceName()}</span>
    </div>

    <button class="backBtn rulesInsideSettings" id="showRulesInsideSettings">${t('showRules')}</button>
    <div id="settingsRulesPanel" style="display:none;margin-top:12px">
      <p class="sub" style="margin-bottom:10px">${t('rulesIntro')}</p>
      <ol class="ruleList">
        <li>${t('rule1')}</li>
        <li>${t('rule2')}</li>
        <li>${t('rule3')}</li>
        <li>${t('rule4')}</li>
        <li>${t('rule5')}</li>
        <li>${t('rule6')}</li>
        <li>${t('rule7',{target:targetScore})}</li>
        <li>${t('rule8')}</li>
        <li>${t('rule9')}</li>
        <li>${t('rule10')}</li>
      </ol>
    </div>`;

  infoOverlay.classList.add('show');

  setTimeout(()=>{
    const soundBtn=document.getElementById('soundToggle');
    if(soundBtn) soundBtn.addEventListener('click',()=>{
      soundEnabled=!soundEnabled;
      savePreferences();
      soundBtn.textContent=soundEnabled?t('on'):t('off');
      soundBtn.classList.toggle('on',soundEnabled);
      if(soundEnabled) tone(600,.07,.03,'triangle');
    });

    const rulesBtn=document.getElementById('showRulesInsideSettings');
    const rulesPanel=document.getElementById('settingsRulesPanel');
    if(rulesBtn && rulesPanel){
      rulesBtn.addEventListener('click',()=>{
        const hidden = rulesPanel.style.display==='none';
        rulesPanel.style.display = hidden ? 'block' : 'none';
        rulesBtn.textContent = hidden ? t('hideRules') : t('showRules');
      });
    }
  },0);
});

document.getElementById('infoBack').addEventListener('click',()=>{
  infoOverlay.classList.remove('show');
});

document.getElementById('newGame').addEventListener('click', requestNewGame);
document.getElementById('menuBtn').addEventListener('click', showMenu);
document.getElementById('again').addEventListener('click',()=>{ gameStarted=true; reset(true); });

// First launch starts in the main menu. Restore local preferences first.
loadPreferences();
setLanguage(currentLanguage,false);
gameStarted=false;
reset(false);
updateContinueButton();
menuOverlay.classList.add('show');

// TAŞ STRATEJİ v31 PRODUCTION POLISH — TR/EN/DE/ES/FR/PT-BR/AR
</script>

<script>
window.addEventListener('message',function(e){
  const d=e.data||{}; if(d.type!=='TELKIN_TAS_CONFIG') return;
  try{
    setLanguage('tr',false);
    boardCols=[4,5,6].includes(+d.cols)?+d.cols:4;
    stonesPerHouse=[3,4,5,6].includes(+d.stones)?+d.stones:3;
    difficulty=['easy','medium','hard'].includes(d.difficulty)?d.difficulty:'medium';
    startPreference='first'; gameMode='single'; soundEnabled=false; appTheme='neon'; stoneStyle='minimal';
    updateGameConfigUI(); updateDifficultyButtons(); updateStoneStyleUI(); updateThemeUI();
    startGame('single');
  }catch(err){ try{parent.postMessage({type:'TELKIN_TAS_ERROR',message:String(err)},'*')}catch(_){} }
});
try{parent.postMessage({type:'TELKIN_TAS_READY'},'*')}catch(e){}
</script>
</body>
</html>
