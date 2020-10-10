import React from "react";
import { GameContext } from "../App";
import { getOtherPlayers } from "../utils/GameUtils";
import "../css/OtherPlayers.scss";
import { PlayerTasks } from "./PlayerTasks";
import { CommunicatedCard } from "./CommunicatedCard";
import { PlayerHand } from "./PlayerHand";
import { Player } from "../models";

interface Props {
  players: Player[];
}
export const OtherPlayers = (props: Props) => {
  return (
    <div className="other-players-container">
      {props.players.map((otherPlayer) => (
        <div className="other-player">
          <div className="other-player-info">
            <h4>{otherPlayer.name}</h4>
            <p>Cards left: {otherPlayer.hand.length}</p>
            <p>
              <span className="communication-status">
                {otherPlayer.canCommunicate ? "Can " : "Cannot "}
              </span>
              comunicate
            </p>
          </div>
          <CommunicatedCard player={otherPlayer} />
          <PlayerTasks player={otherPlayer} />
        </div>
      ))}
    </div>
  );
};
