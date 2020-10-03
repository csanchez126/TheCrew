import React from "react";
import { GameContext } from "../App";
import { CardType } from "../enums";
import { Player, Task } from "../models";
import { CardComponent } from "./CardComponent";

interface Props {
  tasks: Task[];
}
export const PlayerTasks = (props: Props) => {
  const { tasks } = props;
  if (tasks && tasks.length >= 0) {
    return (
      <React.Fragment>
        <div className="header">
          <h3>My Tasks</h3>
        </div>
        <div className="player-tasks-array">
          {tasks.map((task) => (
            <CardComponent card={task} cardType={CardType.Task} />
          ))}
        </div>
      </React.Fragment>
    );
  }
  return null;
};
