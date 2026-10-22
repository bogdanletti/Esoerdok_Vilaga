(() => {
    const drawer = document.getElementById("mainNavigation");
    const toggle = document.querySelector(".site-toggler[aria-controls='mainNavigation']");

    if (!drawer || !toggle) return;

    const setExpanded = (expanded) => {
        toggle.setAttribute("aria-expanded", String(expanded));
    };

    const syncExpanded = () => setExpanded(drawer.open);
    let closeTimer;
    let closeTransitionHandler;

    const clearCloseTransition = () => {
        window.clearTimeout(closeTimer);
        closeTimer = undefined;

        if (closeTransitionHandler) {
            drawer.removeEventListener("transitionend", closeTransitionHandler);
            closeTransitionHandler = undefined;
        }
    };

    const closeDrawer = () => {
        if (!drawer.open || drawer.classList.contains("hiding")) return;

        setExpanded(false);
        drawer.classList.add("hiding");

        const finishClose = () => {
            if (!drawer.classList.contains("hiding")) return;

            clearCloseTransition();
            if (typeof drawer.close === "function") {
                drawer.close();
            } else {
                drawer.removeAttribute("open");
            }
            drawer.classList.remove("hiding");
            syncExpanded();
        };

        closeTransitionHandler = (event) => {
            if (event.target === drawer && event.propertyName === "transform") {
                finishClose();
            }
        };
        drawer.addEventListener("transitionend", closeTransitionHandler);

        const transitionTimes = getComputedStyle(drawer).transitionDuration.split(",").map((value) => {
            const time = Number.parseFloat(value) || 0;
            return value.trim().endsWith("ms") ? time : time * 1000;
        });
        const transitionDelays = getComputedStyle(drawer).transitionDelay.split(",").map((value) => {
            const time = Number.parseFloat(value) || 0;
            return value.trim().endsWith("ms") ? time : time * 1000;
        });
        const maxTransitionTime = Math.max(...transitionTimes.map((time, index) => (
            time + (transitionDelays[index % transitionDelays.length] || 0)
        )));

        closeTimer = window.setTimeout(finishClose, maxTransitionTime + 50);
    };

    const cancelCloseAnimation = () => {
        if (!drawer.classList.contains("hiding")) return false;

        clearCloseTransition();
        drawer.classList.remove("hiding");
        syncExpanded();
        return true;
    };

    toggle.addEventListener("click", (event) => {
        event.preventDefault();

        if (cancelCloseAnimation()) {
            return;
        }

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
    drawer.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeDrawer();
    });
    drawer.addEventListener("click", (event) => {
        if (event.target === drawer) closeDrawer();
    });

    drawer.querySelectorAll(".drawer-close, .nav-link").forEach((link) => {
        link.addEventListener("click", closeDrawer);
    });
})();
