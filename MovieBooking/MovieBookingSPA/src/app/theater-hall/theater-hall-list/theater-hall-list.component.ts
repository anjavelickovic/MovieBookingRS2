import { Component, OnInit } from '@angular/core';
import { TheaterHallFacadeService } from '../domain/application-services/theater-hall-facade.service';
import { ITheaterHall } from '../domain/models/theater-hall.model';

@Component({
  selector: 'app-theater-hall-list',
  templateUrl: './theater-hall-list.component.html',
  styleUrls: ['./theater-hall-list.component.css']
})
export class TheaterHallListComponent implements OnInit {

  public theaterHalls: ITheaterHall[] = [];

  constructor(private theaterHallFacadeService: TheaterHallFacadeService) { 
    this.theaterHallFacadeService.getTheaterHalls()
      .subscribe(theaterHalls => {
        this.theaterHalls = theaterHalls;
    });
  }
  
  ngOnInit(): void {
  }

}
