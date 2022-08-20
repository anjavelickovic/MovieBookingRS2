import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateProjectionRequest } from '../models/create-projection-request.model';
import { IProjection } from '../models/projection.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectionService {
  private readonly projectionUrl = "http://localhost:8005/api/v1/Projection/";
  private readonly deleteByMovieTtile = "DeleteProjectionsByMovieTitle/";
  private readonly deleteByDate = "DeleteProjectionsByDate/";
  private readonly getByMovieId = "GetMovieProjections/"

  constructor(private http: HttpClient) { }

  public getProjections(): Observable<IProjection[]>  { 
    return this.http.get<IProjection[]>(this.projectionUrl);
  }

  public getMovieProjections(movieId: string): Observable<IProjection[]>  { 
    return this.http.get<IProjection[]>(this.projectionUrl + this.getByMovieId + movieId);
  }

  public getProjection(projectionId: string): Observable<IProjection>  { 
    return this.http.get<IProjection>(this.projectionUrl + projectionId);
  }

  public createProjection(request: ICreateProjectionRequest): Observable<IProjection> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<IProjection>(this.projectionUrl, body, {headers: headers});
  }

  public updateProjection(request: IProjection): Observable<boolean> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<boolean>(this.projectionUrl, body, {headers: headers});
  }
 
  public deleteProjection(projectionId: string): Observable<any>{
    return this.http.delete(this.projectionUrl + projectionId);
  }

  public deleteProjectionsByMovieTitle(movieTitle: string): Observable<any>{
    return this.http.delete(this.projectionUrl + this.deleteByMovieTtile + movieTitle);
  }

  public deleteProjectionsByDate(date: string): Observable<any>{
    return this.http.delete(this.projectionUrl + this.deleteByDate + date);
  }

  public deleteProjections(): Observable<any>{
    return this.http.delete(this.projectionUrl);
  }
  
}