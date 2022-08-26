import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReservations } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  private readonly administrationUrl = "http://localhost:8007/api/v1/Reservation/";

  constructor(private httpClient : HttpClient) { }

  public getReservationByUsername(username : string) : Observable<IReservations[]>{
    console.log(username);
    return this.httpClient.get<IReservations[]>(this.administrationUrl + username);
  }
}
