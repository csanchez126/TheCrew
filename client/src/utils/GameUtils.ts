import { Game, Player } from "../models";

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.isTurn);
};
