import { TaskPriority } from "../enums";

export class Mission {
  taskCount: number = 0;
  taskTokens: TaskPriority[] = [];

  constructor(taskCount: number, taskTokens: TaskPriority[]) {
    this.taskCount = taskCount;
    this.taskTokens = taskTokens;
  }
}
