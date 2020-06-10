import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminService } from 'src/app/shared/services/admin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { Observable } from 'rxjs';
import { IEvento } from 'src/app/shared/model/evento-item.model';
import { IFormContent } from 'src/app/shared/dialog/form-content.model';

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

  openItinerarios(index) {
    this.evento = this.eventos[index].data;
    this.itinerarioClosed = false;
  }

  openLoadingDialog(msg) {
    this._dialogService.buildLoaderDialog(msg, true);
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
    const formContent = {
      formItems: EVENTO_FORM, imageFieldAvailable: true,
      imageFieldOptional: false
    } as IFormContent;
    this._dialogService.buildFormDialog('Nuevo evento', formContent)
      .subscribe(result => {
        if (result) {
          this.evento = this._adminService.convertToJSON(result.formItems);
          this.createEvento(result.image);
        } else {
          this._adminService.clearForm(EVENTO_FORM);
        }
      });
  }

  //this creates event in collection and image in storage
  createEvento(image) {
    this.openLoadingDialog('Creando evento');
    this._adminService.createItemWithImage(this.storageName, image,
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
    const formItems = this._adminService.fillForm(itemSelectedData, EVENTO_FORM);
    const formContent = { formItems: formItems, imageFieldAvailable: true, 
      imageFieldOptional: true } as IFormContent;
    this._dialogService.buildFormDialog('Editar evento', formContent)
      .subscribe(result => {
        if (result) {
          this.evento = this._adminService.addFormDataToItem(itemSelectedData, result.formItems);
          this.updateEvento(itemSelectedId, result.image);
        } else {
          this._adminService.clearForm(EVENTO_FORM);
        }
      });
  }

  //this updates 'evento' object and / or image in storage
  updateEvento(id, image) {
    if (image) {
      this.updateEventoWithImage(id, image);
    } else {
      this.updateEventoWithoutImage(id);
    }
  }

  updateEventoWithoutImage(id) {
    this.openLoadingDialog('Actualizando evento');
    this._adminService.updateItem(this.collectionName, id, this.evento).then(
      () => {
        this.closeLoadingDialog(EVENTOS_MSGS.UPDATE_SUCCESS, 'Ok');
        this.getEventos();
      });
  }

  updateEventoWithImage(id, image) {
    this.openLoadingDialog('Actualizando evento');
    this._adminService.updateItemWithImage(this.storageName, this.evento.imagenId, image,
      this.collectionName, id, this.evento).then(
        () => {
          this.closeLoadingDialog(EVENTOS_MSGS.UPDATE_SUCCESS, 'Ok');
          this.getEventos();
        });
  }

  //this deletes 'evento' object and image in storage
  deleteEvento(index) {
    const itemSelectedId = this.eventos[index].id;
    const itemSelectedData = this.eventos[index].data;
    this._dialogService.buildConfirmationDialog('¿Eliminar elemento?',
      `${EVENTOS_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${EVENTOS_MSGS.DEL_MSG_FIN}`)
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
