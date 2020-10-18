import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { GameContext } from "../App";
import "../css/MissionSetup.scss";
import { TaskPriority } from "../enums";
import { TokenButton } from "./TokenButton";

export const MissionSetup = observer(() => {
  const gameStore = React.useContext(GameContext);
  const { player, game } = gameStore;

  if (player) {
    const { game, missionSetupStore } = gameStore;
    return (
      <div className="mission-setup-container">
        <div className="header">
          <h1>Mission Setup</h1>
        </div>
        <div className="task-count">
          <input
            type="range"
            min="1"
            max="10"
            value={missionSetupStore.taskCount}
            onChange={missionSetupStore.taskCountChange}
          />
          <h4>Task Count: {missionSetupStore.taskCount}</h4>
        </div>
        <div className="task-order">
          {missionSetupStore.tokens.slice(0, 5).map((t) => (
            <TokenButton
              onClick={missionSetupStore.toggleToken}
              disabled={t.disabled}
              taskPriority={t.taskPriority}
            />
          ))}
        </div>
        <div className="task-relative-order">
          {missionSetupStore.tokens.slice(5).map((t) => (
            <TokenButton
              onClick={missionSetupStore.toggleToken}
              disabled={t.disabled}
              taskPriority={t.taskPriority}
            />
          ))}
        </div>
        <input
          type="button"
          name="player-ready"
          onClick={missionSetupStore.startMission}
          value="Start Mission"
        />
      </div>
    );
  }
  return null;
});
