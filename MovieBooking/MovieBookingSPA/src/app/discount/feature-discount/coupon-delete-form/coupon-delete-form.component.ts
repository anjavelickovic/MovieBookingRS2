import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';

interface ICouponFormData {
  id : string, 
  movieName : string, 
  amount : number
}

@Component({
  selector: 'app-coupon-delete-form',
  templateUrl: './coupon-delete-form.component.html',
  styleUrls: ['./coupon-delete-form.component.css']
})
export class CouponDeleteFormComponent implements OnInit {

  public couponForm : FormGroup

  constructor(private discountService : DiscountFacadeService) { 
      this.couponForm = new FormGroup({
        id : new FormControl("", [Validators.required]),
      });
    }

  ngOnInit(): void {
  }

  public onCouponDelete() : void{
    if(this.couponForm.invalid){
      window.alert('Form has errors');
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;
    
    this.discountService.deleteDiscount(data.id).subscribe((check : boolean) => {
      if(!check)
        window.alert('There was a problem with deleting coupon, please try again!');
      else
        window.alert('Coupon deleted successfully!');
    });

    this.couponForm.reset();
  } 
}
