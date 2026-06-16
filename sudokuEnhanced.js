"use strict";

const SHIFT_KEY = "shift";
const DARK_KEY = "d";
const PAUSE_KEY = "p";
const UNDO_KEY = 'u';
const HINT_KEY = 'h';
const ERASE_KEY = 'e';
const CLEAN_KEY = 'c';
const noteSelector = ".game-controls-item.game-controls-pencil";
const pauseSelector = ".timer-wrapper";
const undoSelector = ".game-controls-undo";
const hintSelector = ".game-controls-hint";
const eraseSelector = ".game-controls-erase";
let darkMode = false;
let isClean = false;

function toggleNoteMode() {
    const nbtn = document.querySelector(noteSelector);
    nbtn.dispatchEvent(new Event('mousedown'));
}

function toggleBackground() {
    if (darkMode){
        document.body.style.backgroundColor = "#fff";
        document.getElementById("masthead").style.backgroundColor = "#fff";
        darkMode = !darkMode;
    }
    else {
        document.body.style.backgroundColor = "#121212";
        document.getElementById("masthead").style.backgroundColor = "#121212";
        darkMode = !darkMode;
    }
}

function togglePause() {
    const pbtn = document.querySelector(pauseSelector);
    pbtn.click();
}

function toggleUndo() {
    const ubtn = document.querySelector(undoSelector);
    ubtn.dispatchEvent(new Event('mousedown'));
}

function toggleHint() {
    const hbtn = document.querySelector(hintSelector);
    hbtn.dispatchEvent(new Event('mousedown'));
}

function toggleErase() {
    const ebtn = document.querySelector(eraseSelector);
    ebtn.dispatchEvent(new Event('mousedown'));
}

function toggleCleaner() {
    if (!isClean) {
        let aside = document.getElementById("aside");
        aside.parentNode.removeChild(aside);
        let banner = document.getElementById("cookies-banner");
        banner.parentNode.removeChild(banner);
        let tips = document.getElementById("tips-articles-wrap");
        tips.parentNode.removeChild(tips);
	isClean = !isClean;
    }
}

function keyPressed(p) {
    p = p.key.toLowerCase();
    if (p === SHIFT_KEY) { toggleNoteMode(); }
    if (p === DARK_KEY) { toggleBackground(); }
    if (p === PAUSE_KEY) { togglePause(); }
    if (p === UNDO_KEY) { toggleUndo(); }
    if (p === HINT_KEY) { toggleHint(); }
    if (p === ERASE_KEY) { toggleErase(); }
    if (p === CLEAN_KEY) { toggleCleaner(); }
}

const listener = document.addEventListener("keydown", keyPressed);

