import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../infrastructure/user.service';
import { IChangeFirstNameRequest } from '../models/change-first-name-request';
import { IChangeLastNameRequest } from '../models/change-last-name-request';
import { IChangeUserEmailRequest } from '../models/change-user-email-request';
import { IChangeUserPasswordRequest } from '../models/change-user-password-request';
import { IChangeUsernameRequest } from '../models/change-username-request';
import { IUserDetails } from '../models/user-details';

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(private userService: UserService) {}

  public getUserDetails(usernameOrEmail: string): Observable<IUserDetails> {
    return this.userService.getUserDetails(usernameOrEmail);
  }

  public getAllUsersDetails(): Observable<Array<IUserDetails>>{
    return this.userService.getAllUsersDetails();
  }
  
  public changeFirstName(newFirstName: string, password: string): Observable<boolean> {
    const request: IChangeFirstNameRequest = {newFirstName, password};
    return this.userService.changeFirstName(request);
  }

  public changeLastName(newLastName: string, password: string): Observable<boolean> {
    const request: IChangeLastNameRequest = {newLastName, password};
    return this.userService.changeLastName(request);
  }

  public changeUsername(newUsername: string, password: string): Observable<boolean> {
    const request: IChangeUsernameRequest = {newUsername, password};
    return this.userService.changeUsername(request);
  }

  public changeUserEmail(newEmail: string, password: string): Observable<boolean> {
    const request: IChangeUserEmailRequest = {newEmail, password};
    return this.userService.changeUserEmail(request);
  }

  public changeUserPassword(oldPassword: string, newPassword: string): Observable<boolean> {
    const request: IChangeUserPasswordRequest = {oldPassword, newPassword};
    return this.userService.changeUserPassword(request);
  }
}
