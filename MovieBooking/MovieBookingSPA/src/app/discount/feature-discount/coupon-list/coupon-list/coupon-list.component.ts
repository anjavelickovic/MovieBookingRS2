import { Component, OnInit } from '@angular/core';
import { DiscountFacadeService } from 'src/app/discount/domain/application-services/discount-facade.service';
import { ICoupon } from 'src/app/discount/domain/models/coupon';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})
export class CouponListComponent implements OnInit {

  public coupons : ICoupon[]

  constructor(private discountFacadeService : DiscountFacadeService) { 
    this.discountFacadeService.getDiscounts().subscribe(coupons => {
      this.coupons = coupons;
    })
}

  ngOnInit(): void {
  }

}
