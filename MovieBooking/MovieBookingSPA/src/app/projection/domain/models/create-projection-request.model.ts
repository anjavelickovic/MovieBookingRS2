export interface ICreateProjectionRequest{
    movieId: string;
    movieTitle: string;
    runtime: string;
    theaterHallId: string;
    theaterHallName: string;
    projectionDate: string;
    projectionTerm: string;
    numberOfSeats: number;
    numberOfReservedSeats: number;
    price: number;
}