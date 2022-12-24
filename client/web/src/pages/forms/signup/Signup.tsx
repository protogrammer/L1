import React, { useEffect, useState } from "react";
import InputUsername from "./components/InputUsername";
import StrictInputPassword from "./components/StrictInputPassword";
import { RemoveScroll } from "react-remove-scroll";
import ButtonList from "../shared/ButtonList";
import { keydownHandler, enterHandler } from "../shared/event-handlers";
import { useNavigate } from "react-router-dom";
import { usernameIsCorrect } from "../shared/username";
import { passwordIsWeak } from "../shared/password";
import { requestApi } from "../../../api/request-api";
import { onCommand } from "../shared/on-command";
import { Command } from "../../../api/types";

let usernameHistory: [string | null, string | null] = [null, null];

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  usernameHistory[1] = usernameHistory[0];
  usernameHistory[0] = username;

  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [alertText, setAlertText] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("keydown", keydownHandler, false);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, []);

  const [usernameTaken, setUsernameTaken] = useState<boolean | null>(null);
  const correct = usernameIsCorrect(username);

  useEffect(() => {
    if (correct && usernameHistory[0] !== usernameHistory[1]) {
      let cancel = false;
      setTimeout(
        () =>
          !cancel &&
          requestApi(
            "/api/username-taken/",
            {
              username: username,
            },
            "GET",
            (command, data) => {
              const dataAsBool = Boolean(data);
              if (command === Command.success && dataAsBool != null) {
                setUsernameTaken(dataAsBool);
              }
            }
          ),
        1000
      );
      return () => {
        cancel = true;
        setUsernameTaken(null);
      };
    }
  }, [username]);

  const onContinue = () => {
    if (!correct || usernameTaken !== false) {
      document.getElementById("username")?.focus();
      return;
    }

    if (passwordIsWeak(password)) {
      document.getElementById("strict-password")?.focus();
      return;
    }

    requestApi(
      "/api/new-user/",
      {
        password: password,
        username: username,
      },
      "POST",
      onCommand(navigate, setAlertText),
      (err) => {
        setAlertText("упс... произошла ошибка");
        console.log(`error: ${err}`);
        return true;
      }
    );
  };

  useEffect(() => {
    const handler = enterHandler(username, password, onContinue);

    window.addEventListener("keydown", handler, false);

    return () => window.removeEventListener("keydown", handler);
  }, [password, username]);

  const inputClass =
    !correct || usernameTaken === true
      ? "incorrect"
      : correct && usernameTaken === false
      ? "correct"
      : "unknown";

  return (
    <>
      {alertText !== null && <p className={`alert`}>{alertText}</p>}
      <RemoveScroll className={`remove-scroll`}>
        <h1>Регистрация</h1>
        <form>
          <InputUsername
            username={username}
            setUsername={setUsername}
            inputClass={inputClass}
          />
          <StrictInputPassword
            password={password}
            setPassword={setPassword}
            passwordVisibility={passwordVisibility}
            setPasswordVisibility={setPasswordVisibility}
          />
          <ButtonList
            to={`/login`}
            onContinue={(e) => {
              e.preventDefault();
              onContinue();
            }}
            back={"Ко входу"}
          />
        </form>
      </RemoveScroll>
    </>
  );
};

export default Signup;
