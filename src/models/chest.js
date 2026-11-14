export function createChestFactory(T) {
const chestWood=new T.MeshStandardMaterial({color:0x8a542b,roughness:1,flatShading:true});
const chestDark=new T.MeshStandardMaterial({color:0x4b2b1b,roughness:1,flatShading:true});
const chestGold=new T.MeshStandardMaterial({color:0xe7b94f,metalness:.55,roughness:.42,flatShading:true});
const chestGlow=new T.MeshStandardMaterial({color:0xffd66b,emissive:0x8a4d08,roughness:.35,flatShading:true});
function makeChest(){
 const g=new T.Group();
 const base=new T.Mesh(new T.BoxGeometry(1.18,.58,.82),chestWood);base.position.y=.32;g.add(base);
 const foot=new T.Mesh(new T.BoxGeometry(1.24,.09,.88),chestDark);foot.position.y=.075;g.add(foot);
 for(let x of [-.36,0,.36]){const plank=new T.Mesh(new T.BoxGeometry(.32,.48,.025),chestDark);plank.position.set(x,.33,.424);g.add(plank)}
 const shape=new T.Shape();shape.moveTo(-.59,0);shape.lineTo(-.59,.17);shape.lineTo(-.46,.38);shape.lineTo(-.28,.47);shape.lineTo(.28,.47);shape.lineTo(.46,.38);shape.lineTo(.59,.17);shape.lineTo(.59,0);shape.closePath();
 const lidGeo=new T.ExtrudeGeometry(shape,{depth:.82,bevelEnabled:false,curveSegments:1});lidGeo.translate(0,.59,-.41);
 const lid=new T.Mesh(lidGeo,chestWood);g.add(lid);
 for(const x of [-.43,.43]){const strap=new T.Mesh(new T.BoxGeometry(.085,.61,.035),chestGold);strap.position.set(x,.36,.445);g.add(strap);
  const topStrap=new T.Mesh(new T.BoxGeometry(.085,.12,.84),chestGold);topStrap.position.set(x,.98,0);g.add(topStrap)}
 const latch=new T.Mesh(new T.BoxGeometry(.2,.25,.07),chestGold);latch.position.set(0,.69,.47);g.add(latch);
 const gem=new T.Mesh(new T.OctahedronGeometry(.085,0),chestGlow);gem.position.set(0,.72,.515);g.add(gem);
 for(const x of [-.43,.43]){const hinge=new T.Mesh(new T.BoxGeometry(.13,.12,.045),chestGold);hinge.position.set(x,.62,-.445);g.add(hinge)}
 return g;
}
 return makeChest;
}

