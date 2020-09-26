import { render } from "node-sass";
import React, { useContext } from "react";
import { useEffect } from "react";
import { GameContext } from "../App";
import { Card, Game, Player, Task, Turn } from "../models";
import "../App.scss";
import { CardComponent } from "./Card";
import { CardType } from "../enums";
import { getCurrentPlayer } from "../utils/GameUtils";

interface Props {
  player: Player;
}
export const TaskSelection = (props: Props) => {
  const { game, socket } = React.useContext(GameContext);
  const { player } = props;

  const onTaskClick = (card: Card) => {
    socket.emit("select task", new Turn(player.socketID, card));
  };

  const getTaskSelectionStatus = () => {
    const { isTurn } = player;
    if (isTurn) {
      return "Your turn to pick a task";
    } else {
      const currentPlayer = getCurrentPlayer(game).name;
      return `${currentPlayer} is selecting a task`;
    }
  };

  return (
    <div className="task-selection">
      <h1>Select Tasks</h1>
      <h2>{getTaskSelectionStatus()}</h2>
      <div className="task-container">
        {game.tasks.map((task) => (
          <CardComponent
            disabled={!player.isTurn}
            card={task}
            cardType={CardType.Task}
            onClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};
