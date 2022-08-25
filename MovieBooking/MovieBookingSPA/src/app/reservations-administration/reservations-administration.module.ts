import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationsAdministrationRoutingModule } from './reservations-administration-routing.module';
import { ReservationsAdministrationComponent } from './reservations-administration.component';


@NgModule({
  declarations: [
    ReservationsAdministrationComponent
  ],
  imports: [
    CommonModule,
    ReservationsAdministrationRoutingModule
  ]
})
export class ReservationsAdministrationModule { }
