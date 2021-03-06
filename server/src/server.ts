import express from "express";
import http from "http";
import socketIO from "socket.io";
import { PlayerStatus } from "./enums";
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
const names = ["carlos", "jean-simon", "jo", "pier-luc"];
const playerCount = 3;

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.emit("new player", { message: "welcome" });

  if (users.length < playerCount) {
    users.push(socket);
  }

  if (users.length === playerCount) {
    // Start game
    game = new Game(
      gameID,
      users.map((u, i) => new Player(u.id, names[i]))
    );
    game.setupGame();
    updatePlayers();
  }

  socket.on("play turn", (turn: Turn) => {
    game.playTurn(turn);
    updatePlayers();
  });

  socket.on("select task", (turn: Turn) => {
    game.selectTask(turn);
    updatePlayers();
  });

  socket.on("select communication card", (turn: Turn) => {
    game.selectCommunicationCard(turn);
    updatePlayers();
  });

  socket.on("cancel communication", (playerID: string) => {
    game.cancelCommunication(playerID);
    updatePlayers();
  });

  socket.on(
    "set communication status",
    (playerID: string, status: PlayerStatus) => {
      game.setCommunicationStatus(playerID, status);
      updatePlayers();
    }
  );

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
