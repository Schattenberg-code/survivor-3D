import { WN, REG, TY, CH, UPG } from './data/catalog.js';
import { createTerrain } from './world/terrain.js';
import { createEffects } from './effects/particles.js';
import { createChestFactory } from './models/chest.js';
import { createCharacterPreview } from './models/characterPreview.js';
import { createFirstPersonHand } from './models/firstPersonHand.js';
import { createEnemyModels } from './entities/enemyModels.js';
import { createDragonModel } from './entities/dragon.js';
import { createEntitySystem } from './entities/entitySystem.js';
import { loadSave, writeSave } from './systems/save.js';
import { createProgression, createStatDefinitions } from './systems/progression.js';
import { createWeaponDefinitions } from './systems/weapons.js';
import { ICO, svg } from './ui/icons.js';
import { renderClassCards, renderGameOverStats, renderLevelOptions, renderUpgradeCards, renderWeaponSlots } from './ui/views.js';

const T=window.THREE,$=id=>document.getElementById(id),R=(a,b)=>a+Math.random()*(b-a);
let save=loadSave();
const store=()=>writeSave(save);

// ---------- SISTEMA DE ÍCONES VETORIAIS MINIMALISTAS ----------


$('hudKillIco').innerHTML=ICO.kills;
$('menuSoulIco').innerHTML=ICO.soul;
$('lvlBadgeIco').innerHTML=ICO.level;
$('pauseBadgeIco').innerHTML=ICO.pause;
$('overBadgeIco').innerHTML=ICO.kills;

