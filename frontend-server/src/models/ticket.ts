import { SmallUser } from "./User"

export enum Statuses {
    BACKLOG = "backlog",
    TODO = "todo",
    PROGRESS = "progress",
    BLOCKED = "blocked",
    DONE = "done",
  }

export type StatusesType =
  | Statuses.BACKLOG
  | Statuses.TODO
  | Statuses.PROGRESS
  | Statuses.TODO;

export interface Message {
    id: number
    created_at: string
    updated_at: string
    message: string
    ticket: number
    author: SmallUser,
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
    assigned_to?: SmallUser;
    type: TicketType;
    created_at: string;
    label: string;
    expiring_date: string;
    description: string;
    status: StatusesType;
  }