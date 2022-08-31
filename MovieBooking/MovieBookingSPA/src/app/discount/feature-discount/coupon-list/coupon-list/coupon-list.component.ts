import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiscountFacadeService } from 'src/app/discount/domain/application-services/discount-facade.service';
import { ICoupon } from 'src/app/discount/domain/models/coupon';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css']
})
export class CouponListComponent implements OnInit, OnDestroy {

  public coupons : ICoupon[]
  private activeSubs: Subscription[] = []

  constructor(private discountFacadeService : DiscountFacadeService) { 
    var discountSub = this.discountFacadeService.getDiscounts().subscribe(coupons => {
      this.coupons = coupons;
    })

    this.activeSubs.push(discountSub);
}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.activeSubs.forEach((sub: Subscription) =>
      sub.unsubscribe())
  }
}
