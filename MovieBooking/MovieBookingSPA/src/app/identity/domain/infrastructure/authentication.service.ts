import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/shared/app-state/role';
import { ILoginRequest } from '../models/login-request';
import { ILoginResponse } from '../models/login-response';
import { ILogoutRequest } from '../models/logout-request';
import { IRefreshTokenRequest } from '../models/refresh-token-request';
import { IRefreshTokenResponse } from '../models/refresh-token-response';
import { IRegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly urlCustomer: string = 'http://localhost:4000/api/v1/CustomerAuthentication';
  private readonly urlAdmin: string = 'http://localhost:4000/api/v1/AdminAuthentication';

  constructor(private httpClient: HttpClient) {}

  public login(request: ILoginRequest, role: Role): Observable<ILoginResponse> {
    const url = (role === 'Customer') ? this.urlCustomer : this.urlAdmin;
    return this.httpClient.post<ILoginResponse>(`${url}/Login${role}`, request);
  }

  public registerCustomer(request: IRegisterRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.post(`${this.urlCustomer}/RegisterCustomer`, body, {headers: headers, responseType: 'text'});
  }

  public refreshToken(request: IRefreshTokenRequest, role: Role): Observable<IRefreshTokenResponse> {
    const url = (role === 'Customer') ? this.urlCustomer : this.urlAdmin;
    return this.httpClient.post<IRefreshTokenResponse>(`${url}/Refresh`, request);
  }

  public logout(request: ILogoutRequest, role: Role): Observable<any> {
    const url = (role === 'Customer') ? this.urlCustomer : this.urlAdmin;
    return this.httpClient.post(`${url}/Logout`, request);
  }

}
