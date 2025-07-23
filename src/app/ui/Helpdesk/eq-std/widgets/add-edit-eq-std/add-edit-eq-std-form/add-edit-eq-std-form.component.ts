import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { EqStdService } from '../../../services/eq-std.services';
import { AddEqStdFormComponent } from '../../add-eq-std/add-eq-std-form/add-eq-std-form.component';

@Component({
  selector: 'app-add-edit-eq-std-form',
  templateUrl: './add-edit-eq-std-form.component.html',
  styleUrls: ['./add-edit-eq-std-form.component.scss'],
  providers: [MessageService]
})
export class AddEditEqStdFormComponent implements OnInit {
  frmEqStdDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  @ViewChild(AddEqStdFormComponent, { static: false }) addEqStdFormPanel!: AddEqStdFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditEqStdFormComponent>,
    private authSrv: AuthService,
    private eqStdService: EqStdService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { 
    this.frmEqStdDetail = this.formBuilder.group({
      eqStdFormPanel: []
    })
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
      if (!this.isNew && this.data.isEdit) {
        this.title = 'Edit';
      }
    }
  }
  loadData() {
    const calls = [];
    if (this.data.eqStdId != null) {
      calls.push(this.eqStdService.getEqStdById(this.data.eqStdId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var eqData = {
          eqStdId: 0,
          eqStd: null,
          description: null,
        }
        setTimeout(() => {
          this.frmEqStdDetail.patchValue({
            eqStdFormPanel: eqData
          });
        }, 0);
      } else {
        this.addEqStdFormPanel.presentEqStandard = results[0].eqStd;
        setTimeout(() => {
          this.frmEqStdDetail.patchValue({
            eqStdFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  saveRecords() {
    if (this.frmEqStdDetail.valid) {
      const eqStdData = this.frmEqStdDetail.controls.eqStdFormPanel.value;
      this.eqStdService.saveEqStd(eqStdData).subscribe((res: any) => {
        if (res.eqStd != null) {
          this.dialogRef.close(res.eqStdId);
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
        this.dialogRef.close();
      },
      key: "eqStdDialog"
    });
  }
}
