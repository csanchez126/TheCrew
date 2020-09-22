"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["MissionStart"] = 0] = "MissionStart";
    GameState[GameState["MissionFailed"] = 1] = "MissionFailed";
    GameState[GameState["TaskSelection"] = 2] = "TaskSelection";
    GameState[GameState["TrickSetup"] = 3] = "TrickSetup";
    GameState[GameState["TrickOngoing"] = 4] = "TrickOngoing";
    GameState[GameState["TrickEnd"] = 5] = "TrickEnd";
})(GameState = exports.GameState || (exports.GameState = {}));
//# sourceMappingURL=GameState.js.map