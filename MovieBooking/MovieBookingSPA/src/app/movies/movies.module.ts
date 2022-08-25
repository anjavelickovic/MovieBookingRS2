import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MoviesComponent } from './movies.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './feature-search/search/search.component';

@NgModule({
  declarations: [
    MoviesComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    MoviesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MoviesModule { }
