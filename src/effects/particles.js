export function createEffects({getParticles,getHeight,random}) {
function fx(x,y,z,c,n,sp2,life,s){for(let i=0;i<n&&getParticles().length<400;i++)getParticles().push({x,y,z,vx:random(-1,1)*sp2,vy:random(0,1)*sp2,vz:random(-1,1)*sp2,l:life*random(.6,1),c,s:s||1})}
function ring(x,z,r,c){for(let i=0;i<28&&getParticles().length<400;i++){const a=i/28*6.283,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;getParticles().push({x:px,y:getHeight(px,pz)+.45,z:pz,vx:Math.cos(a)*2,vy:1,vz:Math.sin(a)*2,l:.45,c,s:1.4})}}
 return {fx,ring};
}

