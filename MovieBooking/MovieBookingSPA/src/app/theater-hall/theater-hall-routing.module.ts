import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheaterHallInfoComponent } from './theater-hall-info/theater-hall-info.component';
import { TheaterHallComponent } from './theater-hall.component';

const routes: Routes = [
  { path: '', component: TheaterHallComponent },
  {path: ':theaterHallId', component: TheaterHallInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheaterHallRoutingModule { }
