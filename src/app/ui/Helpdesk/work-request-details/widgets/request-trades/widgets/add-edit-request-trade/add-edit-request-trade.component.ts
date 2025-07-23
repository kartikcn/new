import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, forkJoin, of } from 'rxjs';
import { AddRequestTradeComponent } from '../add-request-trade/add-request-trade.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { RequestTradeService } from '../../services/request-trade-services';
import { DatePipe } from '@angular/common';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-edit-request-trade',
  templateUrl: './add-edit-request-trade.component.html',
  styleUrls: ['./add-edit-request-trade.component.scss']
})
export class AddEditRequestTradeComponent {
  today: Date = new Date();
  frmreqTradeDetail!: FormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  isView: boolean = false;
  requestTradeId:number = 0;
  @ViewChild(AddRequestTradeComponent, { static: false }) AddRequestToolsComponent!: AddRequestTradeComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditRequestTradeComponent>,
    private confirmationService: ConfirmationService,
    private requestTradeService: RequestTradeService,
    private datePipe: DatePipe
  ) {
    this.frmreqTradeDetail = this.formBuilder.group({
      reqTradeFormPanel: []
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
    if (this.isView) {
      this.title = "";
    }
  }

  setUserChecks(data: any) {
    this.AddRequestToolsComponent.isRequestor = data.isRequestor;
    this.AddRequestToolsComponent.isApprover = data.isApprover;
    this.AddRequestToolsComponent.isSupervisor = data.isSupervisor;
    this.AddRequestToolsComponent.isTechnician = data.isTechnician;
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

  loadData() {
    const calls = [];
    if (this.data.requestTradeId != null) {
      calls.push(this.requestTradeService.getByrequestTradeId(this.data.requestTradeId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var reqtoolsData = {
          requestTradeId: null,
          tradeId: null,
          dateAssign: null,
          timeAssign: null,
          hoursRequired: null,
          requestId: this.data.requestId,
          actualHoursStd: null,
          actualHoursDouble: null,
          actualHoursOvertime: null

        };
        setTimeout(() => {
          this.frmreqTradeDetail.patchValue({
            reqTradeFormPanel: reqtoolsData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.AddRequestToolsComponent.previousTrade = results[0].tradeId;
          this.requestTradeId = results[0].requestTradeId;
          this.setUserChecks(this.data.userChecks);
          this.frmreqTradeDetail.patchValue({
            reqTradeFormPanel: results[0]
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

  saveRecords() {
    if (this.frmreqTradeDetail.valid) {
      const data: any = this.frmreqTradeDetail.controls.reqTradeFormPanel.value;
      data.dateAssign = this.datePipe.transform(data.dateAssign, "yyyy-MM-dd");
      data.timeAssign = this.convertToTime(data.timeAssign);
      this.requestTradeService.saveRequestTrade(data).subscribe((res: any) => {
        if (res.status != 202) {
          this.dialogRef.close(true);
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
      key: "reqtools"
    });
  }

  onDelete() {
   if(this.requestTradeId != 0 && !this.isView) {
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
    let requestTradeId=this.data.requestTradeId;
    this.requestTradeService.deleteByRequestTrade(requestTradeId).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        // this.messageService.add({ key: 'requestTradewarning', severity: 'warn', summary: 'Can not delete the record', detail: 'The part is associated with other records. Please change the part before deleting the record.' });
        this.dialogRef.close("not able to delete");
      } else {
        // this.messageService.add({ key: 'requestTradeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.dialogRef.close("deleted");
      }
    },
      error => {
      }
    );
  }

}
