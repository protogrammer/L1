import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/forms/login/Login";
import Signup from "./pages/forms/signup/Signup";
import Profile from "./pages/profile/Profile";
import { getUsername } from "./storage";
import ChangePassword from "./pages/forms/change-password/ChangePassword";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={`/`}
          element={
            <Navigate
              to={((username) =>
                username !== null ? `/@${username}` : `/login`)(getUsername())}
            />
          }
        />
        <Route path={`/login`} element={<Login />} />
        <Route path={`/signup`} element={<Signup />} />
        <Route path={`/change-password`} element={<ChangePassword />} />
        <Route path={`/@:username`} element={<Profile />} />
        <Route
          path={"*"}
          element={
            <div style={{ color: "lightcyan" }}>
              <h1>ERROR 404</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
