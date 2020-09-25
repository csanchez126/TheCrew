"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const Game_1 = require("./models/Game");
const app = express_1.default();
const port = 4001;
// server instance
const server = http_1.default.createServer(app);
// Create socketIO using the server instance
const io = socket_io_1.default(server);
let users = [];
let game;
const gameID = "Salut";
io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.emit("new player", { message: "welcome" });
    if (users.length < 2) {
        users.push(socket);
    }
    if (users.length === 2) {
        // Start game
        game = new Game_1.Game(gameID, users.map((u) => u.id));
        game.setupGame();
        users.forEach((user) => {
            user.emit("game created", game);
        });
    }
    socket.on("play turn", (turn) => {
        game.playTurn(turn);
        updatePlayers();
    });
    socket.on("select task", (turn) => {
        game.selectTask(turn);
        updatePlayers();
    });
    socket.on("disconnect", () => {
        users = users.filter((p) => p.id !== socket.id);
        if (game != null && users.length < game.players.length) {
            game = null;
            console.log("killing game");
            socket.broadcast.emit("kill game", { message: "game killed oh no :(" });
        }
        console.log("User disconnected", socket.id);
    });
});
const updatePlayers = () => {
    users.forEach((user) => {
        user.emit("updateGameState", game);
    });
};
server.listen(port, () => console.log(`Listening on port ${port}`));
//# sourceMappingURL=server.js.map