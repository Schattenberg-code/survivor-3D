export function createEnemyModels({T,inst,flatGeo,getHeight,getRegionIndex}) {
 const UP=new T.Vector3(0,1,0),M4=new T.Matrix4(),Q=new T.Quaternion(),S=new T.Vector3(),C=new T.Color();
 function done(m,n){m.count=n;m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true}
const MAX_EN=480;
const enFlatMat=()=>new T.MeshLambertMaterial();
const enGlowMat=()=>new T.MeshBasicMaterial({fog:false});

const gEnOcta=flatGeo(new T.OctahedronGeometry(1,0));
const gEnDodeca=flatGeo(new T.DodecahedronGeometry(1,0));
const gEnIcosa=flatGeo(new T.IcosahedronGeometry(1,0));
const gEnSpike4=flatGeo(new T.ConeGeometry(.52,1,4));
const gEnLimb5=flatGeo(new T.CylinderGeometry(.68,.90,1,5));
const gEnBeakU=flatGeo(new T.ConeGeometry(.58,1,4));gEnBeakU.rotateX(Math.PI/2);
const gEnBeakL=flatGeo(new T.ConeGeometry(.46,1,4));gEnBeakL.rotateX(Math.PI/2);

// Geometrias simétricas dedicadas (esquerda e direita) para asas de corvo
// Garante bordo de ataque para frente (+Z), envergadura para fora (side * +X) e normais externas
function makeRavenInnerWingGeo(side){
 const s=side;
 const p0=[0,.02,.24], p1=[s*1,.05,.18], p2=[s*1,.03,-.30], p3=[0,0,-.36], p4=[s*.52,.07,-.04];
 const b0=[0,-.04,.22], b1=[s*1,-.01,.16], b2=[s*1,-.02,-.30], b3=[0,-.05,-.36], b4=[s*.52,.01,-.04];
 const tris=[];
 const addTri=(a,b,c)=>{
  if(s>0)tris.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2]);
  else tris.push(a[0],a[1],a[2], c[0],c[1],c[2], b[0],b[1],b[2]);
 };
 // Face superior facetada
 addTri(p0,p1,p4); addTri(p1,p2,p4); addTri(p2,p3,p4); addTri(p3,p0,p4);
 // Face inferior facetada
 addTri(b0,b4,b1); addTri(b1,b4,b2); addTri(b2,b4,b3); addTri(b3,b4,b0);
 // Bordo de ataque frontal
 addTri(p0,b0,b1); addTri(p0,b1,p1);
 // Bordo de fuga traseiro
 addTri(p2,b2,b3); addTri(p2,b3,p3);
 const g=new T.BufferGeometry();
 g.setAttribute('position',new T.BufferAttribute(new Float32Array(tris),3));
 g.computeVertexNormals();
 return g;
}

function makeRavenOuterWingGeo(side){
 const s=side;
 // Raiz soldada no cotovelo (x=0, z de -0.30 a +0.18) até a ponta primária varrida para trás
 const p0=[0,.04,.18], p1=[s*1,.02,-.46], p2=[s*.56,.03,-.40], p3=[0,.02,-.30];
 const b0=[0,-.02,.16], b1=[s*1,-.02,-.46], b2=[s*.56,-.02,-.40], b3=[0,-.03,-.30];
 const tris=[];
 const addTri=(a,b,c)=>{
  if(s>0)tris.push(a[0],a[1],a[2], b[0],b[1],b[2], c[0],c[1],c[2]);
  else tris.push(a[0],a[1],a[2], c[0],c[1],c[2], b[0],b[1],b[2]);
 };
 addTri(p0,p1,p2); addTri(p0,p2,p3);
 addTri(b0,b2,b1); addTri(b0,b3,b2);
 addTri(p0,b0,b1); addTri(p0,b1,p1);
 addTri(p1,b1,b2); addTri(p1,b2,p2);
 addTri(p2,b2,b3); addTri(p2,b3,p3);
 const g=new T.BufferGeometry();
 g.setAttribute('position',new T.BufferAttribute(new Float32Array(tris),3));
 g.computeVertexNormals();
 return g;
}

