"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
class GameManager {
    constructor() { }
}
exports.GameManager = GameManager;
GameManager.getInstance = () => {
    if (!GameManager.instance) {
        GameManager.instance = new GameManager();
    }
    return GameManager.instance;
};
//# sourceMappingURL=GameManager.js.map