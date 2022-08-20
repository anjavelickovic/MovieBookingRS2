import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectionInfoComponent } from './projection-info/projection-info.component';
import { ProjectionComponent } from './projection.component';

const routes: Routes = [
  { path: '', component: ProjectionComponent },
  {path: ':projectionId', component: ProjectionInfoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectionRoutingModule { }
