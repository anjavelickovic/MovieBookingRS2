import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectionComponent } from './projection.component';
import { ProjectionFormComponent } from './projection-form/projection-form.component';
import { ProjectionInfoComponent } from './projection-info/projection-info.component';
import { ProjectionListComponent } from './projection-list/projection-list.component';
import { ProjectionRoutingModule } from './projection-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectionDeleteButtonComponent } from './projection-delete-button/projection-delete-button.component';
import { SortByMovieNamePipe } from './pipes/sort-by-movie-name.pipe';


@NgModule({
  declarations: [
    ProjectionComponent,
    ProjectionFormComponent,
    ProjectionInfoComponent,
    ProjectionDeleteButtonComponent,
    ProjectionListComponent,
    SortByMovieNamePipe
  ],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class ProjectionModule { }