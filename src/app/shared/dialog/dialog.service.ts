import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Observable } from 'rxjs';

@Injectable()
export class DialogService {

    constructor(
        private _dialog: MatDialog,
    ) { }

    buildDialog(title, content, type, closable?: boolean): Observable<any> {
        return this._dialog.open(DialogComponent, {
            data: {
                title: title,
                content: content,
                type: type
            },
            disableClose: closable
        }).afterClosed();
    }

    closeDialog() {
        this._dialog.closeAll();
    }

}