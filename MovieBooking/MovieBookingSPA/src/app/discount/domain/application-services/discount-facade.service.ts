import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { DiscountService } from '../infrastructure/discount.service';
import { ICoupon } from '../models/coupon';
import { ICreateCoupon } from '../models/create-coupon';
import { IUpdateCoupon } from '../models/update-coupon';

@Injectable({
  providedIn: 'root'
})

export class DiscountFacadeService {

  constructor(private discountService : DiscountService) { }

  public createDiscount(movieId : string, movieName : string, amount : number) : Observable<ICreateCoupon>{
    const coupon : ICreateCoupon = {movieId, movieName, amount};

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

  public getDiscount(movieTitle: string) : Observable<ICoupon>{
    return this.discountService.getDiscount(movieTitle);
  }

  public deleteDiscount(id : string) : Observable<boolean> {
    return this.discountService.deleteDiscount(id);
  }

  public updateDiscount(movieId : string, amount : number) : Observable<boolean> {
    const coupon : IUpdateCoupon = {movieId, amount};

    return this.discountService.updateDiscount(coupon).pipe(
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }

}
