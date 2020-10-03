import React from "react";
import { GameContext } from "../App";
import { CardType } from "../enums";
import { Player, Task } from "../models";
import { CardComponent } from "./CardComponent";
import "../css/PlayerTasks.scss";

interface Props {
  player: Player;
}

export const PlayerTasks = (props: Props) => {
  const { player } = props;

  return (
    <div className="player-tasks">
      {player && (
        <React.Fragment>
          <div className="header">
            <h3>My Tasks</h3>
          </div>
          <div className="player-tasks-array">
            {player.tasks.map((task) => (
              <CardComponent card={task} cardType={CardType.Task} />
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
