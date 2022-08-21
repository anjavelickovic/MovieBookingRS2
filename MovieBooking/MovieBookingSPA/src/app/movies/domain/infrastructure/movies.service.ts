import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMovieDetails } from '../models/movie-details';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = `http://localhost:8000/api/v1/Movie`;

  constructor(private httpClient: HttpClient) { }

  public getMovieDetails(id: string): Observable<IMovieDetails> {
    return this.httpClient.get<IMovieDetails>(`${this.url}/${id}`);
  }

  public getMoviesDetails(): Observable<IMovieDetails[]> {
    return this.httpClient.get<IMovieDetails[]>(`${this.url}/GetAllMovies`);
  }

  public GetRandomAiringMovies(numberOfMovies: number, feasibleMovies: string[]): Observable<Array<IMovieDetails>> {
    let body = JSON.stringify(feasibleMovies);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.post<Array<IMovieDetails>>(`${this.url}/GetRandomAiringMovies/${numberOfMovies}`, body, {headers: headers});
  }

  public GetRandomUpcomingMovies(numberOfMovies: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetRandomUpcomingMovies/${numberOfMovies}`);
  }
}
