"use strict";

let currentShortcuts = {};
let listeningAction = null;

const tableBody = document.getElementById("shortcutTable");
const conflictWarning = document.getElementById("conflictWarning");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

function renderTable() {
    tableBody.innerHTML = "";
    Object.keys(currentShortcuts).forEach(action => {
        const { key, label } = currentShortcuts[action];
        const tr = document.createElement("tr");

        const tdLabel = document.createElement("td");
        tdLabel.textContent = label;

        const tdKey = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "shortcut-key-display";
        badge.textContent = key;
        tdKey.appendChild(badge);

        const tdAction = document.createElement("td");
        const btn = document.createElement("button");
        btn.className = "shortcut-rebind-button";
        btn.textContent = "Change";
        btn.addEventListener("click", () => startListening(action, btn));
        tdAction.appendChild(btn);

        tr.appendChild(tdLabel);
        tr.appendChild(tdKey);
        tr.appendChild(tdAction);
        tableBody.appendChild(tr);
    });
}

function startListening(action, btn) {
    if (listeningAction) return;
    listeningAction = action;
    btn.textContent = "Press a key...";
    btn.classList.add("shortcut-rebind-active");

    function handler(e) {
        e.preventDefault();
        e.stopPropagation();

        const key = e.key.toLowerCase();

        document.removeEventListener("keydown", handler, true);
        btn.classList.remove("shortcut-rebind-active");
        btn.textContent = "Change";
        listeningAction = null;

        const duplicate = Object.keys(currentShortcuts).find(
            a => a !== action && currentShortcuts[a].key === key
        );

        if (duplicate) {
            conflictWarning.style.display = "block";
            conflictWarning.textContent = `Conflicts with "${currentShortcuts[duplicate].label}". Try another key.`;
            return;
        }

        conflictWarning.style.display = "none";
        currentShortcuts[action].key = key;
        renderTable();
    }

    document.addEventListener("keydown", handler, true);
}

function initState(state) {
    if (state.darkMode) document.body.classList.add("sudoku-dark");
}

resetBtn.addEventListener("click", () => {
    currentShortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    conflictWarning.style.display = "none";
    renderTable();
});

saveBtn.addEventListener("click", () => {
    browser.storage.local.set({ shortcuts: currentShortcuts }).then(() => {
        saveBtn.textContent = "Saved!";
        setTimeout(() => { saveBtn.textContent = "Save"; }, 1500);
    });
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.darkMode) {
        if (changes.darkMode.newValue) {
            document.body.classList.add("sudoku-dark");
        } else {
            document.body.classList.remove("sudoku-dark");
        }
    }
});

browser.storage.local.get(["shortcuts", "darkMode"]).then(state => {
    currentShortcuts = state.shortcuts || JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    renderTable();
    initState(state);
});
