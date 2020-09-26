import React from "react";
import { GameContext } from "../App";
import { CardType } from "../enums";
import { Player } from "../models";
import { CardComponent } from "./Card";

interface Props {
  player: Player;
}
export const PlayerTasks = (props: Props) => {
  const { game, socket } = React.useContext(GameContext);
  const { player } = props;
  if (player) {
    return (
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
    );
  }
  return null;
};
