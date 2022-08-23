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
    console.log(this.searchCriteria);
    console.log(this.userSearch);
  }

}
