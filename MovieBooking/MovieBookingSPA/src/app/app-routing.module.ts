import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'identity', loadChildren: () => import('./identity/identity.module').then(m => m.IdentityModule) },
  { path: 'main', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
