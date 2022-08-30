import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TheaterHallFacadeService } from '../domain/application-services/theater-hall-facade.service';
import { ITheaterHall } from '../domain/models/theater-hall.model';

@Component({
  selector: 'app-theater-hall-list',
  templateUrl: './theater-hall-list.component.html',
  styleUrls: ['./theater-hall-list.component.css']
})
export class TheaterHallListComponent implements OnInit, OnDestroy {

  public theaterHalls: ITheaterHall[] = [];
  private activeSubs: Subscription[] = [];

  constructor(private theaterHallFacadeService: TheaterHallFacadeService) { 
    var thSub = this.theaterHallFacadeService.getTheaterHalls()
      .subscribe(theaterHalls => {
        this.theaterHalls = theaterHalls;
    });
    this.activeSubs.push(thSub);
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
