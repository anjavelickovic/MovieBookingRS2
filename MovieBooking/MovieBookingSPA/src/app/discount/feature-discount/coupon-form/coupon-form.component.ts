import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {
  public couponForm : FormGroup;

  constructor() { 
    this.couponForm = new FormGroup({
      id : new FormControl("", [Validators.required]),
      movieName: new FormControl("", [Validators.required]),
      amount : new FormControl(0, [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
  }

  public onCouponCreate(): void {
    // TODO 
    // sta se desi kada se kreira kupon
  }
}
