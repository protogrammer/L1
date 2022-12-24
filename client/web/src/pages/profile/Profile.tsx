import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { requestApi } from "../../api/request-api";
import { usernameIsCorrect } from "../forms/shared/username";
import { Command } from "../../api/types";
import { getUsername, resetUserData } from "../../storage";
import "./profile.css";

const loading = "Загрузка...";

const Profile: React.FC = () => {
  const params = useParams();
  const username = typeof params.username === "string" ? params.username : null;
  const [text, setText] = useState(loading);

  if (text === loading) {
    if (username != null && usernameIsCorrect(username)) {
      requestApi(
        "/api/username-taken/",
        {
          username: username,
        },
        "GET",
        (command, data) => {
          if (
            command === Command.success &&
            typeof data === "boolean" &&
            data
          ) {
            setText(username);
          } else {
            setText("Пользователь не найден");
          }
        }
      );
    } else {
      setText("Пользователь не найден");
    }
  }

  const navigate = useNavigate();

  const logout = () => {
    resetUserData();
    navigate("/login");
  };

  return (
    <div>
      <h1>{text}</h1>
      {text === getUsername() && (
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            marginRight: "25%",
            marginLeft: "25%",
          }}
        >
          <button
            type={"button"}
            onClick={(e) => {
              e.preventDefault();
              requestApi("/api/logout/", {}, "POST", logout, () => {
                logout();
                return true;
              });
            }}
          >
            Выход
          </button>
          <button
            type={"button"}
            onClick={(e) => {
              e.preventDefault();
              navigate("/change-password");
            }}
          >
            Изменить пароль
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
