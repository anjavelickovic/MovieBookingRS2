import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscountComponent } from './discount.component';
import { CouponFormComponent } from './feature-discount/coupon-form/coupon-form.component';

const routes: Routes = [
  { path: '', component: DiscountComponent, children: [
        { path: 'create_coupon', component: CouponFormComponent }
  ] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountRoutingModule { }
