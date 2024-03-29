import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';
import { NotAuthenticatedGuard } from './shared/guards/not-authenticated.guard';

const routes: Routes = [
  { path: 'identity', loadChildren: () => import('./identity/identity.module').then(m => m.IdentityModule) },
  { path: 'theater-hall', loadChildren: () => import('./theater-hall/theater-hall.module').then(m => m.TheaterHallModule), canActivate: [AdminGuard]},
  { path: 'main', loadChildren: () => import('./main-page/main-page.module').then(m => m.MainPageModule), canActivate: [NotAuthenticatedGuard] },
  { path: 'projection', loadChildren: () => import('./projection/projection.module').then(m => m.ProjectionModule), canActivate: [AdminGuard] },
  { path: 'movies', loadChildren: () => import('./movies/movies.module').then(m => m.MoviesModule), canActivate: [NotAuthenticatedGuard]},
  { path: 'discount', loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule) , canActivate: [AdminGuard]},
  { path: 'reservations', loadChildren: () => import('./reservations/reservations.module').then(m => m.ReservationsModule), canActivate: [NotAuthenticatedGuard] },
  { path: 'administration', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule) },
  { path: '**', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
