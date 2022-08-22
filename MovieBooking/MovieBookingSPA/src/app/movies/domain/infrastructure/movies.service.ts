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

  public GetMovieById(id: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/${id}`);
  }

  public GetMoviesByTitle(title: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByTitle/${title}`);
  }

  public GetMoviesByYear(year: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByYear/${year}`);
  }

  public GetMoviesByRuntime(lowerBound: number, upperBound: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByRuntime/${lowerBound}/${upperBound}`);
  }

  public GetMoviesByGenres(genres: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByGenres/${genres}`);
  }

  public GetMoviesByDirector(director: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByDirector/${director}`);
  }

  public GetMoviesByMainActor(mainActor: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByMainActor/${mainActor}`);
  }

  public GetMoviesByLanguage(language: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByLanguage/${language}`);
  }

  public GetMoviesByImdbRating(lowerBound: number, upperBound: number): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByImdbRating/${lowerBound}/${upperBound}`);
  }

  public GetMoviesByImdbVotes(votes: string): Observable<Array<IMovieDetails>> {
    return this.httpClient.get<Array<IMovieDetails>>(`${this.url}/GetMoviesByImdbVotes/${votes}`);
  }
}
