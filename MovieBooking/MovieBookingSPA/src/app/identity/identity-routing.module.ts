import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './feature-authentication/login-form/login-form.component';
import { LogoutComponent } from './feature-authentication/logout/logout.component';
import { RegisterFormComponent } from './feature-authentication/register-form/register-form.component';
import { IdentityComponent } from './identity.component';

const routes: Routes = [
  { path: '', component: IdentityComponent, 
              children: [{ path: 'login', component: LoginFormComponent },
                         { path: 'register', component: RegisterFormComponent}] },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
