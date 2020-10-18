import { action, makeAutoObservable, observable } from "mobx";
import { TaskPriority } from "../enums";
import { Mission } from "../models";
import { GameStore } from "./GameStore";

interface TokenItem {
  taskPriority: TaskPriority;
  disabled: boolean;
}

export class MissionSetupStore {
  gameStore: GameStore = null;

  taskCount: number = 1;
  tokens: TokenItem[] = [];
  constructor(gameStore: GameStore) {
    makeAutoObservable(this);
    this.gameStore = gameStore;
    this.tokens = Object.values(TaskPriority)
      .filter((val) => !isNaN(val as any))
      .map(
        (val) =>
          ({ taskPriority: val as TaskPriority, disabled: true } as TokenItem)
      );
  }

  @action
  startMission = () => {
    const priorityTokens = this.tokens
      .filter((t) => !t.disabled)
      .map((t) => t.taskPriority);
    if (this.taskCount > priorityTokens.length) {
      console.log("Cannot have more tokens than tasks");
    } else {
      this.gameStore.startMission(new Mission(this.taskCount, priorityTokens));
    }
  };

  @action
  toggleToken = (value: boolean, taskPriority: TaskPriority) => {
    if (taskPriority === TaskPriority.Omega) {
      let omegaToken = this.tokens.find(
        (t) => t.taskPriority === TaskPriority.Omega
      );
      omegaToken.disabled = value;
    } else {
      let startPriority = 0;
      let endPriority = 0;
      if (taskPriority <= TaskPriority.Fifth) {
        startPriority = TaskPriority.First as number;
        endPriority = TaskPriority.Fifth as number;
      } else if (taskPriority <= TaskPriority.FourRelative) {
        startPriority = TaskPriority.OneRelative as number;
        endPriority = TaskPriority.FourRelative as number;
      }

      if (value === false) {
        //if enabled, start to task true
        for (let i = startPriority; i < taskPriority; i += 1) {
          this.tokens[i].disabled = false;
        }
      }
      this.tokens[taskPriority].disabled = value;
      //Task+1 to end disabled
      for (let i = (taskPriority + 1) as number; i <= endPriority; i += 1) {
        this.tokens[i].disabled = true;
      }
    }
    const enabledTokens = this.tokens.filter((t) => !t.disabled);
    if (enabledTokens.length > this.taskCount) {
      this.taskCount = enabledTokens.length;
    }
    console.log(this.tokens, value);
  };

  @action
  taskCountChange = (e: any) => {
    const value = parseInt(e.target.value) || 1;
    const enabledTokens = this.tokens.filter((t) => !t.disabled);
    if (value >= enabledTokens.length) {
      this.taskCount = parseInt(e.target.value) || 1;
    }
  };
}
