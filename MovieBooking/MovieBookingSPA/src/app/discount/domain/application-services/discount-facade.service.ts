import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DiscountService } from '../infrastructure/discount.service';
import { ICoupon } from '../models/coupon';
import { ICreateCoupon } from '../models/create-coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountFacadeService {

  constructor(private discountService : DiscountService) { }

  public createDiscount(id : string, movieName : string, amount : number) : Observable<ICreateCoupon>{
    const coupon : ICreateCoupon = {id, movieName, amount};

    return this.discountService.createDiscount(coupon).pipe(
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  public getDiscounts() : Observable<ICoupon[]> {
    return this.discountService.getDiscounts();
  }

  public deleteDiscount(id : string) : Observable<boolean> {
    return this.discountService.deleteDiscount(id);
  }
}
