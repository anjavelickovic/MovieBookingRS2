import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, observable, Observable, of, switchMap, throwError } from 'rxjs';
import { DiscountFacadeService } from '../discount/domain/application-services/discount-facade.service';
import { ICoupon } from '../discount/domain/models/coupon';
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
export class MoviesComponent implements OnInit {
  
  public appState: IAppState;
  public movieDetails: IMovieDetails = null;
  public projections: IProjection[];
  public projectionReserveForm: UntypedFormGroup;
  public modalReference: NgbModalRef;
  public projection: IProjection;
  public showServerErrors = false;
  public errMsg: string;
  public processing: boolean = false;
  public coupon: ICoupon;
  public couponExists: boolean = false;
  

  constructor(private movieService: MoviesFacadeService,
              private appStateService: AppStateService,
              private router: Router,
              private sanitizer: DomSanitizer,
              private projectionFacadeService: ProjectionFacadeService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private reservationFacadeService: ReservationFacadeService,
              private discountFacadeService: DiscountFacadeService) {
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

    this.projectionFacadeService.getMovieProjections(movieId).pipe(
      switchMap((projections) => {
          this.projections = projections;
          return this.discountFacadeService.getDiscount(this.projections[0].movieTitle)
      }),
      catchError((err: HttpErrorResponse) => {
        if(err.status == 404){
          return  of(1);
        }
        else
          return of(2);
      })
    ).subscribe(
        (result: number | ICoupon) => {
          if (result !== 1 && result !== 2){
            this.coupon = result as ICoupon;
            this.couponExists = true;
          }
          else 
            if(result == 1){
              console.log("There is no coupon for this movie.")
            }
            else{
              console.log("Server error")
            }
      });

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
    this.reservationFacadeService.addReservation(this.projection.id, this.projection.projectionDate, 
      this.projection.projectionTerm,this.projection.movieId, this.projection.movieTitle,
      this.projection.theaterHallName, this.projection.theaterHallId, this.projection.price, data.numberOfTickets)
     .subscribe({
      error: (err) => {
        this.processing = false;
        this.showServerErrors = true;
        console.log(err);
        if(err.status == 400){
          this.errMsg = "You can't reserve more seats for the projection for which you already reserved seats." + "\n" + "Go into reservations and update it."
        }else{
          this.errMsg = "There are not enough seats for this projection"
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
  }
  
  public trailerConfiguration(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.movieDetails.trailer + "?autoplay=false&width=520");
  }

}
