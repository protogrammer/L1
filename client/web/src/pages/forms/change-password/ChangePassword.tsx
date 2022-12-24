import React, { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { getUserId, getUsername } from "../../../storage";
import { useNavigate } from "react-router-dom";
import "../forms.css";
import InputPassword from "../login/components/InputPassword";
import StrictInputPassword from "../signup/components/StrictInputPassword";
import ButtonList from "../shared/ButtonList";
import { passwordIsWeak } from "../shared/password";
import { requestApi } from "../../../api/request-api";
import { onCommand } from "../shared/on-command";

const ChangePassword: React.FC = () => {
  const username = getUsername();
  const userId = getUserId();
  const navigate = useNavigate();

  const [oldPasswordVisibility, setOldPasswordVisibility] =
    useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");

  const [newPasswordVisibility, setNewPasswordVisibility] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");

  const [alertText, setAlertText] = useState<string | null>(null);

  if (username === null || userId === null) {
    return (
      <RemoveScroll className={`remove-scroll`}>
        <h1>Перед тем, как сменить пароль, необходимо войти</h1>
        <div className={`button-list`} style={{ justifyContent: "center" }}>
          <button type={"button"} onClick={() => navigate("/login")}>
            Ко входу
          </button>
          <button type={"button"} onClick={() => navigate("/signup")}>
            К регистрации
          </button>
        </div>
      </RemoveScroll>
    );
  }

  const onContinue = () => {
    if (passwordIsWeak(newPassword)) {
      document.getElementById("strict-password")?.focus();
      return;
    }

    console.log(userId, oldPassword, newPassword);

    requestApi(
      "/api/change-password/",
      {
        userId: userId,
        password: oldPassword,
        newPassword: newPassword,
      },
      "POST",
      onCommand(navigate, setAlertText, false),
      (err) => {
        setAlertText("упс... произошла ошибка");
        console.log(`error: ${err}`);
        return true;
      }
    );
  };

  return (
    <>
      {alertText !== null && <p className={`alert`}>{alertText}</p>}
      <RemoveScroll className={`remove-scroll`}>
        <h1>@{username}</h1>
        <form>
          <InputPassword
            password={oldPassword}
            setPassword={setOldPassword}
            setPasswordVisibility={setOldPasswordVisibility}
            passwordVisibility={oldPasswordVisibility}
          />
          <StrictInputPassword
            password={newPassword}
            setPassword={setNewPassword}
            passwordVisibility={newPasswordVisibility}
            setPasswordVisibility={setNewPasswordVisibility}
          />
          <ButtonList
            to={"/"}
            back={"Вернуться"}
            onContinue={(e) => {
              e.preventDefault();
              onContinue();
            }}
          />
        </form>
      </RemoveScroll>
    </>
  );
};

export default ChangePassword;
