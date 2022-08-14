import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';
import { ICoupon } from '../../domain/models/coupon';

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

  constructor(private discountService : DiscountFacadeService) { 
    this.couponForm = new FormGroup({
      id : new FormControl("", [Validators.required]),
      movieName: new FormControl("", [Validators.required]),
      amount : new FormControl(0, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
  }

  public onCouponFormSubmit(): void {
    // TODO 
    if(this.couponForm.invalid){
      window.alert('Form has errors');
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;
    this.discountService.createDiscount(data.id, data.movieName, data.amount).subscribe((coupon : ICoupon) => {
      if(coupon != null)
        window.alert('Coupon created!');
      else
        window.alert('There was a problem with creating coupon!');
    });
    this.couponForm.reset();
  }
}
