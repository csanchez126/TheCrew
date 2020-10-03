import React, { useContext } from "react";
import { GameContext } from "../App";
import { Card } from "../models";
import { CardComponent } from "./CardComponent";
import { CardType } from "../enums";
import { getCurrentPlayer } from "../utils/GameUtils";
import "../css/TaskSelection.scss";

export const TaskSelection = () => {
  const gameStore = useContext(GameContext);
  const { player } = gameStore;

  const onTaskClick = (card: Card) => {
    gameStore.selectTask(card);
  };

  const getTaskSelectionStatus = () => {
    const { isTurn } = player;
    if (isTurn) {
      return "Your turn to pick a task";
    } else {
      const currentPlayer = getCurrentPlayer(gameStore.game).name;
      return `${currentPlayer} is selecting a task`;
    }
  };

  return (
    <div className="task-selection">
      <h1>Select Tasks</h1>
      <h2>{getTaskSelectionStatus()}</h2>
      <div className="task-container">
        {gameStore.game.tasks.map((task) => (
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
