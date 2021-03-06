import { PlayerStatus } from "../enums";
import { Card, Task } from ".";

export class Player {
  isGameHost: boolean = false;
  socketID: string = "";
  name: string = "";
  tasks: Task[] = [];
  hand: Card[] = [];
  isCommander: boolean = false;
  isFirstPlayer: boolean = false;
  isTurn: boolean = false;
  canCommunicate: boolean = true;
  communicatedCard: Card = null;
  status: PlayerStatus = PlayerStatus.ActionPending;
  constructor(socketID: string, name: string) {
    this.socketID = socketID;
    this.name = name;
  }
}
