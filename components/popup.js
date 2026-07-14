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

function initState(state) {
    if (state.darkMode) document.body.classList.add("sudoku-dark");
}

browser.storage.onChanged.addListener((changes) => {
    if (changes.darkMode) {
        if (changes.darkMode.newValue) {
            document.body.classList.add("sudoku-dark");
        } else {
            document.body.classList.remove("sudoku-dark");
        }
    }
});

browser.storage.local.get(["darkMode"]).then(state => {
    initState(state);
});

