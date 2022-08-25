import { Component, OnInit } from '@angular/core';
import { ProjectionFacadeService } from '../domain/application-services/projection-facade.service';
import { IProjection } from '../domain/models/projection.model';

@Component({
  selector: 'app-projection-list',
  templateUrl: './projection-list.component.html',
  styleUrls: ['./projection-list.component.css']
})
export class ProjectionListComponent implements OnInit {

  public projections: IProjection[] = [];

  constructor(private projectionFacadeService: ProjectionFacadeService) { 
    this.projectionFacadeService.getProjections()
      .subscribe(projections => {
        this.projections = projections;
      });
  }

  ngOnInit(): void {
  }

}
