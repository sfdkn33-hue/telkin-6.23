/* v4.3.0 SİNEMATİK ROMAN: cutscene sprite trim/normalize. Karakter, gerçek kırpma bitmeden görünmez. */
(()=>{
 const cache=new Map();
 function done(img){img.dataset.trimmed='1'}
 function applyPrepared(img,u){
   if(!u){done(img);return}
   const pre=new Image();
   pre.onload=()=>{img.src=u;done(img)};
   pre.onerror=()=>done(img);
   pre.src=u;
 }
 function trim(img){
   if(!img||img.dataset.trimmed==='1'||img.dataset.trimming==='1')return;
   img.dataset.trimming='1';
   const key=img.getAttribute('src')||'';
   if(!key){done(img);return}
   if(cache.has(key)){applyPrepared(img,cache.get(key));return}
   const run=()=>{
     try{
       const w=img.naturalWidth,h=img.naturalHeight;if(!w||!h){done(img);return}
       const c=document.createElement('canvas');c.width=w;c.height=h;
       const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
       const d=g.getImageData(0,0,w,h).data;let x0=w,x1=-1,y0=h,y1=-1;
       // 2px tarama mobilde yeterli; saç/ayakkabı gibi ince uçlar için sonradan 4px pay eklenir.
       for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2)if(d[(y*w+x)*4+3]>14){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
       if(x1<0){cache.set(key,null);done(img);return}
       x0=Math.max(0,x0-4);y0=Math.max(0,y0-4);x1=Math.min(w-1,x1+4);y1=Math.min(h-1,y1+4);
       const cw=x1-x0+1,ch=y1-y0+1;
       if(cw>w*.985&&ch>h*.985){cache.set(key,null);done(img);return}
       const o=document.createElement('canvas');o.width=cw;o.height=ch;o.getContext('2d').drawImage(c,x0,y0,cw,ch,0,0,cw,ch);
       const u=o.toDataURL('image/png');cache.set(key,u);applyPrepared(img,u);
     }catch(e){console.warn('[TELKİN cutscene trim]',e);cache.set(key,null);done(img)}
   };
   if(img.complete&&img.naturalWidth)run();
   else{
     img.addEventListener('load',run,{once:true});
     img.addEventListener('error',()=>done(img),{once:true});
   }
 }
 window.TELKIN_TRIM_ACTOR=trim;
 const root=document.getElementById('cutStage');
 if(root&&window.MutationObserver)new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.matches&&n.matches('img.cutActor'))trim(n);else if(n.querySelectorAll)n.querySelectorAll('img.cutActor').forEach(trim)}}).observe(root,{childList:true,subtree:true});
})();

/* v6.22.7 HOTFIX
   - Hızlı menüde BÖLÜM SEÇ düğmesi gerçek pointerdown akışına bağlanır.
   - Eren'in oyun içi billboard oranı Mahir ile daha tutarlı yetişkin ölçüsüne çekilir.
   - Görünen sürüm etiketi 6.22.7 olarak güncellenir.
*/
(()=>{
 const VERSION='6.22.7';

 function dispatchPointerDown(el,src){
   if(!el)return;
   try{
     if(typeof PointerEvent==='function'){
       el.dispatchEvent(new PointerEvent('pointerdown',{
         bubbles:true,cancelable:true,isPrimary:true,
         pointerId:src?.pointerId||1,pointerType:src?.pointerType||'touch',
         clientX:src?.clientX||0,clientY:src?.clientY||0
       }));
     }else el.dispatchEvent(new Event('pointerdown',{bubbles:true,cancelable:true}));
   }catch(_){el.dispatchEvent(new Event('pointerdown',{bubbles:true,cancelable:true}));}
 }

 // game.js hızlı menüde chaptersBtn.click() çağırıyor; gerçek bölüm düğmesi ise pointerdown dinliyor.
 // Orijinal handler menüyü kapattıktan sonra panel hâlâ kapalıysa doğru olayı doğrudan gönder.
 const quick=document.getElementById('hudQuickMenu');
 const quickChapters=quick?.querySelector('[data-open="chapters"]');
 const chaptersBtn=document.getElementById('chaptersBtn');
 const chaptersPanel=document.getElementById('chaptersPanel');
 if(quickChapters&&chaptersBtn){
   quickChapters.addEventListener('pointerdown',e=>{
     setTimeout(()=>{
       const open=chaptersPanel && (chaptersPanel.classList.contains('show')||chaptersPanel.getAttribute('aria-hidden')==='false');
       if(!open)dispatchPointerDown(chaptersBtn,e);
     },0);
   });
 }

 // İlk bölümde görülen Eren için çocuk/minyatür hissini azalt; Mahir'e yakın yetişkin silueti koru.
 const eren=window.TELKIN_CHARACTER_PACKS?.['EREN'];
 if(eren){
   eren.scale=Math.max(Number(eren.scale)||1,1.04);
   eren.widthRatio=Math.max(Number(eren.widthRatio)||.42,.45);
   eren.artNote=(eren.artNote||'')+' · v6.22.7 adult proportion hotfix';
 }

 const badge=document.getElementById('versionBadge');
 if(badge)badge.textContent=`v${VERSION} · MENÜ + KARAKTER HOTFIX`;
 const menuVersion=quick?.querySelector('.hudMenuVersion');
 if(menuVersion)menuVersion.textContent=menuVersion.textContent.replace(/v6\.22\.6/g,`v${VERSION}`);
 document.title=document.title.replace(/v6\.22\.6/g,`v${VERSION}`);
 window.TELKIN_HOTFIX_VERSION=VERSION;
})();
