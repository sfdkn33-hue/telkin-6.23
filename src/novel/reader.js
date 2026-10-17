(()=> {
'use strict';

const manifestUrl='novel/index.json';
const T=(k,f,v)=>window.TELKIN_I18N?.t(k,f,v)||f||k;
const N=n=>window.TELKIN_I18N?.number(n)||Number(n).toLocaleString('tr-TR');
let manifestPromise=null;
const chapterCache=new Map();

function esc(v){
  return String(v??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

async function getManifest(){
  if(!manifestPromise){
    manifestPromise=fetch(manifestUrl,{cache:'no-cache'}).then(r=>{
      if(!r.ok) throw new Error(T('reader.loadIndexError','Roman dizini yüklenemedi: {status}',{status:r.status}));
      return r.json();
    });
  }
  return manifestPromise;
}

async function resolveChapter(n){
  const m=await getManifest();
  for(const vol of (m.volumes||[])){
    const meta=(vol.chapters||[]).find(x=>Number(x.chapter)===Number(n));
    if(meta) return {manifest:m,volume:vol,meta};
  }
  return null;
}

async function load(n){
  n=Number(n);
  if(chapterCache.has(n)) return chapterCache.get(n);
  const found=await resolveChapter(n);
  if(!found) throw new Error(T('reader.missing','Bu bölümün tam roman metni henüz eklenmedi.'));
  const url='novel/'+found.meta.path;
  const promise=fetch(url,{cache:'no-cache'}).then(r=>{
    if(!r.ok) throw new Error(T('reader.loadChapterError','Bölüm metni yüklenemedi: {status}',{status:r.status}));
    return r.json();
  }).then(data=>({...data,_meta:found.meta,_volume:found.volume}));
  chapterCache.set(n,promise);
  return promise;
}

async function has(n){
  try{return !!(await resolveChapter(n));}
  catch(_){return false;}
}

function renderParagraphs(paragraphs){
  return (paragraphs||[]).map((p,i)=>{
    const txt=esc(p);
    const cls=(/^["“]/.test(String(p).trim()) || /^[A-ZÇĞİÖŞÜ][^.!?]{0,28}:/.test(String(p).trim()))
      ? 'novelDialogue':'';
    return `<p class="${cls}" data-p="${i+1}">${txt}</p>`;
  }).join('');
}

function attachReaderTools(container){
  const article=container.querySelector('.novelReader');
  if(!article) return;
  let size=Number(localStorage.getItem('telkinReaderSize')||100);
  const apply=()=>{article.style.setProperty('--readerScale',String(size/100));};
  apply();

  const minus=container.querySelector('[data-reader-minus]');
  const plus=container.querySelector('[data-reader-plus]');
  const top=container.querySelector('[data-reader-top]');
  const progress=container.querySelector('.novelReadProgress i');

  minus?.addEventListener('click',()=>{
    size=Math.max(82,size-6);localStorage.setItem('telkinReaderSize',size);apply();
  });
  plus?.addEventListener('click',()=>{
    size=Math.min(136,size+6);localStorage.setItem('telkinReaderSize',size);apply();
  });
  top?.addEventListener('click',()=>{
    const panel=document.getElementById('storyPanel');
    if(panel) panel.scrollTo({top:0,behavior:'smooth'});
  });

  const panel=document.getElementById('storyPanel');
  if(panel && progress){
    const update=()=>{
      const max=Math.max(1,panel.scrollHeight-panel.clientHeight);
      const pct=Math.min(100,Math.max(0,(panel.scrollTop/max)*100));
      progress.style.width=pct.toFixed(1)+'%';
    };
    panel.addEventListener('scroll',update,{passive:true});
    update();
  }
}

async function render(container,chapter){
  const data=await load(chapter.n);
  const meta=data._meta||{};
  const vol=data._volume||{};
  container.innerHTML=`
    <article class="novelReader">
      <div class="novelReadProgress" aria-hidden="true"><i></i></div>
      <div class="novelBookMeta">
        <span>${esc(data.volumeTitle||vol.title||'TELKİN')}</span>
        <span>${esc(T('reader.chapter','BÖLÜM'))} ${String(data.chapter).padStart(3,'0')} / 144</span>
        <span>${esc(T('reader.fullText','TAM ROMAN METNİ'))}</span>
        <span class="novelContentLang">${esc(T('reader.contentLanguage','ROMAN DİLİ: TÜRKÇE'))}</span>
      </div>
      <h1>${esc(data.title)}</h1>
      <div class="novelReaderTools">
        <button type="button" data-reader-minus aria-label="${esc(T('reader.smaller','Yazıyı küçült'))}">A−</button>
        <button type="button" data-reader-plus aria-label="${esc(T('reader.larger','Yazıyı büyüt'))}">A+</button>
        <span>${N(meta.wordCount||0)} ${esc(T('reader.word','kelime'))} · ${N(meta.paragraphCount||0)} ${esc(T('reader.paragraph','paragraf'))}</span>
        <button type="button" data-reader-top>${esc(T('reader.top','BAŞA DÖN'))}</button>
      </div>
      <div class="novelText">${renderParagraphs(data.paragraphs)}</div>
      <div class="novelEnd">
        <small>TELKİN · ${esc(T('reader.volume','CİLT'))} ${esc(data.volume||1)}</small>
        <strong>${esc(T('reader.completed','BÖLÜM {chapter} TAMAMLANDI',{chapter:String(data.chapter).padStart(3,'0')}))}</strong>
        <span>${esc(T('reader.sourceNote','Bu metin oyun özeti değil; romanın bu bölümünün tam metnidir.'))}</span>
      </div>
    </article>`;
  attachReaderTools(container);
}

window.TELKIN_NOVEL={
  getManifest, resolveChapter, load, has, render,
  clearCache(){chapterCache.clear();}
};
})();