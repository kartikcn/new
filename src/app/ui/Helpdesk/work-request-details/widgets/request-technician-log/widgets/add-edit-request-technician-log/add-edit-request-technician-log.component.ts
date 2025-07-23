import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestTechnicianLogService } from '../../services/request-technician-log.service';
import { DatePipe } from '@angular/common';
import { AddRequestTechnicianLogComponent } from '../add-request-technician-log/add-request-technician-log.component';

@Component({
  selector: 'app-add-edit-request-technician-log',
  templateUrl: './add-edit-request-technician-log.component.html',
  styleUrls: ['./add-edit-request-technician-log.component.scss']
})
export class AddEditRequestTechnicianLogComponent implements OnInit  {
  frmRequestTechnicianLogDetail!: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  compId!: number;
  technicianDefault: boolean = true;
  requestId : any;
  isView:boolean = false;

  @ViewChild(AddRequestTechnicianLogComponent, { static: false }) addRequestTechnicianLogComponent!: AddRequestTechnicianLogComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestTechnicianLogComponent>,
    private requestTechnicianLogService: RequestTechnicianLogService,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
  ) {
    this.frmRequestTechnicianLogDetail = this.formBuilder.group({
      requestTechnicianLogFormPanel: []
    });

   }

  ngOnInit(): void {

    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isView = this.data.isView;
      this.technicianDefault = this.data.technician;
      this.requestId = this.data.requestId
      this.loadData();
      this.disableButton();
      this.isNewRecord();
    }

    if(this.isView) {
      this.title = "" ;
    }
  }

  setUserChecks(data:any) {
    this.addRequestTechnicianLogComponent.isRequestor = data.isRequestor;
    this.addRequestTechnicianLogComponent.isApprover = data.isApprover;
    this.addRequestTechnicianLogComponent.isSupervisor = data.isSupervisor;
    this.addRequestTechnicianLogComponent.isTechnician = data.isTechnician;
}

   loadData() {
    const calls = [];
    if (this.data.requestTechnicianLogId != null) {
      calls.push(this.requestTechnicianLogService.getByRequestTechnicianId(this.data.requestTechnicianLogId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe((results: any[]) => {
      if (results[0] == null) {
        var RequestTechnicianLogData = {
          
        requestTechnicianLogId: null,
         requestId:null,
         actualHoursStd:null,
         actualHoursDouble:null,
         actualHoursOvertime:null,
         workTyp:null,
         dateStarted:null,
         dateFinished:null,
          timeStarted:null,
         timeFinished:null,
         resourseType:null,
         comment:null
        };
        setTimeout(() => {
          this.addRequestTechnicianLogComponent.requestId = this.data.requestId;
          this.addRequestTechnicianLogComponent.loadRequestTechnicians(this.data.requestId);
          this.setUserChecks(this.data.userChecks);
          this.frmRequestTechnicianLogDetail.patchValue({
            requestTechnicianLogFormPanel: RequestTechnicianLogData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addRequestTechnicianLogComponent.requestId = this.data.requestId;
          this.addRequestTechnicianLogComponent.loadRequestTechnicians(this.data.requestId);
          this.setUserChecks(this.data.userChecks);
          this.frmRequestTechnicianLogDetail.patchValue({
            requestTechnicianLogFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.frmRequestTechnicianLogDetail.valid) {
      const data: any = this.frmRequestTechnicianLogDetail.controls.requestTechnicianLogFormPanel.value;
      data.dateStarted =  this.datePipe.transform(data.dateStarted, "yyyy-MM-dd");
      data.dateFinished =  this.datePipe.transform(data.dateFinished, "yyyy-MM-dd");
      data.timeStarted = this.convertToTime(data.timeStarted);
       data.timeFinished = this.convertToTime(data.timeFinished);
       data.requestId=this.data.requestId;
      this.requestTechnicianLogService.saveRequestTechnicianLog(data).subscribe((res: any) => {
        if (res.status!= 202) {
       
          this.dialogRef.close(true);
        }
      },
        error => {
        }
      );
    }
  }

  disableButton() {
    if (this.data.isEdit != null && !this.data.isEdit && !this.data.description) {
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

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: "requestTechLog"
    });
  }

  convertToTime(value: any) {
    if (value != null) {
      return this.datePipe.transform(value, "HH:mm:ss");
    } else {
      return null;
    }
  }
}


