import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { InfoService } from './info.service';

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { InfoItem } from 'src/app/shared/model/info-item.model';
import { FormItemDialog } from 'src/app/shared/model/form.dialog.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  public collectionName = '';
  public loading = true;

  public items: Observable<InfoItem[]>;

  constructor(
    private _dialog: MatDialog,
    private _infoService: InfoService
  ) { }

  ngOnInit(): void {
  }

  search() {
    this.openLoadingDialog();
    this._infoService.getCollection(this.collectionName).subscribe(
      result => {
        this.items = result;
        this.closeLoadingDialog();        
      }
    );
  }

  openLoadingDialog(): void {
    this._dialog.open(DialogComponent, {
      data: {
        title: 'Cargando',
        content: {},
        type: 'loader'
      },
      disableClose: true
    });
  }

  closeLoadingDialog(): void {
    this._dialog.closeAll();
  }

  editItem(index) {
    const formItems = [];
    const itemSelectedId = this.items[index].id;
    const itemSelectedData = this.items[index].data;
    const itemKeys = Object.keys(itemSelectedData);
    for(var key of itemKeys) {
      formItems.push(new FormItemDialog(key, itemSelectedData[key]));
    }
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        title: itemSelectedData.nombre,
        content: formItems,
        type: 'form'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.updateInfo(itemSelectedId, result);
      }
    });
  }

  updateInfo(id, data) {
    this.openLoadingDialog();
    const dataConverted = this._infoService.convertToJSON(data);
    this._infoService.updateItemData(this.collectionName, id, dataConverted).then(
      result => {
        this.closeLoadingDialog();
      }
    );
  }

  deleteItem(index) {
    const itemSelectedName = this.items[index].data.nombre;
    const dialogRef = this._dialog.open(DialogComponent, {
      data: {
        title: '¿Eliminar elemento?',
        content: `La información de ${itemSelectedName} será eliminada permanentemente`,
        type: 'confirmation'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
