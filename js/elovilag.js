(() => {
    const buttons = [...document.querySelectorAll(".sound-button[data-audio]")];
    const status = document.getElementById("audioStatus");

    if (!buttons.length || !status) return;

    let activeAudio = null;
    let activeButton = null;

    const resetButton = (button) => {
        button.classList.remove("is-playing");
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", `A ${button.dataset.animal} hangjának lejátszása`);
        button.querySelector("span").textContent = "Hang lejátszása";
    };

    const stopActiveAudio = () => {
        if (!activeAudio) return;

        activeAudio.pause();
        activeAudio.currentTime = 0;
        resetButton(activeButton);
        activeAudio = null;
        activeButton = null;
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if (activeButton === button) {
                stopActiveAudio();
                status.textContent = "A hang lejátszása leállt.";
                return;
            }

            stopActiveAudio();

            const audio = new Audio(button.dataset.audio);
            audio.preload = "none";
            activeAudio = audio;
            activeButton = button;
            button.classList.add("is-playing");
            button.setAttribute("aria-pressed", "true");
            button.setAttribute("aria-label", `A ${button.dataset.animal} hangjának leállítása`);
            button.querySelector("span").textContent = "Hang leállítása";
            status.textContent = `A ${button.dataset.animal} hangja szól.`;

            const finish = (message) => {
                if (activeAudio !== audio) return;

                resetButton(button);
                activeAudio = null;
                activeButton = null;
                status.textContent = message;
            };

            audio.addEventListener("ended", () => finish("A hangfelvétel véget ért."), { once: true });
            audio.addEventListener("error", () => finish("A hangfelvétel nem tölthető be."), { once: true });

            audio.play().catch(() => finish("A hangfelvétel nem indítható el."));
        });
    });

    window.addEventListener("pagehide", stopActiveAudio);
})();
