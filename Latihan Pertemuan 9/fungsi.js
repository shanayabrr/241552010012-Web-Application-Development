// === SOAL 1: Kalkulator lengkap ===
const kalkulator = {
  tambah: (a, b) => a + b,
  kurangi: (a, b) => a - b,
  kali: (a, b) => a * b,
  bagi: (a, b) => b !== 0 ? a / b : 'Error: dibagi nol!',
  pangkat: (a, b) => a ** b,
};
console.log(kalkulator.tambah(10, 5)); // 15
console.log(kalkulator.bagi(10, 0)); // Error: dibagi nol!
console.log(kalkulator.pangkat(2, 8)); // 256

// === SOAL 2: HOF — terapkan ke array ===
// Higher-order function (HOF), function yang menerima function lain sebagai parameter
function terapkan(arr, fn) { return arr.map(fn); }
console.log(terapkan([1,2,3,4], x => x**2)); // [1,4,9,16]
console.log(terapkan([1,2,3,4], x => x%2===0)); // [F,T,F,T]

// === SOAL 3: Closure — rekening bank ===
// Closure, Function masih bisa mengingat variable lama meskipun function pembuatnya sudah selesai
function buatRekening(saldoAwal) {
  let saldo = saldoAwal;
  return {
    setor: (n) => { saldo += n; console.log(`Saldo: ${saldo}`); },
    tarik: (n) => { if (n > saldo) { console.log('Saldo kurang!'); return; } 
                    saldo -= n; console.log(`Saldo: ${saldo}`); },
    cek: () => saldo,
  };
}
const rek = buatRekening(500000);
rek.setor(200000); // Saldo: 700000
rek.tarik(1000000); // Saldo kurang!
rek.tarik(100000); // Saldo: 600000