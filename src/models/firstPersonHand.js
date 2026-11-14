export function createFirstPersonHand(T,sc,{getWeapons,getState,getBob,playerMaterial}) {
// ---------- maozinha poligonal (primeira pessoa) ----------
const hrig=new T.Group();hrig.visible=false;sc.add(hrig);
const hM=new T.MeshStandardMaterial({color:0xffd0a0,roughness:.95,flatShading:true,emissive:0x3a2416,side:T.DoubleSide});
const hD=new T.MeshStandardMaterial({color:0xe6a977,roughness:.95,flatShading:true,emissive:0x2c1a10,side:T.DoubleSide});
const hnd=new T.Group(),hW=new T.Group(),hP=new T.Group(),hFing=[];
hW.position.z=.09;hnd.add(hW);
hP.position.z=-.1;hW.add(hP);
function hSeg(len,w,mat,sides){const g=new T.CylinderGeometry(w*.42,w*.56,len,sides||5,1);g.rotateX(-Math.PI/2);const m=new T.Mesh(g,mat);m.position.z=-len/2;return m}
function hJoint(g,w){g.add(new T.Mesh(new T.IcosahedronGeometry(w*.52,0),hD))}
function hFinger(x,l1,l2,l3,w){
 const f=new T.Group();f.position.set(x,0,-.07);hJoint(f,w);f.add(hSeg(l1,w,hM));
 const m=new T.Group();m.position.z=-l1;hJoint(m,w*.9);m.add(hSeg(l2,w*.9,hM));
 const d=new T.Group();d.position.z=-l2;hJoint(d,w*.8);d.add(hSeg(l3,w*.8,hD));
 m.add(d);f.add(m);f.userData={m,d};hP.add(f);hFing.push(f)}
const hPalm=new T.Mesh(new T.BoxGeometry(.17,.07,.1),hM);hPalm.position.z=-.05;
const hPalm2=new T.Mesh(new T.BoxGeometry(.17,.065,.075),hM);hPalm2.position.z=-.035;
const hBack=new T.Mesh(new T.BoxGeometry(.12,.03,.11),hD);hBack.position.set(0,.045,-.09);
const hKnuckle=new T.Mesh(new T.BoxGeometry(.17,.05,.05),hD);hKnuckle.position.set(0,.004,-.07);
const hThenar=new T.Mesh(new T.BoxGeometry(.06,.06,.09),hM);hThenar.position.set(-.075,-.012,-.06);hThenar.rotation.y=.5;
const hGold=new T.MeshPhongMaterial({color:0xf2c14e,specular:0xfff2b0,shininess:90,flatShading:true,emissive:0x4a3606});
const hSilv=new T.MeshPhongMaterial({color:0xdfe6ee,specular:0xffffff,shininess:110,flatShading:true,emissive:0x232a32});
const hSl=new T.MeshStandardMaterial({color:0x3a7bd5,roughness:.9,flatShading:true,side:T.DoubleSide});
function hRing(par,z,r,mat,gem,spikes){
 const g=new T.Group();g.position.z=z;g.add(new T.Mesh(new T.TorusGeometry(r,r*.32,4,6),mat));
 const put=(deg,m,k)=>{const a=deg*Math.PI/180;m.position.set(Math.cos(a)*r*k,Math.sin(a)*r*k,0);m.rotation.z=a-Math.PI/2;g.add(m)};
 if(gem){const m=new T.Mesh(new T.OctahedronGeometry(r*.55,0),new T.MeshBasicMaterial({color:gem}));m.scale.set(.9,1.3,.9);put(225,m,1.1)}
 if(spikes)for(const d of(gem?[185,265]:[190,225,260]))put(d,new T.Mesh(new T.ConeGeometry(r*.28,r*1.0,4),mat),1.4);
 par.add(g);return g}
const hFA=new T.Group();hFA.position.z=.09;hFA.rotation.set(.5,.5,0);hnd.add(hFA);
hJoint(hFA,.17);
const hSk=hSeg(.12,.17,hM);hSk.position.z=.12;hFA.add(hSk);
const hCf=hSeg(.05,.26,hD);hCf.position.z=.17;hFA.add(hCf);
const hArm=hSeg(1.6,.34,hSl,6);hArm.position.z=1.77;hFA.add(hArm);
hRing(hFA,.05,.09,hGold,0xff3355,true);
hW.add(hPalm,hBack,hThenar);hP.add(hPalm2,hKnuckle);
hFinger(-.06,.055,.04,.035,.04);hFinger(-.02,.06,.045,.038,.042);hFinger(.02,.055,.042,.035,.04);hFinger(.062,.045,.032,.03,.036);
const hTh=new T.Group();hTh.position.set(-.085,-.01,-.04);hTh.rotation.y=.8;hJoint(hTh,.055);hTh.add(hSeg(.05,.055,hM));
const hTm=new T.Group();hTm.position.z=-.05;hJoint(hTm,.048);hTm.add(hSeg(.045,.048,hM));
const hTd=new T.Group();hTd.position.z=-.045;hJoint(hTd,.042);hTd.add(hSeg(.04,.042,hD));
hTm.add(hTd);hTh.add(hTm);hW.add(hTh);
hRing(hFing[0],-.03,.025,hGold,0xff3355);hRing(hFing[0].userData.m,-.02,.022,hSilv);
hRing(hFing[1],-.032,.026,hSilv,0x33ffe6,true);hRing(hFing[1].userData.m,-.022,.023,hGold);
hRing(hFing[2],-.02,.025,hGold);hRing(hFing[2],-.036,.025,hGold,0x3b8bff);
hRing(hFing[3],-.025,.022,hSilv,0xcc55ff);
hRing(hTm,-.022,.03,hGold,0x55ff77,true);
hnd.scale.setScalar(1.35);hrig.add(hnd);

const hSymRoot=new T.Group();hSymRoot.position.set(0,-.17,-.1);
hSymRoot.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(new T.Vector3(0,0,1),new T.Vector3(-1,0,0),new T.Vector3(0,-1,0)));
hW.add(hSymRoot);
const hSym={};
function hSymMat(c){return new T.MeshBasicMaterial({color:c,side:T.DoubleSide,transparent:true,opacity:1,depthWrite:false,fog:false})}
function hSymNew(id){const g=new T.Group();g.visible=false;g.userData.mats=[];hSymRoot.add(g);hSym[id]=g;return g}
function hSymAdd(g,geo,c,x,y,rz){const m=hSymMat(c);g.userData.mats.push(m);const o=new T.Mesh(geo,m);o.position.set(x||0,y||0,0);o.rotation.z=rz||0;g.add(o);return o}
function hPoly(pts){const sh=new T.Shape();pts.forEach((q,i)=>i?sh.lineTo(q[0],q[1]):sh.moveTo(q[0],q[1]));sh.closePath();return new T.ShapeGeometry(sh)}
function hStar(n,ro,ri){const a=[];for(let i=0;i<n*2;i++){const r=i%2?ri:ro,t=i*Math.PI/n;a.push([Math.cos(t)*r,Math.sin(t)*r])}return hPoly(a)}
{
 const g=hSymNew('sword');
 hSymAdd(g,hPoly([[0,.11],[.016,.085],[.016,-.03],[-.016,-.03],[-.016,.085]]),0xe8f2ff);
 hSymAdd(g,new T.PlaneGeometry(.09,.016),0xffd35a,0,-.03);hSymAdd(g,new T.PlaneGeometry(.018,.05),0xb8783a,0,-.065);
 const f=hSymNew('fire');
 hSymAdd(f,hPoly([[0,.12],[.03,.07],[.058,0],[.05,-.05],[0,-.085],[-.05,-.05],[-.058,0],[-.03,.06]]),0xff7a1a);
 hSymAdd(f,hPoly([[0,.06],[.022,.01],[.03,-.03],[0,-.055],[-.03,-.03],[-.022,.01]]),0xffd35a);
 const b=hSymNew('bolt');
 hSymAdd(b,hPoly([[.035,.12],[-.045,.005],[-.005,.005],[-.035,-.12],[.05,-.015],[.008,-.015]]),0xffee55);
 const w=hSymNew('bow');
 hSymAdd(w,new T.TorusGeometry(.07,.008,3,10,Math.PI),0x9be86b,0,0,-Math.PI/2);
 hSymAdd(w,new T.PlaneGeometry(.005,.14),0xffffff);hSymAdd(w,new T.PlaneGeometry(.14,.008),0xffd35a);
 hSymAdd(w,hPoly([[.09,0],[.065,.016],[.065,-.016]]),0xffd35a);
 const o=hSymNew('orb');
 hSymAdd(o,new T.TorusGeometry(.06,.006,3,12),0xc58bff);hSymAdd(o,hStar(4,.03,.012),0xc58bff);
 const orb=new T.Group();o.add(orb);o.userData.orbit=orb;
 for(let k=0;k<3;k++){const m=hSymMat(0xe0c8ff);o.userData.mats.push(m);const q=new T.Mesh(new T.OctahedronGeometry(.018,0),m);const t=k*2.0944;q.position.set(Math.cos(t)*.06,Math.sin(t)*.06,0);orb.add(q)}
 const n=hSymNew('nova');
 hSymAdd(n,hStar(8,.11,.045),0xff9a3c);hSymAdd(n,new T.CircleGeometry(.03,8),0xffd27a);
}
const HD={sword:.7,fire:.8,bolt:.55,bow:.95,orb:1.1,nova:1.0};
let hT=1,hSt='sword',hOrb=0,hBig=false,hVar=0;
function handHit(id,big){if(big||hT>.5){hT=0;hSt=id;hBig=!!big;if(big)hVar=(Object.keys(getWeapons()).length+(getWeapons()[id]?getWeapons()[id].lv:0))%3}}
function resetHand(){hT=1;hSt='sword';hOrb=0;hBig=false;hVar=0}
const hCl=(x,a,b)=>Math.min(b,Math.max(a,x));
const hSm=(a,b,x)=>{x=hCl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
const hS={x:.5,y:-.32,z:-.92,rx:.4,ry:.42,rz:-1.35,wr:.05,wy:0,pb:.1,sp:0,sm:.5,th:.3,f:[.32,.28,.34,.42]};
function poseHand(now,dt){
 const dur=(HD[hSt]||.7)*(hBig?1.9:1);
 if(getState()==='play'&&hT<1)hT=Math.min(1,hT+dt/dur);
 const p=hT,ts=now/1000;
 let a=0,w=0;
 if(p<1){a=Math.pow(Math.sin(Math.PI*Math.pow(p,.7)),2);w=p<.28?Math.sin(Math.PI*p/.28):0}
 const tg={x:.5+.04*w,y:-.32+Math.sin(ts*1.7)*.01+Math.sin(getBob())*.012,z:-.92+.05*w,
  rx:.4+Math.sin(ts*1.3)*.05,ry:.42+Math.sin(ts*1.1)*.05,rz:-1.35+Math.sin(ts*1.5)*.07,
  wr:.05+Math.sin(ts*1.9)*.1,wy:Math.sin(ts*1.4)*.12,pb:.1+Math.sin(ts*2.1+1)*.08,sp:.25+Math.sin(ts*1.2)*.2,sm:.5};
 const bs=Object.assign({},tg),idle=[.32,.28,.34,.42],cl=[1.05,1.05,1.05,1.05];
 let thc=.95,fo=null,thT=null;
 if(p<1)switch(hSt){
  case 'sword':
   tg.x-=.28*a;tg.y-=.08*a;tg.z-=.2*a;tg.ry+=.3*a;tg.rz+=.15*a;tg.wr-=.4*a;tg.wy+=.5*a;tg.pb+=.2*a;tg.sp=.4+.6*a;cl.fill(.62);thc=.5;break;
  case 'fire':
   tg.x-=.1*a;tg.y+=.12*a;tg.z-=.42*a;tg.rx-=.2*a;tg.wr+=.55*a;tg.pb-=.15*a;tg.sp+=1.2*a;cl.fill(-.05);thc=-.1;break;
  case 'bolt':
   tg.x+=-.12*a+Math.sin(p*60)*.03*a;tg.y+=.22*a;tg.z-=.3*a;tg.rz+=Math.sin(p*45)*.12*a;tg.wr-=.2*a;
   cl[0]=-.05;cl[1]=cl[2]=cl[3]=1.1;thc=.8;break;
  case 'bow':{
   const pu=hSm(0,.45,p)*(1-hSm(.45,.55,p)),re=hSm(.45,.6,p)*(1-hSm(.75,1,p));
   tg.x+=.12*pu-.14*re;tg.z+=.22*pu-.36*re;tg.y+=.03*pu+.04*re;tg.wr+=.2*pu-.3*re;tg.wy-=.3*pu;tg.sp+=.4*re;
   fo=(i,b)=>b+(.9-b)*pu+(-.05-b)*re;thT=.3+.6*pu-.4*re;break}
  case 'orb':{
   const e=Math.sin(Math.PI*p),an=p*6.2832;
   tg.x+=.12*Math.sin(an)*e;tg.y+=.1*(1-Math.cos(an))*e;tg.z-=.12*e;tg.rz+=.5*Math.sin(an)*e;tg.wr+=.3*Math.sin(an*2)*e;tg.sp+=.8*e;
   fo=(i,b)=>b+(.55-b)*e+Math.sin(an+i*.7)*.2*e;thT=.3+.3*e;break}
  case 'nova':{
   const fi=hSm(0,.3,p)*(1-hSm(.3,.4,p)),bu=hSm(.32,.5,p)*(1-hSm(.7,1,p));
   tg.x+=.06*fi-.1*bu;tg.y+=.18*fi-.05*bu;tg.z+=.1*fi-.38*bu;tg.rx+=-.2*fi+.1*bu;tg.wr-=.3*fi;tg.sp+=1.6*bu;
   fo=(i,b)=>b+(1.15-b)*fi+(-.15-b)*bu;thT=.3+.7*fi-.4*bu;break}
 }
 if(hBig&&p<1){
  for(const k of ['x','y','z','rx','ry','rz','wr','wy','pb'])tg[k]=bs[k]+(tg[k]-bs[k])*1.4;
  if(hVar===0){tg.rz+=1.0*Math.sin(p*6.2832)*hCl(a*2,0,1);tg.ry+=.2*a}
  else if(hVar===1){tg.y+=.2*a;tg.rx+=.35*a;tg.x-=.08*a;tg.sp+=.8*a}
  else{tg.x+=Math.sin(p*50)*.035*a;tg.pb+=.4*a;tg.z-=.12*a}
 }
 tg.sm=.5+(hBig?1.6:1.0)*a;
 const tf=[0,0,0,0];
 for(let i=0;i<4;i++){
  const base=(idle[i]+Math.sin(ts*2.2+i*.9)*.12)*(1-.6*w),r=hCl(a*1.35-i*.1,0,1);
  tf[i]=fo?fo(i,base):base+(cl[i]-base)*r}
 const thb=.3+Math.sin(ts*1.8)*.08,th=thT!==null?thT+Math.sin(ts*1.8)*.08:thb+(thc-thb)*hCl(a*1.3,0,1);
 const k1=1-Math.exp(-hCl(dt,0,.05)*8),k2=1-Math.exp(-hCl(dt,0,.05)*11);
 for(const q of ['x','y','z','rx','ry','rz','wr','wy','pb','sp','sm'])hS[q]+=(tg[q]-hS[q])*k1;
 for(let i=0;i<4;i++)hS.f[i]+=(tf[i]-hS.f[i])*k2;
 hS.th+=(th-hS.th)*k2;
 for(let i=0;i<4;i++){const f=hFing[i],k=hS.f[i],ph=ts*2.2+i*.9;
  f.rotation.x=-k*.9;f.rotation.y=(i-1.5)*hS.sp*.15+Math.sin(ph*.7)*.03;
  f.userData.m.rotation.x=-k*1.2+Math.sin(ph-.6)*.07;f.userData.d.rotation.x=-k*.8+Math.sin(ph-1.2)*.07}
 hTh.rotation.x=-hS.th*.25;hTm.rotation.x=-hS.th*.5;hTd.rotation.x=-hS.th*.7;
 hW.rotation.x=hS.wr;hW.rotation.y=hS.wy;hP.rotation.x=-hS.pb;
 hFA.rotation.set(.5+hS.wr*.4,.5-hS.wy*.4,0);hSl.color.copy(playerMaterial.color);
 hnd.position.set(hS.x,hS.y,hS.z);hnd.rotation.set(hS.rx,hS.ry,hS.rz);
 for(const id in hSym){const g=hSym[id],on=id===hSt;g.visible=on;if(!on)continue;
  g.scale.setScalar(hS.sm);const op=.45+.55*hCl(a*1.2,0,1);for(const m of g.userData.mats)m.opacity=op;
  g.rotation.z=Math.sin(ts*2)*.08+(hBig?6.2832*hSm(0,1,p):0);
  if(g.userData.orbit)g.userData.orbit.rotation.z=ts*2.4}
}
 return {hrig,poseHand,handHit,resetHand};
}
