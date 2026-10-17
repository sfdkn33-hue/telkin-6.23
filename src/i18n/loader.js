(()=>{
'use strict';
const STORAGE_KEY='telkin.lang';
const DEFAULT_LANG='tr';
const clone=o=>o?JSON.parse(JSON.stringify(o)):{};
const merge=(a,b)=>{if(!b||typeof b!=='object')return a;for(const [k,v] of Object.entries(b)){if(v&&typeof v==='object'&&!Array.isArray(v)){a[k]=merge(a[k]&&typeof a[k]==='object'?a[k]:{},v);}else a[k]=v;}return a;};
const readPath=(obj,path)=>String(path||'').split('.').reduce((v,k)=>v&&v[k],obj);
const interpolate=(s,vars)=>String(s).replace(/\{([^}]+)\}/g,(_,k)=>vars&&vars[k]!==undefined?String(vars[k]):`{${k}}`);
const I={
 lang:DEFAULT_LANG,dict:{},fallback:{},manifest:null,ready:null,
 async _json(url){const r=await fetch(url,{cache:'no-cache'});if(!r.ok)throw new Error(`${url}: ${r.status}`);return r.json();},
 async loadManifest(){if(this.manifest)return this.manifest;try{return this.manifest=await this._json('locales/manifest.json');}catch(e){console.warn('[TELKIN i18n manifest]',e);return this.manifest={default:'tr',languages:[{code:'tr',label:'Türkçe'},{code:'en',label:'English'}]};}},
 supported(code){return !!this.manifest?.languages?.some(x=>x.code===code);},
 locale(){return this.dict?.meta?.locale||this.fallback?.meta?.locale||(this.lang==='en'?'en-US':'tr-TR');},
 async load(lang=DEFAULT_LANG){
  await this.loadManifest();lang=this.supported(lang)?lang:DEFAULT_LANG;
  try{
   if(!Object.keys(this.fallback).length)this.fallback=await this._json(`locales/${DEFAULT_LANG}.json`);
   const target=lang===DEFAULT_LANG?clone(this.fallback):await this._json(`locales/${lang}.json`);
   this.dict=merge(clone(this.fallback),target);this.lang=lang;document.documentElement.lang=lang;return this.dict;
  }catch(e){console.warn('[TELKIN i18n]',e);this.dict=clone(this.fallback);this.lang=DEFAULT_LANG;document.documentElement.lang=DEFAULT_LANG;return this.dict;}
 },
 t(path,fallback='',vars=null){let v=readPath(this.dict,path);if(v===undefined)v=readPath(this.fallback,path);if(typeof v!=='string')v=fallback||path;return interpolate(v,vars);},
 value(path,fallback=null){let v=readPath(this.dict,path);if(v===undefined)v=readPath(this.fallback,path);return v===undefined?fallback:v;},
 number(n){try{return Number(n).toLocaleString(this.locale())}catch(_){return String(n)}},
 apply(root=document){
   root.querySelectorAll?.('[data-i18n]').forEach(el=>{const key=el.dataset.i18n,val=this.t(key,el.textContent);if(el.tagName==='INPUT'&&['button','submit'].includes(el.type))el.value=val;else el.textContent=val;});
   root.querySelectorAll?.('[data-i18n-placeholder]').forEach(el=>el.setAttribute('placeholder',this.t(el.dataset.i18nPlaceholder,el.getAttribute('placeholder')||'')));
   root.querySelectorAll?.('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',this.t(el.dataset.i18nAria,el.getAttribute('aria-label')||'')));
   root.querySelectorAll?.('[data-i18n-title]').forEach(el=>el.setAttribute('title',this.t(el.dataset.i18nTitle,el.getAttribute('title')||'')));
 },
 async setLanguage(lang,{persist=true}={}){await this.load(lang);if(persist)try{localStorage.setItem(STORAGE_KEY,this.lang)}catch(_){};this.apply(document);this._syncLanguagePanel();window.dispatchEvent(new CustomEvent('telkin:languagechange',{detail:{lang:this.lang,dict:this.dict}}));return this.lang;},
 _syncLanguagePanel(){
   const btn=document.getElementById('langBtn');if(btn)btn.textContent=this.t('ui.languageButton',this.lang.toUpperCase());
   document.querySelectorAll('[data-set-lang]').forEach(b=>{const on=b.dataset.setLang===this.lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');});
 },
 _installLanguageUI(){
   const btn=document.getElementById('langBtn'),panel=document.getElementById('languagePanel'),close=document.getElementById('languageClose');
   const open=()=>{if(!panel)return;panel.classList.add('show');panel.setAttribute('aria-hidden','false');this._syncLanguagePanel();};
   const shut=()=>{if(!panel)return;panel.classList.remove('show');panel.setAttribute('aria-hidden','true');};
   btn?.addEventListener('click',open);close?.addEventListener('click',shut);panel?.addEventListener('click',e=>{if(e.target===panel)shut();});
   panel?.querySelectorAll('[data-set-lang]').forEach(b=>b.addEventListener('click',async()=>{await this.setLanguage(b.dataset.setLang);this._syncLanguagePanel();}));
   window.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel?.classList.contains('show'))shut();});
 },
 async init(){
   await this.loadManifest();let saved=DEFAULT_LANG;try{saved=localStorage.getItem(STORAGE_KEY)||DEFAULT_LANG}catch(_){}
   await this.load(saved);this.apply(document);this._installLanguageUI();this._syncLanguagePanel();window.dispatchEvent(new CustomEvent('telkin:i18nready',{detail:{lang:this.lang}}));return this;
 }
};
window.TELKIN_I18N=I;I.ready=I.init();
})();
