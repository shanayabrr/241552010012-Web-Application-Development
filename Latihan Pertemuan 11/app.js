// nungguin semua html kelar di-load dulu biar gak error pas nyari id
document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. logika buat dark mode (pake localstorage biar pas di-refresh gak balik)
       ========================================================================== */
    const tomboltema = document.querySelector('#theme-btn');
    
    // fungsi buat ganti tulisan di tombolnya doang
    const updatetekstombol = () => {
        const adakelasgelap = document.body.classList.contains('gelap');
        tomboltema.innerText = adakelasgelap ? "malam 🌙" : "siang ☀️";
    };

    // cek dulu di memori browser, kalo user sebelumnya pilih gelap ya langsung pasang
    if (localStorage.getItem('tema-game') === 'gelap') {
        document.body.classList.add('gelap');
        updatetekstombol();
    }

    // pas tombol siang/malam di-klik
    tomboltema.addEventListener('click', () => {
        document.body.classList.toggle('gelap'); // mainin on/off kelas .gelap di body
        const cekgelapaktif = document.body.classList.contains('gelap');
        
        // simpen pilihan user ke memori browser biar awet
        localStorage.setItem('tema-game', cekgelapaktif ? 'gelap' : 'terang');
        updatetekstombol();
    });


    /* ==========================================================================
       2. logika buat pindah-pindah tab navigation
       ========================================================================== */
    function pindahketab(idpanel) {
        // bersihin dulu semua kelas aktif di panel sama di tombol tab-nya
        document.querySelectorAll('.panel, .tombol-tab').forEach(el => el.classList.remove('aktif'));
        
        // tampilin panel yang emang di-klik sama user
        document.querySelector('#' + idpanel).classList.add('aktif');
        
        // kasih efek nyala di tombol tab yang lagi aktif sekarang
        document.querySelector(`[data-tab='${idpanel}']`).classList.add('aktif');

        // kalo user masuk ke tab statistik, putar ulang animasi angkanya dari nol
        if (idpanel === 'panel-statistik') {
            animasiangka();
        }
    }

    // pasang fungsi klik ke semua tombol tab yang ada di html
    document.querySelectorAll('.tombol-tab').forEach(btn => {
        btn.addEventListener('click', () => pindahke-tab(btn.dataset.tab));
    });


    /* ==========================================================================
       3. logika animasi angka ngetik sendiri pas halaman dibuka
       ========================================================================== */
    function animasiangka() {
        document.querySelectorAll('.kartu-stat').forEach(kartu => {
            const elangka = kartu.querySelector('.penghitung');
            const targetangka = +kartu.dataset.target; // tanda plus (+) buat maksa teks jadi angka murni
            let angkasekarang = 0;
            const tambahanskor = targetangka / 60; // dibagi 60 biar pergerakan animasinya smooth pas jalan

            const jalankanhitung = () => {
                angkasekarang = Math.min(angkasekarang + tambahanskor, targetangka);
                elangka.textContent = Math.floor(angkasekarang).toLocaleString(); // dibuletin kebawah biar gak desimal
                
                // panggil fungsi ini terus-menerus sampe angkanya mentok ke target
                if (angkasekarang < targetangka) {
                    requestAnimationFrame(jalankanhitung);
                }
            };
            requestAnimationFrame(jalankanhitung);
        });
    }
    // langsung gas jalanin sekali pas web pertama kali kebuka
    animasiangka();


    /* ==========================================================================
       4. logika accordion (buka tutup laci tanya jawab)
       ========================================================================== */
    document.querySelectorAll('.judul-akordion').forEach(tombol => {
        tombol.addEventListener('click', () => {
            const itemini = tombol.closest('.item-akordion');
            const statusbuka = itemini.classList.contains('terbuka');

            // tutup semua akordion lain dulu biar rapi (opsional tapi biar keren aja)
            document.querySelectorAll('.item-akordion').forEach(i => i.classList.remove('terbuka'));

            // kalo tadinya ketutup, sekarang tambahin kelas terbuka buat nampilin teksnya
            if (!statusbuka) {
                itemini.classList.add('terbuka');
            }
        });
    });


    /* ==========================================================================
       5. logika validasi form real-time + health bar password ala game rpg
       ========================================================================== */
    
    // bikin fungsi master validasi yang bisa dipake berulang kali biar gak boros baris kode
    function cekinputan(idinput, rumusaturan, pesanerror) {
        const elementinput = document.querySelector("#" + idinput);
        const tampungantekserror = elementinput.nextElementSibling; // ngincar tag span di bawah input buat nulis error
        const statuslulus = rumusaturan(elementinput.value.trim()); // trim buat ngebuang spasi kosong gak guna

        // kalo bener kasih kelas .valid (border hijau), kalo salah kasih kelas .invalid (border merah)
        elementinput.classList.toggle('valid', statuslulus);
        elementinput.classList.toggle('invalid', !statuslulus && elementinput.value !== '');

        // munculin tulisan error-nya ke layar kalo emang gak lulus uji aturan
        if (tampungantekserror && tampungantekserror.classList.contains('pesan-error')) {
            tampungantekserror.textContent = (statuslulus || elementinput.value === '') ? "" : pesanerror;
        }
        return statuslulus; // ngasih laporan balik hasilnya true atau false
    }

    const inputannama = document.querySelector('#nama');
    const inputanemail = document.querySelector('#email');
    const inputanpassword = document.querySelector('#password');

    // live-validation: langsung ngecek tiap kali user lagi ngetik huruf (pake event input)
    inputannama.addEventListener('input', () => 
        cekinputan('nama', isitahu => isitahu.length >= 3, 'nama hero minimal kudu 3 karakter!')
    );

    inputanemail.addEventListener('input', () => 
        cekinputan('email', isitahu => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(isitahu), 'format email-nya salah, periksa lagi!')
    );

    // khusus password: bikin bar indikator panjang pendek (health bar)
    inputanpassword.addEventListener('input', (e) => {
        const katasandi = e.target.value;
        const isianbar = document.querySelector('.isian');
        const tekspenjelas = document.querySelector('#strength-text');
        
        // hitung persentase panjang karakter (asumsi maks 12 karakter biar barnya penuh)
        const persenbar = Math.min(katasandi.length / 12 * 100, 100);
        isianbar.style.width = persenbar + '%';

        // ganti-ganti warna bar sama teks statusnya tergantung panjang sandi
        if (katasandi.length === 0) {
            isianbar.style.width = '0%';
            tekspenjelas.innerText = "kekuatan: belum diisi";
        } else if (persenbar < 40) {
            isianbar.style.background = 'var(--error)'; // warna merah
            tekspenjelas.innerText = "kekuatan: lemah bgt 🔴";
        } else if (persenbar < 75) {
            isianbar.style.background = '#ff9933'; // warna oranye
            tekspenjelas.innerText = "kekuatan: lumayan lah 🟡";
        } else {
            isianbar.style.background = 'var(--success)'; // warna hijau pas kuat
            tekspenjelas.innerText = "kekuatan: dewa/legend! 🟢";
        }

        // tetep jalanin aturan validasi standar minimal harus 6 karakter
        cekinputan('password', isitahu => isitahu.length >= 6, 'mantra sandi minimal kudu 6 karakter!');
    });


    /* ==========================================================================
       6. logika pas form dikirim (submit)
       ========================================================================== */
    const elementform = document.querySelector('#formulir');
    const wadahkartuform = document.querySelector('#form-card');

    elementform.addEventListener('submit', (e) => {
        e.preventDefault(); // stop browser biar gak ngerefresh halaman pas diklik kirim

        // paksa cek ulang semua field sebelum bener-bener dikirim
        const namaoke = cekinputan('nama', v => v.length >= 3, 'nama hero minimal kudu 3 karakter!');
        const emailoke = cekinputan('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'format email-nya salah, periksa lagi!');
        const sandioke = cekinputan('password', v => v.length >= 6, 'mantra sandi minimal kudu 6 karakter!');

        // pastiin ketiganya bernilai true alias lulus semua tanpa ada yang cacat
        const formvalidsemua = [namaoke, emailoke, sandioke].every(Boolean);

        if (!formvalidsemua) {
            // kalo ada yang zonk, kasih efek getar (shake) di kotakan form-nya biar interaktif
            wadahkartuform.classList.add('shake');
            setTimeout(() => wadahkartuform.classList.remove('shake'), 300); // ilangin efek setelah 0.3 detik
            return; 
        }

        // kalo sukses semua, sembunyiin form-nya terus munculin kotak notif sukses
        document.querySelector('#sukses').classList.remove('tersembunyi');
        elementform.classList.add('tersembunyi');

        // kasih jeda waktu 2.5 detik (sesuai modul slide) terus balikin user ke tab awal otomatis
        setTimeout(() => {
            alert("pendaftaran beres! heromu siap bertualang.");
            elementform.reset(); // bersihin isi ketikan form
            document.querySelector('#sukses').classList.add('tersembunyi');
            elementform.remove('tersembunyi');
            pindahke-tab('panel-statistik'); // lempar balik user ke tab pertama
        }, 2500);
    });

});