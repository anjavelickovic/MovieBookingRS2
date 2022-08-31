import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IAppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public appState: IAppState;
  public searchCriteria: string;
  public searchCriteriaPlaceholderText: string;
  public userSearch: string;

  private integerIntervalRegex = new RegExp('^[1-9][0-9]*, *[1-9][0-9]*$');
  private ratingIntervalRegex = new RegExp('^([1-9]([.][0-9])|10([.]0)?), ?([1-9]([.][0-9])|10([.]0)?)$');
  private genresRegex = new RegExp('^[-a-zA-Z]+(, *[-a-zA-Z]+(, *[-a-zA-Z]+)?)?$');
  private yearRegex = new RegExp('^[12][0-9]{3}$');
  private votesRegex = new RegExp('^[1-9][0-9]*$');

  private activeSubs: Subscription[] = [];

  constructor(private appStateService: AppStateService, private router: Router) {

    var appStateSub = this.appStateService.getAppState().subscribe(
      (appState: IAppState) => {
        this.appState = appState;
      }
    );

    this.activeSubs.push(appStateSub);
    this.resetSearchParameters();
  }

  ngOnInit(): void {
  }

  public mainPage(): void {
    this.router.navigate(['/main']);
  }

  public profile(): void {
    this.router.navigate(['/identity', 'profile']);
    this.resetSearchParameters();
  }

  public search(): void {
    if(this.correctFormat(this.userSearch)){
      this.router.navigate(['/movies', 'search', this.searchCriteria, this.userSearch], {
        queryParams: {
          sortBy: "imdbRating",
          sortAscending: false,
          listView: true,
          includeUpcomingMovies: true,
          page: 1
        },
      });
      this.resetSearchParameters();
    }
  }

  public isMainPage(): boolean{
    return this.router.url === '/main';
  }

  public isSearchPage(): boolean{
    return this.router.url.includes("/search");
  }

  public isAuthenticated(): boolean{
    const value = this.router.url === '/identity/login' ||
                  this.router.url === '/identity/register' ||
                  this.router.url === '/identity/logout';

    return !value;
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

    switch(this.searchCriteria){
      case "runtime":
        var result = this.integerIntervalRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (lower bound, upper bound), where both bounds are positive integers (minutes).\nFor instance: (120, 150) for movies with length between 120 and 150 minutes.")
        return result;

      case "imdbRating":
        var result = this.ratingIntervalRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (lower bound, upper bound), where both bounds are positive floats smaller or equal to 10 with one digit after the decimal point.\nFor instance: (3.4, 6.2) for movies with IMDb rating between 3.4 and 6.2 (both inclusive)).")
        return result;

      case "genres":
        var result = this.genresRegex.test(userSearch);
        if(!result)
          window.alert("Wrong input format!\nCorrect format is (genre1, genre2, genre3), where genre1 is mandatory, and genre2 and genre3 are optional.\nFor instance: (action) for action movies or (comedy, drama) for movies with comedy and drama genres")
        return result;

      case "year":
        var result = this.yearRegex.test(userSearch);
        if(!result)
          window.alert("Year are number with 4 digits!");
        return result;

      case "imdbVotes":
        var result = this.votesRegex.test(userSearch);
        if(!result)
          window.alert("Votes are number!");
        return result;

      default:
        return true;
    }
  }

  private resetSearchParameters(): void{
    this.userSearch = "";
    this.searchCriteria = "title";
    this.searchCriteriaPlaceholderText = "Search for movie";
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
