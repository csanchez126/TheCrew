import React, { useEffect, useState } from "react";
import { GameContext } from "../App";
import { CardType, CommStatus, PlayerStatus } from "../enums";
import { Card, Player, Turn } from "../models";
import {
  getCardsToCommunicate,
  getCurrentPlayer,
  getPlayerName,
} from "../utils/GameUtils";
import { CardComponent } from "./CardComponent";
import "../css/TrickPlay.scss";
import { OtherPlayers } from "./OtherPlayers";

export const TrickPlay = () => {
  const gameStore = React.useContext(GameContext);
  const { player, game } = gameStore;
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onPlayerReadyCheck = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const playerReady = e.currentTarget.checked;
    const status = playerReady
      ? PlayerStatus.Standby
      : PlayerStatus.ActionPending;
    gameStore.setPlayerState(status);
    setIsPlayerReady(e.currentTarget.checked);
  };

  const getTrickStatus = () => {
    const { isTurn } = player;
    if (isTurn) {
      return "Your turn to play a card";
    } else {
      const currentPlayer = getCurrentPlayer(gameStore.game).name;
      return `${currentPlayer} is playing a card`;
    }
  };

  if (player) {
    return (
      <div className="trick-play-container">
        <OtherPlayers />
        <div className="trick-play">
          <div className="header">
            <h3>{getTrickStatus()}</h3>
          </div>
          <div className="trick-container">
            {game.trick.turns.map((turn) => (
              <div className="trick-card-container">
                <h4>{getPlayerName(game, turn.playerID)}</h4>
                <CardComponent
                  class={`trick-card`}
                  card={turn.card}
                  cardType={CardType.Trick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};
