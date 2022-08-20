import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MoviesService } from '../infrastructure/movies.service';
import { IMovieDetails } from '../models/movie-details';

@Injectable({
  providedIn: 'root'
})
export class MoviesFacadeService {

  constructor(private moviesService: MoviesService) { }

  public getMoviesDetails(): Observable<IMovieDetails[]> {
    return this.moviesService.getMoviesDetails();
  }

  public getMovieDetails(id: string): Observable<IMovieDetails> {
    return this.moviesService.getMovieDetails(id);
  }
}