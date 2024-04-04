export const TICKET_STATUSES: { [key: string]: string } = {
  BACKLOG: "backlog",
  TODO: "todo",
  PROGRESS: "progress",
  BLOCKED: "blocked",
  DONE: "done",
};

export const GROUPS: { [key: string]: number } = {
  manager: 1,
  employer: 2,
};

export const GROUPS_MAPS: { [key: number]: string } = {
  1: "Manager",
  2: "Impiegato"
}
