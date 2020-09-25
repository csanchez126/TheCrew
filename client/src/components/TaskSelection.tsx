import { render } from "node-sass";
import React, { useContext } from "react";
import { useEffect } from "react";
import { GameContext } from "../App";
import { Game, Player } from "../models";
import "../App.scss";
import { CardComponent } from "./Card";
import { CardType } from "../enums";

interface Props {
  player: Player;
}
export const TaskSelection = (props: Props) => {
  const game: Game = useContext(GameContext);
  const { player } = props;
  useEffect(() => {
    console.log(game);
  }, []);
  console.log(player);
  return (
    <div className="task-selection">
      <h1>Select Tasks</h1>
      <h2>{player.name} select a task</h2>
      <div className="task-container">
        {game.tasks.map((task) => (
          <CardComponent card={task} cardType={CardType.Task} />
        ))}
      </div>
    </div>
  );
};
