import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, Subscription } from 'rxjs';
import { TheaterHallFacadeService } from '../domain/application-services/theater-hall-facade.service';
import { ICreateTheaterHallRequest } from '../domain/models/create-theater-hall-request.model';
import { ITheaterHall } from '../domain/models/theater-hall.model';

@Component({
  selector: 'app-theater-hall-info',
  templateUrl: './theater-hall-info.component.html',
  styleUrls: ['./theater-hall-info.component.css']
})
export class TheaterHallInfoComponent implements OnInit {

  public theaterHall: ITheaterHall;
  private paramMapSub: Subscription | null;
  public modalReference: NgbModalRef;
  public theaterHallForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;

  constructor(private theaterHallFacadeService: TheaterHallFacadeService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) { 
    this.paramMapSub = this.route.paramMap.subscribe(params => {
      const theaterHallId = params.get('theaterHallId');
      this.theaterHallFacadeService.getTheaterHall(theaterHallId)
      .subscribe(theaterHall => {
        this.theaterHall = theaterHall;
        this.showFormErrors = true;
        this.showServerError = false;
        this.resetForm();
      })      
    });
  }

  public get name(){
    return this.theaterHallForm.get('name');
  }

  public get numberOfSeats(){
    return this.theaterHallForm.get('numberOfSeats');
  }

  public get terms() : FormArray {
    return this.theaterHallForm.get("terms") as FormArray
  }

  public addTerm() {
    this.terms.push(new FormControl('', [Validators.required, Validators.pattern('(0?[1-9]|1[0-2]):([0-5]{2})[ ]((A|P)M)')]));
  }

  public removeTerm(i: number) {
    this.terms.removeAt(i);
  }

  public resetForm(){
    this.theaterHallForm = this.formBuilder.group({
      name: [this.theaterHall.name, [Validators.required]],
      terms: new FormArray([],[Validators.required]),
      numberOfSeats: [this.theaterHall.numberOfSeats, [Validators.required]]
    });

    for(let i = 0; i < this.theaterHall.terms.length; i++){
      this.terms.push(new FormControl(this.theaterHall.terms[i], 
        [Validators.required, Validators.pattern('(0?[1-9]|1[0-2]):([0-5]{2})[ ]((A|P)M)')]));
    }
  }
  public onTheaterHallFormSubmit(){
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.theaterHallForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data: ICreateTheaterHallRequest = this.theaterHallForm.value as ICreateTheaterHallRequest;
    
    this.theaterHallFacadeService.updateTheaterHall(this.theaterHall.id, data.name, data.terms, data.numberOfSeats)
     .subscribe({
        error: (err) => {
          this.showServerError = true;
          console.log(err);
          return of(false);
        },
        complete: () => {
          window.alert("Updated " + data.name);
          this.modalReference.close();
          this.resetForm();
          window.location.reload();
        }
      })
  }

  public deleteTheaterHall(){
    console.log(this.theaterHall.id);
    this.theaterHallFacadeService.deleteTheaterHall(this.theaterHall.id)
    .subscribe({
      error: (err) => {
        console.log(err);
        return of(false);
      },
      complete: () => {
        window.alert("Deleted " + this.theaterHall.name);
        this.modalReference.close();
        this.router.navigate((['/theater-hall']));
      }
    });
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal'});
  }

  public close() {
    this.modalReference.close();
    this.resetForm();
  }

  
  
  ngOnInit(): void {
  }

}