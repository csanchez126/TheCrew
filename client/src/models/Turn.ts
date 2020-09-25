import { Task } from ".";
import { Card } from "./Card";
import { Player } from "./Player";

export class Turn {
  card: Card | Task;
  playerID: string;
  constructor(playerID: string, card: Card) {
    this.playerID = playerID;
    this.card = card;
  }
}
