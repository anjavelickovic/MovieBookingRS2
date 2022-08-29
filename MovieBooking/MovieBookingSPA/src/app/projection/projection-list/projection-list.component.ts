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
        this.projections = projections;
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
