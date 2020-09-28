import React, { useEffect, useLayoutEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.scss";
import { CardComponent } from "./components/CardComponent";
import { Communication } from "./components/Communication";
import { PlayerTasks } from "./components/PlayerTasks";
import { TaskSelection } from "./components/TaskSelection";
import { CardType, CommStatus, GameState, Suit } from "./enums";
import { Turn, Player, Card, Trick, Game, Task } from "./models";
const ENDPOINT = "localhost:4001";

let socket: SocketIOClient.Socket;
export const GameContext = React.createContext<{
  game: Game;
  socket: SocketIOClient.Socket;
}>({ game: {} as Game, socket: {} as SocketIOClient.Socket });

export default function App() {
  const [message, setMessage] = useState("");
  const [player, setPlayer] = useState<Player>();
  const [game, setGame] = useState<Game>({} as Game);
  const [handContainerWidth, setHandContainerWidth] = React.useState(0);

  useEffect(() => {
    socket = socketIOClient(ENDPOINT);
    socket.on("new player", (res: any) => {
      setMessage(res.message);
    });

    socket.on("kill game", (res: any) => {
      setMessage(res.message);
    });

    socket.on("game created", (game: Game) => {
      console.log(game);
      setMessage("updateGameState");
      setGame(game);
      setPlayer(game.players.find((p) => p.socketID === socket.id));
    });

    socket.on("updateGameState", (game: Game) => {
      setMessage("updateGameState");
      setGame(game);
      setPlayer(game.players.find((p) => p.socketID === socket.id));
    });

    updateHandSpread();
    return () => {
      socket.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", updateHandSpread);
    return () => {
      window.removeEventListener("resize", updateHandSpread);
    };
  }, [window.innerWidth]);

  const playTurn = (card: Card) => {
    if (player != null && game.state === GameState.TrickOngoing) {
      const turn = new Turn(player.socketID, card);
      console.log(turn);
      socket.emit("play turn", turn);
    }
  };

  const updateHandSpread = () => {
    const handDivWidth = (document.getElementById(
      "hand-container"
    ) as HTMLDivElement)?.offsetWidth;
    setHandContainerWidth(handDivWidth);
  };

  const getPlayingAreaComponent = (): any => {
    switch (game.state) {
      case GameState.MissionStart:
        return;
      case GameState.TaskSelection:
        return <TaskSelection player={player} />;
      case GameState.TrickSetup:
        return <Communication player={player} />;
      case GameState.TrickOngoing:
      case GameState.TrickEnd:
      case GameState.MissionFailed:
        return null;
    }
  };

  return (
    <GameContext.Provider value={{ game, socket }}>
      <div className="app-container">
        <div className="controls">
          <div className="info">
            <p>
              <span className="label">Player/Socket ID:</span> {player?.name}
            </p>
            <p>
              <span className="label">Game Message: </span> {message}
            </p>
            <p>
              <span className="label">Game State: </span>
              {GameState[game.state]}
            </p>
          </div>
          {player?.isCommander && <p>You are the commander</p>}
        </div>
        <div className="playing-field">
          {player != null && getPlayingAreaComponent()}
        </div>

        <div className={"player-area"}>
          <div className="player-tasks">
            <PlayerTasks player={player} />
          </div>
          <div id="hand-container">
            {player?.hand.map((card: Card, i: number, cards: Card[]) => (
              <CardComponent
                cardType={CardType.Hand}
                disabled={
                  !player.isTurn ||
                  (game.trick.suit !== null &&
                    card.suit !== Suit.Rocket &&
                    card.suit !== game.trick.suit)
                }
                card={card}
                onClick={playTurn}
                offset={
                  i > 0
                    ? (handContainerWidth - 138) / (player?.hand.length - 1) -
                      138
                    : 0
                }
              />
            ))}
          </div>
          <div className="communicated-card"></div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