// ---------- cena ----------
const cv=$('c'),rn=new T.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
rn.setPixelRatio(1);rn.domElement.style.imageRendering='pixelated';rn.outputEncoding=T.sRGBEncoding;
const sc=new T.Scene(),cam=new T.PerspectiveCamera(70,1,.1,220);
function rs(){const q=.42;rn.setSize(Math.max(320,Math.floor(innerWidth*q)),Math.max(200,Math.floor(innerHeight*q)),false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
sc.add(new T.HemisphereLight(0xb2bcc0,0x2c332e,.66));
const sun=new T.DirectionalLight(0xc8d0cc,.62);sun.position.set(-28,42,18);sc.add(sun);

const {smoothstep,getHeight,getTerrainNormal,updateTerrain,cg,cs,cd}=createTerrain(T,sc);
const UP=new T.Vector3(0,1,0),M4=new T.Matrix4(),Q=new T.Quaternion(),Q2=new T.Quaternion(),V=new T.Vector3(),NRM=new T.Vector3(),S=new T.Vector3(),C=new T.Color();
function inst(g,n,mat){const m=new T.InstancedMesh(g,mat||new T.MeshLambertMaterial(),n);m.setColorAt(0,C.set(1,1,1));m.frustumCulled=false;m.count=0;sc.add(m);return m}
function flatGeo(g){return g.index?g.toNonIndexed():g}
function put(m,i,x,y,z,sx,sy,sz,c,ry){Q.setFromAxisAngle(UP,ry||0);M4.compose(V.set(x,y,z),Q,S.set(sx,sy,sz));m.setMatrixAt(i,M4);if(c!==undefined)m.setColorAt(i,C.set(c))}
function putTilted(m,i,x,y,z,sx,sy,sz,c,ry,tilt){Q.setFromAxisAngle(UP,ry||0);if(tilt){getTerrainNormal(x,z,NRM);Q2.setFromUnitVectors(UP,NRM);Q.premultiply(Q2)}M4.compose(V.set(x,y,z),Q,S.set(sx,sy,sz));m.setMatrixAt(i,M4);if(c!==undefined)m.setColorAt(i,C.set(c))}
function done(m,n){m.count=n;m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true}
const enGeo=[new T.IcosahedronGeometry(1,1),new T.ConeGeometry(.75,2.1,5),new T.TetrahedronGeometry(1,1),new T.DodecahedronGeometry(1,0),new T.IcosahedronGeometry(1,2)];const enM=enGeo.map(g=>inst(g,480));

// ---------- INIMIGOS COMUNS REFORMULADOS (LOW-POLY ARTICULADO) ----------
const enemyModels=createEnemyModels({T,inst,flatGeo,getHeight,getRegionIndex:()=>rIdx});
let corpses=[];

const dragonModels=createDragonModel({T,inst,flatGeo,getHeight,smoothstep,fx:(...args)=>fx(...args),random:R,getPlayer:()=>P,isPlaying:()=>state==='play'});
const gemM=inst(new T.OctahedronGeometry(.3,0),620),
 prM=inst(new T.IcosahedronGeometry(.3,0),200),paM=inst(new T.TetrahedronGeometry(.2,0),420),
 orbM=inst(new T.IcosahedronGeometry(.5,0),14),dcM=inst(new T.ConeGeometry(1,3.2,5),150);
const dec=[];for(let i=0;i<150;i++)dec.push({x:R(-70,70),z:R(-70,70),s:R(.7,1.8),k:Math.random()});

const treeData=[];
for(let i=0;i<58;i++) treeData.push({x:R(-68,68),z:R(-68,68),s:R(.72,1.65),rot:R(0,6.28),tone:Math.random()});
const trunkM=inst(new T.CylinderGeometry(.22,.34,2.2,7),90);
const crownM=inst(new T.ConeGeometry(1.25,2.35,7),90);
const crown2M=inst(new T.ConeGeometry(.92,1.8,7),90);
const grassM=inst(new T.ConeGeometry(.075,.55,4),2600);
const rockM=inst(new T.DodecahedronGeometry(1,0),180);
const grassData=[];
for(let i=0;i<2600;i++) grassData.push({x:R(-70,70),z:R(-70,70),s:R(.35,1.15),r:R(0,6.28),c:Math.random()});
const rockData=[];
for(let i=0;i<65;i++) rockData.push({x:R(-68,68),z:R(-68,68),s:R(.45,1.5),r:R(0,6.28)});
function wrapNear(v,center,range=140){return center+(((v-center+range/2)%range+range)%range-range/2)}
function treeCollision(x,z){
 for(const tr of treeData){
  const tx=wrapNear(tr.x,P.x),tz=wrapNear(tr.z,P.z);
  const dx=x-tx,dz=z-tz,rr=.72*tr.s+.42;
  if(dx*dx+dz*dz<rr*rr)return {x:tx,z:tz,r:rr};
 }
 return null;
}

// jogador
const pl=new T.Group(),bodyM=new T.MeshStandardMaterial({color:0x3a7bd5,roughness:.9,flatShading:true});
const skinM=new T.MeshStandardMaterial({color:0xffd0a0,flatShading:true}),darkM=new T.MeshStandardMaterial({color:0x20243a,flatShading:true});
const metalM=new T.MeshStandardMaterial({color:0xe4e9ff,metalness:.3,roughness:.45,flatShading:true});
const bd=new T.Mesh(new T.CylinderGeometry(.42,.58,1.05,7),bodyM);bd.position.y=.95;bd.castShadow=true;
const chest=new T.Mesh(new T.BoxGeometry(.78,.38,.48),new T.MeshStandardMaterial({color:0x243b70,flatShading:true}));chest.position.set(0,1.05,0);
const hd=new T.Mesh(new T.IcosahedronGeometry(.39,1),skinM);hd.position.y=1.82;hd.castShadow=true;
const hair=new T.Mesh(new T.ConeGeometry(.42,.35,6),darkM);hair.position.set(0,2.12,0);
const legL=new T.Mesh(new T.BoxGeometry(.23,.55,.27),darkM);legL.position.set(-.2,.28,0);const legR=legL.clone();legR.position.x=.2;
const armL=new T.Mesh(new T.BoxGeometry(.2,.62,.22),bodyM);armL.position.set(-.52,.98,0);const armR=armL.clone();armR.position.x=.52;
const sw=new T.Group(),blade=new T.Mesh(new T.BoxGeometry(.13,.13,1.15),metalM);blade.position.z=.52;
const guard=new T.Mesh(new T.BoxGeometry(.5,.12,.16),darkM);guard.position.z=-.08;sw.add(blade,guard);sw.position.set(.72,1.05,.38);
pl.add(bd,chest,hd,hair,legL,legR,armL,armR,sw);pl.visible=false;

// ---------- VITRINE 3D DAS CLASSES NO MENU ----------
const preview=createCharacterPreview(T,$('charCanvas'),CH,WN,()=>sel,$('charTag'),$('charSub'));
const fpRig=new T.Group();
const fpHand=new T.Mesh(new T.BoxGeometry(.22,.24,.42),new T.MeshStandardMaterial({color:0x514039,roughness:1,flatShading:true}));
fpHand.position.set(.42,-.38,-.72);fpRig.add(fpHand);
const fpBlade=new T.Mesh(new T.BoxGeometry(.095,.075,.88),new T.MeshStandardMaterial({color:0x777b78,roughness:.85,metalness:.12,flatShading:true}));
fpBlade.position.set(.39,-.27,-1.22);fpBlade.rotation.x=-.18;fpRig.add(fpBlade);
const fpGuard=new T.Mesh(new T.BoxGeometry(.34,.075,.09),new T.MeshStandardMaterial({color:0x292522,flatShading:true}));
fpGuard.position.set(.4,-.36,-.83);fpRig.add(fpGuard);
cam.add(fpRig);fpRig.visible=false;

const {hrig,poseHand,handHit,resetHand}=createFirstPersonHand(T,sc,{getWeapons:()=>wp,getState:()=>state,getBob:()=>bob,playerMaterial:bodyM});
const lantern=new T.PointLight(0xe4e8d8,2.0,25,1.35);lantern.position.set(0,0,0);cam.add(lantern);

const makeChest=createChestFactory(T);

const SD=createStatDefinitions(()=>st);

// ---------- estado ----------
let st,P={x:0,z:0},en=[],gems=[],pr=[],pa=[],ch=[],wp={},t=0,kills=0,sp=0,nextBoss=60,chestT=10,orbT=0,oa=0,inv=0,boss=null,bossN=0,earned=0,rIdx=0,pend=0,vig=0,bt=0,
 state='menu',sel=0,yaw=0,pit=0,lk=false,drag=false,curOpts=[],bob=0,burstT=30,tmx=0,magnetFlash=0,hOrb=0;
const keys={};
const {addXp}=createProgression(()=>st,()=>pend++);

function banner(s){const b=$('bn');b.textContent=s;b.hidden=false;clearTimeout(bt);bt=setTimeout(()=>b.hidden=true,2600)}
const {fx,ring}=createEffects({getParticles:()=>pa,getHeight,random:R});
const entitySystem=createEntitySystem({
 get st(){return st},get P(){return P},get en(){return en},get gems(){return gems},get pr(){return pr},get corpses(){return corpses},
 get kills(){return kills},set kills(value){kills=value},get bossN(){return bossN},set bossN(value){bossN=value},
 get earned(){return earned},set earned(value){earned=value},get boss(){return boss},set boss(value){boss=value},
 get ch(){return ch},get wp(){return wp},get t(){return t},get rIdx(){return rIdx},
 getHeight,fx,addXp,makeChest,sc,R,REG,TY,WN,svg,$,handHit,banner,renderWeaponSlots
});
const {d2,near,rndE,hit,kill,aim,addW,mkChest,spawn,pickType}=entitySystem;
const WD=createWeaponDefinitions({
 getStats:()=>st,getEnemies:()=>en,getPlayer:()=>P,getProjectiles:()=>pr,
 d2,hit,near,rndE,aim,ring,getHeight
});
function genOpts(){const pool=[];
 for(const s of SD){
  const m=Math.random()<.1+st.luck*.06?2:1;
  pool.push({r:m>1,ico:s[0],title:s[1],tag:m>1?'Raro':'Atributo',desc:s[2](m),f:()=>s[3](m)});
 }
 for(const id in WN){
  const w=wp[id];if(w&&w.lv>=8)continue;
  pool.push({r:false,ico:id,title:WN[id],tag:w?'Nv '+(w.lv+1):'Nova arma',desc:WD[id].t+'. Mais dano e velocidade',f:()=>addW(id)});
 }
 return pool.sort(()=>Math.random()-.5).slice(0,3)}

function lvlUp(){state='lvl';document.exitPointerLock&&document.exitPointerLock();curOpts=genOpts();
 renderLevelOptions($('opts'),curOpts,svg);
 $('lvl').hidden=false}

function chestReward(){const r=Math.random();
 if(r<.45){const ids=Object.keys(WN).filter(k=>!wp[k]||wp[k].lv<8),id=ids[Math.random()*ids.length|0];addW(id);banner(`Baú: ${WN[id]} evoluída`)}
 else if(r<.7){st.hp=Math.min(st.max,st.hp+st.max*.5);banner('Baú: Vida restaurada')}
 else if(r<.88){const s=SD[Math.random()*SD.length|0];s[3](2);banner(`Baú: ${s[1]} (Raro)`)}
 else{earned+=15;banner('Baú: +15 almas')}}

function begin(){const c=CH[sel];
 st={hp:100+save.hp*10,max:100+save.hp*10,spd:1+save.spd*.03,dmg:1+save.dmg*.05,as:1,ar:1,luck:0,mag:1,rg:0,lvl:1,xp:0,need:6};
 for(const e of ch)sc.remove(e.m);
 P={x:0,z:0};en=[];corpses=[];gems=[];pr=[];pa=[];ch=[];wp={};t=0;kills=0;sp=0;nextBoss=60;chestT=10;inv=0;boss=null;bossN=0;earned=0;rIdx=-1;pend=0;burstT=30;orbT=0;
 bodyM.color.set(c.c);resetHand();hOrb=0;addW(c.w);
 $('menu').hidden=$('over').hidden=$('pause').hidden=true;$('hud').hidden=false;state='play';lock()}

function die(){state='over';document.exitPointerLock&&document.exitPointerLock();
 earned+=Math.floor(kills/8)+Math.floor(t/15);save.souls+=earned;store();
 const m=Math.floor(t/60),s=Math.floor(t%60);
 const rows=[
  ['time','Tempo',`${m}:${String(s).padStart(2,'0')}`,false],
  ['kills','Inimigos',kills,false],
  ['level','Nível',st.lvl,false],
  ['boss','Chefes',bossN,false],
  ['soul','Almas ganhas',`+${earned}`,true]
 ];
 renderGameOverStats($('stats'),rows,svg);
 $('hud').hidden=true;$('pause').hidden=true;$('over').hidden=false}

function menu(){state='menu';$('pause').hidden=true;$('over').hidden=true;$('lvl').hidden=true;$('hud').hidden=true;$('menu').hidden=false;$('sl').textContent=save.souls;
 $('chs').innerHTML=renderClassCards(CH,save.unl,sel,WN,svg);
 $('ups').innerHTML=renderUpgradeCards(UPG,save,svg);
 preview.sync();}

// ---------- entrada ----------
function lock(){try{cv.requestPointerLock()}catch(e){}}
document.addEventListener('pointerlockchange',()=>lk=document.pointerLockElement===cv);
addEventListener('keydown',e=>{
 if(e.code==='Escape'){
  e.preventDefault();
  if(state==='play'){state='pause';$('pause').hidden=false;document.exitPointerLock&&document.exitPointerLock();for(const k in keys)keys[k]=false;}
  else if(state==='pause'){state='play';$('pause').hidden=true;lock();}
  return;
 }
 if(!keys[e.code]&&e.code==='KeyQ'&&state==='play'){for(const g of gems)g.m=true;magnetFlash=1.1;banner('Ímã de XP ativado');}
 keys[e.code]=true;
});addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('mousemove',e=>{if(state=='play'&&(lk||drag)){yaw-=e.movementX*.003;pit=Math.min(1.05,Math.max(-1.05,pit+e.movementY*.003))}});
cv.addEventListener('mousedown',()=>{drag=true;if(state=='play'&&!lk)lock()});addEventListener('mouseup',()=>drag=false);
$('start').onclick=()=>begin();$('again').onclick=menu;
$('resume').onclick=()=>{if(state==='pause'){state='play';$('pause').hidden=true;lock()}};
$('pauseMenu').onclick=menu;
$('menu').onclick=e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.c!==undefined){const i=+b.dataset.c;if(save.unl.includes(i))sel=i;else if(save.souls>=CH[i].u){save.souls-=CH[i].u;save.unl.push(i);sel=i;store()}menu()}
 if(b.dataset.u){const u=UPG.find(x=>x[0]==b.dataset.u),cost=u[2]*(1+save[u[0]]);if(save.souls>=cost){save.souls-=cost;save[u[0]]++;store()}menu()}};
