import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MovieBookingSPA';

  constructor(public router: Router){
  }

  public isAuthenticated() {

    const value = this.router.url === '/identity/login' ||
                        this.router.url === '/identity/register' ||
                        this.router.url === '/identity/logout';

    return {
      'main-content-authenticated': !value
    }
  }
}
