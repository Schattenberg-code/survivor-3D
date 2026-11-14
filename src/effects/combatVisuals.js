export function createCombatVisuals(T, scene, getHeight) {
  const UP = new T.Vector3(0, 1, 0);
  const M4 = new T.Matrix4();
  const Q = new T.Quaternion();
  const V = new T.Vector3();
  const D = new T.Vector3();
  const S = new T.Vector3();
  const C = new T.Color();
  const MAX_EFFECTS = 800;

  function makeMesh(geometry, material, capacity) {
    const mesh = new T.InstancedMesh(geometry, material, capacity);
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    mesh.frustumCulled = false;
    mesh.count = 0;
    mesh.setColorAt(0, C.set(0xffffff));
    scene.add(mesh);
    return mesh;
  }

  const windMesh = makeMesh(
    new T.ConeGeometry(.055, .62, 3),
    new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .3, depthWrite: false }),
    128
  );
  const effectMesh = makeMesh(
    new T.ConeGeometry(.08, .58, 4),
    new T.MeshLambertMaterial({ color: 0xffffff }),
    MAX_EFFECTS
  );

  const blades = Array.from({ length: 128 }, () => ({ life: 0, angle: 0, x: 0, z: 0, radius: 0 }));
  const bolts = Array.from({ length: 24 }, () => ({ life: 0, x: 0, z: 0, y: 0, seed: 0, color: 0xffffff }));
  const bursts = Array.from({ length: 128 }, () => ({ life: 0, angle: 0, x: 0, z: 0, radius: 0, color: 0xffffff }));
  let bladeCursor = 0;
  let boltCursor = 0;
  let burstCursor = 0;
  let seed = 1;

  function write(mesh, index, x, y, z, sx, sy, sz, color, rotation) {
    M4.compose(V.set(x, y, z), rotation || Q.identity(), S.set(sx, sy, sz));
    mesh.setMatrixAt(index, M4);
    mesh.setColorAt(index, C.set(color));
  }

  function segment(mesh, index, ax, ay, az, bx, by, bz, radius, color) {
    D.set(bx - ax, by - ay, bz - az);
    const length = D.length();
    if (length < .001) return;
    Q.setFromUnitVectors(UP, D.multiplyScalar(1 / length));
    write(mesh, index, (ax + bx) * .5, (ay + by) * .5, (az + bz) * .5,
      radius / .08, length / .58, radius / .08, color, Q);
  }

  function sword(x, z, radius) {
    for (let i = 0; i < 8; i++) {
      const blade = blades[bladeCursor];
      bladeCursor = (bladeCursor + 1) % blades.length;
      blade.x = x;
      blade.z = z;
      blade.radius = radius;
      blade.angle = i * Math.PI / 4;
      blade.life = .24;
    }
  }

  function lightning(x, z, y, color) {
    const bolt = bolts[boltCursor];
    boltCursor = (boltCursor + 1) % bolts.length;
    bolt.x = x;
    bolt.z = z;
    bolt.y = y;
    bolt.color = color || 0xffee55;
    bolt.seed = seed;
    seed += 1.73;
    bolt.life = .18;
  }

  function burst(x, z, radius, color, count) {
    const pieces = count || 10;
    for (let i = 0; i < pieces; i++) {
      const shard = bursts[burstCursor];
      burstCursor = (burstCursor + 1) % bursts.length;
      shard.x = x;
      shard.z = z;
      shard.radius = radius;
      shard.angle = i * Math.PI * 2 / pieces;
      shard.color = color;
      shard.life = .26;
    }
  }

  function update(dt, isPlaying) {
    if (!isPlaying) return;
    for (const blade of blades) if (blade.life > 0) blade.life = Math.max(0, blade.life - dt);
    for (const bolt of bolts) if (bolt.life > 0) bolt.life = Math.max(0, bolt.life - dt);
    for (const shard of bursts) if (shard.life > 0) shard.life = Math.max(0, shard.life - dt);
  }

  function render(projectiles) {
    let bladeCount = 0;
    let effectCount = 0;
    for (const blade of blades) {
      if (blade.life <= 0) continue;
      const progress = 1 - blade.life / .24;
      const distance = blade.radius * (.12 + .88 * progress);
      const dx = Math.cos(blade.angle);
      const dz = Math.sin(blade.angle);
      Q.setFromUnitVectors(UP, D.set(dx, .08, dz).normalize());
      const x = blade.x + dx * distance;
      const z = blade.z + dz * distance;
      const y = getHeight(x, z) + .82 + Math.sin(progress * Math.PI) * .18;
      write(effectMesh, effectCount++, x, y, z, .13 / .08, .78 / .58, .13 / .08, 0xc8d9e8, Q);
      write(windMesh, bladeCount, x - dx * .34, y - .08, z - dz * .34, .75, .78, .75, 0xb8d9e8, Q);
      bladeCount++;
    }
    windMesh.count = bladeCount;
    if (bladeCount) {
      windMesh.instanceMatrix.needsUpdate = true;
      windMesh.instanceColor.needsUpdate = true;
    }

    for (const bolt of bolts) {
      if (bolt.life <= 0) continue;
      if (effectCount + 7 > MAX_EFFECTS) break;
      const fade = .55 + .45 * bolt.life / .18;
      const px = i => Math.sin(bolt.seed + i * 12.9898) * .42;
      const pz = i => Math.cos(bolt.seed * 1.7 + i * 8.233) * .32;
      for (let i = 0; i < 5; i++) {
        segment(effectMesh, effectCount++, bolt.x + px(i), bolt.y + .08 + i * .72, bolt.z + pz(i),
          bolt.x + px(i + 1), bolt.y + .08 + (i + 1) * .72, bolt.z + pz(i + 1), .035 * fade, bolt.color);
      }
      for (let i = 1; i < 5; i += 2) {
        const side = i % 4 ? 1 : -1;
        segment(effectMesh, effectCount++, bolt.x + px(i), bolt.y + .08 + i * .72, bolt.z + pz(i),
          bolt.x + px(i) + side * .48, bolt.y + .38 + i * .72, bolt.z + pz(i) + .12,
          .022 * fade, bolt.color);
      }
    }

    for (const shard of bursts) {
      if (shard.life <= 0) continue;
      if (effectCount >= MAX_EFFECTS) break;
      const progress = 1 - shard.life / .26;
      const distance = shard.radius * (.12 + .88 * progress);
      const dx = Math.cos(shard.angle);
      const dz = Math.sin(shard.angle);
      Q.setFromUnitVectors(UP, D.set(dx, .12, dz).normalize());
      const x = shard.x + dx * distance;
      const z = shard.z + dz * distance;
      write(effectMesh, effectCount++, x, getHeight(x, z) + .38, z,
        .72 * (1 - progress * .35), .68, .72 * (1 - progress * .35), shard.color, Q);
    }
    let trailCount = 0;
    for (const projectile of projectiles || []) {
      if (trailCount >= 500 || effectCount >= MAX_EFFECTS) break;
      D.set(projectile.vx, projectile.vy, projectile.vz);
      const speed = D.length() || 1;
      D.multiplyScalar(-1 / speed);
      Q.setFromUnitVectors(UP, D);
      const color = projectile.k === 'f' ? 0xff8a32 : 0xb9e8f4;
      write(effectMesh, effectCount++, projectile.x + D.x * .26, projectile.y + D.y * .26,
        projectile.z + D.z * .26, .55, .54, .55, color, Q);
      trailCount++;
    }
    effectMesh.count = effectCount;
    if (effectCount) {
      effectMesh.instanceMatrix.needsUpdate = true;
      effectMesh.instanceColor.needsUpdate = true;
    }
  }

  function reset() {
    for (const blade of blades) blade.life = 0;
    for (const bolt of bolts) bolt.life = 0;
    for (const shard of bursts) shard.life = 0;
  }

  return { sword, lightning, burst, update, render, reset };
}
