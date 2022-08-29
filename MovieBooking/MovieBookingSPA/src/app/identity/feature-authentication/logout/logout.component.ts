import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationFacadeService } from '../../domain/application-services/authentication-facade.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy {
  private activeSubs: Subscription[] = [];

  constructor(private authenticationService: AuthenticationFacadeService) {
    var logoutSub = this.authenticationService.logout().subscribe(value => {});
    this.activeSubs.push(logoutSub);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.activeSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}


