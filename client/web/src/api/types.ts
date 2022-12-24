export enum ApiError {
  unknown = "unknown",
  invalidUsernameOrPassword = "invalidUsernameOrPassword",
  pathNotFound = "pathNotFound",
  noSessionId = "noSessionId",
  invalidSessionId = "invalidSessionId",
}

export const parseError = (obj: any): ApiError | null =>
  Object.values(ApiError).includes(obj["error"])
    ? ApiError[obj["error"] as ApiError]
    : null;

export enum Command {
  success = "success",
  deny = "deny",
  notFound = "notFound",
}

export type Data = any;

export const parseCommand = (obj: any): [Command, Data] | null =>
  Object.values(Command).includes(obj["command"])
    ? [Command[obj["command"] as Command], obj["data"]]
    : null;
