import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { AppParamsDTO } from '../../model/app-params.dto';
import { AppParams } from '../../model/app-params.model';
import { AppParamsService } from '../../services/app-params.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-app-params',
  templateUrl: './add-edit-app-params.component.html',
  styleUrls: ['./add-edit-app-params.component.scss'],
  providers:[MessageService]
})
export class AddEditAppParamsComponent implements OnInit {
  frmAppParamDetail: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditAppParamsComponent>,
    private apSrv: AppParamsService,
    private confirmationService: ConfirmationService,
    private authSrv: AuthService,
    private toastr: ToastrService,
    private messageService: MessageService
  ) { 
    this.frmAppParamDetail = this.formBuilder.group({
      AppParamFormPanel: []
    });
  }

  ngOnInit() {
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
      this.isNew = this.data.newRecord
      if (!this.isNew) {
        this.title = 'Edit';
      }
    }
  }
  loadData() {

    const calls = [];
    if (this.data.paramId != null && this.data.paramId.toString().length > 0) {

      calls.push(this.apSrv.getAppParamById(this.data.appParamsId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var apData:AppParams = {
          "appParamsId":0,
          "paramId":"",
          "paramValue":"",
          "description":"",
          "isEditable" : "1"
        };
        setTimeout(() => {
          this.frmAppParamDetail.patchValue({
            AppParamFormPanel: apData,
          });
        }, 0);
      } else {
        setTimeout(() => {
          this.frmAppParamDetail.patchValue({
            AppParamFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmAppParamDetail.valid) {
      const apDataRecord: AppParamsDTO = this.frmAppParamDetail.controls.AppParamFormPanel.value
      this.apSrv.saveAppParam(apDataRecord).subscribe((res: any) => {
        if (res.code == 200) {
          this.messageService.add({ severity: 'success', summary: 'Record Saved', detail: 'Record Saved Succesfully' });
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 1000);
        }else{
          this.messageService.add({ severity: 'error', summary: 'error', detail: res.text });
        }
      },
      );
    }

  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close('cancel');
      }
    });
  }


}
