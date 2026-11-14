export function createTerrain(T,sc) {
// ---------- terreno low-poly procedural ----------
function smoothstep(e0,e1,x){const t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t)}
function getHeight(x,z){
 const dist0=Math.hypot(x,z);
 const amp=.30+.70*smoothstep(6,26,dist0);
 const wx=x+Math.sin(z*.017)*14+Math.cos(x*.013)*10;
 const wz=z+Math.cos(x*.019)*14+Math.sin(z*.011)*10;
 const r1=Math.sin(wx*.016)*Math.cos(wz*.015);
 const r2=Math.sin((wx*.7+wz*.7)*.022+1.3);
 const macro=(r1>0?Math.pow(r1,1.15)*6.2:r1*3.3)+r2*2.3;
 const hills=Math.sin(x*.041+Math.cos(z*.033)*1.2)*1.5+Math.cos(z*.037-Math.sin(x*.029)*1.1)*1.3;
 const detail=Math.sin(x*.092+z*.068)*.32+Math.cos(x*.061-z*.097)*.26;
 return (macro+hills+detail)*amp;
}
function getTerrainNormal(x,z,out){
 const e=1.2;
 const hL=getHeight(x-e,z),hR=getHeight(x+e,z),hD=getHeight(x,z-e),hU=getHeight(x,z+e);
 return (out||new T.Vector3()).set(hL-hR,2*e,hD-hU).normalize();
}
function gridJitterX(gx,gz){const s=Math.sin(gx*127.1+gz*311.7)*43758.5453;return (s-Math.floor(s)-.5)*1.35}
function gridJitterZ(gx,gz){const s=Math.sin(gx*269.5+gz*183.3)*43758.5453;return (s-Math.floor(s)-.5)*1.35}

const T_N=64,T_STEP=3.8,T_HALF=T_N>>1;
const tGeo=new T.BufferGeometry();
const tVertCount=(T_N+1)*(T_N+1);
const tPos=new Float32Array(tVertCount*3);
const tCol=new Float32Array(tVertCount*3);
const tIdx=new Uint16Array(T_N*T_N*6);
{
 let p=0;
 for(let iz=0;iz<T_N;iz++){
  for(let ix=0;ix<T_N;ix++){
   const a=iz*(T_N+1)+ix,b=a+1,c=a+(T_N+1),d=c+1;
   if((ix+iz)&1){tIdx[p++]=a;tIdx[p++]=c;tIdx[p++]=b;tIdx[p++]=b;tIdx[p++]=c;tIdx[p++]=d}
   else{tIdx[p++]=a;tIdx[p++]=c;tIdx[p++]=d;tIdx[p++]=a;tIdx[p++]=d;tIdx[p++]=b}
  }
 }
 tGeo.setIndex(new T.BufferAttribute(tIdx,1));
 tGeo.setAttribute('position',new T.BufferAttribute(tPos,3));
 tGeo.setAttribute('color',new T.BufferAttribute(tCol,3));
}
const gm=new T.MeshLambertMaterial({color:0xffffff,vertexColors:true});
const gnd=new T.Mesh(tGeo,gm);gnd.frustumCulled=false;sc.add(gnd);
sc.fog=new T.Fog(0x69736f,5,58);sc.background=new T.Color(0x69736f);

const cg=new T.Color(0x303b32),cs=new T.Color(0x68736e),cd=new T.Color(0x202920);
let lastSnapGX=1e9,lastSnapGZ=1e9,lastColHex=-1;
const tmpCol=new T.Color(),peakCol=new T.Color();
function updateTerrain(px,pz,forceCol){
 const sgx=Math.round(px/T_STEP),sgz=Math.round(pz/T_STEP);
 const moved=sgx!==lastSnapGX||sgz!==lastSnapGZ;
 const hex=cg.getHex();
 if(!moved&&!forceCol&&hex===lastColHex)return;
 lastSnapGX=sgx;lastSnapGZ=sgz;lastColHex=hex;
 peakCol.copy(cg).lerp(cd,.35).multiplyScalar(1.38);
 let v=0;
 for(let iz=0;iz<=T_N;iz++){
  const gz=sgz+iz-T_HALF;
  for(let ix=0;ix<=T_N;ix++){
   const gx=sgx+ix-T_HALF;
   const wx=gx*T_STEP+gridJitterX(gx,gz);
   const wz=gz*T_STEP+gridJitterZ(gx,gz);
   const wy=getHeight(wx,wz);
   if(moved){tPos[v]=wx;tPos[v+1]=wy;tPos[v+2]=wz}
   const shade=wy<0?Math.max(.72,1+wy*.055):Math.min(1.22,1+wy*.035);
   tmpCol.copy(cg).multiplyScalar(shade);
   if(wy>3.2)tmpCol.lerp(peakCol,Math.min(.65,(wy-3.2)/6.5));
   tCol[v]=tmpCol.r;tCol[v+1]=tmpCol.g;tCol[v+2]=tmpCol.b;
   v+=3;
  }
 }
 if(moved){tGeo.attributes.position.needsUpdate=true;tGeo.computeVertexNormals()}
 tGeo.attributes.color.needsUpdate=true;
}
 return {smoothstep,getHeight,getTerrainNormal,updateTerrain,cg,cs,cd};
}
