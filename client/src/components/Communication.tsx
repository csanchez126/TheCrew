import React from "react";
import { GameContext } from "../App";
import { CardType, CommStatus } from "../enums";
import { Player } from "../models";
import { getCardsToCommunicate } from "../utils/GameUtils";
import { CardComponent } from "./CardComponent";

interface Props {
  player: Player;
}
export const Communication = (props: Props) => {
  const { game, socket } = React.useContext(GameContext);
  const { player } = props;
  if (player) {
    return (
      <div className="card-communication">
        <div className="header">
          <h3>Select a card to communicate</h3>
        </div>
        <div className="card-communication-container">
          {getCardsToCommunicate(player.hand).map((card) => (
            <CardComponent card={card} cardType={CardType.Communication} />
          ))}
        </div>
      </div>
    );
  }
  return null;
};
