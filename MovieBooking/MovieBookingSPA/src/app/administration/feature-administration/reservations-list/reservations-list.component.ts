import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { AdministrationFacadeService } from '../../domain/application-services/administration-facade.service';
import { IReservations } from '../../domain/models/reservations';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent implements OnInit {

  public reservations : IReservations[]
  public show : boolean[]
  
  constructor(private administrationFacadeService : AdministrationFacadeService, 
    private appStateService: AppStateService) { 

    // dohvatanje username-a
    appStateService.getAppState().subscribe(appState => {
      //console.log(appState.username);
      this.administrationFacadeService.getReservationByUsername(appState.username).subscribe(reservations => {
        this.reservations = reservations;
        this.show = new Array(reservations.length);
      })
    }); 
  }

  ngOnInit(): void {
  }

  public onBtnClick(i){
    this.show[i] = true;
  }

}
