import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ToolsService } from '../../services/tools.services';
import { AddToolsComponent } from '../add-tools/add-tools.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-tools',
  templateUrl: './add-edit-tools.component.html',
  styleUrls: ['./add-edit-tools.component.scss'],
  providers: [MessageService]
})
export class AddEditToolsComponent implements OnInit {
  frmToolsDetail!: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean = true;
  title: string = 'Add';
  @ViewChild(AddToolsComponent, { static: false }) addToolsFormPanel!: AddToolsComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditToolsComponent>,
    private service: ToolsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authServ: AuthService,
  ) {
    this.frmToolsDetail = this.formBuilder.group({
      toolsFormPanel: []
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
    if (this.data.toolsId != null) {
      calls.push(this.service.getToolById(this.data.toolsId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var toolData = {
          toolsId: 0,
          tool: null,
          toolTypeId: 0,
          hourlyRate: null,
          overTimeRate: null,
          standardAvalTime: null,
          doubleRate:null,
          description: null,
        };
        setTimeout(() => {
          this.frmToolsDetail.patchValue({
            toolsFormPanel: toolData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addToolsFormPanel.presentTool = results[0].tool;
          this.frmToolsDetail.patchValue({
            toolsFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmToolsDetail.valid) {
      const data = this.frmToolsDetail.controls.toolsFormPanel.value;
      this.service.saveTool
        (data).subscribe((res: any) => {
          if (res.toolsId) {
            this.dialogRef.close(true);
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
      key:"ConfirmTool"
    });
  }


}
