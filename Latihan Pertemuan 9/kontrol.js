// === SOAL 1: Kalkulator Nilai ===
function hitungGrade(nilai) {
  if (nilai < 0 || nilai > 100) return 'Input tidak valid!';
  if (nilai >= 90) return 'A — Sangat Memuaskan';
  if (nilai >= 80) return 'B — Memuaskan';
  if (nilai >= 70) return 'C — Cukup';
  if (nilai >= 60) return 'D — Kurang';
  return 'E — Tidak Lulus';
}
console.log(hitungGrade(95)); // A
console.log(hitungGrade(72)); // C
console.log(hitungGrade(150)); // tidak valid

// === SOAL 2: FizzBuzz 1–30 ===
// Kode JavaScript melakukan perulangan angka dari 1 sampai 30
// mulai dari 1
// simpan ke variable i
// selama i <= 30
// ulang terus
// setiap selesai loop → i++ (tambah 1)

for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) console.log(`${i}: FizzBuzz`);
  else if (i % 3 === 0) console.log(`${i}: Fizz`);
  else if (i % 5 === 0) console.log(`${i}: Buzz`);
  else console.log(i);
}