import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  @Input()
  public message: string = 'Are you sure you want to do this?';

  @Input()
  public title: string = 'Please confirm.';

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    if(this.data !== null && this.data !== undefined){
      if(this.data.title !== null && this.data.title !== undefined){
        this.title = this.data.title;
      }
      if(this.data.message !== null && this.data.message !== undefined){
        this.message = this.data.message;
      }
    }
  }

}
