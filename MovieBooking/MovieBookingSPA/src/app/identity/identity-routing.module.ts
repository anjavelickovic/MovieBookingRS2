import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { NotAuthenticatedGuard } from '../shared/guards/not-authenticated.guard';
import { LoginFormComponent } from './feature-authentication/login-form/login-form.component';
import { LogoutComponent } from './feature-authentication/logout/logout.component';
import { RegisterFormComponent } from './feature-authentication/register-form/register-form.component';
import { ChangeUserInfoComponent } from './feature-user-info/change-user-info/change-user-info.component';
import { UserProfileComponent } from './feature-user-info/user-profile/user-profile.component';
import { IdentityComponent } from './identity.component';

const routes: Routes = [
  { path: '', component: IdentityComponent, 
              children: [{ path: 'login', component: LoginFormComponent },
                         { path: 'register', component: RegisterFormComponent}], 
              canActivate: [AuthenticatedGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'profile/changeuserinfo', component: ChangeUserInfoComponent, canActivate: [NotAuthenticatedGuard]},
  { path: 'logout', component: LogoutComponent, canActivate: [NotAuthenticatedGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
