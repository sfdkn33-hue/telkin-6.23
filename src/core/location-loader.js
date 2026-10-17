// TELKİN v6.12 · lazy location pack loader · procedural placeholder fetch guard
(()=>{
  const cache=new Map();
  const packs=()=>window.TELKIN_LOCATION_PACKS||{};
  const canFetch=()=>location.protocol==='http:'||location.protocol==='https:';
  function get(loc){return packs()[loc]||null;}
  function hasExternalScene(p){return !!(p&&p.scene&&p.status!=='procedural');}
  function urlFor(loc){const p=get(loc);return hasExternalScene(p)?p.scene:null;}
  async function load(loc){
    const p=get(loc);if(!p)return null;
    if(cache.has(loc))return cache.get(loc);
    const job=(async()=>{
      // Procedural-only packs intentionally have reserved future asset paths. Do not 404-fetch them.
      if(!hasExternalScene(p))return {manifest:p,scene:null,offline:!canFetch(),procedural:true};
      if(!canFetch())return {manifest:p,scene:null,offline:true};
      try{
        const r=await fetch(p.scene,{cache:'no-cache'});
        if(!r.ok)throw new Error('HTTP '+r.status);
        const scene=await r.json();
        return {manifest:p,scene,offline:false};
      }catch(error){
        console.warn('[TELKİN LOCATION PACK]',loc,error);
        return {manifest:p,scene:null,error:String(error&&error.message||error)};
      }
    })();
    cache.set(loc,job);return job;
  }
  function preload(loc){
    const run=()=>load(loc);
    if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:900}); else setTimeout(run,40);
  }
  function clear(loc){if(loc)cache.delete(loc);else cache.clear();}
  window.TELKIN_LOCATION_LOADER={get,urlFor,load,preload,clear,cache,supportsGLTF:false,version:'6.12.0'};
})();
