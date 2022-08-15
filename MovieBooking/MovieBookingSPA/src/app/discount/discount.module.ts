import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountRoutingModule } from './discount-routing.module';
import { DiscountComponent } from './discount.component';
import { CouponFormComponent } from './feature-discount/coupon-form/coupon-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CouponListComponent } from './feature-discount/coupon-list/coupon-list/coupon-list.component';
import { CouponDeleteFormComponent } from './feature-discount/coupon-delete-form/coupon-delete-form.component';
import { CouponUpdateFormComponent } from './feature-discount/coupon-update-form/coupon-update-form.component';


@NgModule({
  declarations: [
    DiscountComponent,
    CouponFormComponent,
    CouponListComponent,
    CouponDeleteFormComponent,
    CouponUpdateFormComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    ReactiveFormsModule
  ]
})
export class DiscountModule { }
