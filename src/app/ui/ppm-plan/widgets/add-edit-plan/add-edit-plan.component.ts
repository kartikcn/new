import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, forkJoin, of } from 'rxjs';
import { UtilConstant } from 'src/common/UtilConstant';
import { PpmPlanService } from '../../services/ppm-plan-services';
import { AddPlanFormComponent } from '../add-plan/add-plan-form.component';

@Component({
  selector: 'app-add-edit-plan',
  templateUrl: './add-edit-plan.component.html',
  styleUrls: ['./add-edit-plan.component.scss'],
  providers: [MessageService]
})
export class AddEditPlanComponent implements OnInit {
  formPPmDetail: FormGroup;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  isEdit: boolean = true;
  opertation_title = "";
  @Input() data!: any;
  @Output() parentFun = new EventEmitter();
  @ViewChild(AddPlanFormComponent, { static: false }) addPlanFormComponent!: AddPlanFormComponent;
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private ppmPlanService: PpmPlanService,
    private messageService: MessageService,
  ) {
    this.formPPmDetail = this.formBuilder.group({
      planFormPanel: [[Validators.required]]
    });
  }

  ngOnInit(): void {
  
  }

  isNewRecord() {
    if (this.data.newRecord != null) {
      this.isNew = this.data.newRecord
    }
  }

  loadData(planId: any) {
    const calls = [];
    if (planId != null) { 
      calls.push(this.ppmPlanService.getPlanById(planId));
    }
    else {
      calls.push(of(null));
    }

    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        let planData = {
          planId: 0,
          planName: null,
          planType: null,
          description: null,
          planDocument: null
        }
        setTimeout(() => {
          this.formPPmDetail.patchValue({
            planFormPanel: planData
          });
        }, 0);

      } else {
        setTimeout(() => {
          this.addPlanFormComponent.prevPlanName = results[0].planName;
          this.formPPmDetail.patchValue({
            planFormPanel: results[0]
          });
        }, 0);
      }
    });
  }

  saveRecords() {
    if (this.formPPmDetail.valid) {
      const planData: any = this.formPPmDetail.controls.planFormPanel.value;
      this.ppmPlanService.savePlan(planData).subscribe((res: any) => {
        if (res.planName) {
          this.setPlanId(res.planId);
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

  setPlanId(planId: any) {
    this.parentFun.emit(planId);
  }

}
