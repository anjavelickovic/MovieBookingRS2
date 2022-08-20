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

  public getMoviesDetails(): Observable<IMovieDetails[]> {
    return this.httpClient.get<IMovieDetails[]>(this.url);
  }

  public getMovieDetails(id: string): Observable<IMovieDetails> {
    return this.httpClient.get<IMovieDetails>(`${this.url}/${id}`);
  }
}