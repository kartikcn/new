import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ToolTypeService } from '../../services/tool-type.service';
import { AddToolTypeComponent } from '../add-tool-type/add-tool-type.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-tool-type',
  templateUrl: './add-edit-tool-type.component.html',
  styleUrls: ['./add-edit-tool-type.component.scss'],
  providers: [MessageService]
})
export class AddEditToolTypeComponent implements OnInit {
  frmToolTypeDetail!: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  @ViewChild(AddToolTypeComponent, { static: false }) addToolTypeFormPanel!: AddToolTypeComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditToolTypeComponent>,
    private service: ToolTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authServ: AuthService,
  ) {
    this.frmToolTypeDetail = this.formBuilder.group({
      toolTypeFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.disableButton();
      this.isNewRecord();
    }
  }
  disableButton() {
    if (this.data.isEdit != null && !this.data.isEdit) {
      this.isEdit = false;
    }
  }
  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord;
      if (!this.isNew)
        this.title = 'Edit';
    }
  }
  loadData() {
    const calls = [];
    if (this.data.toolTypeId != null) {
      calls.push(this.service.getToolTypeById(this.data.toolTypeId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var toolTypeData = {
          toolTypeId: 0,
          toolType: null,
          description: null,
        };
        setTimeout(() => {
          this.frmToolTypeDetail.patchValue({
            toolTypeFormPanel: toolTypeData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addToolTypeFormPanel.presentToolType = results[0].toolType;
          this.frmToolTypeDetail.patchValue({
            toolTypeFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmToolTypeDetail.valid) {
      const data = this.frmToolTypeDetail.controls.toolTypeFormPanel.value;
      this.service.saveToolType(data).subscribe((res: any) => {
        if (res.toolTypeId) {
          this.dialogRef.close(res.toolTypeId);
        }else {
          this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
        }
      },
        error => {
        }
      );
    }

  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key:"Confirmation"
    });
  }

}
