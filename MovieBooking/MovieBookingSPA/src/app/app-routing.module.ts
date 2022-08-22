import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { NotAuthenticatedGuard } from './shared/guards/not-authenticated.guard';

const routes: Routes = [
  { path: 'identity', loadChildren: () => import('./identity/identity.module').then(m => m.IdentityModule) },
  { path: 'theater-hall', loadChildren: () => import('./theater-hall/theater-hall.module').then(m => m.TheaterHallModule), canActivate: [AdminGuard]},
  { path: 'main', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule), canActivate: [NotAuthenticatedGuard] },
  { path: '**', redirectTo: '/main', pathMatch: 'full' },
  { path: 'projection', loadChildren: () => import('./projection/projection.module').then(m => m.ProjectionModule), canActivate: [NotAuthenticatedGuard] },
  { path: 'movies', loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule), canActivate: [NotAuthenticatedGuard]},
  { path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule) , canActivate: [NotAuthenticatedGuard]},
  { path: 'reservations', loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule), canActivate: [NotAuthenticatedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
