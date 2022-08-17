import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';
import { ICreateCoupon } from '../../domain/models/create-coupon';

interface ICouponFormData {
  id : string, 
  movieName : string, 
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

  constructor(private modalService: NgbModal,
            private discountService : DiscountFacadeService) { 
    this.showFormErrors = false;
    this.showServerError = false;
          
    this.couponForm = new FormGroup({
      id : new FormControl("", [Validators.required]),
      movieName: new FormControl("", [Validators.required]),
      amount : new FormControl(0, [Validators.required, Validators.min(1)]),
    });
  }

  public get id() {
    return this.couponForm.get('id');
  }

  public get movieName() {
    return this.couponForm.get('movieName');
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
    this.discountService.createDiscount(data.id, data.movieName, data.amount)
    .subscribe({
      error: (coupon : ICreateCoupon) => {
      if(coupon != null)
        window.alert('Coupon created!');
      else
        window.alert('There was a problem with creating coupon!');
      },
    complete: () => {
    window.alert("Created new discount for movie " + data.movieName);
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
