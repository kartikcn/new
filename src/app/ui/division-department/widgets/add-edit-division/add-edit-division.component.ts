import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-division',
  templateUrl: './add-edit-division.component.html',
  styleUrls: ['./add-edit-division.component.scss'],
  providers: [MessageService]
})
export class AddEditDivisionComponent {

  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  displayData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditDivisionComponent>,
    private messageService: MessageService,
  ) {

  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
    }
  }

  loadData() {
    let data = {
      divId: 0,
      divCode: '',
      description: '',
      highlightColor: '#a6a6a6',
      divHead: null
    }
    this.displayData = data;
  }

  close(event: any) {
    this.dialogRef.close(event);
  }


}
