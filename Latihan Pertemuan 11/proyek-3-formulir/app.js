document.addEventListener("DOMContentLoaded", () => {
    // 1. Dark Mode (Sinkron Proyek 1 & 2)
    const toggleBtn = document.getElementById("theme-toggle");
    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("game-board-theme", theme);
        toggleBtn.innerText = theme === "dark" ? "MALAM 🌙" : "SIANG ☀️";
    };
    if (localStorage.getItem("game-board-theme")) applyTheme(localStorage.getItem("game-board-theme"));
    toggleBtn.addEventListener("click", () => {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    // 2. Real-time Form Validation Logic
    const form = document.getElementById("hero-form");
    const user = document.getElementById("username");
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    const card = document.getElementById("form-card");

    const setStatus = (el, isOk, msg) => {
        document.getElementById(`${el.id}-error`).innerText = isOk ? "" : msg;
        el.style.borderColor = isOk ? "var(--success)" : "var(--error)";
        return isOk;
    };

    user.addEventListener("input", () => setStatus(user, user.value.length >= 3, "Nama Hero minimal 3 karakter!"));
    email.addEventListener("input", () => setStatus(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), "Format Surat Sihir (Email) salah!"));
    
    pass.addEventListener("input", () => {
        const val = pass.value;
        const bar = document.getElementById("strength-bar");
        const txt = document.getElementById("strength-text");
        let score = 0;

        if (val.length >= 6) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;

        if (val.length === 0) { bar.style.width = "0%"; txt.innerText = "Kekuatan: Belum diisi"; }
        else if (score <= 1) { bar.style.width = "35%"; bar.style.backgroundColor = "var(--error)"; txt.innerText = "Kekuatan: Rapuh 🔴"; }
        else if (score === 2) { bar.style.width = "65%"; bar.style.backgroundColor = "#ffbe0b"; txt.innerText = "Kekuatan: Tangguh 🟡"; }
        else { bar.style.width = "100%"; bar.style.backgroundColor = "var(--success)"; txt.innerText = "Kekuatan: Legendaris 🟢"; }

        setStatus(pass, val.length >= 6, "Mantra Sandi minimal 6 karakter!");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (user.value.length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && pass.value.length >= 6) {
            alert("🎉 Selamat! Hero berhasil terdaftar. Misi Final Selesai!");
            form.reset();
            document.getElementById("strength-bar").style.width = "0%";
        } else {
            card.classList.add("shake");
            setTimeout(() => card.classList.remove("shake"), 300);
        }
    });
});