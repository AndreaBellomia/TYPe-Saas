import { SmallUser } from "./User"



export interface Message {
    id: number
    created_at: string
    updated_at: string
    message: string
    ticket: number
    author: SmallUser,
}