// Node.js 18+ sudah punya fetch built-in!
// Node < 18: npm install node-fetch

// === SOAL 1: Ambil 1 user dari API publik ===
async function ambilUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  const user = await res.json();
  console.log(`Nama : ${user.name}`);
  console.log(`Email : ${user.email}`);
  console.log(`Kota : ${user.address.city}`);
}

// === SOAL 2: Ambil posts lalu filter ===
async function postsByUser(userId) {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();
  const milik = posts.filter(p => p.userId === userId);
  console.log(`User ${userId} punya ${milik.length} post`);
  milik.slice(0, 3).forEach(p => console.log(' -', p.title));
}

// === SOAL 3: Parallel fetch ===
async function main() {
  console.log('=== User ==='); await ambilUser(1);
  console.log('\n=== Posts ==='); await postsByUser(1);
  console.log('\n=== Parallel ===');
  await Promise.all([ambilUser(2), ambilUser(3)]);
}
main().catch(console.error);