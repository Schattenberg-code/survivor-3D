const SAVE_KEY = 'sv3';

export function loadSave() {
  const save = { souls: 0, hp: 0, dmg: 0, spd: 0, unl: [0] };
  try {
    Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}'));
  } catch (e) {}
  return save;
}

export function writeSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {}
}
