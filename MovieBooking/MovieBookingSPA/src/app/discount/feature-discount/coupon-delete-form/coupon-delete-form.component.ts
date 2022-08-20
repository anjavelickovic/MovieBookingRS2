import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DiscountFacadeService } from '../../domain/application-services/discount-facade.service';

interface ICouponFormData {
  id : string, 
}

@Component({
  selector: 'app-coupon-delete-form',
  templateUrl: './coupon-delete-form.component.html',
  styleUrls: ['./coupon-delete-form.component.css']
})
export class CouponDeleteFormComponent implements OnInit {

  public couponForm : FormGroup
  public modalReference: NgbModalRef;
  public showFormErrors: boolean;
  public showServerError: boolean;

  constructor(private modalService: NgbModal,
              private discountService : DiscountFacadeService) { 
      this.showFormErrors = false;
      this.showServerError = false;
            
      this.couponForm = new FormGroup({
        id : new FormControl("", [Validators.required]),
      });
    }

  ngOnInit(): void {
  }

  public get id() {
    return this.couponForm.get('id');
  }

  public onCouponDelete() : void{
    
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.couponForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data : ICouponFormData = this.couponForm.value as ICouponFormData;
    
    this.discountService.deleteDiscount(data.id)
    .subscribe({
      error: (check : boolean) => {
      if(!check)
        window.alert('There was a problem with deleting coupon, please try again!');
    },
    complete: () => {
      window.alert("Coupon deleted successfully!");
      this.couponForm.reset();
      this.modalReference.close();
      window.location.reload();
    }
  });
} 

  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.couponForm.reset();
  }
}
