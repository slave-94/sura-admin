import { Component } from '@angular/core';
import { LoginService } from './components/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'sura-admin';

  constructor(
    private _loginService: LoginService
  ) { }

  checkToken() {
    return this._loginService.checkToken();
  }


}
