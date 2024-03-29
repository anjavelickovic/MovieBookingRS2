import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesFacadeService } from '../../domain/application-services/movies-facade.service';
import { IMovieDetails } from '../../domain/models/movie-details';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  public searchCriteria: string;
  public userSearch: string;
  public movies: Array<IMovieDetails> = null;

  public sortBy: string;
  public sortedAscending: boolean;
  public listViewActive: boolean;
  public includeUpcomingMovies: boolean;
  public page: number;

  public NUMBER_OF_MOVIES_PER_PAGE_LIST_VIEW = 10;
  public NUMBER_OF_MOVIES_PER_PAGE_GRID_VIEW = 24;

  private activeSubs: Subscription[] = [];

  constructor(private movieService: MoviesFacadeService,
              private router: Router,
              private activatedRouter: ActivatedRoute  
            )
  {

  var paramsSub = this.activatedRouter.paramMap.pipe( 
    switchMap((params) => {
      this.searchCriteria = params.get('searchCriteria');
      this.userSearch = params.get('userSearch');
      this.showMovies();
      return this.activatedRouter.queryParams;
    })
    ).subscribe(queryParams => {
        this.sortBy = queryParams['sortBy'];
        this.sortedAscending = queryParams['sortAscending'] == "true";
        this.listViewActive = queryParams['listView'] == "true";
        this.includeUpcomingMovies = queryParams['includeUpcomingMovies'] == "true";
        this.page = parseInt(queryParams['page']) || -1;
        if(this.page === -1){
          this.firstPage();
        }
    });

    this.activeSubs.push(paramsSub);
  }

  ngOnInit(): void {
  }

  public showMovies(): void{
    switch(this.searchCriteria){

      case "id":
        this.handleSearchById();
        return;
      case "title":
        this.handleSearchByTitle();
        return;
      case "year":
        this.handleSearchByYear();
        return;
      case "runtime":
        this.handleSearchByRuntime();
        return;
      case "genres":
        this.handleSearchByGenres();
        return;
      case "director":
        this.handleSearchByDirector();
        return;
      case "mainActor":
        this.handleSearchByMainActor();
        return;
      case "imdbRating":
        this.handleSearchByImdbRating();
        return;
      case "imdbVotes":
        this.handleSearchByImdbVotes();
        return;
      default:
        window.alert("Error - bad URL");
        this.router.navigateByUrl('/main');
    }
  }

  private handleSearchById(): void {
    var movieSub = this.movieService.GetMovieById(this.userSearch).subscribe(
      (movie: IMovieDetails) => {
        this.movies = [movie];
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(movieSub);
  }

  private handleSearchByTitle(): void {
    var moviesSub = this.movieService.GetMoviesByTitle(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByYear(): void {
    var year = parseInt(this.userSearch);
    var moviesSub = this.movieService.GetMoviesByYear(year).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByRuntime(): void {
    var interval = this.userSearch.split(',');
    var lowerBound = parseInt(interval[0]);
    var upperBound =  parseInt(interval[1]);
    var moviesSub = this.movieService.GetMoviesByRuntime(lowerBound, upperBound).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  // example string: Action&Comedy&Drama/True
  private handleSearchByGenres(): void {
    var genres = this.userSearch.split(',');
    genres = genres.map(genre => genre.trimStart());

    var genresString = genres.join("&");

    var moviesSub = this.movieService.GetMoviesByGenres(genresString).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByDirector(): void {
    var moviesSub = this.movieService.GetMoviesByDirector(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByMainActor(): void {
    var moviesSub = this.movieService.GetMoviesByMainActor(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByImdbRating(): void {
    var interval = this.userSearch.split(',');
    var lowerBound = parseFloat(interval[0]);
    var upperBound =  parseFloat(interval[1]);
    var moviesSub = this.movieService.GetMoviesByImdbRating(lowerBound, upperBound).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  private handleSearchByImdbVotes(): void {
    var votes = parseInt(this.userSearch);
    var moviesSub = this.movieService.GetMoviesByImdbVotes(votes).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        if(this.checkInvalidPage())
          this.firstPage();
      }
    );

    this.activeSubs.push(moviesSub);
  }

  public moviePage(movieId: string): void {
    this.router.navigate((['/movies', movieId]));;
  }

  public toggleSort(): void{
    this.sortedAscending = !this.sortedAscending;
    this.sortMovies();
    this.updateUrl();
  }

  public onSelectChange(): void{
    this.sortMovies();
    this.updateUrl();
  }

  public sortMovies(): void{
    if(this.sortedAscending)
      this.movies = this.movies.sort( (movie1, movie2) => this.sort(movie1, movie2));
    else
      this.movies = this.movies.sort( (movie1, movie2) => this.sort(movie2, movie1));
  }

  private sort(movie1: IMovieDetails, movie2: IMovieDetails): number{

    switch (this.sortBy){

      case "title":
        return Number(movie1.title.localeCompare(movie2.title));
      case "year":
        return movie1.year - movie2.year;
      case "runtime":
        if (movie1.imdbRating == null)
          return this.sortedAscending ? 1 : -1;
        else if(movie2.imdbRating == null)
          return this.sortedAscending ? -1 : 1;
        return Number(movie1.runtime.localeCompare(movie2.runtime));
      case "imdbRating":
        if (movie1.imdbRating == null)
          return this.sortedAscending ? 1 : -1;
        else if(movie2.imdbRating == null)
          return this.sortedAscending ? -1 : 1;
        return Number(movie1.imdbRating - movie2.imdbRating);
      case "imdbVotes":
        if (movie1.imdbVotes == null)
          return this.sortedAscending ? 1 : -1;
        else if(movie2.imdbVotes == null)
          return this.sortedAscending ? -1 : 1;
        return Number(movie1.imdbVotes - movie2.imdbVotes);
      default:
        return 1;
    }
  }

  public listView(): void{
    this.listViewActive = true;
    this.firstPage();
  }

  public gridView(): void{
    this.listViewActive = false;
    this.firstPage();
  }

  public onCheckboxChange(): void{
    this.includeUpcomingMovies = !this.includeUpcomingMovies;
    this.firstPage();
  }

  public activeButtonClass(button: string){

    return {
      'btn': true,
      'active': (this.listViewActive === true) ? button==='list' : !(button==='list')
    }

  }

  public firstPage(){
    this.page = 1;
    this.updateUrl();
  }
  public previousPage(){
    this.page -= 1;
    this.updateUrl();
  }
  public nextPage(){
    this.page += 1;
    this.updateUrl();
  }
  public lastPage(){
    this.page = this.numberOfPages();
    this.updateUrl();
  }

  public updateUrl(){
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });

    this.router.navigate([], {
      relativeTo: this.activatedRouter,
      queryParams: this.getQueryParameters()
    });
    
  }

  public getQueryParameters(){
    return {
      sortBy: this.sortBy,
      sortAscending: this.sortedAscending,
      listView: this.listViewActive,
      includeUpcomingMovies: this.includeUpcomingMovies,
      page: this.page
    };
  }

  public numberOfPages(): number{
    var numberOfUpcomingMovies = 0;
    if(!this.includeUpcomingMovies){
      numberOfUpcomingMovies = this.movies.filter(movie => movie.imdbVotes === null).length;
    }

    var totalNumberOfMovies = this.movies.length - numberOfUpcomingMovies;
    var numberOfMoviesPerPage = this.listViewActive ? this.NUMBER_OF_MOVIES_PER_PAGE_LIST_VIEW : this.NUMBER_OF_MOVIES_PER_PAGE_GRID_VIEW;
    
    return Math.ceil(totalNumberOfMovies / numberOfMoviesPerPage);
  }

  public checkInvalidPage(): boolean{
    return this.page > this.numberOfPages();
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
