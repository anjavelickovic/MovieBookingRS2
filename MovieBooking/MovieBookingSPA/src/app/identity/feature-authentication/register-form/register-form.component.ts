import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, from, of, switchMap } from 'rxjs';
import { Role } from 'src/app/shared/app-state/role';
import { AuthenticationFacadeService } from '../../domain/application-services/authentication-facade.service';

interface IRegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  public registerForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;

  constructor(private authenticationService: AuthenticationFacadeService, 
    private formBuilder: UntypedFormBuilder,
    private router: Router) {

      this.showFormErrors = false;
      this.showServerError = false;

      this.registerForm = this.formBuilder.group({
        firstName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
        confirmPassword: ['', [Validators.required, this.confirmPasswordValidator()]]
      });

    }

  ngOnInit(): void {
  }

  private confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (!this.registerForm)
        return null;
      const passwordConfirmed = control.value === '' ? false : control.value === this.registerForm.get('password').value;
      return passwordConfirmed ? null : { unconfirmedPassword: true };
    }
  }

  public onRegisterFormSubmit(): void {
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.registerForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data: IRegisterFormData = this.registerForm.value as IRegisterFormData;

    this.authenticationService.registerCustomer(data.firstName, data.lastName, data.username, data.password, data.email)
    .pipe(
      switchMap(
        success => {
          this.registerForm.reset();
          // poziv login metode
          return this.authenticationService.login(data.email, data.password, Role.Customer);
        }),
      catchError((err) => {
        this.showServerError = true;
        console.log(err);
        return of(false);
    }))
    .subscribe(
      success => {
        if (success){
          this.router.navigate((['/main']));
    }})
  }

  public get firstName(){
    return this.registerForm.get('firstName');
  }

  public get lastName(){
    return this.registerForm.get('lastName');
  }

  public get username() {
    return this.registerForm.get('username');
  }

  public get email() {
    return this.registerForm.get('email');
  }

  public get password() {
    return this.registerForm.get('password');
  }

  public get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  public loginForm(): void {
    this.router.navigate((['/identity', 'login']));
  }

}
