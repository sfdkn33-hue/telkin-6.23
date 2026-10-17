
(()=>{
'use strict';
const TT=(k,f,v)=>window.TELKIN_I18N?.t(k,f,v)||f||k;

const mechanic=document.getElementById('gameMechanic'),mechanicCard=document.getElementById('gameMechanicCard'),gameToast=document.getElementById('gameToast'),gameModeBadge=document.getElementById('gameModeBadge');
let isMechanicOpen=false,chapterMechanicDone=false,chapterCompleteShown=false;
const Game={
 tt:null,
 toast(t,ms=1800){gameToast.textContent=t;gameToast.classList.add('show');clearTimeout(this.tt);this.tt=setTimeout(()=>gameToast.classList.remove('show'),ms)},
 startChase(spec,done){
   isMechanicOpen=true;mechanic.classList.add('show');mechanic.setAttribute('aria-hidden','false');
   const sec=spec.seconds||7;let held=false,progress=0,last=performance.now();
   mechanicCard.innerHTML=`<div class="eyebrow">BÖLÜM İÇİ EYLEM · 3D UYARLAMA</div><h2>${spec.title||'Takip'}</h2><p>${spec.text||'Hedefi gözden kaybetme. Dikkatini birkaç saniye boyunca koru.'}</p><div class="progress"><i id="chaseBar"></i></div><div class="countdown" id="chaseCount">${sec.toFixed(1)}</div><button class="primary" id="chaseHold">HEDEFİ GÖZÜNDE TUT</button>`;
   const bar=mechanicCard.querySelector('#chaseBar'),count=mechanicCard.querySelector('#chaseCount'),btn=mechanicCard.querySelector('#chaseHold');
   btn.onpointerdown=()=>held=true;btn.onpointerup=btn.onpointercancel=btn.onpointerleave=()=>held=false;
   const tick=()=>{if(!isMechanicOpen)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(held)progress+=dt;else progress=Math.max(0,progress-dt*.35);bar.style.width=Math.min(100,100*progress/sec)+'%';count.textContent=Math.max(0,sec-progress).toFixed(1);if(progress>=sec){isMechanicOpen=false;mechanic.classList.remove('show');mechanic.setAttribute('aria-hidden','true');done();return}requestAnimationFrame(tick)};requestAnimationFrame(tick);
 }
};

const TEX=window.TELKIN_ASSETS.textures;
const MAHIR_FRAMES=window.TELKIN_ASSETS.mahir;

const REAL_NPC_SPRITES=window.TELKIN_ASSETS.npc;
const CHARACTER_PACKS=window.TELKIN_CHARACTER_PACKS||{};

(function validateCharacterIdentityAssets(){
 const mustDiffer=['EREN','MİNA','NİSAN','BARAN','KAYITÇI','LEYLA','SELİN','SUNA','MUHAFIZ','DOKTOR'];
 const seen=new Map();
 for(const name of mustDiffer){
   const uri=REAL_NPC_SPRITES[name];
   if(!uri){console.error('[TELKİN] ANA KADRO FOTO-GERÇEK SPRITE EKSİK:',name);continue;}
   if(seen.has(uri))console.error('[TELKİN] AYNI SPRITE İKİ KARAKTERDE:',seen.get(uri),name);
   else seen.set(uri,name);
 }
})();
const REAL_NPC_CHARACTERS=new Set(Object.keys(REAL_NPC_SPRITES));
function realNpcTexKey(name){return 'realnpc_'+canonicalCharacterName(name).replace(/[^A-ZÇĞİÖŞÜ0-9]+/g,'_');}
function hasRealNPCSprite(name){return REAL_NPC_CHARACTERS.has(canonicalCharacterName(name));}
function characterPack(name){return CHARACTER_PACKS[canonicalCharacterName(name)]||null;}
function characterPackTexKey(name,frame){return 'char_'+canonicalCharacterName(name).replace(/[^A-ZÇĞİÖŞÜ0-9]+/g,'_')+'_'+frame;}
function characterViewDirection(o,cam){
 const facing=Number.isFinite(o?.ry)?o.ry:0,camYaw=Math.atan2(cam[0]-o.x,cam[2]-o.z),rel=shortestAngle(facing,camYaw),a=Math.abs(rel);
 if(a<Math.PI*.25)return 'front';
 if(a>Math.PI*.75)return 'back';
 return rel>0?'left':'right';
}
function characterAnimState(o){
 const moving=(o?.moveAmount||0)>.06;
 if(!moving)return 'idle';
 return Math.sin(o?.movePhase||0)>=0?'walk1':'walk2';
}
const CHARACTER_TEX_REQUESTED=new Set();
function ensureCharacterFrameTexture(name,frame){
 const key=characterPackTexKey(name,frame),existing=tex[key];
 if(existing)return existing;
 const url=characterPack(name)?.frames?.[frame];
 if(url&&!CHARACTER_TEX_REQUESTED.has(key)){
   CHARACTER_TEX_REQUESTED.add(key);
   loadTex(key,url,false).catch(()=>{});
 }
 return null;
}
function characterFrameTexture(name,dir,state){
 const exact=ensureCharacterFrameTexture(name,`${dir}_${state}`);
 if(exact&&exact!==tex.white)return exact;
 const dirIdle=ensureCharacterFrameTexture(name,`${dir}_idle`);
 if(dirIdle&&dirIdle!==tex.white)return dirIdle;
 const frontState=ensureCharacterFrameTexture(name,`front_${state}`);
 if(frontState&&frontState!==tex.white)return frontState;
 const front=ensureCharacterFrameTexture(name,'front_idle');
 if(front&&front!==tex.white)return front;
 const legacy=tex[realNpcTexKey(name)];
 return legacy||tex.white;
}
const canvas=document.getElementById('gl');
const gl=canvas.getContext('webgl',{alpha:false,antialias:(window.devicePixelRatio||1)<1.5,premultipliedAlpha:false,powerPreference:'high-performance'});
if(!gl){document.getElementById('fallback').style.display='grid';return;}

const coord=document.getElementById('coord'), zone=document.getElementById('zone');
const prompt=document.getElementById('prompt'), interact=document.getElementById('interact');
const dlg=document.getElementById('dialogue'), speaker=document.getElementById('speaker'), text=document.getElementById('text');
const chapterInterlude=document.getElementById('chapterInterlude'),ciKicker=document.getElementById('ciKicker'),ciTitle=document.getElementById('ciTitle'),ciSub=document.getElementById('ciSub'),ciBody=document.getElementById('ciBody'),ciMeta=document.getElementById('ciMeta'),ciContinue=document.getElementById('ciContinue');
const dlgProgress=document.querySelector('#dlgProgress i');
const joy=document.getElementById('joy'),knob=document.getElementById('knob'),runBtn=document.getElementById('run');
const universeBtn=document.getElementById('universeBtn'),universePanel=document.getElementById('universePanel'),universeClose=document.getElementById('universeClose'),universeLayers=document.getElementById('universeLayers');
const soundBtn=document.getElementById('soundBtn'),fadeEl=document.getElementById('fade');
const nihyelBtn=document.getElementById('nihyelBtn'),nihyelVeil=document.getElementById('nihyelVeil'),objectiveEl=document.getElementById('objective'),taskGuide=document.getElementById('taskGuide'),missionCard=document.getElementById('missionCard'),missionStep=document.getElementById('missionStep'),missionTitle=document.getElementById('missionTitle'),missionHint=document.getElementById('missionHint'),chapterIdentity=document.getElementById('chapterIdentity'),chapterIdentityMode=document.getElementById('chapterIdentityMode'),chapterIdentityTitle=document.getElementById('chapterIdentityTitle'),chapterIdentityFlow=document.getElementById('chapterIdentityFlow'),actionFocus=document.getElementById('actionFocus'),actionFocusLabel=document.getElementById('actionFocusLabel'),actionFocusFill=document.getElementById('actionFocusFill'),saveMark=document.getElementById('saveMark');
const hudMenuBtn=document.getElementById('hudMenuBtn'),hudQuickMenu=document.getElementById('hudQuickMenu'),hudMenuClose=document.getElementById('hudMenuClose'),missionRecall=document.getElementById('missionRecall');let missionPeekTimer=0;
const versionBadge=document.getElementById('versionBadge');
const cinematicUse=document.getElementById('cinematicUse'),cinUseKicker=document.getElementById('cinUseKicker'),cinUseTitle=document.getElementById('cinUseTitle'),cinUseMeta=document.getElementById('cinUseMeta'),vfLabel=document.getElementById('vfLabel'),cinPhoneState=document.getElementById('cinPhoneState'),cinPhoneName=document.getElementById('cinPhoneName'),cinDocKicker=document.getElementById('cinDocKicker'),cinDocTitle=document.getElementById('cinDocTitle'),cinDocGoal=document.getElementById('cinDocGoal');
let cinematicUseLastKey='';
const storyBtn=document.getElementById('storyBtn'),storyPanel=document.getElementById('storyPanel'),storyClose=document.getElementById('storyClose'),storyPanelTitle=document.getElementById('storyPanelTitle'),storyPanelBody=document.getElementById('storyPanelBody');if(versionBadge)versionBadge.textContent='v6.22.6 · SİNEMATİK MİNİMAL HUD';
const chaptersBtn=document.getElementById('chaptersBtn'),chaptersPanel=document.getElementById('chaptersPanel'),chaptersClose=document.getElementById('chaptersClose');
const volTabs=document.getElementById('volTabs'),chapterGrid=document.getElementById('chapterGrid'),chapterDetail=document.getElementById('chapterDetail');
const chapterJumpInput=document.getElementById('chapterJumpInput'),chapterJumpGo=document.getElementById('chapterJumpGo'),inspectionBar=document.getElementById('inspectionBar'),inspectionLabel=document.getElementById('inspectionLabel'),inspectionPrev=document.getElementById('inspectionPrev'),inspectionNext=document.getElementById('inspectionNext'),inspectionReturn=document.getElementById('inspectionReturn');
const locCount=document.getElementById('locCount'),doneCount=document.getElementById('doneCount'),atlasBadge=document.getElementById('atlasBadge');
const locationsBtn=document.getElementById('locationsBtn'),locationsPanel=document.getElementById('locationsPanel'),locationsClose=document.getElementById('locationsClose');
if(chaptersBtn)chaptersBtn.textContent=TT('ui.chapterSelect','BÖLÜM SEÇ · 1–144');
const quickChapterBtn=hudQuickMenu?.querySelector('[data-open="chapters"]');if(quickChapterBtn)quickChapterBtn.textContent=TT('ui.chapterSelect','BÖLÜM SEÇ · 1–144');
const chapterJumpNote=document.querySelector('.chapterJump em');if(chapterJumpNote)chapterJumpNote.textContent='1–144 arasındaki herhangi bir bölümü doğrudan oynayabilirsin. Kayıtlı ana ilerlemen korunur.';
if(inspectionReturn)inspectionReturn.textContent='KAYITLI OYUNA DÖN';
const arcadeBtn=document.getElementById('arcadeBtn'),arcadePanel=document.getElementById('arcadePanel'),arcadeClose=document.getElementById('arcadeClose'),arcadeTitle=document.getElementById('arcadeTitle'),arcadeDesc=document.getElementById('arcadeDesc'),arcadeCanvas=document.getElementById('arcadeCanvas'),arcadeStatus=document.getElementById('arcadeStatus'),arcadeStart=document.getElementById('arcadeStart'),arcadeSkip=document.getElementById('arcadeSkip'),arcadePads=document.getElementById('arcadePads');
const arcadeEmbed=document.getElementById('arcadeEmbed'),arcadeFrame=document.getElementById('arcadeFrame'),arcadeShelf=document.getElementById('arcadeShelf'),arcadeGenre=document.getElementById('arcadeGenre'),arcadeControl=document.getElementById('arcadeControl');
const locationSearch=document.getElementById('locationSearch'),locationTabs=document.getElementById('locationTabs'),locationGrid=document.getElementById('locationGrid'),locationActions=document.getElementById('locationActions');

const TELKIN_CHAPTERS=window.TELKIN_CHAPTERS_DATA;
const LOC_INFO=window.TELKIN_LOCATION_DATA;

function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
const vs=shader(gl.VERTEX_SHADER,`
attribute vec3 aPos;
attribute vec3 aNormal;
attribute vec2 aUV;
uniform mat4 uModel;
uniform mat4 uVP;
uniform vec2 uUVScale;
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUV;
void main(){
 vec4 wp=uModel*vec4(aPos,1.0);
 vPos=wp.xyz;
 vNormal=normalize(mat3(uModel)*aNormal);
 vUV=aUV*uUVScale;
 gl_Position=uVP*wp;
}`);
const fs=shader(gl.FRAGMENT_SHADER,`
precision mediump float;
uniform sampler2D uTex;
uniform vec4 uColor;
uniform float uUseTex;
uniform float uEmissive;
uniform float uAlphaCut;
uniform vec3 uAmbient;
uniform vec3 uLightPos[12];
uniform vec3 uLightColor[12];
uniform float uLightAtt[12];
uniform int uLightCount;
uniform float uTime;
uniform float uDokuMix;
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUV;
void main(){
 vec4 t=mix(vec4(1.0),texture2D(uTex,vUV),uUseTex);
 vec4 base=t*uColor;
 if(base.a<uAlphaCut) discard;
 // Nihyel does not move Mahir into another room; it changes what part of the same reality is perceptible.
 float threadWave=.5+.5*sin(vPos.x*2.13+vPos.z*1.37+vPos.y*3.1+uTime*1.85);
 vec3 dokuTint=vec3(.08,.58,.86)*(0.13+threadWave*.18);
 base.rgb=mix(base.rgb,base.rgb*.76+dokuTint,uDokuMix*.62);
 vec3 n=normalize(vNormal);
 float up=max(n.y,0.0);
 vec3 light=uAmbient+vec3(.05,.055,.06)*up;
 for(int i=0;i<12;i++){
   if(i<uLightCount){
     vec3 L=uLightPos[i]-vPos;
     float d2=max(dot(L,L),0.0001);
     float lam=max(dot(n,normalize(L)),0.0)/(1.0+uLightAtt[i]*d2);
     light+=uLightColor[i]*lam;
   }
 }
 float distFade=clamp(1.10-length(vPos.xz)*.0040,0.88,1.0);
 // Visibility pass v2.1.1.0: keep cinematic contrast, but never let playable geometry disappear.
 light=max(light,vec3(0.28));
 light=mix(light,vec3(1.0),uEmissive);
 vec3 lit=base.rgb*light*distFade;
 lit=pow(max(lit,vec3(0.0)),vec3(0.78))*1.18;
 gl_FragColor=vec4(lit,base.a);
}`);
const prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);
if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);

const A={
 pos:gl.getAttribLocation(prog,'aPos'),
 nor:gl.getAttribLocation(prog,'aNormal'),
 uv:gl.getAttribLocation(prog,'aUV')
};
const U={
 model:gl.getUniformLocation(prog,'uModel'),vp:gl.getUniformLocation(prog,'uVP'),
 uvScale:gl.getUniformLocation(prog,'uUVScale'),tex:gl.getUniformLocation(prog,'uTex'),
 color:gl.getUniformLocation(prog,'uColor'),useTex:gl.getUniformLocation(prog,'uUseTex'),
 emissive:gl.getUniformLocation(prog,'uEmissive'),alphaCut:gl.getUniformLocation(prog,'uAlphaCut'),
 ambient:gl.getUniformLocation(prog,'uAmbient'),lightPos:gl.getUniformLocation(prog,'uLightPos[0]'),
 lightColor:gl.getUniformLocation(prog,'uLightColor[0]'),lightAtt:gl.getUniformLocation(prog,'uLightAtt[0]'),lightCount:gl.getUniformLocation(prog,'uLightCount'),
 time:gl.getUniformLocation(prog,'uTime'),dokuMix:gl.getUniformLocation(prog,'uDokuMix')
};

function V3(x=0,y=0,z=0){return [x,y,z]}
function sub(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
function mul(a,s){return [a[0]*s,a[1]*s,a[2]*s]}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function norm(a){const l=Math.hypot(...a)||1;return mul(a,1/l)}
function M(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}
function mm(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o}
function mt(x,y,z){const m=M();m[12]=x;m[13]=y;m[14]=z;return m}
function ms(x,y,z){const m=M();m[0]=x;m[5]=y;m[10]=z;return m}
function mry(a){const c=Math.cos(a),s=Math.sin(a),m=M();m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m}
const modelScratch=new Float32Array(16);
function setModel(out,x,y,z,sx,sy,sz,ry=0){
 const c=Math.cos(ry),sn=Math.sin(ry);
 out[0]=c*sx;out[1]=0;out[2]=-sn*sx;out[3]=0;
 out[4]=0;out[5]=sy;out[6]=0;out[7]=0;
 out[8]=sn*sz;out[9]=0;out[10]=c*sz;out[11]=0;
 out[12]=x;out[13]=y;out[14]=z;out[15]=1;return out;
}
function model(x,y,z,sx,sy,sz,ry=0){return setModel(modelScratch,x,y,z,sx,sy,sz,ry)}
const articulatedScratch=new Float32Array(16);
function modelYX(x,y,z,sx,sy,sz,rx=0,ry=0){
 const cy=Math.cos(ry),sn=Math.sin(ry),cx=Math.cos(rx),ss=Math.sin(rx),o=articulatedScratch;
 // R = Ry * Rx; sütunlara ölçek uygulanır.
 o[0]=cy*sx;o[1]=0;o[2]=-sn*sx;o[3]=0;
 o[4]=sn*ss*sy;o[5]=cx*sy;o[6]=cy*ss*sy;o[7]=0;
 o[8]=sn*cx*sz;o[9]=-ss*sz;o[10]=cy*cx*sz;o[11]=0;
 o[12]=x;o[13]=y;o[14]=z;o[15]=1;return o;
}
function perspective(fovy,asp,n,f){const t=1/Math.tan(fovy/2),m=new Float32Array(16);m[0]=t/asp;m[5]=t;m[10]=(f+n)/(n-f);m[11]=-1;m[14]=(2*f*n)/(n-f);return m}
function lookAt(eye,tar,up=[0,1,0]){const z=norm(sub(eye,tar)),x=norm(cross(up,z)),y=cross(z,x),m=M();m[0]=x[0];m[1]=y[0];m[2]=z[0];m[4]=x[1];m[5]=y[1];m[6]=z[1];m[8]=x[2];m[9]=y[2];m[10]=z[2];m[12]=-dot(x,eye);m[13]=-dot(y,eye);m[14]=-dot(z,eye);return m}

const cube=[];
function face(p0,p1,p2,p3,n){
 const uv=[[0,0],[1,0],[1,1],[0,1]],ps=[p0,p1,p2,p0,p2,p3],ui=[0,1,2,0,2,3];
 for(let i=0;i<6;i++)cube.push(...ps[i],...n,...uv[ui[i]]);
}
face([-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]);
face([1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]);
face([-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]);
face([1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]);
face([-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]);
face([-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]);
const cubeBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cube),gl.STATIC_DRAW);

const quad=[
 -.5,0,0, 0,0,1, 0,0,   .5,0,0,0,0,1,1,0,   .5,1,0,0,0,1,1,1,
 -.5,0,0, 0,0,1, 0,0,   .5,1,0,0,0,1,1,1,  -.5,1,0,0,0,1,0,1
];
const quadBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quadBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(quad),gl.STATIC_DRAW);

// ---------- v0.7.3: GERÇEK 3D MAHİR İÇİN PRİMİTİFLER ----------
function makeCylinder(seg=24){
 const a=[];
 const push=(p,n,uv)=>a.push(...p,...n,...uv);
 for(let i=0;i<seg;i++){
   const a0=i/seg*Math.PI*2,a1=(i+1)/seg*Math.PI*2;
   const c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
   // yan yüzey
   push([c0,-1,s0],[c0,0,s0],[i/seg,0]);push([c1,-1,s1],[c1,0,s1],[(i+1)/seg,0]);push([c1,1,s1],[c1,0,s1],[(i+1)/seg,1]);
   push([c0,-1,s0],[c0,0,s0],[i/seg,0]);push([c1,1,s1],[c1,0,s1],[(i+1)/seg,1]);push([c0,1,s0],[c0,0,s0],[i/seg,1]);
   // kapaklar
   push([0,1,0],[0,1,0],[.5,.5]);push([c1,1,s1],[0,1,0],[(c1+1)/2,(s1+1)/2]);push([c0,1,s0],[0,1,0],[(c0+1)/2,(s0+1)/2]);
   push([0,-1,0],[0,-1,0],[.5,.5]);push([c0,-1,s0],[0,-1,0],[(c0+1)/2,(s0+1)/2]);push([c1,-1,s1],[0,-1,0],[(c1+1)/2,(s1+1)/2]);
 }
 return new Float32Array(a);
}
function makeSphere(lat=20,lon=30){
 const a=[];
 const P=(th,ph)=>[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)];
 const push=(p,uv)=>a.push(...p,...p,...uv);
 for(let y=0;y<lat;y++)for(let x=0;x<lon;x++){
   const t0=y/lat*Math.PI,t1=(y+1)/lat*Math.PI,p0=x/lon*Math.PI*2,p1=(x+1)/lon*Math.PI*2;
   const q00=P(t0,p0),q10=P(t0,p1),q01=P(t1,p0),q11=P(t1,p1);
   push(q00,[x/lon,1-y/lat]);push(q01,[x/lon,1-(y+1)/lat]);push(q11,[(x+1)/lon,1-(y+1)/lat]);
   push(q00,[x/lon,1-y/lat]);push(q11,[(x+1)/lon,1-(y+1)/lat]);push(q10,[(x+1)/lon,1-y/lat]);
 }
 return new Float32Array(a);
}
const cylData=makeCylinder(),sphereData=makeSphere();
const cylBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,cylBuf);gl.bufferData(gl.ARRAY_BUFFER,cylData,gl.STATIC_DRAW);const cylCount=cylData.length/8;
const sphereBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,sphereBuf);gl.bufferData(gl.ARRAY_BUFFER,sphereData,gl.STATIC_DRAW);const sphereCount=sphereData.length/8;

let boundBuf=null;
function bind(buf){if(boundBuf===buf)return;boundBuf=buf;gl.bindBuffer(gl.ARRAY_BUFFER,buf);const s=8*4;gl.enableVertexAttribArray(A.pos);gl.vertexAttribPointer(A.pos,3,gl.FLOAT,false,s,0);gl.enableVertexAttribArray(A.nor);gl.vertexAttribPointer(A.nor,3,gl.FLOAT,false,s,3*4);gl.enableVertexAttribArray(A.uv);gl.vertexAttribPointer(A.uv,2,gl.FLOAT,false,s,6*4);}

const tex={};
let boundTexture=null;
function useTexture(t){if(boundTexture===t)return;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,t);boundTexture=t;}
function isPowerOf2(v){return (v&(v-1))===0;}
function loadTex(name,url,repeat=true){
 return new Promise(res=>{const im=new Image();im.onload=()=>{
   const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
   gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
   const pot=isPowerOf2(im.width)&&isPowerOf2(im.height);
   if(pot){
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
     gl.generateMipmap(gl.TEXTURE_2D);
   }else{
     // WebGL1: NPOT textures cannot use mipmaps or REPEAT.
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
   }
   tex[name]=t;boundTexture=null;res();
 };im.onerror=()=>{console.warn('Doku yüklenemedi, fallback kullanılıyor:',name);tex[name]=tex.white;res();};im.src=url;});
}
const white=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,white);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255,255]));tex.white=white;

const TELKIN_UNIVERSE={
 version:'6.22',
 phase:'TAM ROMAN 144 · SİNEMATİK NESNE ODAĞI · YAŞAYAN 3D SAHNELER',
 principle:'Yaratılmış olmakla gerçek olmamak aynı şey değildir.',
 layers:[
  {id:'visible',name:'GÖRÜNEN DÜNYA',state:'live',label:'OYNUYOR',desc:'Mahir’in gündelik gerçekliği. Ofis, bina, sokak, evler ve insanlar fiziksel kurallara uyar.'},
  {id:'texture',name:'DOKU',state:'lock',label:'ALGILANMIYOR',desc:'Görünen gerçekliğin altında işleyen olasılık ağı. Nihyel uyanmadan doğrudan görülemez; fiziksel bir oda gibi gezilmez.'},
  {id:'rift',name:'YARIK',state:'lock',label:'GEÇİŞ',desc:'Katmanlar arasında oluşan kırılma. Mekân değil; geçiş olayı ve anlatı mekaniğidir.'},
  {id:'barzakh',name:'BERZAH',state:'lock',label:'KİLİTLİ',desc:'Ölüm, uyanış ve ara-gerçeklik hattı. Hikâye açmadan serbest dolaşıma açılmaz.'},
  {id:'amr',name:'EMR',state:'rule',label:'KURAL',desc:'Evrenin işleyiş düzeyi. Oyuncunun gezdiği sıradan fiziksel bir bölüm olarak modellenmez.'},
  {id:'lawh',name:'LEVH',state:'rule',label:'KURAL',desc:'Basit bir kayıt odası değildir. Görsel temsil mümkün olsa bile tam erişim oyunun kuralı olmayacak.'},
  {id:'source',name:'KAYNAK',state:'rule',label:'ERİŞİLEMEZ',desc:'Yaratıcıya erişim kapısı değildir. Evrenin bilinçli sınırı olarak kalır.'}
 ],
 hubs:[
  {id:'office',name:'Mahir’in Ofisi',layer:'visible',status:'playable'},
  {id:'building',name:'İş Hanı',layer:'visible',status:'playable'},
  {id:'night_city',name:'Gece Sokağı',layer:'visible',status:'playable'},
  {id:'square',name:'Sessiz Meydan',layer:'visible',status:'playable'},
  {id:'doku_threshold',name:'Doku Eşiği',layer:'visible',status:'playable'},
  {id:'nihyel',name:'Nihyel Algısı',layer:'texture',status:'system'},
  {id:'mahir_home',name:'Mahir’in Evi',layer:'visible',status:'playable'},
  {id:'mina_line',name:'Mina Hattı',layer:'visible',status:'playable'},
  {id:'cave',name:'Mağara / Kriz Hattı',layer:'visible',status:'playable'}
 ]
};
function renderUniversePanel(){
 universeLayers.innerHTML=TELKIN_UNIVERSE.layers.map(l=>`<div class="uLayer"><strong>${l.name}</strong><p>${l.desc}</p><span class="uState ${l.state}">${l.label}</span></div>`).join('');
}
function syncUniverseRuntime(){
 const d=TELKIN_UNIVERSE.layers.find(l=>l.id==='texture'),r=TELKIN_UNIVERSE.layers.find(l=>l.id==='rift');
 if(d){d.state=story&&story.nihyelUnlocked?'live':'lock';d.label=story&&story.nihyelUnlocked?'ALGILANABİLİR':'ALGILANMIYOR';}
 if(r){r.state=story&&story.riftSeen?'live':'lock';r.label=story&&story.riftSeen?'İZLENDİ':'GEÇİŞ';}
 renderUniversePanel();
}
function syncVersionLabels(){document.title=`TELKİN 3D EVREN v${TELKIN_UNIVERSE.version} — ${TELKIN_UNIVERSE.phase}`;versionBadge.textContent=innerWidth<=600?`v${TELKIN_UNIVERSE.version} · TEMİZ HUD · 144 BÖLÜM`:`v${TELKIN_UNIVERSE.version} · ${TELKIN_UNIVERSE.phase}`;}
renderUniversePanel();syncVersionLabels();

const WORLD_LIGHTS=[
 {pos:[-0.65,1.55,-0.35],color:[6.83,4.03,2.02],att:.20},
 {pos:[-2.3,2.0,-3.25],color:[1.90,2.85,4.10],att:.14},
 {pos:[0.0,2.45,8.4],color:[3.96,3.61,2.92],att:.16},
 {pos:[0.0,1.9,19.2],color:[2.32,2.64,2.88],att:.16},
 {pos:[-4.8,2.8,31.0],color:[3.63,3.96,4.84],att:.085},
 {pos:[4.8,2.8,47.0],color:[3.95,3.59,2.60],att:.085},
 {pos:[0.0,1.0,62.0],color:[0.65,2.59,3.60],att:.055},
 {pos:[50.0,2.25,0.0],color:[4.50,3.35,2.25],att:.16},
 {pos:[-50.0,2.35,0.0],color:[4.25,3.50,2.75],att:.15},
 {pos:[-52.55,1.18,2.35],color:[4.80,2.75,1.55],att:.20},
 // Mağara: girişte soluk sıcak ışık, krizin merkezinde kaynaksız soğuk parıltı
 {pos:[0.0,2.05,-71.0],color:[2.80,2.10,1.45],att:.13},
 {pos:[0.0,1.15,-95.0],color:[0.55,2.55,3.85],att:.075}
];
const lightPosData=new Float32Array(36),lightColorData=new Float32Array(36),lightAttData=new Float32Array(12);
function uploadLights(){
 const n=Math.min(12,WORLD_LIGHTS.length);lightPosData.fill(0);lightColorData.fill(0);lightAttData.fill(0);
 for(let i=0;i<n;i++){lightPosData.set(WORLD_LIGHTS[i].pos,i*3);lightColorData.set(WORLD_LIGHTS[i].color,i*3);lightAttData[i]=WORLD_LIGHTS[i].att;}
 gl.uniform3f(U.ambient,.315,.330,.350);gl.uniform3fv(U.lightPos,lightPosData);gl.uniform3fv(U.lightColor,lightColorData);gl.uniform1fv(U.lightAtt,lightAttData);gl.uniform1i(U.lightCount,n);
}
uploadLights();
const CAVE_LIGHT_A={pos:[0.0,2.05,-71.0],color:[2.80,2.10,1.45],att:.13},CAVE_LIGHT_B={pos:[0.0,1.15,-95.0],color:[0.55,2.55,3.85],att:.075};
const LOCATION_DESIGN={"office":{"signature":"office","mood":"warmWork","label":"Mahir’in Ofisi"},"corridor":{"signature":"corridor","mood":"coolWork","label":"Koridor"},"management":{"signature":"management","mood":"warmWork","label":"Yönetim"},"lab":{"signature":"lab","mood":"clinical","label":"Laboratuvar"},"visionlab":{"signature":"lab","mood":"clinical","label":"Görü Laboratuvarı"},"bakeryStreet":{"signature":"bakery","mood":"warmStreet","label":"Fırın Sokağı"},"alley":{"signature":"alley","mood":"nightBlue","label":"Dar Sokak"},"courtyard":{"signature":"courtyard","mood":"nightBlue","label":"Avlu"},"university":{"signature":"university","mood":"dayWork","label":"Üniversite"},"archive":{"signature":"archive","mood":"darkWork","label":"Arşiv"},"oldstreet":{"signature":"oldstreet","mood":"warmStreet","label":"Eski Sokak"},"hospitalMemory":{"signature":"hospital","mood":"clinical","label":"Hastane Hatırası"},"workshop":{"signature":"workshop","mood":"warmWork","label":"Atölye"},"construction":{"signature":"construction","mood":"coldStreet","label":"İnşaat"},"home":{"signature":"home","mood":"warmHome","label":"Ev"},"alternateHome":{"signature":"altHome","mood":"uncannyHome","label":"Alternatif Ev"},"schoolstreet":{"signature":"school","mood":"coldStreet","label":"Okul Sokağı"},"eventhall":{"signature":"event","mood":"stage","label":"Etkinlik Salonu"},"city":{"signature":"city","mood":"nightBlue","label":"Şehir"},"sunahome":{"signature":"home","mood":"warmHome","label":"Suna’nın Evi"},"familyhome":{"signature":"home","mood":"warmHome","label":"Aile Evi"},"threshold":{"signature":"abstractThreshold","mood":"doku","label":"Eşik"},"officeNight":{"signature":"office","mood":"warmWork","label":"Gece Ofisi"},"studio":{"signature":"studio","mood":"stage","label":"Stüdyo"},"dokuSystem":{"signature":"doku","mood":"doku","label":"Doku Sistemi"},"worldmap":{"signature":"worldmap","mood":"map","label":"Dünya Haritası"},"dreamspace":{"signature":"dream","mood":"dream","label":"Rüya Alanı"},"cafe":{"signature":"cafe","mood":"warmStreet","label":"Kafe"},"apartment":{"signature":"apartment","mood":"warmHome","label":"Apartman"},"market":{"signature":"market","mood":"warmStreet","label":"Pazar"},"street":{"signature":"city","mood":"nightBlue","label":"Sokak"},"therapy":{"signature":"therapy","mood":"softClinical","label":"Terapi Odası"},"corridorlab":{"signature":"corridor","mood":"coolWork","label":"Laboratuvar Koridoru"},"ferry":{"signature":"ferry","mood":"coldTransport","label":"Vapur"},"metro":{"signature":"metro","mood":"coldTransport","label":"Metro"},"cemetery":{"signature":"cemetery","mood":"coldStreet","label":"Mezarlık"},"elevator":{"signature":"elevator","mood":"clinical","label":"Asansör"},"center":{"signature":"management","mood":"warmWork","label":"Merkez"},"park":{"signature":"park","mood":"nightBlue","label":"Park"},"splitCorridor":{"signature":"corridor","mood":"coolWork","label":"Bölünmüş Koridor"},"rizaHome":{"signature":"home","mood":"warmHome","label":"Rıza’nın Evi"},"pastHome":{"signature":"pastHome","mood":"sepiaHome","label":"Geçmişteki Ev"},"rainStreet":{"signature":"rain","mood":"rain","label":"Yağmur Sokağı"},"ancientMesopotamia":{"signature":"mesopotamia","mood":"ancientWarm","label":"Antik Mezopotamya"},"granary":{"signature":"granary","mood":"ancientWarm","label":"Ambar"},"kiln":{"signature":"kiln","mood":"fire","label":"Ocak / Fırın"},"ancientStreet":{"signature":"ancientStreet","mood":"ancientWarm","label":"Antik Sokak"},"dryPlain":{"signature":"dryPlain","mood":"dryNature","label":"Kurak Ova"},"hillside":{"signature":"hillside","mood":"greenNature","label":"Yamaç"},"camp":{"signature":"camp","mood":"campfire","label":"Kamp"},"egyptVillage":{"signature":"egypt","mood":"ancientHot","label":"Mısır Köyü"},"quarry":{"signature":"quarry","mood":"dryNature","label":"Taş Ocağı"},"cistern":{"signature":"cistern","mood":"caveWater","label":"Sarnıç"},"tombValley":{"signature":"tombValley","mood":"tomb","label":"Mezar Vadisi"},"tomb":{"signature":"tomb","mood":"tomb","label":"Mezar"},"nightPath":{"signature":"nightPath","mood":"nightNature","label":"Gece Patikası"},"stormShelter":{"signature":"storm","mood":"storm","label":"Fırtına Sığınağı"},"dawnHill":{"signature":"dawn","mood":"dawn","label":"Şafak Tepesi"},"ruinedSettlement":{"signature":"ruin","mood":"ancientDust","label":"Harabe Yerleşim"},"road":{"signature":"city","mood":"nightBlue","label":"Yol"},"ancientCity":{"signature":"ancientCity","mood":"ancientWarm","label":"Antik Şehir"},"fireStreet":{"signature":"fireUrban","mood":"fire","label":"Yangın Sokağı"},"cityGate":{"signature":"gate","mood":"coldStreet","label":"Şehir Kapısı"},"skyCamp":{"signature":"skyCamp","mood":"coldNature","label":"Gökyüzü Kampı"},"fireSlope":{"signature":"fireSlope","mood":"fire","label":"Yangın Yamacı"},"dryRiver":{"signature":"dryRiver","mood":"dryNature","label":"Kurumuş Nehir"},"brokenBridge":{"signature":"brokenBridge","mood":"storm","label":"Kırık Köprü"},"riverVillage":{"signature":"riverVillage","mood":"waterNature","label":"Nehir Köyü"},"ancientRoad":{"signature":"ancientRoad","mood":"ancientDust","label":"Antik Yol"},"caravan":{"signature":"caravan","mood":"ancientWarm","label":"Kervan"},"sandstorm":{"signature":"sandstorm","mood":"sandstorm","label":"Kum Fırtınası"},"caveVision":{"signature":"caveVision","mood":"dokuCave","label":"Mağara Görüsü"},"recordCave":{"signature":"recordCave","mood":"dokuCave","label":"Kayıt Mağarası"},"prisonCamp":{"signature":"prisonCamp","mood":"coldNature","label":"Esir Kampı"},"ancientPath":{"signature":"ancientPath","mood":"ancientDust","label":"Antik Patika"},"nightCamp":{"signature":"camp","mood":"campfire","label":"Gece Kampı"},"cave":{"signature":"cave","mood":"cave","label":"Mağara"},"ridge":{"signature":"ridge","mood":"coldNature","label":"Dağ Sırtı"},"ambush":{"signature":"ambush","mood":"nightNature","label":"Pusu Alanı"},"mountainTrail":{"signature":"mountainTrail","mood":"coldNature","label":"Dağ Patikası"},"waterCamp":{"signature":"waterCamp","mood":"waterNature","label":"Su Kampı"},"sidePath":{"signature":"sidePath","mood":"greenNature","label":"Yan Patika"},"boundaryLand":{"signature":"boundary","mood":"dryNature","label":"Sınır Arazisi"},"hiddenZone":{"signature":"hidden","mood":"void","label":"Gizli Bölge"},"kitchen":{"signature":"kitchen","mood":"warmHome","label":"Mutfak"},"baghdad":{"signature":"baghdad","mood":"ancientNight","label":"Bağdat"},"burningStreet":{"signature":"fireUrban","mood":"fire","label":"Yanan Sokak"},"river":{"signature":"river","mood":"waterNature","label":"Nehir"},"fireCity":{"signature":"fireUrban","mood":"fire","label":"Yangın Şehri"},"burningHouse":{"signature":"burningHome","mood":"fire","label":"Yanan Ev"},"ashStreet":{"signature":"fireUrban","mood":"fire","label":"Kül Sokağı"},"arelHouse":{"signature":"home","mood":"warmHome","label":"Arel'in Evi"},"villageStreet":{"signature":"villageStreet","mood":"warmStreet","label":"Köy Sokağı"},"roadCamp":{"signature":"camp","mood":"campfire","label":"Yol Kampı"},"prehistoricCamp":{"signature":"prehistoric","mood":"campfire","label":"Tarihöncesi Kamp"},"huntTrail":{"signature":"hunt","mood":"greenNature","label":"Av Patikası"},"prehumanCoast":{"signature":"prehuman","mood":"waterNature","label":"İnsan Öncesi Kıyı"},"balcony":{"signature":"balcony","mood":"nightBlue","label":"Balkon"},"car":{"signature":"car","mood":"nightBlue","label":"Araba"},"stationReplay":{"signature":"station","mood":"coldStreet","label":"İstasyon Tekrarı"},"stationery":{"signature":"workshop","mood":"warmWork","label":"Kırtasiye"},"storageFacility":{"signature":"archive","mood":"darkWork","label":"Depo Tesisi"},"blackArchive":{"signature":"black","mood":"void","label":"Kara Arşiv"},"schoolNight":{"signature":"school","mood":"coldStreet","label":"Gece Okulu"},"shore":{"signature":"shore","mood":"waterNature","label":"Kıyı"},"hospital":{"signature":"hospital","mood":"clinical","label":"Hastane"},"funeral":{"signature":"cemetery","mood":"coldStreet","label":"Cenaze Alanı"},"textLayer":{"signature":"text","mood":"text","label":"Metin Katmanı"}};

// ---------- v4.3.0: FİLM GÖRSEL BİRLİĞİ ----------
// 108 mekânın mevcut ışık tasarımını tek bir sinema diliyle sonlandırır.
const FILM_LOOKS={
 warm:{filter:'saturate(.91) contrast(1.04) brightness(.99) sepia(.035)',overlay:'linear-gradient(180deg,rgba(255,180,108,.045),rgba(28,18,12,.035)),radial-gradient(ellipse at center,transparent 50%,rgba(22,10,4,.22) 100%)'},
 cool:{filter:'saturate(.88) contrast(1.055) brightness(.975)',overlay:'linear-gradient(180deg,rgba(72,150,210,.045),rgba(5,14,24,.055)),radial-gradient(ellipse at center,transparent 48%,rgba(0,7,18,.24) 100%)'},
 clinical:{filter:'saturate(.82) contrast(1.06) brightness(1.005)',overlay:'linear-gradient(180deg,rgba(150,225,240,.038),rgba(15,34,42,.038)),radial-gradient(ellipse at center,transparent 54%,rgba(5,17,22,.18) 100%)'},
 fire:{filter:'saturate(.96) contrast(1.08) brightness(.965) sepia(.045)',overlay:'linear-gradient(180deg,rgba(255,104,44,.075),rgba(47,6,2,.075)),radial-gradient(ellipse at center,transparent 47%,rgba(38,3,0,.28) 100%)'},
 ancient:{filter:'saturate(.86) contrast(1.06) brightness(.975) sepia(.055)',overlay:'linear-gradient(180deg,rgba(211,151,78,.055),rgba(53,33,16,.045)),radial-gradient(ellipse at center,transparent 48%,rgba(31,18,6,.23) 100%)'},
 nature:{filter:'saturate(.90) contrast(1.045) brightness(.985)',overlay:'linear-gradient(180deg,rgba(77,125,105,.025),rgba(12,24,20,.025)),radial-gradient(ellipse at center,transparent 52%,rgba(3,11,8,.21) 100%)'},
 void:{filter:'saturate(.72) contrast(1.10) brightness(.91)',overlay:'linear-gradient(180deg,rgba(67,94,147,.06),rgba(27,8,45,.07)),radial-gradient(ellipse at center,transparent 42%,rgba(0,0,0,.34) 100%)'},
 neutral:{filter:'saturate(.92) contrast(1.04) brightness(.985)',overlay:'radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.21) 100%)'}
};
function filmLookFamily(loc,type){
 const mood=(LOCATION_DESIGN[loc]?.mood||'').toLowerCase();
 if(/fire|kiln/.test(mood))return 'fire';
 if(/clinical/.test(mood))return 'clinical';
 if(/doku|dream|void|text|map/.test(mood))return 'void';
 if(/ancient|sepia|sand/.test(mood)||type==='ancient')return 'ancient';
 if(/home|warm|campfire|dawn/.test(mood))return 'warm';
 if(/night|cold|rain|storm|cave|water/.test(mood))return 'cool';
 if(type==='nature')return 'nature';
 return 'neutral';
}
function applyFilmLook(loc){
 const type=LOC_INFO[loc]?.type||'urban',family=filmLookFamily(loc,type),look=FILM_LOOKS[family]||FILM_LOOKS.neutral;
 document.documentElement.style.setProperty('--film-canvas-filter',look.filter);
 const grade=document.getElementById('filmGrade');if(grade)grade.style.background=look.overlay;
 document.body.dataset.filmLook=family;
}

let atlasClear=[.018,.027,.039];
const MOOD_PRESETS={
 warmHome:{clear:[0.07,0.058,0.052],amb:[0.329,0.301,0.273],a:[5.6,3.808,2.352],b:[1.68,2.24,3.024]},uncannyHome:{clear:[0.054,0.05,0.062],amb:[0.26,0.26,0.301],a:[3.92,2.8,2.24],b:[1.904,2.464,3.584]},sepiaHome:{clear:[0.078,0.062,0.046],amb:[0.342,0.301,0.246],a:[5.376,3.584,2.016],b:[1.568,2.016,2.464]},
 warmWork:{clear:[0.054,0.058,0.064],amb:[0.301,0.308,0.315],a:[5.04,3.696,2.464],b:[1.904,2.576,3.36]},coolWork:{clear:[0.042,0.054,0.07],amb:[0.26,0.287,0.329],a:[2.8,3.248,4.032],b:[1.344,2.464,4.032]},dayWork:{clear:[0.07,0.078,0.082],amb:[0.342,0.356,0.356],a:[4.816,4.48,3.808],b:[2.24,2.912,3.584]},darkWork:{clear:[0.03,0.034,0.042],amb:[0.177,0.191,0.218],a:[2.688,2.016,1.568],b:[0.896,1.904,3.136]},clinical:{clear:[0.062,0.074,0.082],amb:[0.356,0.37,0.384],a:[4.256,4.704,5.04],b:[2.24,3.472,4.592]},softClinical:{clear:[0.064,0.068,0.074],amb:[0.329,0.329,0.342],a:[4.704,4.032,3.248],b:[2.464,2.912,3.36]},stage:{clear:[0.028,0.03,0.038],amb:[0.163,0.163,0.204],a:[5.6,3.136,2.128],b:[1.568,2.016,3.584]},
 nightBlue:{clear:[0.028,0.046,0.07],amb:[0.191,0.246,0.315],a:[4.368,3.248,2.24],b:[1.344,2.912,4.704]},warmStreet:{clear:[0.046,0.052,0.062],amb:[0.246,0.26,0.287],a:[5.376,3.584,2.016],b:[1.568,2.688,4.032]},coldStreet:{clear:[0.034,0.046,0.06],amb:[0.232,0.26,0.301],a:[3.584,3.36,3.024],b:[1.344,2.576,4.032]},rain:{clear:[0.022,0.038,0.058],amb:[0.177,0.232,0.287],a:[3.248,2.912,2.576],b:[1.12,2.8,4.48]},fire:{clear:[0.07,0.034,0.022],amb:[0.26,0.163,0.122],a:[6.72,2.576,0.896],b:[3.92,0.896,0.336]},
 doku:{clear:[0.02,0.03,0.05],amb:[0.135,0.191,0.273],a:[0.56,3.136,5.376],b:[2.688,0.784,5.04]},map:{clear:[0.022,0.038,0.058],amb:[0.163,0.232,0.301],a:[0.784,2.688,4.48],b:[1.12,3.472,5.152]},dream:{clear:[0.034,0.026,0.06],amb:[0.191,0.149,0.287],a:[2.24,1.008,4.928],b:[0.896,2.464,4.816]},void:{clear:[0.012,0.014,0.018],amb:[0.073,0.087,0.115],a:[0.336,0.672,1.232],b:[0.896,0.336,1.68]},text:{clear:[0.034,0.034,0.038],amb:[0.246,0.246,0.273],a:[3.584,3.584,3.808],b:[1.344,1.792,2.464]},
 coldTransport:{clear:[0.034,0.046,0.062],amb:[0.273,0.301,0.329],a:[3.808,4.144,4.48],b:[1.344,2.464,3.808]},
 ancientWarm:{clear:[0.074,0.05,0.03],amb:[0.329,0.26,0.191],a:[5.824,3.36,1.456],b:[2.912,1.792,1.008]},ancientHot:{clear:[0.09,0.058,0.03],amb:[0.356,0.273,0.177],a:[6.496,3.808,1.68],b:[3.136,2.016,1.008]},ancientDust:{clear:[0.066,0.054,0.04],amb:[0.273,0.246,0.204],a:[4.592,3.472,2.352],b:[2.24,2.016,1.68]},ancientNight:{clear:[0.024,0.034,0.05],amb:[0.177,0.204,0.26],a:[5.6,3.136,1.344],b:[0.896,1.904,3.584]},
 greenNature:{clear:[0.034,0.054,0.058],amb:[0.246,0.301,0.273],a:[4.704,3.92,2.576],b:[1.344,2.688,3.472]},dryNature:{clear:[0.074,0.06,0.042],amb:[0.315,0.273,0.218],a:[5.376,4.032,2.576],b:[2.464,2.24,1.904]},nightNature:{clear:[0.02,0.034,0.05],amb:[0.149,0.204,0.26],a:[3.024,2.464,1.792],b:[0.896,2.016,3.696]},coldNature:{clear:[0.038,0.05,0.064],amb:[0.232,0.273,0.315],a:[3.808,3.696,3.472],b:[1.232,2.688,4.032]},waterNature:{clear:[0.024,0.05,0.07],amb:[0.204,0.273,0.301],a:[4.032,3.584,2.688],b:[0.896,2.8,4.48]},campfire:{clear:[0.03,0.034,0.042],amb:[0.163,0.191,0.218],a:[6.72,3.024,0.896],b:[0.896,1.904,3.136]},storm:{clear:[0.022,0.032,0.044],amb:[0.163,0.204,0.246],a:[2.688,2.688,2.8],b:[0.896,1.904,3.136]},dawn:{clear:[0.09,0.058,0.06],amb:[0.315,0.273,0.273],a:[5.824,3.136,2.464],b:[2.464,2.8,3.808]},sandstorm:{clear:[0.086,0.06,0.038],amb:[0.273,0.232,0.177],a:[4.48,3.136,1.68],b:[2.8,2.016,1.12]},
 cave:{clear:[0.018,0.022,0.028],amb:[0.122,0.135,0.149],a:[4.256,2.24,0.896],b:[0.56,1.68,2.8]},caveWater:{clear:[0.016,0.026,0.034],amb:[0.122,0.163,0.191],a:[2.576,1.904,1.232],b:[0.448,2.352,3.584]},tomb:{clear:[0.02,0.018,0.018],amb:[0.122,0.108,0.108],a:[4.816,2.016,0.672],b:[1.344,0.896,0.56]},dokuCave:{clear:[0.014,0.022,0.036],amb:[0.108,0.149,0.218],a:[0.56,3.024,5.152],b:[2.24,0.672,4.256]}
};
function applyAtlasMood(loc,type){
 const d=LOCATION_DESIGN[loc],m=MOOD_PRESETS[d?.mood]||MOOD_PRESETS.nightBlue;
 const mood=(d?.mood||'nightBlue');
 const deep=/cave|tomb|void|doku|night|storm|fire/i.test(mood);
 const minAmb=deep?[.235,.250,.275]:[.345,.355,.370];
 const minClr=deep?[.038,.048,.064]:[.078,.088,.105];
 atlasClear=[Math.max(m.clear[0],minClr[0]),Math.max(m.clear[1],minClr[1]),Math.max(m.clear[2],minClr[2])];
 const boost=deep?1.12:1.18;
 WORLD_LIGHTS[10]={pos:[AX-3.7,2.7,AZ+2.4],color:m.a.map(v=>v*boost),att:.070};
 WORLD_LIGHTS[11]={pos:[AX+3.6,2.0,AZ-3.0],color:m.b.map(v=>v*boost),att:.070};
 let amb=[Math.max(m.amb[0],minAmb[0]),Math.max(m.amb[1],minAmb[1]),Math.max(m.amb[2],minAmb[2])];
 // Bölüm 8 gündelik, okunabilir bir akşam caddesi: korku oyunu karanlığı değil.
 if(loc==='bakeryStreet'){
   atlasClear=[Math.max(atlasClear[0],.105),Math.max(atlasClear[1],.100),Math.max(atlasClear[2],.105)];
   WORLD_LIGHTS[10]={pos:[AX-3.8,3.1,AZ+3.2],color:[.98,.78,.54],att:.045};
   WORLD_LIGHTS[11]={pos:[AX+3.7,2.8,AZ-2.8],color:[.60,.80,.96],att:.050};
   amb=[Math.max(amb[0],.46),Math.max(amb[1],.45),Math.max(amb[2],.44)];
 }
 uploadLights();
 gl.uniform3f(U.ambient,amb[0],amb[1],amb[2]);
}
function setAtlasLights(loc,type){applyAtlasMood(loc,type);}
function restoreWorldLights(){WORLD_LIGHTS[10]=CAVE_LIGHT_A;WORLD_LIGHTS[11]=CAVE_LIGHT_B;uploadLights();document.body.dataset.filmSpecial='';}

const objs=[];
function box(name,x,y,z,sx,sy,sz,texture='wall',color=[1,1,1,1],uv=[1,1],ry=0,em=.0){
 const o={name,kind:'box',x,y,z,sx,sy,sz,texture,color:normalizeRGBA(color),uv:Array.isArray(uv)?uv:[1,1],ry:Number.isFinite(ry)?ry:0,em:Number.isFinite(em)?em:0};objs.push(o);return o;
}
function sprite(name,x,z,h,w,texture){
 objs.push({name,kind:'sprite',x,y:0,z,h,w,texture,color:[1,1,1,1]});
}

const atlasObjs=[],atlasCollisions=[],atlasDynamicCollisions=[],atlasGroundZones=[];
let atlasChairSeq=0;
const AX=260,AZ=0;
function abox(name,x,y,z,sx,sy,sz,texture='wall',color=[1,1,1,1],uv=[1,1],ry=0,em=.0){const o={name,kind:'box',x,y,z,sx,sy,sz,texture,color:normalizeRGBA(color),uv:Array.isArray(uv)?uv:[1,1],ry:Number.isFinite(ry)?ry:0,em:Number.isFinite(em)?em:0};atlasObjs.push(o);return o;}
function acoll(x1,z1,x2,z2){atlasCollisions.push([x1,z1,x2,z2]);}
function h32(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function palFor(loc){const h=h32(loc),q=(h%1000)/1000;return {a:[.24+.10*q,.22+.07*((h>>3)%9)/9,.20+.08*((h>>6)%9)/9,1],b:[.52+.16*((h>>9)%7)/7,.43+.12*((h>>12)%7)/7,.32+.10*((h>>15)%7)/7,1],c:[.12+.08*q,.18+.10*((h>>4)%8)/8,.22+.12*((h>>8)%8)/8,1]};}

function marker(loc){const p=palFor(loc);abox('atlasMarkerBase',AX,.08,AZ,1.5,.16,1.5,'wood',p.b,[1,1],0,.12);abox('atlasMarker',AX,.88,AZ,.16,1.55,.16,'white',[.35,.78,1,1],[1,1],0,.88);abox('atlasMarkerGlow',AX,1.62,AZ,.50,.05,.50,'white',[.34,.86,1,1],[1,1],0,.96);}
function bounds(size=7){acoll(AX-size-.25,AZ-size-.25,AX+size+.25,AZ-size+.05);acoll(AX-size-.25,AZ+size+.05,AX+size+.25,AZ+size+.25);acoll(AX-size-.25,AZ-size-.25,AX-size+.05,AZ+size+.25);acoll(AX+size-.05,AZ-size-.25,AX+size+.25,AZ+size+.25);}
function arot(lx,lz,cx=AX,cz=AZ,ry=0){return [cx+Math.cos(ry)*lx+Math.sin(ry)*lz, cz-Math.sin(ry)*lx+Math.cos(ry)*lz];}
function awindow(x,y,z,w=.95,h=1.2,side=1,glow=[.48,.68,.84,1]){abox('winFrame',x,y,z,.10,h+.12,w+.12,'wood',[.22,.20,.19,1]);abox('winGlass',x-side*.055,y,z,.025,h,w,'white',glow,[1,1],0,.38)}
function apicture(x,y,z,w=1.4,h=.9){abox('picFrame',x,y,z,w+.10,h+.10,.04,'wood',[.26,.22,.18,1]);abox('picArt',x,y,z-.025,w,h,.02,'white',[.42,.45,.46,1],[1,1],0,.18)}
function afluor(x,y,z,len=1.1){abox('fluorBody',x,y,z,len,.08,.20,'white',[.38,.40,.42,1]);abox('fluorGlow',x,y-.05,z,len*.82,.02,.12,'white',[.95,.97,1,1],[1,1],0,.90)}
function alamp(x,y,z,warm=true){abox('lampStand',x,y,z,.10,.55,.10,'white',[.28,.28,.29,1]);abox('lampHead',x,y+.32,z,.34,.10,.34,'white',warm?[1,.76,.42,1]:[.60,.82,1,1],[1,1],0,.92)}
function aplant(x,z,s=1){abox('pot',x,.22,z,.50*s,.38*s,.50*s,'wood',[.43,.31,.21,1]);for(let i=0;i<5;i++){const dx=(i-2)*.12*s;abox('leaf'+i,x+dx,.78+.06*(i%2),z,.12*s,.85*s,.12*s,'white',[.20+.06*i,.46+.03*i,.26,1],[1,1],0,.20);}}
function achair(x,z,ry=0,c=[.58,.50,.44,1]){
 const a=(lx,lz)=>arot(lx,lz,x,z,ry),id='chair'+(++atlasChairSeq),parts=[];
 const tag=(o,role)=>{o.ctxChairId=id;o.ctxChairRole=role;o.ctxChairCenter={x,z,ry};parts.push(o);return o;};
 tag(abox('chairSeat',x,.48,z,.68,.11,.68,'wood',c,[1,1],ry),'seat');
 let p=a(0,.28);tag(abox('chairBack',p[0],.85,p[1],.68,.68,.10,'wood',c,[1,1],ry),'back');
 let leg=0;for(const dx of[-.26,.26])for(const dz of[-.26,.26]){p=a(dx,dz);tag(abox('chairLeg',p[0],.22,p[1],.06,.44,.06,'wood',[.34,.30,.27,1],[1,1],ry),'leg'+(++leg));}
 return parts;
}
function atable(x,z,w=2.1,d=1.1,h=.74,c=[.56,.45,.34,1]){abox('tableTop',x,h,z,w,.10,d,'wood',c);for(const dx of[-w/2+.12,w/2-.12])for(const dz of[-d/2+.12,d/2-.12])abox('tableLeg',x+dx,h/2,z+dz,.10,h,.10,'wood',[.32,.28,.24,1])}
function ashelf(x,z,w=.9,h=2.4,d=2.8,c=[.50,.40,.30,1]){abox('shelfBody',x,h/2,z,w,h,d,'wood',c,[1,4]);for(let yy=.35;yy<h-.2;yy+=.55)abox('shelfRow',x,yy,z,w+.04,.05,d+.04,'wood',[.30,.26,.22,1]);for(let yy=.22;yy<h-.4;yy+=.42){for(let zz=z-d/2+.24;zz<z+d/2-.2;zz+=.28)abox('book',x,yy,zz,.16,.26,.09,'white',[.24+((yy*10)%5)*.08,.16+((zz*10)%5)*.05,.14+((yy*7)%5)*.04,1],[1,1],0,.10)}}
function adoor(x,z,ry=0){const p=arot(0,0,x,z,ry);abox('doorLeaf',p[0],1.05,p[1],.96,2.10,.08,'wood',[.48,.38,.30,1],[1,2],ry);const l=arot(-.54,0,x,z,ry),r=arot(.54,0,x,z,ry);abox('doorL',l[0],1.08,l[1],.08,2.18,.12,'wood',[.24,.22,.20,1],[1,1],ry);abox('doorR',r[0],1.08,r[1],.08,2.18,.12,'wood',[.24,.22,.20,1],[1,1],ry);abox('doorTop',x,2.17,z,1.12,.08,.12,'wood',[.24,.22,.20,1],[1,1],ry);const h=arot(.30,-.06,x,z,ry);abox('doorHandle',h[0],1.00,h[1],.10,.04,.05,'white',[.70,.70,.68,1],[1,1],ry,.25)}
function astreetLamp(x,z,warm=true){abox('lampPole',x,1.25,z,.10,2.50,.10,'white',[.15,.16,.18,1]);abox('lampHead',x,2.50,z,.32,.10,.32,'white',[.18,.18,.20,1]);abox('lampGlow',x,2.42,z,.24,.02,.24,'white',warm?[1,.70,.35,1]:[.55,.82,1,1],[1,1],0,.95)}
function aroof(x,z,w=3.0,d=3.4,c=[.28,.18,.14,1]){abox('roof',x,2.95,z,w,.18,d,'wood',c,[2,2],0,.12)}
function colByName(loc,name){const p=palFor(loc),s=(h32(loc+name)%1000)/1000;return [.20+.55*s*.8,.16+.40*((h32(name+loc)>>4)%100)/100,.14+.35*((h32(loc+name)>>8)%100)/100,1]}
function isAny(loc,arr){const low=loc.toLowerCase();return arr.some(a=>low.includes(a.toLowerCase()))}

// ---------- v4.3.0: ANA FİLM SETLERİ ----------
// Sık görülen mekânlar artık jenerik oda değildir; hikâyedeki işlevlerine göre kalıcı bir görsel kimlik taşır.
function asetPanel(x,y,z,w,h,c=[.14,.22,.28,1],em=.12){
  abox('setPanelFrame',x,y,z,w+.12,h+.12,.055,'wood',[.16,.17,.18,1]);
  abox('setPanel',x,y,z-.035,w,h,.025,'white',c,[1,1],0,em);
}
function asetPaper(x,z,n=4){
  for(let i=0;i<n;i++)abox('setPaper'+i,x+(i%2)*.035,.79+i*.018,z+(i%3)*.025,.58,.018,.42,'white',[.84,.82,.76,1],[1,1],(i%2?-.025:.02),.03);
}
function asetMug(x,z,c=[.48,.30,.22,1]){
  abox('setMug',x,.88,z,.16,.20,.16,'white',c,[1,1],0,.08);
  abox('setMugHandle',x+.12,.88,z,.07,.10,.04,'white',c,[1,1],0,.06);
}
function asetMonitor(x,z,w=1.05,h=.62,glow=[.15,.48,.70,1],ry=0){
  abox('setMonitorBack',x,1.34,z,w+.12,h+.12,.10,'white',[.08,.09,.10,1],[1,1],ry,.02);
  abox('setMonitorGlow',x,1.34,z-.06,w,h,.025,'white',glow,[1,1],ry,.42);
  abox('setMonitorStand',x,1.00,z,.10,.35,.10,'white',[.18,.19,.20,1],[1,1],ry,.02);
}
function asetCamera(x,z,ry=0){
  abox('setCamTripod',x,.78,z,.07,1.45,.07,'white',[.14,.15,.16,1],[1,1],ry,.02);
  abox('setCamBody',x,1.48,z,.48,.30,.34,'white',[.07,.08,.09,1],[1,1],ry,.03);
  const p=arot(0,-.24,x,z,ry);
  abox('setCamLens',p[0],1.48,p[1],.18,.18,.16,'white',[.04,.06,.08,1],[1,1],ry,.18);
}
function asetBottle(x,z,c=[.18,.54,.72,1]){
  abox('setBottle',x,.97,z,.10,.27,.10,'white',c,[1,1],0,.22);
  abox('setBottleCap',x,1.13,z,.07,.05,.07,'white',[.78,.80,.82,1],[1,1],0,.08);
}
function asetPinboard(x,y,z,w=2.4,h=1.35){
  abox('setPinBoard',x,y,z,w,h,.055,'wood',[.35,.27,.20,1]);
  for(let r=0;r<2;r++)for(let c=0;c<3;c++){
    abox('setNote',x-w*.30+c*w*.30,y+h*.20-r*h*.38,z-.035,w*.22,h*.27,.018,'white',
         [(c%2?.76:.86),(r?.76:.84),.66,1],[1,1],((r+c)%2?-.035:.028),.05);
  }
}
function asetFloorCable(x,z,len=2.2,ry=0){
  abox('setCable',x,.018,z,.035,.018,len,'white',[.055,.06,.065,1],[1,1],ry,.01);
}
function heroSetDetails(loc,type){
  const L=String(loc||'').toLowerCase();

  // MAHİR'İN OFİSİ — terapi/grup seansı + kişisel çalışma alanı + kilitli arka kapı.
  if(loc==='office'){
    // Grup seansı halkası
    const seats=[[-2.3,1.4,.40],[-.8,2.25,.15],[.8,2.25,-.15],[2.3,1.4,-.40]];
    for(const [dx,dz,ry] of seats)achair(AX+dx,AZ+dz,ry,[.38,.34,.31,1]);
    atable(AX,AZ+.45,1.05,.78,.40,[.43,.34,.27,1]);
    asetMug(AX-.22,AZ+.45,[.24,.33,.38,1]);
    asetPaper(AX+.20,AZ+.40,3);

    // Mahir'in çalışma köşesi
    atable(AX-4.55,AZ-3.8,2.45,1.05,.74,[.40,.32,.26,1]);
    asetMonitor(AX-4.75,AZ-4.14,.92,.54,[.12,.36,.48,1]);
    asetPaper(AX-4.0,AZ-3.65,5);
    asetMug(AX-5.25,AZ-3.55,[.34,.24,.18,1]);
    alamp(AX-3.75,.95,AZ-3.92,true);
    asetPinboard(AX+4.95,1.70,AZ-6.86,2.55,1.25);

    // Arka kapı – Bölüm 1'in görsel odağı.
    adoor(AX+5.85,AZ+6.88,0);
    abox('officeBackDoorPlate',AX+5.85,1.82,AZ+6.80,.72,.20,.025,'white',[.16,.18,.19,1],[1,1],0,.08);
    abox('officeLock',AX+6.15,1.04,AZ+6.75,.11,.16,.08,'white',[.68,.66,.60,1],[1,1],0,.20);
    // Bant izi / kayıt kamerası: sonraki bölümlere de anlamlı continuity.
    asetCamera(AX+4.15,AZ+4.9,-.62);
    asetFloorCable(AX+3.3,AZ+4.3,2.3,-.35);
  }

  // NİSAN'IN LABORATUVARI — deney masası, kayıt duvarı, üç kamera ve numune düzeni.
  if(loc==='lab' || loc==='visionlab'){
    // Merkez deney masası
    atable(AX,AZ+.25,3.6,1.55,.78,[.55,.58,.60,1]);
    abox('labTray',AX,.855,AZ+.18,1.00,.045,.72,'white',[.72,.76,.78,1],[1,1],0,.08);
    abox('labDie',AX-.18,.94,AZ+.10,.17,.17,.17,'white',[.92,.92,.88,1],[1,1],.28,.10);
    // üç bağımsız kayıt ekranı
    asetMonitor(AX-2.25,AZ-5.50,1.08,.64,[.12,.42,.70,1]);
    asetMonitor(AX,AZ-5.50,1.08,.64,[.16,.62,.72,1]);
    asetMonitor(AX+2.25,AZ-5.50,1.08,.64,[.62,.18,.34,1]);
    for(const x of[-2.25,0,2.25])asetFloorCable(AX+x,AZ-4.6,1.65,0);

    // kayıt kameraları fiziksel olarak farklı açılarda
    asetCamera(AX-4.7,AZ+1.6,.82);
    asetCamera(AX+4.7,AZ+1.6,-.82);
    asetCamera(AX,AZ+5.0,Math.PI);
    // numune rafı / pipet / şişeler
    abox('labSampleShelf',AX+5.85,1.30,AZ-3.55,.72,2.30,2.60,'wood',[.40,.44,.46,1],[1,4]);
    for(let r=0;r<4;r++)for(let c=0;c<4;c++)asetBottle(AX+5.62+(c%2)*.18,AZ-4.35+r*.55,
      c%3===0?[.30,.70,.82,1]:c%3===1?[.64,.32,.70,1]:[.26,.60,.46,1]);
    asetPanel(AX-5.95,1.68,AZ-3.4,.06,1.55,[.08,.24,.30,1],.24);
    // Nisan'ın not alanı
    asetPinboard(AX-3.9,1.70,AZ-6.86,2.8,1.4);
    asetPaper(AX-3.7,AZ-2.1,6);
  }

  // EV — Mahir/Mina yaşamı: işlevsel mobilya yanında kişisel izler.
  if(type==='home' && !/burn|past|alt/.test(L)){
    // Mina'nın çalışma alanı ve yıldız haritası
    atable(AX+2.85,AZ-4.75,2.35,1.00,.74,[.44,.35,.28,1]);
    asetPaper(AX+2.55,AZ-4.65,5);
    abox('minaPencilCup',AX+3.55,.90,AZ-4.72,.17,.25,.17,'white',[.42,.22,.32,1]);
    for(let i=0;i<7;i++){
      const x=AX+.55+i*.58, y=1.55+((i*17)%5)*.18;
      abox('minaStar'+i,x,y,AZ-6.89,.12,.12,.025,'white',
           i%2?[.94,.78,.34,1]:[.60,.75,1,1],[1,1],i*.20,.38);
    }
    abox('starLineA',AX+2.1,1.88,AZ-6.87,2.6,.025,.02,'white',[.55,.68,.82,1],[1,1],.18,.16);
    abox('starLineB',AX+2.1,1.60,AZ-6.87,2.2,.025,.02,'white',[.55,.68,.82,1],[1,1],-.14,.16);

    // Aile fotoğraf köşesi
    apicture(AX-1.8,1.65,AZ-6.87,.72,.54);
    apicture(AX-1.0,1.72,AZ-6.87,.62,.46);
    apicture(AX-.25,1.60,AZ-6.87,.78,.58);
    // kapı yanında gündelik izler
    abox('shoeL',AX-1.0,.09,AZ+5.85,.42,.16,.20,'white',[.18,.16,.15,1],[1,1],-.12,.02);
    abox('shoeR',AX-.55,.09,AZ+5.92,.42,.16,.20,'white',[.20,.18,.17,1],[1,1],.10,.02);
    abox('coatHook',AX+1.25,1.78,AZ+6.84,.07,.42,.07,'white',[.26,.24,.22,1]);
    abox('coat',AX+1.25,1.32,AZ+6.76,.72,1.00,.12,'rug',[.20,.24,.30,1],[1,1],0,.06);
  }

  // ÜNİVERSİTE — akademik çalışma / ölçüm hissi.
  if(/university/.test(L)){
    for(let r=0;r<3;r++)for(let c=-2;c<=2;c++){
      atable(AX+c*1.75,AZ-1.0+r*1.65,1.35,.58,.70,[.46,.39,.32,1]);
      achair(AX+c*1.75,AZ-.35+r*1.65,Math.PI,[.34,.35,.36,1]);
    }
    asetPanel(AX,1.85,AZ-6.86,5.6,1.65,[.08,.22,.16,1],.10);
    for(let i=0;i<5;i++)abox('uniFormula'+i,AX-2.1+i*1.0,1.85+(i%2)*.22,AZ-6.91,.55,.035,.015,'white',[.75,.82,.78,1],[1,1],i*.10,.15);
    asetPinboard(AX+5.90,1.65,AZ+1.8,.06,1.55);
  }

  // HASTANE — yatak başı monitör, serum, perde ve doktor çalışma noktası.
  if(/hospital/.test(L)){
    abox('heroBed',AX-2.6,.48,AZ+2.25,2.25,.42,4.10,'white',[.76,.79,.81,1]);
    abox('heroPillow',AX-2.6,.74,AZ+.78,1.36,.22,.72,'white',[.90,.91,.91,1]);
    asetMonitor(AX+.05,AZ+.55,1.12,.64,[.10,.40,.45,1]);
    // ECG çizgisi / cihaz ışıkları
    for(let i=0;i<6;i++)abox('hospLed'+i,AX-.36+i*.14,1.34+(i%2)*.06,AZ+.48,.07,.025,.018,'white',
                             i===3?[.88,.22,.20,1]:[.20,.88,.54,1],[1,1],0,.72);
    abox('ivPole',AX-4.35,1.35,AZ+1.2,.07,2.70,.07,'white',[.56,.58,.60,1]);
    abox('ivBag',AX-4.35,2.33,AZ+1.2,.34,.46,.10,'white',[.72,.86,.90,.65],[1,1],0,.16);
    asetFloorCable(AX-.8,AZ+1.35,2.1,.45);
    atable(AX+4.2,AZ-3.7,2.3,1.0,.76,[.54,.55,.56,1]);
    asetPaper(AX+3.75,AZ-3.7,6);
    asetMug(AX+4.85,AZ-3.7,[.18,.30,.34,1]);
  }

  // YÖNETİM ODASI — kayıt karşılaştırma ve teknik inceleme merkezi.
  if(loc==='management'){
    atable(AX,AZ+.8,5.2,1.55,.78,[.43,.36,.30,1]);
    for(const x of[-1.7,0,1.7])asetMonitor(AX+x,AZ-4.95,1.18,.68,
      x<0?[.13,.37,.58,1]:x>0?[.50,.18,.26,1]:[.18,.50,.55,1]);
    asetPaper(AX-1.8,AZ+.65,7);
    asetPaper(AX+1.7,AZ+.72,5);
    asetPinboard(AX+5.92,1.62,AZ-2.0,.06,1.6);
    asetCamera(AX-4.9,AZ+4.25,.55);
  }

  // Ortak gerçekçilik: setin köşelerinde simetriyi kıran küçük yaşanmışlık ayrıntıları.
  if(['work','home'].includes(type)){
    if((h32(loc+'umbrella')%2)===0)abox('setUmbrella',AX-5.9,.62,AZ+5.7,.10,1.18,.10,'white',[.16,.19,.22,1],[1,1],.18,.02);
    if((h32(loc+'box')%3)===0)abox('setStorageBox',AX+5.35,.24,AZ+5.45,.86,.48,.62,'wood',[.40,.32,.24,1],[1,1],.06,.02);
  }
}

// ---------- v5.4.0: GERÇEKÇİ MEKÂN PAKET MOTORU ----------
// 108 mekân için manifest hazırdır. Aşağıdaki hero paketler mevcut kutu renderer'ı gerçek dünya
// işlev zonlarıyla zenginleştirir. GLB/PBR slotları scene.json içinde ayrıdır; gerçek model yoksa
// sahte model kullanılmaz ve procedural-pro set güvenli fallback olarak kalır.
function locationPackSetDetails(loc,type){
 const pack=window.TELKIN_LOCATION_PACKS?.[loc];if(!pack)return;
 const profile=pack.profile||'';
 const tag='pack_'+(pack.pack||loc)+'_';
 // Gerçek ölçek hissi veren ortak detaylar: priz, süpürgelik kırığı, tabela ve servis ekipmanı.
 if(type==='work'||type==='home'){
   abox(tag+'outlet',AX+6.86,.38,AZ-2.35,.025,.20,.34,'white',[.78,.78,.75,1],[1,1],0,.03);
   abox(tag+'switch',AX+6.86,1.24,AZ+4.30,.025,.22,.16,'white',[.76,.76,.73,1],[1,1],0,.03);
 }
 if(profile==='old-office'){
   // Bekleme köşesi + dosya dolabı + eski iş hanı radyatörü. Merkez rota boş kalır.
   for(let i=0;i<3;i++)abox(tag+'fileCab'+i,AX+5.72,.52+i*.50,AZ-3.7,.72,.46,1.55,'white',[.37,.39,.40,1],[1,1],0,.02);
   abox(tag+'radiator',AX-6.82,.62,AZ+1.9,.12,1.05,2.15,'white',[.63,.62,.58,1],[1,3],0,.02);
   achair(AX-5.35,AZ+4.55,.35,[.31,.32,.33,1]);
   abox(tag+'coatRack',AX-5.90,1.05,AZ+5.45,.08,2.05,.08,'wood',[.27,.22,.19,1]);
   abox(tag+'acousticA',AX-2.65,2.20,AZ-6.86,1.55,.52,.035,'rug',[.29,.31,.34,1],[1,1],0,.03);
   abox(tag+'acousticB',AX-.85,2.20,AZ-6.86,1.55,.52,.035,'rug',[.29,.31,.34,1],[1,1],0,.03);
 }
 if(profile==='research-lab'){
   // Islak tezgâh, lavabo, cam gözlem şeridi ve cihaz bankosu.
   abox(tag+'wetBench',AX-5.65,.82,AZ+.10,1.30,1.64,4.9,'white',[.60,.63,.64,1],[1,3]);
   abox(tag+'sink',AX-5.40,.96,AZ+1.25,.72,.10,.92,'white',[.31,.35,.36,1],[1,1],0,.06);
   abox(tag+'faucet',AX-5.42,1.21,AZ+1.08,.08,.45,.08,'white',[.50,.53,.54,1],[1,1],0,.12);
   for(let i=0;i<5;i++)abox(tag+'glass'+i,AX-2.8+i*1.40,1.70,AZ-6.82,1.25,1.75,.025,'white',[.56,.75,.82,.18],[1,1],0,.12);
   for(let i=0;i<4;i++){abox(tag+'instrument'+i,AX+4.75,.96,AZ-1.9+i*.85,.80,.42,.62,'white',[.30,.34,.37,1]);abox(tag+'instLed'+i,AX+4.34,1.02,AZ-1.9+i*.85,.025,.08,.16,'white',[.15,.82,.68,1],[1,1],0,.72);}
 }
 if(profile==='lived-apartment'){
   // Mutfak hattı + buzdolabı + yemek masası; salon hâlâ dolaşılabilir.
   abox(tag+'kitchenCounter',AX+5.70,.48,AZ-1.4,1.15,.96,4.65,'wood',[.49,.44,.39,1],[1,2]);
   abox(tag+'counterTop',AX+5.70,1.01,AZ-1.4,1.24,.10,4.75,'white',[.60,.59,.56,1]);
   abox(tag+'fridge',AX+5.45,1.05,AZ-4.55,1.02,2.10,1.02,'white',[.68,.69,.68,1]);
   abox(tag+'sink',AX+5.54,1.08,AZ-.35,.68,.08,.90,'white',[.32,.35,.35,1]);
   atable(AX-3.85,AZ+3.95,2.30,1.20,.74,[.46,.35,.27,1]);
   achair(AX-4.55,AZ+4.72,.1,[.45,.38,.33,1]);achair(AX-3.15,AZ+4.72,-.1,[.45,.38,.33,1]);
   abox(tag+'magnetA',AX+4.91,1.35,AZ-4.80,.025,.20,.18,'white',[.82,.26,.30,1],[1,1],0,.18);
   abox(tag+'magnetB',AX+4.91,1.64,AZ-4.56,.025,.18,.18,'white',[.25,.52,.82,1],[1,1],0,.18);
 }
 if(profile==='clinic-room'){
   // Mahremiyet perdesi rayı, medikal gaz paneli, el antiseptiği ve crash cart.
   abox(tag+'curtainRail',AX-2.6,2.72,AZ+2.25,3.55,.055,4.90,'white',[.57,.59,.61,1]);
   for(let i=0;i<5;i++)abox(tag+'curtain'+i,AX-4.18+i*.79,1.62,AZ+4.62,.70,2.10,.025,'rug',[.66,.76,.78,.72],[1,1],0,.02);
   abox(tag+'gasPanel',AX-2.6,1.62,AZ-6.84,2.50,.50,.04,'white',[.79,.80,.78,1]);
   for(let i=0;i<4;i++)abox(tag+'gasPort'+i,AX-3.25+i*.43,1.62,AZ-6.80,.18,.18,.03,'white',i%2?[.25,.58,.76,1]:[.78,.58,.22,1],[1,1],0,.16);
   abox(tag+'sanitizer',AX+5.96,1.34,AZ+4.60,.18,.38,.14,'white',[.80,.88,.88,1]);
   abox(tag+'crashCart',AX+4.95,.58,AZ+1.95,1.00,1.15,.72,'white',[.48,.53,.55,1]);
 }
 if(profile==='university-lab'){
   // Akademik depolama, projeksiyon alanı ve ekipman arabası.
   ashelf(AX-5.85,AZ-3.40,.72,2.25,3.2,[.38,.32,.27,1]);
   abox(tag+'projector',AX,2.72,AZ+.70,.65,.22,.48,'white',[.28,.30,.31,1]);
   abox(tag+'screen',AX,1.65,AZ-6.78,4.80,1.55,.04,'white',[.87,.87,.83,1],[1,1],0,.05);
   abox(tag+'cart',AX+5.30,.55,AZ+3.80,1.00,1.05,.78,'white',[.33,.36,.37,1]);
 }
 if(profile==='document-archive'){
   // Raf adaları kenarlara alınır; servis koridoru ortada açık kalır.
   for(let z=-4.5;z<=2.8;z+=2.45){ashelf(AX-5.78,AZ+z,.72,2.25,1.90,[.37,.31,.25,1]);ashelf(AX+5.78,AZ+z,.72,2.25,1.90,[.37,.31,.25,1]);}
   atable(AX,AZ-4.95,2.6,1.0,.74,[.42,.34,.27,1]);
   asetPaper(AX-.45,AZ-4.95,8);
   for(let i=0;i<5;i++)abox(tag+'archiveBox'+i,AX+3.75+i*.48,.36,AZ+4.95,.42,.55,.66,'wood',[.53,.43,.31,1],[1,1],0,.02);
 }
 if(profile==='street-cafe'){
   // Servis bankosu, espresso makinesi, menü panosu ve küçük masa cepleri.
   abox(tag+'counter',AX-5.55,.58,AZ-2.15,1.25,1.15,5.0,'wood',[.40,.29,.22,1]);
   abox(tag+'espresso',AX-5.20,1.35,AZ-3.1,.65,.65,.72,'white',[.16,.17,.18,1]);
   asetPanel(AX-5.96,1.95,AZ+1.4,.06,2.6,[.07,.10,.09,1],.08);
   for(const [x,z] of[[2.6,-3.8],[4.6,-1.1],[2.8,2.0]]){atable(AX+x,AZ+z,1.25,.82,.72,[.45,.34,.25,1]);achair(AX+x-.55,AZ+z+.72,.2,[.38,.33,.30,1]);achair(AX+x+.55,AZ+z+.72,-.2,[.38,.33,.30,1]);}
 }
 if(profile==='bakery-street'){
   // Fırın kimliği: tente, ekmek rafı ve servis kasaları; görev lane'ine girmez.
   abox(tag+'awning',AX+6.50,2.45,AZ-5.55,4.4,.16,1.5,'rug',[.58,.18,.13,1],[1,1],0,.04);
   for(let i=0;i<4;i++)abox(tag+'breadRack'+i,AX+7.15,.50+i*.38,AZ-4.75,.72,.30,1.85,'wood',[.46,.34,.23,1]);
   for(let i=0;i<3;i++)abox(tag+'deliveryCrate'+i,AX-6.35+i*.72,.26,AZ-5.45,.58,.52,.76,'wood',[.37,.27,.18,1]);
 }
 if(profile==='school-night'){
   // Gerçek okul cephesi: kapı, isimlik, bahçe bankı ve aydınlık sınıf pencereleri.
   abox(tag+'schoolFacade',AX,2.45,AZ-7.5,15.5,4.9,1.20,'wall',[.42,.46,.48,1],[6,2]);
   adoor(AX,AZ-6.86,0);
   asetPanel(AX,4.20,AZ-6.84,4.4,.55,[.10,.23,.34,1],.12);
   for(let i=-3;i<=3;i++)if(i!==0)abox(tag+'classWindow'+i,AX+i*1.85,2.35,AZ-6.82,1.25,1.35,.025,'white',[.92,.78,.50,1],[1,1],0,.42);
   abox(tag+'yardBench',AX-4.8,.48,AZ+2.65,2.2,.15,.68,'wood',[.33,.27,.22,1]);
 }
 if(profile==='rail-station'){
   // Platform hattı; tehlikeli ray kenarı yalnız görsel, görev lane'i güvenli tarafta.
   abox(tag+'platform',AX,-.02,AZ,13.5,.12,12.5,'floor',[.42,.43,.43,1],[7,6]);
   abox(tag+'warningLine',AX+5.75,.045,AZ, .22,.035,12.2,'white',[.92,.72,.16,1],[1,1],0,.12);
   abox(tag+'trackBed',AX+7.2,-.16,AZ,2.6,.20,12.5,'white',[.16,.17,.18,1]);
   for(let z=-5;z<=5;z+=2.0)abox(tag+'sleeper',AX+7.2,-.02,AZ+z,2.5,.08,.28,'wood',[.31,.25,.21,1]);
   for(const z of[-2.7,2.7]){abox(tag+'bench',AX-3.9,.46,AZ+z,2.2,.14,.62,'wood',[.34,.28,.23,1]);}
   asetPanel(AX-5.92,1.90,AZ-2.8,.06,2.3,[.10,.22,.34,1],.16);
 }
 if(profile==='security-control'){
   // Bölüm 2 özel odası zaten ayrıntılı; yalnız duvar üstü kablo/UPS ve rack ekle.
   abox(tag+'serverRack',AX+6.10,1.15,AZ+4.75,.95,2.30,1.25,'white',[.16,.18,.20,1]);
   for(let i=0;i<6;i++)abox(tag+'rackLed'+i,AX+5.61,.55+i*.28,AZ+4.28,.025,.05,.35,'white',i%2?[.22,.90,.50,1]:[.22,.58,.90,1],[1,1],0,.72);
 }
}

function applyHeroSetLighting(loc){
  let amb=null;
  if(loc==='office'){
    WORLD_LIGHTS[10]={pos:[AX-4.6,2.55,AZ-3.5],color:[5.2,3.7,2.55],att:.060};
    WORLD_LIGHTS[11]={pos:[AX+3.8,2.20,AZ+2.2],color:[1.55,2.65,3.55],att:.072};
    amb=[.37,.35,.34];
  }else if(loc==='lab'||loc==='visionlab'){
    WORLD_LIGHTS[10]={pos:[AX-2.8,2.75,AZ-1.0],color:[3.25,4.35,5.15],att:.052};
    WORLD_LIGHTS[11]={pos:[AX+3.4,2.20,AZ+1.8],color:[1.40,3.10,4.20],att:.066};
    amb=[.38,.405,.425];
  }else if(/hospital/.test(String(loc).toLowerCase())){
    WORLD_LIGHTS[10]={pos:[AX-2.5,2.75,AZ+1.0],color:[4.15,4.65,5.05],att:.052};
    WORLD_LIGHTS[11]={pos:[AX+3.8,2.15,AZ-2.7],color:[2.20,3.25,3.85],att:.070};
    amb=[.39,.405,.42];
  }else if(LOC_INFO[loc]?.type==='home' && !/burn|past|alt/i.test(loc)){
    WORLD_LIGHTS[10]={pos:[AX+2.7,2.15,AZ+1.2],color:[5.55,3.75,2.25],att:.058};
    WORLD_LIGHTS[11]={pos:[AX-4.8,1.95,AZ-2.0],color:[1.80,2.35,2.80],att:.076};
    amb=[.36,.335,.315];
  }
  if(amb){uploadLights();gl.uniform3f(U.ambient,amb[0],amb[1],amb[2]);}
}

function buildRoom(loc,kind){
 const p=palFor(loc),low=loc.toLowerCase(),clinical=isAny(loc,['hospital','lab','therapy','university','management']),dark=isAny(loc,['night','archive','black','hidden']),corr=isAny(loc,['corridor']),archive=isAny(loc,['archive','storage']),hall=isAny(loc,['eventhall']),studio=isAny(loc,['studio']),homeVar=kind==='home';
 const floorC=clinical?[.58,.61,.63,1]:homeVar?[.36,.30,.26,1]:p.a,wallC=clinical?[.70,.72,.74,1]:dark?[.24,.24,.26,1]:[.55,.52,.49,1],ceilC=dark?[.12,.13,.15,1]:homeVar?[.27,.24,.23,1]:[.30,.31,.33,1];
 abox('atlasFloor',AX,-.055,AZ,14,.10,14,'floor',floorC,[7,7]);abox('atlasCeil',AX,3.05,AZ,14,.08,14,'wall',ceilC,[7,7]);abox('atlasN',AX,1.5,AZ-7,14,3,.18,'wall',wallC,[6,2]);abox('atlasS1',AX-4.3,1.5,AZ+7,5.4,3,.18,'wall',wallC,[3,2]);abox('atlasS2',AX+4.3,1.5,AZ+7,5.4,3,.18,'wall',wallC,[3,2]);abox('atlasW',AX-7,1.5,AZ,.18,3,14,'wall',wallC,[6,2]);abox('atlasE',AX+7,1.5,AZ,.18,3,14,'wall',wallC,[6,2]);
 for(let x=-6.3;x<=6.3;x+=2.1){abox('baseboardN',AX+x,.09,AZ-6.88,2.0,.18,.05,'wood',[.26,.24,.22,1]);abox('baseboardS',AX+x,.09,AZ+6.88,2.0,.18,.05,'wood',[.26,.24,.22,1])}
 bounds(7);
 adoor(AX,AZ+6.96,0);
 if(homeVar){
   awindow(AX-6.88,1.55,AZ-2.5,1.0,1.45,-1,[.96,.86,.62,1]);awindow(AX-6.88,1.55,AZ+1.4,1.0,1.45,-1,[.96,.86,.62,1]);
   abox('rug',AX,.012,AZ+.85,5.8,.02,4.0,'rug',[.66,.58,.50,1]);
   abox('sofaL',AX-4.0,.45,AZ-1.3,2.8,.82,1.15,'wood',[.38,.36,.34,1]);abox('sofaR',AX-4.0,.80,AZ-1.67,2.65,.16,.42,'wood',[.26,.24,.22,1]);
   atable(AX-1.1,AZ-1.0,2.2,1.1,.42,[.50,.40,.30,1]);
   achair(AX+1.8,AZ-.8,.2,[.52,.46,.40,1]);
   abox('bedBase',AX+3.95,.35,AZ+2.8,2.7,.35,4.2,'wood',[.46,.38,.30,1]);abox('mattress',AX+3.95,.56,AZ+2.8,2.55,.20,4.05,'white',[.70,.72,.74,1]);abox('blanket',AX+3.95,.69,AZ+3.0,2.35,.12,2.2,'rug',[.45,.48,.52,1]);
   abox('wardrobe',AX+5.45,1.2,AZ-3.2,1.6,2.4,1.2,'wood',[.48,.39,.29,1]);abox('dresser',AX+4.8,.70,AZ-.7,1.6,1.4,.8,'wood',[.50,.41,.31,1]);
   ashelf(AX-5.5,AZ+3.7,.75,2.25,2.6,[.42,.35,.29,1]);
   aplant(AX-5.0,AZ-5.0,.9);aplant(AX+5.6,AZ+5.0,.7);
   apicture(AX-1.1,1.7,AZ-4.4,1.6,.9);apicture(AX+4.0,1.55,AZ-4.5,1.1,.8);
   alamp(AX+2.9,.95,AZ+1.35,true);alamp(AX+5.0,.95,AZ+4.5,true);
   if(isAny(loc,['kitchen'])){abox('counter',AX-4.6,.90,AZ+4.8,3.0,1.8,.9,'wood',[.62,.62,.64,1]);abox('sink',AX-5.2,1.05,AZ+4.8,.8,.16,.55,'white',[.58,.62,.66,1]);abox('fridge',AX-2.9,1.35,AZ+4.8,1.0,2.7,.9,'white',[.78,.80,.82,1]);}
   if(isAny(loc,['balcony'])){abox('balconyRail',AX,1.0,AZ-6.6,9.0,1.0,.08,'white',[.20,.20,.22,1]);for(let x=-4;x<=4;x+=2)abox('baluster',AX+x,.55,AZ-6.6,.08,1.1,.08,'white',[.20,.20,.22,1]);abox('balFloor',AX,-.01,AZ-5.6,9.0,.06,2.0,'floor',[.30,.31,.32,1],[4,1]);}
   if(isAny(loc,['burninghouse'])){for(let i=0;i<4;i++)abox('fire'+i,AX-4+i*2.6,.55,AZ-2.8+(i%2)*3,.35,.9,.35,'white',[1,.34,.08,1],[1,1],0,.98)}
 } else if(corr){
   abox('corrRunner',AX,.01,AZ,2.1,.02,12.4,'rug',dark?[.18,.16,.19,1]:[.52,.54,.58,1]);
   for(let z=-4.8;z<=4.8;z+=3.2){adoor(AX-6.92,AZ+z,Math.PI/2);adoor(AX+6.92,AZ+z,-Math.PI/2);afluor(AX,2.88,AZ+z,1.2)}
   for(const side of[-1,1])for(let z=-3.6;z<=3.6;z+=3.6)abox('wallPanel',AX+side*6.5,.95,AZ+z,.08,1.4,1.2,'white',[.78,.80,.82,1],[1,1],0,.05);
   // v6.16: koridorun kuzey ucunda gerçekten basamak basamak yükselen kısa merdiven.
   // Bölüm hedefi (AZ-4.15) merdiven ağzında kalır; oyuncu isterse fiziksel olarak yukarı yürüyebilir.
   const stairSteps=[],stairW=2.55,stairD=.43,stairStart=AZ-4.72;
   for(let i=0;i<5;i++){const h=(i+1)*.10,z=stairStart-i*.43,o=abox('ctxStairStep'+i,AX,h*.5,z,stairW,h,stairD,'wall',[.43,.44,.45,1],[1,1]);stairSteps.push({x1:AX-stairW*.5,x2:AX+stairW*.5,z1:z-stairD*.5,z2:z+stairD*.5,y:h});}
   const landH=.50,landZ=AZ-6.72;abox('ctxStairLanding',AX,landH*.5,landZ,stairW,landH,.72,'wall',[.43,.44,.45,1],[1,1]);stairSteps.push({x1:AX-stairW*.5,x2:AX+stairW*.5,z1:landZ-.36,z2:landZ+.36,y:landH});
   atlasGroundZones.push({type:'steps',steps:stairSteps});
   for(const side of[-1,1]){abox('ctxStairRail',AX+side*1.42,.64,AZ-5.72,.08,1.10,2.55,'white',[.30,.31,.32,1]);acoll(AX+side*1.32-(side<0?.18:0),AZ-6.96,AX+side*1.32+(side>0?.18:0),AZ-4.43);}
 } else if(archive){
   for(let x=-4.2;x<=4.2;x+=2.1)ashelf(AX+x,AZ,.72,2.55,5.0,[.42,.34,.28,1]);
   afluor(AX,2.88,AZ-3.5,1.3);afluor(AX,2.88,AZ,1.3);afluor(AX,2.88,AZ+3.5,1.3);
   apicture(AX-5.0,1.65,AZ-4.3,1.2,.8);
 } else if(hall){
   abox('stage',AX,0.35,AZ-3.8,6.6,.70,3.2,'wood',[.28,.22,.18,1]);
   abox('screen',AX,2.0,AZ-5.9,4.6,2.2,.12,'white',[.88,.89,.92,1]);
   for(let row=0;row<3;row++)for(let col=-2;col<=2;col++)achair(AX+col*1.6,AZ+1.5+row*1.8,0,[.44,.38,.34,1]);
   alamp(AX-5.0,1.2,AZ-3.6,true);alamp(AX+5.0,1.2,AZ-3.6,true);
 } else if(studio){
   atable(AX-2.4,AZ-1.2,2.8,1.2,.72,[.38,.32,.26,1]);abox('cameraPod',AX+2.8,1.2,AZ-1.5,.22,2.4,.22,'white',[.18,.19,.20,1]);abox('cameraBody',AX+2.8,1.65,AZ-1.45,.70,.45,.35,'white',[.08,.09,.10,1]);abox('softLight',AX+4.8,1.9,AZ,.25,.25,.25,'white',[1,.98,.94,1],[1,1],0,.92);abox('softLight2',AX-4.8,1.9,AZ,.25,.25,.25,'white',[1,.98,.94,1],[1,1],0,.92);}
 else if(clinical){
   for(let i=-2;i<=2;i++)afluor(AX+i*2.2,2.92,AZ,1.15);
   abox('benchA',AX-3.9,.88,AZ-2.2,2.8,1.76,.8,'wood',[.68,.69,.71,1]);abox('benchB',AX+3.9,.88,AZ-2.2,2.8,1.76,.8,'wood',[.68,.69,.71,1]);abox('island',AX,.80,AZ+.2,3.8,1.60,1.2,'wood',[.70,.72,.73,1]);
   for(let x of[-4.9,-4.2,-3.5,3.5,4.2,4.9])for(let z of[-2.4,-1.8,-1.2])abox('vial',AX+x,.98,AZ+z,.10,.22,.10,'white',[.22,.62,.92,1],[1,1],0,.75);
   abox('cabinetGlass',AX+5.5,1.3,AZ+3.2,1.5,2.3,1.0,'white',[.64,.76,.84,.32],[1,1],0,.15);abox('examBed',AX-4.2,.55,AZ+3.2,2.4,.50,1.05,'white',[.72,.74,.76,1]);
   if(isAny(loc,['therapy'])){achair(AX-1.5,AZ+1.5,.4,[.50,.44,.38,1]);achair(AX+1.5,AZ+1.5,-.4,[.50,.44,.38,1]);atable(AX,AZ+1.6,1.0,.8,.45,[.44,.38,.30,1]);}
   if(isAny(loc,['hospitalmemory','hospital'])){abox('curtainRail',AX,2.45,AZ+4.3,6.0,.06,.08,'white',[.70,.72,.74,1]);for(let x=-2.4;x<=2.4;x+=1.2)abox('curtain',AX+x,1.3,AZ+4.3,.25,2.2,.05,'white',[.82,.84,.86,1],[1,1],0,.12);}
 } else {
   atable(AX,AZ-1.3,3.4,1.25,.76,p.b);achair(AX-1.0,AZ-.4,.2);achair(AX+1.0,AZ-.4,-.2);abox('monitor',AX+.55,1.18,AZ-1.75,.95,.55,.07,'white',[.10,.13,.16,1],[1,1],0,.10);abox('keyboard',AX,.84,AZ-1.25,1.1,.05,.35,'white',[.18,.18,.19,1]);abox('cabinet',AX+4.8,1.0,AZ-2.7,1.2,2.0,3.0,'wood',p.b);abox('bench',AX-4.2,.48,AZ+2.2,2.8,.55,.8,'wood',p.b);ashelf(AX-5.5,AZ-3.8,.75,2.3,2.2,[.44,.36,.30,1]);apicture(AX+4.4,1.65,AZ+4.5,1.5,.8);awindow(AX-6.88,1.55,AZ-.8,1.2,1.5,-1,dark?[.48,.62,.86,1]:[.94,.82,.56,1]);awindow(AX-6.88,1.55,AZ+3.0,1.2,1.5,-1,dark?[.48,.62,.86,1]:[.94,.82,.56,1]);alamp(AX-3.8,.92,AZ+2.1,!dark);if(isAny(loc,['management','center'])){abox('meetingTable',AX+1.6,.78,AZ+2.4,3.4,.12,1.2,'wood',[.50,.40,.33,1]);for(let i=-1;i<=1;i++)achair(AX+.8+i*1.1,AZ+3.2,Math.PI,[.48,.42,.36,1]);}
 }
 marker(loc);
}

// ---------- v4.3.0: DIŞ MEKÂN FİLM SETLERİ ----------
// Aynı sokak şablonunu tekrar etmek yerine her önemli dış mekân kendi mimari/ışık/yaşanmışlık kimliğini taşır.
function filmTree(x,z,h=2.8,c=[.20,.34,.18,1]){
  abox('filmTreeTrunk',x,h*.28,z,.24,h*.56,.24,'wood',[.27,.20,.15,1]);
  abox('filmTreeCrown',x,h*.72,z,1.35,h*.70,1.35,'white',c,[1,1],0,.06);
}
function filmBin(x,z,c=[.16,.19,.20,1]){
  abox('filmStreetBin',x,.43,z,.48,.86,.48,'white',c,[1,1],0,.02);
  abox('filmStreetBinLip',x,.89,z,.54,.08,.54,'white',[.24,.26,.27,1]);
}
function filmBench(x,z,ry=0,c=[.46,.34,.25,1]){
  const p=(lx,lz)=>arot(lx,lz,x,z,ry);
  abox('filmBenchSeat',x,.43,z,1.65,.12,.52,'wood',c,[1,1],ry);
  let q=p(0,.23);abox('filmBenchBack',q[0],.82,q[1],1.65,.62,.09,'wood',[c[0]*.82,c[1]*.82,c[2]*.82,1],[1,1],ry);
  for(const dx of[-.62,.62]){q=p(dx,0);abox('filmBenchLeg',q[0],.22,q[1],.08,.44,.34,'white',[.20,.21,.22,1],[1,1],ry);}
}
function filmBollard(x,z){
  abox('filmBollard',x,.39,z,.18,.78,.18,'white',[.18,.19,.20,1]);
  abox('filmBollardBand',x,.57,z,.20,.07,.20,'white',[.72,.72,.68,1],[1,1],0,.10);
}
function filmCar(x,z,ry=0,c=[.13,.19,.24,1]){
  abox('filmCarBody',x,.36,z,1.62,.46,3.05,'white',c,[1,1],ry,.02);
  abox('filmCarCabin',x,.69,z-.10,1.28,.42,1.65,'white',[.10,.16,.20,1],[1,1],ry,.10);
  const pts=[[-.62,-.92],[.62,-.92],[-.62,.92],[.62,.92]];
  for(const [lx,lz] of pts){const q=arot(lx,lz,x,z,ry);abox('filmCarWheel',q[0],.20,q[1],.22,.28,.38,'white',[.05,.05,.055,1],[1,1],ry);}
}
function filmStorefront(x,z,w=3.0,glow=[.95,.65,.34,1],ry=0){
  abox('filmStoreFrame',x,1.38,z,w,2.35,.20,'wood',[.20,.20,.20,1],[1,1],ry);
  abox('filmStoreGlass',x,1.38,z-.11,w-.22,2.10,.03,'white',glow,[1,1],ry,.42);
  abox('filmStoreSign',x,2.78,z-.10,w*.78,.42,.08,'white',[.22,.23,.24,1],[1,1],ry,.08);
}
function filmBikeRack(x,z,ry=0){
  for(let i=-2;i<=2;i++){const q=arot(i*.42,0,x,z,ry);abox('filmBikeRack',q[0],.30,q[1],.06,.60,.55,'white',[.34,.36,.38,1],[1,1],ry);}
}
function filmRain(loc,count=28){
  const seed=h32(loc+'rainfilm');
  for(let i=0;i<count;i++){
    const r=(n)=>((Math.imul(seed^(n*374761393),2654435761)>>>0)%10000)/10000;
    const x=AX-9+r(i*3+1)*18,z=AZ-9+r(i*3+2)*18,y=.5+r(i*3+3)*3.1;
    const d=abox('filmRainDrop',x,y,z,.025,.55+r(i+9)*.50,.025,'white',[.52,.76,.90,.42],[1,1],0,.12);
    d.ambientMove={axis:'y',speed:-(4.8+r(i+19)*2.8),min:.05,max:3.65};
  }
}
function filmWreath(x,z,ry=0){
  abox('filmWreathStem',x,.54,z,.08,1.08,.08,'wood',[.22,.20,.18,1],[1,1],ry);
  abox('filmWreathGreen',x,1.08,z,.78,.78,.12,'white',[.18,.34,.19,1],[1,1],ry,.04);
  abox('filmWreathWhite',x,1.08,z-.07,.48,.48,.08,'white',[.82,.82,.78,1],[1,1],ry,.06);
}
function exteriorFilmSetDetails(loc,type){
  if(type!=='urban')return;
  const L=String(loc||'').toLowerCase();

  // Fırın Sokağı — sıcak vitrin, ekmek sevkiyatı, sabah/akşam mahalle hissi.
  if(loc==='bakeryStreet'){
    filmStorefront(AX-8.72,AZ-2.8,4.4,[1,.68,.32,1],Math.PI/2);
    abox('bakeryCounter',AX-8.25,.78,AZ-2.8,.82,1.56,3.3,'wood',[.48,.33,.20,1]);
    for(let r=0;r<3;r++)for(let i=0;i<5;i++)
      abox('bakeryBread',AX-7.78,.72+r*.40,AZ-4.0+i*.55,.16,.11,.30,'white',[.72+.03*r,.49,.21,1],[1,1],0,.08);
    for(let i=0;i<3;i++)abox('bakeryCrate',AX-6.2+i*.72,.25,AZ-5.3,.58,.50,.72,'wood',[.39,.29,.20,1]);
    for(let i=0;i<2;i++)abox('flourSack',AX-6.15+i*.62,.34,AZ-4.35,.48,.68,.35,'rug',[.70,.67,.58,1],[1,1],i*.08,.01);
    filmCar(AX+6.9,AZ+4.6,0,[.18,.22,.24,1]);
    filmBin(AX+5.2,AZ-5.5);
    abox('bakeryWarmBounce',AX-7.6,1.7,AZ-2.8,.08,1.55,2.8,'white',[1,.55,.22,1],[1,1],0,.46);
  }

  // Dar Sokak — klima üniteleri, çamaşır hatları, servis kapıları, drenaj.
  if(loc==='alley'){
    for(const side of[-1,1])for(let z=-6;z<=6;z+=4){
      abox('alleyServiceDoor',AX+side*8.55,1.02,AZ+z,.12,2.04,1.05,'wood',[.25,.23,.22,1]);
      abox('alleyAC',AX+side*8.22,2.55,AZ+z+1.15,.50,.42,.72,'white',[.54,.55,.54,1]);
    }
    for(const z of[-4,0,4]){
      abox('alleyLaundryWire',AX,3.25,AZ+z,16,.025,.025,'white',[.10,.10,.10,1]);
      for(let i=-3;i<=3;i++)abox('alleyCloth',AX+i*1.45,2.75+(i%2)*.10,AZ+z,.72,.75,.025,'rug',
        i%3===0?[.55,.34,.29,1]:i%3===1?[.34,.43,.52,1]:[.68,.62,.48,1],[1,1],i*.02,.01);
    }
    abox('alleyDrain',AX,.012,AZ,1.25,.015,8.5,'white',[.10,.11,.12,1],[1,5],0,.02);
    filmBin(AX-5.6,AZ+5.4);filmBin(AX-4.9,AZ+5.4,[.19,.22,.20,1]);
  }

  // Okul — çevre duvarı, güvenlik kulübesi, bisikletlik ve gerçek giriş aksı.
  if(loc==='schoolstreet'||loc==='schoolNight'){
    for(const side of[-1,1]){
      abox('schoolWall',AX+side*7.9,1.05,AZ-2.0,.28,2.10,11.5,'wall',[.58,.57,.54,1]);
      for(let z=-6;z<=3;z+=1.2)abox('schoolFencePost',AX+side*7.72,2.15,AZ+z,.055,2.15,.055,'white',[.24,.25,.26,1]);
    }
    abox('schoolSecurity',AX+5.75,1.15,AZ-5.4,2.20,2.30,1.80,'wall',[.46,.47,.47,1]);
    awindow(AX+5.72,1.42,AZ-6.31,1.25,.78,1,[.50,.67,.76,1]);
    filmBikeRack(AX-5.4,AZ-4.7,0);
    filmBench(AX-4.8,AZ+4.0,Math.PI/2,[.42,.34,.27,1]);
    abox('schoolNotice',AX+6.95,1.55,AZ+3.5,.10,1.25,2.05,'wood',[.32,.28,.23,1]);
    if(loc==='schoolNight'){
      for(const x of[-5.5,5.5]){abox('schoolFloodPole',AX+x,1.8,AZ-1.2,.10,3.6,.10,'white',[.18,.19,.20,1]);abox('schoolFloodGlow',AX+x,3.45,AZ-1.2,.62,.20,.62,'white',[.72,.86,1,1],[1,1],0,.90);}
    }
  }

  // Park — yürüme yolu, farklı boy ağaçlar, banklar ve kent mobilyası.
  if(loc==='park'){
    for(let i=-3;i<=3;i++)abox('parkPath',AX+i*.85,.012,AZ+i*2.3,3.1,.018,3.0,'floor',[.48,.46,.42,1],[2,2],-.27,.015);
    const trees=[[-7,-5,3.0],[-5,1,3.5],[-6,6,2.7],[6,-5,3.3],[5,.5,2.9],[7,6,3.6]];
    for(const [x,z,h] of trees)filmTree(AX+x,AZ+z,h,[.18+.02*(h%1),.35,.18,1]);
    filmBench(AX-4.0,AZ+2.6,.25);filmBench(AX+4.4,AZ-1.4,-.42);
    filmBin(AX+.8,AZ+4.8,[.14,.24,.18,1]);
    for(const x of[-5.2,0,5.2])astreetLamp(AX+x,AZ+6.1,true);
  }

  // Yağmur Sokağı — dinamik yağmur, oluklar, yansımalar, soğuk vitrinler.
  if(loc==='rainStreet'){
    filmRain(loc,32);
    for(let i=-3;i<=3;i++)abox('rainReflection',AX+i*1.25,.008,AZ-1.0+(i%2)*4.6,.68,.012,3.9,'white',
      i%2?[.20,.42,.52,.34]:[.55,.36,.20,.26],[1,1],0,.14);
    for(const side of[-1,1])for(const z of[-5,1,6])abox('rainDownpipe',AX+side*8.45,1.45,AZ+z,.10,2.90,.10,'white',[.26,.28,.29,1]);
    for(const z of[-5,0,5])abox('rainDrain',AX-3.9,.015,AZ+z,1.0,.02,.28,'white',[.08,.09,.10,1]);
    filmStorefront(AX+8.70,AZ-3.0,3.2,[.28,.55,.72,1],-Math.PI/2);
    filmStorefront(AX-8.70,AZ+3.3,3.0,[.82,.48,.28,1],Math.PI/2);
  }

  // Eski Sokak — balkon, panjur, saksı ve eski kent dokusu.
  if(loc==='oldstreet'){
    for(const side of[-1,1])for(const z of[-6,0,6]){
      abox('oldBalcony',AX+side*8.20,2.85,AZ+z,1.25,.12,2.25,'wood',[.29,.25,.22,1]);
      for(let k=-2;k<=2;k++)abox('oldBaluster',AX+side*7.58,3.20,AZ+z+k*.42,.06,.70,.06,'white',[.20,.20,.20,1]);
      abox('oldShutter',AX+side*8.42,3.65,AZ+z-.52,.08,1.05,.44,'wood',[.32,.28,.24,1]);
      abox('oldShutter',AX+side*8.42,3.65,AZ+z+.52,.08,1.05,.44,'wood',[.32,.28,.24,1]);
      aplant(AX+side*7.78,AZ+z,0.55);
    }
  }

  // Kafe — vitrin ve sokak masalarını bir işletme cephesine bağla.
  if(loc==='cafe'){
    filmStorefront(AX-8.72,AZ-1.1,4.5,[.92,.56,.30,1],Math.PI/2);
    abox('cafeCounterGlow',AX-8.15,1.05,AZ-1.1,.58,1.20,3.2,'wood',[.42,.28,.20,1]);
    for(let i=0;i<4;i++)asetMug(AX-7.75,AZ-2.15+i*.68,[.82,.80,.72,1]);
    abox('cafeMenuBoard',AX-6.0,1.20,AZ-4.8,.80,1.65,.10,'wood',[.20,.22,.22,1]);
    filmBikeRack(AX+5.8,AZ-5.4,0);
  }

  // Mezarlık / cenaze — gösterişli değil, daha sakin ve insani bir set.
  if(loc==='cemetery'||loc==='funeral'){
    for(const x of[-8.0,8.0])for(const z of[-6,-1,4])filmTree(AX+x,AZ+z,3.6,[.12,.27,.14,1]);
    abox('cemPath',AX,.008,AZ,2.1,.015,18,'floor',[.40,.38,.34,1],[1,7],0,.01);
    if(loc==='funeral'){
      abox('funeralCanopy',AX,2.55,AZ-3.7,6.2,.12,3.4,'rug',[.26,.27,.27,1]);
      for(let row=0;row<3;row++)for(let col=-2;col<=2;col++)achair(AX+col*1.05,AZ+1.1+row*1.0,0,[.31,.30,.29,1]);
      filmWreath(AX-3.8,AZ-3.0,.12);filmWreath(AX+3.8,AZ-3.0,-.12);
      abox('funeralFlowers',AX,.32,AZ-4.55,2.4,.28,.68,'white',[.78,.77,.72,1],[1,1],0,.04);
    }else{
      filmBench(AX+5.5,AZ+5.0,-.25,[.36,.31,.27,1]);
    }
  }

  // İstasyon tekrarı — bekleme alanı, saçak, ray hissi ve saat noktası.
  if(loc==='stationReplay'){
    abox('stationShelterRoof',AX-3.2,2.65,AZ+5.0,5.8,.16,2.4,'white',[.32,.34,.36,1]);
    for(const x of[-5.7,-.7])abox('stationShelterPost',AX+x,1.35,AZ+5.0,.10,2.7,.10,'white',[.28,.29,.30,1]);
    filmBench(AX-3.2,AZ+4.8,Math.PI,[.38,.34,.30,1]);
    abox('stationClockPole',AX+4.9,1.45,AZ+5.0,.10,2.9,.10,'white',[.20,.21,.22,1]);
    abox('stationClock',AX+4.9,2.60,AZ+5.0,.62,.62,.12,'white',[.82,.81,.76,1],[1,1],0,.08);
    for(const x of[-2.0,2.0])abox('stationRail',AX+x,.035,AZ-4.7,.09,.07,10.0,'white',[.24,.25,.25,1]);
    for(let z=-8;z<=0;z+=.65)abox('stationSleeper',AX,.015,AZ+z,4.6,.06,.16,'wood',[.31,.27,.23,1]);
  }

  // Genel şehir setlerinde tekrar eden ama gerçekçi kent mobilyası.
  if(['city','street'].includes(loc)){
    for(const z of[-6,0,6]){filmBollard(AX-4.25,AZ+z);filmBollard(AX+4.25,AZ+z);}
    filmCar(AX+6.4,AZ-5.4,0,[.24,.18,.17,1]);filmCar(AX-6.3,AZ+4.8,Math.PI,[.12,.18,.20,1]);
    filmStorefront(AX-8.72,AZ-1.7,3.3,[.72,.48,.26,1],Math.PI/2);
    filmStorefront(AX+8.72,AZ+2.5,3.6,[.28,.48,.66,1],-Math.PI/2);
  }
}
function applyExteriorSetLighting(loc){
  let amb=null;
  if(loc==='bakeryStreet'){
    WORLD_LIGHTS[10]={pos:[AX-6.9,2.0,AZ-2.8],color:[6.0,3.55,1.65],att:.060};
    WORLD_LIGHTS[11]={pos:[AX+4.7,2.4,AZ+2.5],color:[1.55,2.15,2.65],att:.078}; amb=[.30,.29,.28];
  }else if(loc==='rainStreet'){
    WORLD_LIGHTS[10]={pos:[AX-5.0,2.3,AZ-2.0],color:[1.15,2.35,3.20],att:.062};
    WORLD_LIGHTS[11]={pos:[AX+5.6,2.0,AZ+2.0],color:[2.65,1.75,1.15],att:.075}; amb=[.245,.28,.31];
  }else if(loc==='schoolNight'){
    WORLD_LIGHTS[10]={pos:[AX-5.5,3.2,AZ-1.2],color:[3.65,4.20,5.20],att:.055};
    WORLD_LIGHTS[11]={pos:[AX+5.5,3.2,AZ-1.2],color:[3.65,4.20,5.20],att:.055}; amb=[.22,.24,.285];
  }else if(loc==='cemetery'||loc==='funeral'){
    WORLD_LIGHTS[10]={pos:[AX-4.0,2.6,AZ+1.0],color:[2.55,2.45,2.25],att:.070};
    WORLD_LIGHTS[11]={pos:[AX+5.0,2.1,AZ-3.0],color:[1.35,1.55,1.65],att:.082}; amb=[.285,.285,.275];
  }else if(loc==='park'){
    WORLD_LIGHTS[10]={pos:[AX-4.5,2.7,AZ+4.8],color:[4.15,3.05,1.85],att:.072};
    WORLD_LIGHTS[11]={pos:[AX+5.0,2.3,AZ-3.0],color:[1.45,2.05,1.65],att:.080}; amb=[.31,.32,.285];
  }
  if(amb){uploadLights();gl.uniform3f(U.ambient,amb[0],amb[1],amb[2]);}
}

function buildStreet(loc){
 const p=palFor(loc),low=loc.toLowerCase(),fire=isAny(loc,['fire','burn','ash']),rain=isAny(loc,['rain']),park=isAny(loc,['park']),cem=isAny(loc,['cemetery','funeral']),market=isAny(loc,['market']),cafe=isAny(loc,['cafe']),courtyard=isAny(loc,['courtyard']),construction=isAny(loc,['construction']),school=isAny(loc,['school']),bakery=isAny(loc,['bakery']),station=isAny(loc,['station']);
 const roadC=fire?[.20,.13,.10,1]:[.24,.25,.27,1],sideC=park?[.28,.33,.28,1]:[.42,.40,.37,1];
 abox('streetRoad',AX,-.06,AZ,9,.10,20,'floor',roadC,[5,10]);abox('walkL',AX-6.5,-.02,AZ,4,.14,20,'floor',sideC,[2,10]);abox('walkR',AX+6.5,-.02,AZ,4,.14,20,'floor',sideC,[2,10]);
 for(const side of[-1,1])for(let z=-7;z<=7;z+=7){const x=AX+side*9;abox('facade',x,3.2,AZ+z,.42,6.4,5.4,'wall',fire?[.26,.16,.12,1]:p.c,[1,3]);aroof(x,AZ+z,3.1,5.4,fire?[.16,.08,.06,1]:[.24,.16,.12,1]);for(let yy=1.2;yy<5;yy+=1.35){for(let zz=AZ+z-1.6;zz<=AZ+z+1.6;zz+=1.25)abox('window',x-side*.22,yy,zz,.03,.62,.78,'white',fire?[1,.26,.10,1]:[.42,.68,.82,1],[1,1],0,fire?.78:.38);}}
 for(const side of[-1,1])for(let z=-7;z<=7;z+=7)astreetLamp(AX+side*4.8,AZ+z,!fire);
 if(rain||isAny(loc,['city','street','oldstreet','road']))for(let i=0;i<12;i++)abox('puddle'+i,AX-3.6+(i%4)*2.1,.005,AZ-7+Math.floor(i/4)*6.8,.9,.008,1.45,'white',[.15,.32,.40,.42],[1,1],0,.15);
 if(cafe){for(let x of[-3.2,3.2]){atable(AX+x,AZ+1.8,1.05,1.05,.68,[.46,.34,.24,1]);for(let c of[-.6,.6])achair(AX+x+c,AZ+2.4,Math.PI/4*c,[.44,.38,.34,1]);abox('awning',AX+x,2.35,AZ-3.7,2.4,.18,.8,'rug',[.54,.18,.16,1])}}
 if(market){for(let x of[-4.2,0,4.2]){abox('stallTop',AX+x,1.85,AZ-2.2,2.2,.16,1.4,'rug',[.60,.22,.18,1]);abox('stallBody',AX+x,.92,AZ-2.2,2.0,1.8,1.1,'wood',[.44,.34,.24,1]);for(let i=0;i<5;i++)abox('crate'+x+i,AX+x-.6+i*.3,1.05,AZ-2.2,.22,.22,.22,'white',[.72,.52,.22,1],[1,1],0,.2)}}
 if(cem){for(let row=0;row<3;row++)for(let col=-2;col<=2;col++)abox('grave',AX+col*2.0,.42,AZ-4.5+row*3.1,.78,.84,.18,'wall',[.46,.46,.50,1]);abox('cemCross',AX,1.2,AZ+3.8,.18,1.2,.18,'wall',[.52,.52,.55,1]);}
 if(park){for(let x of[-5.2,-2.4,2.4,5.2]){abox('treeTrunk',AX+x,.78,AZ-4.8,.24,1.55,.24,'wood',[.34,.24,.16,1]);abox('treeCanopy',AX+x,2.1,AZ-4.8,1.5,1.2,1.5,'white',[.24,.40,.22,1],[1,1],0,.12)}abox('bench',AX,.45,AZ+4.4,2.4,.5,.75,'wood',[.50,.38,.28,1]);}
 if(construction){for(let x of[-3.5,2.5]){abox('pillar',AX+x,1.5,AZ,.6,3,.6,'wall',[.50,.50,.52,1]);abox('beam',AX+x,2.85,AZ,2.2,.3,.4,'wall',[.56,.56,.58,1]);}abox('barrier',AX,0.55,AZ+4.0,5.5,1.1,.25,'white',[1,.55,.12,1],[3,1],0,.2)}
 if(courtyard){abox('fountainBase',AX,.35,AZ,3.2,.7,3.2,'wall',[.52,.50,.48,1]);abox('fountainCore',AX,1.0,AZ,.55,2.0,.55,'wall',[.62,.62,.66,1]);abox('fountainWater',AX,1.7,AZ,.95,.06,.95,'white',[.10,.34,.48,.76],[1,1],0,.35);}
 if(school){abox('gate',AX,1.4,AZ-5.4,4.8,2.8,.18,'wall',[.52,.54,.56,1]);abox('board',AX,1.6,AZ+5.0,2.6,1.4,.12,'white',[.12,.34,.18,1],[1,1],0,.08)}
 if(bakery){abox('shopAwning',AX-4.2,2.1,AZ-2.8,2.8,.18,.8,'rug',[.72,.54,.18,1]);abox('bakeryGlow',AX-4.25,1.55,AZ-2.42,2.35,1.65,.035,'white',[1,.74,.40,1],[1,1],0,.72);for(let i=0;i<6;i++)abox('bread',AX-5.0+i*.28,1.0,AZ-2.4,.20,.12,.20,'white',[.72,.50,.22,1],[1,1],0,.12);for(let i=-3;i<=3;i++)abox('crosswalk'+i,AX+i*.72,.006,AZ+.2,.40,.012,2.15,'white',[.78,.80,.80,1],[1,1],0,.08)}
 if(station){abox('platform',AX,0.12,AZ+5.5,10.8,.24,3.0,'floor',[.46,.46,.48,1]);abox('schedule',AX-5.4,1.65,AZ+5.2,1.6,1.0,.12,'white',[.16,.20,.26,1],[1,1],0,.10)}
 if(fire){for(let i=0;i<6;i++)abox('fire'+i,AX-4.5+i*1.7,.55,AZ-3.0+((i%2)*4),.35,.95,.35,'white',[1,.30,.08,1],[1,1],0,.98)}
 bounds(11);marker(loc);
}

// ---------- v4.3.0: TARİH + DOĞA + GERÇEKLİK KATMANLARI ----------
function filmRock(x,z,s=1,c=[.32,.30,.27,1],ry=0){
  abox('filmRock',x,.20*s,z,.85*s,.40*s,.70*s,'wall',c,[1,1],ry,.01);
}
function filmShrub(x,z,s=.7,c=[.25,.31,.19,1]){
  abox('filmShrubStem',x,.23*s,z,.10*s,.46*s,.10*s,'wood',[.28,.22,.16,1]);
  abox('filmShrubCrown',x,.48*s,z,.80*s,.62*s,.72*s,'white',c,[1,1],0,.035);
}
function filmReed(x,z,h=1.05){
  abox('filmReed',x,h*.5,z,.035,h,.035,'wood',[.38,.42,.24,1]);
  abox('filmReedTip',x,h+.06,z,.08,.18,.08,'white',[.44,.32,.18,1],[1,1],0,.02);
}
function filmBedroll(x,z,ry=0,c=[.42,.31,.24,1]){
  abox('filmBedroll',x,.13,z,1.15,.22,.52,'rug',c,[1,1],ry,.01);
  const q=arot(.48,0,x,z,ry);abox('filmBedrollTie',q[0],.16,q[1],.07,.28,.56,'white',[.20,.18,.16,1],[1,1],ry);
}
function filmClayJar(x,z,s=.55){
  abox('filmJarBody',x,.44*s,z,.56*s,.88*s,.56*s,'white',[.50,.32,.19,1],[1,1],0,.025);
  abox('filmJarNeck',x,.88*s,z,.30*s,.23*s,.30*s,'white',[.46,.28,.17,1],[1,1],0,.02);
}
function filmAncientHouse(x,z,w=3.0,d=2.7,h=2.4,c=[.51,.37,.23,1]){
  abox('filmMudHouse',x,h*.5,z,w,h,d,'wall',c,[2,2]);
  abox('filmMudRoof',x,h+.10,z,w+.15,.20,d+.15,'wall',[c[0]*.88,c[1]*.88,c[2]*.88,1]);
  abox('filmMudDoor',x-w*.24,.80,z+d*.505,.70,1.60,.06,'wood',[.25,.18,.12,1]);
  abox('filmMudWindow',x+w*.24,1.42,z+d*.505,.55,.48,.045,'white',[.18,.16,.13,1],[1,1],0,.04);
}
function filmOilLamp(x,y,z){
  abox('filmOilLampBowl',x,y,z,.22,.10,.22,'white',[.43,.29,.17,1]);
  abox('filmOilLampFlame',x,y+.18,z,.07,.25,.07,'white',[1,.48,.16,1],[1,1],0,.92);
}
function filmDust(loc,count=20,tint=[.61,.47,.30,.34],speed=.55){
  const seed=h32(loc+'#dust');
  const rr=n=>((Math.imul(seed^(n*1597334677),2246822519)>>>0)%10000)/10000;
  for(let i=0;i<count;i++){
    const o=abox('filmDust',AX-10+rr(i*3)*20,.35+rr(i*3+1)*2.8,AZ-10+rr(i*3+2)*20,
                 .05+rr(i+40)*.09,.035,.05,'white',tint,[1,1],0,.08);
    o.ambientMove={axis:'x',speed:speed*(.55+rr(i+80)),min:AX-11,max:AX+11};
  }
}
function filmEmbers(loc,count=20){
  const seed=h32(loc+'#ember');
  const rr=n=>((Math.imul(seed^(n*1103515245),2654435761)>>>0)%10000)/10000;
  for(let i=0;i<count;i++){
    const o=abox('filmEmber',AX-7+rr(i*2)*14,.15+rr(i*2+1)*1.7,AZ-7+rr(i+50)*14,
                 .035,.07,.035,'white',[1,.30,.08,.85],[1,1],0,.85);
    o.ambientMove={axis:'y',speed:.38+rr(i+90)*.55,min:.12,max:2.55};
  }
}
function filmDokuThread(x,z,h=2.3,phase=0){
  const o=abox('dokuThread',x,h*.5,z,.035,h,.035,'white',[.32,.72,.86,.64],[1,1],phase,.30);
  o.ambientMove={mode:'bob',baseY:o.y,amp:.10+.03*(phase%3),speed:.55+.08*(phase%4),phase};
  return o;
}
function filmFloatingRecord(x,y,z,w=1.4,h=.75,ry=0,shade=.74){
  const o=abox('floatingRecord',x,y,z,w,h,.028,'white',[shade,shade*.99,shade*.94,.72],[1,1],ry,.16);
  o.ambientMove={mode:'bob',baseY:y,amp:.07,speed:.42,phase:(x+z)*.3};
  return o;
}
function filmWaterShimmer(x,z,w,d){
  for(let i=-3;i<=3;i++){
    const o=abox('waterShimmer',x+i*w/7,.035,z,w/12,.012,d*.82,'white',
      [i%2?.26:.16,.55,.68,.28],[1,1],0,.20);
    o.ambientMove={mode:'bob',baseY:o.y,amp:.010,speed:.35+i*.015,phase:i};
  }
}
function filmCampLife(loc){
  // Ateş çevresinde her kampın aynı boş çadır seti gibi görünmemesi için gündelik ayrıntılar.
  filmBedroll(AX-3.4,AZ+3.25,.20,[.38,.28,.22,1]);
  filmBedroll(AX+3.25,AZ+3.0,-.18,[.30,.34,.29,1]);
  abox('campCookTripod',AX,.82,AZ-.80,.08,1.40,.08,'white',[.18,.17,.16,1]);
  abox('campCookPot',AX,.61,AZ-.80,.46,.30,.46,'white',[.16,.15,.14,1]);
  filmClayJar(AX+1.25,AZ-.55,.48);
  sigCrate(AX-4.5,AZ+1.2,[.38,.29,.21,1]);
}
function historyNatureLayerDetails(loc,type){
  const L=String(loc||'').toLowerCase();

  if(type==='nature'){
    if(/camp|shelter/.test(L))filmCampLife(loc);

    if(loc==='dryPlain'||loc==='boundaryLand'||loc==='quarry'){
      for(let i=-4;i<=4;i++){
        abox('dryCrackA',AX+i*2.1,.012,AZ-2.4+(i%3)*2.2,1.25,.012,.035,'white',[.22,.18,.13,1],[1,1],i*.21,.02);
        abox('dryCrackB',AX+i*1.7,.013,AZ+2.9-(i%2)*3.5,.95,.012,.035,'white',[.24,.19,.14,1],[1,1],-.45+i*.12,.02);
      }
      for(const [x,z,s] of[[-7,-5,.7],[-5,4,.55],[6,-3,.8],[7,5,.6]])filmShrub(AX+x,AZ+z,s,[.34,.31,.16,1]);
      filmDust(loc,24,[.62,.48,.31,.30],.40);
    }

    if(loc==='river'||loc==='riverVillage'||loc==='waterCamp'||loc==='shore'||loc==='prehumanCoast'){
      filmWaterShimmer(AX-4,AZ,6.0,20);
      for(let z=-8;z<=8;z+=1.1){filmReed(AX-.65,AZ+z,.78+((z+8)%3)*.18);filmReed(AX-7.0,AZ+z+.4,.82);}
      for(const [x,z] of[[3.8,-6],[4.7,-2],[3.6,3],[5.3,6]])filmRock(AX+x,AZ+z,.7,[.31,.30,.27,1],x*.10);
      if(loc==='riverVillage'){
        for(const [x,z] of[[3.8,-4],[5.3,0],[3.9,4]])filmAncientHouse(AX+x,AZ+z,2.5,2.2,1.9,[.43,.36,.25,1]);
        abox('riverJetty',AX-1.25,.13,AZ+4.2,2.6,.18,3.1,'wood',[.32,.25,.18,1],[1,3]);
      }
      if(loc==='prehumanCoast'){
        for(const z of[-6,-1,5])abox('driftWood',AX+2.5,.18,AZ+z,2.0,.22,.28,'wood',[.31,.25,.19,1],[1,1],.55+z*.03);
      }
    }

    if(loc==='sandstorm'){
      filmDust(loc,42,[.67,.52,.32,.42],1.12);
      for(let i=-4;i<=4;i++)abox('sandVeil',AX+i*2.5,1.3,AZ-5+(i%3)*4.8,.08,2.5,4.5,'white',[.60,.47,.31,.11],[1,1],.12,.04);
    }

    if(loc==='stormShelter'){
      abox('stormShelterRoof',AX,1.95,AZ+2.7,6.2,.22,3.3,'wood',[.30,.27,.24,1]);
      for(const x of[-2.8,2.8])abox('stormShelterPost',AX+x,.95,AZ+2.7,.15,1.9,.15,'wood',[.28,.25,.22,1]);
      filmDust(loc,18,[.50,.55,.58,.20],.82);
    }

    if(loc==='dawnHill'){
      for(let i=-4;i<=4;i++)abox('dawnGrass',AX+i*1.9,.23,AZ-4+(i%2)*7,.05,.46,.05,'white',[.31,.38,.20,1],[1,1],i*.1,.02);
    }
    if(/fire/.test(L)){filmEmbers(loc,26);}
  }

  if(type==='ancient'){
    if(loc==='ancientMesopotamia'){
      for(const [x,z,w,d] of[[-5,-4,3,2.5],[4.7,-4.5,3.3,2.7],[-5,3.5,2.7,2.5],[4.8,4,3.2,2.6]])
        filmAncientHouse(AX+x,AZ+z,w,d,2.35,[.50,.36,.22,1]);
      abox('mesoCanal',AX,.015,AZ,1.25,.022,18,'white',[.18,.35,.37,.65],[1,6],0,.18);
      filmWaterShimmer(AX,AZ,1.15,17);
      for(let z=-7;z<=7;z+=1.0){filmReed(AX-.75,AZ+z,.72);filmReed(AX+.75,AZ+z+.25,.68);}
      for(const [x,z] of[[-6.5,0],[6.4,1],[-3,6]])filmClayJar(AX+x,AZ+z,.72);
      abox('tabletTable',AX-2.8,.68,AZ+1.2,1.7,.72,1.0,'wood',[.33,.25,.18,1]);
      for(let i=0;i<5;i++)abox('clayTablet',AX-3.3+i*.25,.75,AZ+1.0,.20,.045,.32,'white',[.47,.34,.22,1],[1,1],i*.03,.02);
    }

    if(loc==='egyptVillage'){
      for(const [x,z] of[[-5,-4],[4.8,-4],[-5,3.5],[4.9,4]])filmAncientHouse(AX+x,AZ+z,3.0,2.4,2.15,[.57,.43,.27,1]);
      abox('egyptCanal',AX-2.6,.018,AZ,1.6,.025,18,'white',[.16,.36,.43,.75],[1,6],0,.20);
      filmWaterShimmer(AX-2.6,AZ,1.45,17);
      for(let z=-7;z<=7;z+=.8)filmReed(AX-1.65,AZ+z,.9);
      for(const [x,z] of[[1.5,-5],[2.2,-4.7],[5.7,1],[5.2,2]])filmClayJar(AX+x,AZ+z,.64);
      abox('reedShade',AX+2.8,2.05,AZ+4.9,4.2,.12,2.2,'rug',[.54,.42,.25,1]);
    }

    if(loc==='baghdad'){
      // Taş/kerpiç pasaj + avlu/çarşı; dönem detayını gereğinden fazla kesinleştirmeden tutarlı şehir hissi.
      for(const z of[-6,0,6]){sigArch(AX-6.2,AZ+z,2.7,3.0);sigArch(AX+6.2,AZ+z,2.7,3.0);}
      abox('baghdadCourt',AX,.015,AZ,8.4,.025,7.2,'floor',[.42,.34,.25,1],[4,4]);
      abox('baghdadPool',AX,.05,AZ,2.8,.10,2.8,'white',[.13,.34,.40,.72],[1,1],0,.22);
      filmWaterShimmer(AX,AZ,2.5,2.5);
      for(const [x,z] of[[-4,-3],[4,-3],[-4,3],[4,3]])filmOilLamp(AX+x,1.30,AZ+z);
      for(const [x,z] of[[-3.5,-5],[0,-5],[3.5,-5]]){sigCrate(AX+x,AZ+z,[.40,.30,.21,1]);filmClayJar(AX+x+.8,AZ+z,.50);}
      for(let i=0;i<3;i++)abox('baghdadAwning',AX-3.6+i*3.6,2.25,AZ+5.3,2.7,.10,1.2,'rug',
        i%2?[.45,.20,.17,1]:[.50,.36,.19,1]);
    }

    if(loc==='caravan'){
      for(const x of[-4.8,-1.6,1.6,4.8])filmBedroll(AX+x,AZ+3.6,x*.03,[.42,.31,.22,1]);
      for(const x of[-4.2,-1.4,1.4,4.2]){sigCrate(AX+x,AZ-2.7,[.39,.29,.20,1]);filmClayJar(AX+x+.55,AZ-2.35,.45);}
      abox('caravanShade',AX,2.25,AZ+1.0,7.0,.12,2.6,'rug',[.44,.27,.18,1]);
      filmDust(loc,18,[.60,.46,.30,.28],.52);
    }

    if(loc==='ruinedSettlement'||loc==='ancientCity'){
      for(const [x,z,h] of[[-6,-5,2.4],[-3,-1,1.5],[5,-4,2.9],[6,4,1.7],[-5,5,2.1]])
        abox('ruinWall',AX+x,h*.5,AZ+z,2.5,h,.48,'wall',[.43,.34,.25,1],[2,2],x*.025);
      for(const [x,z] of[[-1,-5],[2,4],[-6,0]])abox('fallenColumn',AX+x,.30,AZ+z,2.6,.55,.55,'wall',[.49,.42,.33,1],[1,1],.65+z*.02);
      filmDust(loc,20,[.56,.45,.32,.24],.32);
    }

    if(loc==='granary'){
      for(let i=-3;i<=3;i++){filmClayJar(AX+i*1.25,AZ+3.8,.75);abox('grainSack',AX+i*1.15,.30,AZ-3.2,.62,.58,.42,'rug',[.56,.48,.34,1]);}
    }
    if(loc==='kiln'){filmEmbers(loc,28);}
  }

  if(type==='cave'){
    if(loc==='cistern'){
      abox('cisternWater',AX,.02,AZ,8.5,.035,15,'white',[.07,.23,.29,.76],[1,5],0,.20);
      filmWaterShimmer(AX,AZ,8.0,14);
      for(const x of[-3.6,0,3.6])for(const z of[-5,0,5]){
        abox('cisternColumn',AX+x,1.55,AZ+z,.58,3.10,.58,'wall',[.36,.35,.33,1]);
        abox('cisternCapital',AX+x,2.95,AZ+z,.90,.24,.90,'wall',[.42,.41,.38,1]);
      }
    }
    if(loc==='tomb'||loc==='tombValley'){
      for(const side of[-1,1])for(const z of[-6,-2,2,6])
        abox('tombNiche',AX+side*5.55,1.2,AZ+z,.32,1.50,1.35,'wall',[.25,.23,.21,1]);
      for(const x of[-2.2,0,2.2])filmOilLamp(AX+x,.52,AZ-4.6);
    }
    if(loc==='recordCave'){
      for(let i=-4;i<=4;i++)filmFloatingRecord(AX+i*1.15,1.15+Math.abs(i)*.11,AZ-3.4+(i%2)*1.4,.76,.48,i*.05,.58);
      for(let i=-5;i<=5;i++)filmDokuThread(AX+i*.85,AZ+4.8+(i%3)*.40,1.2+(i%4)*.35,i);
    }
    if(loc==='caveVision'){
      for(let i=-5;i<=5;i++)filmDokuThread(AX+i*.80,AZ+1.5+(i%3)*1.1,1.3+(i%5)*.30,i*.7);
      for(const [x,z] of[[-4,-5],[4,-5],[-4,5],[4,5]])filmRock(AX+x,AZ+z,1.2,[.24,.28,.31,1],x*.10);
    }
  }

  if(type==='abstract'){
    if(loc==='threshold'){
      // Eşik bir portal nesnesi değil: aynı koridorun geometrisi küçük hatalarla kendini tekrar eder.
      for(let k=0;k<4;k++){
        const z=AZ-6+k*4.0,sh=k*.10;
        abox('thresholdWallL',AX-4.5-sh,1.65,z,.24,3.3,2.7,'wall',[.18,.21,.23,1],[1,1],.018*k);
        abox('thresholdWallR',AX+4.5+sh,1.65,z,.24,3.3,2.7,'wall',[.18,.21,.23,1],[1,1],-.018*k);
        abox('thresholdLintel',AX,3.02,z,9.2+sh*2,.28,.36,'wall',[.20,.23,.25,1]);
      }
      for(let i=-4;i<=4;i++)filmDokuThread(AX+i*.80,AZ+5.3,1.2+(i%3)*.35,i);
    }

    if(loc==='dokuSystem'){
      // Doku: zeminin üstünde enerji duvarı değil, gerçekliğin altındaki ince olasılık bağları.
      for(let row=0;row<5;row++)for(let i=-5;i<=5;i++){
        const x=AX+i*1.08+(row%2)*.42,z=AZ-6+row*3.0;
        filmDokuThread(x,z,.7+((i+row+10)%5)*.38,i+row*.4);
      }
      for(let i=-3;i<=3;i++){
        const o=abox('dokuAnchor',AX+i*2.1,.05,AZ-1+(i%2)*4.2,.34,.08,.34,'white',[.44,.52,.56,.52],[1,1],0,.18);
        o.ambientMove={mode:'bob',baseY:o.y,amp:.018,speed:.30,phase:i};
      }
    }

    if(loc==='worldmap'){
      for(let i=0;i<12;i++){
        const a=i/12*Math.PI*2,r=3.0+(i%3)*1.0;
        const o=abox('mapOrbitNode',AX+Math.sin(a)*r,1.3+(i%2)*.3,AZ+Math.cos(a)*r,.13,.13,.13,'white',[.38,.72,.82,1],[1,1],0,.50);
        o.ambientMove={mode:'bob',baseY:o.y,amp:.06,speed:.35,phase:i};
      }
    }

    if(loc==='dreamspace'){
      for(let i=0;i<8;i++)filmFloatingRecord(AX-5+i*1.4,1.0+(i%4)*.40,AZ-2+(i%3)*2.0,1.15,.62,(i-3)*.10,.50);
    }

    if(loc==='hiddenZone'){
      for(let i=-5;i<=5;i++){
        const o=abox('hiddenFrame',AX+i*1.5,1.0+(i%3)*.5,AZ+((i*7)%5),.06,1.7,.90,'white',[.11,.14,.17,.62],[1,1],i*.09,.08);
        o.ambientMove={mode:'bob',baseY:o.y,amp:.05,speed:.22,phase:i};
      }
    }

    if(loc==='blackArchive'){
      for(let row=0;row<3;row++)for(let i=-4;i<=4;i++)
        filmFloatingRecord(AX+i*1.25,.75+row*.82,AZ-4+row*3.5,.88,.48,(i+row)*.025,.18+.08*row);
    }

    if(loc==='textLayer'){
      // Metin Katmanı: "dev neon yazılar" yerine sayfa/cümle mimarisi ve okur doğrultusu.
      for(let depth=0;depth<5;depth++){
        const z=AZ-6+depth*3.0;
        for(let i=-3;i<=3;i++){
          const w=1.15+((i+depth+8)%3)*.25;
          const o=filmFloatingRecord(AX+i*1.65,1.0+((i+depth+9)%4)*.38,z,w,.52,i*.018,.78-depth*.06);
          o.color=[.78-depth*.035,.77-depth*.035,.72-depth*.03,.66];
        }
      }
      // Tek bir "okuma koridoru": boşluk da anlatının parçası.
      abox('readerPath',AX,.018,AZ,1.10,.018,18,'white',[.40,.40,.39,.18],[1,6],0,.04);
      for(let i=-5;i<=5;i++)filmDokuThread(AX+i*.65,AZ+7.2,.7+(i%3)*.24,i*.4);
    }
  }
}
function applyDeepWorldLighting(loc,type){
  let amb=null;
  if(loc==='baghdad'){
    WORLD_LIGHTS[10]={pos:[AX-4.4,2.0,AZ-1.8],color:[5.7,3.20,1.42],att:.065};
    WORLD_LIGHTS[11]={pos:[AX+4.0,2.4,AZ+2.0],color:[1.15,1.95,3.15],att:.078};amb=[.275,.265,.255];
  }else if(loc==='ancientMesopotamia'||loc==='egyptVillage'){
    WORLD_LIGHTS[10]={pos:[AX-5.0,3.0,AZ-3.0],color:[5.65,4.05,2.15],att:.060};
    WORLD_LIGHTS[11]={pos:[AX+5.0,2.2,AZ+3.0],color:[2.30,2.05,1.60],att:.078};amb=[.34,.30,.245];
  }else if(loc==='river'||loc==='shore'||loc==='prehumanCoast'){
    WORLD_LIGHTS[10]={pos:[AX-5.5,3.1,AZ-4.0],color:[4.10,3.70,2.85],att:.065};
    WORLD_LIGHTS[11]={pos:[AX+4.0,1.8,AZ+2.0],color:[.90,2.50,4.15],att:.072};amb=[.255,.305,.325];
  }else if(loc==='recordCave'||loc==='caveVision'){
    WORLD_LIGHTS[10]={pos:[AX-3.2,1.8,AZ+1.0],color:[.62,2.72,4.45],att:.070};
    WORLD_LIGHTS[11]={pos:[AX+3.5,1.4,AZ-3.0],color:[2.15,.70,3.25],att:.082};amb=[.21,.235,.285];
  }else if(type==='abstract'){
    WORLD_LIGHTS[10]={pos:[AX-3.5,2.1,AZ+2.0],color:[.65,2.35,3.50],att:.075};
    WORLD_LIGHTS[11]={pos:[AX+3.2,1.8,AZ-2.5],color:[1.75,.85,2.65],att:.085};amb=[.205,.225,.265];
    if(loc==='textLayer'){WORLD_LIGHTS[10].color=[2.80,2.72,2.48];WORLD_LIGHTS[11].color=[.90,1.30,1.82];amb=[.285,.285,.29];}
  }
  if(amb){uploadLights();gl.uniform3f(U.ambient,amb[0],amb[1],amb[2]);}
}
function applyMetaphysicalFilmSignature(loc){
  let special='';
  if(loc==='dokuSystem'||loc==='recordCave'||loc==='caveVision')special='doku';
  else if(loc==='textLayer'||loc==='blackArchive')special='text';
  else if(loc==='threshold'||loc==='hiddenZone')special='rift';
  else if(loc==='sandstorm')special='sand';
  document.body.dataset.filmSpecial=special;
}

function buildNature(loc){
 const p=palFor(loc),low=loc.toLowerCase(),wat=isAny(loc,['river','shore','coast','water']),dry=isAny(loc,['dry','sandstorm','quarry','boundary']),snow=isAny(loc,['skycamp']),camp=isAny(loc,['camp','shelter']),bridge=isAny(loc,['bridge']),mount=isAny(loc,['ridge','mountain','hill','trail']),prehist=isAny(loc,['prehuman','prehistoric']);
 abox('earth',AX,-.08,AZ,24,.12,24,'floor',dry?[.52,.42,.28,1]:snow?[.62,.66,.68,1]:[.25,.34,.24,1],[12,12]);
 if(wat){abox('water',AX-4,.01,AZ,6.0,.04,22,'white',[.08,.28,.38,.82],[1,1],0,.35);abox('shorePath',AX+2.2,.01,AZ,3.0,.02,22,'floor',[.46,.39,.28,1],[2,10]);}
 for(let i=0;i<14;i++){const a=(h32(loc+':'+i)%628)/100,r=4+(h32(loc+'r'+i)%650)/100,x=AX+Math.sin(a)*r,z=AZ+Math.cos(a)*r;abox('rock'+i,x,.18+(i%3)*.12,z,.65+(i%4)*.24,.35+(i%3)*.18,.72+(i%5)*.18,'wall',p.c,[1,1],(i*.71)%3.14)}
 for(let i=-3;i<=3;i++)abox('path'+i,AX+(wat?2.8:0),.005,AZ+i*2.8,2.2,.01,2.4,'floor',dry?[.55,.44,.29,1]:[.46,.39,.28,1]);
 if(!dry && !snow){for(let x of[-6.5,-3.8,3.8,6.5]){abox('trunk',AX+x,.82,AZ-5.2,.26,1.65,.26,'wood',[.34,.25,.16,1]);abox('canopy',AX+x,2.2,AZ-5.2,1.8,1.45,1.8,'white',[.24,.42,.22,1],[1,1],0,.12)}}
 if(camp){abox('fireCore',AX,.34,AZ-.8,.35,.65,.35,'white',[1,.32,.08,1],[1,1],0,.96);for(const x of[-2.2,2.2])abox('tent',AX+x,.75,AZ+2.3,2.4,1.55,2.8,'rug',p.b,[1,1],.04*x);abox('logA',AX-1.0,.18,AZ-.1,1.2,.25,.25,'wood',[.38,.28,.18,1], [1,1],.8);abox('logB',AX+1.0,.18,AZ-.1,1.2,.25,.25,'wood',[.38,.28,.18,1],[1,1],-.8)}
 if(bridge){abox('bridgeDeck',AX,.28,AZ,2.4,.18,9.5,'wood',[.40,.30,.20,1],[1,4]);for(const side of[-1,1]){abox('rail',AX+side*1.1,.82,AZ,0.12,1.0,9.5,'wood',[.30,.24,.18,1]);for(let z=-4;z<=4;z+=2)abox('post',AX+side*1.1,.56,AZ+z,.12,1.1,.12,'wood',[.30,.24,.18,1]);}}
 if(mount){for(let x of[-7.5,-4.8,4.8,7.5])abox('peak',AX+x,2.2,AZ-7.2,3.0,4.4,3.0,'wall',[.28,.28,.30,1]);}
 if(prehist){for(const x of[-3.2,3.2])abox('bone',AX+x,.35,AZ+2.7,1.4,.18,.22,'white',[.84,.82,.76,1]);abox('totem',AX,1.3,AZ-3.4,.52,2.6,.52,'wood',[.42,.28,.18,1]);}
 bounds(12);marker(loc);
}
function buildAncient(loc){
 const p=palFor(loc),low=loc.toLowerCase(),tomb=isAny(loc,['tomb']),market=isAny(loc,['baghdad','market','caravan','city','street']),village=isAny(loc,['village','settlement','granary','kiln']),road=isAny(loc,['road','path']);
 abox('sand',AX,-.07,AZ,22,.12,22,'floor',[.55,.43,.27,1],[10,10]);
 for(const x of[-8,8])abox('mudWall',AX+x,1.6,AZ,.8,3.2,18,'wall',[.48,.34,.22,1],[1,6]);
 for(let z=-7;z<=7;z+=4.0){abox('pillarL',AX-4.4,1.45,AZ+z,.72,2.9,.72,'wall',[.58,.46,.31,1]);abox('pillarR',AX+4.4,1.45,AZ+z,.72,2.9,.72,'wall',[.58,.46,.31,1]);}
 if(tomb){abox('altar',AX,.78,AZ-2.7,3.2,1.55,2.1,'wall',[.40,.34,.28,1]);for(const x of[-3.2,3.2])abox('brazier',AX+x,.62,AZ-3.1,.30,.55,.30,'white',[1,.34,.10,1],[1,1],0,.94);for(let i=-2;i<=2;i++)abox('sarcLine',AX+i*1.1,.24,AZ+3.6,.72,.40,1.6,'wall',[.46,.39,.31,1]);}
 if(market){for(const x of[-4.6,0,4.6]){abox('stallTop',AX+x,1.82,AZ-2.8,2.4,.18,1.5,'rug',[.68,.24,.18,1]);abox('stallBody',AX+x,.92,AZ-2.8,2.2,1.84,1.2,'wood',[.44,.34,.24,1]);}}
 if(village){abox('kilnA',AX-4.8,.90,AZ+3.0,2.2,1.8,2.2,'wall',[.46,.30,.19,1]);abox('granary',AX+4.6,1.2,AZ+3.0,2.4,2.4,2.4,'wood',[.48,.36,.22,1]);}
 if(road){for(let i=-4;i<=4;i++)abox('track'+i,AX+i*1.6,.01,AZ,1.1,.01,12.0,'floor',[.62,.52,.34,1]);}
 bounds(11);marker(loc);
}
function buildCaveAtlas(loc){
 const p=palFor(loc),vision=isAny(loc,['vision','record','cistern']),tomb=isAny(loc,['tomb']);
 abox('caveFloor',AX,-.08,AZ,14,.14,24,'floor',[.18,.17,.16,1],[6,10]);
 for(let z=-10;z<=10;z+=2){const off=Math.sin(z*.9)*.55;abox('caveL',AX-6.3+off,1.25,AZ+z,1.7,2.6,2.3,'wall',[.29,.27,.25,1],[1,1],z*.07);abox('caveR',AX+6.3-off,1.25,AZ+z,1.7,2.6,2.3,'wall',[.29,.27,.25,1],[1,1],-z*.07);if(Math.abs(z)<10)abox('ceilingRock',AX,2.8,AZ+z,10.5,.75,1.9,'wall',[.22,.21,.20,1],[4,1],Math.sin(z)*.08)}
 bounds(7);
 for(let z=-8;z<=8;z+=4){abox('torchPole',AX+(z%8?3.8:-3.8),1.15,AZ+z,.12,1.1,.12,'wood',[.32,.22,.14,1]);abox('torchFire',AX+(z%8?3.8:-3.8),1.7,AZ+z,.18,.45,.18,'white',[1,.38,.12,1],[1,1],0,.95)}
 for(let i=0;i<16;i++){const x=AX-5.4+(i%8)*1.45,z=AZ-9+Math.floor(i/8)*18;abox('stalag',x,.38,z,.30,.75,.30,'wall',[.34,.32,.30,1]);abox('stalact',x,2.7,z,.26,.7,.26,'wall',[.28,.27,.25,1])}
 if(vision){for(let i=0;i<7;i++)abox('crystal',AX-2.5+i*.82,.5+(i%2)*.35,AZ-3+(i%3)*1.9,.10,1.4,.10,'white',[.20,.75,1,1],[1,1],i*.3,.9);abox('pool',AX,0.02,AZ+5.0,2.6,.02,2.6,'white',[.08,.22,.28,.70],[1,1],0,.25)}
 if(tomb){for(let i=-2;i<=2;i++)abox('sarc',AX+i*1.3,.28,AZ+5.8,.82,.46,1.8,'wall',[.42,.36,.31,1]);}
 marker(loc);
}
function buildTransport(loc){
 const p=palFor(loc),metro=loc==='metro',ferry=loc==='ferry',elevator=loc==='elevator',car=loc==='car';
 if(elevator){abox('floor',AX,-.04,AZ,3.4,.08,3.4,'floor',[.36,.36,.38,1]);abox('ceil',AX,2.45,AZ,3.4,.10,3.4,'wall',[.46,.48,.50,1]);abox('w1',AX-1.7,1.2,AZ,.08,2.4,3.4,'wall',[.56,.58,.60,1]);abox('w2',AX+1.7,1.2,AZ,.08,2.4,3.4,'wall',[.56,.58,.60,1]);abox('w3',AX,1.2,AZ-1.7,3.4,2.4,.08,'wall',[.56,.58,.60,1]);abox('doorL',AX-.45,1.1,AZ+1.65,.85,2.2,.06,'wall',[.72,.74,.76,1]);abox('doorR',AX+.45,1.1,AZ+1.65,.85,2.2,.06,'wall',[.72,.74,.76,1]);abox('panel',AX+1.15,1.35,AZ-.9,.18,.8,.08,'white',[.18,.20,.22,1],[1,1],0,.15);bounds(1.7);}
 else if(car){
   // Oynanabilir araç içi: kamera ve oyuncu için açık kabin düzeni.
   abox('carFloor',AX,-.04,AZ,3.6,.08,7.0,'floor',[.22,.25,.28,1],[2,4]);
   abox('carDash',AX,.78,AZ-3.05,3.35,1.05,.42,'white',[.16,.19,.22,1]);
   abox('carWindGlow',AX,1.55,AZ-3.28,3.15,1.18,.04,'white',[.42,.62,.76,.32],[1,1],0,.22);
   for(const x of[-1.08,1.08]){abox('carFrontSeat',AX+x,.52,AZ-1.25,.86,.82,.72,'wood',[.28,.30,.32,1]);abox('carRearSeat',AX+x,.52,AZ+1.65,.86,.82,.72,'wood',[.28,.30,.32,1]);}
   abox('carConsole',AX,.36,AZ-.10,.42,.52,1.75,'white',[.12,.14,.16,1]);
   abox('carDoorRailL',AX-1.82,.72,AZ,.08,1.35,6.5,'white',[.26,.29,.32,1]);
   abox('carDoorRailR',AX+1.82,.72,AZ,.08,1.35,6.5,'white',[.26,.29,.32,1]);
   abox('carRoofStripL',AX-1.35,2.02,AZ,.22,.12,6.3,'white',[.24,.27,.30,1]);
   abox('carRoofStripR',AX+1.35,2.02,AZ,.22,.12,6.3,'white',[.24,.27,.30,1]);
   bounds(3.8);
 }
 else {const w=metro?6.8:(ferry?8.2:4.4),d=metro?17:(ferry?19:8.5);abox('vehicleFloor',AX,-.04,AZ,w,.08,d,'floor',metro?[.30,.32,.33,1]:[.36,.34,.30,1]);abox('vehicleCeil',AX,2.45,AZ,w,.10,d,'wall',[.43,.45,.46,1]);abox('vL',AX-w/2,1.2,AZ,.12,2.4,d,'wall',[.40,.43,.45,1]);abox('vR',AX+w/2,1.2,AZ,.12,2.4,d,'wall',[.40,.43,.45,1]);for(let z=-d/2+1.6;z<d/2-1;z+=2.2){abox('seatL',AX-1.6,.45,AZ+z,1.2,.8,.6,'wood',p.b);abox('seatR',AX+1.6,.45,AZ+z,1.2,.8,.6,'wood',p.b);}if(metro){for(let z=-7;z<=7;z+=4)afluor(AX,2.2,AZ+z,1.2);for(let z=-6;z<=6;z+=4){abox('pole',AX,1.1,AZ+z,.08,2.0,.08,'white',[.70,.72,.74,1]);}} if(ferry){abox('deckSideL',AX-3.8,1.0,AZ,.10,2.0,d,'white',[.70,.72,.74,1]);abox('deckSideR',AX+3.8,1.0,AZ,.10,2.0,d,'white',[.70,.72,.74,1]);abox('mast',AX,2.1,AZ-5.0,.18,4.2,.18,'white',[.62,.62,.64,1]);abox('sail',AX+1.1,2.4,AZ-5.0,.06,2.6,2.2,'white',[.82,.82,.80,1],[1,1],0,.12);}bounds(Math.max(w,d)/2+.2);} marker(loc);
}
function buildAbstract(loc){
 const p=palFor(loc),dream=isAny(loc,['dream']),map=isAny(loc,['worldmap']),text=isAny(loc,['text']),black=isAny(loc,['blackarchive','hiddenzone']),threshold=isAny(loc,['threshold','dokusystem']);
 abox('voidFloor',AX,-.10,AZ,22,.12,22,'white',black?[.01,.02,.03,1]:[.025,.035,.045,1],[1,1],0,.05);
 for(let i=0;i<14;i++){const a=i*Math.PI*2/14,r=3.8+(i%4)*1.1,x=AX+Math.sin(a)*r,z=AZ+Math.cos(a)*r;abox('abstractSlab'+i,x,.55+(i%5)*.55,z,.10,.10,1.8+(i%4)*.8,'white',i%2?[.12,.72,1,1]:[.50,.26,1,1],[1,1],a,.88)}
 for(let i=-4;i<=4;i++)abox('textPlane'+i,AX+i*1.25,1.2+Math.abs(i)*.10,AZ-5.5,.8,.06,2.1,'white',text?[.82,.86,.92,1]:p.b,[1,1],i*.08,.25);
 if(dream){for(let i=0;i<9;i++)abox('dreamOrb'+i,AX-5+i*1.25,1.4+Math.sin(i)*.8,AZ+2.4,.28,.28,.28,'white',[.62,.52,1,1],[1,1],0,.92)}
 if(map){abox('mapPlane',AX,1.25,AZ,7.2,.08,4.2,'white',[.10,.18,.24,1],[1,1],0,.18);for(let i=0;i<8;i++)abox('node'+i,AX-2.8+(i%4)*1.9,1.32,AZ-1.0+Math.floor(i/4)*2.1,.18,.18,.18,'white',[.20,.82,1,1],[1,1],0,.88)}
 if(threshold){abox('ringOuter',AX,1.7,AZ+4.2,3.6,.18,.18,'white',[.42,.76,1,1],[1,1],0,.95);abox('ringInner',AX,1.7,AZ+4.2,2.2,.08,.08,'white',[.18,.24,.30,1],[1,1],0,.08);for(let i=0;i<6;i++)abox('thresholdPillar'+i,AX-3.6+i*1.44,1.0,AZ+1.6,.12,2.0,.12,'white',[.40,.70,1,1],[1,1],0,.55)}
 if(black){for(let i=0;i<10;i++)abox('archiveColumn'+i,AX-4.5+i,1.5,AZ+3.0,.18,3.0,.18,'white',[.08,.10,.12,1],[1,1],0,.18)}
 bounds(11);marker(loc);
}

function sigCrate(x,z,c=[.50,.35,.22,1]){abox('sigCrate',x,.32,z,.72,.64,.72,'wood',c,[1,1]);abox('sigCrateBand',x,.34,z,.76,.10,.76,'white',[.28,.25,.21,1])}
function sigBarrel(x,z){abox('sigBarrel',x,.48,z,.70,.96,.70,'wood',[.38,.28,.20,1]);abox('sigBandA',x,.25,z,.74,.06,.74,'white',[.26,.27,.28,1]);abox('sigBandB',x,.70,z,.74,.06,.74,'white',[.26,.27,.28,1])}
function sigConsole(x,z,w=2.3){abox('sigConsole',x,.88,z,w,1.76,.72,'wood',[.26,.28,.30,1]);for(let i=-2;i<=2;i++)abox('sigScreen',x+i*w/5,1.28,z-.38,w/6,.42,.04,'white',[.10,.30,.44,1],[1,1],0,.35)}
function sigPaperStack(x,z,n=5){for(let i=0;i<n;i++)abox('sigPaper'+i,x+(i%2)*.05,.80+i*.035,z,.75,.035,.52,'white',[.76,.75,.70,1],[1,1],(i%2?-.04:.04))}
function sigArch(x,z,w=3.2,h=2.8){abox('sigArchL',x-w/2,h/2,z,.62,h,.62,'wall',[.52,.40,.27,1]);abox('sigArchR',x+w/2,h/2,z,.62,h,.62,'wall',[.52,.40,.27,1]);abox('sigArchTop',x,h-.25,z,w,.55,.62,'wall',[.56,.43,.28,1])}
function sigFence(x,z,w=7){abox('sigFenceRail',x,.65,z,w,.10,.10,'wood',[.34,.27,.20,1]);for(let i=-w/2;i<=w/2;i+=1.0)abox('sigFencePost',x+i,.58,z,.10,1.16,.10,'wood',[.34,.27,.20,1])}
function sigRain(){for(let i=0;i<28;i++){const x=AX-8+(h32(activeAtlas+'rx'+i)%1600)/100,z=AZ-9+(h32(activeAtlas+'rz'+i)%1800)/100,y=.6+(i%6)*.5;abox('sigRain'+i,x,y,z,.018,.75,.018,'white',[.55,.76,1,.45],[1,1],0,.20)}}
function sigEmbers(){for(let i=0;i<18;i++){const x=AX-6+(i%7)*1.8,z=AZ-5+Math.floor(i/7)*5.0;abox('sigEmber'+i,x,.45+(i%4)*.4,z,.06,.06,.06,'white',[1,.25,.04,1],[1,1],0,.98)}}
function decorateLocation(loc){
 const d=LOCATION_DESIGN[loc];if(!d)return;const s=d.signature,p=palFor(loc),h=h32(loc);
 switch(s){
  case 'office': sigPaperStack(AX-1.2,AZ-1.0,7);sigConsole(AX+3.8,AZ+2.6,2.4);aplant(AX-5.4,AZ-4.7,.8);break;
  case 'corridor': for(let z=-4;z<=4;z+=2)abox('sigExit'+z,AX,2.65,AZ+z,.7,.22,.06,'white',[.20,.78,.48,1],[1,1],0,.82);break;
  case 'management': sigPaperStack(AX-3.8,AZ+2.8,9);sigConsole(AX+4.0,AZ+2.7,2.0);break;
  case 'lab': for(let i=-3;i<=3;i++)abox('sigTube'+i,AX+i*.55,1.05,AZ+2.8,.10,.42,.10,'white',i%2?[.18,.70,1,1]:[.60,.22,1,1],[1,1],0,.70);break;
  case 'university': for(let r=0;r<3;r++)for(let c=-2;c<=2;c++)abox('sigDesk'+r+c,AX+c*1.5,.42,AZ-3+r*1.6,1.15,.55,.55,'wood',[.48,.38,.29,1]);abox('sigBoard',AX,1.75,AZ-5.9,4.8,1.6,.06,'white',[.12,.28,.18,1]);break;
  case 'archive': for(let i=-2;i<=2;i++)sigPaperStack(AX+i*1.4,AZ+4.7,5+i%2);break;
  case 'hospital': abox('sigECG',AX+4.8,1.65,AZ-4.8,1.5,.85,.08,'white',[.06,.16,.20,1]);for(let i=0;i<5;i++)abox('sigECGLine'+i,AX+4.2+i*.28,1.65+(i%2?-.10:.10),AZ-4.84,.18,.035,.02,'white',[.20,1,.56,1],[1,1],0,.85);break;
  case 'workshop': for(let i=-2;i<=2;i++){sigCrate(AX+i*1.3,AZ+3.7);abox('sigTool'+i,AX+i*1.3,1.15,AZ-4.7,.10,.80,.10,'white',[.58,.58,.56,1])}break;
  case 'event': for(let i=-3;i<=3;i++)abox('sigStageLight'+i,AX+i*1.1,2.55,AZ-4.8,.18,.18,.18,'white',i%2?[1,.42,.18,1]:[.24,.54,1,1],[1,1],0,.96);break;
  case 'studio': abox('sigBoom',AX-2.0,1.8,AZ+3.0,3.8,.08,.08,'white',[.18,.19,.20,1],[1,1],.18);abox('sigMic',AX-.2,1.35,AZ+3.0,.15,.45,.15,'white',[.12,.12,.13,1]);break;
  case 'therapy': alamp(AX,1.15,AZ-3.8,true);aplant(AX-4.8,AZ+4.5,.9);apicture(AX+4.7,1.5,AZ-4.8,1.4,.9);break;
  case 'home': sigPaperStack(AX-1.1,AZ+3.8,3);apicture(AX-2.4,1.65,AZ-4.5,1.1,.8);break;
  case 'altHome': for(let i=0;i<5;i++)abox('sigMirror'+i,AX-5+i*2.5,1.55,AZ-5.3,1.0,1.7,.035,'white',[.55,.66,.72,.38],[1,1],0,.25);break;
  case 'apartment': abox('sigIntercom',AX-5.9,1.45,AZ+4.7,.28,.50,.10,'white',[.22,.24,.26,1]);sigCrate(AX+5.0,AZ+4.6);break;
  case 'pastHome': for(let i=0;i<4;i++)abox('sigPhoto'+i,AX-3+i*2,1.65,AZ-5.5,.75,.55,.03,'white',[.58,.48,.36,1],[1,1],0,.12);break;
  case 'kitchen': for(let i=0;i<5;i++)abox('sigJar'+i,AX-4.7+i*.4,1.28,AZ+4.7,.18,.36,.18,'white',[.68,.48+.05*i,.22,1],[1,1],0,.15);break;
  case 'burningHome': sigEmbers();break;
  case 'balcony': abox('sigMoon',AX,3.0,AZ-8.5,1.0,1.0,.08,'white',[.80,.86,1,1],[1,1],0,.90);break;
  case 'bakery': abox('sigOven',AX+4.7,.95,AZ-2.6,2.2,1.9,1.5,'wall',[.40,.28,.18,1]);abox('sigOvenFire',AX+4.7,.85,AZ-3.4,.85,.65,.05,'white',[1,.28,.05,1],[1,1],0,.98);break;
  case 'alley': for(let i=0;i<3;i++)sigBarrel(AX-4.8+i*1.3,AZ+3.8);sigFence(AX+3.8,AZ-3.8,5);break;
  case 'courtyard': for(let i=0;i<4;i++)aplant(AX-5+i*3.3,AZ+4.7,.7);break;
  case 'oldstreet': for(let i=-2;i<=2;i++)abox('sigSign'+i,AX+i*2.2,2.15,AZ-4.0,1.4,.38,.08,'white',colByName(loc,'sign'+i),[1,1],0,.35);break;
  case 'construction': for(let x of[-4,4])for(let y=.5;y<3;y+=.8)abox('sigScaf'+x+y,AX+x,y,AZ+2.5,.10,.10,6,'white',[.42,.44,.46,1]);break;
  case 'school': abox('sigBell',AX,2.65,AZ-5.0,.45,.45,.25,'white',[.72,.62,.32,1],[1,1],0,.45);for(let i=-2;i<=2;i++)abox('sigBench'+i,AX+i*1.8,.42,AZ+3.4,1.4,.48,.55,'wood',[.48,.38,.28,1]);break;
  case 'city': for(let i=-2;i<=2;i++)abox('sigBollard'+i,AX+i*1.7,.35,AZ+4.8,.22,.70,.22,'white',[.30,.32,.34,1]);break;
  case 'cafe': for(let i=0;i<4;i++)abox('sigCup'+i,AX-3.4+i*2.2,.92,AZ+1.8,.14,.18,.14,'white',[.86,.82,.74,1]);break;
  case 'market': for(let i=-3;i<=3;i++)sigCrate(AX+i*1.2,AZ+4.2,colByName(loc,'crate'+i));break;
  case 'cemetery': for(let i=-3;i<=3;i++)abox('sigCandle'+i,AX+i*.8,.18,AZ+4.8,.08,.32,.08,'white',[1,.70,.25,1],[1,1],0,.90);break;
  case 'park': abox('sigPond',AX,.02,AZ,3.8,.025,2.4,'white',[.08,.28,.38,.70],[1,1],0,.25);break;
  case 'rain': sigRain();break;
  case 'fireUrban': sigEmbers();for(let i=-2;i<=2;i++)abox('sigDebris'+i,AX+i*1.8,.20,AZ+3.7,1.3,.28,.55,'wall',[.18,.14,.12,1],[1,1],i*.12);break;
  case 'gate': sigArch(AX,AZ-3.5,6.0,4.0);for(let i=-2;i<=2;i++)abox('sigBanner'+i,AX+i*1.2,2.2,AZ-3.1,.5,1.5,.04,'rug',colByName(loc,'banner'+i));break;
  case 'villageStreet': for(let i=-2;i<=2;i++){abox('sigHut'+i,AX+i*3.0,.9,AZ-3.8,2.4,1.8,2.4,'wall',[.48,.35,.23,1]);aroof(AX+i*3.0,AZ-3.8,2.6,2.7,[.28,.18,.12,1])}break;
  case 'station': abox('sigClock',AX,2.1,AZ+4.5,.85,.85,.10,'white',[.76,.76,.72,1]);for(let i=0;i<4;i++)abox('sigTrack'+i,AX-3+i*2,.02,AZ-4.5,.16,.04,8,'white',[.24,.24,.26,1]);break;
  case 'abstractThreshold': for(let i=0;i<18;i++){const a=i*Math.PI*2/18;abox('sigRing'+i,AX+Math.sin(a)*3.0,1.7+Math.cos(a)*3.0,AZ-1,.20,.20,.20,'white',[.25,.75,1,1],[1,1],0,.92)}break;
  case 'doku': for(let i=-5;i<=5;i++){abox('sigThread'+i,AX+i*.9,1.2+Math.sin(i)*.7,AZ-2.0,.035,2.4,.035,'white',[.20,.72,1,1],[1,1],i*.12,.88);abox('sigNode'+i,AX+i*.9,1.2+Math.sin(i)*.7,AZ-2.0,.18,.18,.18,'white',[.62,.26,1,1],[1,1],0,.96)}break;
  case 'worldmap': for(let i=0;i<12;i++){const x=AX-4+(i%4)*2.7,z=AZ-3+Math.floor(i/4)*3;abox('sigMapNode'+i,x,.35,z,.24,.24,.24,'white',[.18,.72,1,1],[1,1],0,.90)}break;
  case 'dream': for(let i=0;i<16;i++){const a=i*.9,r=2.5+(i%4);abox('sigDream'+i,AX+Math.sin(a)*r,1.0+(i%5)*.45,AZ+Math.cos(a)*r,.20,.20,.20,'white',[.56,.30+.03*i,1,1],[1,1],0,.94)}break;
  case 'hidden': for(let i=-3;i<=3;i++)abox('sigHidden'+i,AX+i*1.5,1.8,AZ+2.8,.20,3.6,.20,'white',[.04,.06,.08,1],[1,1],i*.1,.20);break;
  case 'black': for(let z=-4;z<=4;z+=2)for(let x=-4;x<=4;x+=2)abox('sigBlack'+x+z,AX+x,1.1,AZ+z,.85,2.2,.85,'white',[.015,.018,.024,1],[1,1],0,.12);break;
  case 'text': for(let i=-5;i<=5;i++)abox('sigPage'+i,AX+i*.85,1.15+Math.abs(i)*.10,AZ+2.5,.62,.04,.85,'white',[.82,.82,.78,1],[1,1],i*.15,.20);break;
  case 'ferry': for(let i=-3;i<=3;i++)abox('sigRailing'+i,AX+i*1.1,1.05,AZ-7.5,.08,1.2,.08,'white',[.66,.68,.70,1]);break;
  case 'metro': abox('sigRoute',AX,2.0,AZ-7.2,4.5,.35,.08,'white',[.12,.20,.30,1]);for(let i=-4;i<=4;i++)abox('sigDot'+i,AX+i*.45,2.0,AZ-7.24,.12,.12,.02,'white',i===0?[1,.20,.18,1]:[.18,.65,1,1],[1,1],0,.80);break;
  case 'elevator': for(let i=0;i<8;i++)abox('sigBtn'+i,AX+1.25,1.7-i*.16,AZ-.9,.08,.08,.04,'white',i===3?[1,.55,.16,1]:[.70,.72,.74,1],[1,1],0,i===3?.85:.10);break;
  case 'car': abox('sigHeadL',AX-.8,.72,AZ-3.55,.48,.22,.05,'white',[1,.88,.64,1],[1,1],0,.90);abox('sigHeadR',AX+.8,.72,AZ-3.55,.48,.22,.05,'white',[1,.88,.64,1],[1,1],0,.90);break;
  case 'mesopotamia': for(let i=0;i<4;i++)abox('sigZig'+i,AX,0.25+i*.35,AZ-2.5,7-i*1.1,.5,4.2-i*.6,'wall',[.52,.38,.24,1]);break;
  case 'granary': for(let i=-2;i<=2;i++)abox('sigBin'+i,AX+i*1.5,.75,AZ+2.8,1.1,1.5,1.1,'wood',[.48,.36,.22,1]);break;
  case 'kiln': abox('sigKiln',AX,1.1,AZ-2.2,3.0,2.2,3.0,'wall',[.46,.30,.20,1]);abox('sigKilnFire',AX,.75,AZ-3.75,1.3,1.0,.06,'white',[1,.30,.06,1],[1,1],0,.98);sigEmbers();break;
  case 'ancientStreet': for(let i=-3;i<=3;i++)sigBarrel(AX+i*1.5,AZ+3.8);break;
  case 'egypt': abox('sigObelisk',AX,2.0,AZ-3.5,.8,4.0,.8,'wall',[.64,.50,.28,1]);for(let i=-2;i<=2;i++)abox('sigPalm'+i,AX+i*2.6,1.5,AZ+4.5,.18,3.0,.18,'wood',[.36,.25,.14,1]);break;
  case 'ruin': for(let i=-3;i<=3;i++)abox('sigRuin'+i,AX+i*1.7,.45+(i%3)*.3,AZ-2.5,.9,.9+(i%3)*.6,2.0,'wall',[.40,.35,.29,1],[1,1],i*.08);break;
  case 'ancientCity': sigArch(AX,AZ-5.0,7.0,4.2);for(let i=-2;i<=2;i++)abox('sigTorch'+i,AX+i*1.5,1.3,AZ-4.6,.12,.8,.12,'white',[1,.34,.08,1],[1,1],0,.94);break;
  case 'ancientRoad': for(let i=-3;i<=3;i++)sigCrate(AX+i*1.5,AZ+4.3);break;
  case 'caravan': for(let i=-2;i<=2;i++){abox('sigTent'+i,AX+i*2.8,.8,AZ+2.5,2.2,1.6,2.5,'rug',colByName(loc,'tent'+i));sigCrate(AX+i*2.8,AZ-2.6)}break;
  case 'ancientPath': for(let i=-4;i<=4;i++)abox('sigStone'+i,AX+(i%2?1.5:-1.5),.20,AZ+i*1.4,.55,.40,.55,'wall',[.46,.40,.31,1]);break;
  case 'baghdad': for(let x of[-4,0,4])sigArch(AX+x,AZ-3.2,2.6,3.2);for(let i=-3;i<=3;i++)abox('sigLantern'+i,AX+i*1.3,2.25,AZ+3.5,.18,.36,.18,'white',[1,.52,.18,1],[1,1],0,.92);break;
  case 'dryPlain': for(let i=-5;i<=5;i++)abox('sigScrub'+i,AX+i*1.5,.18,AZ+3.5+(i%3),.45,.36,.45,'white',[.38,.34,.22,1]);break;
  case 'hillside': for(let i=-3;i<=3;i++)abox('sigHill'+i,AX+i*2.4,1.1,AZ-6.0,3.2,2.2,3.2,'wall',[.26,.34,.24,1]);break;
  case 'camp': for(let i=-2;i<=2;i++)sigCrate(AX+i*1.2,AZ+4.3);break;
  case 'quarry': for(let i=-3;i<=3;i++)abox('sigBlock'+i,AX+i*1.8,.55+(i%2)*.3,AZ+2.7,1.4,1.1+(i%2)*.6,1.4,'wall',[.44,.43,.40,1]);break;
  case 'nightPath': for(let i=-4;i<=4;i++)abox('sigPathLight'+i,AX+(i%2?2.2:-2.2),.55,AZ+i*1.8,.10,1.1,.10,'white',[.24,.65,1,1],[1,1],0,.75);break;
  case 'storm': sigFence(AX,AZ+3.8,8);for(let i=0;i<8;i++)abox('sigStormLine'+i,AX-6+i*1.8,1.2,AZ-2.0,.02,1.5,.02,'white',[.58,.70,.82,.5],[1,1],-.3,.20);break;
  case 'dawn': for(let i=-3;i<=3;i++)abox('sigDawn'+i,AX+i*1.8,1.0,AZ-6.5,.12,2.0,.12,'white',[1,.55+.05*i,.35,1],[1,1],0,.65);break;
  case 'skyCamp': for(let i=-2;i<=2;i++)abox('sigSnow'+i,AX+i*2.4,.22,AZ+4.1,1.6,.44,1.6,'white',[.78,.82,.86,1]);break;
  case 'fireSlope': sigEmbers();for(let i=-3;i<=3;i++)abox('sigBurnTree'+i,AX+i*1.8,1.0,AZ-4.5,.18,2.0,.18,'wood',[.16,.10,.08,1]);break;
  case 'dryRiver': for(let i=-5;i<=5;i++)abox('sigRiverStone'+i,AX+i*1.3,.15,AZ+(i%2)*1.3,.75,.30,.55,'wall',[.42,.39,.34,1]);break;
  case 'brokenBridge': for(let i=-3;i<=3;i++)abox('sigBrokenPlank'+i,AX+(i%2?1.1:-1.1),.35,AZ+i*1.35,1.9,.16,.7,'wood',[.34,.25,.18,1],[1,1],i*.08);break;
  case 'riverVillage': for(let i=-2;i<=2;i++){abox('sigHut'+i,AX+4.5,.85,AZ+i*3.2,2.4,1.7,2.4,'wood',[.42,.31,.20,1]);aroof(AX+4.5,AZ+i*3.2,2.6,2.6,[.24,.16,.10,1])}break;
  case 'sandstorm': for(let i=-4;i<=4;i++)abox('sigDust'+i,AX+i*1.5,1.2,AZ+((i%3)-1)*2,.16,2.4,.16,'white',[.72,.54,.28,.35],[1,1],i*.2,.15);break;
  case 'prisonCamp': for(let z of[-5,5])sigFence(AX,AZ+z,10);abox('sigTower',AX+5.0,2.0,AZ-4.8,1.1,4.0,1.1,'wood',[.34,.27,.20,1]);break;
  case 'ridge': for(let i=-3;i<=3;i++)abox('sigPeak'+i,AX+i*2.4,1.6+(i%2)*.5,AZ-6.8,2.4,3.2+(i%2),2.4,'wall',[.30,.30,.32,1]);break;
  case 'ambush': for(let i=-3;i<=3;i++)sigCrate(AX+i*1.3,AZ+2.8);sigFence(AX,AZ-2.8,7);break;
  case 'mountainTrail': for(let i=-4;i<=4;i++){abox('sigTrailPost'+i,AX+(i%2?2.6:-2.6),.6,AZ+i*1.5,.10,1.2,.10,'wood',[.34,.25,.16,1]);}break;
  case 'waterCamp': for(let i=-2;i<=2;i++)abox('sigWaterJar'+i,AX+i*1.1,.42,AZ+3.4,.42,.84,.42,'white',[.18,.48,.62,1]);break;
  case 'sidePath': sigFence(AX-3.5,AZ+2.5,4);sigFence(AX+3.5,AZ-2.5,4);break;
  case 'boundary': for(let i=-4;i<=4;i++)abox('sigBoundary'+i,AX+i*1.5,.85,AZ, .16,1.7,.16,'white',[.58,.48,.30,1]);break;
  case 'river': for(let i=-4;i<=4;i++)abox('sigReed'+i,AX-1.2+i*.3,.55,AZ+4.0,.08,1.1,.08,'white',[.24,.52,.28,1]);break;
  case 'prehistoric': abox('sigSkull',AX,.38,AZ+3.8,.65,.45,.65,'white',[.78,.74,.64,1]);sigEmbers();break;
  case 'hunt': for(let i=-4;i<=4;i++)abox('sigTrack'+i,AX+(i%2?1:-1),.02,AZ+i*1.6,.24,.02,.42,'white',[.22,.18,.14,1]);break;
  case 'prehuman': for(let i=-3;i<=3;i++)abox('sigPrimitive'+i,AX+i*1.7,.45,AZ+3.4,.55,.90,.55,'wall',[.34,.32,.28,1]);break;
  case 'shore': for(let i=-3;i<=3;i++)abox('sigDrift'+i,AX+i*1.7,.16,AZ+3.8,1.2,.22,.22,'wood',[.42,.34,.24,1],[1,1],i*.2);break;
  case 'cistern': for(let i=-3;i<=3;i++)abox('sigCisternCol'+i,AX+i*1.7,1.5,AZ-2.8,.45,3.0,.45,'wall',[.38,.36,.34,1]);abox('sigCisternWater',AX,.02,AZ+3.6,5.8,.03,3.6,'white',[.08,.26,.34,.70],[1,1],0,.22);break;
  case 'tombValley': for(let i=-3;i<=3;i++)abox('sigTombDoor'+i,AX+i*1.7,1.1,AZ-4.5,.9,2.2,.35,'wall',[.40,.34,.28,1]);break;
  case 'tomb': for(let i=-2;i<=2;i++)abox('sigSarc'+i,AX+i*1.5,.38,AZ+3.3,.9,.60,1.8,'wall',[.42,.36,.31,1]);break;
  case 'caveVision': for(let i=-4;i<=4;i++)abox('sigVisionCrystal'+i,AX+i*.9,.65+(i%3)*.3,AZ+2.2,.14,1.3,.14,'white',[.22,.72,1,1],[1,1],i*.2,.96);break;
  case 'recordCave': for(let i=-4;i<=4;i++)abox('sigRecord'+i,AX+i*.9,1.25,AZ+2.0,.55,.04,1.2,'white',[.62,.76,.92,1],[1,1],i*.1,.38);break;
  case 'cave': for(let i=-4;i<=4;i++)abox('sigCaveRock'+i,AX+i*1.3,.35,AZ+3.5,.70,.70,.70,'wall',[.30,.29,.27,1],[1,1],i*.22);break;
 }
}
function atlasObjectBounds(o,pad=.08,x=o?.x,z=o?.z,ry=o?.ry||0){
 if(!o)return [0,0,0,0];const c=Math.abs(Math.cos(ry)),s=Math.abs(Math.sin(ry)),ex=(c*o.sx+s*o.sz)/2,ez=(s*o.sx+c*o.sz)/2;return [x-ex-pad,z-ez-pad,x+ex+pad,z+ez+pad];
}
function registerAtlasDynamicCollision(object,opts={}){if(!object)return null;const d={object,pad:Number(opts.pad??.08),active:typeof opts.active==='function'?opts.active:()=>true,kind:opts.kind||'object'};atlasDynamicCollisions.push(d);return d;}
function finalizeAtlasPhysics(loc){
 const solid=/sofa|bedBase|wardrobe|dresser|shelfBody|tableTop|cabinet|bench|counter|fridge|stage|seat|stallBody|grave|fountainBase|treeTrunk|pillar|barrier|gate|kiln|granary|tent|bridgeDeck|totem|sarc|vehicleFloor|archiveColumn|sigCrate|sigBarrel|sigConsole|sigFencePost|sigOven|sigHut|sigBlock|sigTower|sigCisternCol|sigTombDoor|sigSarc|sigPeak|sigZig/i;
 let added=0;
 for(const o of atlasObjs){
   if(o.kind!=='box'||!solid.test(o.name)||o.sy<.25)continue;const [x1,z1,x2,z2]=atlasObjectBounds(o,.08);const blocksMarker=(x1<AX+.95&&x2>AX-.95&&z1<AZ+.95&&z2>AZ-.95);const blocksSpawn=(x1<AX+.80&&x2>AX-.80&&z1<AZ+5.9&&z2>AZ+4.45);const blocksLane=(x1<AX+.70&&x2>AX-.70&&z1<AZ+5.4&&z2>AZ-.7);if(blocksMarker||blocksSpawn||blocksLane)continue;acoll(x1,z1,x2,z2);if(++added>200)break;
 }
}

function buildChapter2ManagementRoom(){
 const floor=[.48,.50,.52,1],wall=[.63,.65,.67,1],dark=[.20,.23,.26,1];
 abox('c2Floor',AX,-.055,AZ,14,.10,14,'floor',floor,[7,7]);
 abox('c2Ceiling',AX,3.05,AZ,14,.08,14,'wall',[.32,.34,.36,1],[7,7]);
 abox('c2North',AX,1.5,AZ-7,14,3,.18,'wall',wall,[6,2]);
 abox('c2South',AX,1.5,AZ+7,14,3,.18,'wall',wall,[6,2]);
 abox('c2West',AX-7,1.5,AZ,.18,3,14,'wall',wall,[6,2]);
 abox('c2East',AX+7,1.5,AZ,.18,3,14,'wall',wall,[6,2]);
 bounds(7);
 for(let x=-5.2;x<=5.2;x+=2.6)afluor(AX+x,2.92,AZ,1.15);
 // Merkez koridoru tamamen açık bırak. İstasyonlar duvar çevresinde.
 // 1) KİLİT İSTASYONU
 abox('c2DoorPanel',AX-5.65,1.12,AZ+2.65,.18,2.24,2.0,'wood',[.42,.32,.25,1],[1,2]);
 abox('c2Lock',AX-5.50,1.05,AZ+2.20,.08,.22,.22,'white',[.92,.70,.26,1],[1,1],0,.82);
 abox('c2StationPad1',AX-4.25,.018,AZ+2.65,1.5,.025,1.5,'white',[.18,.50,.64,1],[1,1],0,.18);
 // 2) EREN İSTASYONU
 pushNPC3D(atlasObjs,'EREN',AX-4.35,AZ-.55,{name:'chapter2Eren3D',sceneActor:true,ambientStyle:'work',active:true,ry:Math.PI,targetX:AX-4.35,targetZ:AZ-.55,walkIn:true,moveSpeed:1.10});
 abox('c2StationPad2',AX-3.35,.018,AZ-.55,1.5,.025,1.5,'white',[.18,.50,.64,1],[1,1],0,.18);
 // 3) SES KAYIT İSTASYONU
 abox('c2RecDesk',AX-1.35,.70,AZ-4.25,2.0,.12,.85,'wood',[.44,.35,.28,1]);
 abox('c2Recorder',AX-1.35,.82,AZ-4.18,.72,.14,.42,'white',[.08,.11,.14,1],[1,1],0,.20);
 abox('c2RecLed',AX-1.08,.91,AZ-4.19,.09,.05,.09,'white',[.16,1,.52,1],[1,1],0,.98);
 abox('c2StationPad3',AX-1.35,.018,AZ-2.85,1.5,.025,1.5,'white',[.18,.50,.64,1],[1,1],0,.18);
 // 4) CCTV İSTASYONU
 abox('c2CctvDesk',AX+2.45,.70,AZ-4.25,2.15,.12,.85,'wood',[.44,.35,.28,1]);
 abox('c2Cctv',AX+2.45,1.35,AZ-4.62,1.65,.95,.10,'white',[.05,.08,.11,1],[1,1],0,.12);
 abox('c2CctvGlow',AX+2.45,1.35,AZ-4.68,1.48,.76,.025,'white',[.20,.68,1,1],[1,1],0,.72);
 abox('c2StationPad4',AX+2.45,.018,AZ-2.85,1.5,.025,1.5,'white',[.18,.50,.64,1],[1,1],0,.18);
 // 5) TEST ALANI
 abox('c2TestMat',AX+4.35,.025,AZ+1.35,2.0,.035,2.0,'rug',[.25,.48,.58,1],[1,1],0,.22);
 abox('c2TestPoleL',AX+3.55,.78,AZ+.45,.08,1.55,.08,'white',[.72,.76,.78,1]);
 abox('c2TestPoleR',AX+5.15,.78,AZ+.45,.08,1.55,.08,'white',[.72,.76,.78,1]);
 // duvar ekranı: bölümün saat motifi
 abox('c2ClockPanel',AX+5.85,1.85,AZ-1.75,.10,1.10,2.5,'white',dark,[1,1],0,.08);
 abox('c2ClockGlow',AX+5.72,1.85,AZ-1.75,.025,.75,2.1,'white',[.18,.62,.82,1],[1,1],0,.48);
 // spawn güvenli ve merkez koridor açık
}
function gameplayColor(kind,active=false){
 const a=active?1:.52;
 const map={talk:[.28,.78,1,a],camera:[.20,.72,1,a],audio:[.28,1,.66,a],door:[1,.72,.28,a],phone:[.58,.84,1,a],document:[.88,.72,.34,a],route:[.34,.90,.72,a],memory:[.86,.54,1,a],body:[1,.48,.38,a],hazard:[1,.36,.16,a],anomaly:[.54,.38,1,a],observe:[.32,.78,1,a],inspect:[.58,.72,.82,a]};
 return map[kind]||map.inspect;
}
function chapterLocalStepPosition(st){
 if(!st)return [0,0];
 let lx=Array.isArray(st.pos)?Number(st.pos[0]||0):0,lz=Array.isArray(st.pos)?Number(st.pos[1]||0):0;
 // Bölüm 8: hedefler bina cephesine değil, yürünebilir cadde/zemin hattına oturur.
 // Oyuncunun dükkânın içine girmesi gerekmez; bütün kaza zinciri sokakta oynanır.
 if(activeChapter===8&&st.loc==='bakeryStreet'){
   const slots=[[.70,3.15],[1.30,1.55],[.55,.10],[-.85,-1.15],[-2.05,-.20],[-1.10,2.05],[1.70,2.10],[2.25,-1.45]];
   const q=slots[Math.max(0,Math.min(slots.length-1,Number(st.stepIndex||0)))];lx=q[0];lz=q[1];
 }
 // Kapalı küçük ulaşım sahnelerinde authored koordinatları güvenli kabin yuvalarına dönüştür.
 else if(st.loc==='elevator'){
   const slots=[[-.72,-.78],[.72,-.72],[-.72,.10],[.72,.10],[0,.82]];
   const q=slots[Math.abs(Number(st.stepIndex||0))%slots.length];lx=q[0];lz=q[1];
 }else if(st.loc==='car'){
   lx=Math.max(-1.28,Math.min(1.28,lx));lz=Math.max(-2.45,Math.min(2.45,lz));
 }
 return [lx,lz];
}
function chapterSpawnPoint(loc){
 if(loc==='elevator')return [AX,AZ+.92];
 if(loc==='car')return [AX,AZ+2.75];
 // v2.9.5: Bölüm 8 her zaman Fırın Sokağı'nın açık yolunda, ilk hedefe yakın başlar.
 if(activeChapter===8&&loc==='bakeryStreet')return [AX,AZ+4.25];
 return [AX,AZ+5.2];
}

// ---------- v2.7.0: GERÇEKÇİ HACİMLİ 3D NPC SİSTEMİ ----------
// Mahir'in gerçekçi yönlü sprite'ı korunur. Diğer karakterler sahnede gerçek hacim,
// derinlik testi, gövde parçaları ve basit eklem animasyonlarıyla çizilir.
const NPC_PROFILES={
 'EREN':      {h:1.78,skin:[.56,.39,.29,1],hair:[.075,.055,.043,1],top:[.17,.20,.20,1],top2:[.115,.135,.14,1],pants:[.085,.095,.105,1],shoe:[.065,.052,.043,1],build:.98,hairType:'short',gender:'m',shoulder:1.02,waist:.91,hip:.94,head:.96,eye:[.20,.15,.11,1],lip:[.34,.18,.16,1],brow:[.07,.05,.04,1],faceGlow:.10},
 'MİNA':      {h:1.58,skin:[.64,.46,.36,1],hair:[.085,.055,.040,1],top:[.30,.24,.39,1],top2:[.225,.18,.30,1],pants:[.12,.13,.17,1],shoe:[.085,.067,.075,1],build:.86,hairType:'long',gender:'f',shoulder:.91,waist:.78,hip:1.02,head:.98,eye:[.20,.14,.10,1],lip:[.42,.20,.22,1],brow:[.075,.050,.038,1],faceGlow:.12},
 'NİSAN':     {h:1.68,skin:[.57,.39,.30,1],hair:[.040,.032,.029,1],top:[.52,.55,.57,1],top2:[.17,.23,.24,1],pants:[.075,.085,.10,1],shoe:[.055,.050,.048,1],build:.87,hairType:'bob',gender:'f',shoulder:.90,waist:.82,hip:.96,head:.98,eye:[.14,.10,.075,1],lip:[.34,.16,.17,1],brow:[.045,.035,.030,1],faceGlow:.075,labCoat:true},
 'BARAN':     {h:1.84,skin:[.55,.36,.27,1],hair:[.035,.030,.028,1],top:[.235,.125,.135,1],top2:[.16,.085,.095,1],pants:[.07,.08,.09,1],shoe:[.06,.047,.040,1],build:1.05,hairType:'short',gender:'m',shoulder:1.10,waist:.94,hip:.95,head:.95,eye:[.13,.10,.08,1],lip:[.30,.15,.14,1],brow:[.042,.034,.030,1],faceGlow:.08},
 'KAYITÇI':   {h:1.82,skin:[.57,.59,.60,1],hair:[.028,.030,.034,1],top:[.070,.078,.090,1],top2:[.042,.047,.057,1],pants:[.050,.055,.064,1],shoe:[.036,.039,.046,1],build:.95,hairType:'short',gender:'u',shoulder:.98,waist:.86,hip:.91,head:.98,eye:[.20,.80,1,1],lip:[.29,.31,.32,1],brow:[.03,.04,.05,1],uncanny:true,glow:.12,faceGlow:.20},
 'LEYLA':     {h:1.66,skin:[.60,.42,.32,1],hair:[.065,.044,.034,1],top:[.27,.205,.16,1],top2:[.20,.145,.115,1],pants:[.105,.11,.12,1],shoe:[.07,.058,.05,1],build:.92,hairType:'long',gender:'f',shoulder:.93,waist:.80,hip:1.01,head:.97,eye:[.18,.13,.09,1],lip:[.40,.19,.19,1],brow:[.06,.043,.034,1],faceGlow:.11},
 'SELİN':     {h:1.69,skin:[.66,.48,.38,1],hair:[.32,.10,.055,1],top:[.12,.28,.20,1],top2:[.74,.69,.56,1],pants:[.07,.09,.13,1],shoe:[.10,.065,.04,1],build:.88,hairType:'bob',gender:'f',shoulder:.90,waist:.79,hip:.98,head:.98,eye:[.18,.22,.12,1],lip:[.40,.18,.17,1],brow:[.10,.055,.035,1],faceGlow:.10},
 'SUNA':      {h:1.64,skin:[.63,.45,.35,1],hair:[.072,.050,.038,1],top:[.20,.285,.27,1],top2:[.145,.21,.20,1],pants:[.10,.11,.12,1],shoe:[.07,.06,.052,1],build:.92,hairType:'bob',gender:'f',shoulder:.92,waist:.80,hip:1.00,head:.97,eye:[.19,.14,.10,1],lip:[.41,.20,.20,1],brow:[.065,.045,.035,1],faceGlow:.11},
 'MUHAFIZ':   {h:1.86,skin:[.50,.34,.26,1],hair:[.030,.028,.026,1],top:[.145,.155,.165,1],top2:[.085,.09,.10,1],pants:[.065,.072,.082,1],shoe:[.047,.044,.040,1],build:1.07,hairType:'short',gender:'m',shoulder:1.12,waist:.96,hip:.96,head:.94,eye:[.12,.09,.07,1],lip:[.29,.15,.14,1],brow:[.035,.030,.028,1],faceGlow:.07},
 'DOKTOR':    {h:1.76,skin:[.59,.42,.33,1],hair:[.075,.064,.058,1],top:[.60,.63,.65,1],top2:[.25,.35,.40,1],pants:[.15,.18,.22,1],shoe:[.075,.076,.08,1],build:.95,hairType:'short',gender:'m',shoulder:.98,waist:.90,hip:.93,head:.97,eye:[.17,.13,.10,1],lip:[.35,.17,.17,1],brow:[.068,.058,.052,1],faceGlow:.075,labCoat:true},
 'DİĞER MAHİR':{h:1.80,skin:[.49,.31,.23,1],hair:[.050,.041,.037,1],top:[.12,.13,.14,1],top2:[.078,.083,.092,1],pants:[.068,.071,.075,1],shoe:[.09,.067,.050,1],build:.99,hairType:'short',gender:'m',shoulder:1.02,waist:.90,hip:.94,head:.96,eye:[.14,.10,.08,1],lip:[.31,.15,.14,1],brow:[.052,.042,.038,1],mahirLike:true,faceGlow:.08},
 'KAYITTAKİ MAHİR':{h:1.80,skin:[.49,.31,.23,1],hair:[.050,.041,.037,1],top:[.14,.15,.16,1],top2:[.085,.093,.10,1],pants:[.068,.071,.075,1],shoe:[.09,.067,.050,1],build:.99,hairType:'short',gender:'m',shoulder:1.02,waist:.90,hip:.94,head:.96,eye:[.14,.10,.08,1],lip:[.31,.15,.14,1],brow:[.052,.042,.038,1],mahirLike:true,faceGlow:.08},
 'ÇOCUK MAHİR':{h:1.42,skin:[.54,.36,.27,1],hair:[.052,.042,.036,1],top:[.18,.22,.25,1],top2:[.125,.155,.18,1],pants:[.09,.10,.11,1],shoe:[.07,.057,.048,1],build:.80,hairType:'short',gender:'m',shoulder:.94,waist:.88,hip:.94,head:1.04,eye:[.16,.11,.08,1],lip:[.33,.16,.15,1],brow:[.052,.041,.035,1],faceGlow:.10}
};
function canonicalCharacterName(v){
 let n=String(v||'').trim().toLocaleUpperCase('tr-TR').replace(/\s+/g,' ');
 if(n==='EREN')return 'EREN';
 // Anlatı içindeki ses/metin nesnelerini insan bedenine dönüştürme.
 if(/SESİ|MESAJI|DEFTERİ|CÜMLE|SİSTEM|ANLATICI|KAYIT\s*\/|DOSYA/.test(n))return '';
 return n;
}
function hash01(str,seed=0){
 let h=2166136261^seed;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return ((h>>>0)%1000)/1000;
}
function genericNPCProfile(name){
 const a=hash01(name,11),b=hash01(name,23),c=hash01(name,37),f=hash01(name,107)>.48;
 const top=[.14+.20*a,.16+.16*b,.16+.19*c,1],top2=[top[0]*.72,top[1]*.72,top[2]*.72,1];
 return {h:1.62+hash01(name,51)*.22,skin:[.52+.10*hash01(name,61),.34+.10*hash01(name,67),.26+.08*hash01(name,71),1],
  hair:[.040+.045*hash01(name,73),.032+.030*hash01(name,79),.027+.022*hash01(name,83),1],
  top,top2,pants:[.075+.045*b,.085+.038*c,.095+.038*a,1],shoe:[.065,.055,.050,1],build:.89+.13*hash01(name,97),
  hairType:hash01(name,101)>.68?'long':(hash01(name,103)>.47?'bob':'short'),gender:f?'f':'m',shoulder:f?.93:1.03,waist:f?.80:.91,hip:f?1.00:.94,head:.95+.05*hash01(name,109),
  eye:[.12+.10*hash01(name,113),.09+.07*hash01(name,127),.07+.05*hash01(name,131),1],lip:[.34+.06*hash01(name,137),.16+.04*hash01(name,139),.16+.04*hash01(name,149),1],brow:[.045,.036,.032,1],faceGlow:.09};
}
function npcProfile(name){
 const n=canonicalCharacterName(name);if(!n)return null;
 return NPC_PROFILES[n]||genericNPCProfile(n);
}

// ---------- v2.7.0: YAŞAYAN SAHNE DAVRANIŞI ----------
// Aktörler yalnız görev işareti geldiğinde var olmaz; bölümün aynı mekânındaki konuşmacılar
// sahne kurulurken yerleştirilir ve görev dışında kendi karakterlerine uygun düşük yoğunluklu davranışlar yapar.
const NPC_AMBIENT_STYLES={
 'EREN':'work','MİNA':'wander','NİSAN':'inspect','BARAN':'pace','KAYITÇI':'uncanny',
 'LEYLA':'wander','SELİN':'wander','SUNA':'inspect','MUHAFIZ':'guard','DOKTOR':'station',
 'DİĞER MAHİR':'still','KAYITTAKİ MAHİR':'still','ÇOCUK MAHİR':'wander'
};
function npcAmbientStyle(name){
 const n=canonicalCharacterName(name);if(!n)return 'still';
 return NPC_AMBIENT_STYLES[n]||(['wander','inspect','still'][Math.floor(hash01(n,211)*3)]);
}
function currentTalkCharacter(){
 if(!activeAtlas||atlasBrowseMode)return '';
 const st=chapterSequence(chapterByNo(activeChapter))[chapterSeqIndex];
 return st&&st.kind==='talk'?canonicalCharacterName(st.char||st.speaker||st.label):'';
}
function seedChapterSceneActors(loc){
 if(atlasBrowseMode||!loc)return 0;
 const seq=chapterSequence(chapterByNo(activeChapter)),seen=new Set();let made=0;
 for(const st of seq){
   if(st.loc!==loc||st.kind!=='talk')continue;
   const n=canonicalCharacterName(st.char||st.speaker||st.label);if(!n||seen.has(n))continue;seen.add(n);
   if(findChapterActor(n))continue;
   const q=chapterLocalStepPosition(st),x=AX+q[0],z=AZ+q[1]-.66;
   const safe=findNPCEntrySpot(x,z,hash01(n,223));
   const o=pushNPC3D(atlasObjs,n,safe[0],safe[1],{name:'sceneActor_'+activeChapter+'_'+npcActorKey(n),sceneActor:true,active:false,ry:Math.PI,targetX:x,targetZ:z,walkIn:false,moveSpeed:1.02});
   if(o){o.homeX=x;o.homeZ=z;o.targetX=x;o.targetZ=z;o.ambientEnabled=true;o.ambientStyle=npcAmbientStyle(n);o.ambientClock=.7+hash01(n,227)*2.0;o.ambientIndex=0;o.arrived=false;o.actorState='enter';made++;}
 }
 return made;
}
function ambientCandidate(o,ox,oz){
 const x=o.homeX+ox,z=o.homeZ+oz;
 return npcCanStep(o,x,z)?[x,z]:[o.homeX,o.homeZ];
}
function updateNPCAmbientIntent(o,dt,nowSec){
 if(!o.sceneActor||!o.ambientEnabled||o.active||o.character===currentTalkCharacter())return;
 if(isDialogueOpen||interactionBusy||chapterInterludeOpen||isMechanicOpen)return;
 if((o.phaseTimer||0)>0){o.phaseTimer=Math.max(0,o.phaseTimer-dt);o.actorState='phase';return;}
 // Görev tarafından verilmiş bir hedefe yürüyorsa ambient sistem hedefi ezmez.
 if(Math.hypot((o.targetX??o.homeX)-o.x,(o.targetZ??o.homeZ)-o.z)>.20)return;
 o.ambientClock=(o.ambientClock||0)-dt;
 if(o.ambientClock>0){
   if(o.actorState==='inspect'){const a=(o.seed||0)+Math.sin(nowSec*.22)*.35;o.ry+=shortestAngle(o.ry,a)*Math.min(1,dt*1.2);}
   else if(o.actorState==='guard'||o.actorState==='station'||o.actorState==='still'){o.moveAmount=Math.max(0,(o.moveAmount||0)-dt*5);}
   return;
 }
 const style=o.ambientStyle||npcAmbientStyle(o.character),phase=(o.ambientIndex=(o.ambientIndex||0)+1),sgn=phase%2?1:-1;
 o.ambientClock=2.8+hash01(o.character,239+phase)*4.2;
 if(style==='work'){
   const q=ambientCandidate(o,sgn*.72,((phase%3)-1)*.28);o.targetX=q[0];o.targetZ=q[1];o.actorState='walk';
 }else if(style==='wander'){
   const a=(o.seed||0)+phase*1.91,r=.42+.48*hash01(o.character,241+phase),q=ambientCandidate(o,Math.sin(a)*r,Math.cos(a)*r);o.targetX=q[0];o.targetZ=q[1];o.actorState='walk';
 }else if(style==='inspect'){
   if(phase%2){const a=(o.seed||0)+phase*1.27,q=ambientCandidate(o,Math.sin(a)*.55,Math.cos(a)*.55);o.targetX=q[0];o.targetZ=q[1];o.actorState='walk';}
   else{o.actorState='inspect';o.ry+=sgn*.55;}
 }else if(style==='pace'){
   // Baran yaklaşan oyuncuya yapışmak yerine alan tutar; kısa, köşeli bir devriye yapar.
   let ax=sgn*1.05,az=(phase%4<2?.25:-.25);if(Math.hypot(px-o.x,pz-o.z)<2.1){const dx=o.x-px,dz=o.z-pz,d=Math.hypot(dx,dz)||1;ax+=dx/d*.55;az+=dz/d*.55;}const q=ambientCandidate(o,ax,az);o.targetX=q[0];o.targetZ=q[1];o.actorState='walk';
 }else if(style==='guard'){
   o.actorState='guard';const want=Math.atan2(px-o.x,pz-o.z);if(Math.hypot(px-o.x,pz-o.z)<5)o.ry+=shortestAngle(o.ry,want)*.35;
 }else if(style==='station'){
   o.actorState='station';o.ry+=Math.sin(nowSec*.31+(o.seed||0))*.035;
 }else if(style==='uncanny'){
   // Kayıtçı yürümeyi taklit eder ama bazen iki kare arasını "atlayarak" geçer. Oyuncu yakındaysa teleport yapılmaz.
   if(Math.hypot(px-o.x,pz-o.z)>3.2&&phase%3===0){const a=(o.seed||0)+phase*2.07,q=ambientCandidate(o,Math.sin(a)*.70,Math.cos(a)*.70);o.x=q[0];o.z=q[1];o.targetX=q[0];o.targetZ=q[1];o.phaseTimer=.38;o.actorState='phase';}
   else{o.actorState='uncanny';o.ry+=Math.PI*(.22+.20*hash01(o.character,251+phase));}
 }else{
   o.actorState='still';o.ry+=Math.sin(nowSec*.27+(o.seed||0))*.08;
 }
}
function npcActorKey(name){return canonicalCharacterName(name).replace(/[^A-ZÇĞİÖŞÜ0-9]+/g,'_');}
function npcSpotBlocked(x,z,self=null){
 const r=.30;
 for(const b of atlasCollisions)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;
 for(const o of atlasObjs){if(o===self||o.kind!=='npc3d')continue;const rr=.31*(npcProfile(o.character)?.build||1);if((x-o.x)*(x-o.x)+(z-o.z)*(z-o.z)<(r+rr)*(r+rr))return true;}
 return false;
}
function findNPCEntrySpot(tx,tz,seed=0){
 const angles=[Math.PI,Math.PI*.5,-Math.PI*.5,0,Math.PI*.75,-Math.PI*.75,Math.PI*.25,-Math.PI*.25];
 for(let ring=2.25;ring>=1.25;ring-=.5){for(let i=0;i<angles.length;i++){const a=angles[(i+Math.floor(seed*7))%angles.length],x=tx+Math.sin(a)*ring,z=tz+Math.cos(a)*ring;if(!npcSpotBlocked(x,z))return [x,z];}}
 return [tx,tz];
}
function makeNPC3D(character,x,z,opts={}){
 const n=canonicalCharacterName(character),p=npcProfile(n);if(!n||!p)return null;
 const tx=Number.isFinite(opts.targetX)?opts.targetX:x,tz=Number.isFinite(opts.targetZ)?opts.targetZ:z;
 let sx=x,sz=z;
 if(opts.walkIn){const q=findNPCEntrySpot(tx,tz,hash01(n,149));sx=q[0];sz=q[1];}
 return {name:opts.name||('npc3d_'+n),kind:'npc3d',character:n,x:sx,y:0,z:sz,w:.78*(p.build||1),h:p.h,
   ry:Number.isFinite(opts.ry)?opts.ry:Math.PI,active:!!opts.active,seed:hash01(n,131)*6.28318,
   targetX:tx,targetZ:tz,homeX:tx,homeZ:tz,moveSpeed:Number(opts.moveSpeed)||1.18,movePhase:0,moveAmount:0,
   actorState:opts.walkIn?'enter':'idle',arrived:!opts.walkIn,sceneActor:!!opts.sceneActor,lastMoveDx:0,lastMoveDz:0,
   ambientEnabled:opts.ambientEnabled!==false&&!!opts.sceneActor,ambientStyle:opts.ambientStyle||npcAmbientStyle(n),ambientClock:.8+hash01(n,233)*2.4,ambientIndex:0,phaseTimer:0,
   navPath:null,navIndex:0,navTargetX:tx,navTargetZ:tz,repathClock:0,stuckClock:0,lastNavX:sx,lastNavZ:sz};
}
function pushNPC3D(list,character,x,z,opts={}){
 const o=makeNPC3D(character,x,z,opts);if(o)list.push(o);return o;
}
function findChapterActor(character){
 const n=canonicalCharacterName(character);return atlasObjs.find(o=>o.kind==='npc3d'&&o.sceneActor&&o.character===n)||null;
}
function ensureChapterActor(character,x,z,opts={}){
 const n=canonicalCharacterName(character);if(!n)return null;
 let o=findChapterActor(n);
 if(!o){o=pushNPC3D(atlasObjs,n,x,z,{...opts,name:'chapterActor_'+activeChapter+'_'+npcActorKey(n),sceneActor:true,targetX:x,targetZ:z,walkIn:opts.walkIn!==false});}
 if(!o)return null;
 o.active=!!opts.active;o.homeX=x;o.homeZ=z;o.targetX=x;o.targetZ=z;o.moveSpeed=Number(opts.moveSpeed)||o.moveSpeed||1.18;o.ambientEnabled=true;o.ambientStyle=o.ambientStyle||npcAmbientStyle(n);o.arrived=Math.hypot(o.x-x,o.z-z)<.16;
 if(!o.arrived)o.actorState='walk';
 return o;
}
function activeConversationActor(){
 if(!activeAtlas||atlasBrowseMode)return null;const c=chapterByNo(activeChapter),st=chapterSequence(c)[chapterSeqIndex];if(!st||st.kind!=='talk')return null;
 return findChapterActor(st.char||st.speaker||st.label)||atlasObjs.find(o=>o.kind==='npc3d'&&canonicalCharacterName(st.char||st.speaker||st.label)===o.character)||null;
}
// ---------- v3.0.0: NPC NAVMESH-LITE / A* IZGARA YOL BULMA ----------
function npcCanStep(o,x,z,ignorePlayer=false){
 const r=.255*(npcProfile(o.character)?.build||1);
 for(const b of atlasCollisions)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return false;
 for(const q of atlasObjs){if(q===o||q.kind!=='npc3d')continue;const rr=.255*(npcProfile(q.character)?.build||1);if((x-q.x)*(x-q.x)+(z-q.z)*(z-q.z)<(r+rr)*(r+rr))return false;}
 // Konuşma aktörü hedefe yaklaşırken oyuncuyu duvar gibi kabul etmez; yalnız fiziksel çakışmayı engeller.
 const personal=(o.active||o.character===currentTalkCharacter())?.43:.58;
 if(!ignorePlayer&&(x-px)*(x-px)+(z-pz)*(z-pz)<personal*personal)return false;
 return true;
}
function npcStaticWalkable(o,x,z){
 const r=.255*(npcProfile(o.character)?.build||1);
 for(const b of atlasCollisions)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return false;
 return true;
}
function npcLineClear(o,x0,z0,x1,z1){
 const d=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(d/.30));
 for(let i=1;i<=n;i++){const t=i/n;if(!npcStaticWalkable(o,x0+(x1-x0)*t,z0+(z1-z0)*t))return false;}
 return true;
}
function planNPCPath(o,tx,tz){
 const cell=.46,pad=4.2,maxSpan=18.0;
 let minX=Math.min(o.x,tx)-pad,maxX=Math.max(o.x,tx)+pad,minZ=Math.min(o.z,tz)-pad,maxZ=Math.max(o.z,tz)+pad;
 if(maxX-minX>maxSpan){const mid=(o.x+tx)*.5;minX=mid-maxSpan*.5;maxX=mid+maxSpan*.5;}
 if(maxZ-minZ>maxSpan){const mid=(o.z+tz)*.5;minZ=mid-maxSpan*.5;maxZ=mid+maxSpan*.5;}
 const nx=Math.max(3,Math.floor((maxX-minX)/cell)+1),nz=Math.max(3,Math.floor((maxZ-minZ)/cell)+1);
 const ix=x=>Math.max(0,Math.min(nx-1,Math.round((x-minX)/cell))),iz=z=>Math.max(0,Math.min(nz-1,Math.round((z-minZ)/cell)));
 const wx=i=>minX+i*cell,wz=j=>minZ+j*cell,key=(i,j)=>i+','+j;
 const si=ix(o.x),sj=iz(o.z);let gi=ix(tx),gj=iz(tz);
 // Hedef kutunun kenarına denk geldiyse en yakın yürünebilir hücreyi seç.
 if(!npcStaticWalkable(o,wx(gi),wz(gj))){let found=null;for(let r=1;r<=4&&!found;r++)for(let di=-r;di<=r&&!found;di++)for(let dj=-r;dj<=r;dj++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=gi+di,b=gj+dj;if(a<0||b<0||a>=nx||b>=nz)continue;if(npcStaticWalkable(o,wx(a),wz(b))){found=[a,b];break;}}if(found){gi=found[0];gj=found[1];}}
 const start=key(si,sj),goal=key(gi,gj),open=[{i:si,j:sj,f:0}],g=new Map([[start,0]]),came=new Map(),closed=new Set();
 const dirs=[[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]];
 let loops=0;
 while(open.length&&loops++<1400){
   let bi=0;for(let q=1;q<open.length;q++)if(open[q].f<open[bi].f)bi=q;const cur=open.splice(bi,1)[0],ck=key(cur.i,cur.j);if(closed.has(ck))continue;closed.add(ck);
   if(ck===goal){const cells=[];let k=ck;while(k!==start&&came.has(k)){const [a,b]=k.split(',').map(Number);cells.push([wx(a),wz(b)]);k=came.get(k);}cells.reverse();cells.push([tx,tz]);
     // Görüş hattı açıksa ara düğümleri seyrekleştir: robotik zikzak azalır.
     const path=[],origin=[o.x,o.z];let ax=origin[0],az=origin[1];for(let i=0;i<cells.length;){let best=i;for(let j=cells.length-1;j>i;j--)if(npcLineClear(o,ax,az,cells[j][0],cells[j][1])){best=j;break;}path.push(cells[best]);ax=cells[best][0];az=cells[best][1];i=best+1;}return path;
   }
   const cg=g.get(ck)??1e9;
   for(const [di,dj,cost] of dirs){const a=cur.i+di,b=cur.j+dj;if(a<0||b<0||a>=nx||b>=nz)continue;const x=wx(a),z=wz(b);if(!npcStaticWalkable(o,x,z))continue;
     if(di&&dj&&(!npcStaticWalkable(o,wx(cur.i+di),wz(cur.j))||!npcStaticWalkable(o,wx(cur.i),wz(cur.j+dj))))continue;
     const nk=key(a,b);if(closed.has(nk))continue;const ng=cg+cost;if(ng<(g.get(nk)??1e9)){g.set(nk,ng);came.set(nk,ck);const h=Math.hypot(gi-a,gj-b);open.push({i:a,j:b,f:ng+h});}}
 }
 return null;
}
function setNPCNavigationTarget(o,tx,tz,force=false){
 const changed=Math.hypot((o.navTargetX??tx)-tx,(o.navTargetZ??tz)-tz)>.18;
 if(force||changed||!o.navPath){o.navTargetX=tx;o.navTargetZ=tz;o.navPath=planNPCPath(o,tx,tz);o.navIndex=0;o.repathClock=.55;}
}
function updateNPCActors(dt){
 const list=activeAtlas?atlasObjs:objs,nowSec=performance.now()*.001;
 for(const o of list){if(o.kind!=='npc3d')continue;
   updateNPCAmbientIntent(o,dt,nowSec);
   const tx=Number.isFinite(o.targetX)?o.targetX:o.x,tz=Number.isFinite(o.targetZ)?o.targetZ:o.z,dGoal=Math.hypot(tx-o.x,tz-o.z);
   o.repathClock=Math.max(0,(o.repathClock||0)-dt);
   const advanced=Math.hypot(o.x-(o.lastNavX??o.x),o.z-(o.lastNavZ??o.z));
   if(advanced<.012&&dGoal>.20)o.stuckClock=(o.stuckClock||0)+dt;else o.stuckClock=Math.max(0,(o.stuckClock||0)-dt*2.2);
   o.lastNavX=o.x;o.lastNavZ=o.z;
   if(dGoal>.055&&!isDialogueOpen&&!interactionBusy){
     const direct=npcLineClear(o,o.x,o.z,tx,tz);
     if(!direct||o.stuckClock>.18)setNPCNavigationTarget(o,tx,tz,o.repathClock<=0||o.stuckClock>.45);
     let wx=tx,wz=tz;
     if(!direct&&o.navPath&&o.navPath.length){while(o.navIndex<o.navPath.length-1&&Math.hypot(o.x-o.navPath[o.navIndex][0],o.z-o.navPath[o.navIndex][1])<.24)o.navIndex++;const wp=o.navPath[Math.min(o.navIndex,o.navPath.length-1)];wx=wp[0];wz=wp[1];}
     let dx=wx-o.x,dz=wz-o.z,d=Math.hypot(dx,dz)||1,nx=dx/d,nz=dz/d,sp=Math.min(o.moveSpeed||1.18,d/Math.max(.001,dt)),step=Math.min(d,sp*dt),xx=o.x+nx*step,zz=o.z+nz*step;
     let moved=false;
     if(npcCanStep(o,xx,zz)){o.x=xx;o.z=zz;moved=true;}
     else{
       // Dinamik engeller için geniş açılı steering. Küçük tek yana adım yerine birkaç açı dener.
       const base=Math.atan2(nx,nz),angles=[.38,-.38,.72,-.72,1.08,-1.08,1.45,-1.45];
       for(const a of angles){const vx=Math.sin(base+a),vz=Math.cos(base+a),ax=o.x+vx*step,az=o.z+vz*step;if(npcCanStep(o,ax,az)){o.x=ax;o.z=az;nx=vx;nz=vz;moved=true;o.actorState='avoid';break;}}
     }
     if(moved){o.lastMoveDx=nx;o.lastMoveDz=nz;o.ry+=shortestAngle(o.ry,Math.atan2(nx,nz))*Math.min(1,dt*11);o.moveAmount=Math.min(1,step/Math.max(.001,(o.moveSpeed||1.18)*dt));o.movePhase+=dt*(5.7+2.0*o.moveAmount);if(o.actorState!=='avoid')o.actorState='walk';o.stuckClock=Math.max(0,o.stuckClock-dt*2.5);}
     else{o.moveAmount=0;o.actorState='blocked';if(o.repathClock<=0)setNPCNavigationTarget(o,tx,tz,true);}
     // Son güvenlik: görev konuşmacısı 2.6 sn boyunca ilerleyememişse hedef çevresindeki açık bir hücreye yumuşak kurtarma.
     if(o.sceneActor&&o.stuckClock>2.6){const safe=findNPCEntrySpot(tx,tz,hash01(o.character,401+Math.floor(nowSec)));if(npcStaticWalkable(o,safe[0],safe[1])){o.x+=(safe[0]-o.x)*.55;o.z+=(safe[1]-o.z)*.55;o.stuckClock=0;o.navPath=null;o.repathClock=0;}}
   }else{
     o.moveAmount=Math.max(0,(o.moveAmount||0)-dt*6);o.arrived=dGoal<=.26;if(o.arrived&&o.actorState!=='talk'&&!['inspect','guard','station','uncanny','phase','still'].includes(o.actorState))o.actorState='idle';
   }
   if((o.active||npcIsSpeaking(o))&&Math.hypot(px-o.x,pz-o.z)<6){const want=Math.atan2(px-o.x,pz-o.z);o.ry+=shortestAngle(o.ry,want)*Math.min(1,dt*7.5);}
 }
}
function prepareConversationFacing(st){
 if(!st||st.kind!=='talk')return true;const actor=activeConversationActor();if(!actor)return true;
 const dHome=Math.hypot(actor.x-(actor.targetX??actor.x),actor.z-(actor.targetZ??actor.z));
 if(dHome>.48&&Math.hypot(px-actor.x,pz-actor.z)>1.25){actor.actorState='walk';actor.active=true;setNPCNavigationTarget(actor,actor.targetX??actor.homeX,actor.targetZ??actor.homeZ,true);Game.toast(`${actor.character} YAKLAŞIYOR…`,900);return false;}
 actor.active=true;actor.actorState='talk';actor.ry=Math.atan2(px-actor.x,pz-actor.z);mahirTargetYaw=Math.atan2(actor.x-px,actor.z-pz);return true;
}
function settleConversationActor(st){
 if(!st||st.kind!=='talk')return;const actor=findChapterActor(st.char||st.speaker||st.label);if(!actor)return;actor.active=false;actor.actorState='idle';actor.targetX=actor.homeX;actor.targetZ=actor.homeZ;actor.ambientClock=1.4+hash01(actor.character,263)*2.2;
}

function buildGameplayProp(st,idx,isActive){
 if(!st)return;const [lx,lz]=chapterLocalStepPosition(st),x=AX+lx,z=AZ+lz,c=gameplayColor(st.kind,isActive),em=isActive?.72:.18;
 const tag='gp'+idx+'_'+(st.kind||'inspect');
 // Props stay non-solid so they cannot trap the player; the target pad is the interaction boundary.
 if(st.kind==='talk'){
   const who=st.char||st.speaker||st.label;
   const npc=ensureChapterActor(who,x,z-.66,{active:!!isActive,ry:Math.PI,walkIn:true,moveSpeed:1.12});
   // İnsan olmayan "ses/sistem/metin" konuşma düğümleri için soyut bir odak bırak.
   if(!npc){abox(tag+'PersonBase',x,.30,z-.65,.65,.60,.38,'wood',[.34,.31,.29,1]);abox(tag+'PersonGlow',x,1.15,z-.65,.22,1.18,.22,'white',c,[1,1],0,em);abox(tag+'PersonHead',x,1.82,z-.65,.34,.34,.34,'white',[.66,.59,.53,1],[1,1],0,.08);}
 }else if(st.kind==='camera'){
   abox(tag+'Desk',x,.62,z-.75,1.65,.12,.68,'wood',[.42,.34,.28,1]);abox(tag+'Screen',x,1.25,z-.96,1.35,.82,.08,'white',[.06,.10,.14,1]);abox(tag+'ScreenGlow',x,1.25,z-1.01,1.18,.64,.02,'white',c,[1,1],0,em);
   // v6.19: sabit inceleme ekranından ayrı, Mahir'in eline alabileceği küçük kamera gövdesi.
   abox(tag+'CameraBody',x+.48,.78,z-.64,.30,.18,.19,'white',[.055,.065,.075,1],[1,1],-.06,.08);abox(tag+'CameraLens',x+.48,.78,z-.535,.13,.13,.07,'white',[.08,.10,.12,1],[1,1],-.06,.35);
 }else if(st.kind==='audio'){
   abox(tag+'Desk',x,.55,z-.70,1.45,.10,.62,'wood',[.42,.34,.28,1]);abox(tag+'Recorder',x,.70,z-.70,.72,.17,.42,'white',[.08,.11,.14,1]);abox(tag+'Led',x+.25,.82,z-.70,.10,.06,.10,'white',c,[1,1],0,.95);
 }else if(st.kind==='door'){
   abox(tag+'Door',x,1.05,z-.86,1.35,2.10,.09,'wood',[.46,.36,.28,1],[1,2]);abox(tag+'Lock',x+.43,1.02,z-.92,.13,.20,.08,'white',c,[1,1],0,em);
 }else if(st.kind==='phone'){
   abox(tag+'Table',x,.48,z-.70,1.10,.88,.70,'wood',[.43,.34,.27,1]);abox(tag+'Phone',x,.95,z-.70,.36,.07,.20,'white',[.06,.08,.11,1]);abox(tag+'PhoneGlow',x,.99,z-.70,.28,.02,.14,'white',c,[1,1],0,em);
 }else if(st.kind==='document'){
   abox(tag+'Desk',x,.54,z-.70,1.65,.10,.72,'wood',[.43,.34,.27,1]);for(let i=0;i<3;i++)abox(tag+'Paper'+i,x-.35+i*.35,.64+i*.01,z-.70,.28,.025,.42,'white',i===1?c:[.78,.77,.72,1],[1,1],i*.08,em*.45);
 }else if(st.kind==='route'){
   abox(tag+'PostL',x-.58,.75,z-.60,.10,1.50,.10,'white',[.28,.32,.34,1]);abox(tag+'PostR',x+.58,.75,z-.60,.10,1.50,.10,'white',[.28,.32,.34,1]);abox(tag+'Arch',x,1.47,z-.60,1.26,.10,.10,'white',c,[1,1],0,em);for(let i=1;i<=3;i++)abox(tag+'Path'+i,x,.018,z+.45+i*.45,.55,.025,.30,'white',c,[1,1],0,.18);
 }else if(st.kind==='memory'){
   abox(tag+'Stand',x,.62,z-.70,1.25,1.24,.42,'wood',[.40,.32,.26,1]);abox(tag+'Frame',x,1.25,z-.92,1.05,.78,.05,'wood',[.25,.21,.18,1]);abox(tag+'Photo',x,1.25,z-.96,.90,.63,.02,'white',c,[1,1],0,em*.65);
 }else if(st.kind==='body'){
   abox(tag+'Mat',x,.025,z,1.8,.035,1.8,'rug',[.26,.45,.52,1]);abox(tag+'PoleL',x-.72,.78,z-.65,.08,1.55,.08,'white',c,[1,1],0,em*.65);abox(tag+'PoleR',x+.72,.78,z-.65,.08,1.55,.08,'white',c,[1,1],0,em*.65);
 }else if(st.kind==='hazard'){
   abox(tag+'Barrier',x,.48,z-.72,1.8,.86,.18,'white',[.86,.34,.12,1],[3,1]);abox(tag+'Beacon',x,1.04,z-.72,.24,.34,.24,'white',c,[1,1],0,.96);
 }else if(st.kind==='anomaly'){
   for(let i=-1;i<=1;i++)abox(tag+'Crystal'+i,x+i*.34,.62+Math.abs(i)*.22,z-.62,.10,1.25,.10,'white',c,[1,1],i*.18,em+.12);abox(tag+'Ring',x,.04,z,1.45,.04,1.45,'white',c,[1,1],0,.32);
 }else if(st.kind==='observe'){
   abox(tag+'Scanner',x,1.05,z-.72,1.30,1.50,.12,'white',[.18,.22,.25,1]);abox(tag+'ScanGlow',x,1.10,z-.80,1.06,.88,.02,'white',c,[1,1],0,em);
 }else{
   abox(tag+'Pedestal',x,.48,z-.68,.78,.92,.78,'wall',[.42,.43,.44,1]);abox(tag+'Artifact',x,1.12,z-.68,.28,.28,.28,'white',c,[1,1],0,em);
 }
}
function decorateActiveChapterScene(loc){
 if(atlasBrowseMode)return;
 const c=chapterByNo(activeChapter),seq=chapterSequence(c);
 if(c.n===1){
   if(loc==='office'){
     pushNPC3D(atlasObjs,'EREN',AX-3.0,AZ-.55,{name:'chapterEren3D',sceneActor:true,ambientStyle:'work',active:true,ry:Math.PI,targetX:AX-3.0,targetZ:AZ-.55,walkIn:true,moveSpeed:1.10});
     abox('chapterRearDoor',AX+6.84,1.05,AZ+1.0,.08,2.10,1.12,'wood',[.43,.34,.27,1],[1,2],0,.08);abox('chapterDoorHandle',AX+6.76,1.02,AZ+.72,.06,.06,.14,'white',[.70,.70,.68,1],[1,1],0,.32);abox('chapterPhoneTable',AX+1.9,.45,AZ-2.4,1.05,.85,.70,'wood',[.46,.36,.28,1]);abox('chapterPhone',AX+1.9,.91,AZ-2.4,.34,.07,.19,'white',[.08,.10,.13,1],[1,1],0,.24);
   }
   if(loc==='corridor'){for(let i=0;i<6;i++)abox('chapterStair'+i,AX,.08+i*.08,AZ-3.4-i*.42,2.4,.16,.42,'floor',[.48,.49,.50,1],[1,1]);abox('chapterStairRailL',AX-1.25,.72,AZ-4.55,.08,1.25,3.0,'white',[.28,.30,.32,1]);abox('chapterStairRailR',AX+1.25,.72,AZ-4.55,.08,1.25,3.0,'white',[.28,.30,.32,1]);}
   return;
 }
 if(c.n===2)return; // chapter 2 has its fully bespoke room
 seedChapterSceneActors(loc);
 const st=seq[chapterSeqIndex];if(st&&st.loc===loc)buildGameplayProp(st,chapterSeqIndex,true);
}
function removeGameplayProps(){
 for(let i=atlasObjs.length-1;i>=0;i--){const n=atlasObjs[i].name||'';if(/^gp\d+_/.test(n))atlasObjs.splice(i,1);}
}


function clearChapterTargetVisual(){
 cancelChapterAction();chapterTarget=null;lastTaskGuideText='';if(taskGuide){taskGuide.classList.remove('show');taskGuide.textContent='';}if(missionCard)hideMissionPeek();
 for(let i=atlasObjs.length-1;i>=0;i--){const n=atlasObjs[i].name||'';if(/^missionTarget/.test(n)||/^atlasMarker/.test(n)||/^gp\d+_/.test(n))atlasObjs.splice(i,1);}
}
function chapterStepPosition(c,st){
 let [lx,lz]=chapterLocalStepPosition(st);
 // Konuşma hedefi NPC'nin tam üstüne değil önüne düşer; Mahir karakterle üst üste binmez.
 if(st&&st.kind==='talk')lz+=1.12;
 return [AX+lx,AZ+lz];
}

function syncChapterTargetVisual(){
 if(!activeAtlas||atlasBrowseMode){clearChapterTargetVisual();return;}
 const c=chapterByNo(activeChapter),seq=chapterSequence(c),st=seq[chapterSeqIndex];
 // Aynı mekânda görev değişince eski prop'u sök, yalnız aktif görevin fiziksel nesnesini kur.
 if(c.n>2){removeGameplayProps();if(st&&st.loc===activeAtlas)buildGameplayProp(st,chapterSeqIndex,true);}
 // Eski genel merkez işaretini kaldır: görev artık gerçek sahne nesnesine bağlı.
 for(let i=atlasObjs.length-1;i>=0;i--){const n=atlasObjs[i].name||'';if(/^missionTarget/.test(n)||/^atlasMarker/.test(n))atlasObjs.splice(i,1);}
 if(!st||st.loc!==activeAtlas){chapterTarget=null;if(taskGuide)taskGuide.classList.remove('show');return;}
 let [tx,tz]=chapterStepPosition(c,st);const safe=findNearestFree(tx,tz,2.4);if(safe){tx=safe[0];tz=safe[1];}
 const nav=reachableTargetFrom(px,pz,tx,tz);
 if(nav){if(nav.repaired){console.warn('[TELKİN v6.12] Ulaşılamayan görev hedefi yürünebilir bölgeye taşındı:',activeChapter,chapterSeqIndex,activeAtlas,'→',nav.x.toFixed(2),nav.z.toFixed(2));}tx=nav.x;tz=nav.z;}
 const exp=chapterExperience(c),ap=actionProfile(st),phase=chapterPhase(c,chapterSeqIndex,seq.length),ac=exp.style.rgb;
 applyChapterExperience(c);chapterTarget={x:tx,z:tz,label:st.goal||st.label||'Görevi ilerlet',kind:st.kind||'point'};
 const beaconUnlocked=chapterMarkerUnlocked(c.n);
 const isTalk=st.kind==='talk',wide=isTalk?.72:((st.kind==='route'||st.kind==='hazard')?1.20:.94),beam=isTalk?1.08:((st.kind==='anomaly'||st.kind==='camera')?1.48:1.22);
 if(beaconUnlocked){
  abox('missionTargetBase',tx,.022,tz,wide,.028,wide,'white',[ac[0]*.42,ac[1]*.72,ac[2],1],[1,1],0,isTalk?.24:.34);
  abox('missionTargetBeam',tx,beam*.52,tz,isTalk?.045:.07,beam,isTalk?.045:.07,'white',ac,[1,1],0,isTalk?.48:.68);
  abox('missionTargetGlow',tx,beam+.07,tz,isTalk?.30:.42,.045,isTalk?.30:.42,'white',[Math.min(1,ac[0]+.25),Math.min(1,ac[1]+.25),Math.min(1,ac[2]+.25),1],[1,1],0,.78);
 }
 if(missionCard){const sm=sceneMetaForStep(c,chapterSeqIndex);missionStep.textContent=`BÖLÜM ${c.n} · SAHNE ${sm.index+1}/${sm.total} · ${phase}`;missionTitle.textContent=sceneTitle(c,st);const why=sceneReason(c,st);const action=st.kind==='talk'?`${(st.label||'Kişi')}’ye yaklaş ve ETKİLEŞ’e dokun.`:stepHint(st);missionHint.textContent=`${why}${beaconUnlocked?'':' · İşaret kapalı; metreyle de bulabilirsin.'}`;hideMissionPeek();updateArcadeButton();}
 updateChapterObjective();
}
function updateChapterObjective(){
 if(!activeAtlas||atlasBrowseMode)return;
 const c=chapterByNo(activeChapter),seq=chapterSequence(c),st=seq[chapterSeqIndex];
 if(!st){objectiveEl.textContent=`BÖLÜM ${c.n} · ${c.title} · BÖLÜM İÇİ EYLEM`;return;}
 const ap=actionProfile(st),phase=chapterPhase(c,chapterSeqIndex,seq.length),sm=sceneMetaForStep(c,chapterSeqIndex);objectiveEl.textContent=`BÖLÜM ${c.n} · SAHNE ${sm.index+1}/${sm.total} · ${phase} · ${ap.label}`;
}
function enterChapterStepLocation(st){
 if(!st||!LOC_INFO[st.loc])return;
 atlasBrowseMode=false;activeAtlas=st.loc;buildAtlasScene(st.loc);atlasBadge.textContent=`${LOC_INFO[st.loc].label} · BÖLÜM ${activeChapter}`;atlasBadge.classList.add('show');const sp=chapterSpawnPoint(st.loc);hubTeleport(sp[0],sp[1],(activeChapter===2&&st.loc==='management')?-2.12:Math.PI,LOC_INFO[st.loc].label);setTimeout(syncChapterTargetVisual,260);
}

// ---------- v3.0.0: YAŞANMIŞLIK KATMANI ----------
// Her mekâna koordinatı hash ile belirlenen, çarpışması olmayan gerçek-dünya ayrıntıları ekler.
function addLivedInDetails(loc,type){
  const sig=(LOCATION_DESIGN[loc]||{}).signature||'';
  if(['altHome','burningHome','abstractThreshold','dream','doku','worldmap'].includes(sig))return;
  const h=h32(loc+'#live'),r=i=>((h>>>((i*5)%27))&31)/31,L=loc.toLowerCase();
  if(type==='home'||type==='work'){
    if(activeChapter===2&&loc==='management')return;
    const dark=/night|archive|black|hidden/.test(L);
    for(let z=-6.3;z<=6.3;z+=2.1){abox('baseboardW',AX-6.88,.09,AZ+z,.05,.18,2.0,'wood',[.26,.24,.22,1]);abox('baseboardE',AX+6.88,.09,AZ+z,.05,.18,2.0,'wood',[.26,.24,.22,1]);}
    const cx=AX+(r(1)>.5?1:-1)*(2.4+r(2)*2.2),side=r(3)>.5?1:-1;
    abox('wallClock',cx,2.38,AZ-6.87,.34,.34,.04,'white',[.92,.91,.88,1]);
    abox('clockMin',cx,2.445,AZ-6.84,.018,.13,.012,'white',[.08,.08,.08,1]);
    abox('clockHour',cx+side*.045,2.38,AZ-6.84,.09,.018,.012,'white',[.08,.08,.08,1]);
    abox('lightSwitch',AX+1.3,1.2,AZ+6.88,.09,.14,.03,'white',[.90,.90,.86,1]);
    abox('outletS',AX-3.1,.32,AZ+6.88,.08,.12,.03,'white',[.90,.90,.86,1]);
    abox('outletN',AX+3.4,.32,AZ-6.88,.08,.12,.03,'white',[.90,.90,.86,1]);
    abox('doorMat',AX,.014,AZ+6.25,1.3,.02,.75,'rug',[.20,.18,.16,1]);
    abox('ceilLight',AX+(r(4)-.5)*3,3.0,AZ+(r(5)-.5)*3,1.2,.04,.45,'white',[.96,.95,.90,1],[1,1],0,dark?.18:.42);
    abox('cornerBin',AX+6.35,.20,AZ+6.30,.28,.40,.28,'white',[.18,.18,.20,1]);
  }else if(type==='urban'){
    if(/cemetery|funeral|park/.test(L))return;
    for(let z=-9;z<=9;z+=2.4)abox('laneDash',AX,.004,AZ+z,.12,.008,1.1,'white',[.82,.80,.62,.85]);
    for(const sd of[-1,1])abox('edgeLine',AX+sd*4.15,.004,AZ,.08,.008,20,'white',[.80,.78,.70,.55]);
    abox('manhole',AX+(r(6)-.5)*5,.004,AZ+(r(7)-.5)*14,.8,.008,.8,'floor',[.10,.10,.11,1]);
    if(/bakery|school|city|street/.test(L)){const zc=AZ+(r(8)>.5?3.6:-3.6);for(let i=-6;i<=6;i++)abox('zebra'+i,AX+i*.62,.004,zc,.30,.008,1.7,'white',[.86,.86,.84,.80]);}
    abox('streetBin',AX-5.6,.35,AZ+2.6,.5,.7,.5,'white',[.16,.20,.18,1]);acoll(AX-5.9,AZ+2.3,AX-5.3,AZ+2.9);
  }
}
// ---------- v3.0.0: MASA ÜSTÜ, PERDE, İZ KATMANI ----------
// Hikâyeyi değiştirmez; yalnız çarpışmasız, mekâna deterministik yerleşen günlük yaşam izleri ekler.
function addTabletopAndCurtains(loc,type){
  const sig=(LOCATION_DESIGN[loc]||{}).signature||'';
  if(['altHome','burningHome','abstractThreshold','dream','doku','worldmap'].includes(sig))return;
  if(activeChapter===2&&loc==='management')return;
  const h=h32(loc+'#tab'),r=(i)=>((h>>>((i*5)%27))&31)/31;
  const cups=[[.86,.84,.80,1],[.62,.30,.24,1],[.24,.40,.50,1]],papers=[[.80,.79,.74,1],[.70,.74,.78,1]];
  let n=0;
  for(const o of atlasObjs.slice()){
    if(o.name!=='tableTop'||o.sx<.9||o.sz<.7)continue;
    const top=o.y+o.sy/2,k=n++,u=(i)=>((h32(loc+'#t'+k+'_'+i))%1000)/1000;
    const mx=o.x+(u(1)>.5?1:-1)*(o.sx/2-.22-u(2)*.2),mz=o.z+(u(3)-.5)*(o.sz-.5);
    abox('tabMug',mx,top+.055,mz,.085,.11,.085,'white',cups[k%3]);
    if(u(4)>.35){const px2=o.x-(mx>o.x?1:-1)*(.2+u(5)*.2);abox('tabNotebook',px2,top+.012,o.z+(u(6)-.5)*.3,.30,.024,.22,'white',papers[k%2],[1,1],(u(7)-.5)*.6);}
  }
  if(type==='home'){
    const fab=[[.62,.55,.48,1],[.48,.52,.58,1],[.58,.46,.44,1]][Math.floor(r(9)*3)%3];
    for(const o of atlasObjs.slice()){
      if(o.name!=='winFrame'||o.sx>.2||o.sz<.5)continue;
      const inw=o.x<AX?1:-1,cx=o.x+inw*.13,half=o.sz/2;
      abox('curtainRod',cx,2.47,o.z,.05,.04,o.sz+.9,'wood',[.20,.18,.16,1]);
      for(const sd of[-1,1])abox('curtain',cx,1.47,o.z+sd*(half+.14),.07,1.95,.30,'rug',fab);
    }
  }
  if(type==='home'||type==='work'){
    abox('wornPath',AX,.001,AZ+4.6,1.5,.004,4.4,'floor',[.10,.08,.06,.20]);
    for(let i=0;i<3;i++)abox('floorStain'+i,AX+(r(10+i)-.5)*9,.001,AZ+(r(13+i)-.5)*8,.7+r(16+i)*.6,.004,.5+r(19+i)*.5,'floor',[.08,.07,.06,.16]);
  }
}
// ---------- v3.0.0: EVREN DERİNLİĞİ / UZAK PLAN / HAREKETLİ ÇEVRE ----------
function addUniverseDepth(loc,type){
 const h=h32(loc+'#depth'),r=i=>((h>>>((i*4)%28))&15)/15,L=loc.toLowerCase();
 if(type==='urban'){
   // Yolun iki yanında ikinci ve üçüncü şehir halkası: sınır kutusu bitince dünya bitmiş görünmez.
   for(const side of[-1,1])for(let i=-3;i<=3;i++){
     const z=AZ+i*6.1+(r(i+7)-.5)*1.8,hh=5.5+r(i+11)*7.5,x=AX+side*(13.0+r(i+15)*4.5);
     abox('distantBlock',x,hh*.5-.12,z,2.0+r(i+18)*2.6,hh,4.4+r(i+21)*2.2,'wall',[.10+.05*r(i+1),.12+.05*r(i+2),.15+.06*r(i+3),1],[1,4]);
     for(let yy=1.4;yy<hh-1;yy+=1.55)abox('distantWin',x-side*1.05,yy,z,.03,.12,2.6,'white',[.42+r(i+4)*.28,.44+r(i+5)*.18,.38+r(i+6)*.12,1],[1,1],0,.22+r(i+8)*.22);
   }
   // Trafik yalnız görsel katmandır; çarpışma üretmez.
   if(!/cemetery|funeral|park|courtyard/.test(L))for(let i=0;i<3;i++){
     const lane=(i%2?1:-1)*1.75,car=abox('ambientCar',AX+lane,.28,AZ-12+i*8,1.55,.48,3.0,'white',[.10+.12*r(i+2),.12+.10*r(i+4),.16+.16*r(i+6),1]);
     car.ambientMove={axis:'z',speed:(i%2?1:-1)*(.95+.35*r(i+9)),min:AZ-14,max:AZ+14};
     const tail=abox('carLight',AX+lane+(i%2?.42:-.42),.34,car.z+(i%2?-1.53:1.53),.18,.09,.035,'white',i%2?[1,.16,.08,1]:[.72,.88,1,1],[1,1],0,.78);tail.followObject=car;tail.followOffset=[(i%2?.42:-.42),.06,(i%2?-1.53:1.53)];
   }
   // Üstten geçen kablolar / kent dokusu.
   for(const z of[-6,2,10])abox('overheadWire',AX,3.7,AZ+z,18,.025,.025,'white',[.08,.09,.10,1]);
 }else if(type==='nature'){
   for(let i=-4;i<=4;i++){const x=AX+i*5.0,hh=2.4+1.9*r(i+10);abox('horizonRidge',x,hh*.45,AZ-17.5,6.0,hh,5.0,'wall',[.12+.08*r(i+12),.15+.08*r(i+13),.13+.06*r(i+14),1],[1,1],0,.03);}
   for(let i=0;i<18;i++){const x=AX-17+r(i+2)*34,z=AZ-15+r(i+5)*30;abox('farRock',x,.25+r(i+7)*.45,z,.45+r(i+9)*.8,.5+r(i+11)*.9,.45+r(i+13)*.8,'wall',[.18,.19,.18,1],[1,1],r(i+15)*3.1);}
 }else if(type==='ancient'){
   for(let i=-3;i<=3;i++){const x=AX+i*4.4,hh=3.8+r(i+9)*3.2;abox('farMudCity',x,hh*.5,AZ-16.5,3.6,hh,3.8,'wall',[.34,.25,.16,1],[2,2]);if(i%2===0)abox('farTower',x,hh+.9,AZ-16.5,1.0,1.8,1.0,'wall',[.40,.29,.18,1]);}
 }else if(type==='cave'){
   // Tünelin ucunu tek duvar yerine katmanlı karanlıkta kaybettir.
   for(let i=0;i<5;i++)abox('caveDepthRib',AX,2.2,AZ-13-i*2.4,11-i*.7,4.4,1.1,'wall',[.075+i*.008,.078+i*.008,.082+i*.008,1],[3,1],(i%2?-.06:.06));
 }
}
function addMainWorldDepth(){
 // Görünen Dünya'nın ana omurgasına uzakta yaşayan bir şehir ekle.
 for(const side of[-1,1])for(let i=0;i<6;i++){const z=27+i*6.8,hh=5.0+(i%3)*2.7;box('worldSkyline',side*(12.5+(i%2)*3.2),hh*.5-1.0,z,3.6,hh,4.6,'wall',[.09+.02*i,.11+.015*i,.14+.015*i,1],[2,3]);for(let y=1.3;y<hh-1;y+=1.6)box('worldSkyWin',side*(10.68+(i%2)*3.2),y,z,.025,.12,2.7,'white',[.52,.48,.34,1],[1,1],0,.18+(i%3)*.06);}
 const c1=box('worldCarA',-12,-.70,30.6,1.7,.48,3.1,'white',[.10,.16,.21,1]);c1.ambientMove={axis:'x',speed:1.65,min:-13,max:13};
 const c2=box('worldCarB',11,-.70,33.2,1.7,.48,3.1,'white',[.22,.11,.10,1]);c2.ambientMove={axis:'x',speed:-1.25,min:-13,max:13};
}
function updateAmbientWorld(dt){
 const arrays=activeAtlas?[atlasObjs]:[objs];
 for(const arr of arrays)for(const o of arr){
   if(o.followObject&&o.followOffset){o.x=o.followObject.x+o.followOffset[0];o.y=o.followObject.y+o.followOffset[1];o.z=o.followObject.z+o.followOffset[2];continue;}
   const m=o.ambientMove;if(!m)continue;
   if(m.mode==='bob'){m.t=(m.t||0)+dt;o.y=(m.baseY??o.y)+Math.sin(m.t*(m.speed||.4)+(m.phase||0))*(m.amp||.05);continue;}
   if(m.axis==='z'){o.z+=m.speed*dt;if(o.z>m.max)o.z=m.min;else if(o.z<m.min)o.z=m.max;}
   else if(m.axis==='y'){o.y+=m.speed*dt;if(o.y>m.max)o.y=m.min;else if(o.y<m.min)o.y=m.max;}
   else{o.x+=m.speed*dt;if(o.x>m.max)o.x=m.min;else if(o.x<m.min)o.x=m.max;}
 }
}
function buildAtlasScene(loc){clearAmbientContextInteractions();atlasObjs.length=0;atlasCollisions.length=0;atlasDynamicCollisions.length=0;atlasGroundZones.length=0;atlasChairSeq=0;try{window.TELKIN_LOCATION_LOADER?.preload(loc)}catch(e){}const info=LOC_INFO[loc]||{type:'urban'};if(activeChapter===2&&loc==='management')buildChapter2ManagementRoom();else if(info.type==='home')buildRoom(loc,'home');else if(info.type==='work')buildRoom(loc,'work');else if(info.type==='urban')buildStreet(loc);else if(info.type==='nature')buildNature(loc);else if(info.type==='ancient')buildAncient(loc);else if(info.type==='cave')buildCaveAtlas(loc);else if(info.type==='transport')buildTransport(loc);else buildAbstract(loc);if(!(activeChapter===2&&loc==='management'))decorateLocation(loc);try{locationPackSetDetails(loc,info.type);addLivedInDetails(loc,info.type);addTabletopAndCurtains(loc,info.type);addUniverseDepth(loc,info.type);heroSetDetails(loc,info.type);exteriorFilmSetDetails(loc,info.type);historyNatureLayerDetails(loc,info.type)}catch(e){console.warn('[TELKİN] yaşanmışlık/derinlik/set katmanı',e)}decorateActiveChapterScene(loc);finalizeAtlasPhysics(loc);setAtlasLights(loc,info.type);applyHeroSetLighting(loc);applyExteriorSetLighting(loc);applyDeepWorldLighting(loc,info.type);applyFilmLook(loc);applyMetaphysicalFilmSignature(loc);buildAmbientContextInteractions(loc,info.type);}


function chair(x,z,ry=0){
 box('chairSeat',x,.48,z,.62,.10,.62,'wood',[.62,.54,.48,1],[1,1],ry);
 box('chairBack',x,.82,z+.26,.62,.72,.08,'wood',[.55,.48,.44,1],[1,1],ry);
 for(const dx of [-.25,.25])for(const dz of [-.25,.25])box('chairLeg',x+dx,.23,z+dz,.055,.46,.055,'wood',[.38,.34,.32,1],[1,1],ry);
}
function book(x,y,z,w=.22,h=.30,d=.08,c=[.38,.22,.18,1],ry=0){box('book',x,y,z,w,h,d,'white',c,[1,1],ry)}
function pictureFrame(x,y,z,w,h,ry=0){
 box('frameOuter',x,y,z,w+.08,h+.08,.045,'wood',[.25,.22,.20,1],[1,1],ry);
 box('frameArt',x,y,z-.027,w,h,.025,'white',[.40,.43,.44,1],[1,1],ry);
}
function officeDoor(x,z,ry=0){
 const pt=(lx,lz)=>[x+Math.cos(ry)*lx+Math.sin(ry)*lz,z-Math.sin(ry)*lx+Math.cos(ry)*lz];
 box('doorSlab',x,1.05,z,.92,2.10,.075,'wood',[.52,.42,.34,1],[1,2],ry);
 box('doorTrimTop',x,2.16,z,1.08,.07,.10,'wood',[.27,.25,.23,1],[1,1],ry);
 let p=pt(-.52,0);box('doorTrimL',p[0],1.05,p[1],.065,2.20,.10,'wood',[.27,.25,.23,1],[1,1],ry);
 p=pt(.52,0);box('doorTrimR',p[0],1.05,p[1],.065,2.20,.10,'wood',[.27,.25,.23,1],[1,1],ry);
 p=pt(.31,-.065);box('doorHandle',p[0],1.02,p[1],.12,.035,.05,'white',[.55,.56,.55,1],[1,1],ry);
}
function fluorescent(x,y,z,len=1.15){
 box('lightHousing',x,y,z,len,.065,.22,'white',[.36,.38,.39,1],[1,1]);
 box('lightGlow',x,y-.043,z,len*.88,.025,.14,'white',[.96,.91,.78,1],[1,1],0,.88);
}
function streetLamp(x,z,warm=false){
 box('lampPole',x,.45,z,.09,2.9,.09,'white',[.16,.18,.20,1]);
 box('lampArm',x+(x<0?.22:-.22),1.86,z,.46,.07,.07,'white',[.16,.18,.20,1]);
 box('lampHead',x+(x<0?.42:-.42),1.80,z,.34,.12,.24,'white',[.22,.23,.22,1]);
 box('lampGlow',x+(x<0?.42:-.42),1.72,z,.25,.025,.16,'white',warm?[1,.66,.32,1]:[.64,.82,1,1],[1,1],0,.92);
}
function facade(x,z,w,h,side=1){
 box('cityFacade',x,h/2-.96,z,w,h,.28,'wall',[.24,.26,.28,1],[Math.max(1,w/2),Math.max(1,h/2)]);
 for(let yy=.2;yy<h-1;yy+=1.45)for(let zz=z-w/2+.8;zz<z+w/2-.4;zz+=1.35){
   const wx=x-side*.151;
   box('cityWindow',wx,yy-.55,zz,.025,.68,.82,'white',[.24,.43,.55,1],[1,1],0,.52);
 }
}
function buildWorld(){
 // -------- OFFICE: architectural shell --------
 box('floor',0,-.055,0,10,.10,8,'floor',[.78,.79,.78,1],[5,4]);
 box('ceiling',0,3.02,0,10,.08,8,'wall',[.30,.31,.32,1],[5,4]);
 box('north',0,1.5,-4,10,3,.16,'wall',[.66,.67,.65,1],[5,2]);
 box('westA',-5,1.5,-2.25,.16,3,3.5,'wall',[.62,.63,.62,1],[2,2]);
 box('westB',-5,1.5,2.45,.16,3,3.1,'wall',[.62,.63,.62,1],[2,2]);
 box('eastA',5,1.5,-3.0,.16,3,2.0,'wall',[.63,.63,.61,1],[1,2]);
 box('eastB',5,1.5,1.7,.16,3,4.6,'wall',[.63,.63,.61,1],[3,2]);
 box('southA',-3.0,1.5,4,4.0,3,.16,'wall',[.65,.65,.63,1],[2,2]);
 box('southB',3.0,1.5,4,4.0,3,.16,'wall',[.65,.65,.63,1],[2,2]);
 // baseboards make the room read as a built space instead of floating blocks
 box('baseN',0,.09,-3.86,9.75,.18,.06,'wood',[.25,.25,.24,1],[5,1]);
 box('baseS1',-3,.09,3.86,3.85,.18,.06,'wood',[.25,.25,.24,1],[2,1]);
 box('baseS2',3,.09,3.86,3.85,.18,.06,'wood',[.25,.25,.24,1],[2,1]);

 // Window + rainy night city
 box('window',-2.3,1.65,-3.90,3.2,1.75,.03,'city',[.72,.80,.86,1],[1,1],0,.90);
 for(const x of [-3.9,-.7]) box('frame',x,1.65,-3.84,.06,1.9,.08,'wood',[.18,.20,.22,1]);
 box('frame',-2.3,.75,-3.84,3.25,.06,.08,'wood',[.18,.20,.22,1]);
 box('frame',-2.3,2.55,-3.84,3.25,.06,.08,'wood',[.18,.20,.22,1]);
 box('windowMullion',-2.3,1.65,-3.82,.045,1.78,.055,'wood',[.18,.20,.22,1]);

 // Rug, desk and desk objects
 box('rug',0,.012,.65,5.8,.025,3.8,'rug',[.77,.76,.73,1],[1,1]);
 box('deskTop',0,.78,-.65,3.55,.10,1.28,'wood',[.62,.50,.39,1],[2,1]);
 box('deskApron',0,.61,-.65,3.26,.24,.10,'wood',[.43,.34,.27,1],[2,1]);
 for(const x of [-1.55,1.55]){box('deskLeg',x,.39,-.65,.12,.78,1.02,'wood',[.39,.31,.26,1],[1,1]);box('deskFoot',x,.07,-.65,.43,.08,1.08,'wood',[.30,.29,.28,1],[1,1]);}
 // monitor, keyboard, notebook, mug
 box('monitorStand',.55,.92,-.91,.08,.25,.08,'white',[.12,.13,.14,1]);
 box('monitorFoot',.55,.81,-.91,.48,.035,.20,'white',[.12,.13,.14,1]);
 box('monitor',.55,1.18,-.95,.98,.57,.07,'white',[.07,.08,.09,1]);
 box('monitorScreen',.55,1.18,-.992,.88,.47,.012,'white',[.08,.14,.17,1],[1,1],0,.28);
 box('keyboard',.45,.865,-.40,.76,.035,.25,'white',[.15,.16,.16,1],[1,1],0.03);
 book(-.65,.855,-.38,.58,.045,.38,[.23,.18,.13,1],-.08);
 box('mug',1.23,.91,-.35,.18,.20,.18,'white',[.56,.58,.57,1]);
 // desk lamp: warm pool of light has a visible source
 box('lampBase',-1.15,.84,-.88,.36,.045,.28,'white',[.12,.12,.11,1]);
 box('lampStem',-1.15,1.12,-.88,.055,.58,.055,'white',[.15,.14,.12,1],[1,1],-.16);
 box('lampShade',-1.04,1.40,-.83,.40,.20,.34,'white',[.36,.29,.20,1],[1,1],-.10);
 box('lampGlow',-1.02,1.32,-.79,.28,.035,.22,'white',[1.0,.61,.27,1],[1,1],-.10,.95);

 // shelves with readable contents
 for(let yy=.30;yy<2.25;yy+=.42) box('shelf',3.95,yy,-2.35,1.75,.055,.48,'wood',[.47,.38,.31,1],[1,1]);
 box('shelfSide',3.12,1.15,-2.35,.07,2.3,.48,'wood',[.34,.29,.25,1]);
 box('shelfSide',4.78,1.15,-2.35,.07,2.3,.48,'wood',[.34,.29,.25,1]);
 for(let row=0;row<4;row++)for(let i=0;i<5;i++) book(3.35+i*.29,.39+row*.42,-2.45,.20,.28,.13,[(.22+i*.05),(.18+row*.035),(.16+i*.018),1],(i%2?-.04:.03));
 pictureFrame(4.25,2.56,-3.82,.75,.52);
 pictureFrame(3.18,2.46,-3.82,.48,.68);
 chair(-2.7,.5,.20); chair(2.6,.75,-.25); chair(0,-2.0,Math.PI);

 // Rear room east of office
 box('rearFloor',7,-.055,-1,4,.10,5.6,'floor',[.65,.66,.65,1],[2,3]);
 box('rearCeil',7,3.02,-1,4,.08,5.6,'wall',[.27,.28,.29,1],[2,3]);
 box('rearNorth',7,1.5,-3.8,4,3,.16,'wall',[.56,.56,.54,1],[2,2]);
 box('rearEast',9,1.5,-1,.16,3,5.6,'wall',[.56,.56,.54,1],[3,2]);
 box('rearSouth',7,1.5,1.8,4,3,.16,'wall',[.56,.56,.54,1],[2,2]);
 box('rearTable',7.0,.76,-1.3,2.0,.11,.9,'wood',[.46,.38,.32,1],[1,1]);
 box('archiveCab',8.2,.87,.95,1.05,1.72,.45,'white',[.28,.30,.31,1]);
 for(let yy=.30;yy<1.55;yy+=.42) box('drawerLine',8.2,yy,.71,.85,.018,.012,'white',[.10,.11,.12,1]);

 // Corridor shell + detail doors + practical ceiling lights
 box('corrFloor',0,-.055,9,3,.10,10,'floor',[.52,.53,.53,1],[2,6]);
 box('corrCeil',0,3.02,9,3,.08,10,'wall',[.24,.25,.26,1],[2,5]);
 box('corrL',-1.5,1.5,9,.15,3,10,'wall',[.54,.55,.55,1],[2,6]);
 box('corrR',1.5,1.5,9,.15,3,10,'wall',[.54,.55,.55,1],[2,6]);
 box('corrBaseL',-1.41,.09,9,.08,.18,9.7,'wood',[.22,.22,.21,1],[1,5]);
 box('corrBaseR',1.41,.09,9,.08,.18,9.7,'wood',[.22,.22,.21,1],[1,5]);
 for(const z of [5.5,8.2,10.9]){officeDoor(-1.40,z,Math.PI/2);officeDoor(1.40,z,-Math.PI/2);}
 fluorescent(0,2.93,5.25); fluorescent(0,2.93,8.35); fluorescent(0,2.93,11.45);
 box('exitSign',0,2.54,12.88,.72,.28,.06,'white',[.10,.44,.28,1],[1,1],0,.70);

 // Stairwell: actual descending run and railing
 box('stairWallL',-1.5,.75,16.2,.15,4.5,5.0,'wall',[.47,.48,.49,1],[2,3]);
 box('stairWallR',1.5,.75,16.2,.15,4.5,5.0,'wall',[.47,.48,.49,1],[2,3]);
 for(let i=0;i<8;i++){
   const zz=14.1+i*.45, yy=-.05-i*.12;
   box('step',0,yy,zz,2.8,.20,.48,'wall',[.43,.44,.45,1],[1,1]);
   box('railPostL',-1.20,.82-i*.12,zz,.055,1.52,.055,'white',[.18,.20,.21,1]);
   box('railPostR',1.20,.82-i*.12,zz,.055,1.52,.055,'white',[.18,.20,.21,1]);
 }
 for(let i=0;i<8;i++){const zz=14.1+i*.45, yy=1.54-i*.12;box('railTopL',-1.20,yy,zz,.07,.07,.50,'white',[.22,.24,.25,1]);box('railTopR',1.20,yy,zz,.07,.07,.50,'white',[.22,.24,.25,1]);}
 fluorescent(0,2.55,14.45,.92); fluorescent(0,1.65,17.2,.92);

 // Ground-floor lobby / building entrance
 box('lobbyFloor',0,-1.015,19.6,5.8,.10,5.8,'floor',[.49,.50,.50,1],[3,3]);
 box('lobbyCeil',0,2.10,19.6,5.8,.08,5.8,'wall',[.24,.25,.26,1],[3,3]);
 box('lobbyLeft',-2.9,.55,19.6,.15,3.1,5.8,'wall',[.49,.50,.50,1],[2,3]);
 box('lobbyRight',2.9,.55,19.6,.15,3.1,5.8,'wall',[.49,.50,.50,1],[2,3]);
 box('lobbyBackL',-2.15,.55,22.5,1.45,3.1,.15,'wall',[.49,.50,.50,1],[1,2]);
 box('lobbyBackR',2.15,.55,22.5,1.45,3.1,.15,'wall',[.49,.50,.50,1],[1,2]);
 // glass entrance and rainy city beyond
 box('entranceGlassL',-.93,.55,22.46,.88,2.72,.035,'city',[.52,.64,.70,.56],[1,1],0,.56);
 box('entranceGlassR',.93,.55,22.46,.88,2.72,.035,'city',[.52,.64,.70,.56],[1,1],0,.56);
 box('entryFrameL',-1.42,.55,22.38,.07,2.8,.10,'white',[.18,.20,.21,1]);
 box('entryFrameR',1.42,.55,22.38,.07,2.8,.10,'white',[.18,.20,.21,1]);
 box('entryFrameT',0,1.93,22.38,2.9,.07,.10,'white',[.18,.20,.21,1]);
 box('entryMullion',0,.55,22.37,.055,2.72,.10,'white',[.18,.20,.21,1]);
 box('reception',-1.65,-.58,19.85,1.50,.78,.55,'wood',[.38,.31,.26,1]);
 fluorescent(0,2.00,19.2,1.25); fluorescent(0,2.00,21.15,1.25);


 // -------- VISIBLE WORLD: NIGHT CITY SPINE --------
 // Building forecourt
 box('forecourt',0,-1.015,25.4,12,.10,5.8,'floor',[.38,.40,.41,1],[6,3]);
 box('awning',0,1.45,23.8,5.4,.12,1.5,'white',[.19,.21,.23,1]);
 box('buildingSign',0,.55,23.38,3.2,.46,.08,'white',[.11,.13,.15,1],[1,1],0,.18);
 // Road crossing and curbs
 box('road',0,-1.055,32.0,18,.08,8.2,'white',[.12,.14,.16,1],[1,1]);
 box('curbNear',0,-.96,27.95,18,.18,.22,'white',[.42,.43,.43,1]);
 box('curbFar',0,-.96,36.05,18,.18,.22,'white',[.42,.43,.43,1]);
 for(const x of [-6,-3,0,3,6]) box('crosswalk',x,-1.005,32.0,1.4,.025,5.4,'white',[.74,.73,.68,1]);
 // Opposite sidewalk and square
 box('farSidewalk',0,-1.015,38.2,18,.10,4.0,'floor',[.36,.38,.39,1],[9,2]);
 box('square',0,-1.015,48.0,18,.10,15.5,'floor',[.31,.33,.34,1],[9,8]);
 box('squareCenter',0,-.96,48.0,4.2,.04,4.2,'rug',[.34,.35,.34,1],[1,1]);
 // city façades enclosing the square
 facade(-8.65,46.0,18,8.2,1); facade(8.65,46.0,18,8.2,-1);
 box('shopGlassL',-8.48,.15,42.0,.035,1.75,3.8,'white',[.52,.30,.18,1],[1,1],0,.58);
 box('shopGlassR',8.48,.15,49.5,.035,1.75,4.2,'white',[.16,.34,.48,1],[1,1],0,.60);
 // benches / street furniture
 for(const z of [43.5,51.5]){box('benchSeat',-3.9,-.52,z,1.5,.10,.42,'wood',[.35,.28,.22,1]);box('benchBack',-4.08,-.17,z,1.5,.62,.08,'wood',[.31,.25,.21,1]);}
 streetLamp(-5.2,25.7,false);streetLamp(5.2,38.5,true);streetLamp(-5.2,48.0,false);streetLamp(5.2,54.0,true);
 // Doku alley: visible-world geometry begins to lose certainty
 box('alleyFloor',0,-1.015,59.3,5.3,.10,8.0,'floor',[.24,.27,.29,1],[3,4]);
 box('alleyL',-2.65,.50,59.3,.18,3.0,8.0,'wall',[.20,.22,.25,1],[2,4]);
 box('alleyR',2.65,.50,59.3,.18,3.0,8.0,'wall',[.20,.22,.25,1],[2,4]);
 for(const y of [-.55,.05,.65,1.25,1.85]){
   box('dokuLineL',-.95,y,62.25,.035,.035,1.35,'white',[.18,.78,1,1],[1,1],0,.94);
   box('dokuLineR',.95,y,62.25,.035,.035,1.35,'white',[.18,.78,1,1],[1,1],0,.94);
 }
 box('dokuCore',0,.45,62.25,.055,2.45,1.95,'white',[.09,.45,.72,.42],[1,1],0,.88);
 box('alleyEnd',0,.5,63.4,5.3,3,.16,'wall',[.16,.18,.21,1],[3,2]);


 // -------- MAHİR'İN EVİ: OYNANABİLİR HUB --------
 // Ev ayrı koordinat kümesinde tutulur; meydandaki apartman kapısı kısa bir hub geçişi yapar.
 const HX=50,HZ=0;
 box('homeFloor',HX,-.055,HZ,10,.10,8,'floor',[.55,.50,.44,1],[5,4]);
 box('homeCeil',HX,3.02,HZ,10,.08,8,'wall',[.30,.29,.28,1],[5,4]);
 box('homeNorth',HX,1.5,HZ-4,10,3,.16,'wall',[.58,.55,.51,1],[5,2]);
 box('homeWest',HX-5,1.5,HZ,.16,3,8,'wall',[.55,.52,.49,1],[4,2]);
 box('homeEast',HX+5,1.5,HZ,.16,3,8,'wall',[.55,.52,.49,1],[4,2]);
 box('homeSouthL',HX-3.1,1.5,HZ+4,3.8,3,.16,'wall',[.58,.55,.51,1],[2,2]);
 box('homeSouthR',HX+3.1,1.5,HZ+4,3.8,3,.16,'wall',[.58,.55,.51,1],[2,2]);
 // entrance door visible from inside
 box('homeDoor',HX,1.05,HZ+3.92,1.12,2.10,.08,'wood',[.42,.33,.27,1],[1,2]);
 box('homeDoorFrameT',HX,2.16,HZ+3.86,1.28,.08,.12,'wood',[.25,.22,.20,1]);
 box('homeDoorFrameL',HX-.62,1.05,HZ+3.86,.08,2.22,.12,'wood',[.25,.22,.20,1]);
 box('homeDoorFrameR',HX+.62,1.05,HZ+3.86,.08,2.22,.12,'wood',[.25,.22,.20,1]);
 box('homeHandle',HX+.36,1.02,HZ+3.80,.12,.035,.055,'white',[.62,.62,.60,1]);
 // north window / night city glow
 box('homeWindow',HX-1.8,1.65,HZ-3.90,2.8,1.65,.03,'city',[.66,.76,.82,1],[1,1],0,.75);
 box('homeWinFrame',HX-1.8,1.65,HZ-3.84,.06,1.76,.08,'wood',[.18,.19,.20,1]);
 box('homeWinBottom',HX-1.8,.84,HZ-3.84,2.9,.06,.08,'wood',[.18,.19,.20,1]);
 box('homeWinTop',HX-1.8,2.46,HZ-3.84,2.9,.06,.08,'wood',[.18,.19,.20,1]);
 // living room rug + sofa + coffee table
 box('homeRug',HX-1.1,.012,HZ+.10,4.6,.025,3.0,'rug',[.60,.53,.47,1],[1,1]);
 box('sofaSeat',HX-2.9,.43,HZ+.15,1.85,.34,.82,'white',[.20,.22,.22,1]);
 box('sofaBack',HX-3.15,.88,HZ+.15,1.85,.80,.22,'white',[.18,.20,.20,1]);
 box('sofaArm1',HX-2.9,.66,HZ-.33,.32,.62,.18,'white',[.17,.19,.19,1]);
 box('sofaArm2',HX-2.9,.66,HZ+.63,.32,.62,.18,'white',[.17,.19,.19,1]);
 box('coffeeTop',HX-.75,.48,HZ+.10,1.55,.09,.82,'wood',[.38,.29,.23,1]);
 for(const dx of [-.62,.62])for(const dz of [-.30,.30])box('coffeeLeg',HX-.75+dx,.24,HZ+.10+dz,.07,.46,.07,'wood',[.28,.23,.20,1]);
 // kitchen line
 box('kitchenBase',HX+3.65,.45,HZ-1.05,1.85,.90,3.6,'wood',[.30,.28,.25,1]);
 box('kitchenTop',HX+3.55,.93,HZ-1.05,2.05,.08,3.75,'white',[.44,.45,.43,1]);
 box('sink',HX+3.50,.985,HZ-.25,.74,.035,.55,'white',[.18,.21,.22,1],[1,1],0,.1);
 box('fridge',HX+3.72,1.02,HZ-3.00,1.25,2.02,.72,'white',[.29,.31,.32,1]);
 // bed / personal corner
 box('bedBase',HX+1.45,.28,HZ+2.15,2.45,.42,1.62,'wood',[.30,.25,.22,1]);
 box('mattress',HX+1.45,.55,HZ+2.15,2.32,.28,1.52,'white',[.63,.62,.58,1]);
 box('pillow',HX+.72,.76,HZ+2.15,.56,.18,.92,'white',[.72,.70,.66,1]);
 box('nightStand',HX+3.05,.40,HZ+2.85,.72,.78,.72,'wood',[.35,.28,.23,1]);
 box('homeLampBase',HX+3.05,.82,HZ+2.85,.30,.04,.26,'white',[.15,.14,.12,1]);
 box('homeLampStem',HX+3.05,1.08,HZ+2.85,.045,.48,.045,'white',[.18,.16,.13,1]);
 box('homeLampGlow',HX+3.05,1.36,HZ+2.85,.32,.18,.28,'white',[1.0,.67,.35,1],[1,1],0,.92);
 // small traces of daily life
 book(HX-.25,.56,HZ+.08,.42,.045,.28,[.22,.18,.14,1],.05);
 box('homeMug',HX-.05,.60,HZ-.05,.16,.18,.16,'white',[.48,.48,.45,1]);
 pictureFrame(HX+1.25,2.10,HZ-3.82,.72,.52);
 fluorescent(HX,2.93,HZ-.40,1.05);
 // apartment entrance in the square: physical door, portal interaction in front of it
 box('aptDoor',8.12,.05,45.0,.08,2.18,1.12,'wood',[.30,.24,.21,1],[1,2],Math.PI/2);
 box('aptDoorGlow',8.03,.08,45.0,.025,1.82,.82,'white',[.54,.35,.20,1],[1,1],Math.PI/2,.35);
 box('aptCanopy',7.95,1.45,45.0,.72,.10,1.65,'white',[.17,.18,.19,1]);


 // -------- MİNA HATTI: OYNANABİLİR YAŞAM HUB'I --------
 // Mina'nın kendisini düşük kaliteli bir kuklayla temsil etmiyoruz. Önce onun yaşadığı fiziksel alan kurulur;
 // gerçek karakter modeli/animasyonu ayrı bir varlık olarak daha sonra bağlanabilir.
 const MX=-50,MZ=0;
 box('minaFloor',MX,-.055,MZ,10,.10,8,'floor',[.60,.56,.51,1],[5,4]);
 box('minaCeil',MX,3.02,MZ,10,.08,8,'wall',[.34,.32,.31,1],[5,4]);
 box('minaNorth',MX,1.5,MZ-4,10,3,.16,'wall',[.69,.64,.59,1],[5,2]);
 box('minaWest',MX-5,1.5,MZ,.16,3,8,'wall',[.62,.58,.55,1],[4,2]);
 box('minaEast',MX+5,1.5,MZ,.16,3,8,'wall',[.62,.58,.55,1],[4,2]);
 box('minaSouthL',MX-3.1,1.5,MZ+4,3.8,3,.16,'wall',[.68,.63,.59,1],[2,2]);
 box('minaSouthR',MX+3.1,1.5,MZ+4,3.8,3,.16,'wall',[.68,.63,.59,1],[2,2]);
 // giriş
 box('minaDoor',MX,1.05,MZ+3.92,1.12,2.10,.08,'wood',[.48,.37,.29,1],[1,2]);
 box('minaDoorFrameT',MX,2.16,MZ+3.86,1.28,.08,.12,'wood',[.27,.23,.21,1]);
 box('minaDoorFrameL',MX-.62,1.05,MZ+3.86,.08,2.22,.12,'wood',[.27,.23,.21,1]);
 box('minaDoorFrameR',MX+.62,1.05,MZ+3.86,.08,2.22,.12,'wood',[.27,.23,.21,1]);
 box('minaHandle',MX+.36,1.02,MZ+3.80,.12,.035,.055,'white',[.72,.67,.58,1]);
 // pencere: şehir gecesi dışarıda kalmaya devam eder
 box('minaWindow',MX+1.55,1.64,MZ-3.90,3.15,1.62,.03,'city',[.72,.80,.86,1],[1,1],0,.77);
 box('minaWinV',MX+1.55,1.64,MZ-3.84,.055,1.72,.08,'wood',[.20,.19,.18,1]);
 box('minaWinBottom',MX+1.55,.85,MZ-3.84,3.25,.06,.08,'wood',[.20,.19,.18,1]);
 box('minaWinTop',MX+1.55,2.43,MZ-3.84,3.25,.06,.08,'wood',[.20,.19,.18,1]);
 // daha sıcak, daha küçük ölçekli bir çocuk yaşam alanı
 box('minaRug',MX-.45,.012,MZ+.55,4.8,.025,3.5,'rug',[.73,.61,.58,1],[1,1]);
 // yatak
 box('minaBedBase',MX-2.45,.27,MZ+1.35,2.25,.40,1.45,'wood',[.38,.29,.24,1]);
 box('minaMattress',MX-2.45,.52,MZ+1.35,2.12,.27,1.34,'white',[.75,.71,.67,1]);
 box('minaBlanket',MX-2.65,.69,MZ+1.35,1.65,.10,1.22,'white',[.48,.56,.64,1]);
 box('minaPillow',MX-1.72,.72,MZ+1.35,.48,.17,.78,'white',[.82,.79,.74,1]);
 // çalışma masası + renkli küçük objeler
 box('minaDeskTop',MX+1.75,.72,MZ-2.25,1.85,.10,.72,'wood',[.49,.37,.28,1]);
 for(const dx of [-.75,.75]) box('minaDeskLeg',MX+1.75+dx,.35,MZ-2.25,.08,.70,.52,'wood',[.35,.28,.23,1]);
 box('minaPaper',MX+1.55,.795,MZ-2.18,.58,.018,.40,'white',[.90,.87,.79,1]);
 for(let i=0;i<5;i++) box('minaPencil',MX+1.32+i*.12,.825,MZ-2.42,.025,.025,.34,'white',[.85-.08*i,.25+.08*i,.24+.10*i,1],[1,1],-.08+i*.04,.28);
 // kitaplık
 for(let yy=.32;yy<2.15;yy+=.42) box('minaShelf',MX+3.72,yy,MZ-.25,1.45,.055,.48,'wood',[.45,.34,.27,1]);
 box('minaShelfL',MX+3.05,1.12,MZ-.25,.07,2.25,.48,'wood',[.34,.27,.23,1]);
 box('minaShelfR',MX+4.39,1.12,MZ-.25,.07,2.25,.48,'wood',[.34,.27,.23,1]);
 for(let row=0;row<4;row++)for(let i=0;i<4;i++) book(MX+3.22+i*.31,.41+row*.42,MZ-.34,.21,.27,.14,[.32+.08*i,.22+.06*row,.20+.05*((i+row)%3),1],i%2?.03:-.025);
 // oyuncak sandığı / gündelik izler
 box('minaToyChest',MX+1.60,.34,MZ+2.45,1.18,.62,.70,'wood',[.47,.31,.25,1]);
 box('minaToyLid',MX+1.60,.67,MZ+2.45,1.22,.08,.74,'wood',[.56,.38,.29,1],[1,1],-.06);
 box('minaBall',MX+.65,.22,MZ+1.70,.34,.34,.34,'white',[.65,.23,.26,1]);
 // duvar çizimleri; gerçek hikâye bağlanınca içerikleri değişebilir
 pictureFrame(MX-3.55,2.12,MZ-3.82,.62,.48);
 pictureFrame(MX-2.65,2.15,MZ-3.82,.52,.62);
 pictureFrame(MX-1.78,2.10,MZ-3.82,.60,.45);
 // sıcak gece lambası
 box('minaNightStand',MX-3.55,.38,MZ+2.55,.64,.72,.64,'wood',[.41,.31,.25,1]);
 box('minaLampBase',MX-3.55,.78,MZ+2.55,.26,.04,.24,'white',[.18,.15,.12,1]);
 box('minaLampStem',MX-3.55,1.02,MZ+2.55,.04,.44,.04,'white',[.20,.16,.13,1]);
 box('minaLampGlow',MX-3.55,1.28,MZ+2.55,.30,.17,.27,'white',[1.0,.59,.28,1],[1,1],0,.95);
 fluorescent(MX,2.93,MZ-.45,1.0);
 // Sessiz Meydan'dan Mina Hattı'na giriş: karşı cephede ikinci gerçek hub kapısı.
 box('minaPortalDoor',-8.12,.05,51.2,.08,2.18,1.12,'wood',[.34,.27,.23,1],[1,2],Math.PI/2);
 box('minaPortalGlow',-8.03,.08,51.2,.025,1.82,.82,'white',[.42,.34,.26,1],[1,1],Math.PI/2,.38);
 box('minaPortalCanopy',-7.95,1.45,51.2,.72,.10,1.65,'white',[.18,.19,.20,1]);


 // -------- MAĞARA / KRİZ HATTI: GÖRÜNEN DÜNYANIN SINIRI --------
 // Bu alan Doku değildir. Taş, nem, ağırlık ve mesafe hâlâ fiziksel dünyaya aittir;
 // fakat en dipteki anormal iz gerçekliğin güvenilirliğini ilk kez sarsar.
 const CX=0,CZ=-84;
 // Meydanda kırsal hatta açılan sade bir geçiş noktası. Bir "portal" değil; anlatısal yol kısaltması.
 box('caveRoutePost',6.95,.62,52.0,.12,1.24,.12,'wood',[.30,.25,.21,1]);
 box('caveRouteSign',6.95,1.20,52.0,.12,.46,1.36,'wood',[.38,.31,.26,1],[1,1],Math.PI/2);
 box('caveRouteLamp',6.88,1.72,52.0,.18,.13,.18,'white',[1.0,.63,.30,1],[1,1],0,.72);
 // Mağara ağzı ve zemin omurgası
 box('caveFloor',CX,-.075,CZ,6.7,.15,33.5,'floor',[.17,.16,.145,1],[4,17]);
 box('caveCeil',CX,3.05,CZ,7.0,.28,33.5,'wall',[.095,.10,.105,1],[4,17]);
 // Yan duvarlar: kutular bilinçli olarak küçük açılarla kırılır; koridor hissini bozar.
 const caveSeg=[
  [-3.35,-71.5,5.4,.20],[3.35,-71.5,5.4,-.18],
  [-3.55,-76.8,5.8,-.12],[3.48,-76.8,5.8,.14],
  [-3.25,-82.3,5.5,.16],[3.42,-82.3,5.5,-.17],
  [-3.55,-87.7,5.8,-.20],[3.30,-87.7,5.8,.18],
  [-3.30,-93.1,5.5,.13],[3.52,-93.1,5.5,-.12],
  [-3.15,-98.0,4.8,-.17],[3.22,-98.0,4.8,.16]
 ];
 for(const [x,z,len,ry] of caveSeg) box('caveWall',x,1.47,z,.78,3.05,len,'wall',[.13,.135,.14,1],[1,3],ry);
 // Tavanı kıran sarkıt / kaya kütleleri
 const ceilingRocks=[[-2.0,-75,.55,.85],[1.75,-78,.68,.58],[-1.25,-83,.45,.92],[2.05,-87,.62,.70],[-1.70,-91,.72,.62],[1.15,-96,.48,.90]];
 for(const [x,z,w,d] of ceilingRocks) box('caveCeilingRock',x,2.66,z,w,.82,d,'wall',[.11,.115,.12,1],[1,1],x*.07);
 // Zemindeki fiziksel engeller / ıslak kayalar
 const rocks=[[-2.25,-78.8,.72,.38,.75],[1.78,-82.0,.86,.46,.66],[-1.85,-87.2,.60,.32,.92],[2.05,-91.0,.78,.41,.62],[-1.20,-96.1,.66,.34,.70]];
 for(const [x,z,w,h,d] of rocks) box('caveRock',x,h*.5,z,w,h,d,'wall',[.145,.14,.13,1],[1,1],x*.11);
 // Girişte hâlâ anlaşılır bir insan izi: paslı korkuluk ve terk edilmiş el feneri parıltısı
 box('caveRailL',-2.45,.62,-70.6,.07,1.20,2.1,'white',[.17,.16,.15,1]);
 box('caveRailR',2.45,.62,-70.6,.07,1.20,2.1,'white',[.17,.16,.15,1]);
 box('caveTorch',-.55,.16,-74.0,.34,.09,.11,'white',[.24,.20,.16,1],[1,1],-.25);
 box('caveTorchGlow',-.38,.20,-74.05,.12,.06,.08,'white',[1.0,.58,.25,1],[1,1],-.25,.86);
 // Kriz odası: kaynağı açıklanmayan çizgiler. Bunlar Doku'nun kendisi değildir.
 box('caveChamberFloor',0,-.065,-96.1,6.0,.13,6.6,'floor',[.12,.125,.13,1],[3,3]);
 box('caveEnd',0,1.50,-100.25,6.4,3.1,.35,'wall',[.09,.10,.105,1],[3,2]);
 for(const x of [-1.65,-.82,0,.82,1.65]){
   box('caveTrace',x,.40,-98.88,.035,1.05,.055,'white',[.13,.75,1.0,1],[1,1],x*.04,.82);
 }
 box('cavePulseCore',0,.82,-97.75,.10,1.85,1.05,'white',[.08,.48,.74,.42],[1,1],0,.72);
 // Giriş tarafında soluk açık hava izi: oyuncu çıkış yönünü kaybetmesin.
 box('caveMouthGlow',0,1.40,-67.55,4.8,2.5,.05,'white',[.42,.39,.34,.22],[1,1],0,.42);

 // Characters: Eren artık hacimli 3D NPC; Mahir gerçekçi yönlü sprite sistemiyle çizilir.
 pushNPC3D(objs,'EREN',2.75,.45,{name:'Eren3D',active:false,ry:Math.PI,targetX:2.75,targetZ:.45,walkIn:false});
}

function buildNihyelTraces(){
 // These are probability relations, not physical walls. They are rendered only while Nihyel is active.
 const C=[.10,.82,1.0,1], C2=[.42,.30,1.0,1];
 const segs=[
  // square -> threshold
  [-5.4,.18,46.0,.045,.045,5.4,.12,C],[-2.2,.62,51.0,.04,.04,5.6,-.18,C2],[2.7,.36,55.2,.045,.045,4.6,.21,C],
  [-1.2,.88,59.2,.04,.04,5.0,-.24,C2],[1.1,1.30,61.4,.035,.035,3.6,.18,C],
  // Mahir home: apparently unrelated objects are linked
  [48.15,.74,.15,.035,.035,3.15,.50,C2],[51.20,1.40,-2.75,.035,.035,3.0,-.72,C],[52.75,.94,2.55,.04,.04,2.4,.32,C2],
  // Mina line: desk, drawings, bed
  [-52.5,.92,1.2,.04,.04,3.1,-.55,C],[-49.2,1.28,-2.1,.035,.035,3.4,.34,C2],[-47.1,.72,.4,.035,.035,2.8,-.24,C],
  // cave: physical anomaly's relations extend beyond the stone trace
  [-1.9,.55,-83.0,.045,.045,5.5,.30,C2],[1.75,.92,-89.0,.04,.04,6.0,-.22,C],[0,1.35,-95.2,.04,.04,4.4,.0,C2]
 ];
 for(const [x,y,z,sx,sy,sz,ry,c] of segs)box('nihyelThread',x,y,z,sx,sy,sz,'white',c,[1,1],ry,.96);
 for(let i=0;i<9;i++){
   const a=i*Math.PI*2/9,r=1.18+(i%2)*.28;
   box('nihyelNode',Math.sin(a)*r,.20+(i%3)*.30,62.15+Math.cos(a)*r,.055,.055,.70,'white',i%2?C:C2,[1,1],a,.98);
 }
}
buildWorld();
addMainWorldDepth();
buildNihyelTraces();

const collisions=[
 [-5.15,-4.15,5.15,-3.85],[-5.15,3.85,-1.15,4.15],[1.15,3.85,5.15,4.15],
 [-5.15,-4.15,-4.85,1.5],[-5.15,2.35,-4.85,4.15],
 [4.85,-4.15,5.15,-2.0],[4.85,.2,5.15,4.15],
 [8.85,-3.95,9.15,1.95],[5.0,-3.95,9.15,-3.65],[5.0,1.65,9.15,1.95],
 [-1.65,4.0,-1.35,18.05],[1.35,4.0,1.65,18.05],
 [-3.05,18.0,-2.75,22.65],[2.75,18.0,3.05,22.65],
 [-3.05,22.35,-1.55,22.65],[1.55,22.35,3.05,22.65],
 [-1.75,-1.35,1.75,-.02], // desk
 [3.0,-2.65,4.9,-2.05], // shelf
 [-3.10,.10,-2.30,.90],[2.20,.35,3.00,1.15],[-.42,-2.45,.42,-1.55], // chairs
 [6.0,-1.85,8.0,-.75],[7.65,.60,8.75,1.30], // rear table + archive
 [-2.50,19.45,-.80,20.25],
 [-9.35,22.4,-9.05,64.0],[9.05,22.4,9.35,64.0],
 [-9.05,40.0,-8.25,55.0],[8.25,40.0,9.05,55.0],
 [-2.85,55.3,-2.48,63.6],[2.48,55.3,2.85,63.6],[-2.85,63.2,2.85,63.6],
 // Mahir'in evi duvarları + mobilya
 [44.85,-4.15,55.15,-3.85],[44.85,3.85,49.35,4.15],[50.65,3.85,55.15,4.15],
 [44.85,-4.15,45.15,4.15],[54.85,-4.15,55.15,4.15],[49.35,3.75,50.65,4.08],
 [46.0,-.45,48.2,.80],[48.45,-.38,50.35,.58],[53.0,-3.35,54.75,.90],
 [50.15,1.25,52.75,3.05],[52.65,2.45,53.45,3.25],
 // Mina Hattı duvarları + temel mobilya
 [-55.15,-4.15,-44.85,-3.85],[-55.15,3.85,-50.65,4.15],[-49.35,3.85,-44.85,4.15],
 [-55.15,-4.15,-54.85,4.15],[-45.15,-4.15,-44.85,4.15],
 [-53.62,.60,-51.28,2.10],[-49.18,-2.65,-47.25,-1.82],[-46.98,-.78,-45.55,.30],
 [-49.02,2.06,-47.78,2.84],[-53.90,2.18,-53.18,2.90],
 // Mağara fizik sınırları: koridorun dışına kaçış ve büyük kayaların içinden geçiş engellenir.
 [-4.15,-100.55,-3.00,-67.3],[3.00,-100.55,4.15,-67.3],[-4.15,-100.65,4.15,-99.95],
 [-2.65,-79.25,-1.85,-78.30],[1.30,-82.45,2.28,-81.55],[-2.25,-87.72,-1.45,-86.68],
 [1.60,-91.45,2.50,-90.55],[-1.62,-96.55,-.78,-95.62]
];
// v6.13: gerçek kapı görseli + menteşe fiziği. Kapı kapalıyken geçiş bütünüyle
// kapanır; açılırken hareket eden yaprak da fiziksel bir engel olarak kalır.
const DOOR_HINGE_X=4.91,DOOR_HINGE_Z=-1.95,DOOR_HALF_W=.48,DOOR_HALF_T=.045,DOOR_BASE_YAW=-Math.PI/2;
let doorOpen=false,doorAngle=0,doorHandlePress=0;
function doorPose(){
 const ry=DOOR_BASE_YAW+doorAngle,c=Math.cos(ry),sn=Math.sin(ry);
 // Yerel +X, menteşeden kilit tarafına uzanır.
 return {ry,c,sn,x:DOOR_HINGE_X+c*DOOR_HALF_W,z:DOOR_HINGE_Z-sn*DOOR_HALF_W};
}
function doorLeafBounds(){
 const p=doorPose(),ex=Math.abs(p.c)*DOOR_HALF_W+Math.abs(p.sn)*DOOR_HALF_T,ez=Math.abs(p.sn)*DOOR_HALF_W+Math.abs(p.c)*DOOR_HALF_T;
 return [p.x-ex,p.z-ez,p.x+ex,p.z+ez];
}
const dynamicCollisions=[
 {bounds:[4.80,-2.0,5.20,.2],active:()=>Math.abs(doorAngle)<.72},
 {bounds:()=>doorLeafBounds(),active:()=>true}
];
let px=-2.0,pz=1.55,yaw=0,pitch=.15,camDist=3.45;
let joyX=0,joyY=0,drag=false,lastX=0,lastY=0,running=false,isDialogueOpen=false,isUniverseOpen=false,near=null;
let ambientContextTarget=null,ambientContextCooldown=0;
const ambientContextInteractions=[];
let mahirYaw=0,mahirTargetYaw=0,mahirWalkPhase=0,mahirMoveAmount=0,mahirSprint=false;
// v6.18: Mahir'in çevre/görev etkileşimleri artık yalnız nesneyi oynatmaz; beden pozu da eyleme bağlanır.
let mahirUseAction={active:false,linked:false,type:'',propKind:'',q:0,started:0,duration:0,targetX:0,targetZ:0,anchorX:0,anchorZ:0,anchorYaw:0,midDone:false,onMid:null,onDone:null};
let mahirSeatState={active:false,chairId:null,x:0,z:0,ry:0,it:null};
let currentOccluders=[];
const Mechanics={
 timers:new Set(),timeouts:new Set(),
 every(fn,ms){const id=setInterval(fn,ms);this.timers.add(id);return id},
 later(fn,ms){const id=setTimeout(()=>{this.timeouts.delete(id);fn()},ms);this.timeouts.add(id);return id},
 clearTimer(id){clearInterval(id);this.timers.delete(id)},
 cancelAll(keepOverlay=false){
   this.timers.forEach(id=>clearInterval(id));this.timers.clear();
   this.timeouts.forEach(id=>clearTimeout(id));this.timeouts.clear();
   if(!keepOverlay)mechanic.classList.remove("show");
 },
 open(s,done){
  this.cancelAll(true);isMechanicOpen=true;mechanic.classList.add("show");mechanic.setAttribute('aria-hidden','false');const card=mechanicCard;
  const head=(instruction,detail)=>{const cc=chapterByNo(activeChapter),sys=chapterSystem(cc),title=s.title||"Eylem";const first=(instruction&&instruction!==title)?instruction:(detail||sys.systemBrief||"");const extra=(detail&&detail!==first)?`<div class="fact">${detail}</div>`:"";return `<div class="eyebrow">BÖLÜM ${cc.n} · ${cc.title}</div><h2>${title}</h2><p>${first}</p>${extra}<div class="fact on">BÖLÜM SİSTEMİ: ${sys.systemBrief}</div>`};
  const close=()=>{this.cancelAll();isMechanicOpen=false;mechanic.setAttribute('aria-hidden','true');done()},bad=(b,m="Bir daha düşün.")=>{if(b){b.classList.add("bad");this.later(()=>b.classList.remove("bad"),350)}Game.toast(m)};
  if(s.type==="sequence"){
    const items=s.items||["Birinci","İkinci","Üçüncü"],order=s.order||[0,1,2];let p=0;card.innerHTML=head("Doğru sırayı kur.")+`<div class="choiceGrid">${items.map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;let bar=card.querySelector(".progress i");
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(i===order[p]){b.classList.add("good");b.disabled=true;p++;bar.style.width=100*p/order.length+"%";if(p===order.length)this.later(close,250)}else bad(b)})
  } else if(s.type==="timeline"){
    card.innerHTML=head("Ses kaydındaki hedef zamanı kamerada bul.")+`<div class="fact on">SES KAYDI: Mahir’in fısıltısı 22:06:41</div><div class="timeRead" id="tm">22:04:00</div><input id="rng" type="range" min="0" max="180" value="0"><div class="stepBtns"><button data-d="-10">−10</button><button data-d="-1">−1</button><button data-d="1">+1</button><button data-d="10">+10</button></div><button class="primary" id="ok">KAMERADA BU ANI KARŞILAŞTIR</button>`;let r=card.querySelector("#rng"),tm=card.querySelector("#tm"),target=s.target||161,base=22*3600+4*60;const draw=()=>{let t=base+ +r.value,h=Math.floor(t/3600),m=Math.floor((t%3600)/60),ss=t%60;tm.textContent=[h,m,ss].map(v=>String(v).padStart(2,"0")).join(":")};r.oninput=draw;card.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{r.value=Math.max(0,Math.min(180,+r.value + +b.dataset.d));draw()});card.querySelector("#ok").onclick=()=>Math.abs(+r.value-target)<=5?close():bad(card.querySelector("#ok"),"Ses kaydı 22:06:41. Kamerayı da aynı ana getir.")
  } else if(s.type==="latency"){
    card.innerHTML=head("Kamerayla üç hareketi karşılaştır.")+`<div class="choiceGrid"><button class="choice">1. hareket — 2 sn</button><button class="choice">2. hareket — 3 sn</button><button class="choice">3. hareket — 4 sn</button></div><div class="progress"><i></i></div>`;let p=0,bar=card.querySelector(".progress i");[...card.querySelectorAll(".choice")].forEach((b,i)=>b.onclick=()=>{if(i!==p)return bad(b);b.classList.add("good");b.disabled=true;p++;bar.style.width=100*p/3+"%";if(p===3)this.later(close,250)})
  } else if(s.type==="compare"){
    card.innerHTML=head("Bölümdeki kanıtı doğru ilişkiyle eşleştir.")+`<div class="choiceGrid">${s.choices.map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div>`;card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>+b.dataset.i===s.good?close():bad(b))
  } else if(s.type==="hazard"){
    const items=s.items||["Panelvan","Çukur","Motosiklet","Mina"],order=s.order||[0,1,2,3];let p=0;card.innerHTML=head("Bir gelecek resmi değil, neden zincirini oku.")+`<div class="choiceGrid">${items.map((x,i)=>`<button class="hazardItem" data-i="${i}">${x}</button>`).join("")}</div><div class="progress"><i></i></div><button id="haz" class="primary" style="display:none">OLMADI</button>`;let bar=card.querySelector(".progress i");card.querySelectorAll(".hazardItem").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(i===order[p]){b.classList.add("good");b.disabled=true;p++;bar.style.width=100*p/order.length+"%";if(p===order.length)card.querySelector("#haz").style.display="block"}else bad(b,"Bir önceki halkayı kaçırdın.")});card.querySelector("#haz").onclick=close
  } else if(s.type==="chase"){Game.startChase(s,done);return
  } else if(s.type==="dice"){
    const scripted=(s.rolls||[4,2,6,1,3,6]).map(v=>Math.max(1,Math.min(6,+v||1)));let i=0,spin=0,lastPhysical=null;
    card.innerHTML=head("Masadaki gerçek zarı fiziksel olarak yuvarla.","Zarın kendisi yalnız 1–6 gösterebilir. Anomali zarın üzerinde değil, kayıt katmanında aranacak.")+`<div class="diceArena" id="diceArena"><div class="dieCubeWrap"><div class="dieCube" id="dieCube"><div class="dieSide f1">⚀</div><div class="dieSide f6">⚅</div><div class="dieSide f3">⚂</div><div class="dieSide f4">⚃</div><div class="dieSide f2">⚁</div><div class="dieSide f5">⚄</div></div></div></div><div class="rollHistory" id="rollHistory"></div><button class="primary" id="roll">ZARI GERÇEKTEN AT</button><div id="rec"></div>`;
    const rollBtn=card.querySelector("#roll"),cube=card.querySelector("#dieCube"),arena=card.querySelector("#diceArena"),hist=card.querySelector("#rollHistory"),recEl=card.querySelector("#rec");
    const targets={1:[0,0],2:[-90,0],3:[0,-90],4:[0,90],5:[90,0],6:[0,180]};
    const throwDie=()=>{
      if(rollBtn.disabled)return;if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.playSfx('dice_roll');rollBtn.disabled=true;arena.classList.remove('rolling');void arena.offsetWidth;arena.classList.add('rolling');
      // İlk atışlar gerçekten değişken; anlatının son fiziksel ölçümü altıda sabitlenir. 7 yalnız kayıt anomalisi olabilir.
      let value=i<scripted.length-1?(1+Math.floor(Math.random()*6)):scripted[scripted.length-1];lastPhysical=value;spin+=2;const [tx,ty]=targets[value];cube.style.transform=`rotateX(${spin*360+tx}deg) rotateY(${spin*360+ty}deg) rotateZ(${spin*180}deg)`;
      this.later(()=>{arena.classList.remove('rolling');const chip=document.createElement('span');chip.className='rollChip new';chip.textContent=value;hist.appendChild(chip);i++;Game.toast(`FİZİKSEL ZAR: ${value}`,850);if(i<scripted.length){rollBtn.disabled=false;rollBtn.textContent=`ZARI TEKRAR AT · ${i}/${scripted.length}`;return;}rollBtn.style.display='none';recEl.innerHTML=`<div class="fact on">MASADAKİ FİZİKSEL SONUÇ: ${lastPhysical}</div><div class="fact on recordGlitch">KAMERA A KAYDI: 6</div><div class="fact on recordGlitch impossible">KAMERA B KAYDI: 7</div><button class="primary" id="cmp">KAYITLARI KARŞILAŞTIR</button>`;recEl.querySelector('#cmp').onclick=()=>{Game.toast('ZAR YEDİ GELMEDİ. KAYITLARDAN BİRİ İMKÂNSIZI YAZDI.',1900);this.later(close,450)}} ,930);
    };
    rollBtn.onclick=throwDie;
  } else if(s.type==="sort"){
    let cards=[["Metinde erişim/görme motifi var.","METİN"],["Bu motif Mahir’i açıklar.","YORUM"],["Boşlukların anlamını biliyoruz.","BİLMİYORUZ"],["Metnin kendisi biyolojik bölgeye ‘Nihyel’ adını veriyor.","YANLIŞ"]],cats=["METİN","YORUM","BİLMİYORUZ","YANLIŞ"],p=0;card.innerHTML=head("Metin, yorum ve bilinmeyeni ayır.")+`<div class="fact" id="sortTxt"></div><div class="choiceGrid">${cats.map(x=>`<button class="choice">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;let txt=card.querySelector("#sortTxt"),bar=card.querySelector(".progress i");const show=()=>txt.textContent=cards[p][0];show();card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{if(b.textContent===cards[p][1]){p++;bar.style.width=100*p/cards.length+"%";if(p===cards.length)this.later(close,250);else show()}else bad(b)})
  } else if(s.type==="scan"){
    const banks={
      "Mezopotamya arşivi":[["aynı mühür izi",1],["kil tablet katman tarihi",1],["sonradan eklenmiş yorum",0],["ikinci depo numarası",1],["modern etiket",0],["kopyacı notu",0],["aynı çatlak",0],["eksik satır",0],["raf tozu",0],["ip izi",0],["renk farkı",0],["boş hücre",0]],
      "Suna’nın üç defteri":[["aynı günün üç tarihi",1],["tekrarlanan cümle",1],["farklı el yazısı basıncı",1],["kapak rengi",0],["sayfa kokusu",0],["kalem markası",0],["kenar kıvrımı",0],["boş sayfa",0],["çizgi aralığı",0],["fiyat etiketi",0],["cilt ipi",0],["sayfa numarası",0]],
      "Uyananlar":[["bağımsız saat kaydı",1],["aynı cümleyi ayrı kişiler",1],["ortak fiziksel belirti",1],["sosyal medya yorumu",0],["şehir söylentisi",0],["rastlantı hissi",0],["fotoğraf filtresi",0],["isim benzerliği",0],["hava durumu",0],["telefon modeli",0],["renk tercihi",0],["mekân dekoru",0]],
      "Aynı ev, başka geçmiş":[["duvardaki eski delik",1],["arşivlenmiş tapu zamanı",1],["aile fotoğrafındaki konum",1],["perde rengi",0],["bardak sayısı",0],["halı deseni",0],["komşu tahmini",0],["oda kokusu",0],["kapı boyası",0],["lamba modeli",0],["gürültü",0],["gölge",0]],
      "Mina’yı ara":[["oda",0],["koridor",0],["telefon",0],["kamera",0],["apartman",0],["sokak",0],["mesaj",0],["fotoğraf",0],["komşu",0],["okul",0],["park",0],["arşiv",0]]
    };
    const rows=(Array.isArray(s.items)&&s.items.length?s.items:(banks[s.title]||[["etiket tarihi",1],["farklı mürekkep",1],["eski yedek",1],["boş hücre",0],["aynı işaret",0],["dosya izi",0],["barkod",0],["kenar notu",0],["tarih damgası",0],["ikinci kopya",0],["fotoğraf",0],["fiş",0]])).map(x=>[x[0],!!x[1]]);
    let cells=rows.length,need=rows.filter(x=>x[1]).length,found=0,checked=0,misses=0;
    card.innerHTML=head(s.empty?"İz gerçekten yoksa bütün alanı sistemli tara.":"Bu bölüme ait gerçek izleri, dikkat dağıtıcı ayrıntılardan ayır.")+`<div class="scanGrid">${rows.map((x,i)=>`<button class="scanCell" data-i="${i}">${x[0]}</button>`).join("")}</div><div class="progress"><i></i></div><div class="fact" id="scanStatus">${s.empty?'Bütün alanı tara.':'Yanlış seçim sınırı: 4'}</div>`;
    let bar=card.querySelector(".progress i"),status=card.querySelector("#scanStatus");
    card.querySelectorAll(".scanCell").forEach(b=>b.onclick=()=>{
      if(b.disabled)return;b.disabled=true;checked++;let i=+b.dataset.i;
      if(rows[i][1]){b.classList.add("good");found++;Game.toast("Bağımsız iz bulundu.")}
      else{b.classList.add("checked");misses++;status.textContent=`Yanlış seçim: ${misses}/4`;if(!s.empty&&misses>=4){Game.toast("Çok fazla gürültüyü kanıt sandın. Tarama sıfırlandı.");this.later(()=>this.open(s,done),400);return}}
      bar.style.width=(s.empty?100*checked/cells:100*found/Math.max(1,need))+"%";
      if((s.empty&&checked===cells)||(!s.empty&&found===need))this.later(close,250)
    })
  } else if(s.type==="dual"){
    const bank={
      "İki bina":[["Balkon ↔ ahşap cumba",1],["Aynı gökyüzü",0],["Gözlükçü ↔ dar kapı",1],["Sarı sıva ↔ koyu taş",1],["Aynı kaldırım taşı",0]],
      "Levh":[["Rıza’nın yaşadığı yıllar",1],["Mina’nın yok olduğu süreklilik",1],["Kazanın iki sonucu",1],["Telefonun pil yüzdesi",0],["Mahir’in ayakkabısı",0]],
      "EMR eşiği":[["Kapı açık ↔ kapalı",1],["Oda dolu ↔ boş",1],["Mahir içeride ↔ dışarıda",1],["Duvarın rengi aynı",0],["Saatin markası aynı",0]]
    };
    let mode=0,found=0,items=bank[s.title];
    if(!items&&Array.isArray(s.differences)&&s.differences.length){items=s.differences.map(x=>[x,1]);items.push(["Önemsiz dekor ayrıntısı",0],["Kayıt dışı varsayım",0]);}
    if(!items)items=[["Birinci gerçek fark",1],["Sahte fark",0],["İkinci gerçek fark",1],["Üçüncü gerçek fark",1],["Önemsiz ayrıntı",0]];
    const need=items.filter(x=>x[1]).length;
    card.innerHTML=head("İki görünüş arasında geçiş yap. Yalnız bölümde gerçekten verilen farkları seç.")+`<button class="secondary" id="tog">GÖRÜNÜŞ A ↔ B</button><div class="dualView" id="dv">GÖRÜNÜŞ A</div><div class="choiceGrid">${items.map((x,i)=>`<button class="choice" data-i="${i}">${x[0]}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");
    card.querySelector("#tog").onclick=()=>{mode=1-mode;const dvEl=card.querySelector("#dv");dvEl.textContent=mode?"GÖRÜNÜŞ B":"GÖRÜNÜŞ A";dvEl.classList.toggle("alt",!!mode)};
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{
      let i=+b.dataset.i;
      if(items[i][1]){b.disabled=true;b.classList.add("good");found++;bar.style.width=100*found/Math.max(1,need)+"%";if(found===need)this.later(close,250)}
      else bad(b,"Bu iki görünüş arasındaki anlamlı fark değil.")
    })
  } else if(s.type==="memory"){
    let arr=["Telefon geldi","Hastaneye yetişti","Rıza’yı son kez gördü","Yapılmamış konuşma kaldı"],p=0;card.innerHTML=head("Anı parçalarını sıraya koy.")+`<div class="choiceGrid">${arr.map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div>`;card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{if(+b.dataset.i===p){b.classList.add("good");b.disabled=true;p++;if(p===arr.length)this.later(close,250)}else bad(b)})
  } else if(s.type==="map"){
    let n=s.nodes||12,p=0;
    const required=s.title==="317"?[1,4,7,10]:[0,3,6,9];
    card.innerHTML=head(s.title==="317"?"Aynı örüntüdeki dört müdahale kümesini bul.":"Birbirinden bağımsız dört erken veri noktasını aç.")+`<div class="mapGrid">${Array.from({length:n},(_,i)=>`<button class="mapNode" data-i="${i}">${i+1}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    const bar=card.querySelector(".progress i");
    card.querySelectorAll(".mapNode").forEach(b=>b.onclick=()=>{
      let i=+b.dataset.i;if(b.disabled)return;
      if(required.includes(i)){b.disabled=true;b.classList.add("on");p++;bar.style.width=25*p+"%";if(p===4)this.later(close,250)}
      else bad(b,s.title==="317"?"Bu nokta aynı kümeye ait değil.":"Bu veri noktası aradığın erken örnek değil.")
    })
  } else if(s.type==="resist"){
    let left=s.seconds||5,phase=0;
    const urges=["MÜDAHALE ET","ŞİMDİ DÜZELTEBİLİRSİN","BİR ŞEY YAP","GEÇ KALMADAN MÜDAHALE ET"];
    card.innerHTML=head("Bu kez doğru hamle müdahale etmemek. Dürtü güçlenecek; yalnız bekle.")+
      `<div class="countdown" id="cnt">${left}</div><div class="meterTrack urge"><i id="urgeFill" style="width:15%"></i></div><button class="primary temptBtn" id="tempt">${urges[0]}</button><div class="fact">Amaç: sayaç bitene kadar düğmeye dokunmamak.</div>`;
    const cntEl=card.querySelector("#cnt"),temptEl=card.querySelector("#tempt"),urge=card.querySelector("#urgeFill");
    let tm=this.every(()=>{
      left--;phase++;
      cntEl.textContent=left;
      urge.style.width=Math.min(100,15+phase*18)+"%";
      temptEl.textContent=urges[Math.min(urges.length-1,phase)];
      temptEl.style.transform=`scale(${1+Math.min(.16,phase*.035)})`;
      if(left<=0){this.clearTimer(tm);close()}
    },1000);
    temptEl.onclick=()=>{
      left=s.seconds||5;phase=0;cntEl.textContent=left;urge.style.width="15%";temptEl.style.transform="scale(1)";
      Game.toast("Dürtüye kapıldın. Bekleme yeniden başladı.")
    }
  } else if(s.type==="hold"){
    let v=0,tm=null,need=(s.seconds||3)*10;card.innerHTML=head("Kararı uygulamak için basılı tut.")+`<button class="primary" id="hold">BU GECE HASTANEYE GİDİYORUZ</button><div class="progress"><i></i></div>`;let bar=card.querySelector(".progress i");const stop=()=>{if(tm)this.clearTimer(tm);tm=null;if(v<need){v=0;bar.style.width="0%"}},start=()=>{if(tm)return;tm=this.every(()=>{v++;bar.style.width=100*v/need+"%";if(v>=need){this.clearTimer(tm);tm=null;close()}},100)};const holdBtn=card.querySelector("#hold");holdBtn.onpointerdown=start;holdBtn.onpointerup=holdBtn.onpointerleave=holdBtn.onpointercancel=stop
  } else if(s.type==="route"){
    const items=(Array.isArray(s.items)&&s.items.length?s.items:["Rıza’nın ölüm gecesi","Üç ay sonra İstanbul","İpek","Mina’nın doğacağı yol"]).slice();
    const order=(Array.isArray(s.order)&&s.order.length===items.length?s.order:items.map((_,i)=>i));
    const canonical=order.map(i=>items[i]).filter(x=>x!==undefined),shown=items.slice().reverse();
    if(shown.length>1&&shown.every((x,i)=>x===canonical[i]))shown.push(shown.shift());
    let p=0;
    card.innerHTML=head("Nedensel çizgiyi kronolojik sıraya koy.")+`<div class="choiceGrid">${shown.map(x=>`<button class="routeNode" data-v="${x}">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");
    card.querySelectorAll(".routeNode").forEach(b=>b.onclick=()=>{if(b.dataset.v===canonical[p]){b.classList.add("good");b.disabled=true;p++;bar.style.width=100*p/Math.max(1,canonical.length)+"%";if(p===canonical.length)this.later(close,250)}else bad(b,"Bu halka daha sonra geliyor.")})
  } else if(s.type==="meter"){
    let val=8,dir=0,left=80,score=0;
    card.innerHTML=head("Ortak dikkati eşikte tut. Gösterge hedef bandın dışında başlar; bıraktığında yavaşça aşağı sürüklenir.")+`<div class="meterTrack"><i id="mf" style="width:8%"></i><em style="left:42%;width:26%"></em></div><div class="stepBtns"><button id="down">AZALT</button><button id="up">ARTIR</button></div><div class="countdown" id="mc">8</div>`;
    const upBtn=card.querySelector("#up"),downBtn=card.querySelector("#down"),mfEl=card.querySelector("#mf"),mcEl=card.querySelector("#mc");
    const setDir=d=>()=>{dir=d},stop=()=>{dir=0};
    upBtn.onpointerdown=setDir(1);downBtn.onpointerdown=setDir(-1);
    [upBtn,downBtn].forEach(b=>{b.onpointerup=stop;b.onpointerleave=stop;b.onpointercancel=stop});
    let tm=this.every(()=>{
      const neutralDrift=dir===0?-0.34:0;
      val=Math.max(0,Math.min(100,val+dir*2.0+neutralDrift+(Math.random()-.5)*.28));
      mfEl.style.width=val+"%";
      if(val>=42&&val<=68)score++;
      left--;mcEl.textContent=Math.ceil(left/10);
      if(left<=0){
        this.clearTimer(tm);
        if(score>=24)close();
        else{
          Game.toast("Ortak ritim dağıldı. Yeniden dene.");
          this.cancelAll();
          this.later(()=>this.open(s,done),350);
        }
      }
    },100)
  } else if(s.type==="evidence"){
    let arr=(Array.isArray(s.items)&&s.items.length?s.items:[["Eski fotoğraf",1],["Tarihli mesaj",1],["Arşiv yedeği",1],["Sabah söylentisi",0],["Güvenlik kopyası",1]]).map(x=>[x[0],!!x[1]]),got=0,need=arr.filter(x=>x[1]).length;
    card.innerHTML=head("Anlatı ile bağımsız kaydı ayır. Bölümün kendi kanıtlarını seç.")+`<div class="choiceGrid">${arr.map((x,i)=>`<button class="choice" data-i="${i}">${x[0]}</button>`).join("")}</div><div class="progress"><i></i></div>`;let bar=card.querySelector(".progress i");card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(arr[i][1]){b.disabled=true;b.classList.add("good");got++;bar.style.width=100*got/Math.max(1,need)+"%";if(got===need)this.later(close,250)}else bad(b,"Bu, bölümde bağımsız kanıt olarak doğrulanmış bir iz değil.")})
  } else if(s.type==="broadcast"){
    let waves=[3000,18000,72000,180000,300000],p=0;card.innerHTML=head("Yayın büyüyor. Aynı cümle aynı niyet demek değil.")+`<div class="broadcastNum" id="bn">0</div><div class="progress"><i></i></div><button class="secondary" id="bnext">AKIŞI İZLE</button>`;let bar=card.querySelector(".progress i"),bnEl=card.querySelector("#bn"),bnextEl=card.querySelector("#bnext");bnextEl.onclick=()=>{bnEl.textContent=waves[p].toLocaleString("tr-TR");p++;bar.style.width=100*p/waves.length+"%";if(p===waves.length){bnextEl.textContent="SONUCU GÖR";bnextEl.onclick=close}}
  } else if(s.type==="routing"){
    let people=["Mina","Kerem","Suna","Baran","Nisan","Dicle"],
        hints=[
          "Karar vermek zorunda değil; fikrini sonra söyleyebilir.",
          "Çizgiyi bilinçli olarak tutmayı seçiyor.",
          "Kapıyı açmamayı seçti; iradesi zorlanmamalı.",
          "Erişimi açık tutmak ve büyütmek istiyor.",
          "Ölçmek istiyor; erişimi kendi üzerinde istemiyor.",
          "İlk bildirimi yalnız kayıt olarak gönderdi; erişimini açmak ya da kapatmak istediğini söylemedi."
        ],
        states=["AÇIK","KAPALI","BEKLE"],
        solution=["BEKLE","AÇIK","BEKLE","AÇIK","KAPALI","BEKLE"],sel={};
    card.innerHTML=head("Tek bir küresel emir verme. Her düğümün kendi iradesini oku.")+
      `<div class="fact on">İpucu: AÇIK/KAPALI bir ödül-ceza değil; kişinin kendi seçimini temsil ediyor. Kararsız olanı BEKLE'de bırak.</div>`+
      `<div class="routingPeople">${people.map((p,i)=>`<div class="routingRow"><div><b>${p}</b><small>${hints[i]}</small></div><div>${states.map(st=>`<button data-i="${i}" data-s="${st}">${st}</button>`).join("")}</div></div>`).join("")}</div>`+
      `<button class="primary" id="rcheck">DÜĞÜMLERİ AYIR</button>`;
    card.querySelectorAll(".routingRow button").forEach(b=>b.onclick=()=>{
      let i=+b.dataset.i;sel[i]=b.dataset.s;
      b.parentElement.querySelectorAll("button").forEach(x=>x.classList.remove("on"));b.classList.add("on")
    });
    card.querySelector("#rcheck").onclick=()=>solution.every((s,i)=>sel[i]===s)
      ?close()
      :Game.toast("İpuçlarını kişilerin kendi seçimi açısından yeniden oku.")

  } else if(s.type==="hypothesis" || s.type==="dreamlog" || s.type==="method"){
    let cards=s.cards||[],p=0;
    const labels=[...new Set(cards.map(x=>x[1]))];
    card.innerHTML=head("Her cümleyi kendi bilgi düzeyine yerleştir.")+`<div class="hypoCard"><b id="hText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    const txt=card.querySelector("#hText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=cards[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===cards[p][1]){p++;bar.style.width=100*p/cards.length+"%";if(p===cards.length)this.later(close,260);else show()}else bad(b,"Gözlem, yorum ve arzuyu birbirine karıştırma.")})
  } else if(s.type==="recordPair"){
    card.innerHTML=head("İki kayıt birbirini dışlıyor. Birini zorla silmeden ne yapmalısın?")+`<div class="pairBox"><div><b>A</b><p>${s.a}</p></div><div><b>B</b><p>${s.b}</p></div></div><div class="choiceGrid"><button class="choice" data-v="A">A'YI DOĞRU SAY</button><button class="choice" data-v="B">B'Yİ DOĞRU SAY</button><button class="choice" data-v="${s.correct}">${s.correct}</button></div>`;
    card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>b.dataset.v===s.correct?close():bad(b,"Bu bölümde kanıt, bir sürümü zorla yok etmeyi desteklemiyor."))
  } else if(s.type==="causality"){
    let items=s.items||[],p=0;const labels=[...new Set(items.map(x=>x[1]))];
    card.innerHTML=head("Neden yönünü varsaymadan ifadeleri sınıflandır.")+`<div class="hypoCard"><b id="cText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let txt=card.querySelector("#cText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=items[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===items[p][1]){p++;bar.style.width=100*p/items.length+"%";if(p===items.length)this.later(close,250);else show()}else bad(b,"Korelasyonu nedensellik sanma.")})
  } else if(s.type==="sourceGrid" || s.type==="semantic" || s.type==="responsibility"){
    let rows=s.rows||s.items||[],p=0;const labels=[...new Set(rows.map(x=>x[1]))];
    card.innerHTML=head("Kavramı doğru katmana yerleştir.")+`<div class="hypoCard"><b id="sgText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    const txt=card.querySelector("#sgText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=rows[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===rows[p][1]){p++;bar.style.width=100*p/rows.length+"%";if(p===rows.length)this.later(close,240);else show()}else bad(b)})
  } else if(s.type==="filter"){
    let posts=s.posts||[],p=0;const labels=[...new Set(posts.map(x=>x[1]))];
    card.innerHTML=head("İfade ne kadar ileri gidiyor?")+`<div class="hypoCard"><b id="fText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    const txt=card.querySelector("#fText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=posts[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===posts[p][1]){p++;bar.style.width=100*p/posts.length+"%";if(p===posts.length)this.later(close,240);else show()}else bad(b,"Deneyim ile ondan çıkarılan kesin hükmü ayır.")})
  } else if(s.type==="spatial"){
    let vals=s.measures||[18,18,23],i=0;
    card.innerHTML=head("Aynı koridoru üç yöntemle ölç.")+`<div class="timeRead" id="spVal">—</div><button class="primary" id="measure">ÖLÇ</button><div id="spList"></div>`;
    const val=card.querySelector("#spVal"),list=card.querySelector("#spList"),btn=card.querySelector("#measure");
    btn.onclick=()=>{val.textContent=vals[i];list.insertAdjacentHTML("beforeend",`<div class="fact on">Ölçüm ${i+1}: ${vals[i]}</div>`);i++;if(i>=vals.length){btn.textContent="PLANI KARŞILAŞTIR";btn.onclick=()=>{list.insertAdjacentHTML("beforeend",`<div class="fact">Mimari plan: ${s.plan}</div>`);this.later(close,650)}}}
  } else if(s.type==="continuity"){
    let nodes=s.nodes||[],p=0;
    card.innerHTML=head("Rıza’nın süreklilik izlerini sıraya koy.")+`<div class="choiceGrid">${[...nodes].reverse().map(x=>`<button class="routeNode" data-v="${x}">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{if(b.dataset.v===nodes[p]){b.classList.add("good");b.disabled=true;p++;bar.style.width=100*p/nodes.length+"%";if(p===nodes.length)this.later(close,250)}else bad(b,"Bu iz daha sonra geliyor.")})
  } else if(s.type==="consent"){
    const people=s.people||[];let doneCount=0;
    card.innerHTML=head("Tek bir toplu karar verme. Her kişinin açık tercihini ayrı uygula.")+`<div>${people.map((x,i)=>`<div class="branchRow"><b>${x[0]}</b><small>${x[1]}</small><div class="labelGrid"><button data-i="${i}" data-v="${x[1]}">${x[1]}</button><button data-i="${i}" data-v="ZORLA">ZORLA TEK SONUÇ</button></div></div>`).join("")}</div>`;
    card.querySelectorAll(".branchRow button").forEach(b=>b.onclick=()=>{let i=+b.dataset.i,row=b.closest(".branchRow");if(b.dataset.v===people[i][1]){if(!row.dataset.done){row.dataset.done="1";b.classList.add("good");row.querySelectorAll("button").forEach(x=>x.disabled=true);doneCount++;if(doneCount===people.length)this.later(close,300)}}else bad(b,"Bu kişinin kendi tercihinin yerine sen karar veriyorsun.")})
  } else if(s.type==="anchor"){
    let events=s.events||[],i=0,left=s.seconds||7;
    card.innerHTML=head("Telefonu değil günü takip et.")+`<div id="aEvents"></div><div class="countdown" id="aCount">${left}</div><button class="secondary" id="aPhone">ANOMALİ BİLDİRİMİNE BAK</button>`;
    const ev=card.querySelector("#aEvents"),cnt=card.querySelector("#aCount"),phone=card.querySelector("#aPhone");
    let tm=this.every(()=>{left--;cnt.textContent=left;if(i<events.length){ev.insertAdjacentHTML("beforeend",`<div class="anchorEvent">${events[i++]}</div>`)}if(left<=0){this.clearTimer(tm);close()}},1000);
    phone.onclick=()=>{left=Math.min(s.seconds||7,left+2);cnt.textContent=left;Game.toast("Grafik önemli; ama bu bölümde Mina’yı grafiğe dönüştürme.")}
  } else if(s.type==="splitReality"){
    const branches=s.branches||[];let p=0;
    card.innerHTML=head("Her kayıp başka bir hayatı zorla yeniden yazma hakkı vermez.")+`<div>${branches.map((x,i)=>`<div class="branchRow"><b>${x[0]}</b><small>${x[1]}</small><div class="labelGrid"><button data-i="${i}" data-v="${x[2]}">${x[2]}</button><button data-i="${i}" data-v="ZORLA">ZORLA SÜRDÜR</button></div></div>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");
    card.querySelectorAll(".branchRow button").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(b.dataset.v===branches[i][2]){if(!b.parentElement.dataset.done){b.parentElement.dataset.done="1";b.classList.add("good");b.parentElement.querySelectorAll("button").forEach(x=>x.disabled=true);p++;bar.style.width=100*p/branches.length+"%";if(p===branches.length)this.later(close,450)}}else bad(b,"Bu hamle kaybı gidermiyor; başka bir hayatı zorluyor.")})


  } else if(s.type==="searchScene"){
    let got=0,need=(s.items||[]).filter(x=>x[1]).length;
    card.innerHTML=head(s.title||"Sahneyi araştır")+`<div class="scanGrid">${(s.items||[]).map((x,i)=>`<button class="scanCell" data-i="${i}">${x[0]}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");
    card.querySelectorAll(".scanCell").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(b.disabled)return;if(s.items[i][1]){b.disabled=true;b.classList.add("good");got++;bar.style.width=100*got/need+"%";if(got===need)this.later(close,260)}else bad(b,"Bu ayrıntı bölümün kırılma izlerinden biri değil.")})
  } else if(s.type==="actionSequence"){
    let canonical=s.steps||[],shown=s.shuffle?[...canonical].sort(()=>Math.random()-.5):[...canonical],p=0;
    card.innerHTML=head(s.title||"Eylem sırası")+`<div class="choiceGrid">${shown.map(x=>`<button class="routeNode" data-v="${x}">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let bar=card.querySelector(".progress i");
    card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{if(b.dataset.v===canonical[p]){b.disabled=true;b.classList.add("good");p++;bar.style.width=100*p/canonical.length+"%";if(p===canonical.length)this.later(close,260)}else bad(b,"Olayın fiziksel sırasını yeniden düşün.")})
  } else if(s.type==="priority"){
    card.innerHTML=head(s.title||"Öncelik")+`<div class="choiceGrid">${(s.choices||[]).map((x,i)=>`<button class="choice" data-i="${i}">${x[0]}</button>`).join("")}</div>`;
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>s.choices[+b.dataset.i][1]?close():bad(b,"Yakındaki gerçek ihtiyacı, uzaktaki merakın önüne koy."))
  } else if(s.type==="survival"){
    let days=s.days||[],p=0,actions=[...new Set(days.map(x=>x[1]))];
    card.innerHTML=head(s.title||"Hayatta kal")+`<div class="hypoCard"><b id="survCue"></b><div class="labelGrid">${actions.map(a=>`<button data-a="${a}">${a}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let cue=card.querySelector("#survCue"),bar=card.querySelector(".progress i"),show=()=>cue.textContent=days[p][0];show();
    card.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{if(b.dataset.a===days[p][1]){p++;bar.style.width=100*p/days.length+"%";if(p===days.length)this.later(close,280);else show()}else bad(b,"Bu koşulda önce bedenin gerçek ihtiyacını düşün.")})
  } else if(s.type==="boundary"){
    let tests=s.tests||[],p=0;
    card.innerHTML=head(s.title||"Sınırı test et","Her deneyi sırayla yap; sonuç, görüntü ile fiziksel etkinin aynı şey olmadığını gösterebilir.")+`<div id="bResult" class="dualView">Sınır görünmüyor.</div><button class="primary" id="bTest">DENEY 1</button><div class="progress"><i></i></div>`;
    const r=card.querySelector("#bResult"),btn=card.querySelector("#bTest"),bar=card.querySelector(".progress i");
    btn.onclick=()=>{r.textContent=tests[p][1];p++;bar.style.width=100*p/tests.length+"%";if(p>=tests.length){btn.textContent="SINIRI KABUL ET";btn.onclick=close}else btn.textContent=`DENEY ${p+1}: ${tests[p][0]}`}
  } else if(s.type==="recordEthics"){
    let cards=s.cards||[],p=0,labels=[...new Set(cards.map(x=>x[1]))];
    card.innerHTML=head(s.title||"Kaydı ayır")+`<div class="hypoCard"><b id="reText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let txt=card.querySelector("#reText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=cards[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===cards[p][1]){p++;bar.style.width=100*p/cards.length+"%";if(p===cards.length)this.later(close,250);else show()}else bad(b,"Gözlenen şey ile ona yüklenen anlamı ayır.")})
  } else if(s.type==="causalWeb"){
    let selected=new Set(),truth=(s.causes||[]).map((x,i)=>x[1]?i:null).filter(x=>x!==null);
    card.innerHTML=head(s.title||"Nedensel ağ","Doğru nedenler birden fazla olabilir; tek bir açıklamaya zorlamadan desteklenenleri seç.")+`<div class="choiceGrid">${(s.causes||[]).map((x,i)=>`<button class="choice" data-i="${i}">${x[0]}</button>`).join("")}</div><button class="primary" id="cwCheck">AĞI KONTROL ET</button>`;
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(selected.has(i)){selected.delete(i);b.classList.remove("good")}else{selected.add(i);b.classList.add("good")}});
    card.querySelector("#cwCheck").onclick=()=>{let a=[...selected].sort((x,y)=>x-y),t=[...truth].sort((x,y)=>x-y);JSON.stringify(a)===JSON.stringify(t)?close():Game.toast("Tek bir sebebe indirgeme; ama desteklenmeyen yorumu da ekleme.")}
  } else if(s.type==="choiceVsRecord"){
    card.innerHTML=head(s.title||"Kayıt ve seçim")+`<div class="fact on">${s.record||""}</div><div class="choiceGrid">${(s.choices||[]).map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div>`;
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>+b.dataset.i===s.good?close():bad(b,"Kayıt bilgi olabilir; zorunlu komut değildir."))
  } else if(s.type==="ledger"){
    card.innerHTML=head(s.title||"Kayıt tablosu")+`<div>${(s.observed||[]).map(x=>`<div class="fact on">${x[0]} → ${x[1]}</div>`).join("")}</div><p>${s.question||""}</p><div class="choiceGrid">${(s.choices||[]).map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div>`;
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>+b.dataset.i===s.good?close():bad(b,"Kayıttaki değişim ile dağıtılan gerçek payı birlikte düşün."))
  } else if(s.type==="track"){
    let rows=s.tracks||[],p=0,labels=[...new Set(rows.map(x=>x[1]))];
    card.innerHTML=head(s.title||"İz sür")+`<div class="hypoCard"><b id="trText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let txt=card.querySelector("#trText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=rows[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===rows[p][1]){p++;bar.style.width=100*p/rows.length+"%";if(p===rows.length)this.later(close,260);else show()}else bad(b,"İz ile ondan çıkardığın hikâyeyi ayır.")})
  } else if(s.type==="nameLedger"){
    let rows=s.items||[],p=0,labels=[...new Set(rows.map(x=>x[1]))];
    card.innerHTML=head(s.title||"İsim kaydı")+`<div class="hypoCard"><b id="nlText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let txt=card.querySelector("#nlText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=rows[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===rows[p][1]){p++;bar.style.width=100*p/rows.length+"%";if(p===rows.length)this.later(close,250);else show()}else bad(b)})
  } else if(s.type==="timeCompare"){
    let rows=s.tracks||[],p=0;
    card.innerHTML=head(s.title||"Zamanları karşılaştır")+`<div id="tcList"></div><button class="primary" id="tcNext">SONRAKİ KAYDI AÇ</button>`;
    let list=card.querySelector("#tcList"),btn=card.querySelector("#tcNext");
    btn.onclick=()=>{let x=rows[p++];list.insertAdjacentHTML("beforeend",`<div class="fact on"><b>${x[0]}</b> · ${x[1]}</div>`);if(p>=rows.length){btn.textContent="FARKI KABUL ET";btn.onclick=close}}
  } else if(s.type==="naturalOrMade"){
    let rows=s.items||[],p=0,labels=[...new Set(rows.map(x=>x[1]))];
    card.innerHTML=head(s.title||"Doğal mı, yapılmış mı?")+`<div class="hypoCard"><b id="nmText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    let txt=card.querySelector("#nmText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=rows[p][0];show();
    card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===rows[p][1]){p++;bar.style.width=100*p/rows.length+"%";if(p===rows.length)this.later(close,250);else show()}else bad(b,"Örüntü görmek, kasıt kanıtı değildir.")})


  } else if(s.type==="audioLayers"){
    let p=0,layers=s.layers||[];card.innerHTML=head(s.title||"Ses katmanlarını ayır")+`<div id="audLine" class="dualView">SESİ OYNAT</div><div class="choiceGrid">${layers.map((x,i)=>`<button class="choice" data-i="${i}">KATMAN ${i+1}</button>`).join("")}</div><div class="progress"><i></i></div>`;
    let out=card.querySelector("#audLine"),bar=card.querySelector(".progress i");card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(i===p){out.textContent=layers[p];b.disabled=true;b.classList.add("good");p++;bar.style.width=100*p/layers.length+"%";if(p===layers.length)this.later(close,400)}else bad(b,"Önce duyulan katmanı sırayla ayır.")})
  } else if(s.type==="gapTimeline"){
    let facts=s.facts||[],p=0;card.innerHTML=head(s.title||"Boşluk zaman çizgisi")+`<div class="timeRead">${s.minutes||4} DAKİKALIK ARALIK</div><div id="gapFacts"></div><button class="primary" id="gapNext">DIŞ KAYDI AÇ</button><div class="progress"><i></i></div>`;
    const list=card.querySelector("#gapFacts"),btn=card.querySelector("#gapNext"),bar=card.querySelector(".progress i");btn.onclick=()=>{list.insertAdjacentHTML("beforeend",`<div class="fact on">${facts[p]}</div>`);p++;bar.style.width=100*p/facts.length+"%";if(p>=facts.length){btn.textContent="BOŞLUĞU HAFIZA ERİŞİMİ OLARAK İŞARETLE";btn.onclick=close}else btn.textContent="SONRAKİ İZİ AÇ"}
  } else if(s.type==="selectionField"){
    let rows=s.items||[],p=0,labels=[...new Set(rows.map(x=>x[1]))];card.innerHTML=head(s.title||"Seçilen anlar")+`<div class="hypoCard"><b id="sfText"></b><div class="labelGrid">${labels.map(x=>`<button data-l="${x}">${x}</button>`).join("")}</div></div><div class="progress"><i></i></div>`;
    const txt=card.querySelector("#sfText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=rows[p][0];show();card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===rows[p][1]){p++;bar.style.width=100*p/rows.length+"%";if(p===rows.length)this.later(close,260);else show()}else bad(b,"Belirginlik ile yaşanmışlığı aynı şey sayma.")})
  } else if(s.type==="leaveClosed"){
    let opened=new Set(),badOpen=false,paths=s.paths||[],must=new Set(s.mustLeave||[]);card.innerHTML=head(s.title||"Bazı yollar kapalı kalmalı","Erişilebilir olmak izin verilmiş olmak değildir.")+`<div class="choiceGrid">${paths.map((x,i)=>`<button class="choice" data-i="${i}">${x[0]} · ${x[1]}</button>`).join("")}</div><button class="primary" id="lcDone">SEÇİMİ BİTİR</button>`;
    card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{let x=paths[+b.dataset.i],name=x[0];if(must.has(name)){badOpen=true;bad(b,"Bu yolun kapalı kalması istenmişti.");return}opened.add(name);b.classList.add("good");b.disabled=true});card.querySelector("#lcDone").onclick=()=>!badOpen&&opened.size>=1?close():Game.toast("Açık olanı seç; kapalı kalması isteneni zorlama.")
  } else if(s.type==="blindTest"){
    let cards=s.cards||[],p=0;card.innerHTML=head(s.title||"Kör test")+`<div class="hypoCard"><b id="btText"></b><div class="labelGrid"><button data-l="A">A</button><button data-l="B">B</button></div></div><div class="progress"><i></i></div>`;
    const txt=card.querySelector("#btText"),bar=card.querySelector(".progress i"),show=()=>txt.textContent=cards[p][0];show();card.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{if(b.dataset.l===cards[p][1]){p++;bar.style.width=100*p/cards.length+"%";if(p===cards.length)this.later(close,300);else show()}else bad(b,"Kör eşleştirmede anlam yükleme; etiketi takip et.")})
  } else if(s.type==="anticipation"){
    let p=0,seq=s.sequence||[];card.innerHTML=head(s.title||"Ses dizisi")+`<div id="antNow" class="dualView">SESSİZLİK</div><button class="primary" id="antWait">BEKLE / DİNLE</button><div class="progress"><i></i></div><div class="fact">${s.difference||""}</div>`;
    const now=card.querySelector("#antNow"),btn=card.querySelector("#antWait"),bar=card.querySelector(".progress i");btn.onclick=()=>{now.textContent=seq[p];p++;bar.style.width=100*p/seq.length+"%";if(p>=seq.length){btn.textContent="BENZERLİĞİ AYNI OLAY SAYMA";btn.onclick=close}}
  } else if(s.type==="observerAngle"){
    let p=0,views=s.views||[];card.innerHTML=head(s.title||"Bakış açısı")+`<div class="dualView" id="oaView">SAHNE</div><button class="primary" id="oaTurn">AÇIYI ÇEVİR</button><div class="progress"><i></i></div>`;
    const v=card.querySelector("#oaView"),btn=card.querySelector("#oaTurn"),bar=card.querySelector(".progress i");btn.onclick=()=>{v.textContent=views[p];p++;bar.style.width=100*p/views.length+"%";if(p>=views.length){btn.textContent=s.sourceFound?"KAYNAĞI İŞARETLE":"KAYNAĞIN YERİNİ BİLMEDİĞİNİ KABUL ET";btn.onclick=close}}
  } else if(s.type==="predictionChoice"){
    card.innerHTML=head(s.title||"Öngörü / seçim")+`<div class="fact on">ÖNGÖRÜ: ${s.prediction}</div><div class="choiceGrid">${(s.choices||[]).map((x,i)=>`<button class="choice" data-i="${i}">${x}</button>`).join("")}</div><div class="fact" id="pcAfter"></div>`;const after=card.querySelector("#pcAfter");card.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{after.textContent=`KAYIT SONRASI: ${s.recordAfter||b.textContent}`;b.classList.add("good");card.querySelectorAll(".choice").forEach(x=>x.disabled=true);this.later(close,650)})
  } else if(s.type==="manualRescue"){
    let steps=s.steps||[],shown=[...steps].sort(()=>Math.random()-.5),p=0;card.innerHTML=head(s.title||"Ellerinle müdahale")+`<div class="choiceGrid">${shown.map(x=>`<button class="routeNode" data-v="${x}">${x}</button>`).join("")}</div><div class="progress"><i></i></div>`;let bar=card.querySelector(".progress i");card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{if(b.dataset.v===steps[p]){b.disabled=true;b.classList.add("good");p++;bar.style.width=100*p/steps.length+"%";if(p===steps.length)this.later(close,300)}else bad(b,"Önce fiziksel tehlikeyi sırayla çöz.")})
  } else if(s.type==="outsideSubject"){
    card.innerHTML=head(s.title||"Özne")+`<div class="mapGrid">${(s.groups||[]).map(x=>`<button class="mapNode">${x}</button>`).join("")}</div><div class="fact on">${s.line}</div><div class="choiceGrid"><button class="choice" data-v="iç">ÖZNE DÖRT GRUPTAN BİRİ</button><button class="choice" data-v="dış">SATIR DÖRDÜNÜ DIŞARIDAN ANLATIYOR</button></div>`;card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>b.dataset.v==="dış"?close():bad(b,"Cümledeki bakış dört grubun dışında kurulmuş olabilir."))
  } else if(s.type==="absentObject"){
    card.innerHTML=head(s.title||"Olmayan nesne")+`<div class="pairBox"><div><b>BEŞİNCİ AÇI</b><p>${s.shown}</p></div><div><b>FİZİKSEL ODA</b><p>${s.real}</p></div></div><div class="fact">${s.influence}</div><div class="choiceGrid"><button class="choice" data-v="1">NESNE KESİNLİKLE VARDI</button><button class="choice" data-v="2">GÖRÜNTÜ DAVRANIŞI ETKİLEDİ; NESNE YOKTU</button></div>`;card.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>b.dataset.v==="2"?close():bad(b,"Görüntünün etkisi gerçek olabilir; nesnenin kendisi yine bulunmayabilir."))
  } else if(s.type==="sentenceLayer"){
    let lines=s.lines||[],p=0;card.innerHTML=head(s.title||"Cümle")+`<div class="dualView" id="slLine">...</div><button class="primary" id="slNext">CÜMLEYİ OKU</button><div class="progress"><i></i></div>`;const line=card.querySelector("#slLine"),btn=card.querySelector("#slNext"),bar=card.querySelector(".progress i");btn.onclick=()=>{line.textContent=lines[p];p++;bar.style.width=100*p/lines.length+"%";if(p>=lines.length){btn.textContent=s.selfRef?"OKUMA ANINI DA TAŞIDIĞINI KABUL ET":"CÜMLEYİ KAYDET";btn.onclick=close}}
  } else if(s.type==="responseLoop"){
    let steps=s.steps||[],p=0;card.innerHTML=head(s.title||"Karşılık")+`<div id="rlText" class="dualView">DÜŞÜNCEYİ KENDİNE SAKLA</div><button class="primary" id="rlNext">DEVAM</button><div class="progress"><i></i></div>`;const t=card.querySelector("#rlText"),btn=card.querySelector("#rlNext"),bar=card.querySelector(".progress i");btn.onclick=()=>{t.textContent=steps[p];p++;bar.style.width=100*p/steps.length+"%";if(p>=steps.length){btn.textContent="DÖNGÜYÜ BÜYÜTME";btn.onclick=close}}
  } else if(s.type==="paragraphDive"){
    let lines=s.lines||[],p=0;card.innerHTML=head(s.title||"Paragraf","Bu kez devam kendiliğinden gelmiyor; aşağı inmeyi sen seçiyorsun.")+`<div id="pdList"></div><div class="stepBtns"><button id="pdStop">BURADA DUR</button><button id="pdRead">DEVAMINI ARA</button></div>`;const list=card.querySelector("#pdList"),read=card.querySelector("#pdRead"),stop=card.querySelector("#pdStop");const add=()=>{list.insertAdjacentHTML("beforeend",`<div class="fact on">${lines[p++]}</div>`);if(p>=lines.length){read.textContent="KATMANI GÖRDÜN";read.onclick=close}};read.onclick=add;stop.onclick=()=>{if(p>=1)close();else Game.toast("En az ilk satırı görmeden nerede durduğunu bilmiyorsun.")};add()
  } else if(s.type==="convergence"){
    let acts=s.actions||[],p=0;card.innerHTML=head(s.title||"Daralan ihtimaller","Burada başarısız hamle yok. Her müdahale işe yarıyor; sonuç için yeni bir dal açılmıyor.")+`<div id="cvList"></div><button class="primary" id="cvAct">İLK KAPIYI AÇ</button><div class="progress"><i></i></div><div class="fact" id="cvEnd"></div>`;const list=card.querySelector("#cvList"),btn=card.querySelector("#cvAct"),bar=card.querySelector(".progress i"),end=card.querySelector("#cvEnd");btn.onclick=()=>{list.insertAdjacentHTML("beforeend",`<div class="fact on">✓ ${acts[p]}</div>`);p++;bar.style.width=100*p/acts.length+"%";if(p>=acts.length){end.textContent=s.end||"Yollar aynı sonuca daralıyor.";btn.textContent="ELİNİ BIRAKMA";btn.onclick=close}else btn.textContent="BİR SONRAKİ İHTİMALİ İT"}
  } else if(s.type==="readerLayer"){
    let q=s.questions||[],p=0;card.innerHTML=head(s.title||"Okuyan","Okuyabilirsin; yazarı olduğun anlamına gelmez.")+`<div class="fact bad">${s.lockedLine||""}</div><div class="stepBtns"><button id="rlEdit">SATIRI DEĞİŞTİR</button><button id="rlRead2">YUKARI OKU</button></div><div id="readerList"></div>`;const edit=card.querySelector("#rlEdit"),read=card.querySelector("#rlRead2"),list=card.querySelector("#readerList");edit.onclick=()=>Game.toast("Sözcük kıpırdamıyor. Bu katmanda okuma var; yazma yok.");read.onclick=()=>{list.insertAdjacentHTML("beforeend",`<div class="fact on">${q[p++]}</div>`);if(p>=q.length){read.textContent="SON SAYFAYI KAPAT";read.onclick=close}}

  } else {
    card.innerHTML=head("Bu bölümün kırılma anını tamamla.")+`<button class="primary" id="ok">DEVAM</button>`;card.querySelector("#ok").onclick=close
  }
 }
};

const SAVE_KEY='telkin_v2_9_5_all_chapters_save';
const LEGACY_SAVE_KEYS=['telkin_v2_9_4_all_chapters_save','telkin_v2_9_3_all_chapters_save','telkin_v2_9_2_all_chapters_save','telkin_v2_9_1_all_chapters_save','telkin_v2_9_0_all_chapters_save','telkin_v2_8_1_all_chapters_save','telkin_v2_8_0_all_chapters_save','telkin_v2_7_0_all_chapters_save','telkin_v2_6_0_all_chapters_save','telkin_v2_5_0_all_chapters_save','telkin_v2_3_0_all_chapters_save','telkin_v2_2_2_all_chapters_save','telkin_v2_2_1_all_chapters_save','telkin_v2_2_0_all_chapters_save'];
const SAVE_SCHEMA_VERSION=18;
const TELKIN_OFFLINE_PRODUCTION=true;
const TELKIN_EXTERNAL_NETWORK_DISABLED=true;

let lastSaveErrorAt=0;
let story={homeTrace:false,minaTrace:false,caveTrace:false,nihyelUnlocked:false,riftSeen:false};

// v6.17: gündelik çevre durumu artık kayıt dosyasının parçasıdır.
// Durumlar bölüm + mekân anahtarında tutulur; böylece başka bir bölümde aynı mekâna
// dönüldüğünde eski sahne düzeni yeni anlatı anına istemeden sızmaz.
const ENVIRONMENT_STATE_VERSION=1;
let environmentState={version:ENVIRONMENT_STATE_VERSION,hub:{rearDoorOpen:false},scenes:{}};
function normalizeEnvironmentState(raw){
 const out={version:ENVIRONMENT_STATE_VERSION,hub:{rearDoorOpen:false},scenes:{}};
 if(!raw||typeof raw!=='object')return out;
 out.hub.rearDoorOpen=!!raw.hub?.rearDoorOpen;
 const scenes=raw.scenes&&typeof raw.scenes==='object'?raw.scenes:{};
 for(const [key,val] of Object.entries(scenes)){
   if(!val||typeof val!=='object')continue;
   const clean={};for(const [id,on] of Object.entries(val))if(typeof on==='boolean')clean[String(id).slice(0,48)]=on;
   if(Object.keys(clean).length)out.scenes[String(key).slice(0,96)]=clean;
 }
 return out;
}
function environmentSceneKey(loc=activeAtlas,chapter=activeChapter){
 const n=Number.isFinite(Number(chapter))?Math.max(1,Math.min(144,Math.floor(Number(chapter)))):1;
 return `${n}:${String(loc||'unknown')}`;
}
function sceneEnvironmentState(loc=activeAtlas,create=false){
 if(!loc)return null;const key=environmentSceneKey(loc),all=environmentState.scenes||(environmentState.scenes={});
 if(!all[key]&&create)all[key]={};return all[key]||null;
}
function rememberAmbientContextState(it){
 if(!it||!activeAtlas||atlasBrowseMode)return;
 const scene=sceneEnvironmentState(activeAtlas,true);scene[it.id]=Number(it.target)>.5;
}
function applyAmbientLightState(it){
 if(!it||it.type!=='light'||!it.lightBase)return;const f=(Number(it.target)>.5)?.20:1;
 if(WORLD_LIGHTS[10]&&it.lightBase.a.length)WORLD_LIGHTS[10].color=it.lightBase.a.map(v=>v*f);
 if(WORLD_LIGHTS[11]&&it.lightBase.b.length)WORLD_LIGHTS[11].color=it.lightBase.b.map(v=>v*f);
 uploadLights();
}
function restoreAmbientContextState(loc=activeAtlas){
 if(!loc||atlasBrowseMode)return;const scene=sceneEnvironmentState(loc,false);if(!scene)return;
 for(const it of ambientContextInteractions){if(Object.prototype.hasOwnProperty.call(scene,it.id)){const v=scene[it.id]?1:0;it.target=v;it.q=v;}}
 // q doğrudan hedefe eşitlendiği için ilk render karesinde kapak/çekmece/perde doğru pozdadır.
 updateAmbientContextInteractions(0);for(const it of ambientContextInteractions)if(it.type==='light')applyAmbientLightState(it);
}

let nihyelActive=false,dokuMix=0,lastAutoSave=0,saveTimer=null;
let isChaptersOpen=false,isLocationsOpen=false,activeAtlas=null,activeChapter=1,chapterSeqIndex=0,activeVolume=1,atlasReturn=null,atlasBrowseMode=false,activeLocationType='all',locationQuery='';
let furthestChapter=1; // canonical resume point: manual replay can never push the saved story backwards
let chapterMenuSelection=1,inspectionMode=false; // v3.8.2: atlas seçimi aktif oyunu değiştirmez; inceleme kayıt dışıdır
let chapterTarget=null,dialogueQueue=[],dialogueAfter=null,lastTaskGuideText='',dialogueTotal=0,dialogueShown=0,interactionBusy=false,interactionRAF=0,chapterMechanicBriefed=false;
let chapterActionVisual={active:false,kind:'',stepIndex:-1,q:0,objects:[],useCueDone:false};
const arcadeUnlockedChapters=new Set();let arcadeOpen=false,arcadeRAF=0,arcadeCleanup=null,selectedArcadeType=null;
let chapterInterludeOpen=false,chapterInterludeAfter=null;
let isStoryOpen=false;
const CHAPTER_SAVE_KEY='telkin_v2_9_5_chapter_progress';
const LEGACY_CHAPTER_SAVE_KEYS=['telkin_v2_9_4_chapter_progress','telkin_v2_9_3_chapter_progress','telkin_v2_9_2_chapter_progress','telkin_v2_9_1_chapter_progress','telkin_v2_9_0_chapter_progress','telkin_v2_8_1_chapter_progress','telkin_v2_8_0_chapter_progress','telkin_v2_7_0_chapter_progress','telkin_v2_6_0_chapter_progress','telkin_v2_5_0_chapter_progress','telkin_v2_3_0_chapter_progress','telkin_v2_2_2_chapter_progress','telkin_v2_2_1_chapter_progress','telkin_v2_2_0_chapter_progress'];
let completedChapters=new Set();
try{
 // v2.8.1: bütün ilerleme anahtarlarını BİRLEŞTİR. Yeni ama geride kalmış bir kayıt,
 // eski fakat daha ileri bir kaydı artık gölgeleyemez.
 for(const k of [CHAPTER_SAVE_KEY,...LEGACY_CHAPTER_SAVE_KEYS]){
   try{const raw=localStorage.getItem(k);if(!raw)continue;const arr=JSON.parse(raw);if(!Array.isArray(arr))continue;
     for(const n of arr){const q=Number(n);if(Number.isFinite(q)&&q>=1&&q<=144)completedChapters.add(Math.floor(q));}
   }catch(_){}
 }
}catch(_){completedChapters=new Set();}
function reportSaveError(err){
 console.warn('[TELKİN] Kayıt başarısız:',err);
 const now=Date.now();if(now-lastSaveErrorAt<10000)return;lastSaveErrorAt=now;
 if(saveMark){saveMark.textContent='KAYIT HATASI';saveMark.classList.add('show');setTimeout(()=>{saveMark.classList.remove('show');saveMark.textContent='KAYDEDİLDİ';},1800);}
 if(typeof Game!=='undefined'&&Game.toast)Game.toast('Kayıt başarısız. Tarayıcı depolamasını kontrol et.',2200);
}
function saveChapterProgress(){try{localStorage.setItem(CHAPTER_SAVE_KEY,JSON.stringify([...completedChapters]));return true;}catch(e){reportSaveError(e);return false;}}
function contiguousResumeChapter(){
 let n=1;while(n<=144&&completedChapters.has(n))n++;
 return Math.min(144,n);
}
function updateFurthestChapter(n){
 n=Number(n);if(Number.isFinite(n)&&n>=1&&n<=144)furthestChapter=Math.max(furthestChapter,Math.floor(n));
 furthestChapter=Math.max(furthestChapter,contiguousResumeChapter());
 return furthestChapter;
}
function migrateSaveData(d){
 if(!d||typeof d!=='object')return null;
 const out={...d};
 const v=Number.isFinite(Number(out.version))?Number(out.version):1;
 if(v<8){
  if(!Array.isArray(out.completedChapters))out.completedChapters=[];
  if(typeof out.chapterMechanicDone!=='boolean')out.chapterMechanicDone=false;
  if(typeof out.chapterCompleteShown!=='boolean')out.chapterCompleteShown=false;
  if(typeof out.atlasBrowseMode!=='boolean')out.atlasBrowseMode=false;
 }
 if(v<9&&typeof out.chapterMechanicBriefed!=='boolean')out.chapterMechanicBriefed=false;
 if(v<13||!Number.isFinite(Number(out.furthestChapter)))out.furthestChapter=Number.isFinite(Number(out.activeChapter))?Number(out.activeChapter):1;
 // v11: ambient sahne aktörleri runtime durumudur; kayda taşınmaz, güvenli biçimde sahneden yeniden üretilir.
 if(v<11)out.ambientSceneVersion=1;
 // v18 / oyun v6.17: çevre etkileşimleri güvenli, küçük bir boolean haritasına taşınır.
 out.environmentState=normalizeEnvironmentState(out.environmentState);
 out.version=SAVE_SCHEMA_VERSION;
 return out;
}
const CHAPTER_GAMEPLAY=window.TELKIN_GAMEPLAY_DATA;
// v2.9.6: DERİN SAHNE KATMANI. Orijinal replikler korunur; yalnız zenginleştirilmiş sahneler burada tutulur.
// Biçim: DEEP_SCENES[bölümNo][adımİndeksi]=[[KONUŞMACI,'metin'],...]. Bölüm eklemek için yalnız bu nesneyi genişlet.
const DEEP_SCENES={"8":{"0":[["ANLATICI","Sabah. Fırın Sokağı'nın ucunda sıcak simit kokusu var; kırtasiyeye yirmi adım kalmış."],["MİNA","Simit alabilir miyiz?"],["MAHİR","Önce kırtasiye. Sonra simit."],["MİNA","Sen her şeye sıra koyuyorsun."]],"1":[["ANLATICI","Mahir'in kulağında bir şey tıkırdar. Sokağın sesi bir an eksik kalır."],["ANLATICI","Yaya ışığı yeşile döner. Panelvan, çukur, motosiklet ve Mina’nın ikinci adımı tek noktaya daralır."],["ANLATICI","Dört şey aynı saniyeye sığıyor. Hiçbiri tek başına tehlikeli değil."]],"2":[["ANLATICI","Mahir ağzını açmadan önce cümleyi kendi içinde duyar."],["MAHİR","Olmadı."]],"3":[["ANLATICI","Zaman durmaz. Küçük bir neden zinciri kayar. Mina kurtulur; motosiklet yaşlı adama çarpar."],["ANLATICI","Kimse bağırmaz. Kaldırımda biri simidini düşürür."]],"4":[["ANLATICI","Mina'nın dizinde iz yok. Telefonu cebinde, ekranı sapasağlam."],["MİNA","Bana çarptı. Dizime. Sonra telefonum kırıldı."]],"5":[["MAHİR","Çarpmadı."],["MAHİR","Dizine bak."],["MİNA","Bakıyorum."]],"6":[["MİNA","Dizim hâlâ sızlıyor gibi."],["MİNA","Biliyorum. Ama hatırladım."],["ANLATICI","Hatıra yalan söylemiyor gibi geliyor Mahir'e; yalnızca yanlış zamandan konuşuyor."]],"7":[["ANLATICI","Karşı köşede koyu montlu adam yalnız Mahir’e bakar."],["ANLATICI","Adam Mina'ya hiç bakmaz."]]}};
(function applyDeepScenes(){
  Object.keys(DEEP_SCENES).forEach(n=>{
    const prof=CHAPTER_GAMEPLAY[n];if(!prof||!Array.isArray(prof.steps)){console.warn('[TELKİN] Derin sahne: bölüm bulunamadı',n);return;}
    Object.keys(DEEP_SCENES[n]).forEach(i=>{
      const st=prof.steps[+i],nl=DEEP_SCENES[n][i];
      if(!st||!Array.isArray(nl)||!nl.length){console.warn('[TELKİN] Derin sahne: geçersiz adım',n,i);return;}
      const lost=(st.lines||[]).filter(o=>!nl.some(x=>x[0]===o[0]&&x[1]===o[1]));
      if(lost.length)console.warn('[TELKİN] Derin sahne orijinal replik(ler)i içermiyor',n,i,lost);
      st.lines=nl;
    });
  });
})();
const MECHANIC_BRIEF={"sequence":"Olayları doğru sıraya koy; nedensel zinciri bozmadan ilerle.","timeline":"İki kaydı aynı ana getir ve zaman çelişkisini yakala.","latency":"Hareket ile görüntü arasındaki gecikmeyi adım adım ölç.","compare":"Çelişen açıklamalar arasından kanıtla uyumlu olanı seç.","hazard":"Tehlikeyi sonuçtan geriye değil, neden zincirinden ileri doğru oku.","chase":"Hareket halindeki hedefi kaybetmeden güvenli mesafeyi koru.","dice":"Aynı olayın farklı kayıtlarda aynı sonucu vermediğini deneyle gör.","sort":"Gözlem, yorum ve bilinmeyeni birbirine karıştırmadan sınıflandır.","scan":"Sahneyi sistematik tara; gürültüyü kanıt sanma.","dual":"İki gerçeklik görünüşünü karşılaştır ve anlamlı farkları seç.","memory":"Hatırayı kronolojiye yerleştir; boşlukları uydurarak doldurma.","map":"Dağınık işaretleri uzamsal bir örüntüye dönüştür.","resist":"Telkin baskısına karşı süre boyunca kontrolü koru.","hold":"Müdahale etmeden beklemenin de bir eylem olduğunu deneyimle.","route":"Birden fazla olasılık arasından etik ve nedensel rotayı kur.","meter":"Ortak dikkat/olasılık basıncını dengede tut.","evidence":"Anlatı ile kanıtı ayır; yalnız bağımsız izleri kabul et.","broadcast":"Tek bir müdahaleyi çok sayıda insana yaymanın sonucunu yönet.","routing":"İki kutuplu seçimin dışında üçüncü bir yol kur.","causality":"Gözlem ile nedensel yorumu birbirinden ayır.","dreamlog":"Rüya kaydında görülen ile yorumlananı ayrı tut.","recordPair":"İki çelişkili kaydı silmeden birlikte değerlendir.","hypothesis":"Hipotezi kanıt gibi kullanma; gözlem/yorum sınırını koru.","method":"Doğru sonuca yanlış yöntemle gitme; yöntemin etiğini değerlendir.","sourceGrid":"Kaynak, yorum, gelenek ve dil katmanlarını ayır.","semantic":"Bir kelimenin tek bir anlama zorlanmadığını test et.","spatial":"Mekân ölçülerini kayıtlarla karşılaştır ve tutarsızlığı bul.","filter":"Söylenti, gözlem ve kimlik anlatılarını filtrele.","continuity":"Aynı kişinin farklı sürekliliklerdeki izlerini bağla.","consent":"Gücü kullanmadan önce seçim hakkını ve rızayı koru.","responsibility":"Sahip olmak ile sorumluluk almak arasındaki farkı seç.","anchor":"Soyut krizi gündelik ve değişmeyen bir ana bağla.","splitReality":"Birden fazla gerçeklik dalını zorlamadan birlikte izle.","searchScene":"Sahnedeki gerçek izleri dekor/gürültüden ayır.","recordEthics":"Kayıt ile ahlaki yorum arasındaki sınırı koru.","causalWeb":"Tek sebep aramak yerine çoklu neden ağını kur.","actionSequence":"Fiziksel müdahaleyi güvenli ve doğru sırayla yap.","ledger":"Kayıttaki sayısal değişimin gerçek hayattaki karşılığını hesapla.","priority":"Merak ile gerçek insan güvenliği arasında öncelik seç.","track":"İzi takip et ama yorumu gözlem yerine koyma.","nameLedger":"İsim, kayıt, hafıza ve pay arasındaki bağlantıyı ayır.","survival":"Kaynak ve risk yönetimiyle güvenli biçimde zamanı geçir.","choiceVsRecord":"Önceden bilinen kayda teslim olmadan yeni kararı ver.","timeCompare":"Aynı olayın farklı kişilerdeki sürelerini karşılaştır.","boundary":"Algı sınırını fiziksel testlerle haritala.","naturalOrMade":"Doğal izi bilinçli işaret sanmadan sınıflandır.","gapTimeline":"Kayıtta görünen ama hafızada olmayan zaman boşluğunu incele.","selectionField":"Kayıtların neden bazı anları belirginleştirdiğini sorgula.","leaveClosed":"Merak uğruna kapalı kalması gereken kaydı açma.","audioLayers":"Tek ses dosyasındaki bağımsız katmanları ayrıştır.","blindTest":"Belirginlik ile önem arasındaki varsayımı kör testle sınama.","anticipation":"Önceden bilme hissini gerçek kayıt farkıyla karşılaştır.","observerAngle":"Aynı sahneyi farklı açılardan inceleyip kaynağı ara.","predictionChoice":"Tahmini bilerek yine de bağımsız bir seçim yap.","manualRescue":"Olasılık gücü yerine fiziksel ve ortak eylemle kurtarma yap.","outsideSubject":"Kaydın dışındaki özne ihtimalini mantıksal olarak test et.","absentObject":"Kayıtta görünen ama fiziksel olarak hiç olmayan nesnenin etkisini izle.","sentenceLayer":"Cümlenin yalnız içeriğini değil, metin içindeki konumunu incele.","responseLoop":"Metne cevap verme dürtüsü ile metni okuma eylemini ayır.","paragraphDive":"Paragrafın satırları arasında okurun davranışını takip et.","convergence":"Farklı müdahalelerin aynı sonuca daraldığı noktayı gör.","readerLayer":"Karakter, kayıt, metin ve okur katmanlarını son kez ayır."};
const CHAPTER_INDEX=new Map(TELKIN_CHAPTERS.map((c,i)=>[c.n,i]));
function chapterByNo(n){
 const num=Number(n);
 if(Number.isFinite(num)&&CHAPTER_INDEX.has(num))return TELKIN_CHAPTERS[CHAPTER_INDEX.get(num)];
 const safeNum=Number.isFinite(num)?Math.round(num):1;
 const idx=Math.max(0,Math.min(TELKIN_CHAPTERS.length-1,safeNum-1));
 return TELKIN_CHAPTERS[idx]||TELKIN_CHAPTERS[0];
}
function validateNarrativeContent(){
 const used=new Set(),issues=[];TELKIN_CHAPTERS.forEach((c,i)=>{if(c.n!==i+1)issues.push(`Bölüm sıra uyuşmazlığı: index ${i} -> n=${c.n}`);(c.route&&c.route.length?c.route:[c.loc]).filter(Boolean).forEach(l=>used.add(l));});
 used.forEach(l=>{if(!LOC_INFO[l])issues.push(`Tanımsız mekân: ${l}`)});Object.keys(LOC_INFO).forEach(l=>{if(!used.has(l))console.info('[TELKİN] Atlas-only / kullanılmayan rota mekânı:',l)});
 if(issues.length)console.warn('[TELKİN] İçerik doğrulama:',issues);else console.info(`[TELKİN] İçerik doğrulandı: ${TELKIN_CHAPTERS.length} bölüm, ${used.size} kullanılan mekân.`);return issues;
}
function deriveStepGoal(speaker,line){
 const s=(speaker||'').toUpperCase(),t=(line||'').toLocaleLowerCase('tr-TR');
 if(t.includes('kamera')||t.includes('görüntü'))return 'Kamera kaydını incele';
 if(t.includes('ses kayd')||t.includes('kayıt')||t.includes('dosya'))return 'Kaydı incele';
 if(t.includes('kapı')||t.includes('kilit'))return 'Kapı ve kilidi kontrol et';
 if(t.includes('telefon'))return 'Telefonu kontrol et';
 if(t.includes('elini')||t.includes('kolunu'))return 'Bedensel tepkiyi test et';
 if(s&&s!=='ANLATICI'&&s!=='MAHİR'&&s!=='MAHİR’İN SESİ'&&s!=='SES')return `${s} ile konuş`;
 return 'Mavi işaretli noktayı incele';
}
function chapterSequence(c){
 const p=CHAPTER_GAMEPLAY[String(c.n)];
 if(p&&Array.isArray(p.steps))return p.steps.map((s,i)=>Object.assign({},s,{stepIndex:i}));
 return [];
}
function chapterSystem(c){return CHAPTER_GAMEPLAY[String(c.n)]||{system:(c.mech&&c.mech.type)||'none',systemTitle:(c.mech&&c.mech.title)||'Bölüm akışı',systemBrief:'Bölüm içindeki görevleri tamamla.'};}
function stepHint(st){return ((st&&st.hint)||'Görev işaretine git ve ETKİLEŞ’e dokun.').replace(/mavi/gi,'renkli');}


const VOLUME_EXPERIENCE={
 1:{name:'CİLT I · DENEY',motto:'Önce gözle. Sonra ölç. Açıklamayı en sona bırak.'},
 2:{name:'CİLT II · MODEL',motto:'Bir açıklamanın çalışması, onun doğru olduğu anlamına gelmez.'},
 3:{name:'CİLT III · KAYIT',motto:'Geçmişi kanıttan ayır; boşluğu hikâyeyle doldurma.'},
 4:{name:'CİLT IV · SINIR',motto:'Erişebildiğin şey ile değiştirebildiğin şey aynı değildir.'}
};
const EXPERIENCE_STYLE={
 order:{label:'NEDENSEL SIRA',css:'#79dcff',rgb:[.35,.90,1,1],pace:'ÖLÇÜLÜ',phases:['KUR','SIRALA','DOĞRULA']},
 time:{label:'ZAMAN ÇELİŞKİSİ',css:'#ffd27a',rgb:[1,.72,.25,1],pace:'KESİK',phases:['EŞLE','SAPMAYI BUL','DOĞRULA']},
 camera:{label:'GÖRÜNTÜ / KAYIT',css:'#71e8ff',rgb:[.20,.90,1,1],pace:'ANALİTİK',phases:['KADRAJ','GECİKME','KARŞILAŞTIR']},
 evidence:{label:'KANIT AYRIMI',css:'#9be58f',rgb:[.40,.92,.45,1],pace:'ANALİTİK',phases:['TOPLA','AYIR','SINAMA']},
 hazard:{label:'TEHLİKE',css:'#ff916f',rgb:[1,.34,.20,1],pace:'GERGİN',phases:['RİSKİ GÖR','KAÇIN','SONUÇ']},
 action:{label:'EYLEM',css:'#ffb05d',rgb:[1,.56,.20,1],pace:'HIZLI',phases:['HAZIRLAN','UYGULA','ÇIKIŞ']},
 survival:{label:'HAYATTA KALMA',css:'#efc56d',rgb:[.95,.66,.22,1],pace:'GERGİN',phases:['RİSK','KAYNAK','DAYAN']},
 chance:{label:'OLASILIK',css:'#b39cff',rgb:[.62,.45,1,1],pace:'DEĞİŞKEN',phases:['DENE','SAPMAYI GÖR','TEKRARLA']},
 choice:{label:'SEÇİM',css:'#d4a2ff',rgb:[.72,.45,1,1],pace:'DÜŞÜNSEL',phases:['SEÇENEK','SINIR','KARAR']},
 ethics:{label:'ETİK SINIR',css:'#f0a5d9',rgb:[.90,.42,.72,1],pace:'YAVAŞ',phases:['DUR','RIZA','SORUMLULUK']},
 memory:{label:'HAFIZA',css:'#c6b6ff',rgb:[.65,.56,1,1],pace:'YAVAŞ',phases:['HATIRLA','BOŞLUĞU GÖR','YERLEŞTİR']},
 document:{label:'METİN / DOSYA',css:'#e5dfc8',rgb:[.86,.82,.66,1],pace:'YAVAŞ',phases:['OKU','KAYNAĞI AYIR','KARŞILAŞTIR']},
 record:{label:'KAYIT',css:'#c8e6ff',rgb:[.62,.82,1,1],pace:'ÖLÇÜLÜ',phases:['KAYDI AÇ','EŞLE','SAKLA']},
 map:{label:'HARİTA',css:'#8ee6bd',rgb:[.32,.88,.62,1],pace:'KEŞİF',phases:['İŞARET','BAĞLA','ROTAYI KUR']},
 route:{label:'ROTA',css:'#8bd8ff',rgb:[.28,.74,1,1],pace:'KEŞİF',phases:['YÖNEL','İZLE','VAR']},
 search:{label:'SAHNE TARAMASI',css:'#89f0d2',rgb:[.30,.92,.72,1],pace:'ARAŞTIRMA',phases:['TARA','GÜRÜLTÜYÜ ELE','BUL']},
 meter:{label:'DENGE',css:'#83e7a9',rgb:[.28,.90,.50,1],pace:'DENGELİ',phases:['ÖLÇ','DENGELE','TUT']},
 body:{label:'BEDEN / İRADE',css:'#ffad9d',rgb:[1,.48,.40,1],pace:'BEDENSEL',phases:['HAZIRLAN','DİREN','GERİ AL']},
 audio:{label:'SES KATMANI',css:'#91c7ff',rgb:[.40,.68,1,1],pace:'DİNLEME',phases:['DİNLE','AYIR','EŞLE']},
 broadcast:{label:'ORTAK ETKİ',css:'#ffcc87',rgb:[1,.66,.30,1],pace:'YOĞUN',phases:['YAYILIM','TEPKİ','SINIR']},
 reality:{label:'GERÇEKLİK',css:'#c4a2ff',rgb:[.67,.48,1,1],pace:'KIRILGAN',phases:['GÖRÜNÜŞ','ÇATIŞMA','DEĞİŞMEYEN']},
 text:{label:'METİN KATMANI',css:'#f3f0e8',rgb:[.90,.90,.84,1],pace:'META',phases:['SATIR','CÜMLE','OKUYAN']}
};
const STEP_ACTION_PROFILE={
 talk:{label:'KONUŞ',doing:'DİNLENİYOR',ms:180},
 door:{label:'KONTROL ET',doing:'KİLİT / EŞİK KONTROL EDİLİYOR',ms:620},
 phone:{label:'ARAMAYI AÇ',doing:'HAT BAĞLANIYOR',ms:650},
 audio:{label:'DİNLE',doing:'SES KATMANI DİNLENİYOR',ms:1050},
 camera:{label:'KAYDI İNCELE',doing:'KARELER KARŞILAŞTIRILIYOR',ms:920},
 document:{label:'OKU',doing:'KAYIT OKUNUYOR',ms:820},
 body:{label:'TEST ET',doing:'BEDENSEL TEPKİ SINANIYOR',ms:900},
 hazard:{label:'RİSKİ KONTROL ET',doing:'TEHLİKE HATTI TARAMIYOR',ms:580},
 memory:{label:'HATIRLA',doing:'HAFIZA İZİ YERLEŞTİRİLİYOR',ms:980},
 anomaly:{label:'ODAKLAN',doing:'ANOMALİ SINIRI İZLENİYOR',ms:1120},
 observe:{label:'GÖZLE',doing:'GÖZLEM SABİTLENİYOR',ms:700},
 inspect:{label:'İNCELE',doing:'AYRINTI İNCELENİYOR',ms:760},
 route:{label:'ROTAYI DOĞRULA',doing:'ROTA DOĞRULANIYOR',ms:430}
};
const KIND_FLOW_LABEL={talk:'KONUŞMA',door:'EŞİK',phone:'TELEFON',audio:'SES',camera:'KAMERA',document:'KAYIT',body:'BEDEN',hazard:'RİSK',memory:'HAFIZA',anomaly:'ANOMALİ',observe:'GÖZLEM',inspect:'İNCELEME',route:'ROTA'};
function actionProfile(st){return STEP_ACTION_PROFILE[(st&&st.kind)||'inspect']||STEP_ACTION_PROFILE.inspect;}
function chapterExperience(c){
 const sys=chapterSystem(c),sty=EXPERIENCE_STYLE[sys.systemClass]||EXPERIENCE_STYLE.order,seq=chapterSequence(c),flow=[];
 for(const st of seq){const k=KIND_FLOW_LABEL[st.kind]||'İNCELEME';if(flow[flow.length-1]!==k)flow.push(k);}
 const compact=flow.slice(0,6).join(' → ')+(flow.length>6?' → …':'');
 const vol=VOLUME_EXPERIENCE[c.vol]||VOLUME_EXPERIENCE[1];
 return {style:sty,volume:vol,flow:compact||sty.label,signature:`${String(c.n).padStart(3,'0')} · ${sty.label}`,pace:sty.pace};
}
function chapterPhase(c,index,total){
 const e=chapterExperience(c),p=e.style.phases||['BAŞLA','SINAMA','SONUÇ'];if(total<=1)return p[1];const r=index/Math.max(1,total-1);return p[r<.34?0:r<.72?1:2];
}
function applyChapterExperience(c){
 const e=chapterExperience(c),root=document.documentElement;root.style.setProperty('--chapter-accent',e.style.css);root.style.setProperty('--chapter-accent-soft',e.style.css+'2c');
 if(chapterIdentity){chapterIdentityMode.textContent=`${e.volume.name} · ${e.pace}`;chapterIdentityTitle.textContent=`${e.signature} · ${chapterSystem(c).systemTitle}`;chapterIdentityFlow.textContent=`AKIŞ: ${e.flow}`;chapterIdentity.classList.add('show');}
}
function clearChapterExperience(){if(chapterIdentity)chapterIdentity.classList.remove('show');document.documentElement.style.setProperty('--chapter-accent','#79dcff');}
// v6.14: Görev etkileşimi yalnız ilerleme çubuğu değildir. Aktif fiziksel prop,
// eylem türüne göre hareket eder; görev bittiğinde sonraki sahne kurulacağı için nesne de doğal olarak yenilenir.
function gameplayPropPrefix(stepIndex=chapterSeqIndex){return 'gp'+stepIndex+'_';}
function captureGameplayPropObjects(stepIndex=chapterSeqIndex){
 const prefix=gameplayPropPrefix(stepIndex),out=[];
 for(const o of atlasObjs){if(!(o.name||'').startsWith(prefix))continue;out.push({o,role:(o.name||'').slice(prefix.length),base:{x:o.x,y:o.y,z:o.z,sx:o.sx,sy:o.sy,sz:o.sz,ry:o.ry,em:o.em}});}
 return out;
}
function resetGameplayPropVisual(){
 for(const it of chapterActionVisual.objects||[]){const o=it.o,b=it.base;if(!o||!b)continue;o.x=b.x;o.y=b.y;o.z=b.z;o.sx=b.sx;o.sy=b.sy;o.sz=b.sz;o.ry=b.ry;o.em=b.em;}
 chapterActionVisual={active:false,kind:'',stepIndex:-1,q:0,objects:[],useCueDone:false};
}
function playGameplayInteractionSfx(kind){
 if(!window.TELKIN_AUDIO)return;const id=kind==='door'?'door_lock':kind==='phone'?'phone':kind==='camera'?'camera_glitch':kind==='document'?'document':kind==='anomaly'?'anomaly':'ui_confirm';
 window.TELKIN_AUDIO.playSfx(id,{gain:kind==='anomaly'?.52:.66});
}
function gameplayUseCueThreshold(kind){
 return kind==='camera'?.56:kind==='document'?.49:kind==='memory'?.47:kind==='phone'?.40:kind==='audio'?.36:2;
}
function fireGameplayUseCue(v,q){
 if(!v||v.useCueDone||q<gameplayUseCueThreshold(v.kind)||!window.TELKIN_AUDIO)return;
 const id=v.kind==='camera'?'camera_shutter':v.kind==='audio'?'recorder_rec':v.kind==='phone'?'phone_connect':v.kind==='document'?'page_flip':v.kind==='memory'?'photo_flip':'';
 if(!id)return;v.useCueDone=true;window.TELKIN_AUDIO.playSfx(id,{gain:v.kind==='camera'?.72:.56});
}
function startGameplayPropInteraction(st,stepIndex){
 resetGameplayPropVisual();
 const kind=(st&&st.kind)||'inspect',objects=captureGameplayPropObjects(stepIndex);
 chapterActionVisual={active:true,kind,stepIndex,q:0,objects,useCueDone:false};
 playGameplayInteractionSfx(kind);
 // Mahir eylem sırasında nesneye döner; kamera oyuncunun baktığı yönden kopmaz.
 if(chapterTarget){const dx=chapterTarget.x-px,dz=chapterTarget.z-pz;if(Math.hypot(dx,dz)>.01){mahirTargetYaw=Math.atan2(dx,dz);yaw+=shortestAngle(yaw,mahirTargetYaw)*.34;}}
}
function updateGameplayPropInteraction(){
 const v=chapterActionVisual;if(!v.active)return;const q=Math.max(0,Math.min(1,v.q||0));fireGameplayUseCue(v,q);if(!v.objects.length)return;const e=q*q*(3-2*q),pulse=.5+.5*Math.sin(q*Math.PI*6);
 for(const it of v.objects){const o=it.o,b=it.base,r=it.role||'';if(!o||!b)continue;
   // Her kareyi taban konumundan hesaplamak drift oluşmasını engeller.
   o.x=b.x;o.y=b.y;o.z=b.z;o.sx=b.sx;o.sy=b.sy;o.sz=b.sz;o.ry=b.ry;o.em=b.em;
   if(v.kind==='door'){
     const a=-1.18*e;
     if(/Door$/i.test(r)){const hw=b.sx*.5,hx=b.x-hw,hz=b.z;o.x=hx+Math.cos(a)*hw;o.z=hz-Math.sin(a)*hw;o.ry=b.ry+a;}
     else if(/Lock$/i.test(r)){const door=v.objects.find(x=>/Door$/i.test(x.role));if(door){const db=door.base,hw=db.sx*.5,hx=db.x-hw,hz=db.z,local=b.x-hx;o.x=hx+Math.cos(a)*local;o.z=hz-Math.sin(a)*local;o.ry=b.ry+a;}o.em=Math.max(b.em,.42+.38*pulse);}
   }else if(v.kind==='phone'){
     const lift=.16*e;
     if(/Phone$/i.test(r)||/PhoneGlow$/i.test(r)){o.y=b.y+lift;o.z=b.z+.10*e;o.ry=b.ry+.16*e;if(/Glow$/i.test(r))o.em=Math.max(b.em,.52+.42*pulse);}
   }else if(v.kind==='camera'){
     if(/Screen$/i.test(r)){o.y=b.y+.045*e;o.z=b.z+.035*e;o.ry=b.ry+.025*Math.sin(q*Math.PI*2);}
     if(/ScreenGlow$/i.test(r)){o.em=Math.max(b.em,.62+.34*pulse);o.sx=b.sx*(1+.018*pulse);o.sy=b.sy*(1+.025*pulse);}
   }else if(v.kind==='audio'){
     if(/Recorder$/i.test(r)){o.y=b.y-.018*Math.sin(Math.min(1,q*1.8)*Math.PI);o.z=b.z+.035*e;}
     if(/Led$/i.test(r))o.em=Math.max(b.em,.38+.58*(q>.18?pulse:0));
   }else if(v.kind==='document'){
     const m=r.match(/Paper(\d+)/i);if(m){const i=Number(m[1])||0,spread=(i-1)*.16*e;o.x=b.x+spread;o.y=b.y+.025*e+.018*i*e;o.z=b.z-.025*Math.abs(i-1)*e;o.ry=b.ry+(i-1)*.22*e;o.em=Math.max(b.em,.08+.16*pulse);}
   }else if(v.kind==='route'){
     const m=r.match(/Path(\d+)/i);if(m){const i=Number(m[1])||1,local=Math.max(0,Math.min(1,q*3-(i-1)));o.y=b.y+.035*Math.sin(local*Math.PI);o.em=Math.max(b.em,.18+.66*local);}
     if(/Arch$/i.test(r))o.em=Math.max(b.em,.30+.42*pulse);
   }else if(v.kind==='memory'){
     if(/Photo$/i.test(r)){o.y=b.y+.06*e;o.z=b.z-.045*e;o.ry=b.ry+.05*Math.sin(q*Math.PI);o.em=Math.max(b.em,.28+.30*pulse);}
     if(/Frame$/i.test(r))o.em=Math.max(b.em,.12+.15*pulse);
   }else if(v.kind==='body'){
     if(/Pole[LR]$/i.test(r)){o.sy=b.sy*(1+.035*pulse);o.y=b.y+.02*pulse;o.em=Math.max(b.em,.24+.32*pulse);}
     if(/Mat$/i.test(r)){o.sx=b.sx*(1+.025*e);o.sz=b.sz*(1+.025*e);o.em=Math.max(b.em,.10+.20*pulse);}
   }else if(v.kind==='hazard'){
     if(/Beacon$/i.test(r)){o.y=b.y+.05*pulse;o.ry=b.ry+q*Math.PI*2;o.em=Math.max(b.em,.55+.42*pulse);}
     if(/Barrier$/i.test(r))o.z=b.z+.018*Math.sin(q*Math.PI*8);
   }else if(v.kind==='anomaly'){
     const m=r.match(/Crystal(-?\d+)/i);if(m){const i=Number(m[1])||0;o.y=b.y+.10*e+.035*Math.sin(q*Math.PI*4+i);o.ry=b.ry+.28*e*(i||1);o.em=Math.max(b.em,.48+.42*pulse);}
     if(/Ring$/i.test(r)){o.sx=b.sx*(1+.20*e);o.sz=b.sz*(1+.20*e);o.em=Math.max(b.em,.38+.45*pulse);}
   }else if(v.kind==='observe'){
     if(/Scanner$/i.test(r)){o.z=b.z+.04*e;o.ry=b.ry+.03*Math.sin(q*Math.PI*2);}
     if(/ScanGlow$/i.test(r)){o.em=Math.max(b.em,.56+.38*pulse);o.sy=b.sy*(1+.03*pulse);}
   }else if(v.kind==='inspect'){
     if(/Artifact$/i.test(r)){o.y=b.y+.10*e+.025*pulse;o.ry=b.ry+e*Math.PI*.72;o.em=Math.max(b.em,.32+.36*pulse);}
     if(/Pedestal$/i.test(r))o.em=Math.max(b.em,.08+.10*pulse);
   }
 }
 suppressHeldSource(v,q);
}
// ---------- v6.19: ELDE TUTULAN NESNE KATMANI ----------
// Bu katman yeni bir karakter rig'i uydurmaz. Mevcut foto-gerçek Mahir sprite'ı korunur;
// görev nesnesinin küçük fiziksel temsili, Mahir'in dünya uzayındaki el/göğüs/yüz ankrajına bağlanır.
function heldPropKindForStep(st){
 const k=String(st?.kind||'');return ['phone','audio','camera','document','memory'].includes(k)?k:'';
}
function heldPropEnvelope(q){
 q=Math.max(0,Math.min(1,Number(q)||0));
 const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
 if(q<.22)return smooth(q/.22);
 if(q>.80)return smooth((1-q)/.20);
 return 1;
}
function mahirHeldAnchor(kind){
 const pose=mahirVisualPose(),gy=groundY(px,pz),ry=mahirYaw;let lx=.18,lz=.29,y=1.16,localRy=0;
 if(kind==='phone'){lx=.27;lz=.10;y=1.43;localRy=-.18;}
 else if(kind==='camera'){lx=.12;lz=.31;y=1.34;localRy=0;}
 else if(kind==='audio'){lx=.22;lz=.25;y=1.11;localRy=-.08;}
 else if(kind==='document'){lx=.10;lz=.30;y=1.20;localRy=.03;}
 else if(kind==='memory'){lx=.08;lz=.31;y=1.23;localRy=.02;}
 const off=yawOffset(lx,lz,ry);return {x:pose.x+off[0],y:gy+y+pose.yOffset,z:pose.z+off[1],ry:ry+localRy};
}
// ---------- v6.20: AKTİF NESNE KULLANIMI ----------
function heldUseProgress(q){
 q=Math.max(0,Math.min(1,Number(q)||0));return Math.max(0,Math.min(1,(q-.27)/.48));
}
function heldUsePulse(q,center=.56,width=.055){
 const d=Math.abs((Number(q)||0)-center)/Math.max(.001,width);return Math.max(0,1-d);
}
function cinematicUseFocus(){
 const a=mahirUseAction,k=a?.propKind||'';if(!a?.active||!['phone','audio','camera','document','memory'].includes(k))return 0;
 const q=Math.max(0,Math.min(1,Number(a.q)||0)),edge=Math.max(0,Math.min(1,(q-.06)/.18))*Math.max(0,Math.min(1,(.96-q)/.18));
 return edge*edge*(3-2*edge);
}
function cinematicGameplayStep(){try{return chapterSequence(chapterByNo(activeChapter))[chapterSeqIndex]||null}catch(_){return null}}
function cinematicPhoneCounterparty(st){
 const skip=new Set(['MAHİR','MAHIR','ANLATICI','ANLATICI:','SES','MAHİR’İN SESİ','MAHİR\'İN SESİ']);
 for(const row of st?.lines||[]){const who=String(row?.[0]||'').trim();if(who&&!skip.has(who.toUpperCase()))return who;}
 return TT('cinematicUse.line','HAT');
}
function cinematicKindKicker(kind){
 const map={camera:['cinematicUse.camera','KAMERA KADRAJI'],phone:['cinematicUse.phone','ARAMA'],audio:['cinematicUse.audio','SES KAYDI'],document:['cinematicUse.document','OKUMA ODAĞI'],memory:['cinematicUse.memory','HATIRA ODAĞI']};const p=map[kind]||['cinematicUse.focus','NESNE ODAĞI'];return TT(p[0],p[1]);
}
function updateCinematicUseOverlay(){
 if(!cinematicUse)return;const a=mahirUseAction,kind=a?.propKind||'',focus=cinematicUseFocus();
 if(focus<=.018){cinematicUse.classList.remove('show');cinematicUse.setAttribute('aria-hidden','true');cinematicUse.dataset.kind='';document.body.classList.remove('cinematicUseMode');cinematicUseLastKey='';return;}
 const st=cinematicGameplayStep(),q=Math.max(0,Math.min(1,Number(a.q)||0)),connected=q>=.40;
 cinematicUse.style.setProperty('--cin-focus',focus.toFixed(3));cinematicUse.dataset.kind=kind;cinematicUse.classList.add('show');cinematicUse.setAttribute('aria-hidden','false');document.body.classList.add('cinematicUseMode');
 const who=kind==='phone'?cinematicPhoneCounterparty(st):'',key=[activeChapter,chapterSeqIndex,kind,who,st?.label||'',st?.goal||'',connected].join('|');
 if(key!==cinematicUseLastKey){cinematicUseLastKey=key;cinUseKicker.textContent=cinematicKindKicker(kind);cinUseTitle.textContent=(st?.label||cinematicKindKicker(kind)).toUpperCase();cinUseMeta.textContent=st?.goal||'';vfLabel.textContent=(st?.goal||TT('cinematicUse.framing','KADRAJ')).toUpperCase();cinPhoneName.textContent=who||TT('cinematicUse.line','HAT');cinPhoneState.textContent=connected?TT('cinematicUse.connected','BAĞLANTI AKTİF'):TT('cinematicUse.connecting','BAĞLANIYOR');cinDocKicker.textContent=TT('cinematicUse.reading','OKUMA ODAĞI');cinDocTitle.textContent=kind==='memory'?TT('cinematicUse.memoryTitle','HATIRA / FOTOĞRAF'):TT('cinematicUse.documentTitle','BELGE / KAYIT');cinDocGoal.textContent=st?.goal||st?.label||'';}
}
function cinematicCameraState(bodyPose,gy){
 const mix=cinematicUseFocus();if(mix<=.001)return {mix,camYaw:yaw,dist:camDist,targetY:1.00+gy+(bodyPose.cameraYOffset||0),cameraY:2.00+gy+pitch*1.95+(bodyPose.cameraYOffset||0),fovMul:1};
 const a=mahirUseAction,kind=a?.propKind||'',side=kind==='document'||kind==='memory'?.22:.30,targetYaw=mahirYaw+side,camYaw=yaw+shortestAngle(yaw,targetYaw)*mix;
 const closeDist=(kind==='document'||kind==='memory')?2.18:2.32,dist=camDist+(closeDist-camDist)*mix;
 const targetY=1.00+gy+(bodyPose.cameraYOffset||0)+(.20+(kind==='document'?.02:0))*mix;
 const cameraY=2.00+gy+pitch*1.95+(bodyPose.cameraYOffset||0)+(.02-pitch*.70)*mix;
 return {mix,camYaw,dist,targetY,cameraY,fovMul:1-.16*mix};
}
function drawHeldScreenBars(vp,p,ry,s,use,kind){
 const front=yawOffset(0,.032,ry),baseX=p.x+front[0],baseZ=p.z+front[1];
 if(kind==='phone'){
   // Arama ekranı: bağlantı noktası + konuşma sırasında hareket eden üç ince seviye çubuğu.
   const green=[.16,.92,.50,1],cyan=[.20,.72,1,1];
   drawPrimitive(cubeBuf,36,baseX,p.y+.073*s,baseZ,.010*s,.010*s,.006*s,0,ry,use>.18?green:cyan,vp,.90);
   for(let i=0;i<3;i++){const w=(.024+.014*(.5+.5*Math.sin(use*15+i*1.7)))*s,off=yawOffset((i-1)*.026*s,.003,ry);drawPrimitive(cubeBuf,36,baseX+off[0],p.y-.010*s+i*.018*s,baseZ+off[1],w,.005*s,.004*s,0,ry,[.82,.94,1,1],vp,.54);}
 }else if(kind==='audio'){
   // REC LED + üç kanallı VU metre. Tamamen q tabanlı: frame-rate drift üretmez.
   const led=(.45+.55*(.5+.5*Math.sin(use*Math.PI*12)));
   const lo=yawOffset(.058*s,.060*s,ry);drawPrimitive(cubeBuf,36,p.x+lo[0],p.y+.020*s,p.z+lo[1],.018*s,.018*s,.010*s,0,ry,[1,.10,.06,1],vp,.52+.44*led);
   for(let i=0;i<4;i++){const lvl=.25+.75*Math.abs(Math.sin(use*9.0+i*.83)),h=.010+.035*lvl;const o=yawOffset((i-1.5)*.028*s,.061*s,ry);drawPrimitive(cubeBuf,36,p.x+o[0],p.y-.018*s+h*.5,p.z+o[1],.012*s,h*s,.008*s,0,ry,lvl>.72?[1,.66,.14,1]:[.24,.94,.54,1],vp,.38+.35*lvl);}
 }
}
function drawMahirHeldProp(vp){
 const a=mahirUseAction,kind=a?.propKind||'';if(!a.active||!kind)return;const h=heldPropEnvelope(a.q);if(h<.015)return;
 const p=mahirHeldAnchor(kind),s=h,use=heldUseProgress(a.q);
 // Nesne elden alınırken/geri bırakılırken ölçek yumuşakça sıfırdan gelir; kullanım ayrıntıları yalnız orta fazda canlanır.
 if(kind==='phone'){
   const active=use>.08,screen=active?[.10+.05*use,.36+.26*use,.56+.14*use,1]:[.14,.48,.72,1];
   drawPrimitive(cubeBuf,36,p.x,p.y,p.z,.105*s,.195*s,.030*s,0,p.ry,[.045,.055,.070,1],vp,.10);const q=yawOffset(0,.021,p.ry);drawPrimitive(cubeBuf,36,p.x+q[0],p.y+.018*s,p.z+q[1],.078*s,.132*s,.009*s,0,p.ry,screen,vp,.48+.32*use);drawHeldScreenBars(vp,p,p.ry,s,use,'phone');
 }else if(kind==='audio'){
   drawPrimitive(cubeBuf,36,p.x,p.y,p.z,.175*s,.085*s,.105*s,0,p.ry,[.06,.075,.09,1],vp,.08);drawHeldScreenBars(vp,p,p.ry,s,use,'audio');
 }else if(kind==='camera'){
   const flash=heldUsePulse(a.q,.56,.045),aperture=1-.25*flash;
   drawPrimitive(cubeBuf,36,p.x,p.y,p.z,.205*s,.125*s,.135*s,0,p.ry,[.045,.055,.065,1],vp,.08);
   const q=yawOffset(0,.090,p.ry);drawPrimitive(cubeBuf,36,p.x+q[0],p.y,p.z+q[1],.082*s*aperture,.082*s*aperture,.050*s,0,p.ry,[.07,.09,.11,1],vp,.34+.32*flash);
   const btn=yawOffset(.070*s,.012,p.ry);drawPrimitive(cubeBuf,36,p.x+btn[0],p.y+.071*s-.008*flash,p.z+btn[1],.028*s,.012*s,.026*s,0,p.ry,[.18,.20,.22,1],vp,.10);
   if(flash>.015){const f=yawOffset(0,.155*s,p.ry);drawPrimitive(sphereBuf,sphereCount,p.x+f[0],p.y+.035*s,p.z+f[1],.105*s*flash,.105*s*flash,.055*s*flash,0,p.ry,[1,.98,.90,.92],vp,1.0);}
 }else if(kind==='document'){
   const turn=Math.max(0,Math.min(1,(a.q-.42)/.23)),pageLift=Math.sin(turn*Math.PI);
   drawPrimitive(cubeBuf,36,p.x,p.y,p.z,.31*s,.018*s,.42*s,0,p.ry,[.88,.87,.81,1],vp,.11);
   // Üst sayfa çevrilirken hafifçe kalkar ve döner; metin çizgileri sayfayla birlikte hareket eder.
   const topOff=yawOffset(.018*turn,.012,p.ry);drawPrimitive(cubeBuf,36,p.x+topOff[0],p.y+.020*s+.052*pageLift*s,p.z+topOff[1],.29*s,.008*s,.40*s,-1.90*turn,p.ry,[.94,.93,.88,1],vp,.10);
   for(let i=0;i<4;i++){const q=yawOffset(0,.018+i*.030,p.ry);drawPrimitive(cubeBuf,36,p.x+q[0],p.y+.031*s,p.z+q[1],(.19-.018*i)*s,.005*s,.010*s,0,p.ry,[.22,.25,.27,1],vp,.05);}
 }else if(kind==='memory'){
   const inspect=Math.sin(Math.min(1,use)*Math.PI),ry=p.ry+.20*inspect;
   drawPrimitive(cubeBuf,36,p.x,p.y,p.z,.36*s,.025*s,.27*s,0,ry,[.30,.24,.20,1],vp,.06);const q=yawOffset(0,.018,ry);drawPrimitive(cubeBuf,36,p.x+q[0],p.y+.010*s+.018*inspect,p.z+q[1],.30*s,.010*s,.21*s,0,ry,[.72,.70,.64,1],vp,.18+.12*inspect);
 }
}
function suppressHeldSource(v,q){
 const h=heldPropEnvelope(q);if(h<=.001)return;
 for(const it of v.objects||[]){const o=it.o,b=it.base,r=String(it.role||'');if(!o||!b)continue;let take=false;
   if(v.kind==='phone')take=/Phone(?:Glow)?$/i.test(r);
   else if(v.kind==='audio')take=/Recorder$|Led$/i.test(r);
   else if(v.kind==='camera')take=/CameraBody$|CameraLens$/i.test(r);
   else if(v.kind==='document')take=/Paper1$/i.test(r);
   else if(v.kind==='memory')take=/Photo$/i.test(r);
   if(!take)continue;const k=Math.max(.04,1-.94*h);o.sx*=k;o.sy*=k;o.sz*=k;o.em*=Math.max(.15,1-h);
 }
}
// ---------- v6.18: MAHİR BEDEN / NESNE KULLANIM KOREOGRAFİSİ ----------
function mahirUseTypeForAmbient(it){
 if(!it)return 'inspect';
 if(it.type==='chair')return 'chairPull';
 if(it.type==='drawer')return 'lowReach';
 if(it.type==='light')return 'highReach';
 if(it.type==='cabinet'||it.type==='curtain')return 'reach';
 if(it.type==='notebook')return 'inspectLow';
 if(it.type==='monitor')return 'tap';
 return 'inspect';
}
function mahirUseTypeForStep(st){
 const k=String(st?.kind||'');
 if(k==='door')return 'reach';
 if(k==='phone'||k==='audio'||k==='camera')return 'tap';
 if(k==='document'||k==='memory')return 'inspectLow';
 if(k==='observe'||k==='inspect'||k==='scan'||k==='anomaly')return 'inspect';
 if(k==='hazard')return 'reach';
 if(k==='body')return 'bodyTest';
 return '';
}
function resetMahirUseAction(){
 mahirUseAction={active:false,linked:false,type:'',propKind:'',q:0,started:0,duration:0,targetX:0,targetZ:0,anchorX:0,anchorZ:0,anchorYaw:0,midDone:false,onMid:null,onDone:null};
}
function cancelMahirPhysicalUse(clearSeat=false){
 resetMahirUseAction();
 if(clearSeat)mahirSeatState={active:false,chairId:null,x:0,z:0,ry:0,it:null};
}
function startMahirUseAction(type,targetX,targetZ,opts={}){
 if(mahirUseAction.active)return false;
 const tx=Number.isFinite(targetX)?targetX:px,tz=Number.isFinite(targetZ)?targetZ:pz;
 mahirUseAction={active:true,linked:false,type:type||'inspect',propKind:String(opts.propKind||''),q:0,started:performance.now(),duration:Math.max(260,Number(opts.duration)||620),targetX:tx,targetZ:tz,anchorX:Number.isFinite(Number(opts.anchorX))?Number(opts.anchorX):tx,anchorZ:Number.isFinite(Number(opts.anchorZ))?Number(opts.anchorZ):tz,anchorYaw:Number.isFinite(opts.anchorYaw)?opts.anchorYaw:mahirYaw,midDone:false,onMid:typeof opts.onMid==='function'?opts.onMid:null,onDone:typeof opts.onDone==='function'?opts.onDone:null};
 const dx=tx-px,dz=tz-pz;if(Math.hypot(dx,dz)>.02){mahirTargetYaw=Math.atan2(dx,dz);mahirYaw+=shortestAngle(mahirYaw,mahirTargetYaw)*.55;}
 mahirMoveAmount=0;mahirSprint=false;return true;
}
function beginLinkedMahirUse(st,ms){
 const type=mahirUseTypeForStep(st);if(!type){resetMahirUseAction();return;}
 const tx=Number(st?.pos?.[0]),tz=Number(st?.pos?.[1]),x=Number.isFinite(tx)?tx:(chapterTarget?.x??px),z=Number.isFinite(tz)?tz:(chapterTarget?.z??pz);
 mahirUseAction={active:true,linked:true,type,propKind:heldPropKindForStep(st),q:0,started:performance.now(),duration:Math.max(260,Number(ms)||650),targetX:x,targetZ:z,anchorX:x,anchorZ:z,anchorYaw:mahirYaw,midDone:true,onMid:null,onDone:null};
 const dx=x-px,dz=z-pz;if(Math.hypot(dx,dz)>.02)mahirTargetYaw=Math.atan2(dx,dz);mahirMoveAmount=0;
}
function updateMahirUseAction(now=performance.now()){
 const a=mahirUseAction;if(!a.active||a.linked)return;
 a.q=Math.max(0,Math.min(1,(now-a.started)/Math.max(1,a.duration)));
 if(!a.midDone&&a.q>=.46){a.midDone=true;const fn=a.onMid;a.onMid=null;if(fn)fn();}
 if(a.q>=1){const fn=a.onDone;resetMahirUseAction();if(fn)fn();}
}
function mahirVisualPose(){
 let x=px,z=pz,yOffset=0,heightScale=1,tilt=0,shadowScale=1,cameraYOffset=0;
 if(mahirSeatState.active){x=mahirSeatState.x;z=mahirSeatState.z;yOffset=-.34;heightScale=.78;tilt=-.025;shadowScale=.78;cameraYOffset=-.18;}
 const a=mahirUseAction;
 if(a.active){const q=Math.max(0,Math.min(1,a.q||0)),e=q*q*(3-2*q),pulse=Math.sin(Math.PI*q),type=a.type;
   if(type==='sit'){
     x=px+(a.anchorX-px)*e;z=pz+(a.anchorZ-pz)*e;yOffset=-.34*e;heightScale=1-.22*e;tilt=-.025*e;shadowScale=1-.22*e;cameraYOffset=-.18*e;
   }else if(type==='stand'){
     const sx=a.anchorX,sz=a.anchorZ;x=sx+(px-sx)*e;z=sz+(pz-sz)*e;yOffset=-.34*(1-e);heightScale=.78+.22*e;tilt=-.025*(1-e);shadowScale=.78+.22*e;cameraYOffset=-.18*(1-e);
   }else{
     const dx=a.targetX-px,dz=a.targetZ-pz,len=Math.hypot(dx,dz)||1,ux=dx/len,uz=dz/len;
     let forward=.035,drop=.015,lean=.045;
     if(type==='lowReach'||type==='inspectLow'){forward=.075;drop=.10;lean=.11;heightScale=1-.045*pulse;}
     else if(type==='highReach'){forward=.055;drop=-.015;lean=-.035;}
     else if(type==='chairPull'){forward=.055;drop=.035;lean=.07;}
     else if(type==='bodyTest'){forward=0;drop=.015;lean=-.045;heightScale=1+.018*pulse;}
     else if(type==='tap'){forward=.045;drop=.025;lean=.055;}
     x+=ux*forward*pulse;z+=uz*forward*pulse;yOffset-=drop*pulse;tilt=lean*pulse;shadowScale=1-.05*pulse;cameraYOffset=-.03*pulse;
   }
 }
 return {x,z,yOffset,heightScale,tilt,shadowScale,cameraYOffset};
}
function chairSeatPose(it){
 const ent=(it?.objects||[]).find(e=>e.o?.ctxChairRole==='seat');if(!ent)return null;
 const o=ent.o,ry=o.ctxChairCenter?.ry??o.ry??0;
 return {x:o.x,z:o.z,ry:ry+Math.PI};
}
function sitOnAmbientChair(it){
 if(!it||it.type!=='chair'||mahirSeatState.active||mahirUseAction.active)return;
 const pose=chairSeatPose(it);if(!pose)return;
 const dx=pose.x-px,dz=pose.z-pz;if(Math.hypot(dx,dz)>1.75){Game.toast(TT('context.chairCloser','Sandalyeye biraz daha yaklaş.'),1100);return;}
 startMahirUseAction('sit',pose.x,pose.z,{duration:760,anchorX:pose.x,anchorZ:pose.z,anchorYaw:pose.ry,onMid:()=>{mahirTargetYaw=pose.ry;mahirYaw=pose.ry;},onDone:()=>{mahirSeatState={active:true,chairId:it.chairId,x:pose.x,z:pose.z,ry:pose.ry,it};mahirYaw=mahirTargetYaw=pose.ry;Game.toast(TT('context.chairSitDone','Mahir sandalyeye oturdu.'),1050);}});
}
function standFromAmbientChair(){
 const seat=mahirSeatState;if(!seat.active||mahirUseAction.active)return;const it=seat.it;
 const sx=seat.x,sz=seat.z,ry=seat.ry;mahirSeatState={active:false,chairId:null,x:0,z:0,ry:0,it:null};
 startMahirUseAction('stand',px,pz,{duration:700,anchorX:sx,anchorZ:sz,anchorYaw:ry,onMid:()=>{
   if(it){it.target=0;rememberAmbientContextState(it);saveGame(true);if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.playSfx('ui_confirm',{gain:.42});}
 },onDone:()=>Game.toast(TT('context.chairStandDone','Mahir kalktı; sandalye yerine itildi.'),1150)});
}
// ---------- v6.16: SEÇİCİ BAĞLAMSAL ÇEVRE + DİNAMİK COLLISION ----------
// Görev olmayan her nesneyi tıklanabilir yapmak yerine, mekânın gündelik hissini güçlendiren az sayıda nesne seçilir.
// Görev hedefi yakındaysa görev daima önceliklidir; bu katman hikâyeyi ve bölüm ilerlemesini değiştirmez.
function clearAmbientContextInteractions(){ambientContextInteractions.length=0;ambientContextTarget=null;ambientContextCooldown=0;cancelMahirPhysicalUse(true);}
function ambientBase(o){return {x:o.x,y:o.y,z:o.z,sx:o.sx,sy:o.sy,sz:o.sz,ry:o.ry,em:o.em};}
function addAmbientContextInteraction(spec){
 if(!spec||!Number.isFinite(spec.x)||!Number.isFinite(spec.z))return null;
 spec.q=Number(spec.q)||0;spec.target=Number(spec.target)||0;spec.objects=(spec.objects||[]).filter(Boolean).map(o=>({o,base:ambientBase(o)}));
 ambientContextInteractions.push(spec);return spec;
}
function contextText(it,which='prompt'){
 const alt=(it.target||0)>.5;
 if(it?.type==='chair'&&which==='prompt'&&alt&&!mahirSeatState.active)return TT('context.chairSit','SANDALYEYE OTUR');
 const key=which==='done'?(alt?it.doneBase:it.doneAlt):(alt?it.promptAlt:it.promptBase);
 const fallback=which==='done'?(alt?it.doneBaseTr:it.doneAltTr):(alt?it.promptAltTr:it.promptBaseTr);
 return TT(key||'',fallback||'ETKİLEŞ');
}
function makeCabinetContext(body,id){
 if(!body)return null;const thinX=body.sx<=body.sz,towardX=Math.sign(AX-body.x)||-1,towardZ=Math.sign(AZ-body.z)||1,panels=[];
 const c=[.34,.27,.21,1],h=Math.max(.72,body.sy*.76);
 if(thinX){
   const frontX=body.x+towardX*(body.sx*.5+.028),span=Math.max(.54,body.sz*.82),w=span*.5;
   for(const side of[-1,1]){const cz=body.z+side*span*.25,o=abox('ctxDoorPanel_'+id+'_'+(side<0?'L':'R'),frontX,body.y,cz,.035,h,w-.018,'wood',c,[1,1],0,.04);o.x=frontX;o.ctxHinge={hx:frontX,hz:body.z+side*span*.5,angleSign:side*(-towardX),baseRy:0};panels.push(o);}
 }else{
   const frontZ=body.z+towardZ*(body.sz*.5+.028),span=Math.max(.54,body.sx*.82),w=span*.5;
   for(const side of[-1,1]){const cx=body.x+side*span*.25,o=abox('ctxDoorPanel_'+id+'_'+(side<0?'L':'R'),cx,body.y,frontZ,w-.018,h,.035,'wood',c,[1,1],0,.04);o.ctxHinge={hx:body.x+side*span*.5,hz:frontZ,angleSign:side*towardZ,baseRy:0};panels.push(o);}
 }
 const handle=panels[0]?abox('ctxDoorHandle_'+id,panels[0].x,body.y,panels[0].z,.055,.055,.055,'white',[.72,.70,.66,1],[1,1],0,.25):null;
 if(handle&&panels[0]){handle.ctxFollowPanel=panels[0];handle.ctxFollowLocal=[thinX?0:(panels[0].sx*.24),0,thinX?(panels[0].sz*.24):0];}
 return {panels,handle,thinX};
}
function makeDrawerContext(body,id){
 if(!body)return null;const wideX=body.sx>=body.sz,towardX=Math.sign(AX-body.x)||-1,towardZ=Math.sign(AZ-body.z)||1,c=[.42,.33,.25,1];let drawer,face,handle,dx=0,dz=0;
 if(wideX){const frontZ=body.z+towardZ*(body.sz*.5+.11);drawer=abox('ctxDrawerBody_'+id,body.x,body.y+.12,frontZ,Math.max(.62,body.sx*.72),.26,.30,'wood',c,[1,1],body.ry||0,.02);face=abox('ctxDrawerFace_'+id,body.x,body.y+.12,frontZ+towardZ*.16,Math.max(.66,body.sx*.76),.30,.035,'wood',[.36,.28,.21,1],[1,1],body.ry||0,.03);handle=abox('ctxDrawerHandle_'+id,body.x,body.y+.12,frontZ+towardZ*.19,.24,.055,.045,'white',[.68,.66,.62,1],[1,1],body.ry||0,.22);dz=towardZ*.34;}
 else{const frontX=body.x+towardX*(body.sx*.5+.11);drawer=abox('ctxDrawerBody_'+id,frontX,body.y+.12,body.z,.30,.26,Math.max(.62,body.sz*.72),'wood',c,[1,1],body.ry||0,.02);face=abox('ctxDrawerFace_'+id,frontX+towardX*.16,body.y+.12,body.z,.035,.30,Math.max(.66,body.sz*.76),'wood',[.36,.28,.21,1],[1,1],body.ry||0,.03);handle=abox('ctxDrawerHandle_'+id,frontX+towardX*.19,body.y+.12,body.z,.045,.055,.24,'white',[.68,.66,.62,1],[1,1],body.ry||0,.22);dx=towardX*.34;}
 return {drawer,face,handle,dx,dz};
}
function ambientFinalBounds(it,next){
 if(!it)return null;if(it.type==='chair'){const seat=(it.objects||[]).find(e=>e.o?.ctxChairRole==='seat');if(!seat)return null;const b=seat.base,q=next?1:0;return atlasObjectBounds(seat.o,.08,b.x+(it.moveDX||0)*q,b.z+(it.moveDZ||0)*q,b.ry);}
 if(it.type==='drawer'&&it.drawerObject){const ent=(it.objects||[]).find(e=>e.o===it.drawerObject);if(!ent)return null;const b=ent.base,q=next?1:0;return atlasObjectBounds(ent.o,.05,b.x+(it.moveDX||0)*q,b.z+(it.moveDZ||0)*q,b.ry);}
 return null;
}
function ambientTargetSafe(it,next){
 const b=ambientFinalBounds(it,next);if(!b)return true;const r=.30;if(px+r>b[0]&&px-r<b[2]&&pz+r>b[1]&&pz-r<b[3])return false;
 for(const d of atlasDynamicCollisions){if(!d||d.object===it.drawerObject||d.object?.ctxChairId===it.chairId||!d.active())continue;const q=atlasObjectBounds(d.object,d.pad||.08);if(b[2]>q[0]&&b[0]<q[2]&&b[3]>q[1]&&b[1]<q[3])return false;}
 if(it.type==='chair'&&next){for(const q of atlasCollisions)if(b[2]>q[0]&&b[0]<q[2]&&b[3]>q[1]&&b[1]<q[3])return false;}
 return true;
}
function buildAmbientContextInteractions(loc,type){
 clearAmbientContextInteractions();if(!loc||atlasBrowseMode)return;
 const scene=atlasObjs.slice(),usable=o=>o&&o.kind==='box'&&!/^gp\d+_|^missionTarget|^atlasMarker|^ctx/i.test(o.name||'');
 // 1) Işık düğmesi: yalnız gerçek düğmesi olan iç mekânlarda.
 const sw=scene.find(o=>usable(o)&&(o.name==='lightSwitch'||/RoomSwitch$/i.test(o.name||'')));
 if(sw){const lights=scene.filter(o=>usable(o)&&/ceilLight|fluorGlow|lampGlow|softLight|oilLampFlame/i.test(o.name||''));
   addAmbientContextInteraction({id:'light',type:'light',x:sw.x,z:sw.z,objects:[sw,...lights],lightBase:{a:(WORLD_LIGHTS[10]?.color||[]).slice(),b:(WORLD_LIGHTS[11]?.color||[]).slice()},promptBase:'context.lightOff',promptAlt:'context.lightOn',doneBase:'context.lightOffDone',doneAlt:'context.lightOnDone',promptBaseTr:'IŞIĞI KAPAT',promptAltTr:'IŞIĞI AÇ',doneBaseTr:'Işık kapandı.',doneAltTr:'Işık açıldı.'});}
 // 2) Masa üstü defter: sahnede en fazla bir tanesi bağlamsal olur.
 const nb=scene.find(o=>usable(o)&&o.name==='tabNotebook');
 if(nb){const pageL=abox('ctxNotebookPageL',nb.x-.055,nb.y+.016,nb.z,Math.max(.13,nb.sx*.46),.012,nb.sz*.92,'white',[.86,.84,.78,1],[1,1],nb.ry-.02,.025),pageR=abox('ctxNotebookPageR',nb.x+.055,nb.y+.018,nb.z,Math.max(.13,nb.sx*.46),.012,nb.sz*.92,'white',[.82,.81,.76,1],[1,1],nb.ry+.02,.025);
   addAmbientContextInteraction({id:'notebook',type:'notebook',x:nb.x,z:nb.z,objects:[nb,pageL,pageR],promptBase:'context.notebookOpen',promptAlt:'context.notebookClose',doneBase:'context.notebookOpenDone',doneAlt:'context.notebookCloseDone',promptBaseTr:'DEFTERİ AÇ',promptAltTr:'DEFTERİ KAPAT',doneBaseTr:'Defter açıldı.',doneAltTr:'Defter kapandı.'});}
 // 3) Perde: pencere başına ayrı çift; kalabalık olmaması için ilk iki çift.
 const curtains=scene.filter(o=>usable(o)&&o.name==='curtain').sort((a,b)=>a.z-b.z);let curtainPairs=0;
 for(let i=0;i+1<curtains.length&&curtainPairs<2;i+=2){const pair=[curtains[i],curtains[i+1]],cx=(pair[0].x+pair[1].x)*.5,cz=(pair[0].z+pair[1].z)*.5;if(Math.abs(pair[1].z-pair[0].z)>2.2)continue;
   addAmbientContextInteraction({id:'curtain'+curtainPairs,type:'curtain',x:cx,z:cz,centerZ:cz,objects:pair,promptBase:'context.curtainOpen',promptAlt:'context.curtainClose',doneBase:'context.curtainOpenDone',doneAlt:'context.curtainCloseDone',promptBaseTr:'PERDELERİ AÇ',promptAltTr:'PERDELERİ KAPAT',doneBaseTr:'Perdeler açıldı.',doneAltTr:'Perdeler kapandı.'});curtainPairs++;}
 // 4) Dolap / gardırop: gövde sabit, çarpışmasız kapaklar menteşeden açılır.
 const cab=scene.find(o=>usable(o)&&/^(cabinet|cabinetGlass|dresser|wardrobe)$/i.test(o.name||''));
 if(cab){const made=makeCabinetContext(cab,'main');if(made)addAmbientContextInteraction({id:'cabinet',type:'cabinet',x:cab.x,z:cab.z,objects:[...made.panels,made.handle],promptBase:'context.cabinetOpen',promptAlt:'context.cabinetClose',doneBase:'context.cabinetOpenDone',doneAlt:'context.cabinetCloseDone',promptBaseTr:'DOLABI AÇ',promptAltTr:'DOLABI KAPAT',doneBaseTr:'Dolap kapağı açıldı.',doneAltTr:'Dolap kapağı kapandı.'});}
 // 5) Sabit ekran: görev ekranlarından bağımsız gündelik monitör aç/kapa.
 const mon=scene.find(o=>usable(o)&&(o.name==='monitor'||o.name==='setMonitorGlow'));
 if(mon){let group=[mon];if(mon.name==='monitor'){const nearGlow=scene.find(o=>usable(o)&&/monitorGlow/i.test(o.name||'')&&Math.hypot(o.x-mon.x,o.z-mon.z)<.8);if(nearGlow)group.push(nearGlow);}
   addAmbientContextInteraction({id:'monitor',type:'monitor',x:mon.x,z:mon.z,objects:group,promptBase:'context.monitorOn',promptAlt:'context.monitorOff',doneBase:'context.monitorOnDone',doneAlt:'context.monitorOffDone',promptBaseTr:'EKRANI AÇ',promptAltTr:'EKRANI KAPAT',doneBaseTr:'Ekran açıldı.',doneAltTr:'Ekran kapandı.'});}
 // 6) Sandalye: yalnız tek bir gündelik sandalye hareketli olur. Tüm parçalar aynı grup kimliğiyle kayar;
 // oturağın collision'ı statik değil, gerçek konumunu izleyen dinamik footprint'tir.
 if(!/eventhall/i.test(loc)){const seat=scene.find(o=>usable(o)&&o.name==='chairSeat'&&o.ctxChairId&&Math.hypot(o.x-AX,o.z-AZ)>1.15);if(seat){const group=scene.filter(o=>o.ctxChairId===seat.ctxChairId),ry=seat.ctxChairCenter?.ry||seat.ry||0,moveDX=Math.sin(ry)*.34,moveDZ=Math.cos(ry)*.34;const it=addAmbientContextInteraction({id:'chair',type:'chair',chairId:seat.ctxChairId,x:seat.x,z:seat.z,moveDX,moveDZ,objects:group,promptBase:'context.chairPull',promptAlt:'context.chairPush',doneBase:'context.chairPullDone',doneAlt:'context.chairPushDone',promptBaseTr:'SANDALYEYİ GERİ ÇEK',promptAltTr:'SANDALYEYİ YERİNE İT',doneBaseTr:'Sandalye geri çekildi.',doneAltTr:'Sandalye yerine itildi.'});if(it)registerAtlasDynamicCollision(seat,{pad:.07,kind:'chair'});}}
 // 7) Çekmece: gardırop kapaklarından ayrı olarak yalnız bir şifonyer çekmecesi dışarı kayar.
 const dresser=scene.find(o=>usable(o)&&o.name==='dresser');if(dresser){const made=makeDrawerContext(dresser,'main');if(made){const it=addAmbientContextInteraction({id:'drawer',type:'drawer',x:made.drawer.x,z:made.drawer.z,moveDX:made.dx,moveDZ:made.dz,drawerObject:made.drawer,objects:[made.drawer,made.face,made.handle],promptBase:'context.drawerOpen',promptAlt:'context.drawerClose',doneBase:'context.drawerOpenDone',doneAlt:'context.drawerCloseDone',promptBaseTr:'ÇEKMECEYİ AÇ',promptAltTr:'ÇEKMECEYİ KAPAT',doneBaseTr:'Çekmece açıldı.',doneAltTr:'Çekmece kapandı.'});if(it)registerAtlasDynamicCollision(made.drawer,{pad:.04,kind:'drawer',active:()=>it.q>.08});}}
 restoreAmbientContextState(loc);
}
function findNearestAmbientContext(x,z,maxDist=1.48){
 let best=null,bd=maxDist;for(const it of ambientContextInteractions){const d=Math.hypot(x-it.x,z-it.z);if(d<bd){bd=d;best=it;}}return best;
}
function activateAmbientContext(it){
 if(!it||ambientContextCooldown>0||mahirUseAction.active)return;
 // Sandalye üç aşamalı davranır: çek → otur → kalk + yerine it.
 if(it.type==='chair'&&(it.target||0)>.5){sitOnAmbientChair(it);return;}
 const next=(it.target||0)>.5?0:1;if(!ambientTargetSafe(it,next)){Game.toast(TT('context.spaceNeeded','Hareket alanı dolu. Biraz yana geç.'),1100);return;}
 ambientContextCooldown=.30;
 const type=it.type,useType=mahirUseTypeForAmbient(it),dur=(type==='drawer'||type==='cabinet')?690:type==='chair'?720:560;
 startMahirUseAction(useType,it.x,it.z,{duration:dur,onMid:()=>{
   it.target=next;if(type==='light')applyAmbientLightState(it);
   if(window.TELKIN_AUDIO){const id=(type==='cabinet'||type==='drawer')?(it.target?'door_open':'door_close'):type==='chair'?'ui_confirm':type==='notebook'||type==='curtain'?'document':type==='monitor'?'camera_glitch':'ui_confirm';window.TELKIN_AUDIO.playSfx(id,{gain:.50});}
   rememberAmbientContextState(it);saveGame(true);Game.toast(contextText(it,'done'),1050);
 }});
}
function updateAmbientContextInteractions(dt){
 ambientContextCooldown=Math.max(0,ambientContextCooldown-dt);for(const it of ambientContextInteractions){const k=Math.min(1,dt*8),target=it.target||0;it.q+=(target-it.q)*k;const e=it.q*it.q*(3-2*it.q);
   for(const ent of it.objects||[]){const o=ent.o,b=ent.base;if(!o||!b)continue;o.x=b.x;o.y=b.y;o.z=b.z;o.sx=b.sx;o.sy=b.sy;o.sz=b.sz;o.ry=b.ry;o.em=b.em;
     if(it.type==='light'){
       if(o.name==='lightSwitch'||/RoomSwitch$/i.test(o.name||'')){o.y=b.y-.018*e;o.ry=b.ry+.08*e;}
       else o.em=Math.max(.015,b.em*(1-.88*e));
     }else if(it.type==='notebook'){
       if(/ctxNotebookPageL/.test(o.name||'')){o.x=b.x-.09*e;o.ry=b.ry-.34*e;o.y=b.y+.012*e;}
       else if(/ctxNotebookPageR/.test(o.name||'')){o.x=b.x+.09*e;o.ry=b.ry+.34*e;o.y=b.y+.014*e;}
       else{o.sx=b.sx*(1+.08*e);o.em=Math.max(b.em,.04+.06*e);}
     }else if(it.type==='curtain'){
       const sg=Math.sign(b.z-it.centerZ)||1;o.z=b.z+sg*.30*e;o.sz=b.sz*(1-.42*e);
     }else if(it.type==='cabinet'){
       if(o.ctxHinge){const h=o.ctxHinge,a=h.angleSign*1.10*e,ox=b.x-h.hx,oz=b.z-h.hz;o.x=h.hx+Math.cos(a)*ox+Math.sin(a)*oz;o.z=h.hz-Math.sin(a)*ox+Math.cos(a)*oz;o.ry=b.ry+a;}
       else if(o.ctxFollowPanel){const p=o.ctxFollowPanel;o.x=p.x;o.z=p.z;o.ry=p.ry;o.em=Math.max(b.em,.18+.10*e);}
     }else if(it.type==='monitor'){
       o.em=Math.max(b.em,e*((/Glow/i.test(o.name||'')) ? .92 : .32));
     }else if(it.type==='chair'){
       o.x=b.x+(it.moveDX||0)*e;o.z=b.z+(it.moveDZ||0)*e;
     }else if(it.type==='drawer'){
       o.x=b.x+(it.moveDX||0)*e;o.z=b.z+(it.moveDZ||0)*e;
     }
   }
 }
}
function beginChapterAction(){
 if(interactionBusy||isMechanicOpen||isDialogueOpen||mahirUseAction.active)return;
 if(mahirSeatState.active){Game.toast(TT('context.standFirst','Önce sandalyeden kalk.'),1050);return;}
 const c=chapterByNo(activeChapter),seq=chapterSequence(c),st=seq[chapterSeqIndex];if(!st){advanceChapter();return;}
 if(st.kind==='talk'&&!prepareConversationFacing(st))return;
 const ap=actionProfile(st);if(ap.ms<=220){advanceChapter();return;}
 startGameplayPropInteraction(st,chapterSeqIndex);beginLinkedMahirUse(st,ap.ms);
 interactionBusy=true;prompt.classList.remove('show');interact.classList.remove('hot');if(actionFocus){actionFocusLabel.textContent=ap.doing;actionFocusFill.style.width='0%';actionFocus.classList.add('show');}
 const start=performance.now();cancelAnimationFrame(interactionRAF);
 const tick=(now)=>{if(!interactionBusy)return;const q=Math.min(1,(now-start)/ap.ms);chapterActionVisual.q=q;if(mahirUseAction.active&&mahirUseAction.linked)mahirUseAction.q=q;if(actionFocusFill)actionFocusFill.style.width=(q*100).toFixed(1)+'%';if(q<1){interactionRAF=requestAnimationFrame(tick);return;}interactionBusy=false;if(actionFocus)actionFocus.classList.remove('show');chapterActionVisual.q=1;updateGameplayPropInteraction();resetMahirUseAction();advanceChapter();chapterActionVisual={active:false,kind:'',stepIndex:-1,q:0,objects:[],useCueDone:false};};
 interactionRAF=requestAnimationFrame(tick);
}
function cancelChapterAction(){interactionBusy=false;cancelAnimationFrame(interactionRAF);if(mahirUseAction.linked)resetMahirUseAction();resetGameplayPropVisual();if(actionFocus)actionFocus.classList.remove('show');}



function chapterRouteLabel(c){
 return (c.route&&c.route.length?c.route:[c.loc]).filter(Boolean).map(l=>LOC_INFO[l]?.label||l).join(' → ');
}
function recapBeatLines(c){
 const raw=(c.beats||[]).map((b,i)=>({speaker:String(b?.[0]||'ANLATICI'),text:String(b?.[1]||'').trim(),i})).filter(x=>x.text);
 if(!raw.length)return [];
 const narr=raw.filter(x=>x.speaker==='ANLATICI');
 const pool=narr.length>=3?narr:raw;
 const picks=[];
 const add=x=>{if(x&&!picks.some(p=>p.text===x.text))picks.push(x);};
 add(pool[0]);
 add(pool[Math.floor((pool.length-1)/2)]);
 add(pool[pool.length-1]);
 if(picks.length<3)add(raw[raw.length-1]);
 return picks.slice(0,3).map(x=>x.speaker==='ANLATICI'?`• ${x.text}`:`• ${x.speaker}: “${x.text}”`);
}
function chapterPrelude(c){
 const prev=c.n>1?chapterByNo(c.n-1):null,prevSeen=!!(prev&&completedChapters.has(prev.n)),seq=chapterSequence(c),first=seq[0],sys=chapterSystem(c),exp=chapterExperience(c),scenes=chapterSceneRanges(c);
 const incoming=prevSeen?(prev.hook||'Önceki bölüm tamamlandı.'):(c.n===1?'Mahir’in sıradan kabul ettiği dünya, küçük bir çelişkiyle ilk kez güvenilmez hâle geliyor.':'Bu bölümü doğrudan seçtin; oyun yalnız bu bölüm için gerekli başlangıç durumunu açıklayacak.');
 const body=[
  `NEREDEN GELDİK?\n${incoming}`,
  `MAHİR NEDEN BURADA?\n${c.intro||'Yeni bir bölüm başlıyor.'}`,
  `ŞİMDİ NEYİ ÇÖZMEYE ÇALIŞIYOR?\n${sys.systemBrief}`,
  `İLK SAHNE\n${sceneTitle(c,first)} — ${sceneReason(c,first)}`
 ].join('\n\n');
 return {
  kicker:`CİLT ${c.vol} · HİKÂYE BAĞLAMI`,
  title:`${String(c.n).padStart(3,'0')} · ${c.title}`,
  sub:`Bu bölüm ${scenes.length} ana sahne olarak oynanacak; tek cümlelik görev zinciri değil.`,
  body,
  meta:`MEKÂN: ${chapterRouteLabel(c)}\nANA SAHNE: ${scenes.length} · MİKRO İZ: ${seq.length}\nOYUN SİSTEMİ: ${sys.systemTitle}\nRİTİM: ${exp.pace}`,
  button:'HİKÂYEYE GİR'
 };
}
function chapterRecap(c){
 const next=c.n<144?chapterByNo(c.n+1):null,exp=chapterExperience(c);
 const lines=recapBeatLines(c);
 const body=[
  `BÖLÜMDE NE OLDU?\n${lines.length?lines.join('\n'):'• Bölümün görev ve olay zinciri tamamlandı.'}`,
  `BÖLÜMÜN KIRILMASI\n${c.hook||'Bu bölüm hikâyenin bir sonraki eşiğini açtı.'}`,
  next?`BURADAN SONRA\nSıradaki bölüm: ${String(next.n).padStart(3,'0')} · ${next.title}`:`SON\n144 bölümün yolculuğu burada tamamlandı.`
 ].join('\n\n');
 return {
  kicker:c.n<144?'BÖLÜM SONU · KISA ÖZET':'TELKİN · FİNAL ÖZETİ',
  title:`${String(c.n).padStart(3,'0')} · ${c.title}`,
  sub:`Tamamlandı · ${exp.style.label} · ${exp.pace}`,
  body,
  meta:`TAMAMLANAN: ${completedChapters.size}/144\nTEMATİK SONUÇ: ${c.hook||'—'}${next?`\nSONRAKİ MEKÂN: ${chapterRouteLabel(next)}`:''}`,
  button:next?`BÖLÜM ${next.n}'E GEÇ`:'FİNALİ KAPAT'
 };
}
function openChapterInterlude(data,after){
 cancelChapterAction();
 document.body.classList.add('dialogueMode');interact.textContent=TT('ui.continue','DEVAM');
 chapterInterludeAfter=typeof after==='function'?after:null;
 chapterInterludeOpen=true;
 ciKicker.textContent=data.kicker||'TELKİN';
 ciTitle.textContent=data.title||'BÖLÜM';
 ciSub.textContent=data.sub||'';
 ciBody.textContent=data.body||'';
 ciMeta.textContent=data.meta||'';
 ciContinue.textContent=data.button||'DEVAM';
 chapterInterlude.classList.add('show');chapterInterlude.setAttribute('aria-hidden','false');
 prompt.classList.remove('show');interact.classList.remove('hot');
 setTimeout(()=>{try{ciContinue.focus({preventScroll:true})}catch(_){}},60);
}
function closeChapterInterlude(){
 if(!chapterInterludeOpen)return;
 chapterInterludeOpen=false;chapterInterlude.classList.remove('show');chapterInterlude.setAttribute('aria-hidden','true');
 document.body.classList.remove('dialogueMode');interact.textContent=TT('ui.interact','ETKİLEŞ');
 const cb=chapterInterludeAfter;chapterInterludeAfter=null;
 if(cb)setTimeout(cb,0);
}
ciContinue.addEventListener('click',closeChapterInterlude);



// ---------- v3.8.2: SAHNE ANLATISI KATMANI ----------
function escHtml(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function chapterStoryHTML(c){
 const prev=c.n>1?chapterByNo(c.n-1):null;
 const beats=(c.beats||[]).map((b,i)=>`<div class="sBeat"><strong>${String(i+1).padStart(2,'0')}</strong>${b[0]&&b[0]!=='ANLATICI'?`<b>${escHtml(b[0])}:</b> `:''}${escHtml(b[1]||'')}</div>`).join('');
 return `${prev?`<div class="sCard"><h3>ÖNCEKİ BÖLÜMDEN GELEN</h3><p>${escHtml(prev.hook||prev.intro||'Önceki bölüm tamamlandı.')}</p></div>`:''}
 <div class="sCard"><h3>MAHİR NEDEN BURADA?</h3><p>${escHtml(c.intro||'')}</p></div>
 <div class="sCard"><h3>BU BÖLÜMÜN SORUSU</h3><p>${escHtml(chapterSystem(c).systemBrief||'Bu bölümdeki çelişkinin ne anlama geldiğini sınamak.')}</p></div>
 <div class="sCard"><h3>OLAYLARIN NEDENSEL AKIŞI</h3><div class="sTimeline">${beats||'<div class="sBeat">Bu bölümün olay akışı oynanış sırasında açılacak.</div>'}</div></div>
 <div class="sCard sHook"><h3>BÖLÜM NEREYE BAĞLANIYOR?</h3><p>${escHtml(c.hook||'Bu bölüm bir sonraki soruyu açar.')}</p></div>
 <div class="sProgress">BÖLÜM ${c.n}/144 · SAHNE ${sceneMetaForStep(c,chapterSeqIndex).index+1}/${sceneMetaForStep(c,chapterSeqIndex).total} · MİKRO İZ ${Math.min(chapterSeqIndex+1,chapterSequence(c).length)}/${chapterSequence(c).length}</div>`;
}
async function renderStoryPanel(){
 const c=chapterByNo(activeChapter);
 storyPanelTitle.textContent=`${String(c.n).padStart(3,'0')} · ${c.title}`;
 const novel=window.TELKIN_NOVEL;
 if(novel){
   storyPanelBody.innerHTML='<div class="novelLoading"><b>TAM ROMAN METNİ YÜKLENİYOR</b><span>Bölüm dosyası gerektiğinde ayrı yüklenir.</span></div>';
   try{
     if(await novel.has(c.n)){await novel.render(storyPanelBody,c);return;}
   }catch(e){
     console.warn('[TELKİN ROMAN]',e);
     storyPanelBody.innerHTML=`<div class="novelLoading error"><b>ROMAN METNİ YÜKLENEMEDİ</b><span>${escHtml(e&&e.message?e.message:'Bilinmeyen hata')}</span></div>`;
     return;
   }
 }
 storyPanelBody.innerHTML=chapterStoryHTML(c);
}
function openStory(){cancelChapterAction();if(isDialogueOpen)closeDlg();if(isUniverseOpen)closeUniverse();if(isChaptersOpen)closeChapters();if(isLocationsOpen)closeLocations();isStoryOpen=true;storyPanel.classList.add('show');storyPanel.setAttribute('aria-hidden','false');storyPanel.scrollTop=0;storyBtn.classList.add('on');renderStoryPanel();}
function closeStory(){isStoryOpen=false;storyPanel.classList.remove('show');storyPanel.setAttribute('aria-hidden','true');storyBtn.classList.remove('on');}
storyBtn.addEventListener('click',()=>isStoryOpen?closeStory():openStory());storyClose.addEventListener('click',closeStory);

function stepPurposeSentence(st){
 if(!st)return '';
 const who=canonicalCharacterName(st.char||st.speaker||st.label||'');
 switch(st.kind){
  case 'talk': return who?`${who}’ın gördüğünü kendi ağzından duymadan önceki bulguyu yorumlamak istemiyor.`:'Önceki bulguyu başka bir tanığın anlatımıyla sınamak gerekiyor.';
  case 'camera': return 'Sözlü anlatım yetmediği için aynı anı görüntü kaydıyla karşılaştırmak gerekiyor.';
  case 'audio': return 'Görülen şey ile duyulan şeyin aynı zamanı anlatıp anlatmadığını kontrol etmek gerekiyor.';
  case 'document': return 'Hatıra yerine kalıcı kayda bakmak, değişenin insan mı yoksa kayıt mı olduğunu ayırabilir.';
  case 'memory': return 'Mahir, yaşananla hatırlananın aynı şey olup olmadığını sınamak zorunda.';
  case 'body': return 'Mesele artık yalnız dışarıdaki bir olay değil; Mahir etkinin kendi bedeninde de çalışıp çalışmadığını test ediyor.';
  case 'door': return 'Çelişkiyi yorumlamadan önce fiziksel eşiğin gerçekten ne durumda olduğunu yeniden doğrulamak gerekiyor.';
  case 'route': return 'Önceki bulgu yeni bir yere işaret ediyor; Mahir sonucu değil neden zincirini takip ediyor.';
  case 'observe': case 'inspect': case 'scan': return 'Bir açıklama seçmeden önce sahnedeki bağımsız ayrıntıları toplamak gerekiyor.';
  default:return `Önceki adımın bıraktığı soruyu çözmek için sıradaki hedef: ${String(st.goal||'sahneyi incelemek').toLocaleLowerCase('tr-TR')}.`;
 }
}
function sceneGroupEnd(seq,start){
 if(start>=seq.length)return start;
 const first=seq[start],loc=first.loc;
 if((first.lines||[]).length>=6)return start;
 let end=start,total=(first.lines||[]).length||1;
 while(end+1<seq.length&&end-start<3){
  const nx=seq[end+1]; if(nx.loc!==loc)break;
  const n=(nx.lines||[]).length||1; if(total+n>12)break;
  // Gerçekten uzun konuşma kendi sahnesini korusun; tek cümlelik konuşmalar artık parçalanmaz.
  if(nx.kind==='talk'&&n>=6)break;
  end++;total+=n;
 }
 return end;
}
function chapterSceneRanges(c){
 const seq=chapterSequence(c),out=[];let i=0;
 while(i<seq.length){const e=sceneGroupEnd(seq,i);out.push([i,e]);i=e+1;}
 return out;
}
function sceneMetaForStep(c,stepIndex){
 const rs=chapterSceneRanges(c);let idx=rs.findIndex(r=>stepIndex>=r[0]&&stepIndex<=r[1]);if(idx<0)idx=Math.max(0,rs.length-1);
 return {index:idx,total:Math.max(1,rs.length),range:rs[idx]||[stepIndex,stepIndex]};
}
function showMissionPeek(ms=3600){
 if(!missionCard)return;clearTimeout(missionPeekTimer);missionCard.classList.add('show');missionPeekTimer=setTimeout(()=>missionCard.classList.remove('show'),ms);
}
function hideMissionPeek(){clearTimeout(missionPeekTimer);if(missionCard)missionCard.classList.remove('show');}
function setQuickMenu(on){if(!hudQuickMenu)return;hudQuickMenu.classList.toggle('show',!!on);hudQuickMenu.setAttribute('aria-hidden',on?'false':'true');}
function sceneReason(c,st){
 if(!st)return c.intro||'';
 const purpose=stepPurposeSentence(st);
 if(chapterSeqIndex===0)return `${c.intro||''} ${purpose}`.trim();
 return purpose;
}
function sceneTitle(c,st){
 const who=canonicalCharacterName(st?.char||st?.speaker||st?.label||'');
 if(st?.kind==='talk'&&who)return `${who} İLE SAHNEYİ AÇ`;
 if(st?.kind==='document')return 'KAYDI BAĞLAMA YERLEŞTİR';
 if(st?.kind==='camera'||st?.kind==='audio')return 'KAYDI GERÇEK OLAYLA KARŞILAŞTIR';
 if(st?.kind==='route')return 'NEDEN ZİNCİRİNİ TAKİP ET';
 return (st?.goal||c.title||'SAHNEYİ İLERLET').toUpperCase();
}
function makeSceneTranscript(c,seq,start,end){
 const raw=[];
 // Sadece sahnenin girişinde kısa bağlam; her mikro adımda anlatıcı metni bindirme.
 if(start===0&&c.intro)raw.push(['ANLATICI',c.intro]);
 else{const p=stepPurposeSentence(seq[start]);if(p)raw.push(['ANLATICI',p]);}
 for(let i=start;i<=end;i++){
  const st=seq[i],ls=(st.lines&&st.lines.length)?st.lines:[[st.speaker||'ANLATICI',st.line||st.goal||'']];
  for(const ln of ls)if(ln&&ln[1])raw.push([ln[0]||'ANLATICI',ln[1]]);
 }
 // Aynı konuşanın art arda gelen kısa cümlelerini birleştir; konuşanı ASLA "SAHNE" başlığına dönüştürme.
 const out=[];
 for(const [sp0,tx0] of raw){const sp=sp0||'ANLATICI',tx=String(tx0||'').trim();if(!tx)continue;const last=out[out.length-1];if(last&&last[0]===sp&&(last[1]+' '+tx).length<210)last[1]+=' '+tx;else out.push([sp,tx]);}
 return out;
}

// v3.8.2 · Seçili hikâye kırılmalarını yazı kartı yerine kısa animasyonlu sahne olarak oynat.
const ANIMATED_CHAPTERS=new Set([1,8,11,18,36,72,108,143,144]);
let cutsceneOpen=false,cutsceneTimer=null;
function cutsceneSpriteFor(speaker){
 const n=canonicalCharacterName(speaker||'');
 if(n==='MAHİR'||n==='MAHİR’İN SESİ')return MAHIR_FRAMES.front_idle||MAHIR_FRAMES.front_walk_a||null;
 const p=characterPack(n);
 return p?.frames?.front_idle||p?.legacy||REAL_NPC_SPRITES[n]||null;
}
function sceneRawLines(c,seq,start,end){
 const out=[];
 if(start===0&&c.intro)out.push(['ANLATICI',c.intro]);
 for(let i=start;i<=end;i++)for(const ln of (seq[i].lines||[]))if(ln&&ln[1])out.push([ln[0]||seq[i].speaker||'ANLATICI',ln[1]]);
 return out.slice(0,7);
}
function shouldAnimateScene(c,seq,start,end){
 // Karşılıklı konuşmalar her zaman ayrı sahne; büyük olaylar da sinematik kalır.
 for(let i=start;i<=end;i++)if(seq[i]?.kind==='talk')return true;
 const speakers=new Set();for(let i=start;i<=end;i++)for(const ln of (seq[i]?.lines||[])){const n=canonicalCharacterName(ln?.[0]||'');if(n&&n!=='ANLATICI'&&n!=='SES')speakers.add(n)}
 if(speakers.size)return true;
 if(!ANIMATED_CHAPTERS.has(c.n))return false;
 if(start===0)return true;
 for(let i=start;i<=end;i++)if(['hazard','anomaly','body'].includes(seq[i]?.kind))return true;
 return c.n>=143;
}
const cutscenePending=[];
function cutChunk(lines){
 const out=[];
 for(const [sp,tx] of lines){
   for(const para of String(tx||'').split(/\n\s*\n/).map(x=>x.replace(/\s*\n\s*/g,' ').trim()).filter(Boolean)){
     if(para.length<=210){out.push([sp,para]);continue;}
     let cur='';for(const sent of para.split(/(?<=[.!?…])\s+/)){if(cur&&(cur+' '+sent).length>210){out.push([sp,cur]);cur=sent}else cur=cur?cur+' '+sent:sent}
     if(cur)out.push([sp,cur]);
   }
 }
 return out;
}
function currentCutLoc(){return (activeAtlas&&LOC_INFO[activeAtlas]&&LOC_INFO[activeAtlas].label)||'TELKİN'}
function playSceneCutscene(c,seq,start,end,done,pages){
 const lines=(pages&&pages.length)?pages:sceneRawLines(c,seq,start,end);
 const loc=LOC_INFO[seq[start]?.loc||activeAtlas]?.label||c.locLabel||'TELKİN';
 const named=lines.some(x=>{const n=canonicalCharacterName(x?.[0]||'');return n&&n!=='ANLATICI'&&n!=='SES'});
 runCutscene(lines,{loc:loc+' · BÖLÜM '+c.n,title:sceneTitle(c,seq[start]),mode:named?'conversation':'cinematic'},done);
}

// ---------- v4.3.0: KARAKTER FİLM KİMLİĞİ ----------
// Cutscene boyu, kadrajı ve görsel varlığı dünya içindeki karakter oranıyla aynı kalır.
const CHARACTER_FILM_BIBLE={
 'MAHİR':{desktop:'76vh',mobile:'58vh',presence:1.00,role:'lead'},
 'EREN':{desktop:'75vh',mobile:'57vh',presence:.99,role:'human'},
 'MİNA':{desktop:'68vh',mobile:'52vh',presence:.96,role:'family'},
 'NİSAN':{desktop:'73vh',mobile:'56vh',presence:.99,role:'science'},
 'BARAN':{desktop:'80vh',mobile:'61vh',presence:1.02,role:'pressure'},
 'KAYITÇI':{desktop:'81vh',mobile:'62vh',presence:1.01,role:'uncanny'},
 'LEYLA':{desktop:'72vh',mobile:'55vh',presence:.99,role:'human'},
 'SELİN':{desktop:'73vh',mobile:'56vh',presence:.99,role:'human'},
 'SUNA':{desktop:'70vh',mobile:'54vh',presence:.98,role:'family'},
 'MUHAFIZ':{desktop:'81vh',mobile:'62vh',presence:1.02,role:'pressure'},
 'DOKTOR':{desktop:'76vh',mobile:'58vh',presence:1.00,role:'clinical'}
};
function characterFilmProfile(n){return CHARACTER_FILM_BIBLE[canonicalCharacterName(n)]||{desktop:'75vh',mobile:'57vh',presence:1,role:'human'};}
function actorFilmVars(n){const p=characterFilmProfile(n);return `--actor-h:${p.desktop};--actor-h-mobile:${p.mobile};--actor-presence:${p.presence}`;}

function runCutscene(lines0,meta,done){
 if(cutsceneOpen){cutscenePending.push([lines0,meta,done]);return;}
 const root=document.getElementById('storyCutscene'),stage=document.getElementById('cutStage');if(!root||!stage){if(done)done();return;}
 const lines=cutChunk(lines0||[]);if(!lines.length){if(done)done();return;}
 cutsceneOpen=true;root.classList.add('show');root.setAttribute('aria-hidden','false');document.body.classList.add('dialogueMode');document.body.classList.add('cinematicMode');hideMissionPeek();setQuickMenu(false);
 const named=[];for(const [sp] of lines){const n=canonicalCharacterName(sp);if(n&&n!=='ANLATICI'&&n!=='SES'&&!named.includes(n)&&cutsceneSpriteFor(n))named.push(n)}
 const isConversation=(meta&&meta.mode)==='conversation';
 if(isConversation){const mi=named.indexOf('MAHİR');if(mi>0){named.splice(mi,1);named.unshift('MAHİR')}else if(mi<0&&cutsceneSpriteFor('MAHİR'))named.unshift('MAHİR');}
 const actors=named.slice(0,3);
 stage.className='cutStage '+(isConversation?'conversation':'cinematic');stage.innerHTML=`<div class="cutLocation">${escHtml(meta.loc)}</div><div class="cutSceneTitle">${escHtml(meta.title)}</div><div class="cutActors">${actors.map((n,i)=>`<img class="cutActor ${actors.length===1?'center':(i===0?'left':i===1?'right':'center')}" data-name="${escHtml(n)}" data-role="${characterFilmProfile(n).role}" style="${actorFilmVars(n)}" src="${cutsceneSpriteFor(n)}" alt="${escHtml(n)}">`).join('')}<div class="cutFx" id="cutFx"></div></div><div class="cutCaption"><span class="cutSpeaker" id="cutSpeaker"></span><div class="cutText" id="cutText"></div><div class="cutProgress"><i id="cutProgress"></i></div></div><button class="cutSkip" id="cutSkip">SAHNEYİ ATLA</button><span class="cutTap">DOKUN: SONRAKİ KARE</span>`;
 const actorEls=[...stage.querySelectorAll('.cutActor')],speakerEl=stage.querySelector('#cutSpeaker'),textEl=stage.querySelector('#cutText'),prog=stage.querySelector('#cutProgress'),fx=stage.querySelector('#cutFx');
 actorEls.forEach((el,i)=>{el.dataset.slot=String(i);if(window.TELKIN_TRIM_ACTOR)window.TELKIN_TRIM_ACTOR(el)});
 const revealActors=()=>actorEls.forEach((el,i)=>setTimeout(()=>el.classList.add('enter'),70+i*90));
 // Kırpma hazır olduğunda göster; data-URI sprite'larda bu çoğunlukla ilk kare içinde tamamlanır.
 let revealWait=0;const revealPoll=setInterval(()=>{revealWait+=40;if(actorEls.every(el=>el.dataset.trimmed==='1')||revealWait>=3200){clearInterval(revealPoll);revealActors()}},40);
 setTimeout(()=>stage.classList.add('pan'),80);
 let idx=0,finished=false,prevWho='';
 const finish=()=>{if(finished)return;finished=true;clearTimeout(cutsceneTimer);try{clearInterval(revealPoll)}catch(_){}cutsceneOpen=false;root.classList.remove('show');root.setAttribute('aria-hidden','true');document.body.classList.remove('dialogueMode');document.body.classList.remove('cinematicMode');stage.innerHTML='';if(done)done();if(!cutsceneOpen){const nx=cutscenePending.shift();if(nx)runCutscene(nx[0],nx[1],nx[2]);}};
 const show=()=>{
   if(idx>=lines.length){finish();return}const [sp,tx]=lines[idx],who=canonicalCharacterName(sp),narr=!who||who==='ANLATICI';speakerEl.textContent=narr?'':who;textEl.textContent=tx;prog.style.width=(100*(idx+1)/lines.length)+'%';stage.classList.toggle('narration',narr);
   if(prevWho&&prevWho!==who){const prev=actorEls.find(el=>el.dataset.name===prevWho);if(prev){prev.classList.add('reaction');setTimeout(()=>prev.classList.remove('reaction'),420)}}
   actorEls.forEach(el=>{const active=el.dataset.name===who;el.classList.toggle('speaking',active);el.classList.toggle('dim',!narr&&!active)});prevWho=who;
   if(fx){fx.classList.toggle('on',/yarık|anomal|olasılık|kayıt|yedi|öl|çök|kanama/i.test(tx));setTimeout(()=>fx&&fx.classList.remove('on'),620)}
   clearTimeout(cutsceneTimer);
   // Karşılıklı konuşmada oyuncuya okuma alanı bırak; sinematik anlatıda otomatik akış sürer.
   const wait=(meta&&meta.mode)==='conversation'?Math.max(5200,Math.min(10500,2600+tx.length*48)):Math.max(2600,Math.min(8000,1500+tx.length*40));
   cutsceneTimer=setTimeout(()=>{idx++;show()},wait);
 };
 stage.querySelector('#cutSkip').onclick=finish;stage.onclick=(e)=>{if(e.target.id==='cutSkip')return;clearTimeout(cutsceneTimer);idx++;show()};show();
}


const TAS_STRATEJI_URL='arcade/tas-strateji/index.html';
function arcadeDifficultyInfo(n=activeChapter){
 const tier=Math.min(5,Math.floor((Math.max(1,n)-1)/24));
 const names=window.TELKIN_I18N?.value('arcade.difficulty',['BAŞLANGIÇ','KOLAY','ORTA','ZOR','USTA','UZMAN'])||['BAŞLANGIÇ','KOLAY','ORTA','ZOR','USTA','UZMAN'];
 return {tier,name:names[tier],reflexHits:5+tier,reflexSec:13-tier,memoryRounds:3+Math.floor(tier/2),dodgeSec:7+tier,dodgeSpawn:Math.max(210,460-tier*45),dodgeSpeed:2.0+tier*.45,
  snakeFood:4+tier*2,snakeStep:Math.max(92,205-tier*21),pongScore:2+Math.floor(tier/2),pongAI:1.45+tier*.28,
  breakoutRows:2+tier,breakoutLives:3,breakoutSpeed:2.35+tier*.28,meteorSec:8+tier,meteorSpawn:Math.max(250,720-tier*78),meteorSpeed:1.45+tier*.35,
  chessNeed:1+Math.floor(tier/2),mazeSize:7+2*Math.floor(tier/2),mazeSec:50-tier*2,numberTarget:[32,32,64,64,128,128][tier],codeAttempts:8-Math.floor(tier/2)};
}
function chapterArcadeType(n){
 n=Math.max(1,Number(n)||1);
 if(n%18===0)return 'TAŞ STRATEJİ';
 if(n%15===0)return 'SATRANÇ';
 if(n%12===0)return 'TAVLA';
 const pool=(window.TELKIN_ARCADE_POOL&&window.TELKIN_ARCADE_POOL.length)?window.TELKIN_ARCADE_POOL:['REFLEKS','YILAN','HAFIZA','RAKET','KAÇIŞ','KATMAN KIR','METEOR'];
 return pool[(n-1)%pool.length];
}
function arcadeMeta(type){return window.telkinArcadeMeta?window.telkinArcadeMeta(type):{icon:'◆',genre:'ARCADE',brief:'Mini oyunu tamamla.',control:'DOKUN',accent:'#bd5cff'};}
function arcadeTypes(){const c=window.TELKIN_ARCADE_CATALOG||{};return Object.keys(c).length?Object.keys(c):['REFLEKS','YILAN','HAFIZA','RAKET','KAÇIŞ','KATMAN KIR','METEOR','SATRANÇ','TAVLA','TAŞ STRATEJİ'];}
function renderArcadeShelf(recommended=chapterArcadeType(activeChapter)){
 if(!arcadeShelf)return;arcadeShelf.innerHTML=arcadeTypes().map(type=>{const m=arcadeMeta(type),on=type===selectedArcadeType?' on':'',rec=type===recommended?' recommended':'';return `<button class="${on}${rec}" data-game="${type}" style="--arcade-accent:${m.accent}"><i>${m.icon}</i><span>${m.name||type}<small>${m.genre}</small></span></button>`}).join('');
 arcadeShelf.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();stopArcadeRuntime();arcadePads.classList.remove('show');showArcadeCanvas();selectedArcadeType=b.dataset.game;renderArcadeShelf(recommended);refreshArcadePreview(recommended);}));
}
function refreshArcadePreview(recommended=chapterArcadeType(activeChapter)){
 const type=selectedArcadeType||recommended,m=arcadeMeta(type),d=arcadeDifficultyInfo(activeChapter),won=chapterMarkerUnlocked(activeChapter);document.documentElement.style.setProperty('--arcade-accent',m.accent||'#bd5cff');
 if(arcadeGenre)arcadeGenre.textContent=m.genre;if(arcadeControl)arcadeControl.textContent=m.control;
 arcadeTitle.innerHTML=`${TT('arcade.chapterLabel','BÖLÜM')} ${String(activeChapter).padStart(3,'0')} · ${m.icon} ${m.name||type} <span class="arcadeTier">${d.name} · ${TT('arcade.levelLabel','SEVİYE')} ${d.tier+1}/6</span>`;
 const recMeta=arcadeMeta(recommended);arcadeDesc.textContent=won?TT('arcade.previewWon','Bu bölümün hedef işaretleri açık. {brief} İstersen tekrar oynayabilirsin.',{brief:m.brief}):TT('arcade.previewLocked','{brief} Kazanırsan hedef işareti ve yön oku açılır. Önerilen oyun: {recommended}. İstersen raftan başka oyun seçebilirsin.',{brief:m.brief,recommended:recMeta.name||recommended});
 arcadeStart.textContent=won?TT('ui.replay','TEKRAR OYNA'):TT('ui.play','OYNA');drawArcadeIdle();
}
function tasConfigForChapter(n=activeChapter){const t=arcadeDifficultyInfo(n).tier;return [{cols:4,stones:3,difficulty:'easy'},{cols:4,stones:3,difficulty:'medium'},{cols:5,stones:3,difficulty:'medium'},{cols:5,stones:4,difficulty:'hard'},{cols:6,stones:4,difficulty:'hard'},{cols:6,stones:5,difficulty:'hard'}][t];}
function chapterMarkerUnlocked(n=activeChapter){return arcadeUnlockedChapters.has(Number(n));}
function updateArcadeButton(){if(!arcadeBtn)return;const won=chapterMarkerUnlocked(activeChapter),type=chapterArcadeType(activeChapter),m=arcadeMeta(type);arcadeBtn.textContent=won?'ARCADE ✓':`ARCADE · ${m.name||type}`;arcadeBtn.classList.toggle('won',won);}
function showArcadeCanvas(){arcadeCanvas.classList.remove('hide');arcadeEmbed.classList.remove('show');arcadeFrame.srcdoc='';}
function showArcadeEmbed(){arcadeCanvas.classList.add('hide');arcadeEmbed.classList.add('show');}
function stopArcadeRuntime(){cancelAnimationFrame(arcadeRAF);arcadeRAF=0;if(arcadeCleanup){try{arcadeCleanup()}catch(_){}arcadeCleanup=null;}}
function closeArcade(){stopArcadeRuntime();arcadeOpen=false;arcadePanel.classList.remove('show');arcadePanel.setAttribute('aria-hidden','true');arcadePads.classList.remove('show');showArcadeCanvas();}
function arcadeWin(){if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.playSfx('arcade_win');stopArcadeRuntime();arcadeUnlockedChapters.add(activeChapter);arcadeStatus.textContent=TT('arcade.win','KAZANDIN · HEDEF İŞARETLERİ AÇILDI');updateArcadeButton();syncChapterTargetVisual();if(!inspectionMode)saveGame(true);Game.toast(TT('arcade.rewardToast','ARCADE ÖDÜLÜ · BÖLÜM {chapter} HEDEF İŞARETLERİ AÇILDI',{chapter:activeChapter}),2200);}
function openArcade(){
 if(atlasBrowseMode){Game.toast(TT('arcade.browseOnly','ARCADE bölüm akışında çalışır.'),1400);return;}
 if(isStoryOpen)closeStory();if(isUniverseOpen)closeUniverse();if(isChaptersOpen)closeChapters();if(isLocationsOpen)closeLocations();
 arcadeOpen=true;arcadePanel.classList.add('show');arcadePanel.setAttribute('aria-hidden','false');updateArcadeButton();showArcadeCanvas();
 const recommended=chapterArcadeType(activeChapter),won=chapterMarkerUnlocked(activeChapter);selectedArcadeType=recommended;arcadeStatus.textContent=won?TT('arcade.already','ÖDÜL DAHA ÖNCE AÇILDI'):TT('ui.ready','HAZIR');renderArcadeShelf(recommended);refreshArcadePreview(recommended);
}
function drawArcadeIdle(){showArcadeCanvas();const g=arcadeCanvas.getContext('2d'),w=arcadeCanvas.width,h=arcadeCanvas.height,d=arcadeDifficultyInfo(activeChapter),type=selectedArcadeType||chapterArcadeType(activeChapter),m=arcadeMeta(type);g.clearRect(0,0,w,h);const grad=g.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#070812');grad.addColorStop(1,'#020307');g.fillStyle=grad;g.fillRect(0,0,w,h);g.strokeStyle=m.accent||'#bd5cff';g.lineWidth=1;for(let y=24;y<h;y+=24){g.globalAlpha=.12;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}for(let x=28;x<w;x+=28){g.globalAlpha=.07;g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}g.globalAlpha=1;g.fillStyle=m.accent||'#f2d7ff';g.font='900 42px monospace';g.textAlign='center';g.fillText(m.icon||'◆',w/2,h/2-52);g.fillStyle='#f7efff';g.font='900 23px monospace';g.fillText(m.name||type,w/2,h/2-16);g.fillStyle='#ffe49c';g.font='bold 11px monospace';g.fillText(`${m.genre} · ${m.control} · ${d.name}`,w/2,h/2+10);g.fillStyle='#a9a2b2';g.font='11px monospace';const line=(m.brief||'').length>48?(m.brief||'').slice(0,47)+'…':m.brief;g.fillText(line,w/2,h/2+38);g.fillStyle='#c9a7ff';g.font='bold 10px monospace';g.fillText(TT('arcade.unlock','OYNA → BÖLÜM İŞARETÇİSİNİ AÇ'),w/2,h/2+68);}
function startArcadeGame(){stopArcadeRuntime();arcadePads.classList.remove('show');showArcadeCanvas();const t=selectedArcadeType||chapterArcadeType(activeChapter);if(t==='REFLEKS')startReflexArcade();else if(t==='YILAN')startSnakeArcade();else if(t==='HAFIZA')startMemoryArcade();else if(t==='RAKET')startPongArcade();else if(t==='KAÇIŞ')startDodgeArcade();else if(t==='KATMAN KIR')startBreakoutArcade();else if(t==='METEOR')startMeteorArcade();else if(t==='LABİRENT')startMazeArcade();else if(t==='2048')start2048Arcade();else if(t==='KUTU İT')startSokobanArcade();else if(t==='KOD KIR')startCodeArcade();else if(t==='SATRANÇ')startChessArcade();else if(t==='TAVLA')startBackgammonArcade();else startTasStratejiArcade();}
function startReflexArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height;const d=arcadeDifficultyInfo(activeChapter),need=d.reflexHits;let hits=0,deadline=performance.now()+d.reflexSec*1000,target={x:200,y:150,r:25};
 const move=()=>{target.x=35+Math.random()*(w-70);target.y=40+Math.random()*(h-80);target.r=20+Math.random()*11};move();
 const tap=e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)*w/b.width,y=(e.clientY-b.top)*h/b.height;if(Math.hypot(x-target.x,y-target.y)<=target.r+8){hits++;move();if(hits>=need)arcadeWin()}};
 c.addEventListener('pointerdown',tap);arcadeCleanup=()=>c.removeEventListener('pointerdown',tap);arcadeStatus.textContent=`${need} HEDEFİ ${d.reflexSec} SANİYEDE YAKALA`;
 function frame(t){if(!arcadeOpen)return;if(t>deadline){stopArcadeRuntime();arcadeStatus.textContent='SÜRE BİTTİ · TEKRAR DENE';drawArcadeIdle();return}
  g.fillStyle='#02040a';g.fillRect(0,0,w,h);g.strokeStyle='#5b174f';for(let y=25;y<h;y+=25){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
  g.beginPath();g.arc(target.x,target.y,target.r,0,Math.PI*2);g.fillStyle='#ff57dc';g.fill();g.strokeStyle='#fff';g.stroke();
  g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='left';g.fillText(`İSABET ${hits}/${need}`,12,22);g.textAlign='right';g.fillText(`${Math.max(0,(deadline-t)/1000).toFixed(1)} s`,w-12,22);arcadeRAF=requestAnimationFrame(frame)}
 arcadeRAF=requestAnimationFrame(frame);
}
function startMemoryArcade(){
 const d=arcadeDifficultyInfo(activeChapter),targetRounds=d.memoryRounds;const pads=[...arcadePads.querySelectorAll('button')];arcadePads.classList.add('show');const seq=[];let round=0,input=0,locked=true,intervalId=0;const timeouts=new Set();
 const later=(fn,ms)=>{const id=setTimeout(()=>{timeouts.delete(id);fn()},ms);timeouts.add(id);return id};
 const colors=['#ff477e','#52a8ff','#ffd452','#5cff93'];pads.forEach((p,i)=>p.style.background=colors[i]+'55');
 arcadeStatus.textContent=`DİZİYİ HATIRLA · ${targetRounds} TUR`;
 const light=(i,on)=>pads[i]&&pads[i].classList.toggle('lit',on);
 function showSeq(){locked=true;input=0;let k=0;if(intervalId)clearInterval(intervalId);intervalId=setInterval(()=>{pads.forEach((_,j)=>light(j,false));if(k>=seq.length){clearInterval(intervalId);intervalId=0;later(()=>{locked=false;arcadeStatus.textContent=`TUR ${round+1}/${targetRounds} · SIRA SENDE`},260);return}const idx=seq[k];light(idx,true);later(()=>light(idx,false),320);k++},560)}
 function next(){if(round>=targetRounds){arcadeWin();return}seq.push(Math.floor(Math.random()*4));showSeq()}
 const handlers=pads.map((p,i)=>{const f=()=>{if(locked)return;light(i,true);later(()=>light(i,false),120);if(i!==seq[input]){locked=true;arcadeStatus.textContent='YANLIŞ · TEKRAR OYNA';later(drawArcadeIdle,500);return}input++;if(input===seq.length){round++;locked=true;arcadeStatus.textContent='DOĞRU';later(next,520)}};p.addEventListener('pointerdown',f);return f});
 arcadeCleanup=()=>{if(intervalId)clearInterval(intervalId);intervalId=0;for(const id of timeouts)clearTimeout(id);timeouts.clear();pads.forEach((p,i)=>p.removeEventListener('pointerdown',handlers[i]));pads.forEach((_,j)=>light(j,false));};next();
}
function startDodgeArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height;const d=arcadeDifficultyInfo(activeChapter);let px2=w/2,blocks=[],start=performance.now(),lastSpawn=0,alive=true;
 arcadeStatus.textContent=`${d.dodgeSec} SANİYE DAYAN · PARMAĞINLA SAĞA/SOLA KAÇ`;
 const move=e=>{const b=c.getBoundingClientRect();px2=Math.max(18,Math.min(w-18,(e.clientX-b.left)*w/b.width))};c.addEventListener('pointermove',move);c.addEventListener('pointerdown',move);arcadeCleanup=()=>{c.removeEventListener('pointermove',move);c.removeEventListener('pointerdown',move)};
 function frame(t){if(!arcadeOpen||!alive)return;const elapsed=(t-start)/1000;if(elapsed>=d.dodgeSec){arcadeWin();return}if(t-lastSpawn>d.dodgeSpawn){lastSpawn=t;blocks.push({x:12+Math.random()*(w-44),y:-20,s:18+Math.random()*24,v:d.dodgeSpeed+Math.random()*(1.8+d.tier*.25)})}
  g.fillStyle='#02040a';g.fillRect(0,0,w,h);g.fillStyle='#63e6ff';g.fillRect(px2-17,h-35,34,16);
  for(const b of blocks){b.y+=b.v;g.fillStyle='#ff4f68';g.fillRect(b.x,b.y,b.s,b.s);if(b.y+b.s>h-38&&b.y<h-16&&b.x<px2+17&&b.x+b.s>px2-17){alive=false;stopArcadeRuntime();arcadeStatus.textContent='ÇARPTIN · TEKRAR DENE';drawArcadeIdle();return}}
  blocks=blocks.filter(b=>b.y<h+30);g.fillStyle='#fff';g.font='bold 14px monospace';g.textAlign='right';g.fillText(`${Math.max(0,d.dodgeSec-elapsed).toFixed(1)} s`,w-12,22);arcadeRAF=requestAnimationFrame(frame)}
 arcadeRAF=requestAnimationFrame(frame);
}



function startSnakeArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),cols=20,rows=14,cw=w/cols,ch=h/rows;
 let snake=[{x:7,y:7},{x:6,y:7},{x:5,y:7}],dir={x:1,y:0},next={x:1,y:0},food={x:14,y:7},eaten=0,last=performance.now(),dead=false,startX=0,startY=0;
 const placeFood=()=>{for(let tries=0;tries<100;tries++){const f={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)};if(!snake.some(q=>q.x===f.x&&q.y===f.y)){food=f;break}}};placeFood();
 const setDir=(dx,dy)=>{if(dx===-dir.x&&dy===-dir.y)return;next={x:dx,y:dy}};
 const down=e=>{const b=c.getBoundingClientRect();startX=(e.clientX-b.left)*w/b.width;startY=(e.clientY-b.top)*h/b.height};
 const up=e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)*w/b.width,y=(e.clientY-b.top)*h/b.height,dx=x-startX,dy=y-startY;if(Math.abs(dx)>Math.abs(dy)){if(Math.abs(dx)>12)setDir(dx>0?1:-1,0)}else if(Math.abs(dy)>12)setDir(0,dy>0?1:-1)};
 c.addEventListener('pointerdown',down);c.addEventListener('pointerup',up);arcadeCleanup=()=>{c.removeEventListener('pointerdown',down);c.removeEventListener('pointerup',up)};
 arcadeStatus.textContent=`YILAN · ${d.snakeFood} VERİ PARÇASI TOPLA · KAYDIRARAK YÖN VER`;
 function draw(){g.fillStyle='#03050a';g.fillRect(0,0,w,h);g.strokeStyle='#141a24';g.lineWidth=1;for(let x=0;x<=cols;x++){g.beginPath();g.moveTo(x*cw,0);g.lineTo(x*cw,h);g.stroke()}for(let y=0;y<=rows;y++){g.beginPath();g.moveTo(0,y*ch);g.lineTo(w,y*ch);g.stroke()}g.fillStyle='#ff62d5';g.beginPath();g.arc((food.x+.5)*cw,(food.y+.5)*ch,Math.min(cw,ch)*.28,0,Math.PI*2);g.fill();snake.forEach((q,i)=>{g.fillStyle=i===0?'#72f8ff':'#38aeb8';g.fillRect(q.x*cw+2,q.y*ch+2,cw-4,ch-4)});g.fillStyle='#fff';g.font='bold 12px monospace';g.textAlign='left';g.fillText(`VERİ ${eaten}/${d.snakeFood}`,10,17)}
 function fail(){dead=true;stopArcadeRuntime();arcadeStatus.textContent='YILAN ÇARPTI · TEKRAR DENE';draw()}
 function frame(t){if(!arcadeOpen||dead)return;if(t-last>=d.snakeStep){last=t;dir=next;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=cols||head.y<0||head.y>=rows||snake.some(q=>q.x===head.x&&q.y===head.y)){fail();return}snake.unshift(head);if(head.x===food.x&&head.y===food.y){eaten++;if(eaten>=d.snakeFood){draw();arcadeWin();return}placeFood()}else snake.pop();draw()}arcadeRAF=requestAnimationFrame(frame)}draw();arcadeRAF=requestAnimationFrame(frame);
}
function startPongArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter);let py=h/2,ay=h/2,ps=0,as=0,ball={x:w/2,y:h/2,vx:3.0+d.tier*.18,vy:2.1},last=performance.now();const ph=64;
 const move=e=>{const b=c.getBoundingClientRect();py=Math.max(ph/2,Math.min(h-ph/2,(e.clientY-b.top)*h/b.height))};c.addEventListener('pointermove',move);c.addEventListener('pointerdown',move);arcadeCleanup=()=>{c.removeEventListener('pointermove',move);c.removeEventListener('pointerdown',move)};
 const reset=side=>{ball.x=w/2;ball.y=h/2;ball.vx=(side||1)*(3+d.tier*.18);ball.vy=(Math.random()*.9+.5)*(Math.random()<.5?-1:1)*2.2};arcadeStatus.textContent=`RAKET · ${d.pongScore} SAYIYA İLK ULAŞ · PARMAĞINLA RAKETİ SÜR`;
 function frame(t){if(!arcadeOpen)return;const dt=Math.min(2,(t-last)/16.67);last=t;ay+=(ball.y-ay)*(.025*d.pongAI)*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.y<7||ball.y>h-7){ball.y=Math.max(7,Math.min(h-7,ball.y));ball.vy*=-1}
  if(ball.vx<0&&ball.x<26&&ball.x>15&&Math.abs(ball.y-py)<ph/2+7){ball.x=26;ball.vx=Math.abs(ball.vx)*1.025;ball.vy+=(ball.y-py)*.045}
  if(ball.vx>0&&ball.x>w-26&&ball.x<w-15&&Math.abs(ball.y-ay)<ph/2+7){ball.x=w-26;ball.vx=-Math.abs(ball.vx)*1.018;ball.vy+=(ball.y-ay)*.04}
  if(ball.x<-10){as++;if(as>=d.pongScore){stopArcadeRuntime();arcadeStatus.textContent='RAKİP KAZANDI · TEKRAR DENE';draw();return}reset(1)}if(ball.x>w+10){ps++;if(ps>=d.pongScore){draw();arcadeWin();return}reset(-1)}draw();arcadeRAF=requestAnimationFrame(frame)}
 function draw(){g.fillStyle='#03050a';g.fillRect(0,0,w,h);g.setLineDash([6,8]);g.strokeStyle='#37404f';g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.stroke();g.setLineDash([]);g.fillStyle='#63e6ff';g.fillRect(12,py-ph/2,10,ph);g.fillStyle='#ff79d9';g.fillRect(w-22,ay-ph/2,10,ph);g.fillStyle='#fff';g.beginPath();g.arc(ball.x,ball.y,7,0,Math.PI*2);g.fill();g.font='bold 22px monospace';g.textAlign='center';g.fillText(`${ps}  :  ${as}`,w/2,27)}draw();arcadeRAF=requestAnimationFrame(frame);
}
function startBreakoutArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter);const cols=8,rows=d.breakoutRows,bw=(w-36)/cols,bh=16;let bricks=[];for(let r=0;r<rows;r++)for(let x=0;x<cols;x++)bricks.push({x:18+x*bw,y:35+r*(bh+5),w:bw-4,h:bh,on:true});let px=w/2,lives=d.breakoutLives,ball={x:w/2,y:h-55,vx:d.breakoutSpeed,vy:-d.breakoutSpeed};
 const move=e=>{const b=c.getBoundingClientRect();px=Math.max(35,Math.min(w-35,(e.clientX-b.left)*w/b.width))};c.addEventListener('pointermove',move);c.addEventListener('pointerdown',move);arcadeCleanup=()=>{c.removeEventListener('pointermove',move);c.removeEventListener('pointerdown',move)};arcadeStatus.textContent=`KATMAN KIR · ${rows} SATIR · ${lives} CAN`;
 const reset=()=>{ball={x:px,y:h-55,vx:(Math.random()<.5?-1:1)*d.breakoutSpeed,vy:-d.breakoutSpeed}};
 function frame(){if(!arcadeOpen)return;ball.x+=ball.vx;ball.y+=ball.vy;if(ball.x<7||ball.x>w-7){ball.vx*=-1;ball.x=Math.max(7,Math.min(w-7,ball.x))}if(ball.y<7){ball.vy=Math.abs(ball.vy)}if(ball.y>h+12){lives--;if(lives<=0){stopArcadeRuntime();arcadeStatus.textContent='KATMAN ÇÖKMEDİ · TEKRAR DENE';draw();return}reset()}
  if(ball.vy>0&&ball.y>h-35&&ball.y<h-20&&Math.abs(ball.x-px)<38){ball.y=h-36;ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-px)*.035}
  for(const b of bricks)if(b.on&&ball.x>b.x-6&&ball.x<b.x+b.w+6&&ball.y>b.y-6&&ball.y<b.y+b.h+6){b.on=false;ball.vy*=-1;break}if(!bricks.some(b=>b.on)){draw();arcadeWin();return}draw();arcadeRAF=requestAnimationFrame(frame)}
 function draw(){g.fillStyle='#03050a';g.fillRect(0,0,w,h);bricks.forEach((b,i)=>{if(!b.on)return;g.fillStyle=`hsl(${285+(i%cols)*7} 75% ${48+(i%3)*8}%)`;g.fillRect(b.x,b.y,b.w,b.h)});g.fillStyle='#65e7ff';g.fillRect(px-34,h-24,68,9);g.fillStyle='#fff';g.beginPath();g.arc(ball.x,ball.y,6,0,Math.PI*2);g.fill();g.font='bold 12px monospace';g.textAlign='left';g.fillText(`CAN ${lives}`,10,18)}draw();arcadeRAF=requestAnimationFrame(frame);
}
function startMeteorArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter);let ship=w/2,meteors=[],bullets=[],start=performance.now(),lastSpawn=0,lastShot=0,score=0,dead=false;
 const move=e=>{const b=c.getBoundingClientRect();ship=Math.max(20,Math.min(w-20,(e.clientX-b.left)*w/b.width))};c.addEventListener('pointermove',move);c.addEventListener('pointerdown',move);arcadeCleanup=()=>{c.removeEventListener('pointermove',move);c.removeEventListener('pointerdown',move)};arcadeStatus.textContent=`METEOR · ${d.meteorSec} SANİYE DAYAN · ATIŞ OTOMATİK`;
 function frame(t){if(!arcadeOpen||dead)return;const elapsed=(t-start)/1000;if(elapsed>=d.meteorSec){draw();arcadeWin();return}if(t-lastSpawn>d.meteorSpawn){lastSpawn=t;meteors.push({x:12+Math.random()*(w-24),y:-15,r:8+Math.random()*8,v:d.meteorSpeed+Math.random()*1.25})}if(t-lastShot>330){lastShot=t;bullets.push({x:ship,y:h-38})}meteors.forEach(m=>m.y+=m.v);bullets.forEach(b=>b.y-=6.2);for(const b of bullets)for(const m of meteors)if(m.r>0&&Math.hypot(b.x-m.x,b.y-m.y)<m.r+4){m.r=0;b.y=-50;score++}meteors=meteors.filter(m=>m.r>0&&m.y<h+25);bullets=bullets.filter(b=>b.y>-10);for(const m of meteors)if(m.y>h-42&&Math.abs(m.x-ship)<m.r+16){dead=true;stopArcadeRuntime();arcadeStatus.textContent='METEOR ÇARPTI · TEKRAR DENE';draw();return}draw();arcadeRAF=requestAnimationFrame(frame)}
 function draw(){g.fillStyle='#02040a';g.fillRect(0,0,w,h);g.fillStyle='#ffffff22';for(let i=0;i<30;i++)g.fillRect((i*73)%w,(i*47)%h,1,1);g.fillStyle='#63e6ff';g.beginPath();g.moveTo(ship,h-44);g.lineTo(ship-16,h-20);g.lineTo(ship+16,h-20);g.closePath();g.fill();g.fillStyle='#ffe65c';bullets.forEach(b=>g.fillRect(b.x-2,b.y-7,4,10));meteors.forEach(m=>{g.fillStyle='#ff685e';g.beginPath();g.arc(m.x,m.y,m.r,0,Math.PI*2);g.fill()});g.fillStyle='#fff';g.font='bold 12px monospace';g.textAlign='left';g.fillText(`VURUŞ ${score}`,10,18);g.textAlign='right';g.fillText(`${Math.max(0,d.meteorSec-(performance.now()-start)/1000).toFixed(1)} s`,w-10,18)}draw();arcadeRAF=requestAnimationFrame(frame);
}


// ===== v5.5 · YENİ ARCADE OYUNLARI =====
function arcadeSwipeBinder(c,onSwipe){
 let sx=0,sy=0,active=false;
 const down=e=>{const b=c.getBoundingClientRect();sx=(e.clientX-b.left)*c.width/b.width;sy=(e.clientY-b.top)*c.height/b.height;active=true};
 const up=e=>{if(!active)return;active=false;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)*c.width/b.width,y=(e.clientY-b.top)*c.height/b.height,dx=x-sx,dy=y-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<12)return;onSwipe(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))};
 c.addEventListener('pointerdown',down);c.addEventListener('pointerup',up);return()=>{c.removeEventListener('pointerdown',down);c.removeEventListener('pointerup',up)};
}
function startMazeArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),cols=d.mazeSize,rows=d.mazeSize,W=1,E=2,S=4,N=8,grid=Array.from({length:rows},()=>Array(cols).fill(15));
 const seen=Array.from({length:rows},()=>Array(cols).fill(false)),stack=[[0,0]];seen[0][0]=true;const dirs=[[0,-1,N,S],[1,0,E,W],[0,1,S,N],[-1,0,W,E]];
 while(stack.length){const [x,y]=stack[stack.length-1],opts=dirs.map(v=>[...v,x+v[0],y+v[1]]).filter(v=>v[4]>=0&&v[4]<cols&&v[5]>=0&&v[5]<rows&&!seen[v[5]][v[4]]);if(!opts.length){stack.pop();continue}const q=opts[Math.floor(Math.random()*opts.length)],nx=q[4],ny=q[5];grid[y][x]&=~q[2];grid[ny][nx]&=~q[3];seen[ny][nx]=true;stack.push([nx,ny])}
 let px=0,py=0,start=performance.now(),done=false;const cw=Math.min((w-38)/cols,(h-58)/rows),ox=(w-cw*cols)/2,oy=32;
 const move=dir=>{if(done)return;const wall=dir==='up'?N:dir==='right'?E:dir==='down'?S:W,dx=dir==='right'?1:dir==='left'?-1:0,dy=dir==='down'?1:dir==='up'?-1:0;if(grid[py][px]&wall)return;px+=dx;py+=dy;draw();if(px===cols-1&&py===rows-1){done=true;arcadeStatus.textContent='LABİRENT · ÇIKIŞ BULUNDU';setTimeout(arcadeWin,260)}};
 const unbind=arcadeSwipeBinder(c,move);arcadeCleanup=unbind;arcadeStatus.textContent=`LABİRENT · ${cols}×${rows} · ${d.mazeSec} SANİYE · KAYDIR`;
 function draw(){g.fillStyle='#04100e';g.fillRect(0,0,w,h);g.fillStyle='#dffef6';g.font='bold 11px monospace';g.textAlign='left';g.fillText('BAŞLANGIÇ',10,18);g.textAlign='right';g.fillText('ÇIKIŞ',w-10,18);g.lineWidth=2;g.strokeStyle='#74e3c3';for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const X=ox+x*cw,Y=oy+y*cw,v=grid[y][x];g.beginPath();if(v&N){g.moveTo(X,Y);g.lineTo(X+cw,Y)}if(v&E){g.moveTo(X+cw,Y);g.lineTo(X+cw,Y+cw)}if(v&S){g.moveTo(X,Y+cw);g.lineTo(X+cw,Y+cw)}if(v&W){g.moveTo(X,Y);g.lineTo(X,Y+cw)}g.stroke()}g.fillStyle='#ffd86e';g.fillRect(ox+(cols-1)*cw+cw*.28,oy+(rows-1)*cw+cw*.28,cw*.44,cw*.44);g.fillStyle='#ffefff';g.beginPath();g.arc(ox+px*cw+cw/2,oy+py*cw+cw/2,Math.max(3,cw*.22),0,Math.PI*2);g.fill()}
 function frame(t){if(!arcadeOpen||done)return;const left=d.mazeSec-(t-start)/1000;if(left<=0){done=true;stopArcadeRuntime();arcadeStatus.textContent='LABİRENT · SÜRE BİTTİ · TEKRAR DENE';draw();return}g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='center';g.fillText(`${left.toFixed(1)} s`,w/2,18);arcadeRAF=requestAnimationFrame(frame)}draw();arcadeRAF=requestAnimationFrame(frame);
}
function start2048Arcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),target=d.numberTarget;let board=Array.from({length:4},()=>Array(4).fill(0)),locked=false;
 function empty(){const a=[];for(let r=0;r<4;r++)for(let q=0;q<4;q++)if(!board[r][q])a.push([r,q]);return a}
 function spawn(){const e=empty();if(!e.length)return;const [r,q]=e[Math.floor(Math.random()*e.length)];board[r][q]=Math.random()<.9?2:4}
 function slide(line){const a=line.filter(Boolean),b=[];for(let i=0;i<a.length;i++){if(i+1<a.length&&a[i]===a[i+1]){b.push(a[i]*2);i++}else b.push(a[i])}while(b.length<4)b.push(0);return b}
 function transpose(a){return a[0].map((_,i)=>a.map(r=>r[i]))}
 function changed(a,b){return JSON.stringify(a)!==JSON.stringify(b)}
 function move(dir){if(locked)return;const before=board.map(r=>r.slice());if(dir==='left')board=board.map(slide);else if(dir==='right')board=board.map(r=>slide(r.slice().reverse()).reverse());else{let t=transpose(board);if(dir==='up')t=t.map(slide);else t=t.map(r=>slide(r.slice().reverse()).reverse());board=transpose(t)}if(changed(before,board))spawn();draw();const mx=Math.max(...board.flat());if(mx>=target){locked=true;arcadeStatus.textContent=`2048 · ${target} TAŞINA ULAŞTIN`;setTimeout(arcadeWin,300);return}if(!empty().length&&!canMove()){locked=true;arcadeStatus.textContent='2048 · HAMLE KALMADI · TEKRAR DENE'}}
 function canMove(){for(let r=0;r<4;r++)for(let q=0;q<4;q++){if(!board[r][q])return true;if(q<3&&board[r][q]===board[r][q+1])return true;if(r<3&&board[r][q]===board[r+1][q])return true}return false}
 const unbind=arcadeSwipeBinder(c,move);arcadeCleanup=unbind;spawn();spawn();arcadeStatus.textContent=`2048 · HEDEF ${target} · KAYDIRARAK BİRLEŞTİR`;
 function draw(){g.fillStyle='#17110d';g.fillRect(0,0,w,h);const gap=7,size=Math.min((w-54)/4,(h-72)/4),ox=(w-(size*4+gap*3))/2,oy=38;g.fillStyle='#f2e6d5';g.font='bold 12px monospace';g.textAlign='center';g.fillText(`HEDEF ${target} · EN YÜKSEK ${Math.max(...board.flat())}`,w/2,20);for(let r=0;r<4;r++)for(let q=0;q<4;q++){const v=board[r][q],x=ox+q*(size+gap),y=oy+r*(size+gap);g.fillStyle=v?'#c89555':'#3b3029';g.fillRect(x,y,size,size);if(v){g.fillStyle=v>=128?'#fff7da':'#21170e';g.font=`900 ${v>=1024?17:22}px monospace`;g.fillText(v,x+size/2,y+size/2+8)}}}draw();
}
const SOKOBAN_LEVELS=[
 ['#######','#  .  #','#  $  #','#     #','#  @  #','#     #','#######'],
 ['########','# .  . #','# $  $ #','#      #','#  @   #','#      #','########'],
 ['########','# . . .#','# $ $ $#','#      #','#   @  #','#      #','########'],
 ['########','# .# . #','# $  $ #','#   #  #','#  @   #','#      #','########'],
 ['########','# .. . #','# $$ $ #','#      #','# #@   #','#      #','########'],
 ['########','# . . .#','# $#$ $#','#      #','#  @   #','#      #','########']
];
function startSokobanArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),raw=SOKOBAN_LEVELS[d.tier];let walls=new Set(),goals=new Set(),boxes=new Set(),px=0,py=0;const key=(x,y)=>`${x},${y}`,rows=raw.length,cols=raw[0].length;
 raw.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')walls.add(key(x,y));if(ch==='.'||ch==='*')goals.add(key(x,y));if(ch==='$'||ch==='*')boxes.add(key(x,y));if(ch==='@'){px=x;py=y}}));
 let moves=0,won=false;const move=dir=>{if(won)return;const dx=dir==='right'?1:dir==='left'?-1:0,dy=dir==='down'?1:dir==='up'?-1:0,nx=px+dx,ny=py+dy,nk=key(nx,ny);if(walls.has(nk))return;if(boxes.has(nk)){const bx=nx+dx,by=ny+dy,bk=key(bx,by);if(walls.has(bk)||boxes.has(bk))return;boxes.delete(nk);boxes.add(bk)}px=nx;py=ny;moves++;draw();if([...boxes].every(b=>goals.has(b))){won=true;arcadeStatus.textContent=`KUTU İT · ÇÖZÜLDÜ · ${moves} HAMLE`;setTimeout(arcadeWin,280)}};
 const unbind=arcadeSwipeBinder(c,move);arcadeCleanup=unbind;arcadeStatus.textContent='KUTU İT · TÜM KUTULARI IŞIKLI HEDEFLERE TAŞI';
 function draw(){g.fillStyle='#061018';g.fillRect(0,0,w,h);const cell=Math.min((w-34)/cols,(h-48)/rows),ox=(w-cell*cols)/2,oy=32;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const k=key(x,y),X=ox+x*cell,Y=oy+y*cell;if(walls.has(k)){g.fillStyle='#273646';g.fillRect(X,Y,cell,cell)}else{g.fillStyle='#0c1720';g.fillRect(X,Y,cell,cell);g.strokeStyle='#172733';g.strokeRect(X,Y,cell,cell)}if(goals.has(k)){g.strokeStyle='#ffd86a';g.lineWidth=3;g.strokeRect(X+cell*.25,Y+cell*.25,cell*.5,cell*.5)}if(boxes.has(k)){g.fillStyle=goals.has(k)?'#79e5a9':'#c58a55';g.fillRect(X+cell*.16,Y+cell*.16,cell*.68,cell*.68);g.strokeStyle='#f7e4c1';g.strokeRect(X+cell*.16,Y+cell*.16,cell*.68,cell*.68)}if(px===x&&py===y){g.fillStyle='#a9e8ff';g.beginPath();g.arc(X+cell/2,Y+cell/2,cell*.23,0,Math.PI*2);g.fill()}}g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='center';g.fillText(`HAMLE ${moves} · KUTU ${[...boxes].filter(b=>goals.has(b)).length}/${boxes.size}`,w/2,18)}draw();
}
function startCodeArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),pads=[...arcadePads.querySelectorAll('button')],colors=['#ff5277','#55a9ff','#ffd652','#63e897'],symbols=['●','■','▲','◆'];let hidden=[0,1,2,3].sort(()=>Math.random()-.5),guess=[],history=[],locked=false;
 const attempts=d.codeAttempts;arcadePads.classList.add('show');pads.forEach((p,i)=>{p.textContent=symbols[i];p.style.background=colors[i]+'66'});arcadeStatus.textContent=`KOD KIR · 4 SEMBOL · ${attempts} DENEME · TAM YER / YANLIŞ YER`;
 function score(a){let exact=0,mis=0,usedH=Array(4).fill(false),usedA=Array(4).fill(false);for(let i=0;i<4;i++)if(a[i]===hidden[i]){exact++;usedH[i]=usedA[i]=true}for(let i=0;i<4;i++)if(!usedA[i])for(let j=0;j<4;j++)if(!usedH[j]&&a[i]===hidden[j]){mis++;usedA[i]=usedH[j]=true;break}return[exact,mis]}
 const handlers=pads.map((p,i)=>{const f=()=>{if(locked)return;guess.push(i);draw();if(guess.length===4){const sc=score(guess);history.push({g:guess.slice(),sc});guess=[];draw();if(sc[0]===4){locked=true;arcadeStatus.textContent=`KOD KIR · ÇÖZÜLDÜ · ${history.length}/${attempts}`;setTimeout(arcadeWin,320)}else if(history.length>=attempts){locked=true;arcadeStatus.textContent=`KOD KIR · DENEME BİTTİ · KOD ${hidden.map(i=>symbols[i]).join('')}`}}};p.addEventListener('pointerdown',f);return f});
 arcadeCleanup=()=>{pads.forEach((p,i)=>p.removeEventListener('pointerdown',handlers[i]));pads.forEach(p=>{p.textContent='●';p.style.background=''})};
 function draw(){g.fillStyle='#0b0712';g.fillRect(0,0,w,h);g.fillStyle='#f3e9ff';g.font='bold 12px monospace';g.textAlign='center';g.fillText(`KOD KIR · DENEME ${history.length}/${attempts}`,w/2,20);const rowH=24,startY=44;history.slice(-8).forEach((r,ri)=>{const y=startY+ri*rowH;for(let i=0;i<4;i++){g.fillStyle=colors[r.g[i]];g.beginPath();g.arc(55+i*28,y,8,0,Math.PI*2);g.fill()}g.fillStyle='#bdeaff';g.textAlign='left';g.font='bold 10px monospace';g.fillText(`TAM ${r.sc[0]}  YERİ DEĞİŞİK ${r.sc[1]}`,190,y+4)});const y=h-34;g.textAlign='center';for(let i=0;i<4;i++){g.strokeStyle='#8a719f';g.strokeRect(w/2-58+i*30,y-10,20,20);if(guess[i]!=null){g.fillStyle=colors[guess[i]];g.beginPath();g.arc(w/2-48+i*30,y,7,0,Math.PI*2);g.fill()}}}draw();
}

const CHESS_PUZZLES=[
 {title:'MAT HAMLESİNİ BUL',pieces:{g8:'♚',g6:'♔',h6:'♕'},from:'h6',to:'g7'},
 {title:'AÇIK HATTA ŞAH ÇEK',pieces:{g8:'♚',g1:'♔',e1:'♖'},from:'e1',to:'e8'},
 {title:'AT ÇATALINI BUL',pieces:{h8:'♚',d8:'♛',g1:'♔',e5:'♘'},from:'e5',to:'f7'},
 {title:'FİLLE KRİTİK TAŞI AL',pieces:{g8:'♚',g1:'♔',c4:'♗',f7:'♟'},from:'c4',to:'f7'},
 {title:'TERFİ KARESİNE ULAŞ',pieces:{g8:'♚',g1:'♔',e7:'♙'},from:'e7',to:'e8'},
 {title:'VEZİRLE SON VURUŞ',pieces:{h8:'♚',g6:'♔',h5:'♕'},from:'h5',to:'h7'}
];
function sqRC(s){return {c:s.charCodeAt(0)-97,r:8-Number(s[1])}}
function startChessArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter),need=d.chessNeed,size=Math.min((w-44)/8,(h-54)/8),ox=(w-size*8)/2,oy=34;let selected=null,solved=0,p=null,glyph={};const timers=new Set();
 const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id};
 function loadPuzzle(){p=CHESS_PUZZLES[(d.tier+solved)%CHESS_PUZZLES.length];glyph={...p.pieces};selected=null;draw();arcadeStatus.textContent=`SATRANÇ · ${d.name} · TAKTİK ${solved+1}/${need}`}
 function draw(){g.fillStyle='#07080d';g.fillRect(0,0,w,h);g.fillStyle='#fff';g.font='bold 12px monospace';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(`${p?p.title:'SATRANÇ'} · ${solved}/${need}`,w/2,18);for(let r=0;r<8;r++)for(let col=0;col<8;col++){g.fillStyle=(r+col)%2?'#5b3b72':'#c8b7d8';g.fillRect(ox+col*size,oy+r*size,size,size);const sq=String.fromCharCode(97+col)+(8-r);if(selected===sq){g.strokeStyle='#ffdf65';g.lineWidth=3;g.strokeRect(ox+col*size+2,oy+r*size+2,size-4,size-4)}const pc=glyph[sq];if(pc){g.fillStyle=pc.charCodeAt(0)>9817?'#16131d':'#fff';g.font=`${size*.75}px serif`;g.textBaseline='middle';g.fillText(pc,ox+col*size+size/2,oy+r*size+size/2+2)}}}
 const tap=e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)*w/b.width,y=(e.clientY-b.top)*h/b.height,col=Math.floor((x-ox)/size),r=Math.floor((y-oy)/size);if(col<0||col>7||r<0||r>7)return;const sq=String.fromCharCode(97+col)+(8-r);if(!selected){if(glyph[sq]){selected=sq;draw()}}else if(selected===p.from&&sq===p.to){glyph[sq]=glyph[selected];delete glyph[selected];solved++;draw();if(solved>=need){arcadeStatus.textContent=`${need} TAKTİK DOĞRU · SATRANÇ ÖDÜLÜ`;later(arcadeWin,380)}else{arcadeStatus.textContent='DOĞRU · SIRADAKİ TAKTİK';later(loadPuzzle,420)}}else{selected=null;arcadeStatus.textContent='YANLIŞ HAMLE · AYNI TAKTİĞİ TEKRAR DENE';draw()}};
 c.addEventListener('pointerdown',tap);arcadeCleanup=()=>{c.removeEventListener('pointerdown',tap);for(const id of timers)clearTimeout(id);timers.clear()};loadPuzzle();
}
function startBackgammonArcade(){
 const c=arcadeCanvas,g=c.getContext('2d'),w=c.width,h=c.height,d=arcadeDifficultyInfo(activeChapter);let points=[0,0,0,0,0,0];const total=5+d.tier*2;for(let i=0;i<total;i++)points[i%6]++;let dice=[],borne=0,rolls=0,maxRolls=7+d.tier,failed=false,pending=0;
 function highest(){for(let i=5;i>=0;i--)if(points[i]>0)return i+1;return 0}
 function legal(point,die){if(points[point-1]<=0)return false;if(point===die)return true;return die>highest()&&point===highest()}
 function anyLegal(){return dice.some(die=>{for(let p=1;p<=6;p++)if(legal(p,die))return true;return false})}
 function failLimit(){failed=true;dice=[];stopArcadeRuntime();arcadeStatus.textContent='TUR SINIRI · TEKRAR DENE';draw()}
 function scheduleRoll(ms=280){if(pending)clearTimeout(pending);pending=setTimeout(()=>{pending=0;roll()},ms)}
 function endTurn(){dice=[];draw();if(borne>=total){arcadeWin();return}if(rolls>=maxRolls){failLimit();return}scheduleRoll()}
 function roll(){if(failed||dice.length)return;if(!points.some(n=>n>0)){arcadeWin();return}if(rolls>=maxRolls){failLimit();return}rolls++;const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);dice=a===b?[a,a,a,a]:[a,b];draw();if(!anyLegal()){arcadeStatus.textContent=`TAVLA · ZAR ${a}-${b} · HAMLE YOK, TUR GEÇİYOR`;scheduleRoll(520);dice=[];return}arcadeStatus.textContent=`TAVLA · ZAR ${a}-${b}${a===b?' · DÖRT HAMLE':''} · UYGUN HANEYE DOKUN`}
 function draw(){g.fillStyle='#120c08';g.fillRect(0,0,w,h);g.fillStyle='#f4e5c8';g.font='bold 12px monospace';g.textAlign='center';g.fillText(`TAVLA TOPLAMA · ${borne}/${total} · TUR ${rolls}/${maxRolls}`,w/2,18);const bw=w-40,baseY=h-35,pw=bw/6;for(let i=0;i<6;i++){const x=20+i*pw;g.fillStyle=i%2?'#7c392e':'#d7a668';g.beginPath();g.moveTo(x,baseY);g.lineTo(x+pw,baseY);g.lineTo(x+pw/2,55);g.closePath();g.fill();for(let k=0;k<points[i];k++){g.beginPath();g.arc(x+pw/2,baseY-14-k*20,8,0,Math.PI*2);g.fillStyle='#f5f1e7';g.fill();g.strokeStyle='#222';g.stroke()}g.fillStyle='#fff';g.fillText(String(i+1),x+pw/2,h-12)}if(dice.length){const dw=30,gap=6,totalW=dice.length*dw+(dice.length-1)*gap,sx=w/2-totalW/2;dice.forEach((v,i)=>{g.fillStyle='#fff';g.fillRect(sx+i*(dw+gap),28,dw,dw);g.fillStyle='#111';g.font='bold 17px monospace';g.fillText(v,sx+i*(dw+gap)+dw/2,49)})}}
 const tap=e=>{if(failed)return;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)*w/b.width,col=Math.floor((x-20)/((w-40)/6))+1;if(col<1||col>6)return;if(!dice.length){roll();return}let idx=dice.findIndex(die=>legal(col,die));if(idx<0){arcadeStatus.textContent='BU ZARLA O HANE ÇIKMAZ';return}points[col-1]--;borne++;dice.splice(idx,1);draw();if(borne>=total){arcadeWin();return}if(!dice.length||!anyLegal())endTurn()};
 c.addEventListener('pointerdown',tap);arcadeCleanup=()=>{c.removeEventListener('pointerdown',tap);if(pending)clearTimeout(pending);pending=0};arcadeStatus.textContent='TAVLA · ZAR ATMAK İÇİN TAHTAYA DOKUN';draw();
}
function startTasStratejiArcade(){
 showArcadeEmbed();arcadeStatus.textContent='TAŞ STRATEJİ · KAZANIRSAN İŞARETÇİ AÇILIR';const cfg=tasConfigForChapter(activeChapter);arcadeFrame.removeAttribute('srcdoc');arcadeFrame.src=TAS_STRATEJI_URL;
 const onMsg=e=>{const d=e.data||{};if(d.type==='TELKIN_TAS_READY'){try{arcadeFrame.contentWindow.postMessage({type:'TELKIN_TAS_CONFIG',...cfg},'*')}catch(_){}}else if(d.type==='TELKIN_TAS_RESULT'){if(d.winner==='human'){arcadeStatus.textContent='TAŞ STRATEJİ · KAZANDIN';arcadeWin()}else if(d.winner==='ai')arcadeStatus.textContent='TAŞ STRATEJİ · KAYBETTİN · TEKRAR DENE';else arcadeStatus.textContent='TAŞ STRATEJİ · BERABERE'}else if(d.type==='TELKIN_TAS_ERROR')arcadeStatus.textContent='TAŞ STRATEJİ AÇILAMADI';};window.addEventListener('message',onMsg);arcadeCleanup=()=>{window.removeEventListener('message',onMsg);arcadeFrame.removeAttribute('src');arcadeFrame.src='about:blank';showArcadeCanvas()};
}

const LOCATION_TYPE_NAMES={all:'TÜMÜ',home:'EVLER',work:'İŞ / KURUM',urban:'ŞEHİR',nature:'DOĞA',ancient:'ANTİK',cave:'MAĞARA',transport:'ULAŞIM',abstract:'DOKU / SOYUT'};
function openLocations(){cancelChapterAction();if(isStoryOpen)closeStory();if(isDialogueOpen)closeDlg();if(isUniverseOpen)closeUniverse();if(isChaptersOpen)closeChapters();isLocationsOpen=true;locationsPanel.classList.add('show');locationsPanel.setAttribute('aria-hidden','false');locationsBtn.classList.add('on');renderLocationPanel();setTimeout(()=>{try{locationSearch.focus({preventScroll:true})}catch(_){}},80);}
function closeLocations(){isLocationsOpen=false;locationsPanel.classList.remove('show');locationsPanel.setAttribute('aria-hidden','true');locationsBtn.classList.remove('on');}
function renderLocationPanel(){
 const types=['all','home','work','urban','nature','ancient','cave','transport','abstract'];
 const all=Object.entries(LOC_INFO).map(([id,v])=>({id,...v}));
 locationTabs.innerHTML=types.map(t=>{const count=t==='all'?all.length:all.filter(x=>x.type===t).length;return `<button class="${activeLocationType===t?'on':''}" data-type="${t}">${LOCATION_TYPE_NAMES[t]} · ${count}</button>`}).join('');
 locationTabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{activeLocationType=b.dataset.type;renderLocationPanel();});
 const q=(locationQuery||'').trim().toLocaleLowerCase('tr-TR');
 let list=all.filter(x=>(activeLocationType==='all'||x.type===activeLocationType)&&(!q||x.label.toLocaleLowerCase('tr-TR').includes(q)||x.id.toLocaleLowerCase('tr-TR').includes(q))).sort((a,b)=>a.label.localeCompare(b.label,'tr'));
 locationActions.innerHTML=`<button class="primary" id="randomLoc">RASTGELE MEKÂN</button>${activeAtlas?'<button id="exitLocAtlas">ANA EVRENE DÖN</button>':''}<button id="clearLocSearch">FİLTREYİ TEMİZLE</button>`;
 document.getElementById('randomLoc').onclick=()=>{const src=list.length?list:all;const r=src[Math.floor(Math.random()*src.length)];visitAtlasLocation(r.id,true,true)};
 const exit=document.getElementById('exitLocAtlas');if(exit)exit.onclick=()=>{closeLocations();exitAtlas()};
 document.getElementById('clearLocSearch').onclick=()=>{activeLocationType='all';locationQuery='';locationSearch.value='';renderLocationPanel()};
 locationGrid.innerHTML=list.length?list.map(x=>`<button class="locationCard ${activeAtlas===x.id?'active':''}" data-loc="${x.id}"><span class="locType">${LOCATION_TYPE_NAMES[x.type]||x.type.toUpperCase()}</span><strong>${x.label}</strong><small>${x.chapters.length} bölümde kullanılıyor · Bölüm ${x.chapters.slice(0,8).join(', ')}${x.chapters.length>8?'…':''}</small><span class="go">GİR →</span></button>`).join(''):'<div class="locEmpty">Bu filtrede mekân bulunamadı.</div>';
 locationGrid.querySelectorAll('.locationCard').forEach(b=>b.onclick=()=>visitAtlasLocation(b.dataset.loc,true,true));
}
function openChapters(){
 cancelChapterAction();if(isStoryOpen)closeStory();if(isDialogueOpen)closeDlg();if(isUniverseOpen)closeUniverse();if(isLocationsOpen)closeLocations();
 chapterMenuSelection=activeChapter;activeVolume=chapterByNo(chapterMenuSelection).vol;
 isChaptersOpen=true;chaptersPanel.classList.add('show');chaptersPanel.setAttribute('aria-hidden','false');chaptersBtn.classList.add('on');renderChapterPanel();
}
function closeChapters(){isChaptersOpen=false;chaptersPanel.classList.remove('show');chaptersPanel.setAttribute('aria-hidden','true');chaptersBtn.classList.remove('on');}
function selectChapterForReview(n){
 n=Math.max(1,Math.min(144,Math.floor(Number(n)||1)));chapterMenuSelection=n;activeVolume=chapterByNo(n).vol;renderChapterPanel();
 const card=chapterGrid.querySelector(`[data-ch="${n}"]`);if(card)card.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function renderChapterPanel(){
 locCount.textContent=Object.keys(LOC_INFO).length;doneCount.textContent=completedChapters.size;
 if(!CHAPTER_INDEX.has(chapterMenuSelection))chapterMenuSelection=activeChapter;
 if(chapterJumpInput)chapterJumpInput.value=chapterMenuSelection;
 volTabs.innerHTML=[1,2,3,4].map(v=>`<button data-vol="${v}" class="${activeVolume===v?'on':''}">CİLT ${v}</button>`).join('');
 volTabs.querySelectorAll('button').forEach(b=>b.onclick=()=>{activeVolume=+b.dataset.vol;const first=TELKIN_CHAPTERS.find(c=>c.vol===activeVolume);if(first)chapterMenuSelection=first.n;renderChapterPanel();});
 const list=TELKIN_CHAPTERS.filter(c=>c.vol===activeVolume);
 chapterGrid.innerHTML=list.map(c=>`<button class="chapterCard ${c.n===chapterMenuSelection?'active':''} ${completedChapters.has(c.n)?'done':''}" data-ch="${c.n}"><small>${String(c.n).padStart(3,'0')} · ${c.sourceLabel||('CİLT '+c.vol)}</small><strong>${c.title}</strong><small>${c.route.map(x=>LOC_INFO[x]?.label||x).join(' → ')}</small></button>`).join('');
 chapterGrid.querySelectorAll('.chapterCard').forEach(b=>b.onclick=()=>{chapterMenuSelection=+b.dataset.ch;if(chapterJumpInput)chapterJumpInput.value=chapterMenuSelection;renderChapterPanel();});
 const c=chapterByNo(chapterMenuSelection),route=c.route||[c.loc];
 chapterDetail.innerHTML=`<small>${c.sourceLabel||''}</small><h3>${String(c.n).padStart(3,'0')} · ${c.title}</h3><p>${c.intro}</p><div class="routeRow">${route.map((l,i)=>`<button class="routeChip" data-loc="${l}">${i+1}. ${LOC_INFO[l]?.label||l}</button>`).join('')}</div><p><b>ROTA:</b> ${route.length} mekân · <b>ANA SAHNE:</b> ${chapterSceneRanges(c).length} · <b>MİKRO İZ:</b> ${chapterSequence(c).length} · <b>OYUN MEKANİĞİ:</b> ${(c.mech&&c.mech.title)||'Bölüm akışı'} · <b>SİSTEM:</b> ${chapterSystem(c).systemBrief} · <b>OYUN İMZASI:</b> ${chapterExperience(c).flow}</p><p style="color:#efc77f"><b>SERBEST BÖLÜM:</b> 1–144 arasındaki istediğin bölümü doğrudan oynayabilirsin. Bu seçim kayıtlı ana ilerlemeni silmez veya geri almaz.</p><div class="cActions"><button class="primary" id="startChapter">BU BÖLÜMÜ OYNA</button><button id="restartFromOne">↺ 1. BÖLÜMDEN OYNA</button><button id="prevChapter">← ÖNCEKİ</button><button id="nextChapterAtlas">SONRAKİ →</button>${inspectionMode?'<button id="returnProgress">KAYITLI OYUNA DÖN</button>':''}${activeAtlas?'<button id="exitAtlas">ANA EVRENE DÖN</button>':''}</div>`;
 chapterDetail.querySelectorAll('.routeChip').forEach(b=>b.onclick=()=>{Game.toast('Önce “BU BÖLÜMÜ OYNA” ile bölümü aç; sonra rota görev sırasıyla çalışır.',1700);});
 document.getElementById('startChapter').onclick=()=>beginChapterInspection(chapterMenuSelection);
 document.getElementById('restartFromOne').onclick=()=>beginChapterInspection(1);
 document.getElementById('prevChapter').onclick=()=>selectChapterForReview(chapterMenuSelection-1);
 document.getElementById('nextChapterAtlas').onclick=()=>selectChapterForReview(chapterMenuSelection+1);
 const rp=document.getElementById('returnProgress');if(rp)rp.onclick=returnFromInspection;
 const ex=document.getElementById('exitAtlas');if(ex)ex.onclick=exitAtlas;
}
function visitAtlasLocation(loc,remember=true,browse=false){if(!LOC_INFO[loc])return;if(!activeAtlas&&remember)atlasReturn={x:px,z:pz,yaw:yaw};atlasBrowseMode=!!browse;activeAtlas=loc;buildAtlasScene(loc);atlasBadge.textContent=`${LOC_INFO[loc].label} · ${atlasBrowseMode?'SERBEST MEKÂN ATLASI · BİRLEŞİK OYUN':'144 BÖLÜMLÜK OYUN · 3D EVREN'}`;atlasBadge.classList.add('show');closeChapters();closeLocations();{const sp=chapterSpawnPoint(loc);hubTeleport(sp[0],sp[1],(activeChapter===2&&loc==='management')?-2.12:Math.PI,LOC_INFO[loc].label);}if(atlasBrowseMode){clearChapterTargetVisual();clearChapterExperience();objectiveEl.textContent=`${LOC_INFO[loc].label.toUpperCase()} · SERBEST KEŞİF · 108 MEKÂN MENÜSÜNDEN DİĞER SAHNELERE GEÇ`;}else setTimeout(syncChapterTargetVisual,240);}
function syncInspectionBar(){
 if(!inspectionBar)return;
 inspectionBar.classList.toggle('show',inspectionMode);inspectionBar.setAttribute('aria-hidden',inspectionMode?'false':'true');
 if(inspectionMode){inspectionLabel.textContent=`SERBEST OYUN · BÖLÜM ${String(activeChapter).padStart(3,'0')}`;inspectionPrev.disabled=activeChapter<=1;inspectionNext.disabled=activeChapter>=144;atlasBadge.classList.remove('show');}
}
function beginChapterInspection(n){
 n=Math.max(1,Math.min(144,Math.floor(Number(n)||1)));
 if(!inspectionMode){saveGame(true);inspectionMode=true;}
 closeChapters();startChapter(n,true);Game.toast(`SERBEST OYUN · BÖLÜM ${n} · KAYITLI İLERLEME KORUNUYOR`,2100);
}
function returnFromInspection(){
 if(!inspectionMode)return;
 cancelChapterAction();if(isDialogueOpen)closeDlg();if(isChaptersOpen)closeChapters();
 inspectionMode=false;syncInspectionBar();activeAtlas=null;atlasObjs.length=0;atlasCollisions.length=0;clearChapterTargetVisual();clearChapterExperience();restoreWorldLights();
 const ok=loadGame();syncStoryUI();updateArcadeButton();if(ok)syncRestoredModeUI();renderChapterPanel();
 Game.toast(ok?`KAYITLI OYUNA DÖNÜLDÜ · BÖLÜM ${activeChapter}`:'Ana kayıt bulunamadı.',1900);
}
function startChapter(n,asInspection=false){
 if(asInspection)inspectionMode=true;
 atlasBrowseMode=false;atlasReturn=null;activeAtlas=null;atlasObjs.length=0;atlasCollisions.length=0;clearChapterTargetVisual();
 activeChapter=n;if(!inspectionMode)updateFurthestChapter(n);activeVolume=chapterByNo(n).vol;chapterMenuSelection=n;chapterSeqIndex=0;chapterMechanicDone=false;chapterCompleteShown=false;chapterMechanicBriefed=false;dialogueQueue.length=0;dialogueAfter=null;cancelChapterAction();
 const c=chapterByNo(n),seq=chapterSequence(c),first=(seq[0]&&seq[0].loc)||((c.route&&c.route[0])||c.loc);
 visitAtlasLocation(first,false,false);syncInspectionBar();updateArcadeButton();
 if(n===8)setTimeout(()=>Game.toast('BÖLÜM 8 · FIRIN SOKAĞI · TÜM HEDEFLER SOKAKTA',1900),180);
 setTimeout(()=>{
   syncChapterTargetVisual();applyChapterExperience(c);if(!inspectionMode)saveGame(true);
   openChapterInterlude(chapterPrelude(c),()=>{
     const fs=seq[0],ap=actionProfile(fs);
     objectiveEl.textContent=`${inspectionMode?'SERBEST OYUN · ':''}BÖLÜM ${c.n} · ${(fs&&fs.goal)||'İLK HEDEFİ BUL'}`;
     Game.toast(`İLK SAHNE: ${sceneTitle(c,fs)} · ${ap.label}`,2100);
   });
 },420);
}
function completeActiveChapter(){
 const c=chapterByNo(activeChapter);if(chapterCompleteShown)return;
 chapterCompleteShown=true;clearChapterTargetVisual();const finishedExp=chapterExperience(c);if(chapterIdentity)chapterIdentity.classList.remove('show');if(!inspectionMode){completedChapters.add(c.n);updateFurthestChapter(c.n<144?c.n+1:144);saveChapterProgress();doneCount.textContent=completedChapters.size;saveGame(true);}gameModeBadge.classList.remove('show');
 if(c.n<144){
   const next=chapterByNo(c.n+1);
   objectiveEl.textContent=`BÖLÜM ${c.n} TAMAMLANDI · ÖZET`;
   openChapterInterlude(chapterRecap(c),()=>{
     gameModeBadge.textContent=`BÖLÜM ${next.n} YÜKLENİYOR`;
     gameModeBadge.classList.add('show');
     setTimeout(()=>startChapter(next.n,inspectionMode),180);
   });
 }else{
   objectiveEl.textContent='TELKİN TAMAMLANDI · 144/144';
   openChapterInterlude(chapterRecap(c),()=>{gameModeBadge.classList.remove('show');});
 }
}
function launchChapterMechanic(c){
 if(!c.mech||chapterMechanicDone){completeActiveChapter();return;}
 cancelChapterAction();const sys=chapterSystem(c),exp=chapterExperience(c);
 const openMechanic=()=>{gameModeBadge.textContent=`BÖLÜM ${c.n} · ${exp.style.label} · ${c.mech.title||'BÖLÜM İÇİ EYLEM'}`;gameModeBadge.classList.add('show');saveGame(true);Mechanics.open(c.mech,()=>{chapterMechanicDone=true;gameModeBadge.classList.remove('show');completeActiveChapter();});};
 if(!chapterMechanicBriefed){chapterMechanicBriefed=true;saveGame(true);showDlg(`BÖLÜM İÇİ EYLEM · ${sys.systemTitle}`,`${sys.systemBrief}\n\nBu bölümde topladığın fiziksel izler şimdi tek bir kurala bağlanacak.\nAkış: ${exp.flow}`,openMechanic);return;}
 openMechanic();
}
function advanceChapter(){
 const c=chapterByNo(activeChapter),seq=chapterSequence(c);
 if(chapterSeqIndex>=seq.length){launchChapterMechanic(c);return;}
 const st=seq[chapterSeqIndex];
 if(activeAtlas!==st.loc){enterChapterStepLocation(st);return;}
 const start=chapterSeqIndex,end=sceneGroupEnd(seq,start),pages=makeSceneTranscript(c,seq,start,end);
 const afterScene=()=>{
   for(let i=start;i<=end;i++)settleConversationActor(seq[i]);
   chapterSeqIndex=end+1;saveGame(true);
   if(chapterSeqIndex>=seq.length){clearChapterTargetVisual();launchChapterMechanic(c);return;}
   const next=seq[chapterSeqIndex];
   if(activeAtlas!==next.loc)enterChapterStepLocation(next);else syncChapterTargetVisual();
 };
 const longPlay=window.TELKIN_LONG_PLAY;
 const sm=sceneMetaForStep(c,start),locLabel=LOC_INFO[seq[start]?.loc||activeAtlas]?.label||c.locLabel||'TELKİN';
 // v6.22: canon anlatı artık 144 bölümün tam uzun roman metnidir. Eski özet/cutscene yalnız yükleme hatasında fallback.
 if(longPlay&&longPlay.map&&longPlay.map[String(c.n)]){
   longPlay.play(c,sm.index,locLabel,afterScene);
 }else if(shouldAnimateScene(c,seq,start,end))playSceneCutscene(c,seq,start,end,afterScene,pages);else showDlgSequence(pages,afterScene);
}
function exitAtlas(){const ret=atlasReturn||{x:0,z:46,yaw:0};clearChapterTargetVisual();clearChapterExperience();atlasBrowseMode=false;activeAtlas=null;atlasObjs.length=0;atlasCollisions.length=0;atlasBadge.classList.remove('show');restoreWorldLights();closeChapters();hubTeleport(ret.x,ret.z,ret.yaw,'GÖRÜNEN DÜNYA');atlasReturn=null;syncStoryUI();}

function flashSaved(){if(!saveMark)return;saveMark.classList.add('show');clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveMark.classList.remove('show'),900);}
function saveGame(quiet=false){
 if(inspectionMode)return true; // v3.8.2: inceleme ana kaydı asla ezmez
 try{
  environmentState.hub.rearDoorOpen=!!doorOpen;
  const payload={version:SAVE_SCHEMA_VERSION,mode:'chapter',px,pz,yaw,pitch,story,audioOn,nihyelActive,activeChapter,chapterSeqIndex,activeVolume,activeAtlas,atlasReturn,atlasBrowseMode,chapterMechanicDone,chapterMechanicBriefed,chapterCompleteShown,furthestChapter,completedChapters:[...completedChapters],arcadeUnlockedChapters:[...arcadeUnlockedChapters],environmentState};
  localStorage.setItem(SAVE_KEY,JSON.stringify(payload));saveChapterProgress();if(!quiet)flashSaved();
 }catch(e){reportSaveError(e);}
}

function canonicalChapterLocation(){
 if(atlasBrowseMode)return activeAtlas;
 const c=chapterByNo(activeChapter),seq=chapterSequence(c);
 if(chapterSeqIndex>=0&&chapterSeqIndex<seq.length&&seq[chapterSeqIndex]&&LOC_INFO[seq[chapterSeqIndex].loc])return seq[chapterSeqIndex].loc;
 const r=(c&&c.route)||[];
 return (r[0]&&LOC_INFO[r[0]])?r[0]:((c&&c.loc&&LOC_INFO[c.loc])?c.loc:activeAtlas);
}
function chapterResumeSanity(x,z){
 const c=chapterByNo(activeChapter),seq=chapterSequence(c),st=seq[chapterSeqIndex];
 if(!st||!activeAtlas||st.loc!==activeAtlas||!Number.isFinite(x)||!Number.isFinite(z))return [x,z,false];
 let [tx,tz]=chapterStepPosition(c,st);
 // Tasarlanmış görevler kompakt. 18 m üzeri mesafe kayıt/ofset hatasıdır, yürütülmez.
 if(Math.hypot(x-tx,z-tz)>18){
   const sp=chapterSpawnPoint(activeAtlas);
   return [sp[0],sp[1],true];
 }
 return [x,z,false];
}

function loadGame(){
 try{
  // v2.8.1: yalnız ilk bulunan save'i kullanma. Tüm eski sürümleri tara, completed setlerini birleştir
  // ve ulaşılan en ileri bölümü kanonik devam noktası olarak koru.
  const saveCandidates=[];
  for(const k of [SAVE_KEY,...LEGACY_SAVE_KEYS]){try{const r=localStorage.getItem(k);if(!r)continue;const q=migrateSaveData(JSON.parse(r));if(q&&q.mode==='chapter')saveCandidates.push(q);}catch(_){}}
  if(!saveCandidates.length)return false;
  for(const q of saveCandidates)if(Array.isArray(q.completedChapters))for(const n of q.completedChapters){const x=Number(n);if(CHAPTER_INDEX.has(x))completedChapters.add(x);}
  for(const q of saveCandidates)if(Array.isArray(q.arcadeUnlockedChapters))for(const n of q.arcadeUnlockedChapters){const x=Number(n);if(CHAPTER_INDEX.has(x))arcadeUnlockedChapters.add(x);}
  let legacyFurthest=1;
  for(const q of saveCandidates){const a=Number(q.activeChapter),f=Number(q.furthestChapter);if(Number.isFinite(a)&&CHAPTER_INDEX.has(a))legacyFurthest=Math.max(legacyFurthest,a);if(Number.isFinite(f)&&CHAPTER_INDEX.has(f))legacyFurthest=Math.max(legacyFurthest,f);}
  // En ileri kaydı ana durum kaydı seç; eşitlikte yeni SAVE_KEY ilk sırada olduğu için onu korur.
  saveCandidates.sort((a,b)=>Math.max(Number(b.furthestChapter)||1,Number(b.activeChapter)||1)-Math.max(Number(a.furthestChapter)||1,Number(a.activeChapter)||1));
  const d=saveCandidates[0];
  story=Object.assign(story,d.story||{});
  // Aynı ilerleme seviyesindeki yeni kayıt çevre durumunu taşır; eski şemalarda boş güvenli durum kullanılır.
  const envSource=saveCandidates.find(q=>q&&q.environmentState&&typeof q.environmentState==='object')||d;
  environmentState=normalizeEnvironmentState(envSource.environmentState);
  doorOpen=!!environmentState.hub.rearDoorOpen;doorAngle=doorOpen?-Math.PI*.48:0;doorHandlePress=0;
  const savedChapter=(Number.isFinite(Number(d.activeChapter))&&CHAPTER_INDEX.has(Number(d.activeChapter)))?Number(d.activeChapter):1;
  const contiguous=contiguousResumeChapter();
  const savedFurthest=(Number.isFinite(Number(d.furthestChapter))&&CHAPTER_INDEX.has(Number(d.furthestChapter)))?Number(d.furthestChapter):savedChapter;
  furthestChapter=Math.max(1,savedFurthest,savedChapter,legacyFurthest,contiguous);
  // Canonical resume is monotonic. Replaying an older chapter from the menu is allowed during the session,
  // but closing the browser can never erase the furthest story point already reached.
  const resumeChapter=Math.min(144,furthestChapter);
  const upgraded=resumeChapter!==savedChapter;
  activeChapter=resumeChapter;activeVolume=chapterByNo(activeChapter).vol;
  if(upgraded){
    chapterSeqIndex=0;chapterMechanicDone=false;chapterMechanicBriefed=false;chapterCompleteShown=false;atlasBrowseMode=false;atlasReturn=null;
    const c=chapterByNo(activeChapter),seq=chapterSequence(c);activeAtlas=(seq[0]&&seq[0].loc)||((c.route&&c.route[0])||c.loc);
  }else{
    chapterSeqIndex=Number.isFinite(Number(d.chapterSeqIndex))?Math.max(0,Math.floor(Number(d.chapterSeqIndex))):0;
    atlasReturn=d.atlasReturn&&Number.isFinite(d.atlasReturn.x)&&Number.isFinite(d.atlasReturn.z)?d.atlasReturn:null;
    atlasBrowseMode=!!d.atlasBrowseMode;chapterMechanicDone=!!d.chapterMechanicDone;chapterMechanicBriefed=!!d.chapterMechanicBriefed;chapterCompleteShown=!!d.chapterCompleteShown;
    activeAtlas=(typeof d.activeAtlas==='string'&&LOC_INFO[d.activeAtlas])?d.activeAtlas:null;
  }
  nihyelActive=!!d.nihyelActive&&!!story.nihyelUnlocked;audioOn=!!d.audioOn;
  // v2.9.5: kayıt hangi eski sahneyi söylerse söylesin, fiziksel görev hangi mekândaysa orası kanoniktir.
  if(!atlasBrowseMode){
    const expectedLoc=canonicalChapterLocation();
    if(expectedLoc&&LOC_INFO[expectedLoc]&&activeAtlas!==expectedLoc){
      console.warn('[TELKİN] Save location canonicalized:',activeAtlas,'→',expectedLoc,'chapter',activeChapter,'step',chapterSeqIndex);
      activeAtlas=expectedLoc;atlasReturn=null;
    }
  }
  if(activeAtlas&&LOC_INFO[activeAtlas])buildAtlasScene(activeAtlas);
  let sx=upgraded?NaN:(Number.isFinite(d.px)?d.px:px),sz=upgraded?NaN:(Number.isFinite(d.pz)?d.pz:pz);
  {const sane=chapterResumeSanity(sx,sz);sx=sane[0];sz=sane[1];if(sane[2])console.warn('[TELKİN] Resume target distance repaired:',activeChapter,chapterSeqIndex);}
  if(activeAtlas&&(!Number.isFinite(sx)||!Number.isFinite(sz)||Math.hypot(sx-AX,sz-AZ)>32)){const sp=chapterSpawnPoint(activeAtlas);sx=sp[0];sz=sp[1];console.warn('[TELKİN] Resume/spawn canonicalized:',activeChapter,activeAtlas);}
  let safe=(Number.isFinite(sx)&&Number.isFinite(sz))?findNearestFree(sx,sz,3.5):null;
  if(!safe&&activeAtlas){const sp=chapterSpawnPoint(activeAtlas);safe=findNearestFree(sp[0],sp[1],4.8)||sp;}
  if(safe){px=safe[0];pz=safe[1];}
  if(!upgraded&&Number.isFinite(d.yaw))yaw=d.yaw;else yaw=(activeChapter===2&&activeAtlas==='management')?-2.12:Math.PI;
  if(Number.isFinite(d.pitch))pitch=Math.max(-.12,Math.min(.55,d.pitch));
  const seq=chapterSequence(chapterByNo(activeChapter));if(chapterSeqIndex>seq.length)chapterSeqIndex=0;
  mahirYaw=mahirTargetYaw=yaw;saveChapterProgress();saveGame(true);return true;
 }catch(e){console.warn('[TELKİN] Kayıt yüklenemedi:',e);return false;}
}

function syncRestoredModeUI(){
 doneCount.textContent=completedChapters.size;
 if(!activeAtlas||atlasBrowseMode||!LOC_INFO[activeAtlas]){return false;}
 if(activeAtlas&&LOC_INFO[activeAtlas]){
  atlasBadge.textContent=`${LOC_INFO[activeAtlas].label} · ${atlasBrowseMode?'SERBEST MEKÂN ATLASI':'BÖLÜM '+activeChapter}`;atlasBadge.classList.add('show');
  if(atlasBrowseMode)objectiveEl.textContent=`${LOC_INFO[activeAtlas].label.toUpperCase()} · SERBEST KEŞİF · 108 MEKÂN MENÜSÜNDEN DİĞER SAHNELERE GEÇ`;
  else {
    const c=chapterByNo(activeChapter),seq=chapterSequence(c);if(chapterSeqIndex>seq.length)chapterSeqIndex=0;
    if(chapterCompleteShown){objectiveEl.textContent=c.n===144?'TELKİN TAMAMLANDI · 144/144':`BÖLÜM ${c.n} TAMAMLANDI`;}
    else if(chapterSeqIndex>=seq.length){
      clearChapterTargetVisual();objectiveEl.textContent=`BÖLÜM ${c.n} · ${c.title} · BÖLÜM İÇİ EYLEM`;
      if(chapterMechanicDone)setTimeout(()=>completeActiveChapter(),120);else setTimeout(()=>launchChapterMechanic(c),160);
    }else{objectiveEl.textContent=`BÖLÜM ${c.n} · ${c.title} · GÖREV ${chapterSeqIndex+1}/${seq.length}`;setTimeout(syncChapterTargetVisual,0);}
  }
 }else{atlasBadge.classList.remove('show');}
 return true;
}
function updateObjective(){
 if(activeAtlas&&!atlasBrowseMode){updateChapterObjective();return;}
 let msg='SERBEST KEŞİF · TELKİN EVRENİ';
 if(!story.homeTrace)msg='İZ 1/4 · MAHİR’İN EVİNDE DUVARDAKİ FOTOĞRAFI İNCELE';
 else if(!story.minaTrace)msg='İZ 2/4 · MİNA HATTI’NDA MASADAKİ ÇİZİMİ İNCELE';
 else if(!story.caveTrace)msg='İZ 3/4 · MAĞARANIN DERİNLİĞİNDEKİ ANORMAL İZİ BUL';
 else if(!story.riftSeen)msg=nihyelActive?'İZ 4/4 · NİHYEL AÇIK · DOKU EŞİĞİNE GİT':'İZ 4/4 · NİHYEL’İ AÇ VE DOKU EŞİĞİNE DÖN';
 else msg='EVREN ÇEKİRDEĞİ TAMAM · GÖRÜNEN DÜNYA İLE DOKU ARASINDAKİ İLK BAĞ KURULDU';
 if(objectiveEl)objectiveEl.textContent=msg;
}
function syncStoryUI(){
 if(story.nihyelUnlocked){nihyelBtn.classList.add('show')}else{nihyelBtn.classList.remove('show');nihyelActive=false;}
 nihyelBtn.classList.toggle('on',nihyelActive);nihyelVeil.classList.toggle('on',nihyelActive);
 nihyelBtn.textContent=nihyelActive?'NİHYEL: AÇIK':'NİHYEL';
 syncUniverseRuntime();updateObjective();
}
function setNihyel(on){
 if(!story.nihyelUnlocked){showDlg('NİHYEL','Bu algı henüz uyanmadı. Mağaradaki fiziksel anomaliyi anlamadan Mahir, Doku’nun izlerini ayırt edemez.');return;}
 nihyelActive=!!on;syncStoryUI();if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.setNihyel(nihyelActive);else if(audioOn&&dokuGain&&audioCtx)dokuGain.gain.setTargetAtTime(nihyelActive?.045:.0001,audioCtx.currentTime,.22);
}
// v0.10 ses motoru: tamamen Web Audio ile, dış dosya yok.
let audioCtx=null,audioOn=false,masterGain=null,rainGain=null,humGain=null,caveGain=null,dokuGain=null,footClock=0;
const keys=Object.create(null);
const isPaused=()=>cutsceneOpen||chapterInterludeOpen||isDialogueOpen||isStoryOpen||isUniverseOpen||isChaptersOpen||isLocationsOpen||arcadeOpen||isMechanicOpen||interactionBusy||mahirUseAction.active;
function blocked(x,z){
 const r=.22;
 if(activeAtlas){
  for(const b of atlasCollisions)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;
  for(const d of atlasDynamicCollisions){if(!d||!d.object||!d.active())continue;const b=atlasObjectBounds(d.object,d.pad||.08);if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;}
  for(const o of atlasObjs)if(o.kind==='npc3d'){const rr=.34*(npcProfile(o.character)?.build||1);if((x-o.x)*(x-o.x)+(z-o.z)*(z-o.z)<(r+rr)*(r+rr))return true;}
  return false;
 }
 for(const b of collisions)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;
 for(const d of dynamicCollisions){const b=typeof d.bounds==='function'?d.bounds():d.bounds;if(d.active()&&x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;}
 for(const o of objs)if(o.kind==='npc3d'){const rr=.34*(npcProfile(o.character)?.build||1);if((x-o.x)*(x-o.x)+(z-o.z)*(z-o.z)<(r+rr)*(r+rr))return true;}
 if(z>14.0&&z<17.85&&Math.abs(x)>1.32)return true;
 return false;
}
function findNearestFree(x,z,radius=3.2){
 if(!blocked(x,z))return [x,z];
 for(let r=.35;r<=radius;r+=.35){for(let k=0;k<16;k++){const a=k*Math.PI/8,tx=x+Math.cos(a)*r,tz=z+Math.sin(a)*r;if(!blocked(tx,tz))return [tx,tz];}}
 return null;
}
// v6.12: Fiziksel hareketi kısa alt-adımlara böler. Böylece düşük FPS / ani kare
// sıçramalarında ince engellerin bir sonraki örneklemede atlanması ihtimali ortadan kalkar.
function moveWithCollision(dx,dz){
 const dist=Math.hypot(dx,dz),steps=Math.max(1,Math.ceil(dist/.085));
 const sx=dx/steps,sz=dz/steps;let movedX=0,movedZ=0;
 for(let i=0;i<steps;i++){
  if(!blocked(px+sx,pz)){px+=sx;movedX+=sx;}
  if(!blocked(px,pz+sz)){pz+=sz;movedZ+=sz;}
 }
 return Math.hypot(movedX,movedZ);
}
function walkLineClear(x0,z0,x1,z1){
 const d=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(d/.18));
 for(let i=1;i<=n;i++){const q=i/n,x=x0+(x1-x0)*q,z=z0+(z1-z0)*q;if(blocked(x,z))return false;}
 return true;
}
// Hedef serbest bir noktada olsa bile arada duvar/engel bulunabilir. Bu tarama oyuncunun
// bulunduğu bağlı yürüyüş bölgesini bulur ve gerekiyorsa hedefi aynı bölgedeki en yakın noktaya taşır.
function reachableTargetFrom(sx,sz,tx,tz){
 const start=findNearestFree(sx,sz,1.8)||findNearestFree(AX,AZ+5.2,4.5);
 const target=findNearestFree(tx,tz,2.4)||[tx,tz];
 if(!start)return {x:target[0],z:target[1],repaired:false,reachable:false};
 if(walkLineClear(start[0],start[1],target[0],target[1]))return {x:target[0],z:target[1],repaired:false,reachable:true};
 const step=.46,half=13.4,minX=AX-half,maxX=AX+half,minZ=AZ-half,maxZ=AZ+half;
 const key=(x,z)=>Math.round((x-minX)/step)+','+Math.round((z-minZ)/step);
 const q=[[start[0],start[1]]],seen=new Set([key(start[0],start[1])]);let head=0,best=[start[0],start[1]],bestD=Math.hypot(start[0]-target[0],start[1]-target[1]);
 const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 while(head<q.length&&head<4200){
  const [x,z]=q[head++],d=Math.hypot(x-target[0],z-target[1]);if(d<bestD){bestD=d;best=[x,z];if(d<.58)return {x:target[0],z:target[1],repaired:false,reachable:true};}
  for(const [ix,iz] of dirs){const nx=x+ix*step,nz=z+iz*step;if(nx<minX||nx>maxX||nz<minZ||nz>maxZ)continue;const k=key(nx,nz);if(seen.has(k))continue;seen.add(k);if(blocked(nx,nz))continue;if(ix&&iz&&(blocked(x+ix*step,z)||blocked(x,z+iz*step)))continue;q.push([nx,nz]);}
 }
 return {x:best[0],z:best[1],repaired:bestD>.58,reachable:false,distance:bestD};
}
function groundY(x,z){
 if(activeAtlas){let y=0;for(const zone of atlasGroundZones){if(zone?.type!=='steps')continue;for(const st of zone.steps||[])if(x>=st.x1&&x<=st.x2&&z>=st.z1&&z<=st.z2)y=Math.max(y,st.y||0);}return y;}
 if(z<=14.10)return 0;
 if(z<17.70){if(Math.abs(x)>1.32)return 0;const step=Math.floor((z-14.10)/.45+0.001);return -Math.min(.96,step*.12);}
 return -.96;
}
function zoneName(){if(activeAtlas)return atlasBrowseMode?`MEKÂN ATLASI · ${LOC_INFO[activeAtlas]?.label||activeAtlas}`:`BÖLÜM ${activeChapter} · ${LOC_INFO[activeAtlas]?.label||activeAtlas}`;if(nihyelActive&&pz>55)return 'DOKU EŞİĞİ · NİHYEL ALGILAMASI';if(pz<-66&&pz>-103&&Math.abs(px)<6)return pz<-93?'MAĞARA · KRİZ ODASI':'MAĞARA · GÖRÜNEN DÜNYA';if(px<-43&&px>-57&&pz>-6&&pz<6)return 'MİNA HATTI · YAŞAM ALANI';if(px>43&&px<57&&pz>-6&&pz<6)return 'MAHİR’İN EVİ';if(pz>55)return 'DOKU EŞİĞİ · GÖRÜNEN DÜNYA';if(pz>40)return 'SESSİZ MEYDAN';if(pz>27.8)return 'GECE SOKAĞI';if(pz>22.3)return 'BİNA ÖNÜ';if(pz>17.7)return 'BİNA GİRİŞİ';if(pz>13.2)return 'MERDİVEN';if(pz>4)return 'İŞ HANI KORİDORU';if(px>5)return 'ARKA ODA';return "MAHİR'İN OFİSİ";}

function extractFrustumPlanes(m){
 const raw=[
  [m[3]+m[0],m[7]+m[4],m[11]+m[8],m[15]+m[12]],
  [m[3]-m[0],m[7]-m[4],m[11]-m[8],m[15]-m[12]],
  [m[3]+m[1],m[7]+m[5],m[11]+m[9],m[15]+m[13]],
  [m[3]-m[1],m[7]-m[5],m[11]-m[9],m[15]-m[13]],
  [m[3]+m[2],m[7]+m[6],m[11]+m[10],m[15]+m[14]],
  [m[3]-m[2],m[7]-m[6],m[11]-m[10],m[15]-m[14]]
 ];
 for(const p of raw){const q=Math.hypot(p[0],p[1],p[2])||1;p[0]/=q;p[1]/=q;p[2]/=q;p[3]/=q;}return raw;
}
function inFrustum(o,planes){
 const r=o.kind==='box'?Math.hypot(o.sx,o.sy,o.sz)*.52:Math.hypot(o.w,o.h)*.55;
 const y=o.kind==='box'?o.y:(o.y||0)+o.h*.5;
 for(const p of planes)if(p[0]*o.x+p[1]*y+p[2]*o.z+p[3]<-r)return false;return true;
}
function normalizeRGBA(c){
 if(c && typeof c!=='string' && typeof c.length==='number' && c.length>=4){
   const r=Number(c[0]),g=Number(c[1]),b=Number(c[2]),a=Number(c[3]);
   if(Number.isFinite(r)&&Number.isFinite(g)&&Number.isFinite(b)&&Number.isFinite(a))return [r,g,b,a];
 }
 return [1,1,1,1];
}
function drawObj(o,vp,cam,planes){
 if((o.name==='nihyelThread'||o.name==='nihyelNode')&&!nihyelActive)return;
 if(o&&(o.__hideForCamera||o.__hideForDialogue))return;
 if(!inFrustum(o,planes))return;
 let m;
 if(o.kind==='box'){
   m=model(o.x,o.y,o.z,o.sx/2,o.sy/2,o.sz/2,o.ry||0);
   bind(cubeBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);
   gl.uniform2f(U.uvScale,o.uv[0],o.uv[1]);useTexture(tex[o.texture]||tex.white);
   gl.uniform1i(U.tex,0);gl.uniform4fv(U.color,normalizeRGBA(o.color));gl.uniform1f(U.useTex,o.texture?1:0);gl.uniform1f(U.emissive,o.em||0);gl.uniform1f(U.alphaCut,0);
   gl.drawArrays(gl.TRIANGLES,0,36);
 } else {
   const syaw=Math.atan2(cam[0]-o.x,cam[2]-o.z);
   m=model(o.x,o.y||0,o.z,o.w,o.h,1,syaw);
   bind(quadBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);
   gl.uniform2f(U.uvScale,1,1);useTexture(tex[o.texture]||tex.white);gl.uniform4f(U.color,1,1,1,1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,.94);gl.uniform1f(U.alphaCut,.02);
   gl.drawArrays(gl.TRIANGLES,0,6);
 }
}
function resetCameraOccluders(){
 for(const o of currentOccluders)o.__hideForCamera=false;
 currentOccluders.length=0;
}
function shouldOccludeCamera(o){
 if(!o||o.kind!=='box')return false;
 let st=o.__occStatic;
 if(st===undefined){
   const n=(o.name||'').toLowerCase(),t=(o.texture||'').toLowerCase();
   st=!(/floor|ceiling|rug|puddle|glow|fire|water|marker|shadow|thread|node/.test(n)||o.sy<.45||(t==='white'&&o.sy<.7&&o.sx<.4&&o.sz<.4));
   o.__occStatic=st;
 }
 if(!st)return false;
 return !(o.em&&o.em>.85);
}
function segmentAABBFrac(a,b,min,max){
 let tmin=0,tmax=1;
 for(let i=0;i<3;i++){
   const d=b[i]-a[i];
   if(Math.abs(d)<1e-6){if(a[i]<min[i]||a[i]>max[i])return null;continue;}
   let t1=(min[i]-a[i])/d,t2=(max[i]-a[i])/d;
   if(t1>t2){const tmp=t1;t1=t2;t2=tmp;}
   if(t1>tmin)tmin=t1;
   if(t2<tmax)tmax=t2;
   if(tmin>tmax)return null;
 }
 return tmin;
}
const _occMin=[0,0,0],_occMax=[0,0,0];
function resolveCameraOcclusion(target,desired,list){
 resetCameraOccluders();
 let best=1,hit=null;
 for(const o of list){
   if(!shouldOccludeCamera(o))continue;
   const min=_occMin,max=_occMax;
   const c=Math.abs(Math.cos(o.ry||0)),s=Math.abs(Math.sin(o.ry||0)),ex=(c*o.sx+s*o.sz)/2,ez=(s*o.sx+c*o.sz)/2;
   min[0]=o.x-ex-.08;min[1]=o.y-o.sy/2-.08;min[2]=o.z-ez-.08;
   max[0]=o.x+ex+.08;max[1]=o.y+o.sy/2+.08;max[2]=o.z+ez+.08;
   const t=segmentAABBFrac(target,desired,min,max);
   if(t!==null&&t>.02&&t<best){best=t;hit=o;}
 }
 let cam=desired;
 if(hit){
   const safe=Math.max(.36,best-.10);
   cam=[target[0]+(desired[0]-target[0])*safe,target[1]+(desired[1]-target[1])*safe,target[2]+(desired[2]-target[2])*safe];
 }
 for(const o of list){
   if(!shouldOccludeCamera(o))continue;
   const min=_occMin,max=_occMax;
   const c=Math.abs(Math.cos(o.ry||0)),s=Math.abs(Math.sin(o.ry||0)),ex=(c*o.sx+s*o.sz)/2,ez=(s*o.sx+c*o.sz)/2;
   min[0]=o.x-ex;min[1]=o.y-o.sy/2;min[2]=o.z-ez;
   max[0]=o.x+ex;max[1]=o.y+o.sy/2;max[2]=o.z+ez;
   const t=segmentAABBFrac(target,cam,min,max);
   if(t!==null&&t>.05&&t<.98){o.__hideForCamera=true;currentOccluders.push(o);}
 }
 return cam;
}
function shortestAngle(a,b){let d=(b-a+Math.PI)%(Math.PI*2)-Math.PI;if(d<-Math.PI)d+=Math.PI*2;return d;}
function yawOffset(lx,lz,ry){const c=Math.cos(ry),sn=Math.sin(ry);return [c*lx+sn*lz,-sn*lx+c*lz];}
function segmentPose(px0,py0,pz0,len,angle,bodyYaw){
 const ly=-len*.5*Math.cos(angle),lz=-len*.5*Math.sin(angle),off=yawOffset(0,lz,bodyYaw);
 const ey=-len*Math.cos(angle),ez=-len*Math.sin(angle),endOff=yawOffset(0,ez,bodyYaw);
 return {cx:px0+off[0],cy:py0+ly,cz:pz0+off[1],ex:px0+endOff[0],ey:py0+ey,ez:pz0+endOff[1]};
}
function drawPrimitive(buf,count,x,y,z,sx,sy,sz,rx,ry,color,vp,em=0){
 const m=modelYX(x,y,z,sx,sy,sz,rx,ry);bind(buf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);gl.uniform2f(U.uvScale,1,1);
 useTexture(tex.white);gl.uniform1i(U.tex,0);gl.uniform4fv(U.color,normalizeRGBA(color));gl.uniform1f(U.useTex,0);gl.uniform1f(U.emissive,em);gl.uniform1f(U.alphaCut,0);gl.drawArrays(gl.TRIANGLES,0,count);
}

function npcFacingYaw(o){
 if(o.active||isDialogueOpen||interactionBusy){
   const dx=px-o.x,dz=pz-o.z;if(dx*dx+dz*dz<36)return Math.atan2(dx,dz);
 }
 return Number.isFinite(o.ry)?o.ry:0;
}
function npcIsSpeaking(o){
 if(!o.active)return false;
 const c=chapterByNo(activeChapter),seq=chapterSequence(c),st=seq[chapterSeqIndex];
 if(!st||st.kind!=='talk')return false;
 const who=canonicalCharacterName(st.char||st.speaker||st.label);
 return who&&who===o.character&&(isDialogueOpen||interactionBusy);
}
// ---------- v2.9.5: NATIVE OFFLINE NPC PATH ----------
// Harici asset bridge kaldırıldı. NPC'ler doğrudan TELKİN'in native WebGL renderer'ında çizilir.
function drawNPCShadow(o,vp,planes){
 if(!o||!inFrustum(o,planes))return;
 const gy=groundY(o.x,o.z),p=npcProfile(o.character);if(!p)return;
 drawPrimitive(sphereBuf,sphereCount,o.x,gy+.012,o.z,.24*(p.build||1),.010,.15*(p.build||1),0,0,[0,0,0,.25],vp,0);
}
function drawNPC3D(o,vp,planes){
 if(!o||!inFrustum(o,planes))return;
 const p=npcProfile(o.character);if(!p)return;
 const gy=groundY(o.x,o.z),k=p.h/1.78,b=p.build||1,ry=npcFacingYaw(o);
 const t=performance.now()*.001+(o.seed||0),speaking=npcIsSpeaking(o),moving=(o.moveAmount||0)>.06;
 const walkWave=moving?Math.sin(o.movePhase||0):0,walkAbs=moving?Math.abs(Math.cos(o.movePhase||0)):0;
 const breathe=Math.sin(t*1.8)*.0035*k,talkWave=speaking?Math.sin(t*3.7):0,talkWave2=speaking?Math.sin(t*2.8+1.1):0,inspecting=o.actorState==='inspect';
 const idleShift=moving?0:Math.sin(t*.75)*.006*k,phaseLift=o.actorState==='phase'?(.035+.025*Math.sin(t*18))*k:0;
 const y0=gy+breathe+phaseLift+(moving?walkAbs*.015*k:0);
 const skin=p.skin,hair=p.hair,top=p.top,top2=p.top2,pants=p.pants,shoe=p.shoe,glow=p.glow||0;
 const sh=p.shoulder||1,waist=p.waist||.88,hipShape=p.hip||.96,headS=p.head||.97;
 const faceGlow=p.faceGlow==null?.055:Math.min(.08,p.faceGlow*.62);
 const face=[Math.min(1,skin[0]*1.035+.012),Math.min(1,skin[1]*1.035+.012),Math.min(1,skin[2]*1.035+.012),1];
 const eye=p.eye||[.16,.11,.08,1],lip=p.lip||[.36,.17,.17,1],brow=p.brow||hair;
 const female=p.gender==='f';
 const bp=(t*.27+(o.seed||0)*.37)%1,blinkK=(p.uncanny||bp>=.045)?1:Math.max(.12,Math.abs(bp-.0225)/.0225);
 // Ayaklar: daha küçük, zemine basan insan oranı.
 for(const side of [-1,1]){
   let q=yawOffset(side*.090*b*k,.060*k,ry);
   drawPrimitive(cubeBuf,36,o.x+q[0],y0+.047*k,o.z+q[1],.078*b*k,.047*k,.145*k,0,ry,shoe,vp,.015);
 }
 // Bacaklar: uyluk ve baldır farklı kalınlıkta; silindir-manken görünümü azaltılır.
 const hipY=y0+.86*k,hipX=.095*b*hipShape*k,upper=.39*k,lower=.385*k;
 for(const side of [-1,1]){
   const ho=yawOffset(side*hipX,0,ry),hx=o.x+ho[0],hz=o.z+ho[1];
   const a=moving?(walkWave*(side<0?-.34:.34)):(speaking?.018*talkWave:0)+(side<0?idleShift:-idleShift);
   const th=segmentPose(hx,hipY,hz,upper,a,ry);
   drawPrimitive(cylBuf,cylCount,th.cx,th.cy,th.cz,.066*b*k,upper*.5,.066*b*k,a,ry,pants,vp,.01);
   const ca=segmentPose(th.ex,th.ey,th.ez,lower,-a*.30,ry);
   drawPrimitive(cylBuf,cylCount,ca.cx,ca.cy,ca.cz,.052*b*k,lower*.5,.052*b*k,-a*.30,ry,pants,vp,.01);
 }
 // Pelvis, bel ve göğüs üç ayrı yumuşak hacim: tek büyük silindir yerine insan silueti.
 drawPrimitive(sphereBuf,sphereCount,o.x,y0+.895*k,o.z,.155*b*hipShape*k,.115*k,.105*b*k,0,ry,pants,vp,.008);
 drawPrimitive(sphereBuf,sphereCount,o.x,y0+1.090*k,o.z,.158*b*waist*k,.225*k,.102*b*k,0,ry,top2,vp,.018);
 drawPrimitive(sphereBuf,sphereCount,o.x,y0+1.285*k,o.z,.205*b*sh*k,.220*k,.108*b*k,0,ry,top,vp,.025+glow*.14);
 // Bilim insanı/doktorlarda dış katman: tek parça parlak gövde yerine ince laboratuvar ceketi.
 if(p.labCoat){drawPrimitive(cubeBuf,36,o.x,y0+1.175*k,o.z,.205*b*sh*k,.335*k,.112*b*k,0,ry,[.60,.62,.63,1],vp,.025);}
 // Omuz eklemleri gövde-kol birleşimini yumuşatır.
 const shoulderY=y0+1.39*k,shoulderX=.245*b*sh*k,upperA=.275*k,lowerA=.255*k;
 for(const side of [-1,1]){
   const so=yawOffset(side*shoulderX,0,ry),sx0=o.x+so[0],sz0=o.z+so[1];
   drawPrimitive(sphereBuf,sphereCount,sx0,shoulderY,sz0,.068*b*k,.075*k,.068*b*k,0,ry,top,vp,.03);
   const gesture=moving?(walkWave*(side<0?.22:-.22)):(speaking?(side<0?-.15-.18*Math.max(0,talkWave):.08+.25*Math.max(0,talkWave2)):(inspecting?(side<0?-.10:.22):(side<0?.020:-.020)*Math.sin(t*1.2)));
   const up=segmentPose(sx0,shoulderY-.015*k,sz0,upperA,gesture,ry);
   drawPrimitive(cylBuf,cylCount,up.cx,up.cy,up.cz,.048*b*k,upperA*.5,.048*b*k,gesture,ry,top,vp,.02+glow*.10);
   const elbow=gesture+(speaking?(side<0?-.18:.24):.06),fa=segmentPose(up.ex,up.ey,up.ez,lowerA,elbow,ry);
   drawPrimitive(cylBuf,cylCount,fa.cx,fa.cy,fa.cz,.040*b*k,lowerA*.5,.040*b*k,elbow,ry,top2,vp,.015);
   drawPrimitive(sphereBuf,sphereCount,fa.ex,fa.ey-.010*k,fa.ez,.044*b*k,.055*k,.041*b*k,0,ry,face,vp,faceGlow*.45);
 }
 // Boyun: kısa ve daha dar.
 drawPrimitive(cylBuf,cylCount,o.x,y0+1.505*k,o.z,.041*b*k,.046*k,.041*b*k,0,ry,face,vp,faceGlow*.45);
 // Baş: kafatası + çene + yüz düzlemi. Ciltte hafif emissive dolgu, sert siyah yarım-yüzü önler.
 const hy=y0+1.665*k,hw=.104*b*headS*k,hh=.132*headS*k,hd=.087*b*headS*k;
 drawPrimitive(sphereBuf,sphereCount,o.x,hy,o.z,hw,hh,hd,0,ry,skin,vp,faceGlow*.70);
 let jawO=yawOffset(0,.030*k,ry);
 drawPrimitive(sphereBuf,sphereCount,o.x+jawO[0],hy-.070*k,o.z+jawO[1],hw*.78,hh*.57,hd*.82,0,ry,face,vp,faceGlow*.85);
 // Kulaklar.
 for(const side of [-1,1]){
   let eo=yawOffset(side*hw*.98,-.004*k,ry);
   drawPrimitive(sphereBuf,sphereCount,o.x+eo[0],hy-.005*k,o.z+eo[1],.018*k,.030*k,.012*k,0,ry,face,vp,faceGlow*.75);
 }
 // Saç: yüzün önünü kapatmayan arka/top hacimler ve karaktere göre yan tutamlar.
 let back=yawOffset(0,-.050*k,ry);
 if(p.hairType==='long'){
   drawPrimitive(sphereBuf,sphereCount,o.x+back[0],hy+.020*k,o.z+back[1],hw*1.12,hh*1.04,hd*1.10,0,ry,hair,vp,.03+glow*.05);
   for(const side of [-1,1]){let q=yawOffset(side*hw*.88,-.030*k,ry);drawPrimitive(sphereBuf,sphereCount,o.x+q[0],hy-.125*k,o.z+q[1],.040*b*k,.145*k,.045*b*k,0,ry,hair,vp,.02);}
 }else if(p.hairType==='bob'){
   drawPrimitive(sphereBuf,sphereCount,o.x+back[0],hy+.030*k,o.z+back[1],hw*1.055,hh*.86,hd*1.04,0,ry,hair,vp,.025);
   for(const side of [-1,1]){let q=yawOffset(side*hw*.92,-.020*k,ry);drawPrimitive(sphereBuf,sphereCount,o.x+q[0],hy-.070*k,o.z+q[1],.030*b*k,.082*k,.034*b*k,0,ry,hair,vp,.015);}
   // Nisan/Suna tipi bobda hafif ön perçem; yüzü maske gibi kapatmaz.
   let fr=yawOffset(-.030*b*k,.073*k,ry);drawPrimitive(sphereBuf,sphereCount,o.x+fr[0],hy+.090*k,o.z+fr[1],.048*b*k,.024*k,.016*b*k,0,ry,hair,vp,.02);
 }else{
   drawPrimitive(sphereBuf,sphereCount,o.x+back[0],hy+.072*k,o.z+back[1],hw*1.08,hh*.52,hd*1.10,0,ry,hair,vp,.025);
 }
 // Yüz yönü: göz akı + iris + kaş + burun + ağız. Artık beyaz maskeye iki siyah delik hissi yok.
 const faceZ=.096*b*headS*k;
 for(const side of [-1,1]){
   let e1=yawOffset(side*.038*b*headS*k,faceZ,ry);
   drawPrimitive(sphereBuf,sphereCount,o.x+e1[0],hy+.020*k,o.z+e1[1],.0105*k,.0060*k*blinkK,.0038*k,0,ry,p.uncanny?[.12,.20,.24,1]:[.90,.88,.84,1],vp,p.uncanny?.24:.08);
   let e2=yawOffset(side*.038*b*headS*k,faceZ+.006*k,ry);
   drawPrimitive(sphereBuf,sphereCount,o.x+e2[0],hy+.020*k,o.z+e2[1],.0043*k,.0043*k*blinkK,.0030*k,0,ry,eye,vp,p.uncanny?.75:.05);
   let br=yawOffset(side*.038*b*headS*k,faceZ-.002*k,ry);
   drawPrimitive(cubeBuf,36,o.x+br[0],hy+.054*k,o.z+br[1],.023*k,.0045*k,.0048*k,0,ry,brow,vp,.02);
 }
 let no=yawOffset(0,faceZ+.010*k,ry);
 drawPrimitive(cylBuf,cylCount,o.x+no[0],hy-.012*k,o.z+no[1],.010*b*k,.022*k,.010*b*k,.22,ry,face,vp,faceGlow*.55);
 let nt=yawOffset(0,faceZ+.020*k,ry);drawPrimitive(sphereBuf,sphereCount,o.x+nt[0],hy-.030*k,o.z+nt[1],.011*b*k,.010*k,.009*b*k,0,ry,face,vp,faceGlow*.5);
 let mo=yawOffset(0,faceZ+.012*k,ry);
 drawPrimitive(sphereBuf,sphereCount,o.x+mo[0],hy-.055*k,o.z+mo[1],.017*b*k,.0036*k,.0038*k,0,ry,lip,vp,.035);
 // Çene ucu, özellikle yandan bakışta kafa-küre etkisini kırar.
 let ch=yawOffset(0,.050*k,ry);drawPrimitive(sphereBuf,sphereCount,o.x+ch[0],hy-.105*k,o.z+ch[1],.038*b*k,.025*k,.030*b*k,0,ry,face,vp,faceGlow*.65);
}


// ---------- v3.8.2: MAHİR İLE AYNI GÖRSEL DİLDE FOTO-GERÇEK ANA KADRO ----------
const REAL_NPC_VISUAL={
 'EREN':{scale:1.00,width:.42},
 'MİNA':{scale:1.00,width:.39},
 'NİSAN':{scale:1.00,width:.43},
 'BARAN':{scale:1.00,width:.47},
 'KAYITÇI':{scale:1.00,width:.42},
 'LEYLA':{scale:1.00,width:.44},
 'SELİN':{scale:1.00,width:.43},
 'SUNA':{scale:1.00,width:.45},
 'MUHAFIZ':{scale:1.00,width:.48},
 'DOKTOR':{scale:1.00,width:.44}
};
function drawRealNPCSprite(o,vp,cam,planes){
 if(!o||!hasRealNPCSprite(o.character)||!inFrustum(o,planes))return;
 const p=npcProfile(o.character)||{},gy=groundY(o.x,o.z),moving=(o.moveAmount||0)>.06;
 const dir=characterViewDirection(o,cam),state=characterAnimState(o);
 const t=characterFrameTexture(o.character,dir,state);
 const syaw=Math.atan2(cam[0]-o.x,cam[2]-o.z);
 const phase=o.movePhase||0;
 const speaking=npcIsSpeaking(o),listening=o.actorState==='talk'&&!speaking;
 const breathe=moving?0:Math.sin(performance.now()*.0018+(o.seed||0))*.005;
 const bob=moving?Math.abs(Math.sin(phase))*0.022:0;
 const sway=moving?Math.sin(phase)*0.018:0;
 const talkLean=speaking?Math.sin(performance.now()*.004+(o.seed||0))*.009:0;
 const listenLean=listening?-.006:0;
 const vis=REAL_NPC_VISUAL[o.character]||{scale:1,width:.46};
 const pack=characterPack(o.character)||{};
 const h=(p.h||1.72)*(pack.scale||vis.scale||1)*(1+breathe);
 const width=h*(pack.widthRatio||vis.width||.46)*(p.build||1);
 const offX=Math.cos(syaw)*(sway+talkLean+listenLean),offZ=-Math.sin(syaw)*(sway+talkLean+listenLean);
 drawPrimitive(sphereBuf,sphereCount,o.x+offX,gy+.012,o.z+offZ,width*.44,.018,width*.22,0,0,[.018,.020,.022,.34],vp,0);
 const m=model(o.x+offX,gy-.045+bob,o.z+offZ,width,h,1,syaw);
 bind(quadBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);
 gl.uniform2f(U.uvScale,1,1);useTexture(t);gl.uniform1i(U.tex,0);
 gl.uniform4f(U.color,1,1,1,1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,.50);gl.uniform1f(U.alphaCut,.025);
 gl.drawArrays(gl.TRIANGLES,0,6);
}
// ---------- v0.7.4: GERÇEKÇİ YÖNLÜ MAHİR ----------
function mahirViewDirection(cam){
 // Kamera Mahir'in hangi tarafındaysa o görünüş seçilir. Düzlem kameraya bakar,
 // fakat karakterin dünya yönü mahirYaw ile korunur; bu yüzden karton gibi dönmez.
 const camYaw=Math.atan2(cam[0]-px,cam[2]-pz);
 const rel=shortestAngle(mahirYaw,camYaw);
 const a=Math.abs(rel);
 if(a<Math.PI*.25)return 'front';
 if(a>Math.PI*.75)return 'back';
 return rel>0?'left':'right';
}
function mahirAnimState(){
 if(mahirMoveAmount<.075)return 'idle';
 return Math.sin(mahirWalkPhase)>=0?'walk1':'walk2';
}
function drawMahirShadow(vp){
 const pose=mahirVisualPose(),gy=groundY(px,pz),sc=pose.shadowScale||1;
 // İnce elipsoid: karakteri zemine bağlayan ucuz ama etkili temas gölgesi.
 drawPrimitive(sphereBuf,sphereCount,pose.x,gy+.012,pose.z,.29*sc,.010,.18*sc,0,0,[0,0,0,.32],vp,0);
}
function drawMahirSprite(vp,cam){
 const gy=groundY(px,pz),pose=mahirVisualPose();
 const dir=mahirViewDirection(cam),state=mahirUseAction.active||mahirSeatState.active?'idle':mahirAnimState();
 const key=`mahir_${dir}_${state}`;
 const t=tex[key]||tex.mahir_front_idle||tex.white;
 // Billboard yönlü sprite kalır; v6.18'de taşıyıcı düzlem beden kullanımına göre eğilip/alçalır.
 const syaw=Math.atan2(cam[0]-pose.x,cam[2]-pose.z);
 const idleBreath=(!mahirUseAction.active&&!mahirSeatState.active&&mahirMoveAmount<.075)?Math.sin(performance.now()*.0019)*.006:0;
 const m=modelYX(pose.x,gy-.050+pose.yOffset,pose.z,.84,1.80*(pose.heightScale||1)*(1+idleBreath),1,pose.tilt||0,syaw);
 bind(quadBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);
 gl.uniform2f(U.uvScale,1,1);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(U.tex,0);
 gl.uniform4f(U.color,1,1,1,1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,.56);gl.uniform1f(U.alphaCut,.02);
 gl.drawArrays(gl.TRIANGLES,0,6);
}

// ---------- v2.8.1: DİĞER MAHİR / KAYITTAKİ MAHİR = GERÇEK MAHİR GÖRSELİ ----------
const MAHIR_ECHO_CHARACTERS=new Set(['DİĞER MAHİR','KAYITTAKİ MAHİR']);
function isMahirEchoCharacter(name){return MAHIR_ECHO_CHARACTERS.has(canonicalCharacterName(name));}
function mahirEchoViewDirection(o,cam){
 const facing=Number.isFinite(o.ry)?o.ry:0,camYaw=Math.atan2(cam[0]-o.x,cam[2]-o.z),rel=shortestAngle(facing,camYaw),a=Math.abs(rel);
 if(a<Math.PI*.25)return 'front';if(a>Math.PI*.75)return 'back';return rel>0?'left':'right';
}
function drawMahirEchoSprite(o,vp,cam,planes){
 if(!o||!isMahirEchoCharacter(o.character)||!inFrustum(o,planes))return;
 const gy=groundY(o.x,o.z),dir=mahirEchoViewDirection(o,cam),moving=(o.moveAmount||0)>.075;
 const state=moving?(Math.sin(o.movePhase||0)>=0?'walk1':'walk2'):'idle',t=tex[`mahir_${dir}_${state}`]||tex.mahir_front_idle||tex.white;
 const syaw=Math.atan2(cam[0]-o.x,cam[2]-o.z),uncanny=o.character==='KAYITTAKİ MAHİR';
 const pulse=uncanny?1+Math.sin(performance.now()*.006)*.012:1;
 const m=model(o.x,gy-.050,o.z,.84*pulse,1.80*pulse,1,syaw);
 bind(quadBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);gl.uniform2f(U.uvScale,1,1);useTexture(t);gl.uniform1i(U.tex,0);
 gl.uniform4f(U.color,uncanny?.92:1,uncanny?.97:1,1,uncanny?.93:1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,uncanny?.68:.56);gl.uniform1f(U.alphaCut,.02);gl.drawArrays(gl.TRIANGLES,0,6);
}

// LEGACY/EXPERIMENTAL: primitif 3D Mahir görsel kalite nedeniyle production renderında bilinçli olarak kullanılmıyor.
function drawMahir3D(vp){
 const gy=groundY(px,pz),bob=Math.abs(Math.sin(mahirWalkPhase*2))*.018*mahirMoveAmount;
 const y0=gy+bob,ry=mahirYaw;
 const skin=[.49,.31,.23,1],skinDark=[.38,.23,.18,1],hair=[.055,.045,.040,1],jacket=[.105,.115,.12,1],jacket2=[.075,.082,.09,1],pants=[.075,.078,.082,1],boot=[.10,.075,.055,1],pack=[.20,.16,.115,1];
 const stride=Math.sin(mahirWalkPhase)*.58*mahirMoveAmount;
 const knee=Math.max(0,Math.sin(mahirWalkPhase))*0.28*mahirMoveAmount;
 const kneeR=Math.max(0,-Math.sin(mahirWalkPhase))*0.28*mahirMoveAmount;
 const armL=-stride*.82,armR=stride*.82;
 // pelvis / coat / torso
 drawPrimitive(cubeBuf,36,px,y0+.92,pz,.18,.12,.12,0,ry,pants,vp);
 drawPrimitive(cubeBuf,36,px,y0+1.10,pz,.27,.20,.14,0,ry,jacket2,vp);
 drawPrimitive(cubeBuf,36,px,y0+1.31,pz,.245,.22,.135,0,ry,jacket,vp);
 // backpack is truly behind the body, not a flat picture.
 let o=yawOffset(0,-.19,ry);drawPrimitive(cubeBuf,36,px+o[0],y0+1.28,pz+o[1],.19,.23,.08,0,ry,pack,vp);
 o=yawOffset(0,-.285,ry);drawPrimitive(cubeBuf,36,px+o[0],y0+1.18,pz+o[1],.13,.15,.035,0,ry,[.16,.125,.09,1],vp);
 // neck + head + hair
 drawPrimitive(cylBuf,cylCount,px,y0+1.53,pz,.055,.055,.055,0,ry,skinDark,vp);
 drawPrimitive(sphereBuf,sphereCount,px,y0+1.66,pz,.125,.155,.115,0,ry,skin,vp);
 o=yawOffset(0,-.018,ry);drawPrimitive(sphereBuf,sphereCount,px+o[0],y0+1.735,pz+o[1],.132,.095,.12,0,ry,hair,vp);
 // nose gives a readable facing direction.
 o=yawOffset(0,.112,ry);drawPrimitive(cubeBuf,36,px+o[0],y0+1.665,pz+o[1],.022,.030,.030,0,ry,skinDark,vp);
 // arms: shoulder -> forearm -> hands
 const shoulderY=y0+1.43,shoulderX=.305,upperA=.30,lowerA=.285;
 for(const side of [-1,1]){
   const a=side<0?armL:armR; const so=yawOffset(side*shoulderX,0,ry); const sx0=px+so[0],sz0=pz+so[1];
   const up=segmentPose(sx0,shoulderY,sz0,upperA,a,ry);
   drawPrimitive(cylBuf,cylCount,up.cx,up.cy,up.cz,.062,upperA*.5,.062,a,ry,jacket,vp);
   const elbowBend=.12+Math.abs(Math.sin(mahirWalkPhase))*0.16*mahirMoveAmount;
   const fa=segmentPose(up.ex,up.ey,up.ez,lowerA,a-(side<0?1:-1)*elbowBend,ry);
   drawPrimitive(cylBuf,cylCount,fa.cx,fa.cy,fa.cz,.052,lowerA*.5,.052,a-(side<0?1:-1)*elbowBend,ry,jacket2,vp);
   drawPrimitive(sphereBuf,sphereCount,fa.ex,fa.ey-.015,fa.ez,.055,.068,.050,0,ry,skin,vp);
 }
 // legs: hip -> knee -> calf -> shoes
 const hipY=y0+.92,hipX=.145,upperL=.43,lowerL=.405;
 for(const side of [-1,1]){
   const a=side<0?stride:-stride; const bend=side<0?knee:kneeR; const ho=yawOffset(side*hipX,0,ry); const hx=px+ho[0],hz=pz+ho[1];
   const th=segmentPose(hx,hipY,hz,upperL,a,ry);
   drawPrimitive(cylBuf,cylCount,th.cx,th.cy,th.cz,.083,upperL*.5,.082,a,ry,pants,vp);
   const calfAngle=a-bend;
   const ca=segmentPose(th.ex,th.ey,th.ez,lowerL,calfAngle,ry);
   drawPrimitive(cylBuf,cylCount,ca.cx,ca.cy,ca.cz,.070,lowerL*.5,.070,calfAngle,ry,pants,vp);
   const footF=yawOffset(0,.085,ry);drawPrimitive(cubeBuf,36,ca.ex+footF[0],Math.max(y0+.07,ca.ey+.045),ca.ez+footF[1],.085,.060,.145,0,ry,boot,vp);
 }
}
function drawDoor(vp,planes){
 const p=doorPose();
 const doorProxy={kind:'box',x:p.x,y:1.05,z:p.z,sx:.96,sy:2.10,sz:.09,ry:p.ry};if(!inFrustum(doorProxy,planes))return;
 // İnce ahşap gövde: yan açıdan bakıldığında kapı karton gibi görünmesin.
 let m=model(p.x,1.05,p.z,DOOR_HALF_W,1.05,DOOR_HALF_T,p.ry);
 bind(cubeBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);gl.uniform2f(U.uvScale,1,2);
 useTexture(tex.wood);gl.uniform4f(U.color,.58,.45,.34,1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,0);gl.uniform1f(U.alphaCut,0);gl.drawArrays(gl.TRIANGLES,0,36);
 // Foto-gerçek ön yüz; kaynak görsel fiziksel menteşe yönüne göre hazırlanmıştır.
 const nx=Math.sin(p.ry),nz=Math.cos(p.ry),frontX=p.x+nx*(DOOR_HALF_T+.004),frontZ=p.z+nz*(DOOR_HALF_T+.004);
 m=model(frontX,0,frontZ,.96,2.10,1,p.ry);
 bind(quadBuf);gl.uniformMatrix4fv(U.model,false,m);gl.uniformMatrix4fv(U.vp,false,vp);gl.uniform2f(U.uvScale,1,1);
 useTexture(tex.doorWood||tex.wood);gl.uniform1i(U.tex,0);gl.uniform4f(U.color,1,1,1,1);gl.uniform1f(U.useTex,1);gl.uniform1f(U.emissive,.03);gl.uniform1f(U.alphaCut,.08);gl.drawArrays(gl.TRIANGLES,0,6);
 // Metal kol: etkileşim anında kısa bir aşağı basma hareketi verir.
 const handleLocal=.31,handleX=p.x+p.c*handleLocal+nx*(DOOR_HALF_T+.035),handleZ=p.z-p.sn*handleLocal+nz*(DOOR_HALF_T+.035);
 const press=Math.sin(Math.min(1,doorHandlePress)*Math.PI)*.17;
 drawPrimitive(cubeBuf,36,handleX,1.02-press*.07,handleZ,.105,.025,.022,-press,p.ry,[.62,.59,.53,1],vp,.08);
}

let dprCap=1.6;
function resize(){
 const d=Math.min(devicePixelRatio||1,dprCap);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,canvas.width,canvas.height);
}
addEventListener('resize',resize);resize();
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();saveGame(true);const f=document.getElementById('fallback');f.style.display='grid';f.textContent='Grafik bağlamı kayboldu. İlerlemen kaydedildi. Sayfayı yenileyerek devam edebilirsin.';});
canvas.addEventListener('webglcontextrestored',()=>location.reload());

function render(){
 gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.BLEND);
 gl.uniform1f(U.time,performance.now()*.001);gl.uniform1f(U.dokuMix,dokuMix);
 const caveView=(pz<-66&&pz>-103&&Math.abs(px)<6);if(activeAtlas)gl.clearColor(atlasClear[0],atlasClear[1],atlasClear[2],1);else gl.clearColor(caveView?.032:.078,caveView?.040:.092,caveView?.052:.118,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const gy=groundY(px,pz),bodyPose=mahirVisualPose(),cinCam=cinematicCameraState(bodyPose,gy);
 const forward=yawOffset(0,.16*cinCam.mix,mahirYaw),target=[bodyPose.x+forward[0],cinCam.targetY,bodyPose.z+forward[1]];
 const cy=Math.cos(cinCam.camYaw),sy=Math.sin(cinCam.camYaw);
 const desiredCam=[bodyPose.x-sy*cinCam.dist,cinCam.cameraY,bodyPose.z-cy*cinCam.dist];
 const renderList=activeAtlas?atlasObjs:objs;
 const occList=renderList;
 const cam=resolveCameraOcclusion(target,desiredCam,occList);
 const atlasOutdoor=activeAtlas&&['urban','nature','ancient'].includes(LOC_INFO[activeAtlas]?.type||'');const baseFov=atlasOutdoor?Math.PI/2.75:Math.PI/3,fov=baseFov*cinCam.fovMul;
 const view=lookAt(cam,target),proj=perspective(fov,canvas.width/canvas.height,.05,190),vp=mm(proj,view),planes=extractFrustumPlanes(vp);
 updateCinematicUseOverlay();

 // v2.9.5: native offline render only — zero external-asset allocations per frame.
 for(const o of renderList)if(o.kind==='box')drawObj(o,vp,cam,planes);
 for(const o of renderList)if(o.kind==='npc3d'&&!isMahirEchoCharacter(o.character)&&!hasRealNPCSprite(o.character))drawNPC3D(o,vp,planes);
 if(!activeAtlas)drawDoor(vp,planes);
 // v3.8.2: foto-gerçek ana kadro öncelikli; yan karakterlerde yalnız giyinik native fallback.
 if(false&&window.TELKIN_RIG&&window.TELKIN_RIG.render){ // v3.8.2: çıplak/base rig fallback production'da KALICI kapalı
   const rigObjects=renderList.filter(o=>o.kind==='npc3d'&&!isMahirEchoCharacter(o.character)&&!hasRealNPCSprite(o.character)).map(o=>{const p=npcProfile(o.character)||{};return {key:o.name||o.character,character:o.character,x:o.x,y:groundY(o.x,o.z),z:o.z,ry:o.ry||0,height:p.h||1.75,build:p.build||1,gender:p.gender||'u',top:p.top||[.2,.25,.3,1],hair:p.hair||[.05,.04,.03,1],moving:(o.moveAmount||0)>.06,moveAmount:o.moveAmount||0,actorState:o.actorState||'idle'};});
   try{window.TELKIN_RIG.render({cam,target,fov,width:canvas.width,height:canvas.height,objects:rigObjects,dt:Math.min(.05,window.__telkinRigDt||.016)});}catch(err){console.warn('[TELKİN] Rig render fallback',err);}
   gl.useProgram(prog);gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.BLEND);
 }


 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(true);
 for(const o of renderList)if(o.kind==='npc3d'&&hasRealNPCSprite(o.character))drawRealNPCSprite(o,vp,cam,planes);
 for(const o of renderList)if(o.kind==='npc3d'&&isMahirEchoCharacter(o.character))drawMahirEchoSprite(o,vp,cam,planes);

 // Şeffaf dünya karakterleri, temas gölgeleri + yönlü Mahir
 gl.depthMask(false);
 for(const o of renderList)if(o.kind==='sprite')drawObj(o,vp,cam,planes);
 for(const o of renderList)if(o.kind==='npc3d')drawNPCShadow(o,vp,planes);
 drawMahirShadow(vp);
 drawMahirSprite(vp,cam);
 drawMahirHeldProp(vp);
 gl.depthMask(true);gl.disable(gl.BLEND);
}


function initAudio(){
 if(window.TELKIN_AUDIO){
  audioCtx=window.TELKIN_AUDIO.init();masterGain=window.TELKIN_AUDIO.masterGain||null;return;
 }
 if(audioCtx)return;
 audioCtx=new (window.AudioContext||window.webkitAudioContext)();
 masterGain=audioCtx.createGain();masterGain.gain.value=.72;masterGain.connect(audioCtx.destination);
}
function setAudio(on){
 if(window.TELKIN_AUDIO){
  initAudio();audioOn=!!on;window.TELKIN_AUDIO.setEnabled(audioOn);window.TELKIN_AUDIO.setNihyel(nihyelActive);soundBtn.textContent=audioOn?TT('ui.soundOn','SES: AÇIK'):TT('ui.soundOff','SES: KAPALI');soundBtn.classList.toggle('on',audioOn);return;
 }
 if(on){initAudio();if(audioCtx.state==='suspended')audioCtx.resume();audioOn=true;soundBtn.textContent=TT('ui.soundOn','SES: AÇIK');soundBtn.classList.add('on');}
 else{audioOn=false;soundBtn.textContent=TT('ui.soundOff','SES: KAPALI');soundBtn.classList.remove('on');if(masterGain&&audioCtx)masterGain.gain.setTargetAtTime(0.0001,audioCtx.currentTime,.04);}
 if(on&&masterGain)masterGain.gain.setTargetAtTime(.72,audioCtx.currentTime,.04);
}
function playStep(sprint=false){
 if(window.TELKIN_AUDIO){window.TELKIN_AUDIO.playStep({sprint});return;}
 if(!audioOn||!audioCtx)return;
 const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='triangle';o.frequency.setValueAtTime(sprint?92:78,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(42,audioCtx.currentTime+.055);
 g.gain.setValueAtTime(sprint?.055:.038,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.075);o.connect(g);g.connect(masterGain);o.start();o.stop(audioCtx.currentTime+.08);
}
function updateAudio(dt,moved,sprint){
 if(window.TELKIN_AUDIO){
  if(!audioOn)return;
  const isHome=(px>43&&px<57&&pz>-6&&pz<6),isMina=(px<-43&&px>-57&&pz>-6&&pz<6),isCave=(pz<-66&&pz>-103&&Math.abs(px)<6);
  const locId=activeAtlas|| (isCave?'cave':((isHome||isMina)?'home':(pz<22?'office':'city')));
  const mood=(window.TELKIN_LOCATION_PACKS?.[locId]?.mood)||(window.LOCATION_DESIGN?.[locId]?.mood)||null;
  window.TELKIN_AUDIO.update({dt,moved,sprint,locationId:locId,mood,nihyel:nihyelActive});return;
 }
 if(!audioOn||!audioCtx)return;
 if(moved>.002){footClock+=dt;if(footClock>(sprint?.27:.42)){footClock=0;playStep(sprint);}}else footClock=Math.min(footClock,.2);
}
function hubTeleport(x,z,newYaw,label){
 cancelMahirPhysicalUse(true);
 const safe=findNearestFree(x,z,3.5);if(safe){x=safe[0];z=safe[1];}
 fadeEl.classList.add('on');
 setTimeout(()=>{px=x;pz=z;yaw=newYaw;mahirYaw=newYaw;mahirTargetYaw=newYaw;mahirMoveAmount=0;footClock=0;zone.textContent=label||zoneName();saveGame(true);setTimeout(()=>fadeEl.classList.remove('on'),80);},180);
}

let _caveCoreSrc=null,_caveCore=null,_pulseObjs=[];
function update(dt){
 let movedThisFrame=0,sprintThisFrame=false;
 updateMahirUseAction(performance.now());
 if(!isPaused()&&!mahirSeatState.active){
   // v0.7.4: v0.7.3 kontrol yönü korunur: joystick yukarı (joyY<0) = ileri.
   // v6.22.4: kamera view matrisinin ekran-sağ bazıyla hareket bazı eşlendi; joystick sağ ekranda sağa gider.
   const dead=.10;
   let jx=Math.abs(joyX)<dead?0:Math.sign(joyX)*(Math.abs(joyX)-dead)/(1-dead);
   let jy=Math.abs(joyY)<dead?0:Math.sign(joyY)*(Math.abs(joyY)-dead)/(1-dead);
   let f=-jy,r=jx;
   f+=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
   r+=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
   const mag=Math.hypot(f,r);if(mag>1){f/=mag;r/=mag;}
   const sprint=running||keys.ShiftLeft||keys.ShiftRight;
   const speed=sprint?3.7:2.35;
   const fx=Math.sin(yaw),fz=Math.cos(yaw),rx=-Math.cos(yaw),rz=Math.sin(yaw);
   const vx=fx*f+rx*r,vz=fz*f+rz*r;
   const dx=vx*speed*dt,dz=vz*speed*dt;
   const moved=moveWithCollision(dx,dz);movedThisFrame=moved;sprintThisFrame=!!sprint;
   mahirMoveAmount=Math.min(1,moved/Math.max(.0001,speed*dt));mahirSprint=!!sprint;
   if(mag>.05){mahirTargetYaw=Math.atan2(vx,vz);mahirWalkPhase+=dt*(sprint?10.5:7.2);}
   mahirYaw+=shortestAngle(mahirYaw,mahirTargetYaw)*Math.min(1,dt*10);
 }else{mahirMoveAmount=0;}
 if(!isPaused()&&Math.abs(joyX)<.08&&Math.abs(joyY)<.08&&!keys.KeyW&&!keys.ArrowUp&&!keys.KeyS&&!keys.ArrowDown&&!keys.KeyA&&!keys.ArrowLeft&&!keys.KeyD&&!keys.ArrowRight)mahirMoveAmount*=Math.max(0,1-dt*12);
 doorAngle+=( (doorOpen?-Math.PI*.48:0)-doorAngle)*Math.min(1,dt*7);
 doorHandlePress=Math.max(0,doorHandlePress-dt*3.4);
 // Sadece aktif dünyada animasyon taraması yap.
 dokuMix+=( (nihyelActive?.72:0)-dokuMix)*Math.min(1,dt*3.8);
 const nowT=performance.now();
 if(!activeAtlas){
   if(_caveCoreSrc!==objs){_caveCoreSrc=objs;_caveCore=objs.find(o=>o.name==='cavePulseCore')||null;_pulseObjs=objs.filter(o=>o.name==='nihyelThread'||o.name==='nihyelNode');}
   const caveCore=_caveCore;
   if(caveCore){const proximity=Math.max(0,1-Math.hypot(px,pz+97.5)/10);caveCore.em=.50+proximity*(.28+.16*Math.sin(nowT*.0023));}
   for(const o of _pulseObjs)o.em=.82+.16*Math.sin(nowT*.0024+o.x*.7+o.z*.13);
 }else for(const o of atlasObjs)if(o.name==='atlasMarker'||o.name==='atlasMarkerGlow')o.em=.78+.18*Math.sin(nowT*.003+o.y*2);
 if(nowT-lastAutoSave>6500){lastAutoSave=nowT;saveGame(true);}
 updateAmbientWorld(dt);
 updateNPCActors(dt);
 updateGameplayPropInteraction();
 updateAmbientContextInteractions(dt);

 if(activeAtlas){
   ambientContextTarget=null;
   if(mahirSeatState.active)near='seatExit';
   else if(atlasBrowseMode)near=null;
   else if(chapterTarget&&Math.hypot(px-chapterTarget.x,pz-chapterTarget.z)<2.20)near='chapterAnchor';
   else{ambientContextTarget=findNearestAmbientContext(px,pz,1.48);near=ambientContextTarget?'ambient':null;}
 }else{ambientContextTarget=null;
   const dE=Math.hypot(px-2.75,pz-.45),dD=Math.hypot(px-4.78,pz+1.0),dR=Math.hypot(px,pz-61.1);
   const dHomeIn=Math.hypot(px-7.45,pz-45.0),dHomeOut=Math.hypot(px-50.0,pz-3.20),dHomeTrace=Math.hypot(px-51.25,pz+3.18);
   const dMinaIn=Math.hypot(px+7.45,pz-51.2),dMinaOut=Math.hypot(px+50.0,pz-3.20),dMinaTrace=Math.hypot(px+48.45,pz+1.42);
   const dCaveIn=Math.hypot(px-6.55,pz-52.0),dCaveOut=Math.hypot(px,pz+69.2),dCaveTrace=Math.hypot(px,pz+97.1);
   near=dE<1.55?'eren':dD<1.45?'door':dHomeIn<1.45?'homeIn':dHomeOut<1.25&&px>43?'homeOut':dHomeTrace<1.25&&px>43?'homeTrace':dMinaIn<1.45?'minaIn':dMinaOut<1.25&&px<-43?'minaOut':dMinaTrace<1.20&&px<-43?'minaTrace':dCaveIn<1.55?'caveIn':dCaveOut<1.35&&pz<-66?'caveOut':dCaveTrace<1.75&&pz<-90?'caveTrace':dR<2.0?'rift':null;
 }
 if(!isPaused()&&near){prompt.textContent=near==='eren'?'EREN İLE KONUŞ':near==='rift'?(story.riftSeen?'YARIK İZİNİ İNCELE':'DOKU EŞİĞİNİ İNCELE'):near==='homeIn'?'MAHİR’İN EVİNE GİR':near==='homeOut'?'APARTMANDAN ÇIK':near==='homeTrace'?'DUVARDAKİ FOTOĞRAFA BAK':near==='minaIn'?'MİNA HATTINA GİR':near==='minaOut'?'MEYDANA DÖN':near==='minaTrace'?'MASADAKİ ÇİZİME BAK':near==='caveIn'?'MAĞARA / KRİZ HATTINA GİT':near==='caveOut'?'ŞEHRE DÖN':near==='caveTrace'?'ANORMAL İZİ İNCELE':near==='seatExit'?TT('context.chairStand','SANDALYEDEN KALK'):near==='ambient'&&ambientContextTarget?contextText(ambientContextTarget,'prompt'):near==='chapterAnchor'?('ETKİLEŞ · '+actionProfile(chapterSequence(chapterByNo(activeChapter))[chapterSeqIndex]).label):(doorOpen?'ARKA KAPIYI KAPAT':'ARKA KAPIYI AÇ');prompt.classList.add('show');interact.classList.add('hot')}
 else{prompt.classList.remove('show');interact.classList.remove('hot')}
 if(activeAtlas&&!atlasBrowseMode&&chapterTarget&&!isMechanicOpen){
   const dx=chapterTarget.x-px,dz=chapterTarget.z-pz,dist=Math.hypot(dx,dz),rel=shortestAngle(yaw,Math.atan2(dx,dz));
   let arrow='↑';if(Math.abs(rel)>2.55)arrow='↓';else if(rel>.48)arrow='→';else if(rel<-.48)arrow='←';
   const stNow=chapterSequence(chapterByNo(activeChapter))[chapterSeqIndex],apNow=actionProfile(stNow),unlocked=chapterMarkerUnlocked(activeChapter);
   const msg=dist<2.20?`ETKİLEŞ · ${apNow.label}`:(unlocked?`${arrow} ${dist.toFixed(1)} m`:`${dist.toFixed(1)} m`);
   if(msg!==lastTaskGuideText){taskGuide.textContent=msg;lastTaskGuideText=msg;}taskGuide.classList.add('show');
 }else if(taskGuide){taskGuide.classList.remove('show');lastTaskGuideText='';}
 updateAudio(dt,movedThisFrame,sprintThisFrame);
 coord.textContent=`${px.toFixed(1)} / ${pz.toFixed(1)} m`;zone.textContent=zoneName();
}
function setMissionBeaconVisible(visible){for(const o of atlasObjs){if(/^missionTarget/.test(o.name||''))o.__hideForDialogue=!visible;}}
function displayDlg(s,t){isDialogueOpen=true;const actor=activeConversationActor();if(actor){actor.active=true;actor.actorState='talk';actor.ry=Math.atan2(px-actor.x,pz-actor.z);mahirTargetYaw=Math.atan2(actor.x-px,actor.z-pz);}document.body.classList.add('dialogueMode');setMissionBeaconVisible(false);prompt.classList.remove('show');taskGuide.classList.remove('show');interact.textContent=TT('ui.continue','DEVAM');interact.classList.add('hot');speaker.textContent=s;text.textContent=t;if(dialogueTotal>0&&dlgProgress){dialogueShown++;dlgProgress.style.width=(100*dialogueShown/dialogueTotal)+'%';}else if(dlgProgress)dlgProgress.style.width='0%';dlg.classList.add('show')}
function showDlg(s,t,after){
 t=String(t==null?'':t);const nm=canonicalCharacterName(s),named=nm&&nm!=='ANLATICI'&&nm!=='SES';
 if(named){runCutscene([[nm,t]],{loc:currentCutLoc(),title:nm,mode:'conversation'},typeof after==='function'?after:null);return;}
 if(t.length<150&&t.indexOf('\n')<0){Game.toast(t,2600);if(typeof after==='function')setTimeout(after,2100);return;}
 runCutscene([['ANLATICI',t]],{loc:currentCutLoc(),title:String(s||'ANLATI'),mode:'cinematic'},typeof after==='function'?after:null);
}
function showDlgSequence(lines,after){
 const L=(lines||[]).map(x=>[x[0]||'ANLATICI',x[1]||'']).filter(x=>x[1]);if(!L.length){if(typeof after==='function')after();return;}
 const named=L.some(x=>{const n=canonicalCharacterName(x[0]);return n&&n!=='ANLATICI'&&n!=='SES'});
 if(named){runCutscene(L,{loc:currentCutLoc(),title:'KONUŞMA',mode:'conversation'},typeof after==='function'?after:null);return;}
 const txt=L.map(x=>x[1]).join(' ');
 if(txt.length<220){Game.toast(txt,3000);if(typeof after==='function')setTimeout(after,2400);return;}
 runCutscene(L,{loc:currentCutLoc(),title:'ANLATI',mode:'cinematic'},typeof after==='function'?after:null);
}
function _legacyShowDlgSequence(lines,after){dialogueQueue=(lines||[]).map(x=>[x[0]||'ANLATICI',x[1]||'']);dialogueAfter=typeof after==='function'?after:null;dialogueTotal=dialogueQueue.length;dialogueShown=0;if(!dialogueQueue.length){const cb=dialogueAfter;dialogueAfter=null;if(cb)cb();return;}const n=dialogueQueue.shift();displayDlg(n[0],n[1]);}
function closeDlg(){
 if(dialogueQueue.length){const n=dialogueQueue.shift();displayDlg(n[0],n[1]);return;}
 isDialogueOpen=false;document.body.classList.remove('dialogueMode');setMissionBeaconVisible(true);interact.textContent=TT('ui.interact','ETKİLEŞ');interact.classList.remove('hot');dlg.classList.remove('show');const cb=dialogueAfter;dialogueAfter=null;if(cb)setTimeout(cb,0);
}
function openUniverse(){cancelChapterAction();if(isStoryOpen)closeStory();if(isDialogueOpen)closeDlg();isUniverseOpen=true;prompt.classList.remove('show');universePanel.classList.add('show');universePanel.setAttribute('aria-hidden','false')}
function closeUniverse(){isUniverseOpen=false;universePanel.classList.remove('show');universePanel.setAttribute('aria-hidden','true')}
function act(){
 if(cutsceneOpen)return;
 if(chapterInterludeOpen){closeChapterInterlude();return}
 if(mahirUseAction.active||interactionBusy){return}
 if(isMechanicOpen){return}
 if(isLocationsOpen){closeLocations();return}
 if(isChaptersOpen){closeChapters();return}
 if(isUniverseOpen){closeUniverse();return}
 if(isDialogueOpen){closeDlg();return}
 if(mahirSeatState.active||near==='seatExit'){standFromAmbientChair();return}
 if(near==='chapterAnchor'){beginChapterAction();return}
 if(near==='ambient'&&ambientContextTarget){activateAmbientContext(ambientContextTarget);return}
 if(activeAtlas&&!atlasBrowseMode&&chapterTarget){
   let dx=chapterTarget.x-px,dz=chapterTarget.z-pz,dist=Math.hypot(dx,dz);
   // v2.9.5: 18+ metre normal bölüm tasarımında yoktur. Oyuncuya motor hatasını yürütme.
   if(dist>18){
     const sp=chapterSpawnPoint(activeAtlas),safe=findNearestFree(sp[0],sp[1],4.0)||sp;
     px=safe[0];pz=safe[1];dx=chapterTarget.x-px;dz=chapterTarget.z-pz;dist=Math.hypot(dx,dz);
     Game.toast('ROTA DÜZELTİLDİ · HEDEFE GERİ GETİRİLDİN',1800);
   }
   yaw=Math.atan2(dx,dz);pitch=Math.max(-.02,Math.min(.34,pitch));
   Game.toast(chapterMarkerUnlocked(activeChapter)?`HEDEF: ${chapterTarget.label.toUpperCase()} · ${dist.toFixed(1)} m`:`HEDEFE UZAKLIK: ${dist.toFixed(1)} m · ARCADE İŞARETİ AÇAR`,1400);return;
 }
 if(near==='eren')showDlg('EREN','Burası artık bir test odası gibi görünmüyor.\n\nMasadan çık, koridoru geç, merdivenden aşağı in. Giriş kapısında yağmurlu şehir seni bekliyor.');
 else if(near==='door'){
   startMahirUseAction('reach',DOOR_HINGE_X,DOOR_HINGE_Z,{duration:620,onMid:()=>{doorHandlePress=1;doorOpen=!doorOpen;environmentState.hub.rearDoorOpen=doorOpen;saveGame(true);if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.playSfx(doorOpen?'door_open':'door_close');},onDone:()=>showDlg('ARKA KAPI',doorOpen?'Kapı kolu indi; ahşap kapı menteşesinden ağır ağır açıldı.':'Kapı kolunu indirip kapıyı yerine oturttun.')});
 }
 else if(near==='homeIn')hubTeleport(49.5,2.65,Math.PI,'MAHİR’İN EVİ');
 else if(near==='homeOut')hubTeleport(7.25,45.0,-Math.PI/2,'SESSİZ MEYDAN');
 else if(near==='homeTrace'){story.homeTrace=true;syncStoryUI();saveGame();showDlg('MAHİR’İN EVİ · FOTOĞRAF','Fotoğrafın kendisinde olağanüstü hiçbir şey yok. Tam da bu yüzden önemli: Doku, insan hayatını değersizleştiren bir üst gerçeklik değildir.\n\nMahir’in bağlı olduğu şeyler, olasılıklar değişse bile gerçektir.');}
 else if(near==='minaIn')hubTeleport(-50,2.65,Math.PI,'MİNA HATTI · YAŞAM ALANI');
 else if(near==='minaOut')hubTeleport(-7.25,51.2,Math.PI/2,'SESSİZ MEYDAN');
 else if(near==='minaTrace'){story.minaTrace=true;syncStoryUI();saveGame();showDlg('MİNA’NIN MASASI','Renkli kalemler, yarım bırakılmış bir ev resmi ve açık duran birkaç defter.\n\nMahir için olasılıkların ağırlığı burada soyut bir fikir olmaktan çıkıyor. Değişen her ihtimal, bir insan hayatına dokunuyor.');}
 else if(near==='caveIn'){hubTeleport(0,-71.0,Math.PI,'MAĞARA · GÖRÜNEN DÜNYA');setTimeout(()=>showDlg('MAĞARA / KRİZ HATTI','Burada hâlâ taşın ağırlığı, nemin kokusu ve ayağın zemine değmesi var. Burası Doku değil.\n\nAma biraz ileride fiziksel dünyanın açıklamakta zorlanacağı bir iz bulunuyor.'),560);}
 else if(near==='caveOut')hubTeleport(6.15,52.0,-Math.PI/2,'SESSİZ MEYDAN');
 else if(near==='caveTrace'){
   const first=!story.caveTrace;story.caveTrace=true;story.nihyelUnlocked=true;syncStoryUI();saveGame();
   showDlg(first?'NİHYEL · UYANIŞ':'ANORMAL İZ',first?'Mahir ışığı görmüyor yalnızca. Çizginin çevresindeki ihtimalleri, birbirine değmeden birbirini etkileyen yolları hissediyor.\n\nNİHYEL açıldı. Bu bir büyü değil; Mahir’in Doku izlerini algılayabildiği biyolojik arayüz. Ekrandaki NİHYEL düğmesiyle açıp kapatabilirsin.':'İz artık farklı görünüyor. Nihyel açıldığında taşın içinden geçen çizgi tek başına değil; başka ihtimallere bağlanan ilişkilerin düğümü gibi.');
 }
 else if(near==='rift'){
   if(!story.nihyelUnlocked)showDlg('DOKU EŞİĞİ','Dünya burada kesinliğini kaybediyor; fakat Mahir henüz neye baktığını ayırt edemiyor. Mağaradaki anormal iz önce anlaşılmalı.');
   else if(!nihyelActive)showDlg('DOKU EŞİĞİ','Duvar aynı duvar gibi görünüyor. Ama artık Mahir ne yapması gerektiğini biliyor.\n\nNİHYEL’i aç.');
   else if(!story.riftSeen){story.riftSeen=true;syncStoryUI();saveGame();showDlg('YARIK · İLK ALGILAMA','Duvar açılmıyor. Bir kapı belirmiyor. Bunun yerine aynı yerin birden fazla mümkün hâli üst üste görünür oluyor.\n\nMahir Doku’ya “girmedi”. Görünen Dünya’nın altında çalışan olasılık ilişkisini ilk kez seçebildi. Aralarındaki kısa süreli uyumsuzluk ise Yarık.');}
   else showDlg('DOKU EŞİĞİ','Nihyel açıkken çizgiler yeniden beliriyor. Hiçbiri kader değil; yalnızca ağırlık kazanmış ihtimaller. Yarık kapanmış olsa da izi kalmış.');
 }
}
interact.addEventListener('pointerdown',e=>{e.preventDefault();act()});dlg.addEventListener('pointerdown',e=>{e.preventDefault();closeDlg()});
soundBtn.addEventListener('pointerdown',e=>{e.preventDefault();setAudio(!audioOn)});
addEventListener('pointerdown',()=>{if(audioOn&&audioCtx&&audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});},{passive:true});
nihyelBtn.addEventListener('pointerdown',e=>{e.preventDefault();setNihyel(!nihyelActive)});
universeBtn.addEventListener('pointerdown',e=>{e.preventDefault();isUniverseOpen?closeUniverse():openUniverse()});
universeClose.addEventListener('pointerdown',e=>{e.preventDefault();closeUniverse()});
if(chapterJumpGo)chapterJumpGo.addEventListener('click',()=>selectChapterForReview(chapterJumpInput.value));
if(chapterJumpInput)chapterJumpInput.addEventListener('keydown',e=>{if(e.key==='Enter')selectChapterForReview(chapterJumpInput.value);});
if(inspectionPrev)inspectionPrev.addEventListener('click',()=>{if(inspectionMode&&activeChapter>1)startChapter(activeChapter-1,true);});
if(inspectionNext)inspectionNext.addEventListener('click',()=>{if(inspectionMode&&activeChapter<144)startChapter(activeChapter+1,true);});
if(inspectionReturn)inspectionReturn.addEventListener('click',returnFromInspection);
chaptersBtn.addEventListener('pointerdown',e=>{e.preventDefault();isChaptersOpen?closeChapters():openChapters()});
chaptersClose.addEventListener('pointerdown',e=>{e.preventDefault();closeChapters()});
locationsBtn.addEventListener('pointerdown',e=>{e.preventDefault();isLocationsOpen?closeLocations():openLocations()});
locationsClose.addEventListener('pointerdown',e=>{e.preventDefault();closeLocations()});
arcadeBtn.addEventListener('pointerdown',e=>{e.preventDefault();arcadeOpen?closeArcade():openArcade()});
arcadeClose.addEventListener('pointerdown',e=>{e.preventDefault();closeArcade()});
arcadeStart.addEventListener('pointerdown',e=>{e.preventDefault();startArcadeGame()});
arcadeSkip.addEventListener('pointerdown',e=>{e.preventDefault();closeArcade();Game.toast('İŞARET KAPALI · HEDEFİ METRE HESABIYLA BULABİLİRSİN',1800)});
if(hudMenuBtn)hudMenuBtn.addEventListener('pointerdown',e=>{e.preventDefault();setQuickMenu(!hudQuickMenu.classList.contains('show'))});
if(hudMenuClose)hudMenuClose.addEventListener('pointerdown',e=>{e.preventDefault();setQuickMenu(false)});
if(missionRecall)missionRecall.addEventListener('pointerdown',e=>{e.preventDefault();setQuickMenu(false);showMissionPeek(6500)});
if(hudQuickMenu)hudQuickMenu.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();const k=b.dataset.open;setQuickMenu(false);if(k==='chapters')chaptersBtn.click();else if(k==='locations')locationsBtn.click();else if(k==='story')storyBtn.click();else if(k==='arcade')arcadeBtn.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));else if(k==='universe')universeBtn.click();else if(k==='sound')soundBtn.click();else if(k==='nihyel')nihyelBtn.click();}));

locationSearch.addEventListener('input',()=>{locationQuery=locationSearch.value;renderLocationPanel()});
function safePointerCapture(el,pointerId){
 try{
  if(!el||pointerId==null||!el.isConnected||typeof el.setPointerCapture!=='function')return false;
  el.setPointerCapture(pointerId);
  return true;
 }catch(err){
  if(err&&(err.name==='InvalidStateError'||err.name==='NotFoundError')){console.warn('[TELKİN pointer capture]',err.name);return false;}
  console.warn('[TELKİN pointer capture]',err);return false;
 }
}
function safeReleasePointerCapture(el,pointerId){
 try{if(el&&pointerId!=null&&typeof el.releasePointerCapture==='function'&&(!el.hasPointerCapture||el.hasPointerCapture(pointerId)))el.releasePointerCapture(pointerId);}catch(_){}
}
runBtn.addEventListener('pointerdown',e=>{e.preventDefault();running=true;safePointerCapture(runBtn,e.pointerId)});
function stopRun(){running=false}
runBtn.addEventListener('pointerup',stopRun);runBtn.addEventListener('pointercancel',stopRun);runBtn.addEventListener('lostpointercapture',stopRun);addEventListener('pointerup',stopRun);
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyE'){e.preventDefault();act()}else if(e.code==='KeyH'){e.preventDefault();isStoryOpen?closeStory():openStory()}else if(e.code==='KeyB'){e.preventDefault();isChaptersOpen?closeChapters():openChapters()}else if(e.code==='KeyM'){e.preventDefault();isLocationsOpen?closeLocations():openLocations()}else if(e.code==='KeyA'){e.preventDefault();arcadeOpen?closeArcade():openArcade()}else if(e.code==='KeyN'){e.preventDefault();setNihyel(!nihyelActive)}else if(e.code==='KeyU'){e.preventDefault();isUniverseOpen?closeUniverse():openUniverse()}else if(e.code==='Escape'){if(hudQuickMenu&&hudQuickMenu.classList.contains('show'))setQuickMenu(false);else if(arcadeOpen)closeArcade();else if(chapterInterludeOpen)closeChapterInterlude();else if(isStoryOpen)closeStory();else if(isLocationsOpen)closeLocations();else if(isChaptersOpen)closeChapters();else if(isUniverseOpen)closeUniverse();else if(isDialogueOpen)closeDlg();}});
addEventListener('keyup',e=>{keys[e.code]=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;running=false;});

let jid=null;
function jmove(e){if(e.pointerId!==jid)return;const b=joy.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=e.clientX-cx,dy=e.clientY-cy,m=Math.hypot(dx,dy),mx=b.width*.34;if(m>mx){dx*=mx/m;dy*=mx/m}joyX=dx/mx;joyY=dy/mx;knob.style.transform=`translate(${dx}px,${dy}px)`}
joy.addEventListener('pointerdown',e=>{e.preventDefault();jid=e.pointerId;safePointerCapture(joy,e.pointerId);jmove(e)});joy.addEventListener('pointermove',jmove);
function jend(e){if(e.pointerId!==jid)return;safeReleasePointerCapture(joy,e.pointerId);jid=null;joyX=joyY=0;knob.style.transform='translate(0,0)'}joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);joy.addEventListener('lostpointercapture',e=>{if(e.pointerId===jid){jid=null;joyX=joyY=0;knob.style.transform='translate(0,0)'}});

canvas.addEventListener('pointerdown',e=>{if(e.clientX<innerWidth*.38)return;e.preventDefault();drag=true;lastX=e.clientX;lastY=e.clientY;safePointerCapture(canvas,e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-lastX)*.006;pitch=Math.max(-.12,Math.min(.55,pitch+(e.clientY-lastY)*.0025));lastX=e.clientX;lastY=e.clientY});
function endCanvasDrag(e){safeReleasePointerCapture(canvas,e&&e.pointerId);drag=false}canvas.addEventListener('pointerup',endCanvasDrag);canvas.addEventListener('pointercancel',endCanvasDrag);canvas.addEventListener('lostpointercapture',()=>drag=false);
canvas.addEventListener('dblclick',()=>{if(canvas.requestPointerLock)canvas.requestPointerLock()});
addEventListener('mousemove',e=>{if(document.pointerLockElement!==canvas||isPaused())return;yaw+=e.movementX*.0025;pitch=Math.max(-.12,Math.min(.55,pitch+e.movementY*.0018));});


function validateGameplayProfiles(){
 const problems=[];let taskCount=0;const mechTypes=new Set();
 for(const c of TELKIN_CHAPTERS){const p=CHAPTER_GAMEPLAY[String(c.n)];if(!p){problems.push(`Bölüm ${c.n}: oynanış profili yok`);continue;}const seq=p.steps||[];taskCount+=seq.length;if(seq.length<3)problems.push(`Bölüm ${c.n}: görev sayısı ${seq.length}`);mechTypes.add(p.system);for(const st of seq){if(!LOC_INFO[st.loc])problems.push(`Bölüm ${c.n}: tanımsız mekân ${st.loc}`);if(!st.goal)problems.push(`Bölüm ${c.n}: boş görev`);}}
 if(problems.length)console.warn('[TELKİN gameplay QA]',problems);else console.info(`[TELKİN gameplay QA] 144/144 bölüm · ${taskCount} fiziksel görev · ${mechTypes.size} sistem türü hazır.`);
 return {ok:problems.length===0,problems,chapters:Object.keys(CHAPTER_GAMEPLAY).length,tasks:taskCount,mechanics:mechTypes.size};
}
if(location.search.includes('debug')){window.TELKIN_DEBUG={state:()=>({px,pz,yaw,pitch,story:{...story},activeChapter,chapterSeqIndex,activeAtlas,atlasBrowseMode,completedChapters:[...completedChapters]}),goto:n=>startChapter(Number(n)),teleport:(x,z)=>{const s=findNearestFree(Number(x),Number(z),4);if(s){px=s[0];pz=s[1];}},locations:LOC_INFO,chapters:TELKIN_CHAPTERS,gameplay:CHAPTER_GAMEPLAY,characterPacks:CHARACTER_PACKS,validate:()=>({narrative:validateNarrativeContent(),gameplay:validateGameplayProfiles(),characters:Object.fromEntries(Object.entries(CHARACTER_PACKS).map(([k,v])=>[k,{status:v.status,frames:Object.keys(v.frames||{}).length}])),offline:true}),
   actors:()=>((activeAtlas?atlasObjs:objs).filter(o=>o.kind==='npc3d').map(o=>({character:o.character,x:+o.x.toFixed(2),z:+o.z.toFixed(2),state:o.actorState,ambient:o.ambientStyle||'',move:+(o.moveAmount||0).toFixed(2)}))),
   freeRoam:(on=true)=>{atlasBrowseMode=!!on;if(on){clearChapterTargetVisual();objectiveEl.textContent='SERBEST KEŞİF';}else if(activeAtlas)syncChapterTargetVisual();return atlasBrowseMode;},
   setNihyel:(on)=>{setNihyel(!!on);return nihyelActive;},reload:()=>location.reload()};}
let TELKIN_RUNTIME_FAILED=false;
function showRuntimeError(msg){
 TELKIN_RUNTIME_FAILED=true;
 try{saveGame(true)}catch(_){}
 const fb=document.getElementById('fallback');
 if(fb){fb.style.display='grid';fb.innerHTML='<div style="max-width:620px;padding:24px;text-align:center"><b>TELKİN çalışma hatası</b><br><br>'+String(msg).replace(/[<>&]/g,s=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]))+'<br><br>Sayfayı yenile. Sorun sürerse bu mesajın ekran görüntüsünü gönder.</div>';}
}
function isBenignPointerCaptureError(msg){const t=String(msg||'');return /(?:set|release)PointerCapture/i.test(t)&&/(?:InvalidStateError|NotFoundError)/i.test(t)}
addEventListener('error',e=>{if(e&&e.message){if(isBenignPointerCaptureError(e.message)){console.warn('[TELKİN mobil kontrol] Pointer capture desteklenmedi; oyun capture olmadan devam ediyor.');if(e.preventDefault)e.preventDefault();return;}showRuntimeError(e.message)}});
addEventListener('unhandledrejection',e=>{const reason=e&&e.reason?(e.reason.message||e.reason):'Bilinmeyen Promise hatası';if(isBenignPointerCaptureError(reason)){console.warn('[TELKİN mobil kontrol] Pointer capture Promise hatası yok sayıldı.');if(e.preventDefault)e.preventDefault();return;}try{if(typeof Mechanics!=='undefined'&&Mechanics.cancelAll)Mechanics.cancelAll();}catch(_){}showRuntimeError(reason);});

Promise.all([
 loadTex('wall',TEX.wall),loadTex('floor',TEX.floor),loadTex('wood',TEX.wood),loadTex('doorWood',TEX.doorWood,false),loadTex('rug',TEX.rug),
 loadTex('city',TEX.city,false),loadTex('eren',TEX.eren,false),
 ...Object.entries(REAL_NPC_SPRITES).map(([name,url])=>loadTex(realNpcTexKey(name),url,false)),
 ...Object.entries(MAHIR_FRAMES).map(([name,url])=>loadTex('mahir_'+name,url,false))
]).then(()=>{
 const resumed=loadGame();syncStoryUI();syncInspectionBar();if(resumed&&audioOn){try{setAudio(true)}catch(_){soundBtn.textContent=TT('ui.soundOn','SES: AÇIK');soundBtn.classList.add('on');}}const restoredOk=resumed?syncRestoredModeUI():false;renderChapterPanel();renderLocationPanel();validateNarrativeContent();validateGameplayProfiles();
console.info('[TELKIN v6.22.1 STAGING] KONTROL DÜZELTMESİ · JOYSTICK SOL/SAĞ EKSENİ NORMALLEŞTİRİLDİ.');
 addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelChapterAction();saveGame(true);try{if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.suspend();else if(audioCtx&&audioCtx.state==='running')audioCtx.suspend()}catch(e){}}
    else{try{if(window.TELKIN_AUDIO)window.TELKIN_AUDIO.resume();else if(audioOn&&audioCtx&&audioCtx.state==='suspended')audioCtx.resume()}catch(e){}}
  });addEventListener('pagehide',()=>{cancelChapterAction();saveGame(true)});
 let last=performance.now();
 let perfAcc=0,perfN=0,perfCool=0;
  function adaptQuality(ms){
    if(document.hidden||ms>200)return;
    perfAcc+=ms;perfN++;if(perfN<90)return;
    const avg=perfAcc/perfN;perfAcc=0;perfN=0;
    if(perfCool>0){perfCool--;return;}
    if(avg>26&&dprCap>0.8){dprCap=Math.max(0.8,+(dprCap-0.2).toFixed(2));resize();perfCool=3;}
    else if(avg<18&&dprCap<1.6){dprCap=Math.min(1.6,+(dprCap+0.2).toFixed(2));resize();perfCool=6;}
  }
  function loop(t){const raw=t-last;const dt=Math.min(.035,raw/1000);last=t;adaptQuality(raw);update(dt);render();requestAnimationFrame(loop)}
 requestAnimationFrame(loop);
 if(!restoredOk){
   let firstNeeded=null;for(let n=1;n<=144;n++){if(!completedChapters.has(n)){firstNeeded=n;break}}
   if(firstNeeded!==null)setTimeout(()=>startChapter(firstNeeded),120);
   else{activeChapter=144;activeVolume=4;chapterCompleteShown=true;objectiveEl.textContent='TELKİN TAMAMLANDI · 144/144';setTimeout(()=>showDlg('TELKİN · FİNAL','144 bölümün tamamı bitirildi. Bu kayıt final durumunda korunuyor.'),180);}
 }else if(chapterCompleteShown&&activeChapter<144){
   const nextNo=activeChapter+1;setTimeout(()=>startChapter(nextNo),160);
 }else if(chapterCompleteShown&&activeChapter===144){
   objectiveEl.textContent='TELKİN TAMAMLANDI · 144/144';setTimeout(()=>showDlg('TELKİN · FİNAL','144 bölüm tamamlandı. Final kaydı korunuyor.'),180);
 }else if(chapterSeqIndex<chapterSequence(chapterByNo(activeChapter)).length){
   setTimeout(()=>showDlg(`TELKİN · DEVAM`, `Bölüm ${activeChapter} kaldığın yerden devam ediyor.\n\nMavi görev göstergesini takip et.`),220);
 }
}).catch(e=>{document.getElementById('fallback').style.display='grid';document.getElementById('fallback').textContent='3D dünya yüklenemedi: '+e.message});

function refreshRuntimeLanguage(){
 try{
  if(versionBadge)versionBadge.textContent='v6.22.6 · SİNEMATİK MİNİMAL HUD';
  if(soundBtn)soundBtn.textContent=audioOn?TT('ui.soundOn','SES: AÇIK'):TT('ui.soundOff','SES: KAPALI');
  if(interact)interact.textContent=isDialogueOpen?TT('ui.continue','DEVAM'):TT('ui.interact','ETKİLEŞ');
  updateArcadeButton();
  if(arcadePanel?.classList.contains('show')){const type=selectedArcadeType||chapterArcadeType(activeChapter);renderArcadeShelf(chapterArcadeType(activeChapter));refreshArcadePreview(type);}
  if(storyPanel?.classList.contains('show'))syncStoryUI();
 }catch(e){console.warn('[TELKIN i18n refresh]',e);}
}
window.addEventListener('telkin:languagechange',refreshRuntimeLanguage);
window.addEventListener('telkin:i18nready',refreshRuntimeLanguage);
})();
