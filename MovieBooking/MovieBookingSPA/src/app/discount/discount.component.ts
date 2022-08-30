import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiscountFacadeService } from './domain/application-services/discount-facade.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  public couponExists: boolean = false;
  private activeSubs: Subscription[] = [];

  constructor(private discountFacadeService : DiscountFacadeService) { 
    var coupons = this.discountFacadeService.getDiscounts().subscribe((coupons) => {
      if(coupons.length > 0)
        this.couponExists = true;
    });

    this.activeSubs.push(coupons);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    })
  }
}
