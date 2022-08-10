import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationFacadeService } from 'src/app/identity/domain/application-services/authentication-facade.service';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public appState: IAppState;

  constructor(private appStateService: AppStateService, 
              private authenticationService: AuthenticationFacadeService, private router: Router) {

    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

  }

  ngOnInit(): void {
  }

  public logout(): void {
    if(this.appState.role === 'Customer'){
      this.authenticationService.logout().subscribe(value => {});
    }
    else{
      this.authenticationService.logout().subscribe(value => {});
    }

    this.router.navigate(['\identity', 'logout']);

  }

  public profile(): void {
    window.alert("profile")
  }

  public getMovie(): void {
    window.alert("get movie")
  }

  public advancedSearch(): void{
    window.alert("advanced search")
  }
}
