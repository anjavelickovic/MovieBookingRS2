import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICoupon } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor( private httpClient : HttpClient) { }

  // OVDE NE TREBA DA PRIMA? ICREATECOUPON
  public createDiscount(createCoupon : ICoupon) : Observable<ICoupon> {
    return this.httpClient.post<ICoupon>("http://localhost:8002/api/v1/Discount", createCoupon);
  }

}
