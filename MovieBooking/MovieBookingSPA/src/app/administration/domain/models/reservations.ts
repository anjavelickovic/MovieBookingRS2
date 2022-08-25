import { IReservation } from "./reservation";

export interface IReservations {
    id : number,
    buyerId : string,
    buyerUserName : string, 
    totalPrice : number,
    tickets : IReservation[]

    areaCode : string,
    number : string
}