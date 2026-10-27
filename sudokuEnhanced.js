"use strict";

const SELECTORS = {
    note: 	".game-controls-item.game-controls-pencil",
    pause:	".timer-wrapper",
    undo: 	".game-controls-undo",
    hint: 	".game-controls-hint",
    erase:	".game-controls-erase",
    continue:   "button.game-over_btn.mistakesSecondChance",
};

let shortcutMap = {};

function safeClick(selector) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.click();
    return true;
}

function safeDispatch(selector, eventType) {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.dispatchEvent(new MouseEvent(eventType, { 
        bubbles: true,
        cancelable: true,
        view: window
    }));

    return true;
}

function toggleNoteMode() {
    return safeDispatch(SELECTORS.note, "mousedown");
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

function pressContinue() {
    if (document.querySelector(".show-mistakes-popup") !== null) {
        return safeClick(SELECTORS.continue);
    }
}

function applyCleanState(isCleanEnabled) {
    document.body.classList.toggle("sudoku-clean", isCleanEnabled);
}

const ACTION_MAP = {
    toggleNote: 	toggleNoteMode,
    togglePause:	togglePause,
    toggleUndo: 	toggleUndo,
    toggleHint: 	toggleHint,
    toggleErase:	toggleErase,
    continueGame:       pressContinue,
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
        applyCleanState(true);
    }
    shortcutMap = buildKeyMap(state.shortcuts || DEFAULT_SHORTCUTS);
}

browser.storage.local.get(["darkMode", "cleanMode", "shortcuts"]).then(state => {
    initState(state);
    document.addEventListener("keydown", keyPressed);
}).catch(error => console.error("Storage error:", error));

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
        applyCleanState(!!changes.cleanMode.newValue);
    }
    if (changes.shortcuts) {
        shortcutMap = buildKeyMap(changes.shortcuts.newValue || DEFAULT_SHORTCUTS);
    }
});
