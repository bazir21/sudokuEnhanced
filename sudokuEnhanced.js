"use strict";

const DEFAULT_SHORTCUTS = {
    toggleNote:  { key: "shift", label: "Toggle Note Mode" },
    togglePause: { key: "p",     label: "Pause Timer" },
    toggleUndo:  { key: "u",     label: "Undo Move" },
    toggleHint:  { key: "h",     label: "Show Hint" },
};

const SELECTORS = {
    note:  ".game-controls-item.game-controls-pencil",
    pause: ".timer-wrapper",
    undo:  ".game-controls-undo",
    hint:  ".game-controls-hint",
    erase: ".game-controls-erase"
};

const CLEAN_SELECTORS = ["#aside", "#cookies-banner", "#tips-articles-wrap"];

let shortcutMap = {};
let hiddenElements = [];

function safeClick(selector) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.click();
    return true;
}

function safeDispatch(selector, eventType) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.dispatchEvent(new Event(eventType));
    return true;
}

function toggleNoteMode() {
    return safeDispatch(SELECTORS.note, "mousedown");
}

function toggleDark() {
    document.body.classList.toggle("sudoku-dark");
    const isDark = document.body.classList.contains("sudoku-dark");
    browser.storage.local.set({ darkMode: isDark });
}

function togglePause() {
    return safeClick(SELECTORS.pause);
}

function toggleUndo() {
    return safeDispatch(SELECTORS.undo, "mousedown");
}

function toggleHint() {
    return safeDispatch(SELECTORS.hint, "mousedown");
}

function toggleErase() {
    return safeDispatch(SELECTORS.erase, "mousedown");
}

function applyClean() {
    CLEAN_SELECTORS.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
            el.style.display = "none";
            hiddenElements.push(el);
        }
    });
}

function removeClean() {
    hiddenElements.forEach(el => { el.style.display = ""; });
    hiddenElements = [];
}

function toggleCleaner() {
    if (hiddenElements.length > 0) {
        removeClean();
        browser.storage.local.set({ cleanMode: false });
    } else {
        applyClean();
        browser.storage.local.set({ cleanMode: true });
    }
}

function buildKeyMap(shortcuts) {
    const map = {};
    Object.keys(shortcuts).forEach(action => {
        map[shortcuts[action].key] = action;
    });
    return map;
}

const ACTION_MAP = {
    toggleNote:  toggleNoteMode,
    togglePause: togglePause,
    toggleUndo:  toggleUndo,
    toggleHint:  toggleHint,
    toggleErase: toggleErase,
};

function keyPressed(p) {
    try {
        const key = p.key.toLowerCase();
        const action = shortcutMap[key];
        if (action && ACTION_MAP[action]) {
            ACTION_MAP[action]();
        }
    } catch (e) {
        console.error("Key error:", e);
    }
}

function initState(state) {
    if (state.darkMode) {
        document.body.classList.add("sudoku-dark");
    }
    if (state.cleanMode) {
        applyClean();
    }
    shortcutMap = buildKeyMap(state.shortcuts || DEFAULT_SHORTCUTS);
}

browser.storage.local.get(["darkMode", "cleanMode", "shortcuts"]).then(state => {
    initState(state);
    document.addEventListener("keydown", keyPressed);
});

browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.darkMode) {
        if (changes.darkMode.newValue) {
            document.body.classList.add("sudoku-dark");
        } else {
            document.body.classList.remove("sudoku-dark");
        }
    }
    if (changes.cleanMode) {
        if (changes.cleanMode.newValue) {
            if (hiddenElements.length === 0) applyClean();
        } else {
            removeClean();
        }
    }
    if (changes.shortcuts) {
        shortcutMap = buildKeyMap(changes.shortcuts.newValue || DEFAULT_SHORTCUTS);
    }
});
