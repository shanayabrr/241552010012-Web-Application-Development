document.addEventListener("DOMContentLoaded", () => {
    // 1. Dark Mode Logic
    const toggleBtn = document.getElementById("theme-toggle");
    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("game-board-theme", theme);
        toggleBtn.innerText = theme === "dark" ? "DARK 🌙" : "LIGHT ☀️";
    };
    if (localStorage.getItem("game-board-theme")) applyTheme(localStorage.getItem("game-board-theme"));
    toggleBtn.addEventListener("click", () => {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });

    // 2. Counter Logic
    document.querySelectorAll(".counter").forEach(counter => {
        const target = +counter.getAttribute("data-target");
        const duration = 2000;
        const startTime = performance.now();
        function updateCount(currentTime) {
            const runtime = currentTime - startTime;
            const progress = Math.min(runtime / duration, 1);
            counter.innerText = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(updateCount);
            else counter.innerText = target;
        }
        requestAnimationFrame(updateCount);
    });
});