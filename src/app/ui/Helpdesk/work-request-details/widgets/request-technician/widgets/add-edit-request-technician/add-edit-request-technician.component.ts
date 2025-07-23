import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestTechnician } from '../../modal/request-technician';
import { RequestTechnicianService } from '../services/request_technician.service';
import { DatePipe } from '@angular/common';
import { AddRequestTechniciansComponent } from '../add-request-technicians/add-request-technicians.component';

@Component({
  selector: 'app-add-edit-request-technician',
  templateUrl: './add-edit-request-technician.component.html',
  styleUrls: ['./add-edit-request-technician.component.scss']
})
export class AddEditRequestTechnicianComponent implements OnInit {
  frmreqTechnicianDetail!: UntypedFormGroup;
  value: any;
  dateAssign!: string;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  technicianId!: number;
  isView: boolean = false;
  requestTechnicianId:number = 0;
  @ViewChild(AddRequestTechniciansComponent, { static: false }) addRequestTechnicianComponent!: AddRequestTechniciansComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestTechnicianComponent>,
    private confirmationService: ConfirmationService,
    private requestTechnicianService: RequestTechnicianService,
    private datePipe: DatePipe

  ) {
    this.frmreqTechnicianDetail = this.formBuilder.group({
      reqTechnicianFormPanel: []
    });
  }

  ngOnInit(): void {

    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.isView = this.data.isView;
      this.loadData();
      this.disableButton();
      this.isNewRecord();
    }
    if (this.isView) {
     this.title = " "
    } 

  }

  setUserChecks(data: any) {
    this.addRequestTechnicianComponent.isRequestor = data.isRequestor;
    this.addRequestTechnicianComponent.isApprover = data.isApprover;
    this.addRequestTechnicianComponent.isSupervisor = data.isSupervisor;
    this.addRequestTechnicianComponent.isTechnician = data.isTechnician;
  }

  saveRecords() {
    if (this.frmreqTechnicianDetail.valid) {
      const data: RequestTechnician = this.frmreqTechnicianDetail.controls.reqTechnicianFormPanel.value;
      data.dateAssign = this.datePipe.transform(data.dateAssign, "yyyy-MM-dd");
      data.timeAssign = this.convertToTime(data.timeAssign);
      this.requestTechnicianService.saveRequestTechnician(data).subscribe((res: any) => {
        if (res.code != 202) {
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
      key: "reqtech"
    });
  }

  loadData() {
    const calls = [];
    if (this.data.requestTechId != null) {
      calls.push(this.requestTechnicianService.getByrequestTechnicianId(this.data.requestTechId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var reqtechnicianData = {
          technicianId: null,
          dateAssign: null,
          timeAssign: null,
          hoursRequired: null,
          requestTechnicianId: null,
          requestId: this.data.requestId,
          actualHoursStd: null,
          actualHoursDouble: null,
          actualHoursOvertime: null,
          TotalHours: null

        };
        setTimeout(() => {
          this.frmreqTechnicianDetail.patchValue({
            reqTechnicianFormPanel: reqtechnicianData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addRequestTechnicianComponent.previousTechnician = results[0].technicianId;
          this.setUserChecks(this.data.userChecks);
          this.requestTechnicianId = results[0].requestTechnicianId;
          this.frmreqTechnicianDetail.patchValue({
            reqTechnicianFormPanel: results[0]
          });
        }, 0);
      }
    });
  }
  convertToTime(value: any) {
    if (value != null) {
      return this.datePipe.transform(value, "HH:mm:ss");
    } else {
      return '';
    }
  }

  onDelete(){
    if(!this.isView && this.requestTechnicianId != 0) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteRequestTechnician();
        },
        key: "reqtech"
      });
    }
    
  }

  deleteRequestTechnician() {
    let requestTechnicianId = this.data.requestTechId;
    this.requestTechnicianService.deleteByRequestTechnician(requestTechnicianId).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.dialogRef.close("not able to delete");
      } else {
        this.dialogRef.close("deleted");
      }
    },
      
    );
  }
}
