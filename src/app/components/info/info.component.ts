import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AdminService } from '../../shared/services/admin.service';

import { InfoItem } from 'src/app/shared/model/info-item.model';

import { DIAG_MSGS } from '../../shared/constants/messages.const';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { IFormContent } from 'src/app/shared/dialog/form-content.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  public collectionName = '';
  public loading = true;
  public hasItems = false;

  public items: Observable<InfoItem[]>;

  constructor(
    private _adminService: AdminService,
    private _dialogService: DialogService
  ) { }

  ngOnInit(): void {
  }

  search() {
    this.openLoadingDialog();
    this._adminService.getItems(this.collectionName).subscribe(
      result => {
        this.items = result;
        this.closeLoadingDialog();
        if (result.length > 0) {
          this.hasItems = true;
        }
        console.log(result)
      }
    );
  }

  openLoadingDialog(): void {
    this._dialogService.buildLoaderDialog('Cargando', true);
  }

  closeLoadingDialog(): void {
    this._dialogService.closeDialog();
  }

  createItem() {
    const formContent = { formItems: [], dynamic: true } as IFormContent;
    this._dialogService.buildFormDialog('Nuevo item', formContent)
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog();
          const dataConverted = this._adminService.convertToJSON(result.formItems);
          this._adminService.createItem(this.collectionName, dataConverted).then(
            () => {
              this.closeLoadingDialog();
            }
          );
        }
      });
  }

  editItem(index) {
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    const formItems = this._adminService.getFormItems(itemSelectedData);
    const formContent = { formItems: formItems, dynamic: true } as IFormContent
    this._dialogService.buildFormDialog(itemSelectedData.nombre, formContent)
      .subscribe(result => {
        if (result) {
          const dataConverted = this._adminService.convertToJSON(result.formItems);
          this.updateItem(itemSelectedId, dataConverted);
        }
      });
  }

  updateItem(id, data) {
    this.openLoadingDialog();
    this._adminService.updateItem(this.collectionName, id, data).then(
      () => {
        this.closeLoadingDialog();
      }
    );
  }

  deleteItem(index) {
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    this._dialogService.buildConfirmationDialog('¿Eliminar elemento?',
      `${DIAG_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${DIAG_MSGS.DEL_MSG_FIN}`)
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog();
          if (itemSelectedData.imagenId) {
            this.deleteItemWithImage(this.collectionName, itemSelectedData.imagenId,
              this.collectionName, itemSelectedId);
          } else {
            this.deleteItemWithoutImage(this.collectionName, itemSelectedId);
          }
        }
      });
  }

  deleteItemWithImage(storage, imagenId, collection, itemId) {
    this._adminService.deleteItemWithImage(storage, imagenId, collection, itemId).then(
      () => {
        this.closeLoadingDialog();
      }
    );
  }

  deleteItemWithoutImage(collection, id) {
    this._adminService.deleteItem(collection, id).then(
      () => {
        this.closeLoadingDialog();
      }
    );
  }

  linkImage(index) {
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    this._dialogService.buildImageUploaderDialog('Agregar imagen', this.collectionName, 'imagen')
      .subscribe(result => {
        if (result) {
          this.openLoadingDialog();
          const dataConverted = this._adminService.convertToJSON(result.formItems);
          const imgKey = this._adminService.generateFormItem(dataConverted.keyName, result.image);
          const data = this._adminService.addFormDataToItem(itemSelectedData, imgKey);
          console.log('data->', data)
          this._adminService.uploadImage(dataConverted.directory, data.imagen, data.nombre).then(
            result => {
              data.imagenId = result.metadata.name;
              this._adminService.getImageUrl(dataConverted.directory, data.imagenId).then(
                result => {
                  data.imagen = result;
                  this.updateItem(itemSelectedId, data);
                });
            });
        }
      });
  }
}
