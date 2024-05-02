export const TICKET_STATUSES: { [key: string]: string } = {
  BACKLOG: "backlog",
  TODO: "todo",
  PROGRESS: "progress",
  BLOCKED: "blocked",
  DONE: "done",
};

const RAW_GROUPS = [
  {
    key: 1,
    label: "Amministratore",
    label_key: "manager",
  },
  {
    key: 2,
    label: "Collaboratore",
    label_key: "employer",
  },
];

const [GROUPS, GROUPS_MAPS] = ((): [{ [key: string]: number }, { [key: number]: string }] => {
  const keysToNumbers: { [key: string]: number } = {};
  const numbersToLabels: { [key: number]: string } = {};

  RAW_GROUPS.forEach((e) => {
    keysToNumbers[e.label_key] = e.key;
    numbersToLabels[e.key] = e.label;
  });

  return [keysToNumbers, numbersToLabels];
})();
export { GROUPS, GROUPS_MAPS, RAW_GROUPS };


export enum UserTicketLabel {
  backlog = "Inviato",
  todo = "Inviato",
  progress = "In lavorazione",
  blocked = "Bloccato",
  done = "Completato",
}