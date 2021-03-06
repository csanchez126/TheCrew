import React from "react";
import { GameContext } from "../App";
import { CommunicatedCard } from "./CommunicatedCard";
import { Communication } from "./Communication";
import { PlayerTasks } from "./PlayerTasks";
import { TaskSelection } from "./TaskSelection";
import { GameState } from "../enums";
import { observer } from "mobx-react-lite";
import { TrickPlay } from "./TrickPlay";
import "../css/GameComponent.scss";
import { PlayerHand } from "./PlayerHand";
import { MissionSetup } from "./MissionSetup";

export const GameComponent = observer(() => {
  const gameStore = React.useContext(GameContext);

  const getPlayingAreaComponent = (): any => {
    switch (gameStore.game.state) {
      case GameState.MissionStart:
        return;
      case GameState.TaskSelection:
        return <MissionSetup />;
      // return <TaskSelection />;
      case GameState.TrickSetup:
        return <Communication />;
      case GameState.TrickOngoing:
        return <TrickPlay />;
      case GameState.TrickEnd:
      case GameState.MissionFailed:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="controls">
        <div className="info">
          <p>
            <span className="label">Player/Socket ID: </span>
            {gameStore.player?.name}
          </p>
          <p>
            <span className="label">Game State: </span>
            {GameState[gameStore.game.state]}
          </p>
        </div>
        {gameStore.player?.isCommander && <p>You are the commander</p>}
      </div>
      <div className="playing-field">
        {gameStore.player && getPlayingAreaComponent()}
      </div>
      <div className="player-area">
        <PlayerTasks player={gameStore.player} />
        <PlayerHand player={gameStore.player} />
        <CommunicatedCard player={gameStore.player} />
      </div>
    </div>
  );
});
