import React from "react";
import { CardType, CommStatus } from "../enums";
import { Player } from "../models";
import { CardComponent } from "./CardComponent";
import "../css/CommunicatedCard.scss";

interface Props {
  player: Player;
}

export const CommunicatedCard = (props: Props) => {
  const { player } = props;
  return (
    <div className="communicated-card">
      {player && (
        <React.Fragment>
          <div className="header">
            <h3>Communicated Card</h3>
          </div>
          <div className="communicated-card-container">
            {player.communicatedCard && (
              <CardComponent
                card={player.communicatedCard}
                cardType={CardType.Communication}
              />
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};
