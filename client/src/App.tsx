import React from "react";
import { GameComponent } from "./components/GameComponent";
import { GameStore } from "./store/GameStore";

export const GameContext = React.createContext<GameStore>(null);

export default function App() {
  return (
    <GameContext.Provider value={new GameStore()}>
      <GameComponent />
    </GameContext.Provider>
  );
}
