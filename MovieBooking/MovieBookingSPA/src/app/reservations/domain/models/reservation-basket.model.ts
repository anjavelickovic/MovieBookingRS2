import { IReservation } from "./reservation.model";

export interface IReservationBasket{
    username: string;
    reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
    totalPrice: number;
}