import { addCat, clampRoomIndex, createInitialCats, getRooms, MAX_CATS, renameCat } from './catModel.js';

const STORAGE_KEY = 'cat-nurture-ios-prototype';
const appState = {
  cats: loadCats(),
  currentRoom: 0
};

const elements = {
  addCatButton: document.querySelector('#addCatButton'),
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
  catTemplate: document.querySelector('#catTemplate')
};

let touchStartX = 0;
let touchStartY = 0;

function loadCats() {
  try {
    const savedCats = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return Array.isArray(savedCats) && savedCats.length > 0 ? savedCats : createInitialCats();
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
  elements.addCatButton.disabled = appState.cats.length >= MAX_CATS;
  elements.addCatButton.textContent = appState.cats.length >= MAX_CATS ? '已達 100 隻上限' : '＋ 領養貓咪';

  renderRoom(room);
  renderCatList(rooms);
}

function renderRoom(room) {
  elements.roomScene.className = `room-scene ${room.className}`;
  elements.roomScene.innerHTML = '<div class="room-depth"></div><div class="room-toy" aria-hidden="true"></div>';
  elements.roomScene.querySelector('.room-toy').textContent = room.toy;

  if (room.cats.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = '這個空間還沒有貓咪，領養新貓咪後就會入住。';
    elements.roomScene.append(emptyState);
    return;
  }

  room.cats.forEach((cat, index) => {
    const catElement = document.createElement('button');
    catElement.type = 'button';
    catElement.className = `cat-sprite ${cat.color}`;
    catElement.style.setProperty('--x', `${12 + (index % 4) * 22}%`);
    catElement.style.setProperty('--y', `${45 + Math.floor(index / 4) * 28}%`);
    catElement.style.setProperty('--delay', `${index * -0.65}s`);
    catElement.style.setProperty('--pace', `${4.5 + (index % 3)}s`);
    catElement.setAttribute('aria-label', `${cat.name}，${cat.personality}，活力 ${cat.energy}`);
    catElement.innerHTML = `
      <span class="cat-body"></span>
      <span class="cat-head"><i></i><b></b></span>
      <span class="cat-tail"></span>
      <strong>${cat.name}</strong>
    `;
    catElement.addEventListener('click', () => focusCatInput(cat.id));
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
    node.querySelector('.mini-cat').classList.add(cat.color);
    node.querySelector('.cat-location').textContent = `${roomLookup.get(cat.id)}・${cat.personality}・活力 ${cat.energy}`;
    input.value = cat.name;
    input.dataset.catId = cat.id;
    input.addEventListener('change', (event) => {
      appState.cats = renameCat(appState.cats, cat.id, event.target.value);
      saveCats();
      render();
      focusCatInput(cat.id);
    });
    elements.catList.append(node);
  });
}

function focusCatInput(id) {
  const targetInput = elements.catList.querySelector(`[data-cat-id="${id}"]`);
  targetInput?.focus();
  targetInput?.select();
}

function changeRoom(direction) {
  const rooms = getRooms(appState.cats);
  appState.currentRoom = clampRoomIndex(appState.currentRoom + direction, rooms);
  render();
}

elements.addCatButton.addEventListener('click', () => {
  const nextCats = addCat(appState.cats);
  if (nextCats.length !== appState.cats.length) {
    appState.cats = nextCats;
    appState.currentRoom = getRooms(appState.cats).length - 1;
    saveCats();
    render();
  }
});

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
