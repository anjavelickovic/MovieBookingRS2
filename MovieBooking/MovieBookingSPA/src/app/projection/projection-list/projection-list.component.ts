import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IProjection } from '../domain/models/projection.model';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css']
})
export class ProjectionListComponent implements OnInit, OnDestroy {

  public projections: IProjection[] = [];
  private activeSubs: Subscription[] = [];

  constructor(private projectionFacadeService: ProjectionFacadeService) { 
    var projSub = this.projectionFacadeService.getProjections()
      .subscribe(projections => {
        this.projections = projections.sort(
          (first, second) => {
            let firstList = first.projectionDate.split('-');
            let secondList = second.projectionDate.split('-');
            if(Number(firstList[0]) != Number(secondList[0])){
              return Number(firstList[0]) - Number(secondList[0]);
            }else
            if(Number(firstList[1]) != Number(secondList[1])){
              return Number(firstList[1]) - Number(secondList[1]);
            }else
              if(Number(firstList[2]) != Number(secondList[2])){
                return Number(firstList[2]) - Number(secondList[2]);
              }else{
                let firstTime = Number(first.projectionTerm.split(' ')[0].split(':')[0]);
                let secondTime = Number(second.projectionTerm.split(' ')[0].split(':')[0]);
                return firstTime - secondTime;
              }
        });
    });
    this.activeSubs.push(projSub);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

}
