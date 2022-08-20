import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectionService } from '../infrastructure/projection.service';
import { ICreateProjectionRequest } from '../models/create-projection-request.model';
import { IProjection } from '../models/projection.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectionFacadeService {
 
  constructor(private projectionService: ProjectionService) { }

  public getProjections(): Observable<IProjection[]> {
    return this.projectionService.getProjections();
  }

  public getMovieProjections(movieId: string): Observable<IProjection[]>  { 
    return this.projectionService.getMovieProjections(movieId);
  }

  public getProjection(projectionId: string): Observable<IProjection> {
    return this.projectionService.getProjection(projectionId);
  }

  public createProjection(movieId: string,
                          movieTitle: string,
                          runtime: string,
                          theaterHallId: string,
                          theaterHallName: string,
                          projectionDate: string,
                          projectionTerm: string,
                          numberOfSeats: number,
                          numberOfReservedSeats: number,
                          price: number): Observable<IProjection> {
    const request: ICreateProjectionRequest = {movieId, movieTitle, runtime, theaterHallId, theaterHallName,
    projectionDate, projectionTerm, numberOfSeats,numberOfReservedSeats, price};
    return this.projectionService.createProjection(request);
  }

  public updateProjection(id: string,
                          movieId: string,
                          movieTitle: string,
                          runtime: string,
                          theaterHallId: string,
                          theaterHallName: string,
                          projectionDate: string,
                          projectionTerm: string,
                          numberOfSeats: number,
                          numberOfReservedSeats: number,
                          price: number): Observable<boolean> {
    const request: IProjection = {id, movieId, movieTitle, runtime, theaterHallId, theaterHallName,
      projectionDate, projectionTerm, numberOfSeats, numberOfReservedSeats, price};
    return this.projectionService.updateProjection(request);
  }
 
  public deleteProjection(projectionId: string): Observable<any>{
    return this.projectionService.deleteProjection(projectionId);
  }

  public deleteProjectionsByMovieTitle(movieTitle: string): Observable<any>{
    return this.projectionService.deleteProjectionsByMovieTitle(movieTitle);
  }

  public deleteProjectionsByDate(date: string): Observable<any>{
    return this.projectionService.deleteProjectionsByDate(date);
  }

  public deleteProjections(): Observable<any>{
    return this.projectionService.deleteProjections();
  }
}