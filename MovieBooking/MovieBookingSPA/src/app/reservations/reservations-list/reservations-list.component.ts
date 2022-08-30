import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { ReservationFacadeService } from '../domain/application-services/reservation-facade.service';
import { IReservationForm } from '../domain/models/reservation-form.model';
import { IReservation } from '../domain/models/reservation.model';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent implements OnInit, OnDestroy {

  public reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
  public totalPrice: number;
  public appState: IAppState;
  public modalReference: NgbModalRef;
  public reservationForm: UntypedFormGroup;
  public showServerErrors = false;
  public errMsg: string;
  public processing: boolean = false;
  private activeSubs: Subscription[] = [];

  constructor(private reservationFacadeService: ReservationFacadeService,
             private appStateService: AppStateService,
             private modalService: NgbModal,
             private formBuilder: UntypedFormBuilder) { 
    var appSub = this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );
    this.activeSubs.push(appSub);

    var resSub = this.reservationFacadeService.getReservations()
      .subscribe(reservationBasket => {
        this.reservations = reservationBasket.reservations;
        this.totalPrice = reservationBasket.totalPrice;
        console.log(this.reservations);
    });
    this.activeSubs.push(resSub);

    this.reservationForm = this.formBuilder.group({
        numberOfTickets: ['', [Validators.required]]
    });
  }

  public get numberOfTickets(){
    return this.reservationForm.get('numberOfTickets');
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal'});
  }

  public close() {
    this.modalReference.close();
    this.reservationForm.reset();
    this.showServerErrors = false;
    this.errMsg = "";
    this.processing = false;
  }

  public onProjectionReserveFormSubmit(projection){
    this.processing = true;
    const data: IReservationForm = this.reservationForm.value as IReservationForm;
    console.log(data.numberOfTickets);
    console.log(projection)

    var resUpdateSub = this.reservationFacadeService.updateReservation(projection.projectionId, projection.projectionDate, 
      projection.projectionTerm,projection.movieId, projection.movieTitle,
      projection.theaterHallName, projection.theaterHallId, projection.price, data.numberOfTickets)
     .subscribe({
      error: (err) => {
        this.showServerErrors = true;
        this.processing = false;
        console.log(err);
        if(err.status == 400){
          this.errMsg = "You can not reserve more seats for same projection. Go into reservations and updated it."
        }
        return of(false);
      },
      complete: () => {
        this.processing = false;
        window.alert("Reservation updated");
        this.reservationForm.reset();
        this.modalReference.close();
        this.showServerErrors = false;
        this.errMsg = "";
        window.location.reload();
      }
    });
    this.activeSubs.push(resUpdateSub);
  }

  public deleteReservation(projection){
    const data: IReservationForm = this.reservationForm.value as IReservationForm;

    var resDelSub = this.reservationFacadeService.deleteReservation(projection.projectionId, projection.projectionDate, 
      projection.projectionTerm,projection.movieId, projection.movieTitle,
      projection.theaterHallName, projection.theaterHallId, projection.price, projection.numberOfTickets)
    .subscribe({
      error: (err) => {
        console.log(err);
        return of(false);
      },
      complete: () => {
        window.alert("Reservation deleted");
        this.modalReference.close();
        window.location.reload();
      }
    });
    this.activeSubs.push(resDelSub);
  }

  public ngOnInit(): void {}

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
  
}