$('opts').onclick=e=>{const b=e.target.closest('button');if(!b)return;curOpts[+b.dataset.o].f();$('lvl').hidden=true;state='play';lock();if(pend>0){pend--;lvlUp()}};

// ---------- atualização ----------
function upd(dt){
 t+=dt;const ri=Math.floor(t/90)%5;if(ri!=rIdx){rIdx=ri;banner(REG[ri].n)}
 let ix=(keys.KeyD?1:0)-(keys.KeyA?1:0),iz=(keys.KeyW?1:0)-(keys.KeyS?1:0);
 if(ix||iz){const l=Math.hypot(ix,iz);ix/=l;iz/=l;
  const vx=ix*Math.cos(yaw)-iz*Math.sin(yaw),vz=-ix*Math.sin(yaw)-iz*Math.cos(yaw);
  const h0=getHeight(P.x,P.z),hAhead=getHeight(P.x+vx*.6,P.z+vz*.6);
  const slope=Math.max(-.35,Math.min(.35,(hAhead-h0)/.6));
  const s=8*st.spd*(1-slope*.16)*dt;
  const nx=P.x+vx*s,nz=P.z+vz*s;
  if(!treeCollision(nx,P.z))P.x=nx;
  if(!treeCollision(P.x,nz))P.z=nz;
  pl.rotation.y=Math.atan2(vx,vz);bob+=dt*12}
 if(t>=nextBoss){nextBoss+=90;spawn(4,true);banner('CHEFE: '+REG[rIdx].b[0])}
 sp+=dt*(1.5+t*.07);while(sp>=1){sp--;if(en.length<420)spawn(pickType())}
 burstT-=dt;if(burstT<=0){burstT=30;for(let i=0;i<25&&en.length<420;i++)spawn(pickType())}
 chestT-=dt;if(chestT<=0&&ch.length<2){chestT=40;const a=R(0,6.283);ch.push(mkChest(P.x+Math.cos(a)*18,P.z+Math.sin(a)*18))}
 for(const id in wp){const w=wp[id],d=WD[id];if(id=='orb')continue;w.t-=dt;if(w.t<=0&&en.length){w.t=d.cd/st.as;d.f(w);handHit(id)}}
 hOrb-=dt;if(wp.orb&&hOrb<=0&&en.length){hOrb=.8;handHit('orb')}
 if(wp.orb){const w=wp.orb,n=Math.max(2,w.lv+1);oa+=dt*2.8*st.as;orbT-=dt;
  if(orbT<=0){orbT=.35;for(let i=0;i<n;i++){const a=oa+i*6.283/n,ox=P.x+Math.cos(a)*3.5*st.ar,oz=P.z+Math.sin(a)*3.5*st.ar;for(const e of en)if(d2(e,ox,oz)<(e.r+.8)**2)hit(e,6+3*w.lv,0xc58bff)}}}
 for(const p of pr){p.x+=p.vx*dt;p.z+=p.vz*dt;p.y=Math.max(p.y+p.vy*dt,getHeight(p.x,p.z)+.45);p.l-=dt;
  for(const e of en){if(e.dead||p.p<=0)continue;if(d2(e,p.x,p.z)<(e.r+.5)**2&&!p.hs.has(e)){
   p.hs.add(e);
   if(p.k=='f'){const Rr=3*st.ar;for(const o of en)if(d2(o,p.x,p.z)<(Rr+o.r)**2)hit(o,p.d,0xff8a2a);ring(p.x,p.z,Rr,0xff8a2a);p.p=0;p.l=0}
   else{hit(e,p.d,0x9be86b);p.p--}}}
  if(p.p<=0)p.l=0}
 pr=pr.filter(p=>p.l>0);
 inv-=dt;
 for(const e of en){if(e.dead)continue;const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz)||1;
  if(d>e.r+.5){e.x+=dx/d*e.spd*dt;e.z+=dz/d*e.spd*dt}
  e.f-=dt;
  const targetFa=Math.atan2(dx,dz);
  if(e.fa===undefined)e.fa=targetFa;
  if(e.ty===4){
   const diff=((targetFa-e.fa+Math.PI*3)%(Math.PI*2))-Math.PI;
   const maxTurn=2.2*dt;
   e.fa+=Math.max(-maxTurn,Math.min(maxTurn,diff));
  }else{
   e.fa=targetFa;
  }
  if(e.ty===0){e.fly=(e.fly||0)+dt*7.5;e.y=getHeight(e.x,e.z)+1.25+Math.sin(e.fly+e.ph)*.16;}
  if(d<e.r+.7&&inv<=0){inv=.5;st.hp-=e.dmg;vig=1}
  if(e.ty==4){e.bs-=dt;if(e.bs<=0){e.bs=4;ring(e.x,e.z,10,0x3be8ff);ring(e.x,e.z,6,0x1e90ff);if(d<9&&inv<=0){inv=.5;st.hp-=20;vig=1}}}}
 en=en.filter(e=>!e.dead);if(boss&&boss.dead)boss=null;
 const mr=4*st.mag;
 for(let i=gems.length-1;i>=0;i--){const g=gems[i],dx=P.x-g.x,dz=P.z-g.z,d=Math.hypot(dx,dz);
  if(d<mr||g.m){g.m=true;const pull=Math.max(18,Math.min(42,d*2.4));g.x+=dx/(d||1)*pull*dt;g.z+=dz/(d||1)*pull*dt}
  if(d<.8){addXp(g.v);gems.splice(i,1)}}
 for(let i=ch.length-1;i>=0;i--){const c=ch[i];if(d2(c,P.x,P.z)<3.2){chestReward();sc.remove(c.m);ch.splice(i,1)}}
 for(const p of pa){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=6*dt;p.l-=dt;const fl=getHeight(p.x,p.z)+.1;if(p.y<fl){p.y=fl;p.vy*=-.3}}
 pa=pa.filter(p=>p.l>0);
 st.hp=Math.min(st.max,st.hp+st.rg*dt);
 if(st.hp<=0){die();return}
 if(pend>0&&state=='play'){pend--;lvlUp()}
 $('hp').style.width=Math.max(0,st.hp/st.max*100)+'%';$('hpt').textContent=Math.ceil(st.hp)+' / '+st.max;
 $('xp').style.width=st.xp/st.need*100+'%';$('lv').textContent='Nível '+st.lvl;
 $('tm').textContent=Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');$('rg').textContent=REG[rIdx].n;$('kl').textContent=kills;
 $('boss').hidden=!boss;if(boss){$('bnm').textContent=REG[rIdx].b[0];$('bh').style.width=Math.max(0,boss.hp/boss.mx*100)+'%'}
}

