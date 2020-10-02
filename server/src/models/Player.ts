import { PlayerStatus } from "../enums";
import { Card, Task } from ".";

export class Player {
  socketID: string = "";
  name: string = "";
  tasks: Task[] = [];
  hand: Card[] = [];
  isCommander: boolean = false;
  isFirstPlayer: boolean = false;
  isTurn: boolean = false;
  canCommunicate: boolean = true;
  status: PlayerStatus = PlayerStatus.ActionPending;
  constructor(socketID: string, name: string) {
    this.socketID = socketID;
    this.name = name;
  }
}
