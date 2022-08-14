import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DiscountService } from '../infrastructure/discount.service';
import { ICoupon } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountFacadeService {

  constructor(private discountService : DiscountService) { }

  public createDiscount(id : string, movieName : string, amount : number) : Observable<ICoupon>{
    const coupon : ICoupon = {id, movieName, amount};

    return this.discountService.createDiscount(coupon).pipe(
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

}
