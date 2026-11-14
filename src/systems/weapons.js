export function createWeaponDefinitions({
  getStats, getEnemies, getPlayer, d2, hit, near, rndE, aim, getHeight, visuals
}) {
  return {
    sword: {
      cd: .9,
      t: 'Golpe em área ao redor',
      f(w) {
        const player = getPlayer();
        const radius = 3.5 * getStats().ar * (1 + .12 * w.lv);
        for (const enemy of getEnemies()) {
          if (d2(enemy, player.x, player.z) < (radius + enemy.r) ** 2) hit(enemy, 12 + 6 * w.lv, 0xc8d9e8);
        }
        visuals.sword(player.x, player.z, radius);
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
          visuals.lightning(enemy.x, enemy.z, groundY, 0xffee55);
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
        visuals.burst(player.x, player.z, radius, 0xff9a3c, 12);
      }
    }
  };
}
