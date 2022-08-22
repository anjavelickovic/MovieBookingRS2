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
        console.log(this.movies);
      }
    )
  }

  private handleSearchByYear(): void {
    var year = parseInt(this.userSearch);
    this.movieService.GetMoviesByYear(year).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
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
        console.log(this.movies);
      }
    )
  }

  private handleSearchByDirector(): void {
    this.movieService.GetMoviesByDirector(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        console.log(this.movies);
      }
    )
  }

  private handleSearchByMainActor(): void {
    this.movieService.GetMoviesByMainActor(this.userSearch).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
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
        console.log(this.movies);
      }
    )
  }

  private handleSearchByImdbVotes(): void {
    var votes = parseInt(this.userSearch);
    this.movieService.GetMoviesByImdbVotes(votes).subscribe(
      (movies: Array<IMovieDetails>) => {
        this.movies = movies;
        console.log(this.movies);
      }
    )
  }

}
