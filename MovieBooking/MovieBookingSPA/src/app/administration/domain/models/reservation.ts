export interface IReservation{
    id:number,
    projectionId: string;
    projectionDate: string;
    projectionTerm: string;
    movieId: string;
    movieTitle: string;
    theaterHallName: string;
    theaterHallId: string;
    price: number;
    numberOfTickets: number;
}