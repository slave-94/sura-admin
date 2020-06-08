import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from 'src/app/shared/services/admin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Observable } from 'rxjs';
import { IEvento } from 'src/app/shared/model/evento.model';
import { FormFile } from 'src/app/shared/model/form-file.model';

import { EVENTOS_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';
import { EVENTO_FORM } from 'src/app/shared/constants/data-model.consts';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public collectionName = "eventos";
  public storageName = "eventos"

  public eventos: Observable<IEvento>;
  public formFile = {} as FormFile;
  public evento = {} as IEvento;

  public itinerarioClosed = true;

  constructor(
    private _adminService: AdminService,
    private _dialogService: DialogService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getEventos();
  }

  closeChildCall($event) {
    this.itinerarioClosed = $event;
  }

  openItinerarios() {
    this.itinerarioClosed = false;
  }

  openLoadingDialog(msg) {
    this._dialogService.buildDialog(msg, {}, 'loader', true);
  }

  closeLoadingDialog(title, msg) {
    this._dialogService.closeDialog();
    this._snackBar.open(title, msg, SNACKBAR_CONFIG);
  }

  getEventos() {
    this.openLoadingDialog('Cargando');
    this._adminService.getItems(this.collectionName).subscribe(
      result => {
        this.eventos = result;
        this._dialogService.closeDialog();
      });
  }

  //this creates temp object
  addEvento() {
    this.formFile.formItems = EVENTO_FORM;
    this.formFile.imageRequired = true;
    this._dialogService.buildDialog('Nuevo evento', this.formFile, 'form-file')
      .subscribe(result => {
        if (result) {
          this.evento = this._adminService.convertToJSON(result.formItems);
          this.formFile.image = result.image;
          this.createEvento();
        } else {
          this.formFile = {} as FormFile;
          this._adminService.clearForm(EVENTO_FORM);
        }
      });
  }

  //this creates event in collection and image in storage
  createEvento() {
    this.openLoadingDialog('Creando evento');
    this._adminService.createItemWithImage(this.storageName, this.formFile.image,
      this.collectionName, this.evento, true).then(
        () => {
          this.closeLoadingDialog(EVENTOS_MSGS.CREATE_SUCCESS, 'Ok');
          this.getEventos();
        });
  }

  //this edits 'evento' object
  editEvento(index) {
    const itemSelectedId = this.eventos[index].id;
    const itemSelectedData = this.eventos[index].data;
    this.formFile.formItems = this._adminService.fillForm(itemSelectedData, EVENTO_FORM);
    this._dialogService.buildDialog('Editar evento', this.formFile, 'form-file')
      .subscribe(result => {
        if (result) {
          this.evento = this._adminService.addFormDataToItem(itemSelectedData, result.formItems);
          this.formFile.image = result.image;
          this.updateEvento(itemSelectedId);
        } else {
          this.formFile = {} as FormFile;
          this._adminService.clearForm(EVENTO_FORM);
        }
      });
  }

  //this updates 'evento' object and / or image in storage
  updateEvento(id) {
    if (this.formFile.image) {
      this.updateEventoWithImage(id);
    } else {
      this.updateEventoWithoutImage(id);
    }
  }

  updateEventoWithoutImage(id) {
    this._adminService.updateItem(this.collectionName, id, this.evento).then(
      () => {
        this.closeLoadingDialog(EVENTOS_MSGS.UPDATE_SUCCESS, 'Ok');
      });
  }

  updateEventoWithImage(id) {
    this.openLoadingDialog('Actualizando evento');
    console.log('evento->', this.evento)
    this._adminService.updateItemWithImage(this.storageName, this.evento.imagenId, this.formFile.image,
      this.collectionName, id, this.evento).then(
        () => {
          this.closeLoadingDialog(EVENTOS_MSGS.UPDATE_SUCCESS, 'Ok');
        });
  }

  //this deletes 'evento' object and image in storage
  deleteEvento(index) {
    const itemSelectedId = this.eventos[index].id;
    const itemSelectedData = this.eventos[index].data;
    this._dialogService.buildDialog('¿Eliminar elemento?',
      `${EVENTOS_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${EVENTOS_MSGS.DEL_MSG_FIN}`, 'confirmation')
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog('Eliminando evento');
          this._adminService.deleteItemWithImage(this.storageName, itemSelectedData.imagenId,
            this.collectionName, itemSelectedId).then(
              () => {
                this.closeLoadingDialog(EVENTOS_MSGS.DELETE_SUCCESS, 'Ok');
              });
        }
      });
  }
}
