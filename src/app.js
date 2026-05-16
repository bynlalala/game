import { addCats, clampRoomIndex, createInitialCats, getRooms, MAX_CATS, renameCat, sendAwayCat } from './catModel.js';

const STORAGE_KEY = 'cat-nurture-ios-prototype';
const appState = {
  cats: loadCats(),
  currentRoom: 0,
  activeTab: 'play'
};

const elements = {
  adoptBatchButton: document.querySelector('#adoptBatchButton'),
  adoptionNotice: document.querySelector('#adoptionNotice'),
  batchCount: document.querySelector('#batchCount'),
  catCount: document.querySelector('#catCount'),
  roomCount: document.querySelector('#roomCount'),
  currentRoomLabel: document.querySelector('#currentRoomLabel'),
  previousRoom: document.querySelector('#previousRoom'),
  nextRoom: document.querySelector('#nextRoom'),
  roomName: document.querySelector('#roomName'),
  roomMeta: document.querySelector('#roomMeta'),
  roomScene: document.querySelector('#roomScene'),
  roomViewport: document.querySelector('#roomViewport'),
  catList: document.querySelector('#catList'),
  catTemplate: document.querySelector('#catTemplate'),
  playTab: document.querySelector('#playTab'),
  settingsTab: document.querySelector('#settingsTab'),
  playTabButton: document.querySelector('#playTabButton'),
  settingsTabButton: document.querySelector('#settingsTabButton')
};

let touchStartX = 0;
let touchStartY = 0;

function loadCats() {
  try {
    const savedCats = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return Array.isArray(savedCats) ? savedCats : createInitialCats();
  } catch {
    return createInitialCats();
  }
}

function saveCats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.cats));
}

function render() {
  const rooms = getRooms(appState.cats);
  appState.currentRoom = clampRoomIndex(appState.currentRoom, rooms);
  const room = rooms[appState.currentRoom];

  elements.catCount.textContent = `${appState.cats.length}`;
  elements.roomCount.textContent = `${rooms.length}`;
  elements.currentRoomLabel.textContent = room.name;
  elements.roomName.textContent = `${room.toy} ${room.name}`;
  elements.roomMeta.textContent = `第 ${room.index + 1} / ${rooms.length} 個空間，本空間 ${room.cats.length} / 7 隻`;
  elements.previousRoom.disabled = appState.currentRoom === 0;
  elements.nextRoom.disabled = appState.currentRoom === rooms.length - 1;
  elements.adoptBatchButton.disabled = appState.cats.length >= MAX_CATS;
  elements.adoptBatchButton.textContent = appState.cats.length >= MAX_CATS ? '已達 100 隻上限' : '＋ 批量領養貓咪';

  renderTabs();
  renderRoom(room);
  renderCatList(rooms);
}

function renderTabs() {
  const isPlay = appState.activeTab === 'play';
  elements.playTab.classList.toggle('is-hidden', !isPlay);
  elements.settingsTab.classList.toggle('is-hidden', isPlay);
  elements.playTabButton.classList.toggle('is-active', isPlay);
  elements.settingsTabButton.classList.toggle('is-active', !isPlay);
}

function renderRoom(room) {
  elements.roomScene.className = `room-scene ${room.className}`;
  elements.roomScene.innerHTML = '<div class="room-depth"></div><div class="room-toy" aria-hidden="true"></div><div class="sparkles" aria-hidden="true">✦ ✧ ✦</div>';
  elements.roomScene.querySelector('.room-toy').textContent = room.toy;

  if (room.cats.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = '這個空間還沒有貓咪，請到設定批量領養。';
    elements.roomScene.append(emptyState);
    return;
  }

  room.cats.forEach((cat, index) => {
    const catElement = document.createElement('button');
    catElement.type = 'button';
    catElement.className = `cat-sprite ${cat.color} ${cat.pattern ?? 'plain'}`;
    catElement.style.setProperty('--x', `${10 + (index % 4) * 23}%`);
    catElement.style.setProperty('--y', `${43 + Math.floor(index / 4) * 30}%`);
    catElement.style.setProperty('--delay', `${index * -0.65}s`);
    catElement.style.setProperty('--pace', `${4.5 + (index % 3)}s`);
    catElement.setAttribute('aria-label', `${cat.name}，${cat.personality}，活力 ${cat.energy}`);
    catElement.innerHTML = `
      <span class="cat-tail"></span>
      <span class="cat-body"><i class="cat-belly"></i><i class="cat-mark"></i><i class="cat-paw paw-left"></i><i class="cat-paw paw-right"></i></span>
      <span class="cat-head">
        <i class="eye eye-left"></i>
        <i class="eye eye-right"></i>
        <b class="nose"></b>
        <em class="cheek cheek-left"></em>
        <em class="cheek cheek-right"></em>
        <span class="whisker whisker-left"></span>
        <span class="whisker whisker-right"></span>
      </span>
    `;
    catElement.addEventListener('click', () => {
      setActiveTab('settings');
      focusCatInput(cat.id);
    });
    elements.roomScene.append(catElement);
  });
}

