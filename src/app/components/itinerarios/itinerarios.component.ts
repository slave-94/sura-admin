import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-itinerarios',
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.scss']
})
export class ItinerariosComponent implements OnInit {
  @Output() closeChild = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.closeChild.emit(true);
  }

}
