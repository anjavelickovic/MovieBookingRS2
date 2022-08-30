import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, switchMap, Subscription } from 'rxjs';
import { TheaterHallFacadeService } from '../domain/application-services/theater-hall-facade.service';
import { ICreateTheaterHallRequest } from '../domain/models/create-theater-hall-request.model';
import { ITheaterHall } from '../domain/models/theater-hall.model';

@Component({
  selector: 'app-theater-hall-info',
  templateUrl: './theater-hall-info.component.html',
  styleUrls: ['./theater-hall-info.component.css']
})
export class TheaterHallInfoComponent implements OnInit, OnDestroy {

  public theaterHall: ITheaterHall;
  private paramMapSub: Subscription | null;
  public modalReference: NgbModalRef;
  public theaterHallForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  private activeSubs: Subscription[] = [];

  constructor(private theaterHallFacadeService: TheaterHallFacadeService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder) { 
    this.paramMapSub = this.route.paramMap.pipe(
      switchMap((params) => {
      const theaterHallId = params.get('theaterHallId');
      return this.theaterHallFacadeService.getTheaterHall(theaterHallId);
    })
    ).subscribe(theaterHall => {
        this.theaterHall = theaterHall;
        this.showFormErrors = true;
        this.showServerError = false;
        this.resetForm();
    });
    this.activeSubs.push(this.paramMapSub);
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
    
    var thSub = this.theaterHallFacadeService.updateTheaterHall(this.theaterHall.id, data.name, data.terms, data.numberOfSeats)
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
      });
      this.activeSubs.push(thSub);
  }

  public deleteTheaterHall(){
    var thDelSub = this.theaterHallFacadeService.deleteTheaterHall(this.theaterHall.id)
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
    this.activeSubs.push(thDelSub);
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

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
