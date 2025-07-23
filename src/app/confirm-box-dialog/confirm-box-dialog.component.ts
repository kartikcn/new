
import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmBoxDialogModel } from '../model/confirm-dialog.model';

@Component({
  selector: 'app-confirm-box-dialog',
  templateUrl: './confirm-box-dialog.component.html',
  styleUrls: ['./confirm-box-dialog.component.scss']
})
export class ConfirmBoxDialogComponent implements OnInit {
  title: string;
  message: string;
  submessage: string;

  constructor(public dialogRef: MatDialogRef<ConfirmBoxDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmBoxDialogModel) {
                this.title = data.title;
                this.message = data.message;
                this.submessage = data.submessage;
      }

  ngOnInit() {
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }
}

