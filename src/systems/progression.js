export function createStatDefinitions(getState) {
  return [
    ['dmg', 'Dano aumentado', m => `+${20 * m}% de dano`, m => getState().dmg *= 1 + .2 * m],
    ['spd', 'Velocidade', m => `+${15 * m}% de movimentação`, m => getState().spd *= 1 + .15 * m],
    ['as', 'Ataque rápido', m => `+${20 * m}% de velocidade de ataque`, m => getState().as *= 1 + .2 * m],
    ['hp', 'Vida máxima', m => `+${30 * m} de vida`, m => {
      getState().max += 30 * m;
      getState().hp += 30 * m;
    }],
    ['ar', 'Área de ataque', m => `+${15 * m}% de alcance`, m => getState().ar *= 1 + .15 * m],
    ['luck', 'Sorte', m => 'Mais itens raros', m => getState().luck += m],
    ['mag', 'Ímã de XP', m => `+${40 * m}% de coleta`, m => getState().mag += .4 * m],
    ['rg', 'Regeneração', m => `+${m} de vida por segundo`, m => getState().rg += m]
  ];
}

export function createProgression(getState, onLevelUp) {
  return {
    addXp(value) {
      const state = getState();
      state.xp += value;
      while (state.xp >= state.need) {
        state.xp -= state.need;
        state.lvl++;
        state.need = Math.floor(state.need * 1.22 + 3);
        onLevelUp();
        state.hp = Math.min(state.max, state.hp + state.max * .1);
      }
    }
  };
}
