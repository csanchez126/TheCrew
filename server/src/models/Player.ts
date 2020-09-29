import { Card } from "./Card";
import { Task } from "./Task";

export class Player {
  socketID: string = "";
  name: string = "";
  tasks: Task[] = [];
  hand: Card[] = [];
  isCommander: boolean = false;
  isFirstPlayer: boolean = false;
  isTurn: boolean = false;
  canCommunicate: boolean = true;
  constructor(socketID: string, name: string) {
    this.socketID = socketID;
    this.name = name;
  }
}
