import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { AdminService } from '../../shared/services/admin.service';

import { InfoItem } from 'src/app/shared/model/info-item.model';

import { DIAG_MSGS } from '../../shared/constants/messages.const';
import { DialogService } from 'src/app/shared/dialog/dialog.service';
import { FormFile } from 'src/app/shared/model/form-file.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  public collectionName = '';
  public loading = true;
  public hasItems = false;

  public formFile = {} as FormFile;

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
        if(result.length > 0) {
          this.hasItems = true;
        }
      }
    );
  }

  openLoadingDialog(): void {
    this._dialogService.buildDialog('Cargando', {}, 'loader', true);
  }

  closeLoadingDialog(): void {
    this._dialogService.closeDialog();
  }

  editItem(index) {
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    this.formFile.formItems = this._adminService.getFormItems(itemSelectedData);
    this._dialogService.buildDialog(itemSelectedData.nombre, this.formFile, 'form')
    .subscribe(result => {
      if (result) {
        this.updateItem(itemSelectedId, result.formItems);
      }
    });
  }

  createItem() {
    const formItems = [];
    this._dialogService.buildDialog('Nuevo item', formItems, 'form')
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

  updateItem(id, data) {
    this.openLoadingDialog();
    const dataConverted = this._adminService.convertToJSON(data);
    this._adminService.updateItem(this.collectionName, id, dataConverted).then(
      () => {
        this.closeLoadingDialog();
      }
    );
  }

  deleteItem(index) {
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    this._dialogService.buildDialog('¿Eliminar elemento?', 
    `${DIAG_MSGS.DEL_MSG_INI} ${itemSelectedData.nombre} ${DIAG_MSGS.DEL_MSG_FIN}`, 'confirmation')
    .subscribe(result => {
      if(result) {
        this.openLoadingDialog();
        this._adminService.deleteItem(this.collectionName, itemSelectedId).then(
          () => {
            this.closeLoadingDialog();
          }
        );
      }
    });
  }
}
