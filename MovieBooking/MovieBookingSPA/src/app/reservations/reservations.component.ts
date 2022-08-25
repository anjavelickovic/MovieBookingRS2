import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ReservationFacadeService } from './domain/application-services/reservation-facade.service';
import { IPhoneForm } from './domain/models/phone-form.model';
import { IReservationCheckout } from './domain/models/reservation-checkout.model';
import { IReservation } from './domain/models/reservation.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  public reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
  public reservationsList: IReservation[] = [];
  public modalReference: NgbModalRef;
  public checkoutForm: UntypedFormGroup;

  constructor(private reservationFacadeService: ReservationFacadeService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router) { 
    this.reservationFacadeService.getReservations()
      .subscribe(reservationBasket => {
        this.reservations = reservationBasket.reservations;

        this.checkoutForm = this.formBuilder.group({
          areaCode: ['', [Validators.required]],
          phoneNumber: ['', [Validators.required]]
        });

        console.log(this.reservations);
    });
  }

  public get areaCode(){
    return this.checkoutForm.get('areaCode');
  }

  public get phoneNumber(){
    return this.checkoutForm.get('phoneNumber');
  }

  public onCheckout(){
    for(let movieId in this.reservations){
      for(let projectionId in this.reservations[movieId]){
        this.reservationsList.push(this.reservations[movieId][projectionId])
      }
    }

    const data: IPhoneForm = this.checkoutForm.value as IPhoneForm;
    console.log(data);
    console.log(this.reservationsList);

    this.reservationFacadeService.checkout(this.reservationsList, data.areaCode, data.number)
    .subscribe({
      error: (err) => {
        console.log(err);
        return of(false);
      },
      complete: () => {
        window.alert("Reservations confirmed");
        this.modalReference.close();
        this.router.navigate((['/administration']));
      }
    });


  }

  public deleteAll(){
    this.reservationFacadeService.deleteReservations()
    .subscribe({
      error: (err) => {
        console.log(err);
        return of(false);
      },
      complete: () => {
        window.alert("Deleted all reservations");
        this.modalReference.close();
        window.location.reload();
      }
    });
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal'});
  }

  public close() {
    this.modalReference.close();
    this.checkoutForm.reset();
  }

  ngOnInit(): void {
  }

}
