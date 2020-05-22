import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  public logged: boolean;

  title = 'sura-admin';

  constructor() {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if(token) {
      this.logged = true;
    } else {
      this.logged = false;
    }
  }
  
 
}
