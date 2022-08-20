import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectionComponent } from './projection.component';
import { ProjectionFormComponent } from './projection-form/projection-form.component';
import { ProjectionInfoComponent } from './projection-info/projection-info.component';
import { ProjectionListComponent } from './projection-list/projection-list.component';
import { ProjectionRoutingModule } from './projection-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectionDeleteButtonComponent } from './projection-delete-button/projection-delete-button.component';


@NgModule({
  declarations: [
    ProjectionComponent,
    ProjectionFormComponent,
    ProjectionInfoComponent,
    ProjectionListComponent,
    ProjectionDeleteButtonComponent
  ],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class ProjectionModule { }