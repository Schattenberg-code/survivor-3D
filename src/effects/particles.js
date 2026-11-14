export function createEffects({getParticles,random}) {
function fx(x,y,z,c,n,sp2,life,s){for(let i=0;i<n&&getParticles().length<400;i++)getParticles().push({x,y,z,vx:random(-1,1)*sp2,vy:random(0,1)*sp2,vz:random(-1,1)*sp2,l:life*random(.6,1),c,s:s||1})}
 return {fx};
}
