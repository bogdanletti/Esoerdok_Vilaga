(() => {
    const drawer = document.getElementById("mainNavigation");
    const toggle = document.querySelector(".site-toggler[aria-controls='mainNavigation']");

    if (!drawer || !toggle) return;

    const setExpanded = (expanded) => {
        toggle.setAttribute("aria-expanded", String(expanded));
    };

    const closeDrawer = () => {
        if (typeof drawer.close === "function" && drawer.open) {
            drawer.close();
        } else {
            drawer.removeAttribute("open");
            setExpanded(false);
        }
    };

    toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (drawer.open) {
            closeDrawer();
        } else if (typeof drawer.showModal === "function") {
            drawer.showModal();
            setExpanded(true);
        } else {
            drawer.setAttribute("open", "");
            setExpanded(true);
        }
    });

    drawer.addEventListener("close", () => setExpanded(false));
    drawer.addEventListener("cancel", () => setExpanded(false));
    drawer.addEventListener("click", (event) => {
        if (event.target === drawer) closeDrawer();
    });

    drawer.querySelectorAll("[data-bs-dismiss='drawer'], .nav-link").forEach((link) => {
        link.addEventListener("click", (event) => {
            if (link.matches("[data-bs-dismiss='drawer']")) event.stopPropagation();
            closeDrawer();
        });
    });
})();
