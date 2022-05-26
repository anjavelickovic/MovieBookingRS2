import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthenticationService } from '../infrastructure/authentication.service';
import { ILoginRequest } from '../models/login-request';
import { ILoginResponse } from '../models/login-response';
import { IRegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationFacadeService {

  constructor(private authenticationService: AuthenticationService) { }

  public loginCustomer(userNameOrEmail: string, password: string): Observable<boolean>{
    const request: ILoginRequest = {userNameOrEmail, password};

    return this.authenticationService.loginCustomer(request).pipe(
      map( (loginReponse: ILoginResponse) => {
        console.log(loginReponse)
        return true;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  public registerCustomer(firstName: string, lastName: string, userName: string,
                                password: string, email: string): Observable<boolean>{

    const request: IRegisterRequest = {firstName, lastName, userName, password, email};

    return this.authenticationService.registerCustomer(request).pipe(
      map((value) => {
        if(typeof value == 'string')
          return true;
        return false;
      })
    )
  }

  public loginAdmin(userNameOrEmail: string, password: string): Observable<boolean>{
    const request: ILoginRequest = {userNameOrEmail, password};

    return this.authenticationService.loginAdmin(request).pipe(
      map( (loginReponse: ILoginResponse) => {
        console.log(loginReponse)
        return true;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }
}
