import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICoupon } from '../models/coupon';
import { ICreateCoupon } from '../models/create-coupon';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly discountUrl = "http://localhost:8002/api/v1/Discount/";

  constructor( private httpClient : HttpClient) { }

  public createDiscount(createCoupon : ICreateCoupon) : Observable<ICreateCoupon> {
    return this.httpClient.post<ICreateCoupon>(this.discountUrl, createCoupon);
  }

  public getDiscounts() : Observable<ICoupon[]>{
    return this.httpClient.get<ICoupon[]>(this.discountUrl);
  }

  public deleteDiscount(id : string) : Observable<boolean> {
    return this.httpClient.delete<boolean>(this.discountUrl + id);  
  }
}
