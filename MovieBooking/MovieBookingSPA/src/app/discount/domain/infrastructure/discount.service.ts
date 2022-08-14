import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateCoupon } from '../models/create-coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor( private httpClient : HttpClient) { }

  // OVDE NE TREBA DA PRIMA? ICREATECOUPON
  public createDiscount(createCoupon : ICreateCoupon) : Observable<ICreateCoupon> {
    return this.httpClient.post<ICreateCoupon>("http://localhost:8002/api/v1/Discount", createCoupon);
  }

}
