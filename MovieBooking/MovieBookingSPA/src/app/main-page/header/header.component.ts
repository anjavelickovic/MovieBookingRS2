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

    this.resetSearchParameters();
  }

  ngOnInit(): void {
  }

  public logout(): void {
    this.router.navigate(['/identity', 'logout']);
    this.resetSearchParameters();
  }

  public mainPage(): void {
    this.router.navigate(['/main']);
  }

  public profile(): void {
    this.router.navigate(['/identity', 'profile']);
    this.resetSearchParameters();
  }

  public search(userSearch: string): void {
    if(this.correctFormat(userSearch)){
      this.router.navigate(['/movies', 'search', this.searchCriteria, userSearch]);
      this.resetSearchParameters();
    }
  }
  
  public advancedSearch(): void{
    this.router.navigate(['/movies', 'search', 'advanced-search']);
    this.resetSearchParameters();
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

  private correctFormat(userSearch: string): boolean{

    if(userSearch.length === 0){
      window.alert("String is empty");
      return false;
    }
    
    const integerIntervalRegex = new RegExp('^[1-9][0-9]*, *[1-9][0-9]*$');
    const ratingIntervalRegex = new RegExp('^([1-9]([.][0-9])|10([.]0)?), ?([1-9]([.][0-9])|10([.]0)?)$');
    const genresRegex = new RegExp('^[-a-zA-Z]+(, *[-a-zA-Z]+(, *[-a-zA-Z]+)?)?$');
    const yearRegex = new RegExp('^[12][0-9]{3}$');
    const votesRegex = new RegExp('^[1-9][0-9]*$');

    switch(this.searchCriteria){
      case "runtime":
        var result = integerIntervalRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (lower bound, upper bound), where both bounds are positive integers (minutes).\nFor instance: (120, 150) for movies with length between 120 and 150 minutes.")
        return result;

      case "imdbRating":
        var result = ratingIntervalRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (lower bound, upper bound), where both bounds are positive floats smaller or equal to 10 with one digit after the decimal point.\nFor instance: (3.4, 6.2) for movies with IMDb rating between 3.4 and 6.2 (both inclusive)).")
        return result;

      case "genres":
        var result = genresRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (genre1, genre2, genre3), where genre1 is mandatory, and genre2 and genre3 are optional.\nFor instance: (action) for action movies or (comedy, drama) for movies with comedy and drama genres")
        return result;

      case "year":
        var result = yearRegex.test(userSearch);
        if(!result)
          window.alert("Year are number with 4 digits!");
        return result;

      case "imdbVotes":
        var result = votesRegex.test(userSearch);
        if(!result)
          window.alert("Votes are number!");
        return result;

      default:
        return true;
    }
  }

  private resetSearchParameters(): void{
    this.searchCriteria = 'title';
    this.searchCriteriaPlaceholderText = "Search for movie";
  }
}
