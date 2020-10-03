import React from "react";
import { GameContext } from "../App";
import { getOtherPlayers } from "../utils/GameUtils";
import "../css/OtherPlayers.scss";
export const OtherPlayers = () => {
  const gameStore = React.useContext(GameContext);
  const { player, game } = gameStore;
  return (
    <div className="other-players-container">
      {getOtherPlayers(game, player.socketID).map((p) => (
        <div className="other-player"></div>
      ))}
    </div>
  );
};
