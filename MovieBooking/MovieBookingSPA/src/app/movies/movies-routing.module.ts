import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './feature-add-movie/add-movie/add-movie.component';
import { SearchComponent } from './feature-search/search/search.component';
import { MoviesComponent } from './movies.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full'},
  { path: 'addmovie', component: AddMovieComponent},
  { path: 'search/:searchCriteria/:userSearch', component: SearchComponent},
  { path: '**', component: MoviesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule { }
