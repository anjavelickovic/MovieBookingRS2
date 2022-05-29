import { Component, OnInit } from '@angular/core';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public appState: IAppState;

  constructor(private appStateService: AppStateService) {

    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

   }

  ngOnInit(): void {
  }

  public logout(): void {
    // this.router.navigate(['']);
    window.alert("logout")
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
