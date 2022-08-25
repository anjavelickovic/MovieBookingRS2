import { Component, OnInit } from '@angular/core';
import { ReservationFacadeService } from './domain/application-services/reservation-facade.service';
import { IReservation } from './domain/models/reservation.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  public reservations: { [movieiId: string]: {[projectionId: string] :  IReservation} };
  public reservationsList: IReservation[] = [];

  constructor(private reservationFacadeService: ReservationFacadeService) { 
    this.reservationFacadeService.getReservations()
      .subscribe(reservationBasket => {
        this.reservations = reservationBasket.reservations;
        console.log(this.reservations);
    });
  }

  public onCheckout(){
    for(let movieId in this.reservations){
      for(let projectionId in this.reservations[movieId]){
        this.reservationsList.push(this.reservations[movieId][projectionId])
      }
    }

    console.log("checkout");
    console.log(this.reservationsList);
  }

  ngOnInit(): void {
  }

}
