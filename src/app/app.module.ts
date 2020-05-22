import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoginComponent } from './components/login/login.component';
import { PanelComponent } from './components/panel/panel.component';

//firebase
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from "angularfire2/storage";

const config = {
  apiKey: "AIzaSyA8z3MU_XvgW4WnddejtoIEklLbUvmkh2I",
  authDomain: "suraapp-e18e3.firebaseapp.com",
  databaseURL: "https://suraapp-e18e3.firebaseio.com",
  projectId: "suraapp-e18e3",
  storageBucket: "suraapp-e18e3.appspot.com",
  messagingSenderId: "163347150648"
};

import { LoginService } from './components/login/login.service';
import { SectionService } from './components/panel/section.service';

import { InfoComponent } from './components/info/info.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { SectionDirective } from './components/panel/section.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent,
    InfoComponent,
    EventosComponent,
    GaleriaComponent,
    SectionDirective
  ],
  entryComponents: [
    LoginComponent,
    EventosComponent,
    GaleriaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    FormsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  providers: [LoginService, SectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
