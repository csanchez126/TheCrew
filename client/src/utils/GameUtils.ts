import { CommStatus, Suit } from "../enums";
import { Card, Game, Player } from "../models";

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.isTurn);
};

export const getPlayerName = (game: Game, playerID: string): string => {
  const player = game.players.find((p) => p.socketID === playerID);

  return player ? player.name : "Unnamed";
};

export const getOtherPlayers = (game: Game, playerID: string): Player[] => {
  return game.players.filter((p) => p.socketID !== playerID);
};

export const getCardsToCommunicate = (hand: Card[]): Card[] => {
  let cardsToComm: Card[] = [];
  const suitInts = Object.values(Suit).filter((val) => !isNaN(val as any));
  console.log(suitInts);
  suitInts
    .filter((suit) => suit !== Suit.Rocket)
    .forEach((suit) => {
      //For each colored suit, get unique card or highest and lowest
      const suitedCards = hand
        .map((c) => ({ ...c })) //Clone hand array to avoid modifying actual hand
        .filter((card) => card.suit === suit) //Process 1 suit at a time
        .sort((cardA, cardB) => cardA.value - cardB.value); //Sort so indexed values are reliable

      if (suitedCards.length === 1) {
        suitedCards[0].commStatus = CommStatus.Only;
        cardsToComm.push(suitedCards[0]);
      } else if (suitedCards.length > 1) {
        suitedCards[0].commStatus = CommStatus.Lowest;
        suitedCards[suitedCards.length - 1].commStatus = CommStatus.Highest;
        cardsToComm.push(suitedCards[0], suitedCards[suitedCards.length - 1]);
      }
    });

  return cardsToComm;
};
