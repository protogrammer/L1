import React, { useState } from "react";
import "../../forms.css";
import { usernameFrom, usernameIsCorrect } from "../../shared/username";
import { requestApi } from "../../../../api/request-api";
import { Command } from "../../../../api/types";

type Props = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  inputClass: string;
};

const InputUsername: React.FC<Props> = ({
  username,
  setUsername,
  inputClass,
}) => (
  <input
    autoFocus
    className={inputClass}
    id={`username`}
    type={`text`}
    placeholder={`Придумай юзернейм`}
    value={username}
    onChange={(e) => {
      const newUsername = usernameFrom(e.target.value);
      if (newUsername !== null) setUsername(newUsername);
    }}
  />
);

export default InputUsername;
