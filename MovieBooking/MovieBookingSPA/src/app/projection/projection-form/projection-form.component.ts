import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, switchMap } from 'rxjs';
import { MoviesFacadeService } from 'src/app/movies/domain/application-services/movies-facade.service';
import { IMovieDetails } from 'src/app/movies/domain/models/movie-details';
import { TheaterHallFacadeService } from 'src/app/theater-hall/domain/application-services/theater-hall-facade.service';
import { ITheaterHall } from 'src/app/theater-hall/domain/models/theater-hall.model';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IFormProjection } from '../domain/models/form-projection.model';

@Component({
  selector: 'app-projection-form',
  templateUrl: './projection-form.component.html',
  styleUrls: ['./projection-form.component.css']
})
export class ProjectionFormComponent implements OnInit, OnDestroy {

  public modalReference: NgbModalRef;
  public projectionForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public theaterHalls: ITheaterHall[] = [];
  public movies: IMovieDetails[] = [];
  public theaterHall: ITheaterHall;
  public theaterHallFromForm: ITheaterHall;
  public movie: IMovieDetails;
  public movieFields: Object = {text: 'Name', value: 'Id'};
  private activeSubs: Subscription[] = [];


  constructor(private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router,
              private projectionFacadeService: ProjectionFacadeService,
              private theaterHallFacadeService: TheaterHallFacadeService,
              private moviesFacadeService: MoviesFacadeService) {
    this.showFormErrors = true;
    this.showServerError = false;

    var thSub = this.theaterHallFacadeService.getTheaterHalls()
      .subscribe(theaterHalls => {
        this.theaterHalls = theaterHalls;
        this.theaterHalls.sort((hall1, hall2) => hall1.name.localeCompare(hall2.name));
    });
    this.activeSubs.push(thSub);

    var movieSub = this.moviesFacadeService.getMoviesDetails()
      .subscribe(movies => {
        this.movies = movies;
        this.movies.sort((movie1, movie2) => movie1.title.localeCompare(movie2.title));
    });
    this.activeSubs.push(movieSub);

    this.projectionForm = this.formBuilder.group({
      movieId: ['', [Validators.required]],
      projectionDate: ['', [Validators.required]],
      theaterHallId: ['', [Validators.required]],
      theaterHallTerm: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('[0-9]+')]]
    });
  }

  public changeMovie(e: any) {
    this.movieId?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public changeTheaterHall(e: any) {
    this.theaterHallId?.setValue(e.target.value, {
      onlySelf: true,
    });
    const data: IFormProjection = this.projectionForm.value as IFormProjection;
    var thGetSub = this.theaterHallFacadeService.getTheaterHall(data.theaterHallId)
      .subscribe(theaterHall => {
        this.theaterHallFromForm = theaterHall;
    });
    this.activeSubs.push(thGetSub);
  }

  public changeTheaterHallTerm(e: any) {
    this.theaterHallTerm?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public get movieId(){
    return this.projectionForm.get('movieId');
  }

  public get theaterHallId(){
    return this.projectionForm.get('theaterHallId');
  }

  public get theaterHallTerm(){
    return this.projectionForm.get('theaterHallTerm');
  }

  public get projectionDate(){
    return this.projectionForm.get('projectionDate');
  }

  public get price(){
    return this.projectionForm.get('price');
  }
 
  public onProjectionFormSubmit(){
    
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.projectionForm.invalid) {
      this.showFormErrors = true;
      console.error("Form errors")
      return;
    }

    const data: IFormProjection = this.projectionForm.value as IFormProjection;
    console.log(data)
    
    var thMovieSub = this.theaterHallFacadeService.getTheaterHall(data.theaterHallId.split(" ")[1]).pipe(
      switchMap((thaterhall) => 
      {
        this.theaterHall = thaterhall;
        console.log(this.theaterHall.name);
        return this.moviesFacadeService.getMovieDetails(data.movieId.split(" ")[1]);
      }),
      switchMap((movieDetails) => {
        this.movie = movieDetails;
        console.log(this.movie.title);
        return this.projectionFacadeService.createProjection(this.movie.id, this.movie.title, this.movie.runtime, 
          this.theaterHall.id, this.theaterHall.name, data.projectionDate, 
          data.theaterHallTerm.split(" ")[1] + " " + data.theaterHallTerm.split(" ")[2],
          this.theaterHall.numberOfSeats, 0, data.price)
      })
    ).subscribe({
        error: (err) => {
          this.showServerError = true;
          console.log(err);
          return of(false);
        },
        complete: () => {
          window.alert("Projection saved");
          this.projectionForm.reset();
          this.modalReference.close();
          window.location.reload();
        }
    });
    this.activeSubs.push(thMovieSub);
        
  }

  
   
  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.projectionForm.reset();
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
