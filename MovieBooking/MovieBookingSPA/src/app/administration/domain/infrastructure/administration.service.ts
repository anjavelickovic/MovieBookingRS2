import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReservations } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  private readonly administrationUrl = "http://localhost:8007/api/v1/Administration/";

  constructor(private httpClient : HttpClient) { }

  public getReservationByUsername(username : string) : Observable<IReservations[]>{
    return this.httpClient.get<IReservations[]>(this.administrationUrl + username);
  }
}
