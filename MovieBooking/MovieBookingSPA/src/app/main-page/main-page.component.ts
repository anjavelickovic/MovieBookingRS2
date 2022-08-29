import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, Observable, of, Subscription } from 'rxjs';
import { MoviesFacadeService } from '../movies/domain/application-services/movies-facade.service'
import { IMovieDetails } from '../movies/domain/models/movie-details';
import { ProjectionFacadeService } from '../projection/domain/application-services/projection-facade.service';
import { LocalStorageKeys } from '../shared/local-storage/local-storage-keys';
import { LocalStorageService } from '../shared/local-storage/local-storage.service';
import { IProjection } from '../projection/domain/models/projection.model';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  private randomAiringMoviesObservable: Observable<boolean | IMovieDetails[]>;
  private randomUpcomingMoviesObservable: Observable<boolean | IMovieDetails[]>;
  private projectionsObservable: Observable<boolean | IProjection[]>;
  private NUMBER_OF_AIRING_MOVIES = 12;
  private NUMBER_OF_UPCOMING_MOVIES = 6;

  public randomAiringMovies: Array<IMovieDetails>;
  public randomUpcomingMovies: Array<IMovieDetails>;

  public items: Array<number> = [1,2,3,4];

  private activeSubs: Subscription[] = [];

  constructor(private movieService: MoviesFacadeService,
              private projectionService: ProjectionFacadeService,
              private localStorageService: LocalStorageService,
              private router: Router) {

    this.projectionsObservable = this.projectionService.getProjections().pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        window.alert("Internal server error");
        return of(false);
    }));

    this.randomUpcomingMoviesObservable = this.movieService.GetRandomUpcomingMovies(this.NUMBER_OF_UPCOMING_MOVIES).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404)
          window.alert("No movies in database");
        else
          window.alert("Internal server error");
        return of(false);
    }));

    this.randomAiringMoviesObservable = this.projectionsObservable.pipe(
      switchMap( (result: boolean | Array<IProjection>) => {
        if (result !== false){
          var projections = result as Array<IProjection>;
          if(projections.length === 0){
            window.alert("No projections in database");
            return of(false);
          }
          var feasibleMovies: string[] = projections.map(projection => projection.movieId);
          return this.movieService.GetRandomAiringMovies(this.NUMBER_OF_AIRING_MOVIES, feasibleMovies)
        }
        return of(false);
      }),
    
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404)
          window.alert("No movies in database");
        else
          window.alert("Internal server error");
        return of(false);
      })
    );

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
    var randomAiringMoviesSub = this.randomAiringMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomAiringMovies = result as Array<IMovieDetails>;
          this.localStorageService.set(LocalStorageKeys.RandomAiringMovies, this.randomAiringMovies);
    }});

    this.activeSubs.push(randomAiringMoviesSub);
  }

  public fetchRandomUpcomingMovies(): void{
    var randomUpcomingMoviesSub = this.randomUpcomingMoviesObservable.subscribe(
      (result: boolean | Array<IMovieDetails>) => {
        if (result !== false){
          this.randomUpcomingMovies = result as Array<IMovieDetails>;
          this.localStorageService.set(LocalStorageKeys.RandomUpcomingMovies, this.randomUpcomingMovies);
    }});

    this.activeSubs.push(randomUpcomingMoviesSub);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
