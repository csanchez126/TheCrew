import React from "react";
import { GameContext } from "../App";
import { CardType, CommStatus } from "../enums";
import { Player } from "../models";
import { CardComponent } from "./CardComponent";

interface Props {
  player: Player;
}
export const CommunicatedCard = (props: Props) => {
  const { player } = props;
  if (player) {
    return (
      <React.Fragment>
        <div className="header">
          <h3>Communicated Card</h3>
        </div>
        <div className="communicated-card-container">
          {player.hand
            .filter((c) => c.commStatus !== CommStatus.None) // Get comm card
            .map((task) => (
              <CardComponent card={task} cardType={CardType.Communication} />
            ))}
        </div>
      </React.Fragment>
    );
  }
  return null;
};
