import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';
import { MoviesFacadeService } from 'src/app/movies/domain/application-services/movies-facade.service';
import { IMovieDetails } from 'src/app/movies/domain/models/movie-details';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';
import { ICreateCoupon } from '../../domain/models/create-coupon';

interface ICouponFormData {
  movieId : string, 
  amount : number
}

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {
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
    
    this.couponForm = this.formBuilder.group({
      movieId: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });  
  }

  public get movieId() {
    return this.couponForm.get('movieId');
  }

  public get amount() {
    return this.couponForm.get('amount');
  }

  ngOnInit(): void {
  }

  public onCouponFormSubmit(): void { 

    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.couponForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;

    this.moviesFacadeService.getMovieDetails(data.movieId.split(" ")[1]).pipe(
      switchMap((movieDetails) => {
        this.movie = movieDetails;
        data.movieId = movieDetails.id;
        
        return this.discountService.createDiscount(this.movie.id, movieDetails.title, data.amount);
      })).subscribe({
        error: (coupon : ICreateCoupon) => {
        if(coupon != null)
          window.alert('Coupon created!');
        else
          window.alert('There was a problem with creating coupon!');
        },
        complete: () => {
          window.alert("Created new discount");
          this.couponForm.reset();
          this.modalReference.close();
          window.location.reload();
        }});
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
