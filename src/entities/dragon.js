export function createDragonModel({T,inst,flatGeo,getHeight,smoothstep,fx,random,getPlayer,isPlaying}) {
 const UP=new T.Vector3(0,1,0),M4=new T.Matrix4(),Q=new T.Quaternion(),V=new T.Vector3(),S=new T.Vector3(),C=new T.Color();
 const eAxisX=new T.Vector3(),eAxisY=new T.Vector3(),eAxisZ=new T.Vector3(),eRef=new T.Vector3();
 function done(m,n){m.count=n;m.instanceMatrix.needsUpdate=true;m.instanceColor.needsUpdate=true}
 function put(m,i,x,y,z,sx,sy,sz,c,ry){Q.setFromAxisAngle(UP,ry||0);M4.compose(V.set(x,y,z),Q,S.set(sx,sy,sz));m.setMatrixAt(i,M4);if(c!==undefined)m.setColorAt(i,C.set(c))}
// ---------- DRAGÃO ANCESTRAL FANTASMA (LOW-POLY ARTICULADO) ----------
const MAX_D=16;
const dScaleMat=()=>new T.MeshLambertMaterial({flatShading:true});
const dMemMat=()=>new T.MeshLambertMaterial({flatShading:true,side:T.DoubleSide,transparent:true,opacity:.92});
const dGlowMat=()=>new T.MeshBasicMaterial({fog:false});
const dMistMat=()=>new T.MeshBasicMaterial({transparent:true,opacity:.36,depthWrite:false});

function makeVaultedSailGeo(){
 const g=new T.BufferGeometry();
 const v=new Float32Array([
  0,0,0, 1,0,0, .42,.38,.42,
  0,0,0, .42,.38,.42, 0,0,1,
  1,0,0, 0,0,1, .42,.38,.42,
  0,-.12,0, .42,.12,.42, 1,-.12,0,
  0,-.12,0, 0,-.12,1, .42,.12,.42,
  1,-.12,0, .42,.12,.42, 0,-.12,1
 ]);
 g.setAttribute('position',new T.BufferAttribute(v,3));
 g.computeVertexNormals();
 return g;
}
const dSnoutGeo=flatGeo(new T.ConeGeometry(.75,1,5));dSnoutGeo.rotateX(Math.PI/2);
const dJawGeo=flatGeo(new T.ConeGeometry(.62,1,4));dJawGeo.rotateX(Math.PI/2);

const dragonBody=inst(flatGeo(new T.DodecahedronGeometry(1,0)),MAX_D*5,dScaleMat()),
 dragonArmor=inst(flatGeo(new T.IcosahedronGeometry(1,0)),MAX_D*6,dScaleMat()),
 dragonNeck=inst(flatGeo(new T.CylinderGeometry(.72,.92,1,6)),MAX_D*4,dScaleMat()),
 dragonHead=inst(flatGeo(new T.DodecahedronGeometry(1,0)),MAX_D*5,dScaleMat()),
 dragonSnout=inst(dSnoutGeo,MAX_D*2,dScaleMat()),
 dragonJaw=inst(dJawGeo,MAX_D,dScaleMat()),
 dragonTooth=inst(flatGeo(new T.ConeGeometry(.5,1,4)),MAX_D*8,dScaleMat()),
 dragonHorn=inst(flatGeo(new T.ConeGeometry(.5,1,5)),MAX_D*6,dScaleMat()),
 dragonWingBone=inst(flatGeo(new T.CylinderGeometry(.55,.78,1,5)),MAX_D*8,dScaleMat()),
 dragonWingClaw=inst(flatGeo(new T.ConeGeometry(.5,1,4)),MAX_D*2,dScaleMat()),
 dragonMembrane=inst(makeVaultedSailGeo(),MAX_D*6,dMemMat()),
 dragonTail=inst(flatGeo(new T.CylinderGeometry(.46,.92,1,5)),MAX_D*7,dScaleMat()),
 dragonLeg=inst(flatGeo(new T.CylinderGeometry(.62,.86,1,6)),MAX_D*8,dScaleMat()),
 dragonFoot=inst(flatGeo(new T.DodecahedronGeometry(1,0)),MAX_D*4,dScaleMat()),
 dragonClaw=inst(flatGeo(new T.ConeGeometry(.45,1,4)),MAX_D*12,dScaleMat()),
 dragonEye=inst(flatGeo(new T.OctahedronGeometry(1,0)),MAX_D*2,dGlowMat()),
 dragonSpine=inst(flatGeo(new T.ConeGeometry(.46,1,4)),MAX_D*14,dScaleMat()),
 dragonFissure=inst(flatGeo(new T.OctahedronGeometry(1,0)),MAX_D*9,dGlowMat()),
 dragonMist=inst(flatGeo(new T.IcosahedronGeometry(1,0)),MAX_D*12,dMistMat());

const dRootQ=new T.Quaternion(),dPartQ=new T.Quaternion(),dEul=new T.Euler(),dRootV=new T.Vector3(),
 dTmpA=new T.Vector3(),dTmpB=new T.Vector3(),dTmpC=new T.Vector3(),dE1=new T.Vector3(),dE2=new T.Vector3(),dNrmW=new T.Vector3();
function dLocalPos(lx,ly,lz,out){return (out||new T.Vector3()).set(lx,ly,lz).applyQuaternion(dRootQ).add(dRootV)}
function putDPart(m,i,lx,ly,lz,rx,ry,rz,sx,sy,sz,c){
 dTmpA.set(lx,ly,lz).applyQuaternion(dRootQ).add(dRootV);
 dEul.set(rx,ry,rz,'YXZ');dPartQ.setFromEuler(dEul);Q.copy(dRootQ).multiply(dPartQ);
 M4.compose(dTmpA,Q,S.set(sx,sy,sz));m.setMatrixAt(i,M4);m.setColorAt(i,C.set(c));
}
function putDBone(m,i,wa,wb,wx,wz,c,fa){
 dTmpA.copy(wb).sub(wa);const len=dTmpA.length()||.001;
 dTmpA.divideScalar(len);
 const ang=fa||0;
 eRef.set(Math.sin(ang),0,Math.cos(ang));
 if(Math.abs(dTmpA.dot(eRef))>.96)eRef.set(Math.cos(ang),0,-Math.sin(ang));
 eAxisX.crossVectors(dTmpA,eRef).normalize();
 eAxisZ.crossVectors(eAxisX,dTmpA).normalize();
 eAxisX.multiplyScalar(wx);
 dTmpA.multiplyScalar(len);
 eAxisZ.multiplyScalar(wz);
 M4.makeBasis(eAxisX,dTmpA,eAxisZ);
 M4.setPosition((wa.x+wb.x)*.5,(wa.y+wb.y)*.5,(wa.z+wb.z)*.5);
 m.setMatrixAt(i,M4);m.setColorAt(i,C.set(c));
}
function putDSail(m,i,p0,p1,p2,thick,c){
 dE1.copy(p1).sub(p0);dE2.copy(p2).sub(p0);
 dNrmW.crossVectors(dE2,dE1).normalize().multiplyScalar(thick);
 M4.makeBasis(dE1,dNrmW,dE2);M4.setPosition(p0);
 m.setMatrixAt(i,M4);m.setColorAt(i,C.set(c));
}
 function renderDragon(e,i,dt,ts){
  const playerPosition=getPlayer();
if(e.roarT===undefined){
    e.roarT=1.25;e.flyBlend=0;e.biteBlend=0;e.partT=0;
    e.animT=e.ph;e.wingPhase=e.ph;e.walkPhase=e.ph;
   }
   const adt=isPlaying()?dt:0;
   e.animT+=adt;
   e.roarT=Math.max(0,e.roarT-adt);
   if(adt>0&&e.bs<.62&&e.bs>.52&&e.roarT<=0)e.roarT=.95;

   const distToP=Math.hypot(playerPosition.x-e.x,playerPosition.z-e.z);
   const flyCycle=Math.sin(e.animT*.34);
   const flyTarget=flyCycle>.38?smoothstep(.38,.78,flyCycle):0;
   e.flyBlend+=(flyTarget-e.flyBlend)*Math.min(1,adt*2.4);
   const fly=e.flyBlend;

   const biteTarget=distToP<e.r+2.8?1:0;
   e.biteBlend+=(biteTarget-e.biteBlend)*Math.min(1,adt*6);

   const roar=e.roarT>0?Math.sin(Math.min(1,e.roarT)*Math.PI):0;
   const wingRate=2.35+fly*1.85+roar*.9;
   const walkRate=2.55*(1-fly*.55);
   e.wingPhase=(e.wingPhase+adt*wingRate)%(Math.PI*2);
   e.walkPhase=(e.walkPhase+adt*walkRate)%(Math.PI*2);

   const walk=e.walkPhase;
   const breath=Math.sin(e.animT*2.3);
   const bite=e.biteBlend*Math.max(0,Math.sin(e.animT*5.5));
   const slam=e.bs<.55?smoothstep(.55,.05,e.bs):0;
   const wingPhase=e.wingPhase;

   // Paleta fantasmagórica (azul-escuro, cinza-ardósia, preto-obsidiana e brilho espectral)
   const hitW=e.f>0;
   const cObs=hitW?0xffffff:0x111621;
   const cAbyss=hitW?0xffffff:0x1b293d;
   const cSlate=hitW?0xffffff:0x324054;
   const cBone=hitW?0xffffff:0x4a586e;
   const cMem=hitW?0xffffff:0x162b47;
   const cTooth=hitW?0xffffff:0x9eb4cc;
   const cSpec=hitW?0xffffff:0x3be8ff;
   const cSpecDeep=hitW?0xffffff:0x1a78d6;

   const hoverH=fly*(1.45+Math.sin(wingPhase-.5)*.28);
   const walkBob=Math.abs(Math.sin(walk*2))*.12*(1-fly);
   const bodyPitch=-.04-roar*.34+slam*.22-fly*.10+breath*.02;
   const bodyRoll=Math.sin(walk)*.045*(1-fly)+Math.sin(e.animT*1.5)*.03*fly;

   dRootV.set(e.x,ey+2.42+walkBob+hoverH+breath*.06,e.z);
   dEul.set(bodyPitch,e.fa,bodyRoll,'YXZ');
   dRootQ.setFromEuler(dEul);

   // 1. Tronco, tórax blindado, quilha ventral e pélvis
   const bPulse=1+breath*.032+roar*.04;
   putDPart(dragonBody,i*5+0,0,.18,.35,-.06,0,0,1.42*bPulse,1.18*bPulse,2.15,cAbyss);
   putDPart(dragonBody,i*5+1,0,.04,-1.55,.10,0,0,1.08,1.02,1.35,cObs);
   putDPart(dragonBody,i*5+2,0,-.72,1.18,-.22,0,0,.95,.46,1.15,cSlate);
   putDPart(dragonBody,i*5+3,0,-.76,-.05,.04,0,0,.92,.42,1.15,cObs);
   putDPart(dragonBody,i*5+4,0,-.62,-1.18,.20,0,0,.76,.36,1.05,cSlate);

   // Placas de armadura peitoral e ombreiras dorsais
   putDPart(dragonArmor,i*6+0,0,-.12,1.62,-.28,0,0,1.28*bPulse,1.08*bPulse,1.25,cSlate);
   putDPart(dragonArmor,i*6+1,0,.88,.55,-.05,0,0,1.05,.48,1.65,cObs);
   putDPart(dragonArmor,i*6+2,0,.74,-.75,.12,0,0,.86,.42,1.35,cAbyss);
   putDPart(dragonArmor,i*6+3,.96,.42,1.05,.12,.22,-.32,.68,.55,1.05,cObs);
   putDPart(dragonArmor,i*6+4,-.96,.42,1.05,.12,-.22,.32,.68,.55,1.05,cObs);
   putDPart(dragonArmor,i*6+5,0,.32,2.15,-.42,0,0,.88,.72,.85,cAbyss);

   // Fissuras luminosas espectrais entre as escamas e núcleo do peito
   const fissPulse=.88+Math.sin(e.animT*4.5)*.18+roar*.35;
   putDPart(dragonFissure,i*9+0,0,-.14,2.46,-.25,0,0,.34*fissPulse,.42*fissPulse,.24,cSpec);
   for(let k=0;k<3;k++){
    const fz=.95-k*.82,fy=.14-k*.04,fxOff=1.18-k*.10;
    putDPart(dragonFissure,i*9+1+k,fxOff,fy,fz,.12,.25,-.35,.14,.36*fissPulse,.52,cSpecDeep);
    putDPart(dragonFissure,i*9+4+k,-fxOff,fy,fz,.12,-.25,.35,.14,.36*fissPulse,.52,cSpecDeep);
   }
   putDPart(dragonFissure,i*9+7,0,1.16,.35,0,0,0,.22,.22*fissPulse,1.45,cSpec);
   putDPart(dragonFissure,i*9+8,0,.95,-1.15,.15,0,0,.18,.18*fissPulse,1.15,cSpecDeep);

   // 2. Pescoço articulado em S (4 segmentos) + crânio medieval
   const neckLift=roar*.55-slam*.38-bite*.24+breath*.06;
   const neckYaw=Math.sin(e.animT*1.5)*.10*(1-slam);
   const nPts=[
    dLocalPos(0,.62,2.05),
    dLocalPos(neckYaw*.25,1.15+neckLift*.35,2.78+slam*.22),
    dLocalPos(neckYaw*.55,1.82+neckLift*.75,3.45+slam*.45),
    dLocalPos(neckYaw*.85,2.38+neckLift*1.05,4.15+slam*.65),
    dLocalPos(neckYaw*1.1,2.62+neckLift*1.12,4.88+slam*.82)
   ];
   const nRadii=[.82,.72,.64,.58];
   for(let j=0;j<4;j++){
    putDBone(dragonNeck,i*4+j,nPts[j],nPts[j+1],nRadii[j],nRadii[j]*1.08,j%2?cSlate:cAbyss,e.fa);
   }

   // Cabeça, focinho, mandíbula articulada, presas e chifres
   const hPitch=-.06-roar*.48+slam*.32+bite*.18;
   const hYaw=neckYaw*1.2;
   const headWorld=nPts[4];
   const qHead=new T.Quaternion().copy(dRootQ).multiply(new T.Quaternion().setFromEuler(new T.Euler(hPitch,hYaw,0,'YXZ')));
   const putHead=(m,idx,lx,ly,lz,rx,ry,rz,sx,sy,sz,c)=>{
    dTmpA.set(lx,ly,lz).applyQuaternion(qHead).add(headWorld);
    dEul.set(rx,ry,rz,'YXZ');dPartQ.setFromEuler(dEul);Q.copy(qHead).multiply(dPartQ);
    M4.compose(dTmpA,Q,S.set(sx,sy,sz));m.setMatrixAt(idx,M4);m.setColorAt(idx,C.set(c));
   };
   // Crânio, placas zigomáticas e arcadas superciliares
   putHead(dragonHead,i*5+0,0,.08,.45,.06,0,0,.74,.58,.86,cSlate);
   putHead(dragonHead,i*5+1,0,.34,.18,-.14,0,0,.64,.34,.68,cAbyss);
   putHead(dragonHead,i*5+2,.44,.26,.62,.16,-.22,.28,.34,.20,.58,cObs);
   putHead(dragonHead,i*5+3,-.44,.26,.62,.16,.22,-.28,.34,.20,.58,cObs);
   putHead(dragonHead,i*5+4,0,-.06,.05,0,0,0,.84,.44,.62,cObs);

   // Focinho alongado + crista nasal
   putHead(dragonSnout,i*2+0,0,.04,1.52,.08,0,0,.72,.52,1.38,cAbyss);
   putHead(dragonSnout,i*2+1,0,.28,1.72,-.32,0,0,.26,.34,.62,cSlate);

   // Olhos brilhantes em azul espectral
   putHead(dragonEye,i*2+0,.46,.14,.64,0,.28,0,.15,.16,.22,cSpec);
   putHead(dragonEye,i*2+1,-.46,.14,.64,0,-.28,0,.15,.16,.22,cSpec);

   // Mandíbula inferior articulada
   const jawOpen=.10+Math.max(0,breath)*.05+roar*.58+bite*.52+slam*.28;
   const jawPivot=new T.Vector3(0,-.18,.22).applyQuaternion(qHead).add(headWorld);
   const qJaw=new T.Quaternion().copy(qHead).multiply(new T.Quaternion().setFromEuler(new T.Euler(jawOpen,0,0,'YXZ')));
   const putJaw=(m,idx,lx,ly,lz,rx,ry,rz,sx,sy,sz,c)=>{
    dTmpA.set(lx,ly,lz).applyQuaternion(qJaw).add(jawPivot);
    dEul.set(rx,ry,rz,'YXZ');dPartQ.setFromEuler(dEul);Q.copy(qJaw).multiply(dPartQ);
    M4.compose(dTmpA,Q,S.set(sx,sy,sz));m.setMatrixAt(idx,M4);m.setColorAt(idx,C.set(c));
   };
   putJaw(dragonJaw,i,0,-.06,.88,.04,0,0,.64,.36,1.42,cObs);

   // Dentes superiores e inferiores visíveis
   putHead(dragonTooth,i*8+0,.22,-.18,1.86,Math.PI,0,0,.12,.34,.12,cTooth);
   putHead(dragonTooth,i*8+1,-.22,-.18,1.86,Math.PI,0,0,.12,.34,.12,cTooth);
   putHead(dragonTooth,i*8+2,.28,-.16,1.38,Math.PI,0,0,.10,.26,.10,cTooth);
   putHead(dragonTooth,i*8+3,-.28,-.16,1.38,Math.PI,0,0,.10,.26,.10,cTooth);
   putJaw(dragonTooth,i*8+4,.18,.08,1.42,0,0,0,.11,.30,.11,cTooth);
   putJaw(dragonTooth,i*8+5,-.18,.08,1.42,0,0,0,.11,.30,.11,cTooth);
   putJaw(dragonTooth,i*8+6,.23,.06,1.02,0,0,0,.09,.22,.09,cTooth);
   putJaw(dragonTooth,i*8+7,-.23,.06,1.02,0,0,0,.09,.22,.09,cTooth);

   // Coroa de chifres (2 principais longos, 2 laterais, 2 dorsais)
   putHead(dragonHorn,i*6+0,.44,.52,-.42,-1.08,.24,-.26,.34,2.35,.34,cObs);
   putHead(dragonHorn,i*6+1,-.44,.52,-.42,-1.08,-.24,.26,.34,2.35,.34,cObs);
   putHead(dragonHorn,i*6+2,.58,.06,-.38,-1.24,.44,-.38,.24,1.45,.24,cSlate);
   putHead(dragonHorn,i*6+3,-.58,.06,-.38,-1.24,-.44,.38,.24,1.45,.24,cSlate);
   putHead(dragonHorn,i*6+4,.20,.54,-.18,-.88,.10,-.12,.18,1.15,.18,cBone);
   putHead(dragonHorn,i*6+5,-.20,.54,-.18,-.88,-.10,.12,.18,1.15,.18,cBone);

   // 3. Asas enormes com estrutura óssea e membranas poligonais
   const flap1=Math.sin(wingPhase)*(.36+fly*.26+roar*.14)+roar*.32;
   const flap2=Math.sin(wingPhase-.65)*(.46+fly*.30)-roar*.18;
   const sweepBack=(1-fly)*.22-roar*.26;
   for(let sIdx=0;sIdx<2;sIdx++){
    const side=sIdx===0?-1:1;
    const wShoulder=dLocalPos(side*1.08,.76,.92);
    const wWrist=dLocalPos(
     side*(3.45+Math.cos(flap1)*.65),
     .76+Math.sin(flap1)*2.35+1.15,
     .92+.85-sweepBack*1.4
    );
    const wTip=dLocalPos(
     side*(6.85+Math.cos(flap1+flap2)*.95),
     .76+Math.sin(flap1)*2.35+Math.sin(flap1+flap2)*2.65+.85,
     .92-.45-sweepBack*2.6
    );
    const wRibMid=dLocalPos(
     side*5.45,
     .76+Math.sin(flap1)*1.85+Math.sin(flap1+flap2)*1.45+.15,
     .92-2.35-sweepBack*2.1
    );
    const wRibIn=dLocalPos(
     side*3.75,
     .76+Math.sin(flap1)*1.35-.15,
     .92-2.55-sweepBack*1.4
    );

    const bBase=i*8+sIdx*4;
    putDBone(dragonWingBone,bBase+0,wShoulder,wWrist,.26,.28,cBone,e.fa);
    putDBone(dragonWingBone,bBase+1,wWrist,wTip,.18,.20,cBone,e.fa);
    putDBone(dragonWingBone,bBase+2,wWrist,wRibMid,.13,.14,cSlate,e.fa);
    putDBone(dragonWingBone,bBase+3,wWrist,wRibIn,.13,.14,cSlate,e.fa);

    // Garra no cotovelo/pulso da asa
    putDPart(dragonWingClaw,i*2+sIdx,
     side*(3.55+Math.cos(flap1)*.65),
     .88+Math.sin(flap1)*2.35+1.15,
     1.82-sweepBack*1.4,
     .55,side*.25,0,.18,.68,.18,cObs);

    // 3 painéis de membrana poligonal abobadada por asa
    const mBase=i*6+sIdx*3;
    putDSail(dragonMembrane,mBase+0,wShoulder,wWrist,wRibIn,.14,cMem);
    putDSail(dragonMembrane,mBase+1,wWrist,wRibMid,wRibIn,.12,cMem);
    putDSail(dragonMembrane,mBase+2,wWrist,wTip,wRibMid,.12,cMem);

    // Névoa azulada ao redor das asas
    const mistBase=i*12+sIdx*4;
    for(let mk=0;mk<4;mk++){
     const frac=(mk+1)/4;
     dTmpC.copy(wWrist).lerp(wTip,frac);
     const drift=Math.sin(e.animT*2.8+mk*1.7+sIdx*2)*.38;
     const mSz=(.36+mk*.07)*(1+roar*.3);
     put(dragonMist,mistBase+mk,dTmpC.x,dTmpC.y-.22+drift*.4,dTmpC.z-.35+drift,mSz,mSz*.75,mSz*1.25,cSpecDeep,e.animT+mk);
    }
   }

   // 4. Cauda longa de 7 segmentos com movimentação independente
   let prevTail=dLocalPos(0,.06,-2.35);
   let tailTipWorld=prevTail.clone();
   for(let j=0;j<7;j++){
    const waveYaw=Math.sin(e.animT*3.1-(j+1)*.62)*(.22+j*.075);
    const wavePitch=Math.cos(e.animT*2.4-(j+1)*.52)*(.08+j*.025)-.08+fly*.05;
    const segLen=1.42-j*.06;
    const nextTail=dLocalPos(
     waveYaw*(1.2+j*.42),
     .06-(j+1)*.11+wavePitch*(1+j*.35),
     -2.35-(j+1)*segLen
    );
    const rad=.66-j*.078;
    putDBone(dragonTail,i*7+j,prevTail,nextTail,rad,rad*1.08,j===6?cSpec:j%2?cAbyss:cObs,e.fa);
    prevTail=nextTail;
    if(j===6)tailTipWorld.copy(nextTail);
   }
   // Névoa azulada acompanhando a cauda
   for(let mk=0;mk<4;mk++){
    const a=e.animT*2.2+mk*1.57;
    const rM=.55+mk*.18;
    put(dragonMist,i*12+8+mk,
     tailTipWorld.x+Math.cos(a)*rM,
     tailTipWorld.y+Math.sin(a*1.3)*.28,
     tailTipWorld.z+Math.sin(a)*rM,
     .34,.28,.34,mk%2?cSpec:cSpecDeep,a);
   }

   // 5. Espinhos dorsais ao longo do pescoço, costas e cauda
   for(let j=0;j<14;j++){
    let spX=0,spY=0,spZ=0,spSc=.45,spAng=-.45,spCol=cObs;
    if(j<4){
     const u=(j+.5)/4;
     spX=neckYaw*u*.9;
     spY=1.25+u*1.45+neckLift*u*.9;
     spZ=2.45+u*2.15+slam*u*.65;
     spSc=.38+Math.sin(u*Math.PI)*.20;
     spAng=-.62;
     spCol=j===3?cSpecDeep:cSlate;
    }else if(j<10){
     const u=(j-4)/5;
     spX=0;
     spY=1.18-u*.34;
     spZ=1.55-u*3.35;
     spSc=.56-Math.abs(u-.4)*.24;
     spAng=-.48;
     spCol=j===6?cSpecDeep:cObs;
    }else{
     const u=(j-10)/3;
     spX=Math.sin(e.animT*3.1-(u*3+1)*.62)*(.25+u*.35);
     spY=.45-u*.36;
     spZ=-2.65-u*3.6;
     spSc=.34-u*.05;
     spAng=-.55;
     spCol=j===13?cSpec:cSlate;
    }
    putDPart(dragonSpine,i*14+j,spX,spY,spZ,spAng,0,0,spSc*.48,spSc*1.65,spSc*.62,spCol);
   }

   // 6. Quatro patas sincronizadas com garras visíveis apoiadas no terreno
   const legs=[
    {side:-1,front:true,hx:-1.14,hy:-.28,hz:1.22,phase:0},
    {side:1,front:true,hx:1.14,hy:-.28,hz:1.22,phase:Math.PI},
    {side:-1,front:false,hx:-1.04,hy:-.24,hz:-1.42,phase:Math.PI},
    {side:1,front:false,hx:1.04,hy:-.24,hz:-1.42,phase:0}
   ];
   for(let lIdx=0;lIdx<4;lIdx++){
    const L=legs[lIdx];
    const gPhase=walk+L.phase;
    const stride=Math.sin(gPhase)*.58*(1-fly);
    const lift=Math.max(0,Math.cos(gPhase))*.44*(1-fly);
    const hipW=dLocalPos(L.hx,L.hy,L.hz);
    const footLx=L.hx+L.side*.24;
    const footLz=L.hz+(L.front?.36:-.18)+stride-fly*.45;
    const footTmp=dLocalPos(footLx,0,footLz);
    const fGround=getHeight(footTmp.x,footTmp.z);
    const footWy=fly>0
     ? (fGround+.12+lift)*(1-fly)+(hipW.y-1.35)*fly
     : fGround+.12+lift;
    const footW=new T.Vector3(footTmp.x,footWy,footTmp.z);
    const kneeW=dLocalPos(
     L.hx+L.side*.36,
     L.hy-.72+lift*.45-fly*.25,
     L.hz+(L.front?-.18:-.48)+stride*.45-fly*.25
    );
    const bIdx=i*8+lIdx*2;
    putDBone(dragonLeg,bIdx+0,hipW,kneeW,L.front?.42:.46,L.front?.46:.52,cAbyss,e.fa);
    putDBone(dragonLeg,bIdx+1,kneeW,footW,L.front?.32:.34,L.front?.36:.38,cSlate,e.fa);

    const pawIdx=i*4+lIdx;
    put(dragonFoot,pawIdx,footW.x,footW.y+.06,footW.z,.44,.22,.56,cObs,e.fa);
    // 3 garras visíveis por pata (12 garras no total)
    for(let cIdx=0;cIdx<3;cIdx++){
     const spread=(cIdx-1)*.26;
     const ca=e.fa+spread;
     const cxClaw=footW.x+Math.sin(ca)*.44;
     const czClaw=footW.z+Math.cos(ca)*.44;
     dEul.set(1.18,ca,0,'YXZ');Q.setFromEuler(dEul);
     M4.compose(V.set(cxClaw,footW.y+.03,czClaw),Q,S.set(.12,.48,.12));
     const gClawIdx=i*12+lIdx*3+cIdx;
     dragonClaw.setMatrixAt(gClawIdx,M4);
     dragonClaw.setColorAt(gClawIdx,C.set(cTooth));
    }
   }

   // Partículas espectrais acompanhando os movimentos do chefe
   if(isPlaying()){
    e.partT+=dt*(1+roar*4+fly*1.5);
    if(e.partT>=.09){
     e.partT=0;
     const side=random()<.5?-1:1;
     const pSrc=dLocalPos(side*random(2.2,5.6),random(.4,2.4),random(-1.8,1.2));
     fx(pSrc.x,pSrc.y,pSrc.z,random()<.5?0x3be8ff:0x1a78d6,1,1.6,.65,1.1);
     if(roar>.35){
      dTmpA.set(0,-.1,1.8).applyQuaternion(qHead).add(headWorld);
      fx(dTmpA.x,dTmpA.y,dTmpA.z,0x3be8ff,2,4.5,.55,1.3);
     }
    }
   }
 }
 function finish(count){
  done(dragonBody,count*5);done(dragonArmor,count*6);done(dragonNeck,count*4);
  done(dragonHead,count*5);done(dragonSnout,count*2);done(dragonJaw,count);
  done(dragonTooth,count*8);done(dragonHorn,count*6);done(dragonWingBone,count*8);
  done(dragonWingClaw,count*2);done(dragonMembrane,count*6);done(dragonTail,count*7);
  done(dragonLeg,count*8);done(dragonFoot,count*4);done(dragonClaw,count*12);
  done(dragonEye,count*2);done(dragonSpine,count*14);done(dragonFissure,count*9);done(dragonMist,count*12);
 }
 return {max:MAX_D,render:renderDragon,finish};
}

