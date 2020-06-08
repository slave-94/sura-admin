import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { GaleriaItem } from 'src/app/shared/model/galeria-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GALERIA_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';
import { Observable } from 'rxjs';
import { FormFile } from 'src/app/shared/model/form-file.model';
import { GALERIA_FORM } from 'src/app/shared/constants/data-model.consts';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {

  public collectionName = "galerias";
  public storageName = "galeria"

  //public base64;
  public images: Observable<GaleriaItem>;
  public galeriaItem = {} as GaleriaItem;
  public formFile = {} as FormFile;

  constructor(
    private _adminService: AdminService,
    private _dialogService: DialogService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getGaleria();
  }

  openLoadingDialog() {
    this._dialogService.buildDialog('Cargando', {}, 'loader', true);
  }

  closeLoadingDialog(title, msg) {
    this._dialogService.closeDialog();
    this._snackBar.open(title, msg, SNACKBAR_CONFIG);
  }

  getGaleria() {
    this.openLoadingDialog();
    this._adminService.getItems(this.collectionName).subscribe(
      result => {
        this.images = result;
        this._dialogService.closeDialog();
      }
    );
  }

  //this adds 'GaleriaItem' object
  addGaleriaItem() {
    this.formFile.formItems = GALERIA_FORM;
    this.formFile.imageRequired = true;
    this._dialogService.buildDialog('Cargar imagen', this.formFile, 'form-file').subscribe(
      result => {
        if(result) {
          this.galeriaItem.nombre = this._adminService.convertToJSON(result.formItems).nombre;
          this.formFile.image = result.image;
          this.createGaleriaItem();
        }
      }
    );
  }

  //this creates 'GaleriaItem' object in collection and image in storage
  createGaleriaItem() {
    this.openLoadingDialog();
    this._adminService.createItemWithImage(this.storageName, this.formFile.image,
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
    this._dialogService.buildDialog('¿Eliminar elemento?',
      `${GALERIA_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${GALERIA_MSGS.DEL_MSG_FIN}`, 'confirmation')
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog();
          this._adminService.deleteItemWithImage(this.storageName, itemSelectedData.imagenId, 
            this.collectionName, itemSelectedId).then(
            () => {
              this.closeLoadingDialog(GALERIA_MSGS.DELETE_SUCCESS, 'Ok');
            });
        }
      });
  }
}
