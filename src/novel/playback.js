(()=>{
'use strict';
const MAP=window.TELKIN_LONG_PLAY_MAP||{};
const root=()=>document.getElementById('longPlayScene');
let open=false,finishCb=null,pages=[],pageIndex=0;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function wordCount(s){return String(s||'').trim().split(/\s+/).filter(Boolean).length;}
function pageParagraphs(paras){
 const out=[];let cur=[],words=0;
 for(const p of paras){const w=wordCount(p);if(cur.length&&(words+w>330||cur.length>=26)){out.push(cur);cur=[];words=0;}cur.push(p);words+=w;if(words>=240&&/[.!?…][”"']?$/.test(String(p).trim())){out.push(cur);cur=[];words=0;}}
 if(cur.length)out.push(cur);return out.length?out:[paras];
}
function close(){if(!open)return;open=false;const r=root();r?.classList.remove('show');r?.setAttribute('aria-hidden','true');document.body.classList.remove('longPlayMode');const cb=finishCb;finishCb=null;pages=[];pageIndex=0;if(cb)setTimeout(cb,0);}
function renderPage(meta){
 const r=root();if(!r)return close();const pg=pages[pageIndex]||[];
 document.getElementById('lpKicker').textContent=`TELKİN · UZUN SÜRÜM · SAHNE ${meta.scene+1}/${meta.sceneCount}`;
 document.getElementById('lpTitle').textContent=`${String(meta.chapter).padStart(3,'0')} · ${meta.title}`;
 document.getElementById('lpLocation').textContent=meta.location||'TELKİN';
 document.getElementById('lpProgress').textContent=`METİN ${meta.paraStart+1}–${meta.paraEnd+1} / ${meta.totalParas} · SAYFA ${pageIndex+1}/${pages.length}`;
 document.getElementById('lpBody').innerHTML=pg.map((p,i)=>`<p${/^\s*[“"]/.test(p)?' class="lpDialogue"':''}>${esc(p).replace(/\n\s*\n/g,'</p><p>').replace(/\n/g,'<br>')}</p>`).join('');
 document.getElementById('lpReadBar').style.width=(100*(pageIndex+1)/Math.max(1,pages.length)).toFixed(1)+'%';
 const next=document.getElementById('lpNext');next.textContent=pageIndex+1<pages.length?'DEVAM ET':'OYUNA DÖN';
 try{r.querySelector('.lpBody').scrollTop=0}catch(_){}
}
async function play(chapter,sceneIndex,location,done){
 const m=MAP[String(chapter?.n||chapter?.chapter||0)],sc=m?.scenes?.[sceneIndex];
 if(!m||!sc||!window.TELKIN_NOVEL){done?.();return;}
 try{
   const data=await window.TELKIN_NOVEL.load(m.chapter);const all=data.paragraphs||[];const paras=all.slice(sc.paragraphStart,sc.paragraphEnd+1);
   if(!paras.length){done?.();return;}
   pages=pageParagraphs(paras);pageIndex=0;finishCb=done;open=true;
   const r=root();r.classList.add('show');r.setAttribute('aria-hidden','false');document.body.classList.add('longPlayMode');
   const meta={chapter:m.chapter,title:data.title||chapter.title||'',scene:sceneIndex,sceneCount:m.sceneCount,location,paraStart:sc.paragraphStart,paraEnd:sc.paragraphEnd,totalParas:m.paragraphCount};
   r.dataset.meta=JSON.stringify(meta);renderPage(meta);
 }catch(e){console.warn('[TELKİN UZUN OYNANIŞ]',e);done?.();}
}
function next(){if(!open)return;let meta={};try{meta=JSON.parse(root()?.dataset.meta||'{}')}catch(_){}if(pageIndex+1<pages.length){pageIndex++;renderPage(meta);}else close();}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('lpNext')?.addEventListener('click',next);document.getElementById('lpSkip')?.addEventListener('click',close);root()?.addEventListener('click',e=>{if(e.target===root())next();});});
window.TELKIN_LONG_PLAY={play,close,isOpen:()=>open,map:MAP};
})();
