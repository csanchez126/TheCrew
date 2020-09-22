import express from "express";
import http from "http";
import socketIO, { Socket } from "socket.io";
import { GameManager } from "./managers/GameManager";
import { Game } from "./models/Game";
import { Player } from "./models/Player";
import { Turn } from "./models/Turn";

const app = express();
const port = 4001;

// server instance
const server = http.createServer(app);

// Create socketIO using the server instance
const io = socketIO(server);

let users: socketIO.Socket[] = [];

let game: Game;

const gameID = "Salut";

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.emit("new player", { message: "welcome" });

  if (users.length < 2) {
    users.push(socket);
  }

  if (users.length === 2) {
    // Start game
    game = new Game(
      gameID,
      users.map((u) => u.id)
    );
    game.setupGame();
    users.forEach((user) => {
      user.emit("game created", game);
    });
  }

  socket.on("play turn", (turn: Turn) => {
    game.playTurn(turn);
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
