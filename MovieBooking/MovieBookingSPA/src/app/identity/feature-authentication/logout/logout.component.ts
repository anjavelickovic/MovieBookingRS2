import { Component, OnInit } from '@angular/core';
import { AuthenticationFacadeService } from '../../domain/application-services/authentication-facade.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  

  constructor() {
  }

  ngOnInit(): void {}
}

