import React from "react";
import "../../forms.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { passwordIsStrong } from "../../shared/password";

type Props = {
  passwordVisibility: boolean;
  setPasswordVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

const StrictInputPassword: React.FC<Props> = ({
  passwordVisibility,
  setPasswordVisibility,
  password,
  setPassword,
}) => {
  const changePasswordVisibility = () =>
    setPasswordVisibility(!passwordVisibility);

  return (
    <div>
      <input
        className={passwordIsStrong(password) ? "correct" : "incorrect"}
        id={`strict-password`}
        type={passwordVisibility ? `text` : `password`}
        placeholder={`Придумай пароль`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordVisibility ? (
        <AiOutlineEyeInvisible
          className={`signup-icon`}
          onClick={changePasswordVisibility}
        />
      ) : (
        <AiOutlineEye
          className={`signup-icon`}
          onClick={changePasswordVisibility}
        />
      )}
    </div>
  );
};

export default StrictInputPassword;
