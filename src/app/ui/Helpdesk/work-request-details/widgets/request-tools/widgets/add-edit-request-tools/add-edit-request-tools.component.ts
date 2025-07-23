import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';import { ConfirmationService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { RequestToolsService } from '../services/request-tools.service';
import { RequestTools } from '../../model/request-tools';
import { DatePipe } from '@angular/common';
import { AddRequestToolsComponent } from '../add-request-tools/add-request-tools.component';

@Component({
  selector: 'app-add-edit-request-tools',
  templateUrl: './add-edit-request-tools.component.html',
  styleUrls: ['./add-edit-request-tools.component.scss']
})
export class AddEditRequestToolsComponent implements OnInit {
  today: Date = new Date();
  frmreqToolDetail!: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  isView: boolean = false;
  // technicianId!: number;
  reqToolId:number = 0;
  @ViewChild(AddRequestToolsComponent, { static: false }) AddRequestToolsComponent!: AddRequestToolsComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestToolsComponent>,
    private confirmationService: ConfirmationService,
    private requestToolsService: RequestToolsService,
    private datePipe: DatePipe
  ) {
    this.frmreqToolDetail = this.formBuilder.group({
      reqToolsFormPanel: []
    })
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

    if(this.isView) {
      this.title = "";
    }
  }

  setUserChecks(data:any) {
    this.AddRequestToolsComponent.isRequestor = data.isRequestor;
    this.AddRequestToolsComponent.isApprover = data.isApprover;
    this.AddRequestToolsComponent.isSupervisor = data.isSupervisor;
    this.AddRequestToolsComponent.isTechnician = data.isTechnician;
}

  saveRecords() {
    if (this.frmreqToolDetail.valid) {
      const data: RequestTools = this.frmreqToolDetail.controls.reqToolsFormPanel.value;
      data.dateAssign =  this.datePipe.transform(data.dateAssign, "yyyy-MM-dd");
      data.timeAssign = this.convertToTime(data.timeAssign);
      this.requestToolsService.saveRequestTools(data).subscribe((res: any) => {
        if (res.status != 202) {
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
      key: "reqtools"
    });
  }

  loadData() {
    const calls = [];
    if (this.data.reqToolId != null) {
      calls.push(this.requestToolsService.getByrequestToolsId(this.data.reqToolId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var reqtoolsData = {
          reqToolId: null,
          dateAssign: null,
          timeAssign: null,
          hoursRequired: null,
          requestId: this.data.requestId,
          actualHoursStd: null,
          actualHoursDouble: null,
          actualHoursOvertime: null

        };
        setTimeout(() => {
          this.frmreqToolDetail.patchValue({
            reqToolsFormPanel: reqtoolsData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.AddRequestToolsComponent.previousTools = results[0].toolId;
          this.setUserChecks(this.data.userChecks);
          this.reqToolId = results[0].reqToolId;
          this.frmreqToolDetail.patchValue({
            reqToolsFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  convertToTime(value: any) {
    if (value != null) {
      return this.datePipe.transform(value, "HH:mm:ss");
    } else {
      return this.datePipe.transform(new Date(), "HH:mm:ss");
    }
  }

  onDelete(){
   if(this.reqToolId != 0 && !this.isView) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRequestTools();
      },
      key: "reqtools"
    });
   }
  }

  deleteRequestTools() {
    let requestToolId = this.data.reqToolId;
    this.requestToolsService.deleteByRequestTools(requestToolId).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.dialogRef.close("not able to delete");
      } else {
        this.dialogRef.close("deleted");
      }
    },
      
    );
  }
}
