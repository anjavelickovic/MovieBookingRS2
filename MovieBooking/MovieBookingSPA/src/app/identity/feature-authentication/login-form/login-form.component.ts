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

  constructor(private authenticationService: AuthenticationFacadeService, 
              private formBuilder: UntypedFormBuilder,
              private router: Router) {

    this.showFormErrors = false;
    this.showServerError = false;

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
    
    if (this.loginForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data: ILoginFormData = this.loginForm.value as ILoginFormData;

    forkJoin([
      this.authenticationService.login(data.usernameOrEmail, data.password, Role.Customer).pipe(catchError(error => of(error))),
      this.authenticationService.login(data.usernameOrEmail, data.password, Role.Admin).pipe(catchError(error => of(error)))
    ])
    .subscribe(
      result => {
        if(result[0] || result[1]){
          this.router.navigate((['/main']));
        }
        else{
          this.showServerError = true;
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
