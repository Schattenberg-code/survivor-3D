export function createCharacterPreview(T,canvas,CH,WN,getSelected,tag,subText) {
const pvCv=canvas,pvRn=new T.WebGLRenderer({canvas:pvCv,alpha:true,antialias:false,powerPreference:'high-performance'});
pvRn.setPixelRatio(1);pvRn.setSize(170,88,false);pvRn.outputEncoding=T.sRGBEncoding;
const pvSc=new T.Scene(),pvCam=new T.PerspectiveCamera(44,340/176,.1,20);
pvCam.position.set(0,1.52,4.15);pvCam.lookAt(0,1.06,0);
pvSc.add(new T.HemisphereLight(0xf7f2e7,0x343746,1.15));
const pvKey=new T.DirectionalLight(0xffebc4,1.3);pvKey.position.set(2.5,4,3);pvSc.add(pvKey);
const pvRim=new T.DirectionalLight(0x8ab4e6,.65);pvRim.position.set(-3,2,-2);pvSc.add(pvRim);

const pvBase=new T.Mesh(new T.CylinderGeometry(.82,.92,.1,8),new T.MeshStandardMaterial({color:0x2b2e3b,roughness:.85,flatShading:true}));
pvBase.position.y=-.05;pvSc.add(pvBase);

const pvHolder=new T.Group();pvSc.add(pvHolder);
const pvModels=[];
function buildCharPreview(idx){
 const g=new T.Group();
 const cols=[0x3a7bd5,0xd9481e,0x2e9e5b,0x8e44ad];
 const trim=[0x1f3666,0x7a1c0c,0x194d2e,0x491d5c];
 const armor=new T.MeshStandardMaterial({color:cols[idx],roughness:.82,flatShading:true});
 const sub=new T.MeshStandardMaterial({color:trim[idx],roughness:.9,flatShading:true});
 const skin=new T.MeshStandardMaterial({color:0xffd0a0,roughness:.85,flatShading:true});
 const dark=new T.MeshStandardMaterial({color:0x1d1f2b,roughness:.9,flatShading:true});
 const metal=new T.MeshStandardMaterial({color:0xe6ebf5,metalness:.35,roughness:.35,flatShading:true});
 const wood=new T.MeshStandardMaterial({color:0x754726,roughness:1,flatShading:true});
 const gold=new T.MeshStandardMaterial({color:0xe3b956,metalness:.45,roughness:.4,flatShading:true});

 const torso=new T.Mesh(new T.CylinderGeometry(.36,.52,.98,7),armor);torso.position.y=.88;g.add(torso);
 const belt=new T.Mesh(new T.CylinderGeometry(.48,.5,.14,7),dark);belt.position.y=.52;g.add(belt);
 const head=new T.Mesh(new T.IcosahedronGeometry(.35,1),skin);head.position.y=1.68;g.add(head);

 const leg1=new T.Mesh(new T.BoxGeometry(.2,.48,.24),dark);leg1.position.set(-.18,.24,0);
 const leg2=leg1.clone();leg2.position.x=.18;g.add(leg1,leg2);

 const arm1=new T.Mesh(new T.BoxGeometry(.18,.56,.2),armor);arm1.position.set(-.48,.94,0);arm1.rotation.z=.14;
 const arm2=arm1.clone();arm2.position.x=.48;arm2.rotation.z=-.24;arm2.rotation.x=-.35;g.add(arm1,arm2);

 if(idx===0){
  const chestPlate=new T.Mesh(new T.BoxGeometry(.72,.38,.48),sub);chestPlate.position.set(0,1.02,0);g.add(chestPlate);
  const helm=new T.Mesh(new T.ConeGeometry(.4,.42,6),metal);helm.position.set(0,1.98,0);g.add(helm);
  const crest=new T.Mesh(new T.BoxGeometry(.08,.24,.44),gold);crest.position.set(0,2.14,0);g.add(crest);
  const sword=new T.Group();
  const sBlade=new T.Mesh(new T.BoxGeometry(.1,.95,.05),metal);sBlade.position.y=.52;
  const sGuard=new T.Mesh(new T.BoxGeometry(.36,.08,.1),gold);
  const sHilt=new T.Mesh(new T.BoxGeometry(.07,.22,.07),dark);sHilt.position.y=-.14;
  sword.add(sBlade,sGuard,sHilt);sword.position.set(.58,.82,.26);sword.rotation.set(.45,0,-.22);g.add(sword);
  const shield=new T.Mesh(new T.CylinderGeometry(.36,.28,.08,6),sub);
  shield.rotation.x=Math.PI/2;shield.position.set(-.58,.9,.16);g.add(shield);
 }else if(idx===1){
  const brim=new T.Mesh(new T.CylinderGeometry(.62,.62,.05,8),sub);brim.position.set(0,1.92,0);g.add(brim);
  const hat=new T.Mesh(new T.ConeGeometry(.38,.78,7),armor);hat.position.set(0,2.3,0);hat.rotation.z=-.12;g.add(hat);
  const staff=new T.Mesh(new T.CylinderGeometry(.045,.055,1.75,6),wood);staff.position.set(.58,.95,.18);staff.rotation.x=.15;g.add(staff);
  const flame=new T.Mesh(new T.OctahedronGeometry(.18,0),new T.MeshBasicMaterial({color:0xff7b1c}));
  flame.position.set(.58,1.88,.32);g.add(flame);g.userData.fx=flame;
 }else if(idx===2){
  const hood=new T.Mesh(new T.ConeGeometry(.43,.45,6),sub);hood.position.set(0,1.94,-.03);hood.rotation.x=-.2;g.add(hood);
  const cape=new T.Mesh(new T.BoxGeometry(.64,.88,.08),sub);cape.position.set(0,.92,-.32);cape.rotation.x=.18;g.add(cape);
  const bow=new T.Mesh(new T.TorusGeometry(.52,.04,5,10,Math.PI),wood);
  bow.position.set(.54,1.02,.28);bow.rotation.set(0,Math.PI/2,-Math.PI/2);g.add(bow);
  const arrow=new T.Mesh(new T.CylinderGeometry(.02,.02,.85,5),metal);
  arrow.rotation.x=Math.PI/2;arrow.position.set(.54,1.02,.46);g.add(arrow);
 }else if(idx===3){
  const crown=new T.Mesh(new T.TorusGeometry(.32,.045,4,6),gold);crown.rotation.x=Math.PI/2;crown.position.y=1.94;g.add(crown);
  const orbGroup=new T.Group();orbGroup.position.y=1.12;
  const orbMat=new T.MeshBasicMaterial({color:0xd19eff});
  for(let k=0;k<3;k++){
   const o=new T.Mesh(new T.OctahedronGeometry(.13,0),orbMat);
   const a=k*Math.PI*2/3;
   o.position.set(Math.cos(a)*.74,Math.sin(k)*.12,Math.sin(a)*.74);
   orbGroup.add(o);
  }
  g.add(orbGroup);g.userData.orbit=orbGroup;
 }
 return g;
}
for(let i=0;i<4;i++){const m=buildCharPreview(i);m.visible=i===0;pvHolder.add(m);pvModels.push(m)}
function syncCharPreview(){
 pvModels.forEach((m,i)=>m.visible=i===getSelected());
 if(tag)tag.textContent=CH[getSelected()].n;
 if(subText)subText.textContent=`Arma inicial: ${WN[CH[getSelected()].w]}`;
}
 function update(dt,now){
  pvHolder.rotation.y+=dt*1.35;
  pvHolder.position.y=Math.sin(now*.003)*.04;
  const activeM=pvModels[getSelected()];
  if(activeM&&activeM.userData.orbit)activeM.userData.orbit.rotation.y-=dt*2.4;
  if(activeM&&activeM.userData.fx)activeM.userData.fx.rotation.y+=dt*3;
  pvRn.render(pvSc,pvCam);
 }
 return {update,sync:syncCharPreview};
}

