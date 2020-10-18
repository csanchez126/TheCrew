import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import "../css/TokenButton.scss";
import { TaskPriority } from "../enums";
import {
  taskPriorityOne,
  taskPriorityTwo,
  taskPriorityThree,
  taskPriorityFour,
  taskPriorityFive,
  taskPriorityOneRel,
  taskPriorityTwoRel,
  taskPriorityThreeRel,
  taskPriorityFourRel,
  taskPriorityOmega,
} from "../img";

interface Props {
  onClick: (enabled: boolean, taskPriority: TaskPriority) => void;
  disabled: boolean;
  taskPriority: TaskPriority;
}
export const TokenButton = observer((props: Props) => {
  const getImg = () => {
    switch (props.taskPriority) {
      case TaskPriority.Omega:
        return taskPriorityOmega;
      case TaskPriority.First:
        return taskPriorityOne;
      case TaskPriority.Second:
        return taskPriorityTwo;
      case TaskPriority.Third:
        return taskPriorityThree;
      case TaskPriority.Fourth:
        return taskPriorityFour;
      case TaskPriority.Fifth:
        return taskPriorityFive;
      case TaskPriority.OneRelative:
        return taskPriorityOneRel;
      case TaskPriority.TwoRelative:
        return taskPriorityTwoRel;
      case TaskPriority.ThreeRelative:
        return taskPriorityThreeRel;
      case TaskPriority.FourRelative:
        return taskPriorityFourRel;
    }
  };

  const clickHandler = () => {
    console.log(!props.disabled);
    props.onClick(!props.disabled, props.taskPriority);
  };

  return (
    <div className="token-button-container" onClick={clickHandler}>
      <img src={getImg()} className={props.disabled ? "disabled" : ""} />
    </div>
  );
});

// Omega,
// First,
// Second,
// Third,
// Fourth,
// Fifth,
// OneRelative,
// TwoRelative,
// ThreeRelative,
// FourRelative,
