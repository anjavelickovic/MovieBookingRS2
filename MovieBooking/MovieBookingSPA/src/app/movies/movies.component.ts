import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { IAppState } from '../shared/app-state/app-state';
import { AppStateService } from '../shared/app-state/app-state.service';
import { MoviesFacadeService } from './domain/application-services/movies-facade.service';
import { IMovieDetails } from './domain/models/movie-details';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  
  public appState: IAppState;
  public movieDetails: IMovieDetails;

  constructor(private movieService: MoviesFacadeService,
              private appStateService: AppStateService,
              private router: Router,
              private sanitizer: DomSanitizer) {
    const path = this.router.url;
    const movieId = path.substring( path.lastIndexOf('/') + 1 );

    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.movieService.getMovieDetails(movieId).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404)
          window.alert("No such movie in database");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean | IMovieDetails) => {
        if (result !== false){
          this.movieDetails = result as IMovieDetails;
          console.log(this.movieDetails);
        }
      }
    );
  }


  ngOnInit(): void {
  }

  public trailerConfiguration(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.movieDetails.trailer + "?autoplay=false&width=520");
  }

}
