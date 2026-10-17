(()=>{
'use strict';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const dbToGain=db=>Math.pow(10,db/20);
const AP=window.TELKIN_AUDIO_PRESETS||{PRESETS:{},SURFACES:{}};

class TelkinAudioManager{
 constructor(){
  this.context=null;this.masterGain=null;this.buses={};this.enabled=false;this.initialized=false;
  this.loops={};this.mediaLoops={};this.buffers=new Map();this.loading=new Map();
  this.manifest=null;this.manifestPromise=null;this.currentMood='warmWork';this.currentLocation='office';
  this.nihyel=false;this.footClock=0;this.lastStepSurface='wood';this.voiceSource=null;this.voiceMedia=null;
  this.volumes={master:.72,ambience:.85,sfx:.92,voice:1,music:.65,ui:.55};this._uiInstalled=false;
 }
 get AudioContextClass(){return window.AudioContext||window.webkitAudioContext;}
 async loadManifest(){
  if(this.manifest)return this.manifest;if(this.manifestPromise)return this.manifestPromise;
  this.manifestPromise=fetch('audio/manifest.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>this.manifest=j).catch(()=>null);
  return this.manifestPromise;
 }
 init(){
  if(this.initialized)return this.context;
  const C=this.AudioContextClass;if(!C)return null;
  const ctx=this.context=new C();
  this.masterGain=ctx.createGain();this.masterGain.gain.value=.0001;this.masterGain.connect(ctx.destination);
  for(const name of ['ambience','sfx','voice','music','ui']){const g=ctx.createGain();g.gain.value=this.volumes[name];g.connect(this.masterGain);this.buses[name]=g;}
  this._buildProceduralAmbience();this._installUIClicks();this.initialized=true;this.loadManifest();return ctx;
 }
 _noiseBuffer(seconds=2){
  const ctx=this.context,n=Math.max(1,Math.floor(ctx.sampleRate*seconds)),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
  let last=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;last=last*.82+w*.18;d[i]=clamp(w*.58+last*.42,-1,1);}return b;
 }
 _loopNoise(name,filterType,freq,q=0){
  const ctx=this.context,src=ctx.createBufferSource();src.buffer=this._noiseBuffer(3);src.loop=true;
  const f=ctx.createBiquadFilter();f.type=filterType;f.frequency.value=freq;f.Q.value=q;const g=ctx.createGain();g.gain.value=.0001;
  src.connect(f);f.connect(g);g.connect(this.buses.ambience);src.start();this.loops[name]={src,g,filter:f,target:.0001};
 }
 _loopTone(name,type,freq){
  const ctx=this.context,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=.0001;o.connect(g);g.connect(this.buses.ambience);o.start();this.loops[name]={src:o,g,target:.0001};
 }
 _buildProceduralAmbience(){
  this._loopNoise('rain','lowpass',2300,.25);this._loopNoise('wind','bandpass',520,.5);this._loopNoise('city','bandpass',900,.35);
  this._loopNoise('water','bandpass',760,.25);this._loopNoise('fire','highpass',1400,.2);this._loopNoise('air','lowpass',5200,.1);
  this._loopTone('hum','sine',54);this._loopTone('cave','sine',31);this._loopTone('dokuA','sine',118);this._loopTone('dokuB','triangle',177.2);
 }
 _installUIClicks(){
  if(this._uiInstalled)return;this._uiInstalled=true;
  document.addEventListener('pointerdown',e=>{const b=e.target?.closest?.('button,[role="button"]');if(!b||b.id==='soundBtn'||!this.enabled)return;this.playSfx('ui_click',{gain:.55});},{capture:true,passive:true});
 }
 async setEnabled(on){
  this.init();if(!this.context)return false;this.enabled=!!on;
  try{if(on&&this.context.state==='suspended')await this.context.resume();}catch(_){ }
  const t=this.context.currentTime;this.masterGain.gain.cancelScheduledValues(t);this.masterGain.gain.setTargetAtTime(on?this.volumes.master:.0001,t,on?.055:.035);return true;
 }
 setMasterVolume(v){this.volumes.master=clamp(v);if(this.masterGain&&this.context&&this.enabled)this.masterGain.gain.setTargetAtTime(this.volumes.master,this.context.currentTime,.06);}
 setBusVolume(name,v){this.volumes[name]=clamp(v);const g=this.buses[name];if(g&&this.context)g.gain.setTargetAtTime(this.volumes[name],this.context.currentTime,.06);}
 suspend(){try{return this.context?.suspend?.()}catch(_){return null}}
 resume(){try{return this.enabled?this.context?.resume?.():null}catch(_){return null}}
 _locationInfo(locationId){
  const id=locationId||'office';const pack=window.TELKIN_LOCATION_PACKS?.[id];const design=window.LOCATION_DESIGN?.[id];const mood=pack?.mood||design?.mood||this._guessMood(id);return{id,mood,pack,design};
 }
 _guessMood(id){
  if(/cave|tomb|cistern/i.test(id))return'cave';if(/hospital|lab|therapy/i.test(id))return'clinical';if(/home|kitchen|apartment/i.test(id))return'warmHome';if(/rain/i.test(id))return'rain';if(/fire|burn/i.test(id))return'fire';if(/river|shore|coast/i.test(id))return'waterNature';return'nightBlue';
 }
 setLocation(locationId,opts={}){
  const info=this._locationInfo(locationId);this.currentLocation=info.id;this.currentMood=opts.mood||info.mood||'warmWork';
  const surface=AP.SURFACES?.[info.id]?.step||opts.surface||this._guessSurface(info.id);this.lastStepSurface=surface;this._applyMood(this.currentMood,opts);return info;
 }
 _guessSurface(id){if(/lab|hospital|school|station|metro/i.test(id))return'tile';if(/home|office|cafe|studio/i.test(id))return'wood';if(/cave|tomb|quarry|ancientCity/i.test(id))return'stone';if(/river|shore|coast|mountain/i.test(id))return'gravel';if(/plain|road|path|camp|village/i.test(id))return'dirt';return'concrete';}
 _applyMood(mood,opts={}){
  if(!this.context)return;const p={...(AP.PRESETS?.[mood]||AP.PRESETS?.warmWork||{}),...(opts.levels||{})};const t=this.context.currentTime;
  const targets={rain:p.rain||0,wind:p.wind||0,city:p.city||0,water:p.water||0,fire:p.fire||0,air:p.air||0,hum:p.hum||0,cave:p.cave||0,dokuA:(p.doku||0)+(this.nihyel?.042:0),dokuB:(p.doku||0)*.7+(this.nihyel?.030:0)};
  for(const [k,v] of Object.entries(targets)){const l=this.loops[k];if(!l)continue;l.target=Math.max(.0001,v);l.g.gain.setTargetAtTime(l.target,t,.34);}
 }
 setNihyel(on){this.nihyel=!!on;if(this.context)this._applyMood(this.currentMood);if(this.enabled)this.playSfx(on?'nihyel_on':'nihyel_off',{gain:.72});}
 update({dt=0,moved=0,sprint=false,locationId=null,mood=null,nihyel=null}={}){
  if(!this.enabled||!this.context)return;if(nihyel!==null&&!!nihyel!==this.nihyel){this.nihyel=!!nihyel;this._applyMood(this.currentMood);}
  if(locationId&&locationId!==this.currentLocation)this.setLocation(locationId,{mood});else if(mood&&mood!==this.currentMood){this.currentMood=mood;this._applyMood(mood);}
  if(moved>.002){this.footClock+=dt;const gap=sprint?.27:.42;if(this.footClock>gap){this.footClock=0;this.playStep({sprint,surface:this.lastStepSurface});}}else this.footClock=Math.min(this.footClock,.2);
 }
 _gain(bus='sfx',gain=1){const ctx=this.context,g=ctx.createGain();g.gain.value=clamp(gain,0,2);g.connect(this.buses[bus]||this.masterGain);return g;}
 _tone({freq=440,endFreq=null,type='sine',duration=.1,gain=.1,bus='sfx',delay=0,attack=.004}={}){
  if(!this.enabled||!this.context)return;const ctx=this.context,t=ctx.currentTime+delay,o=ctx.createOscillator(),g=this._gain(bus,1);o.type=type;o.frequency.setValueAtTime(Math.max(1,freq),t);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(1,endFreq),t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);o.start(t);o.stop(t+duration+.03);
 }
 _noise({duration=.08,gain=.06,bus='sfx',freq=900,type='bandpass',delay=0,q=.5}={}){
  if(!this.enabled||!this.context)return;const ctx=this.context,t=ctx.currentTime+delay,src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=this._gain(bus,1);src.buffer=this._noiseBuffer(Math.max(.08,duration));f.type=type;f.frequency.value=freq;f.Q.value=q;g.gain.setValueAtTime(Math.max(.0002,gain),t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);src.connect(f);f.connect(g);src.start(t);src.stop(t+duration+.02);
 }
 playStep({sprint=false,surface=null}={}){
  if(!this.enabled)return;surface=surface||this.lastStepSurface||'concrete';const base={wood:[145,650],tile:[190,1200],metal:[220,1600],stone:[115,520],gravel:[170,2100],dust:[105,430],dirt:[120,520],concrete:[130,700],carpet:[90,300]}[surface]||[130,700];const strength=sprint?1.18:1;
  this._noise({duration:sprint?.075:.065,gain:.052*strength,freq:base[1],type:'bandpass',q:.7});this._tone({freq:base[0],endFreq:base[0]*.52,type:'triangle',duration:.07,gain:.033*strength});if(surface==='gravel'||surface==='dust'||surface==='dirt')this._noise({duration:.12,gain:.025*strength,freq:2500,type:'highpass',delay:.018});
 }
 playSfx(name,{gain=1}={}){
  if(!this.enabled){return false;}this.init();
  switch(name){
   case'ui_click':this._tone({freq:620,endFreq:510,duration:.045,gain:.022*gain,bus:'ui'});break;
   case'ui_confirm':this._tone({freq:520,endFreq:760,duration:.10,gain:.035*gain,bus:'ui'});this._tone({freq:760,endFreq:980,duration:.09,gain:.026*gain,bus:'ui',delay:.055});break;
   case'door_open':this._noise({duration:.22,gain:.065*gain,freq:430,type:'bandpass'});this._tone({freq:116,endFreq:62,duration:.24,gain:.045*gain});break;
   case'door_close':this._noise({duration:.09,gain:.095*gain,freq:300,type:'lowpass'});this._tone({freq:82,endFreq:48,duration:.13,gain:.058*gain});break;
   case'door_lock':this._tone({freq:1180,endFreq:760,duration:.055,gain:.040*gain});this._noise({duration:.06,gain:.035*gain,freq:1700,type:'bandpass',delay:.035});break;
   case'dice_roll':for(let i=0;i<7;i++){this._noise({duration:.035,gain:(.035+i*.002)*gain,freq:1200+i*130,type:'bandpass',delay:i*.032});this._tone({freq:280+i*28,endFreq:190+i*16,duration:.04,gain:.018*gain,delay:i*.032});}break;
   case'camera_glitch':this._noise({duration:.18,gain:.055*gain,freq:3100,type:'bandpass',q:2});this._tone({freq:140,endFreq:52,duration:.20,gain:.035*gain,type:'sawtooth'});break;
   case'camera_shutter':this._noise({duration:.035,gain:.070*gain,freq:3900,type:'bandpass',q:1.8});this._tone({freq:720,endFreq:410,duration:.045,gain:.032*gain,type:'triangle'});this._noise({duration:.055,gain:.035*gain,freq:1600,type:'highpass',delay:.035});break;
   case'phone':this._tone({freq:740,endFreq:740,duration:.12,gain:.035*gain});this._tone({freq:910,endFreq:910,duration:.12,gain:.025*gain,delay:.14});break;
   case'phone_connect':this._tone({freq:660,endFreq:880,duration:.075,gain:.027*gain});this._tone({freq:880,endFreq:1040,duration:.070,gain:.022*gain,delay:.075});break;
   case'recorder_rec':this._tone({freq:1120,endFreq:1120,duration:.045,gain:.026*gain});this._noise({duration:.045,gain:.018*gain,freq:2300,type:'bandpass',delay:.018});break;
   case'document':this._noise({duration:.10,gain:.040*gain,freq:2600,type:'highpass'});break;
   case'page_flip':this._noise({duration:.16,gain:.032*gain,freq:3400,type:'highpass'});this._noise({duration:.08,gain:.018*gain,freq:1800,type:'bandpass',delay:.07});break;
   case'photo_flip':this._noise({duration:.075,gain:.020*gain,freq:2500,type:'highpass'});break;
   case'anomaly':this._tone({freq:92,endFreq:43,duration:.70,gain:.055*gain,type:'sine'});this._tone({freq:177,endFreq:121,duration:.62,gain:.033*gain,type:'triangle',delay:.04});this._noise({duration:.42,gain:.030*gain,freq:730,type:'bandpass',q:3,delay:.12});break;
   case'nihyel_on':this._tone({freq:118,endFreq:177.2,duration:.55,gain:.038*gain});this._tone({freq:177.2,endFreq:236,duration:.62,gain:.025*gain,delay:.04});break;
   case'nihyel_off':this._tone({freq:177,endFreq:82,duration:.42,gain:.030*gain});break;
   case'arcade_win':this._tone({freq:440,endFreq:660,duration:.12,gain:.04*gain,bus:'ui'});this._tone({freq:660,endFreq:880,duration:.15,gain:.035*gain,bus:'ui',delay:.10});break;
   case'arcade_fail':this._tone({freq:210,endFreq:105,duration:.28,gain:.04*gain,bus:'ui',type:'triangle'});break;
   default:this._tone({freq:360,endFreq:260,duration:.07,gain:.018*gain});break;
  }return true;
 }
 async _loadBuffer(url){
  if(this.buffers.has(url))return this.buffers.get(url);if(this.loading.has(url))return this.loading.get(url);this.init();
  const p=fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.arrayBuffer()}).then(a=>this.context.decodeAudioData(a)).then(b=>{this.buffers.set(url,b);this.loading.delete(url);return b}).catch(e=>{this.loading.delete(url);throw e});this.loading.set(url,p);return p;
 }
 async playFile(url,{bus='sfx',gain=1,loop=false}={}){
  if(!this.enabled)return null;try{const b=await this._loadBuffer(url),s=this.context.createBufferSource(),g=this._gain(bus,gain);s.buffer=b;s.loop=!!loop;s.connect(g);s.start();return{s,g}}catch(_){return null}
 }
 stopVoice(){try{this.voiceSource?.stop?.()}catch(_){ }try{this.voiceMedia?.pause?.()}catch(_){ }this.voiceSource=null;this.voiceMedia=null;}
 async playVoice({lang='tr',character,chapter,cue,file=null,gain=1}={}){
  if(!this.enabled||!character)return false;this.stopVoice();const safe=String(character).toLocaleLowerCase('tr-TR').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const n=String(chapter||0).padStart(3,'0'),c=String(cue||1).padStart(2,'0');const candidates=file?[file]:[`audio/voice/${lang}/${safe}/chapter-${n}/cue-${c}.ogg`,`audio/voice/${lang}/${safe}/chapter-${n}/cue-${c}.mp3`];
  for(const url of candidates){try{const b=await this._loadBuffer(url),s=this.context.createBufferSource(),g=this._gain('voice',gain);s.buffer=b;s.connect(g);s.start();this.voiceSource=s;s.onended=()=>{if(this.voiceSource===s)this.voiceSource=null};return true}catch(_){ }}return false;
 }
 diagnostics(){return{enabled:this.enabled,initialized:this.initialized,state:this.context?.state||'none',location:this.currentLocation,mood:this.currentMood,surface:this.lastStepSurface,nihyel:this.nihyel,buffers:this.buffers.size,manifest:!!this.manifest,volumes:{...this.volumes}};}
}
const manager=new TelkinAudioManager();
window.TELKIN_AUDIO=manager;window.TelkinAudioManager=TelkinAudioManager;
})();
