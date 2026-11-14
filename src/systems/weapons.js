export function createWeaponDefinitions({
  getStats, getEnemies, getPlayer, getProjectiles, d2, hit, near, rndE, aim, ring, getHeight
}) {
  return {
    sword: {
      cd: .9,
      t: 'Golpe em área ao redor',
      f(w) {
        const player = getPlayer();
        const radius = 3.5 * getStats().ar * (1 + .12 * w.lv);
        for (const enemy of getEnemies()) {
          if (d2(enemy, player.x, player.z) < (radius + enemy.r) ** 2) hit(enemy, 12 + 6 * w.lv);
        }
        ring(player.x, player.z, radius, 0xffffff);
      }
    },
    fire: {
      cd: 1.5,
      t: 'Projéteis explosivos',
      f(w) {
        const count = 1 + (w.lv >> 1);
        for (let i = 0; i < count; i++) {
          const enemy = i ? rndE(30) : near();
          if (!enemy) break;
          aim(enemy, 16, 'f', 15 + 7 * w.lv, 1, 0);
        }
      }
    },
    bolt: {
      cd: 1.2,
      t: 'Raios em inimigos aleatórios',
      f(w) {
        for (let i = 0; i < 1 + w.lv; i++) {
          const enemy = rndE(28);
          if (!enemy) break;
          hit(enemy, 14 + 6 * w.lv, 0xffee55);
          const groundY = getHeight(enemy.x, enemy.z);
          const projectiles = getProjectiles();
          for (let k = 0; k < 8; k++) {
            projectiles.push({
              x: enemy.x, y: groundY + k * 1.1, z: enemy.z,
              vx: 0, vy: 0, vz: 0, l: .2, c: 0xffee55, s: 1.5
            });
          }
        }
      }
    },
    bow: {
      cd: .7,
      t: 'Flechas perfurantes',
      f(w) {
        const enemy = near();
        if (!enemy) return;
        const count = 1 + ((w.lv + 1) >> 1);
        for (let i = 0; i < count; i++) {
          aim(enemy, 30, 'a', 9 + 4 * w.lv, 1 + (w.lv >> 1), (i - (count - 1) / 2) * .13);
        }
      }
    },
    orb: { cd: 99, t: 'Mais orbes orbitando' },
    nova: {
      cd: 3.2,
      t: 'Explosão ao redor do jogador',
      f(w) {
        const player = getPlayer();
        const radius = 7 * getStats().ar * (1 + .08 * w.lv);
        for (const enemy of getEnemies()) {
          if (d2(enemy, player.x, player.z) < (radius + enemy.r) ** 2) hit(enemy, 25 + 10 * w.lv, 0xff9a3c);
        }
        ring(player.x, player.z, radius, 0xff9a3c);
        ring(player.x, player.z, radius * .6, 0xffd27a);
      }
    }
  };
}
