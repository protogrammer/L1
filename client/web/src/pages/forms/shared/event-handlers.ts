export const keydownHandler = (event: KeyboardEvent) => {
  if (!document.activeElement) return;

  const id: string = document.activeElement.id;

  const code = event.code;

  let nextId: string | null = null;

  if (id === "username" && code === "ArrowDown") nextId = "password";
  else if (id === "password") {
    if (code === "ArrowUp") nextId = "username";
    else if (code === "ArrowDown") nextId = "continue";
  } else if (id === "back") {
    if (["ArrowLeft", "ArrowUp"].includes(code)) nextId = "password";
    else if (code === "ArrowRight") nextId = "continue";
  } else if (id === "continue") {
    if (code === "ArrowLeft") nextId = "back";
    else if (code === "ArrowUp") nextId = "password";
  }

  if (nextId === null) return;

  if (nextId === "password") {
    document.getElementById("strict-password")?.focus();
  }

  document.getElementById(nextId)?.focus();
};

export const enterHandler =
  (username: string, password: string, onEnter: () => void) =>
  (event: KeyboardEvent) => {
    if (event.code !== "Enter") return;
    if (document.activeElement && document.activeElement.id === "back") return;

    event.preventDefault();

    onEnter();
  };
