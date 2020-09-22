import { Card } from "./Card";
import { Task } from "./Task";

export class Player {
  name: string = "";
  tasks: Task[] = [];
  hand: Card[] = [];
  isCommander: boolean = false;
  isFirstPlayer: boolean = false;
  isTurn: boolean = false;
  constructor(name: string) {
    this.name = name;
  }
}
