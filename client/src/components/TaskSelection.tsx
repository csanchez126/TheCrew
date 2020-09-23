import { render } from "node-sass";
import React, { useContext } from "react";
import { useEffect } from "react";
import { GameContext } from "../App";
import { Game } from "../models";
import "../App.scss";

export const TaskSelection = () => {
  const game = useContext(GameContext);
  useEffect(() => {
    console.log(game);
  }, []);
  return <div className="task-selection"></div>;
};
