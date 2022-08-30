import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { AppState } from 'src/app/shared/app-state/app-state';
import { AppStateService } from 'src/app/shared/app-state/app-state.service';
import { AdministrationFacadeService } from '../../domain/application-services/administration-facade.service';
import { IReservations } from '../../domain/models/reservations';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.css']
})
export class ReservationsListComponent implements OnInit, OnDestroy {

  public reservations : IReservations[]
  public show : boolean[]
  private activeSubs: Subscription[] = []

  
  constructor(private administrationFacadeService : AdministrationFacadeService, 
    private appStateService: AppStateService) { 

      //dohvatanje username iz appState
      var stateSub = appStateService.getAppState().pipe(
        switchMap((appState) => {
          return this.administrationFacadeService.getReservationByUsername(appState.username);
        }
      )).subscribe(reservations => {
        this.reservations = reservations;
        this.show = new Array(reservations.length);
      });
      
    this.activeSubs.push(stateSub);

  }

  ngOnInit(): void {
  }

  public onBtnClick(i){
    this.show[i] = true;
  }
  
  ngOnDestroy(): void {
    this.activeSubs.forEach((sub: Subscription) =>
      sub.unsubscribe())
  }
}