function renderCatList(rooms) {
  const roomLookup = new Map();
  rooms.forEach((room) => room.cats.forEach((cat) => roomLookup.set(cat.id, room.name)));
  elements.catList.replaceChildren();

  appState.cats.forEach((cat) => {
    const node = elements.catTemplate.content.firstElementChild.cloneNode(true);
    const input = node.querySelector('.cat-name-input');
    const sendAwayButton = node.querySelector('.send-away-button');
    node.querySelector('.mini-cat').classList.add(cat.color, cat.pattern ?? 'plain');
    node.querySelector('.cat-location').textContent = `${roomLookup.get(cat.id)}・${cat.personality}・活力 ${cat.energy}`;
    input.value = cat.name;
    input.dataset.catId = cat.id;
    input.addEventListener('change', (event) => {
      appState.cats = renameCat(appState.cats, cat.id, event.target.value);
      saveCats();
      render();
      focusCatInput(cat.id);
    });
    sendAwayButton.addEventListener('click', () => {
      appState.cats = sendAwayCat(appState.cats, cat.id);
      saveCats();
      elements.adoptionNotice.textContent = `${cat.name} 已送養到新家；送養不是買賣，獲得費用為 0。`;
      render();
    });
    elements.catList.append(node);
  });
}

function focusCatInput(id) {
  requestAnimationFrame(() => {
    const targetInput = elements.catList.querySelector(`[data-cat-id="${id}"]`);
    targetInput?.focus();
    targetInput?.select();
  });
}

function changeRoom(direction) {
  const rooms = getRooms(appState.cats);
  appState.currentRoom = clampRoomIndex(appState.currentRoom + direction, rooms);
  render();
}

function setActiveTab(tab) {
  appState.activeTab = tab;
  render();
}

function adoptBatch() {
  const beforeCount = appState.cats.length;
  appState.cats = addCats(appState.cats, elements.batchCount.value);
  const adoptedCount = appState.cats.length - beforeCount;

  if (adoptedCount > 0) {
    appState.currentRoom = getRooms(appState.cats).length - 1;
    elements.adoptionNotice.textContent = `成功領養 ${adoptedCount} 隻貓咪，領養費用為 0。`;
    saveCats();
    render();
  } else {
    elements.adoptionNotice.textContent = '已達 100 隻上限，暫時不能再領養。';
  }
}

elements.adoptBatchButton.addEventListener('click', adoptBatch);
elements.playTabButton.addEventListener('click', () => setActiveTab('play'));
elements.settingsTabButton.addEventListener('click', () => setActiveTab('settings'));
elements.previousRoom.addEventListener('click', () => changeRoom(-1));
elements.nextRoom.addEventListener('click', () => changeRoom(1));

elements.roomViewport.addEventListener('touchstart', (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

elements.roomViewport.addEventListener('touchend', (event) => {
  const touch = event.changedTouches[0];
  const diffX = touch.clientX - touchStartX;
  const diffY = touch.clientY - touchStartY;

  if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
    changeRoom(diffX < 0 ? 1 : -1);
  }
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') changeRoom(-1);
  if (event.key === 'ArrowRight') changeRoom(1);
});

render();
