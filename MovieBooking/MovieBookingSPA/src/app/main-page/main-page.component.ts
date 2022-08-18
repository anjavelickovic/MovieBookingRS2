import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { MoviesFacadeService } from '../movies/domain/application-services/movies-facade.service'
import { IMovieDetails } from '../movies/domain/models/movie-details';

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

  constructor(private movieService: MoviesFacadeService, private router: Router) {

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
    
    this.randomAiringMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomAiringMovies = result as Array<IMovieDetails>;
    }});

    this.randomUpcomingMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomUpcomingMovies = result as Array<IMovieDetails>;
    }});

  }  

  public moviePage(movieId: string): void {
    this.router.navigate((['/movies', movieId]));;
  }

  ngOnInit(): void {
  }

}
