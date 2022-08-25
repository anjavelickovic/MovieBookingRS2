import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationsAdministrationComponent } from './reservations-administration.component';

const routes: Routes = [{ path: '', component: ReservationsAdministrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsAdministrationRoutingModule { }
