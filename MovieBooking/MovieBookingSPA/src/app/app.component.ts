import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  router: Router;
  title = 'MovieBookingSPA';

  constructor(router: Router){
    this.router = router;
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
