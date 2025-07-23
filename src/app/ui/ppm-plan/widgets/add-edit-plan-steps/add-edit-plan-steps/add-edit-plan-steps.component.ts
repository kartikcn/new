import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { PpmPlanService } from '../../../services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddPlanStepsFormComponent } from '../../add-plan-steps/add-plan-steps-form.component';

@Component({
  selector: 'app-add-edit-plan-steps',
  templateUrl: './add-edit-plan-steps.component.html',
  styleUrls: ['./add-edit-plan-steps.component.scss'],
  providers: [MessageService]
})
export class AddEditPlanStepsComponent implements OnInit {

  formPPmDetail: FormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  isEdit: boolean = true;
  opertation_title = "";
  @Input() data!:any;
  @Output() parentFun = new EventEmitter();
  @ViewChild(AddPlanStepsFormComponent, { static: false }) addPlanStepsFormComponent!: AddPlanStepsFormComponent;
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private ppmPlanService: PpmPlanService,
    private messageService: MessageService,
  ) {
    this.formPPmDetail = this.formBuilder.group({
      planStepFormPanel: []
    });
  }

  ngOnInit(): void {
  
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
    }
  }

  loadData(planId:any,planStepId:any) { //changed this.data.planStepId
    const calls = [];
    if (planStepId) {
      calls.push(this.ppmPlanService.getPlanStepById(planStepId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let planStepData = {
          planStepId: null,
          planId: planId ,
          stepCode: null,
          instructions: null,
        }
        setTimeout(() => {
          this.addPlanStepsFormComponent.loadPlansData();
          this.formPPmDetail.patchValue({
            planStepFormPanel: planStepData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addPlanStepsFormComponent.prevPlanId = results[0].planId;
          this.addPlanStepsFormComponent.prevStepCode = results[0].stepCode;
          this.formPPmDetail.patchValue({
            planStepFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.formPPmDetail.valid) {
      const planStepData: any = this.formPPmDetail.controls.planStepFormPanel.value;
      this.ppmPlanService.savePlanStep(planStepData).subscribe((res: any) => {
        if (res.stepCode) {
          this.setPlanStepId(res);
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
      }
    });
  }

  setPlanStepId(planId:any) {
    this.parentFun.emit(planId);
  }
}
