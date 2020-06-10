import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from 'src/app/shared/services/admin.service';
import { IEvento } from 'src/app/shared/model/evento.model';
import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { FormFile } from 'src/app/shared/model/form-file.model';

import { ITINERARIOS_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';
import { ITINERARIO_FORM } from 'src/app/shared/constants/data-model.consts';
import { IItinerario } from 'src/app/shared/model/itinerario.model';

@Component({
  selector: 'app-itinerarios',
  templateUrl: './itinerarios.component.html',
  styleUrls: ['./itinerarios.component.scss']
})
export class ItinerariosComponent implements OnInit {
  @Input() evento: IEvento;
  @Output() closeChild = new EventEmitter();

  public collectionName = "itinerarios";

  public itinerarios: Array<any>;
  public itinerario = {} as IItinerario;
  public formFile = {} as FormFile;

  constructor(
    private _adminService: AdminService,
    private _dialogService: DialogService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getItinerarios();
  }

  openLoadingDialog(msg) {
    this._dialogService.buildDialog(msg, {}, 'loader', true);
  }

  closeLoadingDialog(title, msg) {
    this._dialogService.closeDialog();
    this._snackBar.open(title, msg, SNACKBAR_CONFIG);
  }

  getItinerarios() {
    this.itinerarios = [];
    this.openLoadingDialog('Cargando');
    this._adminService.getItemsWithRelationship(this.collectionName, 'eventoId', this.evento.id).then(
      result => {
        result.forEach(
          doc => {
            this.itinerarios.push(doc.data());
          }
        );
        this._dialogService.closeDialog();
      }
    );
  }

  addItinerario() {
    this.formFile.formItems = ITINERARIO_FORM;
    this.formFile.itemHasModel = true;
    this._dialogService.buildDialog('Nuevo itinerario', this.formFile, 'form')
      .subscribe(result => {
        if (result) {
          this.itinerario = this._adminService.convertToJSON(result.formItems);
          this.formFile.image = result.image;
          this.createItinerario();
        } else {
          this.formFile = {} as FormFile;
          this._adminService.clearForm(ITINERARIO_FORM);
        }
      });
  }

  createItinerario() {
    this.openLoadingDialog('Creando itinerario');
    this.itinerario.eventoId = this.evento.id;
    this._adminService.createItem(this.collectionName, this.itinerario, true).then(
      () => {
        this.closeLoadingDialog(ITINERARIOS_MSGS.CREATE_SUCCESS, 'Ok');
        this.getItinerarios();
      });
  }

  editItinerario(index) {
    this.itinerario = this.itinerarios[index];
    this.formFile.formItems = this._adminService.fillForm(this.itinerario, ITINERARIO_FORM);
    this.formFile.itemHasModel = true;
    this._dialogService.buildDialog('Editar evento', this.formFile, 'form')
      .subscribe(result => {
        if (result) {
          this.itinerario = <IItinerario>this._adminService.addFormDataToItem(this.itinerario, result.formItems);
          this.updateItinerario(this.itinerario.id);
        } else {
          this.formFile = {} as FormFile;
          this._adminService.clearForm(ITINERARIO_FORM);
        }
      });
  }

  updateItinerario(id) {
    this.openLoadingDialog('Actualizando itinerario');
    this._adminService.updateItem(this.collectionName, id, this.itinerario).then(
      () => {
        this.closeLoadingDialog(ITINERARIOS_MSGS.UPDATE_SUCCESS, 'Ok');
        this.getItinerarios();
      });
  }

  deleteItinerario(index) {
    this.itinerario = this.itinerarios[index];
    this._dialogService.buildDialog('¿Eliminar elemento?',
      `${ITINERARIOS_MSGS.DEL_MSG_INI} ${this.itinerario.nombre} ${ITINERARIOS_MSGS.DEL_MSG_FIN}`, 'confirmation')
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog('Eliminando evento');
          this._adminService.deleteItem(this.collectionName, this.itinerario.id).then(
            () => {
              this.closeLoadingDialog(ITINERARIOS_MSGS.DELETE_SUCCESS, 'Ok');
              this.getItinerarios();
            });
        }
      });
  }

  close() {
    this.closeChild.emit(true);
  }

}
