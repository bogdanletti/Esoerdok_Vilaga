(() => {
    const drawer = document.getElementById("mainNavigation");
    const toggle = document.querySelector(".site-toggler[aria-controls='mainNavigation']");

    if (!drawer || !toggle) return;

    const setExpanded = (expanded) => {
        toggle.setAttribute("aria-expanded", String(expanded));
    };

    const syncExpanded = () => setExpanded(drawer.open);

    const closeDrawer = () => {
        if (typeof drawer.close === "function" && drawer.open) {
            drawer.close();
        } else {
            drawer.removeAttribute("open");
        }
        syncExpanded();
    };

    toggle.addEventListener("click", (event) => {
        event.preventDefault();

        if (drawer.open) {
            closeDrawer();
        } else if (typeof drawer.showModal === "function") {
            drawer.showModal();
            syncExpanded();
        } else {
            drawer.setAttribute("open", "");
            syncExpanded();
        }
    });

    drawer.addEventListener("close", syncExpanded);
    drawer.addEventListener("cancel", () => requestAnimationFrame(syncExpanded));
    drawer.addEventListener("click", (event) => {
        if (event.target === drawer) closeDrawer();
    });

    drawer.querySelectorAll(".drawer-close, .nav-link").forEach((link) => {
        link.addEventListener("click", closeDrawer);
    });
})();
