import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

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

  public mainPage(): void {
    this.router.navigate(['\main']);
  }

  public profile(): void {
    this.router.navigate(['\identity', 'profile']);
  }

  public logout(): void {
    this.router.navigate(['\identity', 'logout']);
  }

}
