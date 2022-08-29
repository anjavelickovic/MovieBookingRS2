import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, Subscription } from 'rxjs';
import { ProjectionFacadeService } from '../projection/domain/application-services/projection-facade.service';
import { IProjection } from '../projection/domain/models/projection.model';
import { ReservationFacadeService } from '../reservations/domain/application-services/reservation-facade.service';
import { IReservationForm } from '../reservations/domain/models/reservation-form.model';
import { IAppState } from '../shared/app-state/app-state';
import { AppStateService } from '../shared/app-state/app-state.service';
import { MoviesFacadeService } from './domain/application-services/movies-facade.service';
import { IMovieDetails } from './domain/models/movie-details';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit, OnDestroy {
  
  public appState: IAppState;
  public movieDetails: IMovieDetails = null;
  public projections: IProjection[];
  public projectionReserveForm: UntypedFormGroup;
  public modalReference: NgbModalRef;
  public projection: IProjection;
  public showServerErrors = false;
  public errMsg: string;
  public processing: boolean = false;

  private activeSubs: Subscription[] = [];

  constructor(private movieService: MoviesFacadeService,
              private appStateService: AppStateService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private projectionFacadeService: ProjectionFacadeService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private reservationFacadeService: ReservationFacadeService) {
    const path = this.router.url;
    const movieId = path.substring( path.lastIndexOf('/') + 1 );

    var appStateSub = this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.activeSubs.push(appStateSub);

    var movieDetailsSub = this.movieService.getMovieDetails(movieId).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 404){
          window.alert("No such movie in database");
          router.navigateByUrl('/main');
        }
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

    this.activeSubs.push(movieDetailsSub);

    var movieProjectionsSub = this.projectionFacadeService.getMovieProjections(movieId)
     .subscribe((projections) => {
          this.projections = projections;
     });

     this.activeSubs.push(movieProjectionsSub);

     this.projectionReserveForm = this.formBuilder.group({
      numberOfTickets: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  public get numberOfTickets(){
    return this.projectionReserveForm.get('numberOfTickets');
  }

  public open(content, projection) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal'});
    this.projection = projection;
  }

  public close() {
    this.modalReference.close();
    this.projectionReserveForm.reset();
    this.showServerErrors = false;
    this.errMsg = "";
    this.processing = false;
  }

  public onProjectionReserveFormSubmit(){
    this.processing = true;
    const data: IReservationForm = this.projectionReserveForm.value as IReservationForm;
    console.log(data);

    console.log(this.projection);
    var addReservationSub = this.reservationFacadeService.addReservation(this.projection.id, this.projection.projectionDate, 
      this.projection.projectionTerm,this.projection.movieId, this.projection.movieTitle,
      this.projection.theaterHallName, this.projection.theaterHallId, this.projection.price, data.numberOfTickets)
     .subscribe({
      error: (err) => {
        this.processing = false;
        this.showServerErrors = true;
        console.log(err);
        if(err.status == 400){
          this.errMsg = "You can't reserve more seats for same projection. Go into reservations and update it."
        }else{
          this.errMsg = "There are no enough seats for this projection"
        }
        return of(false);
      },
      complete: () => {
        this.processing = false;
        window.alert("Projection for " + this.projection.movieTitle + " reserved");
        this.projectionReserveForm.reset();
        this.modalReference.close();
        this.showServerErrors = false;
        this.errMsg = "";
        window.location.reload();
      }
    });

    this.activeSubs.push(addReservationSub);
  }
  
  public trailerConfiguration(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.movieDetails.trailer + "?autoplay=false&width=465");
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
