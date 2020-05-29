import { Component, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormItemDialog } from '../model/form.dialog.model';

@Component({
    selector: 'dialog-component',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
  })
  export class DialogComponent {
    public key;
    public value;

    constructor(
      public dialogRef: MatDialogRef<DialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any){}

      addItem() {
        if(this.data.content && this.key && this.value) {
          this.data.content.push(new FormItemDialog(this.key, this.value));
        }
      }
  }