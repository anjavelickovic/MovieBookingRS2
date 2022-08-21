import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
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
export class ReservationsListComponent implements OnInit {

  public reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
  public appState: IAppState;
  public modalReference: NgbModalRef;
  public reservationForm: UntypedFormGroup;
  public showServerErrors = false;
  public errMsg: string;

  constructor(private reservationFacadeService: ReservationFacadeService,
             private appStateService: AppStateService,
             private modalService: NgbModal,
             private formBuilder: UntypedFormBuilder) { 
    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.reservationFacadeService.getReservations()
      .subscribe(reservationBasket => {
        this.reservations = reservationBasket.reservations;
        console.log(this.reservations);
    });

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
  }

  public onProjectionReserveFormSubmit(projection){
    const data: IReservationForm = this.reservationForm.value as IReservationForm;
    console.log(data.numberOfTickets);
    console.log(projection)

    this.reservationFacadeService.updateReservation(projection.projectionId, projection.projectionDate, 
      projection.projectionTerm,projection.movieId, projection.movieTitle,
      projection.theaterHallName, projection.theaterHallId, projection.price, data.numberOfTickets)
     .subscribe({
      error: (err) => {
        this.showServerErrors = true;
        console.log(err);
        if(err.status == 400){
          this.errMsg = "You can not reserve more seats for same projection. Go into reservations and updated it."
        }
        return of(false);
      },
      complete: () => {
        window.alert("Reservations updated");
        this.reservationForm.reset();
        this.modalReference.close();
        this.showServerErrors = false;
        this.errMsg = "";
        window.location.reload();
      }
    });
  }

  public deleteReservation(projection){
    const data: IReservationForm = this.reservationForm.value as IReservationForm;

    this.reservationFacadeService.deleteReservation(projection.projectionId, projection.projectionDate, 
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
  }

  public ngOnInit(): void {
    
  }

}
