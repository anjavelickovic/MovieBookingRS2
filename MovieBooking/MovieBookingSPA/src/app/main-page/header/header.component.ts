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

  constructor(private appStateService: AppStateService, private router: Router) {

    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

  }

  ngOnInit(): void {
  }

  public logout(): void {
    this.router.navigate(['/identity', 'logout']);
  }

  public mainPage(): void {
    this.router.navigate(['/main']);
  }

  public profile(): void {
    this.router.navigate(['/identity', 'profile']);
  }

  public getMovie(): void {
    window.alert("get movie")
  }

  public advancedSearch(): void{
    window.alert("advanced search")
  }

  public isMainPage(): boolean{
    return this.router.url === '/main'
  }
}
