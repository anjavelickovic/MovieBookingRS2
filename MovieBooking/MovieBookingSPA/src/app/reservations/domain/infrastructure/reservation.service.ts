import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState, IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { IReservationBasket } from '../models/reservation-basket.model';
import { IReservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly reservationUrl = "http://localhost:8001/api/v1/Reservations/";
  private readonly addReserv = "AddReservation/";
  private appState: IAppState;

  constructor(private http: HttpClient,
             private appStateService: AppStateService) { 
        this.appStateService.getAppState().subscribe(
            (appState: IAppState) => {
              this.appState = appState;
            }
        );
    }

  public addReservation(request: IReservation): Observable<IReservationBasket> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<IReservationBasket>(this.reservationUrl + this.addReserv + this.appState.username, body, {headers: headers});
  } 
}