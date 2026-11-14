export function renderWeaponSlots(element, weapons, weaponNames, icon) {
  element.innerHTML = Object.keys(weapons).map(key =>
    `<span title="${weaponNames[key]} · Nv ${weapons[key].lv}">${icon(key)}<b>${weapons[key].lv}</b></span>`
  ).join('');
}

export function renderLevelOptions(element, options, icon) {
  element.innerHTML = options.map((option, index) =>
    `<button class="card${option.r ? ' rare' : ''}" data-o="${index}">
      <div class="opt-top">
       <span class="opt-ico">${icon(option.ico)}</span>
       <span class="opt-tag${option.r ? ' is-rare' : ''}">${option.r ? icon('rare') : ''}${option.tag}</span>
      </div>
      <div class="opt-body"><b>${option.title}</b><small>${option.desc}</small></div>
     </button>`
  ).join('');
}

export function renderGameOverStats(element, rows, icon) {
  element.innerHTML = rows.map(row =>
    `<div class="st-row${row[3] ? ' highlight' : ''}"><span class="st-lbl">${icon(row[0])}${row[1]}</span><b>${row[2]}</b></div>`
  ).join('');
}

export function renderClassCards(characters, unlocked, selected, weaponNames, icon) {
  return characters.map((character, index) => {
    const isUnlocked = unlocked.includes(index);
    return `<button class="card${index === selected ? ' on' : ''}" data-c="${index}">
      <span class="ch-ico">${icon(character.ico)}</span>
      <span class="ch-txt"><b>${character.n}</b>${isUnlocked ? `<small>${weaponNames[character.w]}</small>` : `<small>${icon('lock')}${character.u} almas</small>`}</span>
     </button>`;
  }).join('');
}

export function renderUpgradeCards(upgrades, save, icon) {
  return upgrades.map(upgrade =>
    `<button class="card" data-u="${upgrade[0]}">
      <div class="up-head">${icon(upgrade[0])}<span class="up-lv">Nv ${save[upgrade[0]]}</span></div>
      <b>${upgrade[1]}</b>
      <small>${upgrade[2] * (1 + save[upgrade[0]])} almas</small>
     </button>`
  ).join('');
}
