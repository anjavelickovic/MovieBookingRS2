import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { CouponFormComponent } from './feature-discount/coupon-form/coupon-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DiscountComponent,
    CouponFormComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    ReactiveFormsModule
  ]
})
export class DiscountModule { }
