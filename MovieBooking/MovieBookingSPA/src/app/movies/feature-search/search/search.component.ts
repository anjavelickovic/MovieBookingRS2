import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesFacadeService } from '../../domain/application-services/movies-facade.service';
import { IMovieDetails } from '../../domain/models/movie-details';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public searchCriteria: string;
  public userSearch: string;
  public movies: Array<IMovieDetails>;
  public arrowUpVisible: boolean;
  public sortCriteria: string;

  constructor(private movieService: MoviesFacadeService,
              private router: Router,
              private activatedRouter: ActivatedRoute  
            )
  {
    this.activatedRouter.paramMap.subscribe((params) => {
      this.searchCriteria = params.get('searchCriteria');
      if(this.searchCriteria == null)
        this.searchCriteria = "advanced-search";
      this.userSearch = params.get('userSearch');
    });

    this.arrowUpVisible = false;
    this.sortCriteria = "title";
  }

  ngOnInit(): void {

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
      case "advanced-search":
        window.alert("advanced search");
        return;
      default:
        window.alert("error");
        this.router.navigate(['/main']);
    }
  }

  private handleSearchById(): void {
    this.movieService.GetMovieById(this.userSearch).subscribe(
      (movie: IMovieDetails) => {
        this.movies = [movie];
        console.log(this.movies);
      }
    )
  }

  private handleSearchByTitle(): void {
    this.movieService.GetMoviesByTitle(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByYear(): void {
    var year = parseInt(this.userSearch);
    this.movieService.GetMoviesByYear(year).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByRuntime(): void {
    var interval = this.userSearch.split(',');
    var lowerBound = parseInt(interval[0]);
    var upperBound =  parseInt(interval[1]);
    this.movieService.GetMoviesByRuntime(lowerBound, upperBound).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  // example string: Action&Comedy&Drama/True
  private handleSearchByGenres(): void {
    var genres = this.userSearch.split(',');
    genres = genres.map(genre => genre.trimStart());

    var genresString = genres.join("&");

    this.movieService.GetMoviesByGenres(genresString).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByDirector(): void {
    this.movieService.GetMoviesByDirector(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByMainActor(): void {
    this.movieService.GetMoviesByMainActor(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByImdbRating(): void {
    var interval = this.userSearch.split(',');
    var lowerBound = parseFloat(interval[0]);
    var upperBound =  parseFloat(interval[1]);
    this.movieService.GetMoviesByImdbRating(lowerBound, upperBound).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  private handleSearchByImdbVotes(): void {
    var votes = parseInt(this.userSearch);
    this.movieService.GetMoviesByImdbVotes(votes).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        this.sortMovies();
        console.log(this.movies);
      }
    )
  }

  public moviePage(movieId: string): void {
    this.router.navigate((['/movies', movieId]));;
  }

  public toggleArrow(): void{
    this.arrowUpVisible = !this.arrowUpVisible;
    this.sortMovies();
    console.log(this.movies);
  }

  public onSelectChange(): void{
    this.arrowUpVisible = true;
    this.sortMovies();
  }

  public sortMovies(): void{
    if(!this.arrowUpVisible)
      this.movies = this.movies.sort( (movie1, movie2) => this.sort(movie1, movie2));
    else
      this.movies = this.movies.sort( (movie1, movie2) => this.sort(movie2, movie1));
  }

  private sort(movie1: IMovieDetails, movie2: IMovieDetails): number{

    switch (this.sortCriteria){

      case "title":
        return Number(movie1.title.localeCompare(movie2.title));
      case "year":
        return movie1.year - movie2.year;
      case "runtime":
        if (movie1.imdbRating == null)
          return this.arrowUpVisible ? -1 : 1;
        else if(movie2.imdbRating == null)
          return this.arrowUpVisible ? 1 : -1;
        return Number(movie1.runtime.localeCompare(movie2.runtime));
      case "imdbRating":
        if (movie1.imdbRating == null)
          return this.arrowUpVisible ? -1 : 1;
        else if(movie2.imdbRating == null)
          return this.arrowUpVisible ? 1 : -1;
        return Number(movie1.imdbRating - movie2.imdbRating);
      case "imdbVotes":
        if (movie1.imdbVotes == null)
          return this.arrowUpVisible ? -1 : 1;
        else if(movie2.imdbVotes == null)
          return this.arrowUpVisible ? 1 : -1;
        return Number(movie1.imdbVotes - movie2.imdbVotes);
      default:
        return 1;
    }

    
  }

}
