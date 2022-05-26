import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
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

  public loginForm: FormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;

  constructor(private authenticationService: AuthenticationFacadeService, 
              private formBuilder: FormBuilder,
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
      this.authenticationService.loginAdmin(data.usernameOrEmail, data.password).pipe(catchError(error => of(error))),
      this.authenticationService.loginCustomer(data.usernameOrEmail, data.password).pipe(catchError(error => of(error)))
    ])
    .subscribe(
      result => {
        if(result[0] || result[1]){
        // rutiranje na pocetnu stranu
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
