document.addEventListener("DOMContentLoaded", () => {
    // 1. Dark Mode (Sinkron Proyek 1)
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

    // 2. Tab Navigation Logic (Misi Langkah)
    const tiles = document.querySelectorAll(".board-tile");
    const contents = document.querySelectorAll(".tab-content");
    tiles.forEach(tile => {
        tile.addEventListener("click", () => {
            tiles.forEach(t => t.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));
            tile.classList.add("active");
            document.getElementById(tile.getAttribute("data-tab")).classList.add("active");
        });
    });

    // 3. Accordion Logic (Kitab Rahasia)
    const accHeaders = document.querySelectorAll(".accordion-header");
    accHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains("open");
            document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("open"));
            if (!isOpen) item.classList.add("open");
        });
    });
});