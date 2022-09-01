import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, Observable, of, Subscription, iif } from 'rxjs';
import { MoviesFacadeService } from '../movies/domain/application-services/movies-facade.service'
import { IMovieDetails } from '../movies/domain/models/movie-details';
import { ProjectionFacadeService } from '../projection/domain/application-services/projection-facade.service';
import { LocalStorageKeys } from '../shared/local-storage/local-storage-keys';
import { LocalStorageService } from '../shared/local-storage/local-storage.service';
import { IProjection } from '../projection/domain/models/projection.model';
import { AppStateService } from '../shared/app-state/app-state.service';
import { IAppState } from '../shared/app-state/app-state';
import { Role } from '../shared/app-state/role';


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

  public appState: IAppState;

  public randomAiringMovies: Array<IMovieDetails>;
  public randomUpcomingMovies: Array<IMovieDetails>;

  public items: Array<number> = [1,2,3,4];

  private activeSubs: Subscription[] = [];

  constructor(private movieService: MoviesFacadeService,
              private projectionService: ProjectionFacadeService,
              private localStorageService: LocalStorageService,
              private appStateService: AppStateService,
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
            this.randomAiringMovies = [];
            this.localStorageService.clear(LocalStorageKeys.RandomAiringMovies);
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

    var lastUpdateSub = this.appStateService.getAppState().pipe(
      switchMap((appState: IAppState) => {
        this.appState = appState;
        var condition = this.appState.hasRole(Role.Admin) && sessionStorage.getItem("updated") === null;
        return iif(() => condition, this.movieService.GetLastUpdatedDate(), of(null))
      }),
      switchMap(result => {
        if(result === null)
          return of(false);
        sessionStorage.setItem("updated", "");
        var currentDay = new Date().getUTCDate();
        var currentMonth = new Date().getMonth() + 1;
        var currentYear = new Date().getFullYear();
        var lastUpdateDay = result.day;
        var lastUpdateMonth = result.month;
        var lastUpdateYear = result.year;
        var condition = (lastUpdateYear === currentYear && lastUpdateMonth === currentMonth && lastUpdateDay < currentDay)  || 
              (lastUpdateYear === currentYear && lastUpdateMonth < currentMonth)  || 
              lastUpdateYear < currentYear;
        return iif(() => condition, this.movieService.UpdateInformationForAllMovies(), of(false));
        }
    ),
    switchMap(result => {
      if(result === false)
        return of(false);
      return this.movieService.UpdateLastUpdatedDate();
    })
    ).subscribe(result => console.log(result));
  
    this.activeSubs.push(lastUpdateSub);

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
