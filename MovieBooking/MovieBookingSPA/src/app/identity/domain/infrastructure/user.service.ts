import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChangeFirstNameRequest } from '../models/change-first-name-request';
import { IChangeLastNameRequest } from '../models/change-last-name-request';
import { IChangeUserEmailRequest } from '../models/change-user-email-request';
import { IChangeUserPasswordRequest } from '../models/change-user-password-request';
import { IChangeUsernameRequest } from '../models/change-username-request';
import { IUserDetails } from '../models/user-details';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private url = `http://localhost:4000/api/v1/User`;

  constructor(private httpClient: HttpClient) {}

  public getUserDetails(usernameOrEmail: string): Observable<IUserDetails> {
    return this.httpClient.get<IUserDetails>(`${this.url}/${usernameOrEmail}`);
  }

  public getAllUsersDetails(): Observable<Array<IUserDetails>> {
    return this.httpClient.get<Array<IUserDetails>>(`${this.url}/GetAllUsers`);
  }

  public changeFirstName(request: IChangeFirstNameRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.put(`${this.url}/ChangeFirstName`, body, {headers: headers, responseType: 'text'});
  }

  public changeLastName(request: IChangeLastNameRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.put(`${this.url}/ChangeLastName`, body, {headers: headers, responseType: 'text'});
  }

  public changeUsername(request: IChangeUsernameRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.put(`${this.url}/ChangeUserName`, body, {headers: headers, responseType: 'text'});
  }

  public changeUserEmail(request: IChangeUserEmailRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.put(`${this.url}/ChangeUserEmail`, body, {headers: headers, responseType: 'text'});
  }

  public changeUserPassword(request: IChangeUserPasswordRequest): Observable<any> {
    let body = JSON.stringify(request);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.put(`${this.url}/ChangeUserPassword`, body, {headers: headers, responseType: 'text'});
  }
}