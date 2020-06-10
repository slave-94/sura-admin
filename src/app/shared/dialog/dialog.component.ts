import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormItem } from './form-item.model';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  //form properties
  public key: string;
  public value: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  //form functions
  addItem() {
    if (this.data.content && this.key && this.value) {
      this.data.content.formItems.push(new FormItem(this.key, this.value));
      this.key = this.value = null;
    }
  }

  //file functions
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
    this.data.content.image = btoa(binaryString);
  }
}