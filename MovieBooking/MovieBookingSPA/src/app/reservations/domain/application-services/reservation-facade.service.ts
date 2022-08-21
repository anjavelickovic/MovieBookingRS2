import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationService } from '../infrastructure/reservation.service';
import { IReservationBasket } from '../models/reservation-basket.model';
import { IReservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationFacadeService {
 
  constructor(private reservationService: ReservationService) { }

  public addReservation(projectionId: string,
                        movieId: string,
                        movieTitle: string,
                        theaterHallName: string,
                        theaterHallId: string,
                        price: number,
                        numberOfTickets: number): Observable<IReservationBasket> {
    const request: IReservation = {projectionId, movieId, movieTitle, theaterHallName, 
        theaterHallId, price, numberOfTickets};
        return this.reservationService.addReservation(request);
  }
}