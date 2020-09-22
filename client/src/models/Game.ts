import { GameState, Suit } from "../enums";
import { Card, Player, Task, Trick } from "./";
export class Game {
  gameID: string;
  players: Player[];
  tasks: Task[] = [];
  trick: Trick;
  currentTrickWinner: Player;
  taskCount: number = 2;
  state: GameState;

  constructor(gameID: string, socketIDs: string[]) {
    this.players = socketIDs.map((id) => new Player(id));
    this.gameID = gameID;
  }
}
