import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from 'src/app/shared/model/user.model';

import { LoginService } from './login.service';

import { LOGIN_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User;
  public loading = false;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _loginService: LoginService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.user = new User();
  }

  async login() {
    this.loading = true;
    await this._loginService.login(this.user).then(
      result => {
        this._loginService.getUserInfo().on("value", snapshot => {
          if (this.isAdmin(snapshot.child("rol").val())) {
            this._snackBar.open(LOGIN_MSGS.LOGIN_SUCCESS, 'Ok', SNACKBAR_CONFIG);
            localStorage.setItem('token', result.user.refreshToken);
            this.loading = false;
            this._ngZone.run(()=>this._router.navigate(['panel']));            
          } else {
            this._snackBar.open(LOGIN_MSGS.USER_NO_ADMIN, 'Ok', SNACKBAR_CONFIG);
            this.loading = false;
          }
        });
      },
      error => {
        this._snackBar.open(this._loginService.getLoginErrorMessage(error.code), 'Ok', SNACKBAR_CONFIG);
        this.loading = false;
      }
    );
  }

  isAdmin(rol): boolean {
    return rol === 'ADMIN';
  }

}
