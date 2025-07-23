import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { PlanToolService } from '../../services/plan-tool-services';

@Component({
  selector: 'app-add-edit-plan-tool',
  templateUrl: './add-edit-plan-tool.component.html',
  styleUrls: ['./add-edit-plan-tool.component.scss'],
  providers: [MessageService]
})
export class AddEditPlanToolComponent implements OnInit {

  formPlanToolDetail: FormGroup;
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
    public dialogRef: MatDialogRef<AddEditPlanToolComponent>,
    private confirmationService: ConfirmationService,
    private planToolService: PlanToolService,
    private messageService: MessageService,
  ) {
    this.formPlanToolDetail = this.formBuilder.group({
      planToolFormPanel: []
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
    if (this.data.planToolId != null) {
      calls.push(this.planToolService.getPlanToolById(this.data.planToolId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
       let planToolData = {
        planToolId:null,
        planStepId:this.data.planStepId,
        tradeId:null,
        hoursRequired:null
       }
        setTimeout(() => {
          this.formPlanToolDetail.patchValue({
            planToolFormPanel: planToolData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.formPlanToolDetail.patchValue({
            planToolFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.formPlanToolDetail.valid) {
      const planToolData: any = this.formPlanToolDetail.controls.planToolFormPanel.value;
      this.planToolService.savePlanTool(planToolData).subscribe((res: any) => {
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

