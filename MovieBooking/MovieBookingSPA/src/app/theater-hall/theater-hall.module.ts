import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheaterHallRoutingModule } from './theater-hall-routing.module';
import { TheaterHallComponent } from './theater-hall.component';
import { TheaterHallListComponent } from './theater-hall-list/theater-hall-list.component';
import { TheaterHallFormComponent } from './theater-hall-form/theater-hall-form.component';
import { TheaterHallInfoComponent } from './theater-hall-info/theater-hall-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TheaterHallComponent,
    TheaterHallListComponent,
    TheaterHallFormComponent,
    TheaterHallInfoComponent
  ],
  imports: [
    CommonModule,
    TheaterHallRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class TheaterHallModule { }
