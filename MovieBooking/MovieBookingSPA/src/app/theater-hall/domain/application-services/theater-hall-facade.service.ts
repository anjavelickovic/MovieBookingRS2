import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TheaterHallService } from '../infrastructure/theater-hall.service';
import { ICreateTheaterHallRequest } from '../models/create-theater-hall-request.model';
import { ITheaterHall } from '../models/theater-hall.model';

@Injectable({
  providedIn: 'root'
})
export class TheaterHallFacadeService {

  constructor(private thetaterHallService: TheaterHallService) { }

  public getTheaterHalls(): Observable<ITheaterHall[]> {
    return this.thetaterHallService.getTheaterHalls();
  }

  public getTheaterHall(theaterHallId: string): Observable<ITheaterHall> {
    return this.thetaterHallService.getTheaterHall(theaterHallId);
  }

  public createTheaterHall(name: string, terms: string[], numberOfSeats: number): Observable<ITheaterHall> {
    const request: ICreateTheaterHallRequest = {name, terms, numberOfSeats};
    return this.thetaterHallService.createTheaterHall(request);
  }

  public updateTheaterHall(id: string, name: string, terms: string[], numberOfSeats: number): Observable<boolean> {
    const request: ITheaterHall = {id, name, terms, numberOfSeats};
    return this.thetaterHallService.updateTheaterHall(request);
  }

  public deleteTheaterHall(theaterHallId: string): Observable<any>{
    return this.thetaterHallService.deleteTheaterHall(theaterHallId);
  }
}
