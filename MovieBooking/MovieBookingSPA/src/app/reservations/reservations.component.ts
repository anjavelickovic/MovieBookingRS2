import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { ReservationFacadeService } from './domain/application-services/reservation-facade.service';
import { IPhoneForm } from './domain/models/phone-form.model';
import { IReservation } from './domain/models/reservation.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit, OnDestroy {

  public reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
  public reservationsList: IReservation[] = [];
  public modalReference: NgbModalRef;
  public checkoutForm: UntypedFormGroup;
  public reservationsExists: boolean = false;
  private activeSubs: Subscription[] = [];

  constructor(private reservationFacadeService: ReservationFacadeService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router) { 
    var resSub = this.reservationFacadeService.getReservations()
      .subscribe(reservationBasket => {
        this.reservations = reservationBasket.reservations;
        if(Object.keys(this.reservations).length > 0)
          this.reservationsExists = true;
        console.log(this.reservations);
    });
    this.activeSubs.push(resSub);
    
    this.checkoutForm = this.formBuilder.group({
      areaCode: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]]
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

    var chkSub = this.reservationFacadeService.checkout(this.reservationsList, data.areaCode, data.number)
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
    this.activeSubs.push(chkSub);

  }

  public deleteAll(){
    var resDelSub = this.reservationFacadeService.deleteReservations()
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
    this.activeSubs.push(resDelSub);
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

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
