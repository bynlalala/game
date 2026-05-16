export const MAX_CATS = 100;
export const CATS_PER_ROOM = 7;
export const MAX_BATCH_ADOPTION = 20;

export const ROOM_THEMES = [
  { name: '客廳', className: 'living-room', toy: '🧶' },
  { name: '前庭', className: 'front-yard', toy: '🌿' },
  { name: '陽台', className: 'balcony', toy: '🪴' },
  { name: '書房', className: 'study', toy: '📚' },
  { name: '廚房', className: 'kitchen', toy: '🥣' },
  { name: '閣樓', className: 'attic', toy: '🧸' },
  { name: '花園', className: 'garden', toy: '🌸' },
  { name: '寢室', className: 'bedroom', toy: '🛏️' },
  { name: '遊戲室', className: 'playroom', toy: '🎀' },
  { name: '月光屋', className: 'moon-room', toy: '🌙' },
  { name: '溫室', className: 'greenhouse', toy: '🌱' },
  { name: '露台', className: 'terrace', toy: '☀️' },
  { name: '畫室', className: 'studio', toy: '🎨' },
  { name: '咖啡角', className: 'cafe', toy: '☕' },
  { name: '雲朵房', className: 'cloud-room', toy: '☁️' }
];

const CAT_COLORS = ['cream', 'calico', 'gray', 'black', 'ginger', 'white', 'tuxedo', 'lilac', 'peach'];
const CAT_PATTERNS = ['plain', 'spot', 'stripe', 'sock', 'heart'];
const DEFAULT_NAMES = ['麻糬', '布丁', '小橘', '雪球', '豆花', '虎斑', '可可', '奶茶', '米粒', '花生'];

export function createInitialCats(count = 7) {
  return Array.from({ length: Math.min(count, MAX_CATS) }, (_, index) => createCat(index));
}

export function createCat(index) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `cat-${Date.now()}-${index}`,
    name: DEFAULT_NAMES[index % DEFAULT_NAMES.length],
    color: CAT_COLORS[index % CAT_COLORS.length],
    pattern: CAT_PATTERNS[index % CAT_PATTERNS.length],
    personality: index % 3 === 0 ? '愛撒嬌' : index % 3 === 1 ? '好奇' : '慵懶',
    energy: 60 + ((index * 7) % 35)
  };
}

export function renameCat(cats, id, nextName) {
  const safeName = nextName.trim().slice(0, 12) || '未命名';
  return cats.map((cat) => (cat.id === id ? { ...cat, name: safeName } : cat));
}

export function addCat(cats) {
  return addCats(cats, 1);
}

export function addCats(cats, count) {
  const safeCount = Math.min(Math.max(Number.parseInt(count, 10) || 0, 0), MAX_BATCH_ADOPTION);
  const remainingSlots = MAX_CATS - cats.length;
  const adoptionCount = Math.min(safeCount, remainingSlots);

  if (adoptionCount <= 0) {
    return cats;
  }

  const adoptedCats = Array.from({ length: adoptionCount }, (_, offset) => createCat(cats.length + offset));
  return [...cats, ...adoptedCats];
}

export function sendAwayCat(cats, id) {
  return cats.filter((cat) => cat.id !== id);
}

export function getRooms(cats) {
  const roomTotal = Math.max(1, Math.ceil(cats.length / CATS_PER_ROOM));

  return Array.from({ length: roomTotal }, (_, index) => {
    const theme = ROOM_THEMES[index % ROOM_THEMES.length];
    const start = index * CATS_PER_ROOM;

    return {
      index,
      ...theme,
      cats: cats.slice(start, start + CATS_PER_ROOM)
    };
  });
}

export function clampRoomIndex(index, rooms) {
  return Math.min(Math.max(index, 0), Math.max(rooms.length - 1, 0));
}
