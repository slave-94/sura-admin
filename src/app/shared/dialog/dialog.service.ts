import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Observable } from 'rxjs';
import { IFormContent } from './form-content.model';
import { FormItem } from './form-item.model';

@Injectable()
export class DialogService {

    constructor(
        private _dialog: MatDialog,
    ) { }

    buildLoaderDialog(title, closable?: boolean): Observable<any> {
        return this._dialog.open(DialogComponent, {
            data: {
                title: title,
                type: 'loader'
            },
            disableClose: closable
        }).afterClosed();
    }

    buildConfirmationDialog(title, content: string, closable?: boolean): Observable<any> {
        return this._dialog.open(DialogComponent, {
            data: {
                title: title,
                content: content,
                type: 'confirmation'
            },
            disableClose: closable
        }).afterClosed();
    }

    buildFormDialog(title, content?: IFormContent, closable?: boolean): Observable<any> {
        return this._dialog.open(DialogComponent, {
            data: {
                title: title,
                content: content,
                type: 'form'
            },
            disableClose: closable
        }).afterClosed();
    }

    buildImageUploaderDialog(title, directory: string, keyName: string, closable?: boolean): Observable<any> {
        return this._dialog.open(DialogComponent, {
            data: {
                title: title,
                content: {
                    formItems: [
                        new FormItem('directory', directory),
                        new FormItem('keyName', keyName)
                    ],
                    imageFieldAvailable: true
                } as IFormContent,
                type: 'form'
            },
            disableClose: closable
        }).afterClosed();
    }

    closeDialog() {
        this._dialog.closeAll();
    }

}