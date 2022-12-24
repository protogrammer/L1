import React from "react";
import "../../forms.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

type Props = {
  passwordVisibility: boolean;
  setPasswordVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

const InputPassword: React.FC<Props> = ({
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
        id={`password`}
        type={passwordVisibility ? `text` : `password`}
        placeholder={`Твой пароль`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordVisibility ? (
        <AiOutlineEyeInvisible
          className={`login-icon`}
          onClick={changePasswordVisibility}
        />
      ) : (
        <AiOutlineEye
          className={`login-icon`}
          onClick={changePasswordVisibility}
        />
      )}
    </div>
  );
};

export default InputPassword;
