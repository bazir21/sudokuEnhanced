"use strict";

function buildKeyMap(shortcuts) {
    const keyToActionMap = {};
    Object.keys(shortcuts).forEach(actionName => {
        keyToActionMap[shortcuts[actionName].key] = actionName;
    });
    return keyToActionMap;
}

function findConflictingAction(shortcuts, actionName, key) {
    return Object.keys(shortcuts).find(
        otherActionName => otherActionName !== actionName && shortcuts[otherActionName].key === key
    );
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildKeyMap, findConflictingAction };
}
