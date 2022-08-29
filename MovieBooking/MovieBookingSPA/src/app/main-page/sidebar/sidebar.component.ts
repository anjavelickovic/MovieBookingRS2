import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { Role } from 'src/app/shared/app-state/role';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  public appState: IAppState;

  private activeSubs: Subscription[] = [];

  constructor(private appStateService: AppStateService, private router: Router) {

    var appStateSub = this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.activeSubs.push(appStateSub);
   }

  ngOnInit(): void {
  }

  public isAdmin(){
    return this.appState.hasRole(Role.Admin);
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

  public theaterHall(): void {
    this.router.navigate(['/theater-hall']);
  }

  public projection(): void {
    this.router.navigate(['/projection']);
  }

  public reservations(): void {
    this.router.navigate(['/reservations']);
  }

  public reservationHistory(): void {
    this.router.navigate(['/administration']);
  }

  public discount(): void {
    this.router.navigate(['/discount']);
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
