import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MoviesService } from '../infrastructure/movies.service';
import { IMovieDetails } from '../models/movie-details';

@Injectable({
  providedIn: 'root'
})
export class MoviesFacadeService {

  constructor(private moviesService: MoviesService) { }

  public getMovieDetails(id: string): Observable<IMovieDetails> {
    return this.moviesService.getMovieDetails(id);
  }

  public getMoviesDetails(): Observable<IMovieDetails[]> {
    return this.moviesService.getMoviesDetails();
  }

  public GetRandomAiringMovies(numberOfMovies: number, feasibleMovies: string[]): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetRandomAiringMovies(numberOfMovies, feasibleMovies);
  }

  public GetRandomUpcomingMovies(numberOfMovies: number): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetRandomUpcomingMovies(numberOfMovies);
  }
}
