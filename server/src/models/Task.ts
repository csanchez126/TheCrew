import { TaskPriority } from "../enums/TaskPriority";
import { Card } from "./Card";

export class Task extends Card {
  owner: number; // PlayerID
  priority: TaskPriority;
}
