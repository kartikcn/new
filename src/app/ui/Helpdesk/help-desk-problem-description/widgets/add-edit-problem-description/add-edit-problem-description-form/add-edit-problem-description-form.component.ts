import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProblemDescriptionService } from '../../../services/problem-description.services';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
@Component({
  selector: 'app-add-edit-problem-description-form',
  templateUrl: './add-edit-problem-description-form.component.html',
  styleUrls: ['./add-edit-problem-description-form.component.scss'],
  providers: [MessageService]
})
export class AddEditProblemDescriptionFormComponent implements OnInit {
  frmPdDetail: UntypedFormGroup;
  value: any;
  isNew: boolean = true;
  isEdit: boolean= true;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditProblemDescriptionFormComponent>,
    private pdSrv: ProblemDescriptionService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private messageService: MessageService,
  ) { 
    this.frmPdDetail = this.formBuilder.group({
      pdFormPanel: []
    });
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
      this.isNew = this.data.newRecord;
      if (!this.isNew)
        this.title = 'Edit';
    }
  }
  loadData() {
    const calls = [];
    if (this.data.pdId != null) {
     calls.push(this.pdSrv.getPdById(this.data.pdId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var pdData = {
          "pdId": null,
          "pdDescription": null,
        };
        setTimeout(() => {
          this.frmPdDetail.patchValue({
            pdFormPanel: pdData,
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmPdDetail.patchValue({
            pdFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
 
  saveRecords() {
    if (this.frmPdDetail.valid) {
      const pdData: any = this.frmPdDetail.controls.pdFormPanel.value;
      this.pdSrv.savePd(pdData).subscribe((res: any) => {
        if (res.code == 200) {
          this.toastr.success("Record saved Successfully.");
          this.dialogRef.close(res);
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
      key: "positionDialog"
    });
  }

}
