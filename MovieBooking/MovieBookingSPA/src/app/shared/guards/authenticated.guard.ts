import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { NotAuthenticatedGuard } from './not-authenticated.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  public constructor(private notAuthenticatedGuard: NotAuthenticatedGuard, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (this.notAuthenticatedGuard.canActivate(route, state) as Observable<boolean | UrlTree>).pipe(
      map((result: boolean | UrlTree) => {
        if (result instanceof UrlTree) {
          return true;
        }
        return this.router.createUrlTree(['/main']);
      })
    );
  }
}
