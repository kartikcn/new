import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { PlanTradeService } from '../../services/plan-trade-services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-edit-plan-trade',
  templateUrl: './add-edit-plan-trade.component.html',
  styleUrls: ['./add-edit-plan-trade.component.scss'],
  providers: [MessageService]
})
export class AddEditPlanTradeComponent implements OnInit {

  formPlanTradeDetail: FormGroup;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  opertation_title = "";
  // @ViewChild(AddPlanStepsFormComponent, { static: false }) addPlanStepsFormComponent!: AddPlanStepsFormComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEditPlanTradeComponent>,
    private confirmationService: ConfirmationService,
    private planTradeService: PlanTradeService,
    private messageService: MessageService,
  ) {
    this.formPlanTradeDetail = this.formBuilder.group({
      planTradeFormPanel: []
    });
  }

  ngOnInit(): void {
    this.isEdit = true;
    this.isNew = true;
    if (this.data != null) {
      this.loadData();
      this.isNewRecord();
      this.opertation_title = this.isNew ? "Add" : "Edit";
    }
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
    }
  }

  loadData() {
    const calls = [];
    if (this.data.planTradeId != null) {
      calls.push(this.planTradeService.getPlanTradeById(this.data.planTradeId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
       let planTradeData = {
        planTradeId:null,
        planStepId:this.data.planStepId,
        tradeId:null,
        hoursRequired:null
       }
        setTimeout(() => {
          this.formPlanTradeDetail.patchValue({
            planTradeFormPanel: planTradeData
          });
        }, 0);

      } else {
        setTimeout(() => {
         
          this.formPlanTradeDetail.patchValue({
            planTradeFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.formPlanTradeDetail.valid) {
      const planTradeData: any = this.formPlanTradeDetail.controls.planTradeFormPanel.value;
      this.planTradeService.savePlanTrade(planTradeData).subscribe((res: any) => {
        if (res.code == 200) {
          this.dialogRef.close(true);
        } else {
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
      }
    });
  }
}
