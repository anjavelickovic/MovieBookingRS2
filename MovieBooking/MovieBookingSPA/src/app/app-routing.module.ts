import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { NotAuthenticatedGuard } from './shared/guards/not-authenticated.guard';

const routes: Routes = [
  { path: 'identity', loadChildren: () => import('./identity/identity.module').then(m => m.IdentityModule) },
  { path: 'main', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule), canActivate: [NotAuthenticatedGuard] },
  { path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
