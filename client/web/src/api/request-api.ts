import { ApiError, Command, Data, parseCommand, parseError } from "./types";

export type Params = {
  username?: string;
  password?: string;
  newPassword?: string;
  userId?: string;
};

export const requestApi = (
  relPath: string,
  params: Params = {},
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE" = "POST",
  onCommand: (command: Command, data: Data) => void = () => {},
  onError: (err: ApiError) => boolean = () => false,
  onReject: (reject: any) => boolean = () => false
): void => {
  let flag = false;
  for (const [name, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (flag) {
      relPath += "&";
    } else {
      relPath += "?";
      flag = true;
    }
    relPath += `${name}=${value}`;
  }

  console.log(`[types.request] relPath: ${relPath}`);

  fetch(relPath, {
    method: method,
  })
    .then((data) => data.json())
    .then((obj) => {
      const command = parseCommand(obj);
      const err = parseError(obj);

      if (command !== null && err !== null)
        console.warn(
          `[types.request] object contains both command and error: ${obj}`
        );

      if (command === null && err === null)
        console.warn(
          `[types.request] object contains neither command nor error: ${obj}`
        );

      if (command !== null) onCommand(...command);
      if (err !== null) {
        if (onError(err)) return;
        console.log(`[types.request] uncaught error: ${err}`);
        window.alert(`Упсс... Кажется, произошла ошибка`);
      }
    })
    .catch((e) => {
      if (onReject(e)) return;
      console.error(`[types.request] catch: ${e}`);
      window.alert(`Упсс... Кажется, произошла ошибка`);
    });
};
