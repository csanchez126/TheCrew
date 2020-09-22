import { Card } from "./Card";
import { Player } from "./Player";

export class Turn {
  card: Card;
  playerID: string;
  constructor(playerID: string, card: Card) {
    this.playerID = playerID;
    this.card = card;
  }
}
