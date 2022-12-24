import React from "react";
import "../../forms.css";
import { usernameFrom } from "../../shared/username";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const InputUsername: React.FC<Props> = ({ username, setUsername }) => {
  return (
    <input
      autoFocus
      id={`username`}
      type={`text`}
      placeholder={`Твой юзернейм`}
      value={username}
      onChange={(e) => {
        const newUsername = usernameFrom(e.target.value);
        if (newUsername !== null) setUsername(newUsername);
      }}
    />
  );
};

export default InputUsername;
