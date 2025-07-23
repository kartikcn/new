import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.scss'],
  providers: [MessageService]
})
export class AddEditDepartmentComponent {

  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  displayData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditDepartmentComponent>,
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
    let data ={
      depId: 0,
      depCode:'',
      description: '',
      highlightColor: '#a6a6a6',
      depHead: null,
      divId: null,
    }
    this.displayData = data;
  }

  close(event: any) {
    this.dialogRef.close(event);
  }
}
