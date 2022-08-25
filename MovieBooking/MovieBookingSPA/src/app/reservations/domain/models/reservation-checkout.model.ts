import { IReservation } from "./reservation.model";

export interface IReservationCheckout{
    buyerUsername: string;
    email: string;
    tickets: IReservation[];
    areaCode: string;
    number: string;
}