// ---------- RENDERIZAÇÃO DOS INIMIGOS COMUNS REFORMULADOS ----------
// ---------- desenho ----------
function draw(dt,now){
 if(state=='menu'){
  yaw+=dt*.2;
  preview.update(dt,now);
 }
 const tr=REG[Math.max(0,rIdx)];cg.lerp(C.set(tr.g),.02);cs.lerp(C.set(tr.s),.02);cd.lerp(C.set(tr.d),.02);sc.fog.near=5;sc.fog.far=58;
 sc.background.copy(cs);sc.fog.color.copy(cs);
 updateTerrain(P.x,P.z,false);
 const py=getHeight(P.x,P.z);
 pl.position.set(P.x,py,P.z);sw.rotation.x=Math.sin(now/90)*.4;fpRig.position.y=Math.sin(now/105)*.018;
 if(state==='play'||state==='pause'||state==='lvl'){
  cam.position.set(P.x,py+1.66,P.z);
  const cp=Math.cos(pit),dx=-Math.sin(yaw)*cp,dz=-Math.cos(yaw)*cp;
  cam.lookAt(P.x+dx*12,py+1.66-Math.sin(pit)*12,P.z+dz*12);
  fpRig.visible=true;
  hrig.position.copy(cam.position);hrig.quaternion.copy(cam.quaternion);hrig.visible=true;poseHand(now,dt);
 }else{
  const cx=P.x+Math.sin(yaw)*10,cz=P.z+Math.cos(yaw)*10;
  const cy=Math.max(py+7.5,getHeight(cx,cz)+3.2);
  cam.position.set(cx,cy,cz);
  cam.lookAt(P.x,py+1.2,P.z);fpRig.visible=false;hrig.visible=false;
 }
 for(let i=0;i<dec.length;i++){const d=dec[i];d.x=P.x+((d.x-P.x+70)%140+140)%140-70;d.z=P.z+((d.z-P.z+70)%140+140)%140-70;
  const dy=getHeight(d.x,d.z);
  put(dcM,i,d.x,dy+1.45*d.s,d.z,d.s,d.s,d.s,C.copy(cd).multiplyScalar(.8+.4*d.k).getHex())}
 done(dcM,dec.length);
 let n=0;for(let i=0;i<treeData.length;i++){const tr=treeData[i],x=wrapNear(tr.x,P.x),z=wrapNear(tr.z,P.z),s=tr.s,gy=getHeight(x,z);
  put(trunkM,n,x,gy+1.08*s-.14,z,.24*s,1.1*s,.24*s,0x30231d,tr.rot);
  put(crownM,n,x,gy+2.45*s-.14,z,1.05*s,1.25*s,1.05*s,tr.tone>.5?0x101c16:0x17231a,tr.rot);
  put(crown2M,n,x,gy+3.18*s-.14,z,.78*s,.95*s,.78*s,tr.tone>.5?0x18251a:0x202a1c,tr.rot);n++;
 }done(trunkM,n);done(crownM,n);done(crown2M,n);
 n=0;for(const gr of grassData){const x=wrapNear(gr.x,P.x),z=wrapNear(gr.z,P.z),gy=getHeight(x,z);
  const hs=gy>4.2?Math.max(.35,1-(gy-4.2)*.18):1;
  put(grassM,n++,x,gy+.20*gr.s*hs,z,.65*gr.s,gr.s*hs,.65*gr.s,gr.c>.5?0x263526:0x17271b,gr.r)}
 done(grassM,n);
 n=0;for(const ro of rockData){const x=wrapNear(ro.x,P.x),z=wrapNear(ro.z,P.z),gy=getHeight(x,z);
  putTilted(rockM,n++,x,gy+.22*ro.s,z,ro.s,.55*ro.s,.82*ro.s,ro.s>1?0x34383b:0x24282a,ro.r,true)}
 done(rockM,n);
 const ts=now/1000,counts=[0,0,0,0,0];let ravenCount=0,spiderCount=0,golemCount=0,dragonCount=0;
 for(const e of en){
  const ey=getHeight(e.x,e.z);
  if(e.ty===0&&ravenCount<enemyModels.max){
   const distP=Math.hypot(P.x-e.x,P.z-e.z);
   const atk=distP<e.r+2.2?smoothstep(e.r+2.2,e.r+.5,distP):0;
   enemyModels.renderRaven(ravenCount++,e.x,e.y||(ey+1.25),e.z,e.sx,e.fa,e.ph,ts,e.f,atk,0);
  }else if(e.ty===1&&spiderCount<enemyModels.max){
   const distP=Math.hypot(P.x-e.x,P.z-e.z);
   const atk=distP<e.r+2.1?smoothstep(e.r+2.1,e.r+.5,distP):0;
   enemyModels.renderSpider(spiderCount++,e.x,ey,e.z,e.sx,e.fa,e.ph,ts,e.f,atk,0);
  }else if(e.ty===2&&golemCount<enemyModels.max){
   const distP=Math.hypot(P.x-e.x,P.z-e.z);
   const atk=distP<e.r+2.4?smoothstep(e.r+2.4,e.r+.5,distP)*(.5+.5*Math.sin(ts*6.5+e.ph)):0;
   enemyModels.renderGolem(golemCount++,e.x,ey,e.z,e.sx,e.fa,e.ph,ts,e.f,atk,0);
  }else if(e.ty===4&&dragonCount<dragonModels.max){
   dragonModels.render(e,dragonCount++,dt,ts);
  }else{
   const m=enM[e.ty],n=counts[e.ty]++;
   put(m,n,e.x,ey+e.sy+Math.abs(Math.sin(ts*7+e.ph))*.25,e.z,e.sx,e.sy,e.sz,e.f>0?0xffffff:e.c,e.fa);
  }
 }

 // Animação visual de morte dos inimigos reformulados (sem interferir na lógica/IA)
 for(let ci=corpses.length-1;ci>=0;ci--){
  const c=corpses[ci];
  if(state==='play')c.t+=dt;
  const p=Math.min(1,c.t/c.dur);
  if(p>=1){corpses.splice(ci,1);continue}
  const ey=getHeight(c.x,c.z);
  const sc=c.sx*(1-p*.45);
  if(c.ty===0&&ravenCount<enemyModels.max){
   const fallY=Math.max(ey+.18,c.y*(1-p*p)+(ey+.18)*(p*p));
   enemyModels.renderRaven(ravenCount++,c.x,fallY,c.z,sc,c.fa+p*3.5,c.ph,ts,p<.18?.1:0,0,p);
  }else if(c.ty===1&&spiderCount<enemyModels.max){
   enemyModels.renderSpider(spiderCount++,c.x,ey,c.z,sc,c.fa,c.ph,ts,p<.18?.1:0,0,p);
  }else if(c.ty===2&&golemCount<enemyModels.max){
   enemyModels.renderGolem(golemCount++,c.x,ey,c.z,sc,c.fa,c.ph,ts,p<.18?.1:0,0,p);
  }
 }

 for(let i=0;i<enM.length;i++)done(enM[i],counts[i]);
 enemyModels.finish(ravenCount,spiderCount,golemCount);
 dragonModels.finish(dragonCount);
 n=0;for(const g of gems)put(gemM,n++,g.x,getHeight(g.x,g.z)+.6+Math.sin(ts*4+g.x)*.1,g.z,1,1.4,1,0x38c6f4,ts*2);done(gemM,n);
 n=0;for(const p of pr)put(prM,n++,p.x,p.y,p.z,p.k=='f'?1.6:.7,p.k=='f'?1.6:.7,p.k=='f'?1.6:1.8,p.k=='f'?0xff7a1a:0xd6f5a0);done(prM,n);
 n=0;for(const p of pa)put(paM,n++,p.x,p.y,p.z,p.s,p.s,p.s,p.c,p.l*5);done(paM,n);
 n=0;if(wp.orb&&state!='menu'){const k=Math.max(2,wp.orb.lv+1);for(let i=0;i<k;i++){const a=oa+i*6.283/k,ox=P.x+Math.cos(a)*3.5*st.ar,oz=P.z+Math.sin(a)*3.5*st.ar;put(orbM,n++,ox,getHeight(ox,oz)+1.1,oz,1,1,1,0xc58bff)}}done(orbM,n);
 for(const c of ch){c.m.rotation.y=Math.sin(ts*.8+c.phase)*.055;c.m.position.y=getHeight(c.x,c.z)+.06+Math.sin(ts*2.4+c.phase)*.045}
 vig=Math.max(0,vig-dt*2.5);$('vig').style.opacity=vig*.8;
 rn.render(sc,cam)}

let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(state=='play')upd(dt);draw(dt,now)}
menu();requestAnimationFrame(loop);




