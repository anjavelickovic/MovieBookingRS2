import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { JwtPayloadKeys } from 'src/app/shared/jwt/jwt-payload-keys';
import { JwtService } from 'src/app/shared/jwt/jwt.service';
import { AuthenticationService } from '../infrastructure/authentication.service';
import { ILoginRequest } from '../models/login-request';
import { ILoginResponse } from '../models/login-response';
import { ILogoutRequest } from '../models/logout-request';
import { IRegisterRequest } from '../models/register-request';
import { IUserDetails } from '../models/user-details';
import { UserFacadeService } from './user-facade.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationFacadeService {

  constructor(private authenticationService: AuthenticationService, private appStateService: AppStateService, 
              private jwtService: JwtService, private userService: UserFacadeService) { }

  public loginCustomer(userNameOrEmail: string, password: string): Observable<boolean>{
    const request: ILoginRequest = {userNameOrEmail, password};

    return this.authenticationService.loginCustomer(request).pipe(
      switchMap( (loginResponse: ILoginResponse) => {
        this.appStateService.setAccessToken(loginResponse.accessToken);
        this.appStateService.setRefreshToken(loginResponse.refreshToken);

        const payload = this.jwtService.parsePayload(loginResponse.accessToken);
        this.appStateService.setUsername(payload[JwtPayloadKeys.Username]);
        this.appStateService.setEmail(payload[JwtPayloadKeys.Email]);
        this.appStateService.setRole(payload[JwtPayloadKeys.Role]);

        return this.userService.getUserDetails(payload[JwtPayloadKeys.Username]);
      }),
      map((userDetails: IUserDetails) => {
        this.appStateService.setFirstName(userDetails.firstName);
        this.appStateService.setLastName(userDetails.lastName);
        this.appStateService.setUserId(userDetails.id);

        return true;
      }),
      catchError((err) => {
        this.appStateService.clearAppState();
        return of(false);
      })
    );
  }

  public registerCustomer(firstName: string, lastName: string, userName: string,
                                password: string, email: string): Observable<boolean>{

    const request: IRegisterRequest = {firstName, lastName, userName, password, email};

    return this.authenticationService.registerCustomer(request);
  }

  public loginAdmin(userNameOrEmail: string, password: string): Observable<boolean>{
    const request: ILoginRequest = {userNameOrEmail, password};

    return this.authenticationService.loginAdmin(request).pipe(
      switchMap( (loginResponse: ILoginResponse) => {
        this.appStateService.setAccessToken(loginResponse.accessToken);
        this.appStateService.setRefreshToken(loginResponse.refreshToken);

        const payload = this.jwtService.parsePayload(loginResponse.accessToken);
        this.appStateService.setUsername(payload[JwtPayloadKeys.Username]);
        this.appStateService.setEmail(payload[JwtPayloadKeys.Email]);
        this.appStateService.setRole(payload[JwtPayloadKeys.Role]);

        return this.userService.getUserDetails(payload[JwtPayloadKeys.Username]);
      }),
      map((userDetails: IUserDetails) => {
        this.appStateService.setFirstName(userDetails.firstName);
        this.appStateService.setLastName(userDetails.lastName);
        this.appStateService.setUserId(userDetails.id);

        return true;
      }),
      catchError((err) => {
        this.appStateService.clearAppState();
        return of(false);
      })
    );
  }


  public logoutCustomer(): Observable<boolean> {

    return this.appStateService.getAppState().pipe(
      map((appState: IAppState) => {
        return appState;
      }),
      take(1),
      map((appState: IAppState) => {
        const request: ILogoutRequest = { userName: appState.username as string, refreshToken: appState.refreshToken as string };
        return request;
      }),
      switchMap((request: ILogoutRequest) => this.authenticationService.logoutCustomer(request)),
      map(() => {
        this.appStateService.clearAppState();
        return true;
      }),
      catchError((err) => {
        console.error(err);
        return of(false);
      })
    );
  }

  public logoutAdmin(): Observable<boolean> {
    return this.appStateService.getAppState().pipe(
      take(1),
      map((appState: IAppState) => {
        const request: ILogoutRequest = { userName: appState.username as string, refreshToken: appState.refreshToken as string };
        return request;
      }),
      switchMap((request: ILogoutRequest) => this.authenticationService.logoutAdmin(request)),
      map(() => {
        this.appStateService.clearAppState();
        return true;
      }),
      catchError((err) => {
        console.error(err);
        return of(false);
      })
    );
  }

}
