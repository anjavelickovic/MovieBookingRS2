import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { MoviesFacadeService } from '../movies/domain/application-services/movies-facade.service'
import { IMovieDetails } from '../movies/domain/models/movie-details';
import { LocalStorageKeys } from '../shared/local-storage/local-storage-keys';
import { LocalStorageService } from '../shared/local-storage/local-storage.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  private randomAiringMoviesObservable: Observable<boolean | IMovieDetails[]>;
  private randomUpcomingMoviesObservable: Observable<boolean | IMovieDetails[]>;
  private NUMBER_OF_MOVIES = 6;

  public randomAiringMovies: Array<IMovieDetails>;
  public randomUpcomingMovies: Array<IMovieDetails>;

  public items: Array<number> = [1,2,3,4];

  constructor(private movieService: MoviesFacadeService,
              private localStorageService: LocalStorageService,
              private router: Router) {

    this.randomAiringMoviesObservable = this.movieService.GetRandomAiringMovies(this.NUMBER_OF_MOVIES).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404)
          window.alert("No movies in database");
        else
          window.alert("Internal server error");
        return of(false);
    }));

    this.randomUpcomingMoviesObservable = this.movieService.GetRandomUpcomingMovies(this.NUMBER_OF_MOVIES).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404)
          window.alert("No movies in database");
        else
          window.alert("Internal server error");
        return of(false);
    }));

    if(this.localStorageService.get(LocalStorageKeys.RandomAiringMovies) == null) {
      this.fetchRandomAiringMovies();
    }
    else{
      this.randomAiringMovies = this.localStorageService.get(LocalStorageKeys.RandomAiringMovies);
    }

    if(this.localStorageService.get(LocalStorageKeys.RandomUpcomingMovies) == null) {
      this.fetchRandomUpcomingMovies();
    }
    else{
      this.randomUpcomingMovies = this.localStorageService.get(LocalStorageKeys.RandomUpcomingMovies);
    }

  }  

  public moviePage(movieId: string): void {
    this.router.navigate((['/movies', movieId]));;
  }

  public fetchRandomAiringMovies(): void{
    this.randomAiringMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomAiringMovies = result as Array<IMovieDetails>;
          this.localStorageService.set(LocalStorageKeys.RandomAiringMovies, this.randomAiringMovies);
    }});
  }

  public fetchRandomUpcomingMovies(): void{
    this.randomUpcomingMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomUpcomingMovies = result as Array<IMovieDetails>;
          this.localStorageService.set(LocalStorageKeys.RandomUpcomingMovies, this.randomUpcomingMovies);
    }});
  }

  ngOnInit(): void {
  }

}