// 1) Corvo Espectral (ty === 0)
const ravenBody=inst(gEnDodeca,MAX_EN*2,enFlatMat()),
 ravenHead=inst(gEnIcosa,MAX_EN*2,enFlatMat()),
 ravenBeak=inst(gEnBeakU,MAX_EN*2,enFlatMat()),
 ravenEye=inst(gEnOcta,MAX_EN*2,enGlowMat()),
 ravenWingInL=inst(makeRavenInnerWingGeo(-1),MAX_EN,enFlatMat()),
 ravenWingInR=inst(makeRavenInnerWingGeo(1),MAX_EN,enFlatMat()),
 ravenWingOutL=inst(makeRavenOuterWingGeo(-1),MAX_EN,enFlatMat()),
 ravenWingOutR=inst(makeRavenOuterWingGeo(1),MAX_EN,enFlatMat()),
 ravenTail=inst(gEnSpike4,MAX_EN*3,enFlatMat()),
 ravenClaw=inst(gEnSpike4,MAX_EN*2,enFlatMat());

// 2) Aranha Viúva-Abissal (ty === 1)
const spiderBody=inst(gEnDodeca,MAX_EN*2,enFlatMat()),
 spiderAbd=inst(gEnDodeca,MAX_EN*2,enFlatMat()),
 spiderMark=inst(gEnOcta,MAX_EN*3,enGlowMat()),
 spiderHead=inst(gEnIcosa,MAX_EN,enFlatMat()),
 spiderEye=inst(gEnOcta,MAX_EN*4,enGlowMat()),
 spiderFang=inst(gEnSpike4,MAX_EN*4,enFlatMat()),
 spiderLeg=inst(gEnLimb5,MAX_EN*24,enFlatMat());

// 3) Golem Rúnico de Basalto (ty === 2)
const golemTorso=inst(gEnDodeca,MAX_EN*3,enFlatMat()),
 golemChest=inst(gEnIcosa,MAX_EN*2,enFlatMat()),
 golemCore=inst(gEnOcta,MAX_EN*5,enGlowMat()),
 golemHead=inst(gEnDodeca,MAX_EN*3,enFlatMat()),
 golemEye=inst(gEnOcta,MAX_EN*2,enGlowMat()),
 golemShoulder=inst(gEnIcosa,MAX_EN*2,enFlatMat()),
 golemSpike=inst(gEnSpike4,MAX_EN*6,enFlatMat()),
 golemArm=inst(gEnLimb5,MAX_EN*4,enFlatMat()),
 golemFist=inst(gEnDodeca,MAX_EN*2,enFlatMat()),
 golemClaw=inst(gEnSpike4,MAX_EN*4,enFlatMat()),
 golemLeg=inst(gEnLimb5,MAX_EN*4,enFlatMat()),
 golemFoot=inst(gEnDodeca,MAX_EN*2,enFlatMat());

// Helpers de transformação hierárquica sem torção nem alocação
const eBaseQ=new T.Quaternion(),ePartQ=new T.Quaternion(),eEul=new T.Euler(),
 eTmpA=new T.Vector3(),eTmpB=new T.Vector3(),eAxisX=new T.Vector3(),eAxisY=new T.Vector3(),eAxisZ=new T.Vector3(),eRef=new T.Vector3();

function putEnPart(m,i,ox,oy,oz,baseQ,lx,ly,lz,rx,ry,rz,sx,sy,sz,c){
 eTmpA.set(lx,ly,lz).applyQuaternion(baseQ).add(eTmpB.set(ox,oy,oz));
 if(rx||ry||rz){eEul.set(rx,ry,rz,'YXZ');ePartQ.setFromEuler(eEul);Q.copy(baseQ).multiply(ePartQ)}
 else Q.copy(baseQ);
 M4.compose(eTmpA,Q,S.set(sx,sy,sz));m.setMatrixAt(i,M4);m.setColorAt(i,C.set(c));
}

