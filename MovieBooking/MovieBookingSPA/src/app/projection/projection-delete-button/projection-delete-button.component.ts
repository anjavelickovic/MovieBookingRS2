import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IDeleteForm } from '../domain/models/delete-form.model';

@Component({
  selector: 'app-projection-delete-button',
  templateUrl: './projection-delete-button.component.html',
  styleUrls: ['./projection-delete-button.component.css']
})
export class ProjectionDeleteButtonComponent implements OnInit {

  public modalReference: NgbModalRef;
  public deleteForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public paramName: string = "all";
  public errMsg: string;
  
  constructor(private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router,
              private projectionFacadeService: ProjectionFacadeService) {
    this.showFormErrors = true;
    this.showServerError = false;

   
    this.resetForm();
  }

  public changeOption(e: any) {
    this.deleteBy?.setValue(e.target.value, {
      onlySelf: true,
    });
    if(this.deleteBy.value == 'by date'){
      this.paramName = "Date";
    }else
      if(this.deleteBy.value == 'by movie'){
        this.paramName = "Movie title";
      } else {
        this.paramName = "all";
      }
    this.param?.setValue('', {
      onlySelf: true,
    });
  }

  public get deleteBy(){
    return this.deleteForm.get('deleteBy');
  }

  public get param(){
    return this.deleteForm.get('param');
  }

  public resetForm(){
    this.deleteForm = this.formBuilder.group({
      deleteBy: [this.paramName, [Validators.required]],
      param: ['', [Validators.required, Validators.pattern('([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])')]]
    });
  }

  public open(content) {
    this.modalReference = this.modalService
                              .open(content, {ariaLabelledBy: 'modal'});
  }

  public close(){
    this.modalReference.close();
    this.paramName = "all";
    this.resetForm();
  }

  public onDeleteFormSubmit(){
    this.showFormErrors = false;
    this.showServerError = false;

    const data: IDeleteForm = this.deleteForm.value as IDeleteForm;

    console.log(data.param);
    if(data.deleteBy == 'all'){
      this.projectionFacadeService.deleteProjections()
      .subscribe({
          error: (err) => {
            this.showServerError = true;
            console.log(err);
            return of(false);
          },
          complete: () => {
            window.alert("All projections are deleted");
            this.resetForm();
            this.modalReference.close();
            console.log(data.param);
            window.location.reload();
          }
        });
    }else{
      if(data.deleteBy == 'by date'){
        this.projectionFacadeService.deleteProjectionsByDate(data.param)
        .subscribe({
            error: (err) => {
              this.showServerError = true;
              console.log(err);
              return of(false);
            },
            complete: () => {
              window.alert("All projections on " + data.param + " are deleted");
              this.resetForm();
              this.modalReference.close();
              console.log(data.param);
             window.location.reload();
            }
          });
        }else {
        this.projectionFacadeService.deleteProjectionsByMovieTitle(data.param)
        .subscribe({
            error: (err) => {
              this.showServerError = true;
              console.log(err);
              return of(false);
            },
            complete: () => {
              window.alert("All projections for movie " + data.param + " are deleted");
              this.resetForm();
              this.modalReference.close();
              console.log(data.param);
              window.location.reload();
            }
          });
      }
    }
  }

  ngOnInit(): void {
  }

}
