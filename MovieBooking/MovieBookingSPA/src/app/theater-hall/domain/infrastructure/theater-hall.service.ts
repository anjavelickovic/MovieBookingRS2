import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateTheaterHallRequest } from '../models/create-theater-hall-request.model';
import { ITheaterHall } from '../models/theater-hall.model';

@Injectable({
  providedIn: 'root'
})
export class TheaterHallService {
  private readonly theaterHallsUrl = "http://localhost:8004/api/v1/TheaterHall/";

  constructor(private http: HttpClient) { }

  public getTheaterHalls(): Observable<ITheaterHall[]>  { 
    return this.http.get<ITheaterHall[]>(this.theaterHallsUrl);
  }

  public getTheaterHall(theaterHallId: string): Observable<ITheaterHall>  { 
    return this.http.get<ITheaterHall>(this.theaterHallsUrl + theaterHallId);
  }

  public createTheaterHall(request: ICreateTheaterHallRequest): Observable<ITheaterHall> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<ITheaterHall>(this.theaterHallsUrl, body, {headers: headers});
  }

  public updateTheaterHall(request: ITheaterHall): Observable<boolean> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<boolean>(this.theaterHallsUrl, body, {headers: headers});
  }

  public deleteTheaterHall(theaterHallId: string): Observable<any>{
    return this.http.delete(this.theaterHallsUrl, {params: {id: theaterHallId}});
  }
  
}
