import React, { useEffect, useLayoutEffect } from "react";
import { GameContext } from "../App";
import { CardType, GameState, Suit } from "../enums";
import { Card, Player, Turn } from "../models";
import { CardComponent } from "./CardComponent";
import "../css/PlayerHand.scss";
interface Props {
  player: Player;
}
export const PlayerHand = (props: Props) => {
  const { player } = props;

  const gameStore = React.useContext(GameContext);
  // const { player } = gameStore;
  const [handDivWidth, setHandDivWidth] = React.useState(0);

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
    if (player != null && gameStore.game.state === GameState.TrickOngoing) {
      const turn = new Turn(player.socketID, card);
      gameStore.socket.emit("play turn", turn);
    }
  };

  const updateHandSpread = () => {
    const handDivWidth = (document.getElementById(
      "hand-container"
    ) as HTMLDivElement)?.offsetWidth;
    setHandDivWidth(handDivWidth);
  };

  const getCardOffset = (i: number) => {
    let offset = 0;
    const CARD_WIDTH = 105;
    if (i > 0 && player) {
      const handLength = player.hand.length;
      offset = (handDivWidth - CARD_WIDTH) / (handLength - 1) - CARD_WIDTH;
    }
    return offset;
  };

  const isCardDisabled = (card: Card) => {
    let isDisabled = false;
    if (player) {
      isDisabled =
        !gameStore.player.isTurn ||
        (gameStore.game.trick.suit !== null &&
          card.suit !== Suit.Rocket &&
          card.suit !== gameStore.game.trick.suit);
    }
    return isDisabled;
  };

  return (
    <div id="hand-container">
      {player &&
        player.hand.map((card: Card, i: number, cards: Card[]) => (
          <CardComponent
            class="hand-card"
            cardType={CardType.Hand}
            disabled={isCardDisabled(card)}
            card={card}
            onClick={playTurn}
            offset={getCardOffset(i)}
          />
        ))}
    </div>
  );
};
