import { Component, OnInit, NgZone, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { LoginService } from '../login/login.service';

import { SectionDirective } from './section.directive';
import { SectionItem } from './section.item';
import { SectionService } from './section.service';
import { Dialog } from 'electron';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {
  @ViewChild(SectionDirective, {static:true}) sectionHost: SectionDirective;

  sections: SectionItem[];
  sectionSelected = 0;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _cfr: ComponentFactoryResolver,
    private _loginService: LoginService,
    private _sectionService: SectionService,
    private _dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.loadSections();
  }
  
  loadSections() {
    this.sections = this._sectionService.getComponents();    
    this.loadComponent(this.sections[0]);  
  }

  setInfoComponent() {
    this.loadComponent(this.sections[0]);
    this.sectionSelected = 0;
  }

  setEventosComponent() {
    this.loadComponent(this.sections[1]);
    this.sectionSelected = 1;
  }

  setGaleriaComponent() {
    this.loadComponent(this.sections[2]);
    this.sectionSelected = 2;
  }

  loadComponent(sectionItem: SectionItem) {
    const componentFactory = this._cfr.resolveComponentFactory(sectionItem.component);
    const viewContainerRef = this.sectionHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
  }

  logout() {
    this._dialogService.buildConfirmationDialog('Salir','¿Desea cerrar sesión?').subscribe(
      result => {
        if(result) {
          this._loginService.logout().then(
            () => {
              this._ngZone.run(() => this._router.navigate(['']));
              localStorage.clear();
            }
          );
        }
      }
    );
  }

  ngOnDestroy(): void {

  }

}
