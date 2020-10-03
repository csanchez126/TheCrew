import { Turn } from ".";
import { Suit } from "../enums/Suit";

export class Trick {
  suit: Suit = null;
  turns: Turn[] = [];
}
