import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-sub-department',
  templateUrl: './add-edit-sub-department.component.html',
  styleUrls: ['./add-edit-sub-department.component.scss'],
  providers: [MessageService]
})
export class AddEditSubDepartmentComponent {

  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  displayData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditSubDepartmentComponent>,
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
      subDepId: 0,
      depId: null,
      subDepCode: '',
      description: '',
      highlightColor: '#a6a6a6',
      subDepHead: null,
      divId: null,
    }
    this.displayData = data;
  }

  close(event: any) {
    this.dialogRef.close(event);
  }

}