// Constrói osso orientado por um eixo de referência (fa) para nunca girar 180° quando o membro aponta para baixo
function putEnBone(m,i,ax,ay,az,bx,by,bz,wx,wz,c,fa){
 eAxisY.set(bx-ax,by-ay,bz-az);
 const len=eAxisY.length()||.001;
 eAxisY.divideScalar(len);
 const ang=fa||0;
 eRef.set(Math.sin(ang),0,Math.cos(ang));
 if(Math.abs(eAxisY.dot(eRef))>.96)eRef.set(Math.cos(ang),0,-Math.sin(ang));
 eAxisX.crossVectors(eAxisY,eRef).normalize();
 eAxisZ.crossVectors(eAxisX,eAxisY).normalize();
 eAxisX.multiplyScalar(wx);
 eAxisY.multiplyScalar(len);
 eAxisZ.multiplyScalar(wz);
 M4.makeBasis(eAxisX,eAxisY,eAxisZ);
 M4.setPosition((ax+bx)*.5,(ay+by)*.5,(az+bz)*.5);
 m.setMatrixAt(i,M4);m.setColorAt(i,C.set(c));
}
function renderRaven(i,x,y,z,sz,fa,ph,ts,hitFlash,atk,dieP){
 const hitW=hitFlash>0;
 const cFeather=hitW?0xffffff:0x101420;
 const cBreast=hitW?0xffffff:0x1c2335;
 const cWing=hitW?0xffffff:0x090c14;
 const cTip=hitW?0xffffff:0x28324a;
 const cBeak=hitW?0xffffff:0x4b5366;
 const cEye=hitW?0xffffff:0xff2424;

 const wingT=ts*(12.5+atk*4.5)+ph;
 const flapIn=dieP>0?(.45+dieP*.5):(Math.sin(wingT)*(.56-atk*.16)-atk*.10);
 const flapOut=dieP>0?(.25+dieP*.4):(Math.sin(wingT-.68)*(.68-atk*.18));
 const liftOffset=-Math.sin(wingT)*.10*sz*(1-dieP);
 const bodyPitch=(-.12+atk*.42+Math.cos(wingT)*.06)*(1-dieP)+dieP*1.15;
 const bodyRoll=Math.sin(ts*3.4+ph)*.14*(1-dieP)+dieP*4.2;

 eEul.set(bodyPitch,fa,bodyRoll,'YXZ');
 eBaseQ.setFromEuler(eEul);
 const ry=y+liftOffset;

 // Tórax aerodinâmico + quilha peitoral
 putEnPart(ravenBody,i*2+0,x,ry,z,eBaseQ,0,0,0,0,0,0,sz*.38,sz*.34,sz*.74,cFeather);
 putEnPart(ravenBody,i*2+1,x,ry,z,eBaseQ,0,-.06*sz,.14*sz,.18,0,0,sz*.30,sz*.24,sz*.56,cBreast);

 // Crânio angular + crista occipital
 const headPitch=-.15+atk*.22;
 putEnPart(ravenHead,i*2+0,x,ry,z,eBaseQ,0,.17*sz,.62*sz,headPitch,0,0,sz*.25,sz*.23,sz*.30,cBreast);
 putEnPart(ravenHead,i*2+1,x,ry,z,eBaseQ,0,.28*sz,.44*sz,-.55+headPitch,0,0,sz*.13,sz*.14,sz*.28,cTip);

 // Bico rapineiro bipartido
 const jawOpen=.04+atk*.36+Math.max(0,Math.sin(ts*6+ph))*.05;
 putEnPart(ravenBeak,i*2+0,x,ry,z,eBaseQ,0,.16*sz,.95*sz,.12+headPitch,0,0,sz*.16,sz*.14,sz*.44,cBeak);
 putEnPart(ravenBeak,i*2+1,x,ry,z,eBaseQ,0,.09*sz,.88*sz,.22+jawOpen+headPitch,0,0,sz*.12,sz*.09,sz*.35,cWing);

 // Olhos carmesim brilhantes
 putEnPart(ravenEye,i*2+0,x,ry,z,eBaseQ,.16*sz,.21*sz,.68*sz,0,.35,0,sz*.068,sz*.068,sz*.085,cEye);
 putEnPart(ravenEye,i*2+1,x,ry,z,eBaseQ,-.16*sz,.21*sz,.68*sz,0,-.35,0,sz*.068,sz*.068,sz*.085,cEye);

 // Asas simétricas articuladas em 2 estágios (asa interna + ponta primária soldada ao cotovelo)
 const spanIn=.66*sz,spanOut=.72*sz;
 const shX=.18*sz,shY=.08*sz,shZ=.10*sz;

 // Asa Esquerda (-X)
 putEnPart(ravenWingInL,i,x,ry,z,eBaseQ,-shX,shY,shZ,0,0,-flapIn,spanIn,sz,sz*.96,cWing);
 const elbowLx=-shX-Math.cos(flapIn)*spanIn;
 const elbowLy=shY+Math.sin(flapIn)*spanIn;
 putEnPart(ravenWingOutL,i,x,ry,z,eBaseQ,elbowLx,elbowLy,shZ,0,0,-(flapIn+flapOut),spanOut,sz,sz*.96,cTip);

 // Asa Direita (+X)
 putEnPart(ravenWingInR,i,x,ry,z,eBaseQ,shX,shY,shZ,0,0,flapIn,spanIn,sz,sz*.96,cWing);
 const elbowRx=shX+Math.cos(flapIn)*spanIn;
 const elbowRy=shY+Math.sin(flapIn)*spanIn;
 putEnPart(ravenWingOutR,i,x,ry,z,eBaseQ,elbowRx,elbowRy,shZ,0,0,flapIn+flapOut,spanOut,sz,sz*.96,cTip);

 // Cauda em leque de 3 penas angulares
 const tailSpread=.24+atk*.12;
 for(let tIdx=0;tIdx<3;tIdx++){
  const sSign=tIdx-1;
  putEnPart(ravenTail,i*3+tIdx,x,ry,z,eBaseQ,sSign*.10*sz,-.02*sz,-.62*sz,-Math.PI*.52-.12*atk,sSign*tailSpread,0,sz*.18,sz*.56,sz*.08,tIdx===1?cTip:cWing);
 }

 // Garras retráteis
 const clawFwd=-.10*sz+atk*.52*sz;
 const clawDrop=-.26*sz-atk*.16*sz;
 const clawPitch=1.85-atk*.85;
 putEnPart(ravenClaw,i*2+0,x,ry,z,eBaseQ,-.15*sz,clawDrop,clawFwd,clawPitch,0,-.12,sz*.11,sz*.34,sz*.11,cBeak);
 putEnPart(ravenClaw,i*2+1,x,ry,z,eBaseQ,.15*sz,clawDrop,clawFwd,clawPitch,0,.12,sz*.11,sz*.34,sz*.11,cBeak);
}

