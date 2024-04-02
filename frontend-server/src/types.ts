

export enum Statuses {
    BACKLOG = "backlog",
    TODO = "todo",
    PROGRESS = "progress",
    BLOCKED = "blocked",
    DONE = "done",
}

type EnumValues<T extends Record<string, string>> = T[keyof T];
export type StatusesType = Statuses.BACKLOG | Statuses.TODO | Statuses.PROGRESS | Statuses.TODO

export interface SmallUser {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
}
export interface TicketType {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string | null;
}


export interface Ticket {
    id: number;
    assigned_to?: SmallUser
    type: TicketType
    created_at: string
    label: string
    expiring_date: string
    description: string
    status: StatusesType
}