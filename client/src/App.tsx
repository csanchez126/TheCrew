import React, { useEffect, useLayoutEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.scss";
import { CardComponent } from "./components/Card";
import { CardType, GameState, Suit } from "./enums";
import { Turn, Player, Card, Trick, Game, Task } from "./models";
const ENDPOINT = "localhost:4001";

let socket: SocketIOClient.Socket;
const GameContext = React.createContext<Game>({} as Game);

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
      setPlayer(game.players.find((p) => p.name === socket.id));
    });

    socket.on("updateGameState", (game: Game) => {
      setMessage("updateGameState");
      setGame(game);
      setPlayer(game.players.find((p) => p.name === socket.id));
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
    if (player != null) {
      const turn = new Turn(player.name, card);
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

  const selectTask = (card: Card) => {
    if (player != null) {
      const turn = new Turn(player.name, card);
      console.log(turn);
      socket.emit("select task", turn);
    }
  };

  return (
    <GameContext.Provider value={game}>
      <div className="app-container">
        <div className="controls">
          <p>{player?.name}</p>
          <p>{message}</p>
          {player?.isCommander && <p>You are the commander</p>}
        </div>
        <div className="trick-container">
          {game.trick?.cards.map((card: Card) => (
            <CardComponent
              disabled={false}
              cardType={CardType.Trick}
              card={card}
            />
          ))}
        </div>
        <div className="trick-container">
          <p>My Tasks</p>
          {player?.tasks.map((card: Task) => (
            <CardComponent
              disabled={false}
              cardType={CardType.Task}
              card={card}
            />
          ))}
        </div>
        <div className={"player-area"}>
          <div className="tasks"></div>
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