function renderSpider(i,x,ey,z,sz,fa,ph,ts,hitFlash,atk,dieP){
 const hitW=hitFlash>0;
 const cCarapace=hitW?0xffffff:0x232631;
 const cPlate=hitW?0xffffff:0x323747;
 const cAbd=hitW?0xffffff:0x15171f;
 const cLegUpper=hitW?0xffffff:0x1a1c24;
 const cLegLower=hitW?0xffffff:0x2c303d;
 const cFang=hitW?0xffffff:0x9aa4b8;
 const cEye=hitW?0xffffff:0xff1c1c;
 const cVenom=hitW?0xffffff:(getRegionIndex()===4?0xb829ff:0xe61c2e);

 const gait=ts*8.4+ph;
 const runBob=(Math.abs(Math.sin(gait))*.055)*(1-dieP);
 const rearUp=(atk*.28)*(1-dieP);
 const bodyY=ey+(.68+runBob+rearUp)*(1-dieP)+dieP*.28;
 const bodyPitch=(-rearUp+Math.sin(gait)*.03)*(1-dieP);
 const bodyRoll=(Math.cos(gait)*.045)*(1-dieP)+dieP*2.85;

 eEul.set(bodyPitch,fa,bodyRoll,'YXZ');
 eBaseQ.setFromEuler(eEul);

 // Cefalotórax blindado + placa dorsal angular
 putEnPart(spiderBody,i*2+0,x,bodyY,z,eBaseQ,0,0,.05*sz,0,0,0,sz*.56,sz*.36,sz*.64,cCarapace);
 putEnPart(spiderBody,i*2+1,x,bodyY,z,eBaseQ,0,.18*sz,.02*sz,.08,0,0,sz*.42,sz*.20,sz*.48,cPlate);

 // Abdômen volumoso erguido + ponta traseira
 const abdPitch=.18+Math.sin(ts*4+ph)*.04;
 putEnPart(spiderAbd,i*2+0,x,bodyY,z,eBaseQ,0,.16*sz,-.72*sz,abdPitch,0,0,sz*.72,sz*.56,sz*.84,cAbd);
 putEnPart(spiderAbd,i*2+1,x,bodyY,z,eBaseQ,0,.12*sz,-1.18*sz,.28,0,0,sz*.42,sz*.34,sz*.46,cCarapace);

 // Marca venenosa dorsal brilhante + 2 fiandeiras traseiras
 const vPulse=1+Math.sin(ts*6+ph)*.12;
 putEnPart(spiderMark,i*3+0,x,bodyY,z,eBaseQ,0,.44*sz,-.74*sz,abdPitch,0,0,sz*.24*vPulse,sz*.12,sz*.36*vPulse,cVenom);
 putEnPart(spiderMark,i*3+1,x,bodyY,z,eBaseQ,-.14*sz,.02*sz,-1.36*sz,-1.25,-.22,0,sz*.11,sz*.28,sz*.11,cPlate);
 putEnPart(spiderMark,i*3+2,x,bodyY,z,eBaseQ,.14*sz,.02*sz,-1.36*sz,-1.25,.22,0,sz*.11,sz*.28,sz*.11,cPlate);

 // Cabeça frontal
 putEnPart(spiderHead,i,x,bodyY,z,eBaseQ,0,.04*sz,.58*sz,-.06,0,0,sz*.42,sz*.32,sz*.38,cPlate);

 // 4 Olhos brilhantes (2 principais frontais + 2 secundários laterais)
 putEnPart(spiderEye,i*4+0,x,bodyY,z,eBaseQ,-.11*sz,.13*sz,.74*sz,0,-.15,0,sz*.085,sz*.09,sz*.08,cEye);
 putEnPart(spiderEye,i*4+1,x,bodyY,z,eBaseQ,.11*sz,.13*sz,.74*sz,0,.15,0,sz*.085,sz*.09,sz*.08,cEye);
 putEnPart(spiderEye,i*4+2,x,bodyY,z,eBaseQ,-.24*sz,.11*sz,.65*sz,0,-.55,0,sz*.055,sz*.06,sz*.055,cEye);
 putEnPart(spiderEye,i*4+3,x,bodyY,z,eBaseQ,.24*sz,.11*sz,.65*sz,0,.55,0,sz*.055,sz*.06,sz*.055,cEye);

 // Quelíceras e presas venenosas articuladas
 const fangSpread=(.16+atk*.16+Math.sin(ts*5+ph)*.03)*sz;
 const fangPitch=2.45-atk*.45;
 putEnPart(spiderFang,i*4+0,x,bodyY,z,eBaseQ,-fangSpread,-.08*sz,.76*sz,2.1,0,-.18,sz*.14,sz*.24,sz*.14,cCarapace);
 putEnPart(spiderFang,i*4+1,x,bodyY,z,eBaseQ,fangSpread,-.08*sz,.76*sz,2.1,0,.18,sz*.14,sz*.24,sz*.14,cCarapace);
 putEnPart(spiderFang,i*4+2,x,bodyY,z,eBaseQ,-fangSpread*.92,-.22*sz,.84*sz,fangPitch,0,.22,sz*.085,sz*.30,sz*.085,cFang);
 putEnPart(spiderFang,i*4+3,x,bodyY,z,eBaseQ,fangSpread*.92,-.22*sz,.84*sz,fangPitch,0,-.22,sz*.085,sz*.30,sz*.085,cFang);

 // 8 Patas articuladas em 3 segmentos reais (fêmur elevado -> joelho alto -> tíbia -> tarso)
 const zRoots=[.36,.14,-.08,-.30];
 const zFeet=[.88,.34,-.22,-.82];
 const xReach=[1.12,1.28,1.26,1.14];
 const xKnee=[.68,.78,.76,.68];
 const kneeLift=[.56,.62,.60,.54];

 for(let side of [-1,1]){
  for(let j=0;j<4;j++){
   const segBase=i*24+(side===-1?0:12)+j*3;
   const phase=gait+(((j&1)===0)===(side===-1)?0:Math.PI);
   const frontStrike=(j===0&&atk>0)?atk:0;
   const stride=(Math.sin(phase)*.22*sz)*(1-dieP)+frontStrike*.25*sz;
   const lift=(Math.max(0,Math.cos(phase))*.18*sz)*(1-dieP)+frontStrike*.45*sz;
   const curl=dieP*.65;

   eTmpA.set(side*.36*sz,-.04*sz,zRoots[j]*sz).applyQuaternion(eBaseQ).add(eTmpB.set(x,bodyY,z));
   const hx=eTmpA.x,hy=eTmpA.y,hz=eTmpA.z;

   eTmpA.set(
    side*(xKnee[j]-curl*.32)*sz,
    (kneeLift[j]+curl*.25)*sz+lift*.55,
    (zRoots[j]*.65+zFeet[j]*.35)*sz+stride*.45
   ).applyQuaternion(eBaseQ).add(eTmpB.set(x,bodyY,z));
   const kx=eTmpA.x,ky=eTmpA.y,kz=eTmpA.z;

   eTmpA.set(
    side*(xReach[j]*.86-curl*.48)*sz,
    (-.22+curl*.15)*sz+lift*.75,
    zFeet[j]*sz+stride*.85
   ).applyQuaternion(eBaseQ).add(eTmpB.set(x,bodyY,z));
   const ax=eTmpA.x,ay=eTmpA.y,az=eTmpA.z;

   eTmpA.set(
    side*(xReach[j]-curl*.62)*sz,
    0,
    (zFeet[j]*1.08)*sz+stride
   ).applyQuaternion(eBaseQ).add(eTmpB.set(x,bodyY,z));
   const fx=eTmpA.x,fz=eTmpA.z;
   const fy=dieP>0?(bodyY+(.12+curl*.35)*sz):(getHeight(fx,fz)+.03+lift+frontStrike*.35*sz);

   putEnBone(spiderLeg,segBase+0,hx,hy,hz,kx,ky,kz,sz*.095,sz*.11,cLegUpper,fa);
   putEnBone(spiderLeg,segBase+1,kx,ky,kz,ax,ay,az,sz*.075,sz*.085,cLegLower,fa);
   putEnBone(spiderLeg,segBase+2,ax,ay,az,fx,fy,fz,sz*.045,sz*.05,cCarapace,fa);
  }
 }
}

