import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectionFacadeService } from './domain/application-services/projection-facade.service';

@Component({
  selector: 'app-projection',
  templateUrl: './projection.component.html',
  styleUrls: ['./projection.component.css']
})
export class ProjectionComponent implements OnInit, OnDestroy {

  public projectionsExists: boolean = false;
  private activeSubs: Subscription[] = [];
  
  constructor(private projectionFacadeService: ProjectionFacadeService) { 
    var projSub = this.projectionFacadeService.getProjections()
                      .subscribe((projections) => {
                        if(projections.length > 0)
                          this.projectionsExists = true;
                      });
    this.activeSubs.push(projSub)
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
