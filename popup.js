"use strict";

const darkToggle = document.getElementById("darkToggle");
const cleanToggle = document.getElementById("cleanToggle");
const openOptions = document.getElementById("openOptions");

browser.storage.local.get(["darkMode", "cleanMode"]).then(state => {
    darkToggle.checked = !!state.darkMode;
    cleanToggle.checked = !!state.cleanMode;
});

darkToggle.addEventListener("change", () => {
    browser.storage.local.set({ darkMode: darkToggle.checked });
});

cleanToggle.addEventListener("change", () => {
    browser.storage.local.set({ cleanMode: cleanToggle.checked });
});

openOptions.addEventListener("click", (e) => {
    e.preventDefault();
    browser.runtime.openOptionsPage();
});
