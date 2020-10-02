import React, { useEffect, useState } from "react";
import { isJsxSelfClosingElement } from "typescript";
import { GameContext } from "../App";
import { CardType, CommStatus, PlayerStatus } from "../enums";
import { Card, Player, Turn } from "../models";
import { getCardsToCommunicate } from "../utils/GameUtils";
import { CardComponent } from "./CardComponent";

interface Props {
  player: Player;
}
export const Communication = (props: Props) => {
  const { game, socket } = React.useContext(GameContext);
  const { player } = props;
  const [selectedCard, setSelectedCard] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onCardClick = (card: Card) => {
    console.log(card);
    if (isSelected(card)) {
      socket.emit("cancel communication", player.socketID);
      setSelectedCard(null);
    } else {
      const turn = new Turn(player.socketID, card);
      console.log("turn", turn);
      socket.emit("select communication card", turn);
      setSelectedCard(card);
    }
  };

  const onPlayerReadyCheck = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const playerReady = e.currentTarget.checked;
    const status = playerReady
      ? PlayerStatus.Standby
      : PlayerStatus.ActionPending;
    socket.emit("set communication status", player.socketID, status);
    setIsPlayerReady(e.currentTarget.checked);
  };

  const isSelected = (card: Card) => {
    if (selectedCard) {
      return (
        card.suit === selectedCard.suit && card.value === selectedCard.value
      );
    }
    return false;
  };

  if (player) {
    return (
      <div className="card-communication">
        <div className="header">
          <h3>Select a card to communicate</h3>
        </div>
        <div className="card-communication-container">
          {getCardsToCommunicate(player.hand).map((card) => (
            <CardComponent
              onClick={onCardClick}
              class={`communication-card ${isSelected(card) ? "selected" : ""}`}
              card={card}
              cardType={CardType.Communication}
            />
          ))}
        </div>
        <label>
          Ready
          <input
            type="checkbox"
            name="player-ready"
            checked={isPlayerReady}
            onClick={onPlayerReadyCheck}
          />
        </label>
      </div>
    );
  }
  return null;
};
