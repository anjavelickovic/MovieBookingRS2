import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdministrationService } from '../infrastructure/administration.service';
import { IReservations } from '../models/reservations';

@Injectable({
  providedIn: 'root'
})
export class AdministrationFacadeService {

  constructor(private administrationService : AdministrationService) { }

  public getReservationByUsername(username : string) : Observable<IReservations[]>{
    return this.administrationService.getReservationByUsername(username);
  }
}
