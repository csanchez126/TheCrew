import React from "react";
import { CardType, Suit } from "../enums";
import { Card } from "../models/Card";

interface CardProps {
  card: Card;
  cardType?: CardType;
  disabled?: boolean;
  offset?: number;
  onClick?: (card: Card) => void;
}

export const CardComponent = (props: CardProps) => {
  const card: Card = props.card;

  const getCardColorClass = (suit: Suit) => {
    switch (suit) {
      case Suit.Rocket:
        return "rocket";
      case Suit.Blue:
        return "blue";
      case Suit.Yellow:
        return "yellow";
      case Suit.Pink:
        return "pink";
      case Suit.Green:
        return "green";
    }
  };

  const getCardTypeClass = () => {
    switch (props.cardType) {
      case CardType.Task:
        return "task";
      case CardType.Trick:
        return "trick";
      case CardType.Hand:
      default:
        return "card";
    }
  };

  const onCardClick = () => {
    if (!props.disabled && props.onClick) {
      props.onClick(card);
    }
  };

  return (
    <div
      onClick={onCardClick}
      className={`${getCardTypeClass()} ${getCardColorClass(card.suit)} ${
        props.disabled ? "disabled" : ""
      }`}
      style={{ marginLeft: props.offset || 0 }}
    >
      {props.cardType === CardType.Hand && (
        <div className="small-value">
          <p>
            {card.value}
            {card.suit === Suit.Rocket && "🚀"}
          </p>
          <p>
            {card.suit === Suit.Rocket && "🚀"}
            {card.value}
          </p>
        </div>
      )}
      <div className="big-value">
        <p>{card.value}</p>
      </div>
      {props.cardType === CardType.Hand && (
        <div className="small-value">
          <p>
            {card.value}
            {card.suit === Suit.Rocket && "🚀"}
          </p>
          <p>
            {card.suit === Suit.Rocket && "🚀"}
            {card.value}
          </p>
        </div>
      )}
    </div>
  );
};
