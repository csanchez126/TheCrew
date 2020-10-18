import { Card, Game, Mission, Player, Turn } from "../models";
import socketIOClient from "socket.io-client";
import { PlayerStatus } from "../enums";
import { action, makeAutoObservable, observable } from "mobx";
import { MissionSetupStore } from "./MissionSetupStore";

export class GameStore {
  private readonly ENDPOINT = "localhost:4001";
  game: Game = {} as Game;
  socket: SocketIOClient.Socket;
  player: Player;
  @observable missionSetupStore: MissionSetupStore;
  constructor() {
    this.initGameStore();
    this.missionSetupStore = new MissionSetupStore(this);
    makeAutoObservable(this);
  }

  initGameStore = () => {
    this.socket = socketIOClient(this.ENDPOINT);
    this.socket.on("new player", (res: any) => {});

    this.socket.on("kill game", (res: any) => {});

    this.socket.on("game created", (game: Game) => {
      this.updateGameState(game);
    });

    this.socket.on("updateGameState", (game: Game) => {
      this.updateGameState(game);
    });
  };

  startMission = (mission: Mission) => {
    this.socket.emit("stat mission", mission);
  };

  selectTask = (card: Card) => {
    this.socket.emit("select task", new Turn(this.socket.id, card));
  };

  selectCommCard = (card: Card) => {
    const turn = new Turn(this.player.socketID, card);
    this.socket.emit(
      "select communication card",
      new Turn(this.socket.id, card)
    );
  };

  cancelCommunication = () => {
    this.socket.emit("cancel communication", this.socket.id);
  };

  setPlayerState = (status: PlayerStatus) => {
    this.socket.emit("set communication status", this.socket.id, status);
  };

  updateGameState = (game: Game) => {
    this.game = game;
    this.player = this.game.players.find((p) => p.socketID === this.socket.id);
    console.log(game);
  };

  disconnect = () => {
    this.socket.disconnect();
  };
}
