import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesFacadeService } from '../../domain/application-services/movies-facade.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

  public movieId: string = "";

  constructor(private movieService: MoviesFacadeService,
              private router: Router) { }
          
  public addMovie(){

    if(this.movieId.length === 0){
      window.alert("String is empty");
      return;
    }
    
    this.movieService.CreateMovie(this.movieId).subscribe({
      next: () => {
        window.alert("Movie successfully added");
        this.router.navigate(['/movies', this.movieId]);
      },
      error: (err) => {
        console.log(err);
        if(err.status === 409)
          window.alert("Movie already in database");
        else if(err.status === 500 || err.status === 0){
          window.alert("Internal server error");
        }
        else{
          window.alert("Movie creation error - not an id for movie");
        }
      }
    }
    );
  }

  ngOnInit(): void {
  }

}
