import React from "react";
import "../forms.css";
import ButtonContinue from "./ButtonContinue";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  onContinue: React.MouseEventHandler<HTMLButtonElement>;
  back: string;
};

const ButtonList: React.FC<Props> = ({ to, onContinue, back }) => {
  return (
    <div className={`button-list`}>
      <Link to={to}>
        <button id={`back`}>{back}</button>
      </Link>
      <ButtonContinue onContinue={onContinue} />
    </div>
  );
};

export default ButtonList;
