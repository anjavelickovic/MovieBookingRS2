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
  public searchCriteria: string;
  public searchCriteriaPlaceholderText: string;

  constructor(private appStateService: AppStateService, private router: Router) {

    this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.searchCriteria = "title";
    this.searchCriteriaPlaceholderText = "Search for movie";

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

  public search(userSearch: string): void {
    this.router.navigate(['/movies', 'search', this.searchCriteria, userSearch]);
  }
  
  public advancedSearch(): void{
    this.router.navigate(['/movies', 'search', 'advanced-search']);
  }

  public isMainPage(): boolean{
    return this.router.url === '/main';
  }

  public changeSearchCriteriaPlaceholderText(): void {

    switch(this.searchCriteria){
      case "id":
      case "title":
      case "year":
      case "director":
      case "mainActor":    
        this.searchCriteriaPlaceholderText = "Search for movie";
        return;

      case "runtime":
      case "imdbRating":
        this.searchCriteriaPlaceholderText = "Format: (lb, ub)";
        return;

      case "genres":
        this.searchCriteriaPlaceholderText = "Format: (g1, g2, g3)";
        return;

      case "imdbVotes":
        this.searchCriteriaPlaceholderText = "Format: lower bound";
        return;
    }
  }
}
