// db.js — helper baca/tulis JSON
const fs = require('fs/promises');
const FILE = 'users.json';
async function baca() { const r=await fs.readFile(FILE,'utf8'); return JSON.parse(r); }
async function simpan(data) { await fs.writeFile(FILE, JSON.stringify(data,null,2)); }
module.exports = { baca, simpan };

// ─── app.js ───
const { baca, simpan } = require('./db');

// CREATE
async function tambahUser(nama, email) {
  const db = await baca();
  const user = { id: Date.now(), nama, email };
  db.users.push(user);
  await simpan(db);
  console.log('Ditambah:', user);
}

// READ
async function lihatSemua() {
  const db = await baca();
  console.table(db.users);
}

// UPDATE
async function updateUser(id, data) {
  const db = await baca();
  const user = db.users.find(u => u.id === id);
  if (!user) return console.log('Tidak ditemukan');
  Object.assign(user, data); await simpan(db);
  console.log('Diupdate:', user);
}

// DELETE
async function hapusUser(id) {
  const db = await baca();
  db.users = db.users.filter(u => u.id !== id);
  await simpan(db); console.log('Dihapus:', id);
}

async function main() {
  await simpan({ users: [] });
  await tambahUser('Budi','budi@mail.com');
  await tambahUser('Ani', 'ani@mail.com');
  await lihatSemua();
}
main().catch(console.error);