import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginRequest } from '../models/login-request';
import { ILoginResponse } from '../models/login-response';
import { IRegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly urlCustomer: string = 'http://localhost:4000/api/v1/CustomerAuthentication';
  private readonly urlAdmin: string = 'http://localhost:4000/api/v1/AdminAuthentication';

  constructor(private httpClient: HttpClient) {}

  public loginCustomer(request: ILoginRequest): Observable<ILoginResponse> {
    return this.httpClient.post<ILoginResponse>(`${this.urlCustomer}/LoginCustomer`, request);
  }

  public registerCustomer(request: IRegisterRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.post(`${this.urlCustomer}/RegisterCustomer`, body, {headers: headers, responseType: 'text'});
  }

  public loginAdmin(request: ILoginRequest): Observable<ILoginResponse> {
    return this.httpClient.post<ILoginResponse>(`${this.urlAdmin}/LoginAdmin`, request);
  }

}
