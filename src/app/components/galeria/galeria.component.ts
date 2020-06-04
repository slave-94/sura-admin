import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { GaleriaItem } from 'src/app/shared/model/galeria-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GALERIA_MSGS } from 'src/app/shared/constants/messages.const';
import { SNACKBAR_CONFIG } from 'src/app/shared/constants/config.consts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss']
})
export class GaleriaComponent implements OnInit {

  public collectionName = "galerias";
  public storageName = "galeria"

  public base64;
  public images: Observable<GaleriaItem>;
  public galeriaItem = {} as GaleriaItem;

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

  getGaleria() {
    this.openLoadingDialog();
    this._adminService.getCollection(this.collectionName).subscribe(
      result => {
        this.images = result;
        this._dialogService.closeDialog();
      }
    );
  }

  selectFile(event) {
    const files = event.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event) {
    const binaryString = event.target.result;
    this.base64 = btoa(binaryString);
  }

  guardarImage() {
    this.openLoadingDialog();
    this._adminService.uploadImage(this.storageName, this.base64).then(
      (res) => {
        this.galeriaItem.imagenId = res.metadata.name;
        this.getImageUrl();
      }
    );
  }

  getImageUrl() {
    this._adminService.getImageUrl(this.storageName, this.galeriaItem.imagenId).then(
      result => {
        this.galeriaItem.imagenUrl = result;
        this.createGaleriaItem();
      }
    )
  }

  createGaleriaItem() {
    this._adminService.createItem(this.collectionName, this.galeriaItem).then(
      () => {
        this._dialogService.closeDialog();
        this._snackBar.open(GALERIA_MSGS.CREATE_SUCCESS, 'Ok', SNACKBAR_CONFIG);
        this.getGaleria();
      }
    )
  }

  //eliminar imagen del storage
  deleteImage(index) {
    const itemSelectedId = this.images[index].id;
    const itemSelectedData = this.images[index].data;
    this._dialogService.buildDialog('¿Eliminar elemento?', 
    `${GALERIA_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${GALERIA_MSGS.DEL_MSG_FIN}`, 'confirmation')
    .subscribe(result => {
      if(result) {
        this.openLoadingDialog();
        this._adminService.deleteImage(this.storageName, itemSelectedData.imagenId).then(
          ()=> {
            this.deleteGaleriaItem(itemSelectedId);
          }
        );
      }
    });
  }

  //eliminar imagen de la colección
  deleteGaleriaItem(id) {
    this._adminService.deleteItem(this.collectionName, id).then(
      ()=>{
        this._dialogService.closeDialog();
        this._snackBar.open(GALERIA_MSGS.DELETE_SUCCESS, 'Ok', SNACKBAR_CONFIG);
      }
    );
  }

}
