import { Suit } from "../enums/Suit";

export class Card {
  suit: Suit;
  value: number;
  constructor(suit: Suit, value: number) {
    this.suit = suit;
    this.value = value;
  }
}
