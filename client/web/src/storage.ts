import { CookieSessionDurationMs } from "./api/consts";

let cachedUserId: string | null | undefined = undefined;
let cachedUsername: string | null | undefined = undefined;
let cachedLastUpdate: number | null | undefined = undefined;

const lastUpdate = (): number | null => {
  if (cachedLastUpdate === undefined) {
    const stringLastUpdate = sessionStorage.getItem("lastUpdate");
    cachedLastUpdate =
      stringLastUpdate === null ? null : Number(stringLastUpdate);
  }
  return cachedLastUpdate;
};

const lastUpdateNow = (): void => {
  cachedLastUpdate = Date.now();
  sessionStorage.setItem("lastUpdate", String(cachedLastUpdate));
};

export const resetUserData = (): void => {
  sessionStorage.removeItem("lastUpdate");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userId");
  cachedLastUpdate = cachedUserId = cachedUsername = null;
};

export const getUsername = (): string | null => {
  if (cachedUsername === undefined) {
    cachedUsername = sessionStorage.getItem("username");
  }
  const upd = lastUpdate();
  if (
    cachedUsername !== null &&
    (upd === null || Date.now() - upd > CookieSessionDurationMs)
  ) {
    resetUserData();
  }
  return cachedUsername;
};

export const getUserId = (): string | null => {
  if (cachedUserId === undefined) {
    cachedUserId = sessionStorage.getItem("userId");
  }
  const upd = lastUpdate();
  if (
    cachedUserId !== null &&
    (upd === null || Date.now() - upd > CookieSessionDurationMs)
  ) {
    resetUserData();
  }
  return cachedUserId;
};

export const setUserData = (username: string, userId: string): void => {
  cachedUsername = username;
  sessionStorage.setItem("username", cachedUsername);
  cachedUserId = userId;
  sessionStorage.setItem("userId", cachedUserId);
  lastUpdateNow();
};