function renderGolem(i,x,ey,z,sz,fa,ph,ts,hitFlash,atk,dieP){
 const hitW=hitFlash>0;
 const cStone=hitW?0xffffff:0x6d727a;
 const cDark=hitW?0xffffff:0x3c4047;
 const cMid=hitW?0xffffff:0x545961;
 const cCrystal=hitW?0xffffff:0x868d98;
 const cRune=hitW?0xffffff:(getRegionIndex()===4?0xb84dff:getRegionIndex()===0?0x4ee8b8:0xff9c2a);

 const walk=ts*3.9+ph;
 const stepBob=(Math.abs(Math.sin(walk*2))*.075)*(1-dieP);
 const torsoTwist=(Math.sin(walk)*.13)*(1-dieP);
 const torsoPitch=(.06+atk*.20)*(1-dieP)+dieP*1.35;
 const bodyRoll=(Math.cos(walk)*.055)*(1-dieP);
 const collapseY=dieP*.96*sz;
 const rootY=ey+1.42*sz+stepBob-collapseY;

 eEul.set(torsoPitch,fa+torsoTwist,bodyRoll,'YXZ');
 eBaseQ.setFromEuler(eEul);

 // Tronco monolítico em V invertido + cintura + pélvis encaixada nas coxas
 putEnPart(golemTorso,i*3+0,x,rootY,z,eBaseQ,0,.26*sz,0,0,0,0,sz*.92,sz*.64,sz*.60,cStone);
 putEnPart(golemTorso,i*3+1,x,rootY,z,eBaseQ,0,-.22*sz,0,0,0,0,sz*.64,sz*.32,sz*.48,cDark);
 putEnPart(golemTorso,i*3+2,x,rootY,z,eBaseQ,0,-.46*sz,0,0,0,0,sz*.84,sz*.30,sz*.56,cMid);

 // Placa peitoral blindada + placa dorsal rochosa
 putEnPart(golemChest,i*2+0,x,rootY,z,eBaseQ,0,.28*sz,.44*sz,-.14,0,0,sz*.68,sz*.54,sz*.26,cMid);
 putEnPart(golemChest,i*2+1,x,rootY,z,eBaseQ,0,.28*sz,-.44*sz,.16,0,0,sz*.66,sz*.58,sz*.28,cDark);

 // Núcleo rúnico central + 4 fissuras luminosas pulsantes
 const pulse=1+Math.sin(ts*4.8+ph)*.16+atk*.32+(hitW?.35:0);
 putEnPart(golemCore,i*5+0,x,rootY,z,eBaseQ,0,.30*sz,.60*sz,0,0,0,sz*.20*pulse,sz*.25*pulse,sz*.12,cRune);
 putEnPart(golemCore,i*5+1,x,rootY,z,eBaseQ,-.36*sz,.40*sz,.48*sz,0,0,.55,sz*.08*pulse,sz*.26*pulse,sz*.10,cRune);
 putEnPart(golemCore,i*5+2,x,rootY,z,eBaseQ,.36*sz,.40*sz,.48*sz,0,0,-.55,sz*.08*pulse,sz*.26*pulse,sz*.10,cRune);
 putEnPart(golemCore,i*5+3,x,rootY,z,eBaseQ,0,.36*sz,-.58*sz,0,0,0,sz*.14*pulse,sz*.32*pulse,sz*.10,cRune);
 putEnPart(golemCore,i*5+4,x,rootY,z,eBaseQ,0,-.22*sz,.40*sz,0,0,0,sz*.24*pulse,sz*.09*pulse,sz*.10,cRune);

 // Cabeça monolítica + arcada superciliar + mandíbula articulada
 const headY=.90*sz,headZ=.16*sz;
 const headPitch=-.06-atk*.18;
 putEnPart(golemHead,i*3+0,x,rootY,z,eBaseQ,0,headY,headZ,headPitch,-torsoTwist*.5,0,sz*.46,sz*.40,sz*.44,cMid);
 putEnPart(golemHead,i*3+1,x,rootY,z,eBaseQ,0,headY+.14*sz,headZ+.28*sz,.12+headPitch,-torsoTwist*.5,0,sz*.48,sz*.12,sz*.22,cStone);
 putEnPart(golemHead,i*3+2,x,rootY,z,eBaseQ,0,headY-.18*sz,headZ+.22*sz,.08+atk*.28+headPitch,-torsoTwist*.5,0,sz*.36,sz*.14,sz*.26,cDark);

 // Olhos rúnicos incandescentes
 putEnPart(golemEye,i*2+0,x,rootY,z,eBaseQ,-.15*sz,headY+.04*sz,headZ+.35*sz,0,-.15,0,sz*.085,sz*.075,sz*.07,cRune);
 putEnPart(golemEye,i*2+1,x,rootY,z,eBaseQ,.15*sz,headY+.04*sz,headZ+.35*sz,0,.15,0,sz*.085,sz*.075,sz*.07,cRune);

 // Chifres/cristais na cabeça (2) + Ombreiras colossais e 4 cristais de rocha
 putEnPart(golemSpike,i*6+0,x,rootY,z,eBaseQ,-.34*sz,headY+.24*sz,headZ-.02*sz,.15,0,.58,sz*.16,sz*.42,sz*.16,cCrystal);
 putEnPart(golemSpike,i*6+1,x,rootY,z,eBaseQ,.34*sz,headY+.24*sz,headZ-.02*sz,.15,0,-.58,sz*.16,sz*.42,sz*.16,cCrystal);

 for(let sIdx=0;sIdx<2;sIdx++){
  const side=sIdx===0?-1:1;
  const shX=side*.88*sz,shY=.54*sz,shZ=0;
  putEnPart(golemShoulder,i*2+sIdx,x,rootY,z,eBaseQ,shX,shY,shZ,0,0,-side*.25,sz*.48,sz*.46,sz*.48,cStone);
  putEnPart(golemSpike,i*6+2+sIdx*2,x,rootY,z,eBaseQ,shX+side*.08*sz,shY+.42*sz,-.05*sz,-.18,0,-side*.22,sz*.24,sz*.58,sz*.24,cCrystal);
  putEnPart(golemSpike,i*6+3+sIdx*2,x,rootY,z,eBaseQ,shX+side*.34*sz,shY+.18*sz,.06*sz,.10,0,-side*.75,sz*.18,sz*.44,sz*.18,cDark);

  // Braços articulados em 2 segmentos sem torção
  const armPhase=walk+(side===1?Math.PI:0);
  const swing=(Math.sin(armPhase)*.36)*(1-dieP);
  const smashLift=atk*1.15;
  const shW=eTmpA.set(shX,shY-.06*sz,shZ).applyQuaternion(eBaseQ).add(eTmpB.set(x,rootY,z)).clone();
  const elW=eTmpA.set(
   side*1.08*sz,
   (.02+smashLift*.52)*sz,
   (.12+swing*.45+smashLift*.28)*sz
  ).applyQuaternion(eBaseQ).add(eTmpB.set(x,rootY,z)).clone();
  const haW=eTmpA.set(
   side*1.02*sz,
   (-.56+smashLift*.78)*sz,
   (.38+swing*.82+smashLift*.62)*sz
  ).applyQuaternion(eBaseQ).add(eTmpB.set(x,rootY,z)).clone();

  putEnBone(golemArm,i*4+sIdx*2+0,shW.x,shW.y,shW.z,elW.x,elW.y,elW.z,sz*.24,sz*.24,cDark,fa);
  putEnBone(golemArm,i*4+sIdx*2+1,elW.x,elW.y,elW.z,haW.x,haW.y,haW.z,sz*.30,sz*.32,cMid,fa);

  putEnPart(golemFist,i*2+sIdx,haW.x,haW.y,haW.z,eBaseQ,0,0,0,.25-smashLift*.4,0,0,sz*.34,sz*.32,sz*.38,cStone);
  putEnPart(golemClaw,i*4+sIdx*2+0,haW.x,haW.y,haW.z,eBaseQ,-side*.14*sz,-.16*sz,.22*sz,2.35,0,0,sz*.12,sz*.34,sz*.12,cCrystal);
  putEnPart(golemClaw,i*4+sIdx*2+1,haW.x,haW.y,haW.z,eBaseQ,side*.12*sz,-.16*sz,.22*sz,2.35,0,0,sz*.12,sz*.34,sz*.12,cCrystal);
 }

 // Pernas articuladas em 2 segmentos ancoradas dentro da pélvis e orientadas sem torção
 const legQ=new T.Quaternion().setFromAxisAngle(UP,fa);
 for(let lIdx=0;lIdx<2;lIdx++){
  const side=lIdx===0?-1:1;
  const legPhase=walk+(side===1?0:Math.PI);
  const stride=(Math.sin(legPhase)*.36*sz)*(1-dieP);
  const lift=(Math.max(0,Math.cos(legPhase))*.18*sz)*(1-dieP);

  // Quadril dentro da pélvis (ey + 0.96*sz)
  const hipW=eTmpA.set(side*.46*sz,-.46*sz,0).applyQuaternion(eBaseQ).add(eTmpB.set(x,rootY,z)).clone();

  // Joelho articulado à frente
  const kneeW=eTmpA.set(
   side*.48*sz,
   (.56+dieP*.12)*sz+lift*.55,
   stride*.58+.14*sz
  ).applyQuaternion(legQ).add(eTmpB.set(x,ey,z)).clone();

  // Pé apoiado diretamente no relevo do terreno
  const footPos=eTmpA.set(side*.48*sz,0,stride*1.18).applyQuaternion(legQ).add(eTmpB.set(x,ey,z));
  const fgy=getHeight(footPos.x,footPos.z);
  const footY=fgy+.11*sz+lift;
  const ankleY=footY+.08*sz;

  putEnBone(golemLeg,i*4+lIdx*2+0,hipW.x,hipW.y,hipW.z,kneeW.x,kneeW.y,kneeW.z,sz*.26,sz*.30,cDark,fa);
  putEnBone(golemLeg,i*4+lIdx*2+1,kneeW.x,kneeW.y,kneeW.z,footPos.x,ankleY,footPos.z,sz*.29,sz*.34,cMid,fa);
  putEnPart(golemFoot,i*2+lIdx,footPos.x,footY,footPos.z,legQ,0,0,.08*sz,0,0,0,sz*.44,sz*.20,sz*.58,cStone);
 }
}
 function finish(ravenCount,spiderCount,golemCount){
  done(ravenBody,ravenCount*2);done(ravenHead,ravenCount*2);done(ravenBeak,ravenCount*2);
  done(ravenEye,ravenCount*2);done(ravenWingInL,ravenCount);done(ravenWingInR,ravenCount);
  done(ravenWingOutL,ravenCount);done(ravenWingOutR,ravenCount);
  done(ravenTail,ravenCount*3);done(ravenClaw,ravenCount*2);
  done(spiderBody,spiderCount*2);done(spiderAbd,spiderCount*2);done(spiderMark,spiderCount*3);
  done(spiderHead,spiderCount);done(spiderEye,spiderCount*4);done(spiderFang,spiderCount*4);done(spiderLeg,spiderCount*24);
  done(golemTorso,golemCount*3);done(golemChest,golemCount*2);done(golemCore,golemCount*5);
  done(golemHead,golemCount*3);done(golemEye,golemCount*2);done(golemShoulder,golemCount*2);
  done(golemSpike,golemCount*6);done(golemArm,golemCount*4);done(golemFist,golemCount*2);
  done(golemClaw,golemCount*4);done(golemLeg,golemCount*4);done(golemFoot,golemCount*2);
 }
 return {max:MAX_EN,renderRaven,renderSpider,renderGolem,finish};
}
