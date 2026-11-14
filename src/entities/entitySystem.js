export function createEntitySystem(context) {
  const d2 = (entity, x, z) => (entity.x - x) ** 2 + (entity.z - z) ** 2;

  function near() {
    let best = null;
    let bestDistance = 1e9;
    for (const entity of context.en) {
      const distance = d2(entity, context.P.x, context.P.z);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = entity;
      }
    }
    return best;
  }

  function rndE(range) {
    const candidates = context.en.filter(entity =>
      d2(entity, context.P.x, context.P.z) < range * range
    );
    return candidates.length ? candidates[Math.random() * candidates.length | 0] : null;
  }

  function hit(entity, damage, color) {
    if (entity.dead) return;
    entity.hp -= damage * context.st.dmg;
    entity.f = .1;
    context.fx(entity.x, context.getHeight(entity.x, entity.z) + 1, entity.z, color || 0xffffff, 2, 4, .35, .8);
    if (entity.hp <= 0) kill(entity);
  }

  function kill(entity) {
    entity.dead = true;
    context.kills++;
    const groundY = context.getHeight(entity.x, entity.z);
    if (entity.ty === 0 || entity.ty === 1 || entity.ty === 2) {
      const color = entity.ty === 0 ? 0x151a28 : entity.ty === 1 ? 0x9e1b2e : 0x585d66;
      context.fx(entity.x, groundY + 1.1, entity.z, color, 7, 5.5, .55, 1.05);
      if (context.corpses.length < 90) {
        context.corpses.push({
          x: entity.x, y: entity.y || (groundY + 1.15), z: entity.z,
          ty: entity.ty, sx: entity.sx, sy: entity.sy, sz: entity.sz,
          fa: entity.fa || 0, ph: entity.ph, t: 0, dur: .55
        });
      }
    } else {
      context.fx(entity.x, groundY + 1, entity.z, entity.c, 6, 6, .5, 1);
    }
    if (context.gems.length < 600) context.gems.push({ x: entity.x, z: entity.z, v: entity.xp });
    else context.addXp(entity.xp);
    if (entity.ty === 4) {
      context.bossN++;
      context.earned += 10;
      context.boss = null;
      context.ch.push(mkChest(entity.x, entity.z));
      context.banner('Chefe derrotado');
    }
  }

  function aim(entity, speed, kind, damage, pierce, spread) {
    const dx = entity.x - context.P.x;
    const dz = entity.z - context.P.z;
    const distance = Math.hypot(dx, dz) || 1;
    const angle = Math.atan2(dz, dx) + spread;
    const startY = context.getHeight(context.P.x, context.P.z) + 1.2;
    const endY = context.getHeight(entity.x, entity.z) + 1.0;
    const vy = (endY - startY) / Math.max(.06, distance / speed);
    context.pr.push({
      x: context.P.x, y: startY, z: context.P.z,
      vx: Math.cos(angle) * speed, vy, vz: Math.sin(angle) * speed,
      k: kind, d: damage, p: pierce, l: 2, hs: new Set()
    });
  }

  function addW(id) {
    if (context.wp[id]) context.wp[id].lv++;
    else context.wp[id] = { lv: 1, t: 0 };
    context.renderWeaponSlots(context.$('wps'), context.wp, context.WN, context.svg);
    context.handHit(id, true);
  }

  function mkChest(x, z) {
    const model = context.makeChest();
    model.position.set(x, context.getHeight(x, z), z);
    context.sc.add(model);
    return { m: model, x, z, phase: context.R(0, 6.28) };
  }

  function spawn(type, isBoss) {
    const angle = context.R(0, 6.283);
    const distance = context.R(26, 34);
    const typeData = context.TY[type];
    const healthMultiplier = 1 + context.t / 60 * .4 + (context.t / 200) ** 2;
    context.en.push({
      x: context.P.x + Math.cos(angle) * distance,
      z: context.P.z + Math.sin(angle) * distance,
      ty: type,
      c: isBoss ? context.REG[context.rIdx].b[1] : typeData.c,
      sx: typeData.sx, sy: typeData.sy, sz: typeData.sz, r: typeData.r,
      hp: type === 0 ? 1 : typeData.hp * healthMultiplier * (isBoss ? 1 + context.bossN * .7 : 1),
      spd: typeData.spd * (1 + Math.min(context.t / 400, .5)),
      dmg: typeData.dmg * (1 + context.t / 400),
      xp: typeData.xp, f: 0, ph: Math.random() * 6, bs: 3
    });
    if (isBoss) {
      context.boss = context.en[context.en.length - 1];
      context.boss.mx = context.boss.hp;
    }
  }

  function pickType() {
    const weights = context.REG[context.rIdx].w;
    const available = [
      weights[0],
      context.t > 20 ? weights[1] : 0,
      context.t > 45 ? weights[2] : 0,
      context.t > 100 ? weights[3] : 0
    ];
    let roll = Math.random() * available.reduce((sum, weight) => sum + weight);
    for (let i = 0; i < 4; i++) {
      roll -= available[i];
      if (roll <= 0) return i;
    }
    return 0;
  }

  return { d2, near, rndE, hit, kill, aim, addW, mkChest, spawn, pickType };
}
