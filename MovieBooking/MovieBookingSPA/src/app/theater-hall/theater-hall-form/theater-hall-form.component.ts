import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TheaterHallFacadeService } from '../domain/application-services/theater-hall-facade.service';
import { ICreateTheaterHallRequest } from '../domain/models/create-theater-hall-request.model';
import { catchError, from, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-theater-hall-form',
  templateUrl: './theater-hall-form.component.html',
  styleUrls: ['./theater-hall-form.component.css']
})
export class TheaterHallFormComponent implements OnInit {

  public modalReference: NgbModalRef;
  public theaterHallForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  
  
  constructor(private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router,
              private theaterHallFacadeService: TheaterHallFacadeService) {
    this.showFormErrors = true;
    this.showServerError = false;

    this.theaterHallForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      terms: new FormArray([],[Validators.required]),
      numberOfSeats: ['', [Validators.required]]
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

  public onTheaterHallFormSubmit(){
    this.showFormErrors = false;
    this.showServerError = false;
    
    if (this.theaterHallForm.invalid) {
      this.showFormErrors = true;
      return;
    }

    const data: ICreateTheaterHallRequest = this.theaterHallForm.value as ICreateTheaterHallRequest;
    
    this.theaterHallFacadeService.createTheaterHall(data.name, data.terms, data.numberOfSeats)
     .subscribe({
        error: (err) => {
          this.showServerError = true;
          console.log(err);
          return of(false);
        },
        complete: () => {
          window.alert("Saved " + data.name);
          this.terms.clear();
          this.theaterHallForm.reset();
          this.modalReference.close();
          window.location.reload();
        }
      })
  }
   
  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.terms.clear();
    this.theaterHallForm.reset();
  }
  
  ngOnInit(): void {
  }

}
