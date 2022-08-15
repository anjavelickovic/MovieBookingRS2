import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { CouponDeleteFormComponent } from './feature-discount/coupon-delete-form/coupon-delete-form.component';
import { CouponFormComponent } from './feature-discount/coupon-form/coupon-form.component';
import { CouponListComponent } from './feature-discount/coupon-list/coupon-list/coupon-list.component';
import { CouponUpdateFormComponent } from './feature-discount/coupon-update-form/coupon-update-form.component';

const routes: Routes = [
  { path: '', component: DiscountComponent, children: [
        { path: 'create_coupon', component: CouponFormComponent },
        { path: 'coupons_list', component: CouponListComponent },
        { path: 'delete_coupon', component: CouponDeleteFormComponent },
        { path: 'update_coupon', component: CouponUpdateFormComponent }
  ] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
