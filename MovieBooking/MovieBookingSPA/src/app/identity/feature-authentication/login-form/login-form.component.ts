import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { Role } from 'src/app/shared/app-state/role';
import { AuthenticationFacadeService } from '../../domain/application-services/authentication-facade.service';

interface ILoginFormData {
  usernameOrEmail: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  private internalServerError: boolean;

  constructor(private authenticationService: AuthenticationFacadeService, 
              private formBuilder: UntypedFormBuilder,
              private router: Router) {

    this.showFormErrors = false;
    this.showServerError = false;
    this.internalServerError = false;

    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

   }

  ngOnInit(): void {
  }

  public onLoginFormSubmit(): void {

    this.showFormErrors = false;
    this.showServerError = false;
    this.internalServerError = false

    
    if (this.loginForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data: ILoginFormData = this.loginForm.value as ILoginFormData;

    forkJoin([
      this.authenticationService.login(data.usernameOrEmail, data.password, Role.Customer).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status !== 401){
            this.internalServerError = true;
          }
          return of(false);
        })
      ),
      this.authenticationService.login(data.usernameOrEmail, data.password, Role.Admin).pipe(
        catchError((err: HttpErrorResponse) => {
          if(err.status !== 401){
            this.internalServerError = true;
          }
          return of(false);
        })
      )
    ])
    .subscribe(
      result => {
        if(result[0] || result[1]){
          this.router.navigate((['/main']));
        }
        else{
          if(this.internalServerError){
            window.alert("Internal server error");
          }
          else{
            this.showServerError = true;}
        }
      }
    )

    this.loginForm.reset();

  }

  public registerForm(): void {
    this.router.navigate((['/identity', 'register']));
  }

  public get usernameOrEmail() {
    return this.loginForm.get('usernameOrEmail');
  }

  public get password() {
    return this.loginForm.get('password');
  }

}
