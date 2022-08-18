import { HttpClient } from '@angular/common/http';
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

  public GetRandomAiringMovies(numberOfMovies: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetRandomAiringMovies/${numberOfMovies}`);
  }

  public GetRandomUpcomingMovies(numberOfMovies: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetRandomUpcomingMovies/${numberOfMovies}`);
  }
}
