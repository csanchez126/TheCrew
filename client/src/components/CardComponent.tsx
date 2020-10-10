import React from "react";
import { CardType, CommStatus, Suit } from "../enums";
import { Card } from "../models/Card";
import commTokenGreen from "../img/commTokenGreen.png";
import "../css/CardComponent.scss";
import { spawn } from "child_process";
interface CardProps {
  card: Card;
  cardType?: CardType;
  class?: string;
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
      case CardType.Communication:
        return "communication";
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

  const cardHeaderFooter = (showCommtoken: boolean) =>
    (props.cardType === CardType.Hand ||
      props.cardType === CardType.Communication) && (
      <div className="small-value">
        <p>
          {card.value}
          {card.suit === Suit.Rocket && (
            <span className="rocket-emoji">🚀</span>
          )}
        </p>
        {showCommtoken && props.cardType === CardType.Communication && (
          <div className="comm-token--high-low">
            <img src={commTokenGreen} alt="" />
          </div>
        )}
        <p>
          {card.suit === Suit.Rocket && (
            <span className="rocket-emoji">🚀</span>
          )}
          {card.value}
        </p>
      </div>
    );

  return (
    <div
      onClick={onCardClick}
      className={`${getCardTypeClass()} 
        ${getCardColorClass(card.suit)} 
        ${props.disabled ? "disabled" : ""} 
        ${props.class ? props.class : ""}
        ${card.commStatus !== CommStatus.None ? "communicated" : ""}`}
      style={{ marginLeft: props.offset || 0 }}
    >
      {cardHeaderFooter(card.commStatus === CommStatus.Highest)}
      <div className="big-value">
        <p>{card.value}</p>
        {props.cardType === CardType.Communication &&
          card.commStatus === CommStatus.Only && (
            <div className="comm-token">
              <img src={commTokenGreen} alt="" />
            </div>
          )}
      </div>

      {cardHeaderFooter(card.commStatus === CommStatus.Lowest)}
    </div>
  );
};
