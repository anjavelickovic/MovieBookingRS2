import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { ReservationsListComponent } from './feature-administration/reservations-list/reservations-list.component';


@NgModule({
  declarations: [
    AdministrationComponent,
    ReservationsListComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule
  ]
})
export class AdministrationModule { }
