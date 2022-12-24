export const MinPasswordLength = 8;
export const MinUniqueSymbolsInPassword = 5;

export const passwordIsStrong = (password: string): boolean =>
  password.length >= MinPasswordLength &&
  new Set(password).size >= MinUniqueSymbolsInPassword;

export const passwordIsWeak = (password: string): boolean =>
  !passwordIsStrong(password);
