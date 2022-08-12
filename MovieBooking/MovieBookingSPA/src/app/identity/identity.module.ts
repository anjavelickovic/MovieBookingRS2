import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';
import { IdentityComponent } from './identity.component';
import { LoginFormComponent } from './feature-authentication/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './feature-authentication/register-form/register-form.component';
import { MainPageModule } from '../main-page/main-page.module';
import { LogoutComponent } from './feature-authentication/logout/logout.component';
import { UserProfileComponent } from './feature-user-info/user-profile/user-profile.component';


@NgModule({
  declarations: [
    IdentityComponent,
    LoginFormComponent,
    RegisterFormComponent,
    LogoutComponent
    LogoutComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ReactiveFormsModule,
    MainPageModule
  ]
})
export class IdentityModule { }
