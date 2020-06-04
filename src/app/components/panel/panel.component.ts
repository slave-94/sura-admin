import { Component, OnInit, NgZone, ViewContainerRef, ComponentFactoryResolver, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../login/login.service';

import { SectionDirective } from './section.directive';
import { SectionItem } from './section.item';
import { SectionComponent } from './section.component';
import { SectionService } from './section.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit, OnDestroy {
  @ViewChild(SectionDirective, {static:true}) sectionHost: SectionDirective;

  sections: SectionItem[];
  section: string;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _cfr: ComponentFactoryResolver,
    private _loginService: LoginService,
    private _sectionService: SectionService
  ) { }

  ngOnInit(): void {
    this.section = 'info';
    this.loadSections();
  }
  
  loadSections() {
    this.sections = this._sectionService.getComponents();    
    //this.loadComponent(this.sections[0]);  
    this.loadComponent(this.sections[2]);  
  }

  setInfoComponent() {
    this.loadComponent(this.sections[0]);
  }

  setEventosComponent() {
    this.loadComponent(this.sections[1]);
  }

  setGaleriaComponent() {
    this.loadComponent(this.sections[2]);
  }


  loadComponent(sectionItem: SectionItem) {
    const componentFactory = this._cfr.resolveComponentFactory(sectionItem.component);
    const viewContainerRef = this.sectionHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
    //const componentRef = viewContainerRef.createComponent(componentFactory);
    //(<SectionComponent>componentRef.instance).data = sectionItem.data();
  }

  logout() {
    this._loginService.logout().then(
      result => {
        this._ngZone.run(() => this._router.navigate(['']));
        localStorage.clear();
      }
    );
  }

  ngOnDestroy(): void {

  }

}
