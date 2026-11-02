(() => {
    const mapElement = document.getElementById("rainforestMap");
    const locationList = document.getElementById("mapLocationList");
    const filterButtons = [...document.querySelectorAll("[data-map-filter]")];
    const locationButtons = [...document.querySelectorAll("[data-map-location]")];
    const locationCount = document.getElementById("mapLocationCount");
    const status = document.getElementById("mapStatus");

    if (!mapElement || !locationList) return;

    if (!window.L) {
        mapElement.replaceChildren();
        mapElement.classList.add("map-unavailable");
        mapElement.textContent = "A térkép most nem érhető el. Ellenőrizd az internetkapcsolatot, majd töltsd újra az oldalt.";
        if (status) status.textContent = "A térkép nem töltődött be. A helyszínlista továbbra is megtekinthető.";
        return;
    }

    const locations = [
        {
            id: "amazonas",
            number: "01",
            name: "Amazonas-medence",
            region: "Latin-Amerika",
            country: "Peru",
            regionKey: "latin-amerika",
            coordinates: [-3.749, -73.25],
            description: "A folyórendszer mentén kiterjedt trópusi erdők húzódnak."
        },
        {
            id: "darien",
            number: "02",
            name: "Darién vidéke",
            region: "Latin-Amerika",
            country: "Panama",
            regionKey: "latin-amerika",
            coordinates: [8.1, -77.7],
            description: "Sűrű, nedves erdők borítják a közép- és dél-amerikai térségek találkozását."
        },
        {
            id: "talamanca",
            number: "03",
            name: "Talamanca-hegység",
            region: "Latin-Amerika",
            country: "Costa Rica",
            regionKey: "latin-amerika",
            coordinates: [9.45, -83.65],
            description: "Hegyvidéki esőerdők borítják a magasabb lejtőket és völgyeket."
        },
        {
            id: "kongo",
            number: "04",
            name: "Kongói-medence",
            region: "Afrika",
            country: "Közép-Afrika",
            regionKey: "afrika",
            coordinates: [-1, 23.5],
            description: "Közép-Afrika folyói és összefüggő lombkoronái formálják ezt az erdős vidéket."
        },
        {
            id: "borneo",
            number: "05",
            name: "Borneó erdői",
            region: "Délkelet-Ázsia",
            country: "Indonézia",
            regionKey: "delkelet-azsia",
            coordinates: [1.55, 114.2],
            description: "A sziget alföldi és hegyvidéki erdői sokféle élőhelyet alkotnak."
        },
        {
            id: "uj-guinea",
            number: "06",
            name: "Új-Guinea erdői",
            region: "Óceánia",
            country: "Pápua Új-Guinea",
            regionKey: "oceania",
            coordinates: [-5, 141.5],
            description: "A trópusi erdők a sziget alacsonyabb vidékein és hegyoldalain is jelen vannak."
        },
        {
            id: "daintree",
            number: "07",
            name: "Daintree esőerdeje",
            region: "Óceánia",
            country: "Queensland, Ausztrália",
            regionKey: "oceania",
            coordinates: [-16.18, 145.42],
            description: "Nedves trópusi erdő és partvidék találkozik Északkelet-Ausztráliában."
        }
    ];

    const map = L.map(mapElement, {
        center: [3, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        scrollWheelZoom: true,
        worldCopyJump: true,
        zoomControl: true
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markerLayer = L.featureGroup().addTo(map);
    const markers = new Map();
    let activeRegion = "all";
    let selectedLocation = null;

    const setSelectedLocation = (id, announce = true) => {
        selectedLocation = id;
        locationButtons.forEach((button) => {
            const selected = button.dataset.mapLocation === id;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        markers.forEach((marker, markerId) => {
            const iconElement = marker.getElement()?.querySelector(".rainforest-marker-shell");
            iconElement?.classList.toggle("is-selected", markerId === id);
        });

        if (announce && status) {
            const location = locations.find((item) => item.id === id);
            if (location) status.textContent = `${location.name}, ${location.country} megnyitva a térképen.`;
        }
    };

    const buildPopup = (location) => {
        const content = document.createElement("div");
        const region = document.createElement("span");
        const name = document.createElement("h3");
        const country = document.createElement("span");
        const description = document.createElement("p");

        content.className = "map-popup";
        region.className = "map-popup-region";
        region.textContent = `${location.number} / ${location.region}`;
        name.className = "map-popup-name";
        name.textContent = location.name;
        country.className = "map-popup-country";
        country.textContent = location.country;
        description.className = "map-popup-description";
        description.textContent = location.description;
        content.append(region, name, country, description);

        return content;
    };

    locations.forEach((location) => {
        const icon = L.divIcon({
            className: "rainforest-marker",
            html: `<span class="rainforest-marker-shell" aria-hidden="true">${location.number}</span>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -19]
        });
        const marker = L.marker(location.coordinates, {
            alt: `${location.name}, ${location.country}`,
            title: `${location.number} · ${location.name}`,
            icon,
            keyboard: true
        }).bindPopup(buildPopup(location), { className: "rainforest-popup", maxWidth: 270 });

        marker.on("click", () => setSelectedLocation(location.id));
        markers.set(location.id, marker);
        markerLayer.addLayer(marker);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const moveToLocation = (coordinates, zoom) => {
        if (reducedMotion) map.setView(coordinates, zoom, { animate: false });
        else map.flyTo(coordinates, zoom, { duration: 0.75 });
    };

    const showLocation = (location, shouldOpenPopup = true) => {
        if (!location || location.regionKey !== activeRegion && activeRegion !== "all") return;

        setSelectedLocation(location.id);
        const marker = markers.get(location.id);
        moveToLocation(location.coordinates, 5);
        if (shouldOpenPopup) {
            if (reducedMotion) marker.openPopup();
            else map.once("moveend", () => marker.openPopup());
        }
    };

    const updateRegion = (regionKey) => {
        activeRegion = regionKey;
        const visibleLocations = locations.filter((location) => regionKey === "all" || location.regionKey === regionKey);
        const visibleIds = new Set(visibleLocations.map((location) => location.id));

        filterButtons.forEach((button) => {
            const active = button.dataset.mapFilter === regionKey;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        locationList.querySelectorAll("li").forEach((item) => {
            const button = item.querySelector("[data-map-location]");
            item.hidden = !visibleIds.has(button?.dataset.mapLocation);
        });

        markers.forEach((marker, id) => {
            if (visibleIds.has(id)) markerLayer.addLayer(marker);
            else markerLayer.removeLayer(marker);
        });

        if (!visibleIds.has(selectedLocation)) setSelectedLocation(null, false);
        if (locationCount) locationCount.textContent = String(visibleLocations.length).padStart(2, "0");

        if (visibleLocations.length === 1) {
            const onlyLocation = visibleLocations[0];
            moveToLocation(onlyLocation.coordinates, 5);
        } else if (visibleLocations.length > 1) {
            const bounds = markerLayer.getBounds().pad(0.18);
            if (reducedMotion) map.fitBounds(bounds, { maxZoom: 3, animate: false });
            else map.flyToBounds(bounds, { maxZoom: 3, duration: 0.75 });
        }

        if (status) {
            status.textContent = regionKey === "all"
                ? `Mind a ${visibleLocations.length} helyszín látható a listában és a térképen.`
                : `${visibleLocations.length} helyszín látható: ${filterButtons.find((button) => button.dataset.mapFilter === regionKey)?.textContent.trim()}.`;
        }
    };

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => updateRegion(button.dataset.mapFilter));
    });

    locationButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            const location = locations.find((item) => item.id === button.dataset.mapLocation);
            showLocation(location);
        });
    });

    const allBounds = markerLayer.getBounds();
    if (allBounds.isValid()) map.fitBounds(allBounds.pad(0.17), { maxZoom: 3 });
    window.addEventListener("resize", () => map.invalidateSize({ pan: false }), { passive: true });
    window.setTimeout(() => map.invalidateSize({ pan: false }), 150);
})();
