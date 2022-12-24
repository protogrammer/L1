import React from "react";
import { Command, Data } from "../../../api/types";
import { NavigateFunction } from "react-router-dom";
import { setUserData } from "../../../storage";

export const onCommand =
  (
    navigate: NavigateFunction,
    setAlertText: React.Dispatch<React.SetStateAction<string | null>>,
    notFoundIsError: boolean = true
  ) =>
  (command: Command, data: Data) => {
    if (command === Command.success) {
      if (data.userId == null || data.username == null) {
        setAlertText("неизвестная ошибка");
        console.log(data.userId, data.username);
        return;
      }
      setUserData(data.username, data.userId);
      navigate(`/@${data.username}`);
      return;
    }

    if (!notFoundIsError && command === Command.notFound) {
      setAlertText("неверный пароль или юзернейм");
      return;
    }

    setAlertText("упс... произошла ошибка");
    console.log(command);
  };
