import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { PpmPlanService } from '../../services/ppm-plan-services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { MatDialogConfig } from '@angular/material/dialog';
import { PlanStepsModalDialogueProvider } from '../../providers/plan-steps-providers';
import { PlanTradeComponent } from 'src/app/ui/plan-trade/modal/plan-trade.component';
import { PlanToolComponent } from 'src/app/ui/plan-tool/modal/plan-tool.component';
import { PlanPartComponent } from 'src/app/ui/plan-part/modal/plan-part.component';

@Component({
  selector: 'app-plan-steps-list',
  templateUrl: './plan-steps-list.component.html',
  styleUrls: ['./plan-steps-list.component.scss'],
  providers: [MessageService]
})
export class PlanStepsListComponent implements OnInit {
  selectedPlan: string = "";
  loading: boolean = false;
  plnStepData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  planId: number = 0;
  isHide: Boolean = true;
  selectedPlanId: any;
  showDetails: boolean = false;
  selectedStep: any;
  index: number = 0;
  selectedTab: String = '';
  @Output() parentFun = new EventEmitter();
  @ViewChild(PlanTradeComponent, { static: false }) planTradeComponent!: PlanTradeComponent;
  @ViewChild(PlanToolComponent, { static: false }) planToolComponent!: PlanToolComponent;
  @ViewChild(PlanPartComponent, { static: false }) planPartComponent!: PlanPartComponent;
  constructor(
    private ppmPlanService: PpmPlanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private planStepsModalDialogueProvider: PlanStepsModalDialogueProvider,
  ) {
  }


  ngOnInit(): void {
    this.showDetails = false;
    this.loadRecords(this.planId);
  }

  loadRecords(planId: any) {
    this.planId = planId;
    this.loading = true;
    this.plnStepData = [];
    this.ppmPlanService.getAllPlanSteps(planId).subscribe((res: any) => {
      if (res.status != 202) {
        this.plnStepData = res;
      }
      else {
        this.plnStepData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(planStepId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planStepId: planStepId,
      isEdit: true,
      newRecord: false
    };
    this.planStepsModalDialogueProvider.openDialog(dialogConfig);
    this.planStepsModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.planId);
      }
    })
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planStepId: null,
      isEdit: true,
      newRecord: true,
      selectedPlanId: this.selectedPlanId
    };
    this.planStepsModalDialogueProvider.openDialog(dialogConfig);
    this.planStepsModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.planId);
      }
    })
  }

  onRowSelect(event: any) {
    this.selectedStep = event.data;
    setTimeout(() => {
      this.showDetails = true;
      this.planTradeComponent.loadRecords(event.data.planStepId);
    }, 10)
  }

  onClearState() {
    this.parentFun.emit(true);
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePlan(id);
      },
      key: "planStepsGrid"
    });
  }

  deletePlan(id: any) {
    this.ppmPlanService.deletePlanStep(id).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'planDelete', severity: 'warn', detail: 'The Step is associated with other records. Please change the Step before deleting the record.' });
      } else {
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.planId);
      }
    },
      error => {

      }
    );
  }

  handleChange(event: any) {
    if (event != null) {
      this.index = event.index;
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Trades":
        this.planTradeComponent.loadRecords(this.selectedStep.planStepId);
        break;
      case "Tools":
        this.planToolComponent.loadRecords(this.selectedStep.planStepId);
        break;
      case "Parts":
        this.planPartComponent.loadRecords(this.selectedStep.planStepId);
        break;
    }
  }
}
