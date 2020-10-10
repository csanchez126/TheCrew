import React, { useState } from "react";
import { GameContext } from "../App";
import { CardType, PlayerStatus, Suit } from "../enums";
import {
  getCurrentPlayer,
  getOtherPlayers,
  getPlayerName,
} from "../utils/GameUtils";
import { CardComponent } from "./CardComponent";
import "../css/TrickPlay.scss";
import { OtherPlayers } from "./OtherPlayers";

export const TrickPlay = () => {
  const gameStore = React.useContext(GameContext);
  const { player, game } = gameStore;

  const getTrickStatus = () => {
    const { isTurn } = player;
    let result = "Trick Status: ";
    if (isTurn) {
      result += "Your turn to play a card";
    } else {
      const currentPlayer = getCurrentPlayer(gameStore.game).name;
      result += `${currentPlayer} is playing a card`;
    }
    return result;
  };
  const otherPlayers = getOtherPlayers(game, player.socketID);

  if (player) {
    const { game } = gameStore;
    const { trick } = game;
    return (
      <div className="trick-play-container">
        <OtherPlayers players={otherPlayers} />
        <div className="trick-play">
          <div className="header">
            {trick!.suit !== null && (
              <React.Fragment>
                <h4>Trick Suit: {Suit[trick.suit]}</h4>
                <h4>
                  Current Trick Winner:
                  {game.currentTrickWinner && game.currentTrickWinner.name}
                </h4>
              </React.Fragment>
            )}
            <h4>{getTrickStatus()}</h4>
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
        <OtherPlayers players={otherPlayers} />
      </div>
    );
  }
  return null;
};
