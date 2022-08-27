import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationService } from '../infrastructure/reservation.service';
import { IReservationBasket } from '../models/reservation-basket.model';
import { IReservationCheckout } from '../models/reservation-checkout.model';
import { IReservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationFacadeService {
 
  constructor(private reservationService: ReservationService) { }

  public getReservations(): Observable<IReservationBasket>  { 
    return this.reservationService.getReservations();
  }

  public addReservation(projectionId: string,
                        projectionDate: string,
                        projectionTerm: string,
                        movieId: string,
                        movieTitle: string,
                        theaterHallName: string,
                        theaterHallId: string,
                        price: number,
                        numberOfTickets: number): Observable<IReservationBasket> {
    const request: IReservation = {projectionId,projectionDate,projectionTerm, movieId, movieTitle, theaterHallName, 
        theaterHallId, price, numberOfTickets};
        return this.reservationService.addReservation(request);
  }

  public updateReservation(projectionId: string,
                            projectionDate: string,
                            projectionTerm: string,
                            movieId: string,
                            movieTitle: string,
                            theaterHallName: string,
                            theaterHallId: string,
                            price: number,
                            numberOfTickets: number): Observable<IReservationBasket> {
        const request: IReservation = {projectionId, projectionDate, projectionTerm, movieId, movieTitle, 
            theaterHallName, theaterHallId, price, numberOfTickets};
        return this.reservationService.updateReservation(request);
    }

    public deleteReservation(projectionId: string,
        projectionDate: string,
        projectionTerm: string,
        movieId: string,
        movieTitle: string,
        theaterHallName: string,
        theaterHallId: string,
        price: number,
        numberOfTickets: number): Observable<any> {
        
        const request: IReservation = {projectionId, projectionDate, projectionTerm, movieId, movieTitle, 
        theaterHallName, theaterHallId, price, numberOfTickets};
        return this.reservationService.deleteReservation(request);
    }

    public deleteReservations(): Observable<any> {
      return this.reservationService.deleteReservations();
    }

    public checkout(tickets: IReservation[],
                    areaCode: string,
                    number: string): Observable<any>{
      return this.reservationService.checkout(tickets, areaCode, number);
    }

}