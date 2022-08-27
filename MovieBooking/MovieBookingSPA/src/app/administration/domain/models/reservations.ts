import { IReservation } from "./reservation";

export interface IReservations {
    id : number,
    buyerUserName : string, 
    totalPrice : number,
    tickets : IReservation[]
}