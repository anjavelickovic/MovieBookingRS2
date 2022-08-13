import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { UserFacadeService } from '../../domain/application-services/user-facade.service';

@Component({
  selector: 'app-change-user-info',
  templateUrl: './change-user-info.component.html',
  styleUrls: ['./change-user-info.component.css']
})
export class ChangeUserInfoComponent implements OnInit {
  
  public passwordChangeForm: UntypedFormGroup;
  public firstNameChangeForm: UntypedFormGroup;
  public lastNameChangeForm: UntypedFormGroup;
  public usernameChangeForm: UntypedFormGroup;
  public emailChangeForm: UntypedFormGroup;

  public showPasswordErrors: boolean;
  public showFirstNameChangeFormErrors: boolean;
  public showLastNameChangeFormErrors: boolean;
  public showUsernameChangeFormErrors: boolean;
  public showEmailChangeFormErrors: boolean;

  public showPasswordChangeForm: boolean;
  public showFirstNameChangeForm: boolean;
  public showLastNameChangeForm: boolean;
  public showUsernameChangeForm: boolean;
  public showEmailChangeForm: boolean;

  constructor(private formBuilder: UntypedFormBuilder, private userService: UserFacadeService,
              private appStateService: AppStateService, private router: Router) {

    this.passwordChangeForm = this.formBuilder.group({
      passwordChangePassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
      confirmNewPassword: ['', [Validators.required, this.confirmPasswordValidator()]]
    });

    this.firstNameChangeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      passwordChangeFirstName: ['', [Validators.required]]
    });

    this.lastNameChangeForm = this.formBuilder.group({
      lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      passwordChangeLastName: ['', [Validators.required]]
    });

    this.usernameChangeForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      passwordChangeUsername: ['', [Validators.required]]
    });
    this.emailChangeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwordChangeEmail: ['', [Validators.required]]
    });

    this.restartErrors();
    this.restartForms();
    this.showPasswordChangeForm = true;
   }

  ngOnInit(): void {
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (!this.passwordChangeForm)
        return null;
      const passwordConfirmed = control.value === '' ? false : control.value === this.passwordChangeForm.get('newPassword').value;
      return passwordConfirmed ? null : { unconfirmedPassword: true };
    }
  }

  public onPasswordChangeSubmit(): void {
    this.restartErrors();
    
    if (this.passwordChangeForm.invalid) {
      this.showPasswordErrors = true;
      return;
    }

    const currentPassword = this.passwordChangeForm.value.passwordChangePassword;
    const newPassword = this.passwordChangeForm.value.newPassword;
    
    this.userService.changeUserPassword(currentPassword, newPassword).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 403)
          window.alert("Wrong password");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean) => {
        if(result){
          window.alert("Password successfully changed")
          this.router.navigate((['/identity', 'profile']));
        }
      }
    )

  }

  public onFirstNameChangeSubmit(): void{
    this.restartErrors();
    
    if (this.firstNameChangeForm.invalid) {
      this.showFirstNameChangeFormErrors = true;
      this.showPasswordErrors = true;
      return;
    }

    const firstName = this.firstNameChangeForm.value.firstName;
    const password = this.firstNameChangeForm.value.passwordChangeFirstName;
    
    this.userService.changeFirstName(firstName, password).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 403)
          window.alert("Wrong password");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean) => {
        if(result){
          window.alert("First name successfully changed")
          this.appStateService.setFirstName(firstName);
          this.router.navigate((['/identity', 'profile']));
        }
      }
    )
  }

  public onLastNameChangeSubmit(): void{
    this.restartErrors();
    
    if (this.lastNameChangeForm.invalid) {
      this.showLastNameChangeFormErrors = true;
      this.showPasswordErrors = true;
      return;
    }

    const lastName = this.lastNameChangeForm.value.lastName;
    const password = this.lastNameChangeForm.value.passwordChangeLastName;
    
    this.userService.changeLastName(lastName, password).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 403)
          window.alert("Wrong password");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean) => {
        if(result){
          window.alert("Last name successfully changed")
          this.appStateService.setLastName(lastName);
          this.router.navigate((['/identity', 'profile']));
        }
      }
    )
  }

  public onUsernameChangeSubmit(): void{
    this.restartErrors();
    
    if (this.usernameChangeForm.invalid) {
      this.showUsernameChangeFormErrors = true;
      this.showPasswordErrors = true;
      return;
    }

    const username = this.usernameChangeForm.value.username;
    const password = this.usernameChangeForm.value.passwordChangeUsername;
    
    this.userService.changeUsername(username, password).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 403)
          window.alert("Wrong password");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean) => {
        if(result){
          window.alert("Username successfully changed")
          this.appStateService.setUsername(username);
          this.router.navigate((['/identity', 'profile']));
        }
      }
    )
  }

  public onEmailChangeSubmit(): void{
    this.restartErrors();
    
    if (this.emailChangeForm.invalid) {
      this.showEmailChangeFormErrors = true;
      this.showPasswordErrors = true;
      return;
    }

    const email = this.emailChangeForm.value.email;
    const password = this.emailChangeForm.value.passwordChangeEmail;
    
    this.userService.changeUserEmail(email, password).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if(err.status === 403)
          window.alert("Wrong password");
        else
          window.alert("Internal server error");
        return of(false);
    })
    ).subscribe(
      (result: boolean) => {
        if(result){
          window.alert("Email successfully changed")
          this.appStateService.setEmail(email);
          this.router.navigate((['/identity', 'profile']));
        }
      }
    )

  }

  public get passwordChangePassword(){
    return this.passwordChangeForm.get('passwordChangePassword');
  }

  public get newPassword(){
    return this.passwordChangeForm.get('newPassword');
  }

  public get confirmNewPassword(){
    return this.passwordChangeForm.get('confirmNewPassword');
  }

  public get firstName(){
    return this.firstNameChangeForm.get('firstName');
  }

  public get passwordChangeFirstName(){
    return this.firstNameChangeForm.get('passwordChangeFirstName');
  }

  public get lastName(){
    return this.lastNameChangeForm.get('lastName');
  }

  public get passwordChangeLastName(){
    return this.lastNameChangeForm.get('passwordChangeLastName');
  }

  public get username(){
    return this.usernameChangeForm.get('username');
  }

  public get passwordChangeUsername(){
    return this.usernameChangeForm.get('passwordChangeUsername');
  }

  public get email(){
    return this.emailChangeForm.get('email');
  }

  public get passwordChangeEmail(){
    return this.emailChangeForm.get('passwordChangeEmail');
  }

  private restartErrors(): void {
    this.showPasswordErrors = false;
    this.showFirstNameChangeFormErrors = false;
    this.showLastNameChangeFormErrors = false;
    this.showUsernameChangeFormErrors = false;
    this.showEmailChangeFormErrors = false;
  }

  private restartForms(): void {
    this.passwordChangeForm.reset();
    this.firstNameChangeForm.reset();
    this.lastNameChangeForm.reset();
    this.usernameChangeForm.reset();
    this.emailChangeForm.reset();

    this.showPasswordChangeForm = false;
    this.showFirstNameChangeForm = false;
    this.showLastNameChangeForm = false;
    this.showUsernameChangeForm = false;
    this.showEmailChangeForm = false;
  }

  public option(selectedOption: string) {
    this.restartErrors();
    this.restartForms();

    switch(selectedOption) { 
      case "changePassword": { 
        this.showPasswordChangeForm = true;
        break; 
      } 
      case "changeFirstName": { 
        this.showFirstNameChangeForm = true;
        break; 
      }
      case "changeLastName": { 
        this.showLastNameChangeForm = true;
        break; 
      }
      case "changeUsername": { 
        this.showUsernameChangeForm = true;
        break; 
      }
      case "changeEmail": { 
        this.showEmailChangeForm = true;
        break; 
      }
   }
    
  }

  public isActive (option: string){
    switch(option) { 
      case "changePassword": { 
        return {'active': this.showPasswordChangeForm}
      } 
      case "changeFirstName": { 
        return {'active': this.showFirstNameChangeForm}
      }
      case "changeLastName": { 
        return {'active': this.showLastNameChangeForm}
      }
      case "changeUsername": { 
        return {'active': this.showUsernameChangeForm}
      }
      case "changeEmail": { 
        return {'active': this.showEmailChangeForm}
      }
      default: {
        return {'active': false}
      }

   }
  }
  

}
