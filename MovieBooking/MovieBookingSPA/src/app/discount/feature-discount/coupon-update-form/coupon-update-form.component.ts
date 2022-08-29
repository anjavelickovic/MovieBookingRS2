import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';
import { MoviesFacadeService } from 'src/app/movies/domain/application-services/movies-facade.service';
import { IMovieDetails } from 'src/app/movies/domain/models/movie-details';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';

interface ICouponFormData {
  movieId : string, 
  amount : number
}

@Component({
  selector: 'app-coupon-update-form',
  templateUrl: './coupon-update-form.component.html',
  styleUrls: ['./coupon-update-form.component.css']
})
export class CouponUpdateFormComponent implements OnInit {
  
  public couponForm : FormGroup;
  public modalReference: NgbModalRef;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public movie: IMovieDetails;
  public movies: IMovieDetails[] = [];

  constructor(private modalService: NgbModal,
            private discountService : DiscountFacadeService,            
            private formBuilder: UntypedFormBuilder,
            private moviesFacadeService: MoviesFacadeService) { 
    this.showFormErrors = false;
    this.showServerError = false;
           
    this.moviesFacadeService.getMoviesDetails()
    .subscribe(movies => {
      this.movies = movies;
    });

    this.couponForm = new FormGroup({
      movieId : new FormControl("", [Validators.required]),
      amount : new FormControl("", [Validators.required, Validators.min(1), Validators.max(100)])
    });
  }

  
  public get movieId() {
    return this.couponForm.get('id');
  }

  public get amount() {
    return this.couponForm.get('amount');
  }
  
  ngOnInit(): void {
  }

  public onCouponUpdate() : void {

    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.couponForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;
    
    this.moviesFacadeService.getMovieDetails(data.movieId).pipe(
      switchMap((movieDetails => {
        this.movie = movieDetails;      
        data.movieId = movieDetails.id;
  
        return this.discountService.updateDiscount(this.movie.id, data.amount)
        })
      )).subscribe({
          error: (err : boolean) => {
          if(!err)
            window.alert('There was a problem with updating coupon, please try again!');
          }, 
          complete: () => {
            window.alert("Coupon updated");
            this.couponForm.reset();
            this.modalReference.close();
            window.location.reload();
            }}
      );

    /*this.moviesFacadeService.getMovieDetails(data.movieId)
    .subscribe(movieDetails => {
      this.movie = movieDetails;
      console.log(this.movie.title);
    
      data.movieId = movieDetails.id;

      console.log(this.movie.id )

    this.discountService.updateDiscount(this.movie.id, data.amount)
    .subscribe({
      error: (err : boolean) => {
      if(!err)
        window.alert('There was a problem with updating coupon, please try again!');
    }, 
    complete: () => {
      window.alert("Updated coupon for movie with id: " + movieDetails.title);
      this.couponForm.reset();
      this.modalReference.close();
      window.location.reload();
      }
    });
  });*/
} 

  public changeMovie(e: any) {
    this.movieId?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.couponForm.reset();
  }

}
