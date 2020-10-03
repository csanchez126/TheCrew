import React, { useEffect, useLayoutEffect, useState } from "react";
import "./App.scss";
import { Communication } from "./components/Communication";
import { GameComponent } from "./components/GameComponent";
import { TaskSelection } from "./components/TaskSelection";
import { CardType, CommStatus, GameState, Suit } from "./enums";
import { Turn, Player, Card, Trick, Game, Task } from "./models";
import { GameStore } from "./store/GameStore";

let socket: SocketIOClient.Socket;
export const GameContext = React.createContext<GameStore>(null);

export default function App() {
  return (
    <GameContext.Provider value={new GameStore()}>
      <GameComponent />
    </GameContext.Provider>
  );
}
