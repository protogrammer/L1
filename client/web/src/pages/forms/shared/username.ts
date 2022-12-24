export const MinUsernameLength = 5;
export const MaxUsernameLength = 30;

const okFirstDigit = (c: string): boolean =>
  ("a" <= c && c <= "z") || c === "." || c === "_";

const ok = (c: string): boolean => okFirstDigit(c) || ("0" <= c && c <= "9");

export const usernameFrom = (s: string): string | null => {
  const lower = s.toLowerCase();
  if (
    lower.length <= MaxUsernameLength &&
    (lower.length === 0 ||
      (okFirstDigit(lower[0]) && Array.from(lower).every(ok)))
  )
    return lower;
  return null;
};

export const usernameIsCorrect = (username: string): boolean => {
  if (usernameFrom(username) === null) return false;
  return (
    MinUsernameLength <= username.length && username.length <= MaxUsernameLength
  );
};
