import React, { useEffect, useLayoutEffect, useState } from "react";
import { GameContext } from "../App";
import "../App.scss";
import { CardComponent } from "./CardComponent";
import { CommunicatedCard } from "./CommunicatedCard";
import { Communication } from "./Communication";
import { PlayerTasks } from "./PlayerTasks";
import { TaskSelection } from "./TaskSelection";
import { CardType, CommStatus, GameState, Suit } from "../enums";
import { Turn, Player, Card, Trick, Game, Task } from "../models";
import { observer } from "mobx-react-lite";

export const GameComponent = observer(() => {
  const gameStore = React.useContext(GameContext);
  const [handContainerWidth, setHandContainerWidth] = React.useState(0);

  useEffect(() => {
    updateHandSpread();
    return () => {
      gameStore.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", updateHandSpread);
    return () => {
      window.removeEventListener("resize", updateHandSpread);
    };
  }, [window.innerWidth]);

  const playTurn = (card: Card) => {
    if (
      gameStore.player != null &&
      gameStore.game.state === GameState.TrickOngoing
    ) {
      const turn = new Turn(gameStore.player.socketID, card);
      console.log(turn);
      gameStore.socket.emit("play turn", turn);
    }
  };

  const updateHandSpread = () => {
    const handDivWidth = (document.getElementById(
      "hand-container"
    ) as HTMLDivElement)?.offsetWidth;
    setHandContainerWidth(handDivWidth);
  };

  const getPlayingAreaComponent = (): any => {
    switch (gameStore.game.state) {
      case GameState.MissionStart:
        return;
      case GameState.TaskSelection:
        return <TaskSelection />;
      case GameState.TrickSetup:
        return <Communication />;
      case GameState.TrickOngoing:
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
            <span className="label">Player/Socket ID:</span>{" "}
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
        {gameStore.player != null && getPlayingAreaComponent()}
      </div>

      <div className={"player-area"}>
        <div className="player-tasks">
          <PlayerTasks tasks={gameStore.player?.tasks} />
        </div>
        <div id="hand-container">
          {gameStore.player?.hand.map(
            (card: Card, i: number, cards: Card[]) => (
              <CardComponent
                class="hand-card"
                cardType={CardType.Hand}
                disabled={
                  !gameStore.player.isTurn ||
                  (gameStore.game.trick.suit !== null &&
                    card.suit !== Suit.Rocket &&
                    card.suit !== gameStore.game.trick.suit)
                }
                card={card}
                onClick={playTurn}
                offset={
                  i > 0
                    ? (handContainerWidth - 138) /
                        (gameStore.player?.hand.length - 1) -
                      138
                    : 0
                }
              />
            )
          )}
        </div>
        <div className="communicated-card">
          <CommunicatedCard player={gameStore.player} />
        </div>
      </div>
    </div>
  );
});
