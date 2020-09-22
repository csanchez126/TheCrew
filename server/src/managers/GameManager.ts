import { Suit } from "../enums/Suit";
import { Card, Game, Player, Task, Trick, Turn } from "../models";

export class GameManager {
  private static instance: GameManager;

  private constructor() {}

  public static getInstance = () => {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  };
}
