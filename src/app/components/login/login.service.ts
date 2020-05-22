import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { User } from "../../shared/model/user.model";

import { strings } from "../../shared/constants/messages.const";

@Injectable()
export class LoginService {
  constructor(
    private angfireAuth: AngularFireAuth,
    private angfireDB: AngularFireDatabase
  ) {}

  login(user: User): Promise<any> {
    return this.angfireAuth.auth.signInWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  logout() : Promise<any> {
    return this.angfireAuth.auth.signOut();
  }

  register(user: User): Promise<any> {
    return this.angfireAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.password
    );
  }

  resetPassword(email): Promise<any> {
    return this.angfireAuth.auth.sendPasswordResetEmail(email);
  }

  confirmResetPassword(code, newPassword): Promise<any> {
    return this.angfireAuth.auth.confirmPasswordReset(code, newPassword);
  }

  getUserInfo() {
    return this.angfireDB.database.ref("Users").child(this.getUserId());
  }

  getUserId() {
    return this.angfireAuth.auth.currentUser.uid;
  }

  setUserInfo(user) {
    this.angfireDB.database
      .ref("Users")
      .child(this.getUserId())
      .set(user);
  }

  getLoginErrorMessage(code): string {
    switch (code) {
      case strings.loginErrors.emailIncorrectoCode:
        return strings.loginErrors.emailIncorrectoMsg;
      case strings.loginErrors.emailNoEncontradoCode:
        return strings.loginErrors.emailNoEncontradoMsg;
      case strings.loginErrors.passwordIncorrectoCode:
        return strings.loginErrors.passwordIncorrectoMsg;
      default:
        return strings.loginErrors.defaultLoginMsg;
    }
  }

  getRegUsrErrorMessage(code, email): string {
    switch (code) {
      case strings.registroUsuarioErrors.emailRegistradoCode:
        return `La cuenta de correo <b>${email}</b> ${
          strings.registroUsuarioErrors.emailRegistradoMsg
        }`;
      default:
        return strings.registroUsuarioErrors.defaultRegistroUsrMsg;
    }
  }
}
