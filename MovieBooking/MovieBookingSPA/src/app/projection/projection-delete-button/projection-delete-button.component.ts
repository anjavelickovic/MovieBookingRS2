import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IDeleteForm } from '../domain/models/delete-form.model';
import { IProjection } from '../domain/models/projection.model';

@Component({
  selector: 'app-projection-delete-button',
  templateUrl: './projection-delete-button.component.html',
  styleUrls: ['./projection-delete-button.component.css']
})
export class ProjectionDeleteButtonComponent implements OnInit, OnDestroy {

  public modalReference: NgbModalRef;
  public deleteForm: UntypedFormGroup;
  public showFormErrors: boolean;
  public showServerError: boolean;
  public paramName: string = "all";
  public errMsg: string;
  public moviesInProjections: Set<string> = new Set<string>();
  private activeSubs: Subscription[] = [];

  constructor(private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private router: Router,
              private projectionFacadeService: ProjectionFacadeService) {

    var projSub = this.projectionFacadeService.getProjections()
      .subscribe(projections => {
        for(let projection of projections){
          this.moviesInProjections.add(projection.movieTitle);
        }
    });
    this.activeSubs.push(projSub);

    this.showFormErrors = true;
    this.showServerError = false;
    
   
    this.resetForm();
  }

  public changeMovieTitle(e: any) {
    this.param?.setValue(e.target.value, {
      onlySelf: true,
    });
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
      var delProjSub = this.projectionFacadeService.deleteProjections()
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
      this.activeSubs.push(delProjSub);
    }else{
      if(data.deleteBy == 'by date'){
        var delProjSub = this.projectionFacadeService.deleteProjectionsByDate(data.param)
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
        this.activeSubs.push(delProjSub);
        }else {
        var delProjSub = this.projectionFacadeService.deleteProjectionsByMovieTitle(data.param)
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
        this.activeSubs.push(delProjSub);
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
