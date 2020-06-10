import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { IGaleriaItem } from 'src/app/shared/model/galeria-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GALERIA_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';
import { Observable } from 'rxjs';
import { IFormContent } from 'src/app/shared/dialog/form-content.model';
import { GALERIA_FORM } from 'src/app/shared/constants/data-model.consts';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {

  public collectionName = "galerias";
  public storageName = "galeria"

  public images: Observable<IGaleriaItem>;
  public galeriaItem = {} as IGaleriaItem;

  constructor(
    private _adminService: AdminService,
    private _dialogService: DialogService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getGaleria();
  }

  openLoadingDialog(msg) {
    this._dialogService.buildLoaderDialog(msg, true);
  }

  closeLoadingDialog(title, msg) {
    this._dialogService.closeDialog();
    this._snackBar.open(title, msg, SNACKBAR_CONFIG);
  }

  getGaleria() {
    this.openLoadingDialog('Cargando');
    this._adminService.getItems(this.collectionName).subscribe(
      result => {
        this.images = result;
        this._dialogService.closeDialog();
      }
    );
  }

  //this adds 'GaleriaItem' object
  addGaleriaItem() {
    const formContent = { formItems: GALERIA_FORM, imageFieldAvailable: true } as IFormContent
    this._dialogService.buildFormDialog('Cargar imagen', formContent).subscribe(
      result => {
        if (result) {
          this.galeriaItem.nombre = this._adminService.convertToJSON(result.formItems).nombre;
          this.createGaleriaItem(result.image);
        }
      }
    );
  }

  //this creates 'GaleriaItem' object in collection and image in storage
  createGaleriaItem(image) {
    this.openLoadingDialog('Creando imagen');
    this._adminService.createItemWithImage(this.storageName, image,
      this.collectionName, this.galeriaItem, true).then(
        () => {
          this.closeLoadingDialog(GALERIA_MSGS.CREATE_SUCCESS, 'Ok');
          this.getGaleria();
        }
      );
  }

  //this deletes 'GaleriaItem' object in collection and image in storage
  deleteGaleriaItem(index) {
    const itemSelectedId = this.images[index].id;
    const itemSelectedData = this.images[index].data;
    this._dialogService.buildConfirmationDialog('¿Eliminar elemento?',
      `${GALERIA_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${GALERIA_MSGS.DEL_MSG_FIN}`)
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog('Eliminando imagen');
          this._adminService.deleteItemWithImage(this.storageName, itemSelectedData.imagenId,
            this.collectionName, itemSelectedId).then(
              () => {
                this.closeLoadingDialog(GALERIA_MSGS.DELETE_SUCCESS, 'Ok');
              });
        }
      });
  }
}
