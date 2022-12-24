import React, { useEffect, useState } from "react";
import InputUsername from "./components/InputUsername";
import InputPassword from "./components/InputPassword";
import { RemoveScroll } from "react-remove-scroll";
import "../forms.css";
import ButtonList from "../shared/ButtonList";
import { keydownHandler, enterHandler } from "../shared/event-handlers";
import { ApiError } from "../../../api/types";
import { requestApi } from "../../../api/request-api";
import { useNavigate } from "react-router-dom";
import { usernameIsCorrect } from "../shared/username";
import { onCommand } from "../shared/on-command";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [alertText, setAlertText] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler, false);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  const onContinue = () => {
    if (!usernameIsCorrect(username)) {
      document.getElementById("username")?.focus();
      return;
    }

    if (password.length === 0) {
      document.getElementById("password")?.focus();
      return;
    }

    requestApi(
      "/api/login/",
      {
        username: username,
        password: password,
      },
      "POST",
      onCommand(navigate, setAlertText, false),
      (err) => {
        if (err == ApiError.invalidUsernameOrPassword) {
          setAlertText("некорректный пароль или юзернейм");
        } else {
          setAlertText("упс... произошла ошибка");
          console.log(`error: ${err}`);
        }
        return true;
      }
    );
  };

  useEffect(() => {
    const handler = enterHandler(username, password, onContinue);
    window.addEventListener("keydown", handler, false);

    return () => window.removeEventListener("keydown", handler);
  }, [password, username]);

  return (
    <>
      {alertText !== null && <p className={`alert`}>{alertText}</p>}
      <RemoveScroll className={`remove-scroll`}>
        <h1>Вход</h1>
        <form>
          <InputUsername username={username} setUsername={setUsername} />
          <InputPassword
            password={password}
            setPassword={setPassword}
            passwordVisibility={passwordVisibility}
            setPasswordVisibility={setPasswordVisibility}
          />
          <ButtonList
            to={`/signup`}
            onContinue={(e) => {
              e.preventDefault();
              onContinue();
            }}
            back={"Регистрация"}
          />
        </form>
      </RemoveScroll>
    </>
  );
};

export default Login;
