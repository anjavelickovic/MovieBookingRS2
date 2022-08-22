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

  public GetMovieById(id: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMovieById(id);
  }

  public GetMoviesByTitle(title: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByTitle(title);
  }

  public GetMoviesByYear(year: number): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByYear(year);
  }

  public GetMoviesByRuntime(lowerBound: number, upperBound: number): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByRuntime(lowerBound, upperBound);
  }

  public GetMoviesByGenres(genres: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByGenres(genres);
  }

  public GetMoviesByDirector(director: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByDirector(director);
  }

  public GetMoviesByMainActor(mainActor: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByMainActor(mainActor);
  }

  public GetMoviesByLanguage(language: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByLanguage(language);
  }

  public GetMoviesByImdbRating(lowerBound: number, upperBound: number): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByImdbRating(lowerBound, upperBound);
  }

  public GetMoviesByImdbVotes(votes: string): Observable<Array<IMovieDetails>>{
    return this.moviesService.GetMoviesByImdbVotes(votes);
  }
}
