import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { MoviesFacadeService } from 'src/app/movies/domain/application-services/movies-facade.service';
import { IMovieDetails } from 'src/app/movies/domain/models/movie-details';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';

interface ICouponFormData {
  movieName : string, 
}

@Component({
  selector: 'app-coupon-delete-form',
  templateUrl: './coupon-delete-form.component.html',
  styleUrls: ['./coupon-delete-form.component.css']
})
export class CouponDeleteFormComponent implements OnInit, OnDestroy {

  public couponForm : FormGroup
  public modalReference: NgbModalRef;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public movie: IMovieDetails;
  public movies: IMovieDetails[] = [];
  private activeSubs: Subscription[] = [];

  constructor(private modalService: NgbModal,
              private discountService : DiscountFacadeService,
              private formBuilder: UntypedFormBuilder,
              private moviesFacadeService: MoviesFacadeService) { 
      this.showFormErrors = false;
      this.showServerError = false;
      
    var moviesSub = this.moviesFacadeService.getMoviesDetails()
      .subscribe(movies => {
        this.movies = movies;
      });       

      this.activeSubs.push(moviesSub);

      this.couponForm = this.formBuilder.group({
        movieName: ['', [Validators.required]],
      });
    }

  ngOnInit(): void {
  }

  public get movieName() {
    return this.couponForm.get('movieName');
  }

  public onCouponDelete() : void{
    
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.couponForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;

      var deleteSub = this.discountService.deleteDiscount(data.movieName)
      .subscribe((response) => {
        if(!response){
            window.alert("There was a problem with deleting coupon. \nPlease check if coupon you are trying to delete exists.");
            this.couponForm.reset();
            this.modalReference.close();
            window.location.reload();    
        } else {
            window.alert("Coupon deleted successfully");
            this.couponForm.reset();
            this.modalReference.close();
            window.location.reload();
        }
    });

    this.activeSubs.push(deleteSub);
  } 


  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.couponForm.reset();
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}

