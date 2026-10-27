import { describe, it, expect } from "vitest";
import { buildKeyMap, findConflictingAction } from "../shortcutHelpers.js";

describe("buildKeyMap", () => {
    it("maps each shortcut key to its action name", () => {
        const shortcuts = {
            toggleNote: { key: "shift", label: "Toggle Note Mode" },
            togglePause: { key: "p", label: "Pause Timer" },
        };

        expect(buildKeyMap(shortcuts)).toEqual({
            shift: "toggleNote",
            p: "togglePause",
        });
    });

    it("returns an empty map when there are no shortcuts", () => {
        expect(buildKeyMap({})).toEqual({});
    });

    it("keeps the last action when two actions share a key", () => {
        const shortcuts = {
            firstAction: { key: "x", label: "First" },
            secondAction: { key: "x", label: "Second" },
        };

        expect(buildKeyMap(shortcuts)).toEqual({ x: "secondAction" });
    });

    it("stores keys exactly as given so event lookup can lowercase later", () => {
        const shortcuts = {
            toggleNote: { key: "Shift", label: "Toggle Note Mode" },
        };

        expect(buildKeyMap(shortcuts)).toEqual({ Shift: "toggleNote" });
    });
});

describe("findConflictingAction", () => {
    const shortcuts = {
        toggleNote: { key: "shift", label: "Toggle Note Mode" },
        togglePause: { key: "p", label: "Pause Timer" },
        toggleUndo: { key: "u", label: "Undo Move" },
    };

    it("finds another action that already uses the key", () => {
        expect(findConflictingAction(shortcuts, "toggleHint", "p")).toBe("togglePause");
    });

    it("ignores the action being rebound", () => {
        expect(findConflictingAction(shortcuts, "togglePause", "p")).toBeUndefined();
    });

    it("returns undefined when the key is free", () => {
        expect(findConflictingAction(shortcuts, "toggleHint", "h")).toBeUndefined();
    });
});
