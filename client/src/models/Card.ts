import { Suit, CommStatus } from "../enums";

export class Card {
  suit: Suit;
  value: number;
  commStatus: CommStatus = CommStatus.None;
  constructor(suit: Suit, value: number) {
    this.suit = suit;
    this.value = value;
  }
  equals = (card: Card) => {
    return card.value === this.value && card.suit === this.suit;
  };
}
