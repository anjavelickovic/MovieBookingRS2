import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';

interface ICouponFormData {
  id : string, 
  movieName : string, 
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

  constructor(private modalService: NgbModal,
            private discountService : DiscountFacadeService) { 
    this.couponForm = new FormGroup({
      id : new FormControl("", [Validators.required]),
      movieName : new FormControl("", [Validators.required]),
      amount : new FormControl("", [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  public onCouponUpdate() : void {
    if(this.couponForm.invalid){
      window.alert('Form has errors');
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;
    
    this.discountService.updateDiscount(data.id, data.movieName, data.amount)
    .subscribe({
      error: (err : boolean) => {
      if(!err)
        window.alert('There was a problem with updating coupon, please try again!');
    }, 
    complete: () => {
      window.alert("Updated coupon for movie " + data.movieName);
      this.couponForm.reset();
      this.modalReference.close();
      window.location.reload();
    }
  })
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
