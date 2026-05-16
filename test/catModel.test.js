import test from 'node:test';
import assert from 'node:assert/strict';
import { addCat, addCats, CATS_PER_ROOM, createInitialCats, getRooms, MAX_CATS, renameCat, sendAwayCat } from '../src/catModel.js';

test('rooms contain at most seven cats each', () => {
  const rooms = getRooms(createInitialCats(15));

  assert.equal(rooms.length, 3);
  assert.equal(rooms[0].cats.length, CATS_PER_ROOM);
  assert.equal(rooms[1].cats.length, CATS_PER_ROOM);
  assert.equal(rooms[2].cats.length, 1);
});

test('cat collection cannot exceed one hundred cats', () => {
  const cats = createInitialCats(MAX_CATS);
  const nextCats = addCat(cats);

  assert.equal(nextCats.length, MAX_CATS);
  assert.equal(nextCats, cats);
});

test('cats can be renamed safely', () => {
  const [cat] = createInitialCats(1);
  const renamedCats = renameCat([cat], cat.id, '  星星貓咪  ');

  assert.equal(renamedCats[0].name, '星星貓咪');
});

test('cats can be adopted in batches without exceeding the max limit', () => {
  const cats = createInitialCats(95);
  const nextCats = addCats(cats, 20);

  assert.equal(nextCats.length, MAX_CATS);
});

test('sent-away cats are removed without adoption fees', () => {
  const cats = createInitialCats(3);
  const nextCats = sendAwayCat(cats, cats[1].id);

  assert.equal(nextCats.length, 2);
  assert.equal(nextCats.some((cat) => cat.id === cats[1].id), false);
});
