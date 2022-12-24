import React from "react";

type Props = {
  onContinue: React.MouseEventHandler<HTMLButtonElement>;
};

const ButtonContinue: React.FC<Props> = ({ onContinue }) => {
  return (
    <button type={`submit`} id={`continue`} onClick={onContinue}>
      Продолжить
    </button>
  );
};

export default ButtonContinue;
