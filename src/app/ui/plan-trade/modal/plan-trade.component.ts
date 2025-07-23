import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { PpmPlanService } from '../../ppm-plan/services/ppm-plan-services';
import { PlanStepsModalDialogueProvider } from '../../ppm-plan/providers/plan-steps-providers';
import { MatDialogConfig } from '@angular/material/dialog';
import { PlanTradeModalDialogueProvider } from '../providers/plan-trade-providers';
import { PlanTradeService } from '../services/plan-trade-services';

@Component({
  selector: 'app-plan-trade',
  templateUrl: './plan-trade.component.html',
  styleUrls: ['./plan-trade.component.scss'],
  providers:[MessageService]
})
export class PlanTradeComponent implements OnInit {
  loading: boolean = false;
  planTradesData:any[]= [];
  rowCount: number = UtilConstant.ROW_COUNT;
  planStepId:number = 0;
  isHide: Boolean = true;
  selectedPlanId:any;
  @Output() parentFun = new EventEmitter();

  constructor(
    private planTradeService: PlanTradeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private planTradeModalDialogueProvider: PlanTradeModalDialogueProvider,
  ) {
  }


  ngOnInit(): void {
    // this.loadEnums();
    //this.loadRecords(this.planStepId);
  }

  loadRecords(planStepId:any) {
    this.planStepId = planStepId;
    this.loading = true;
    this.planTradesData = [];
    this.planTradeService.getAllPlanTrades(planStepId).subscribe((res: any) => {
      if (res.status != 202) {
        this.planTradesData = res;
      }
      else {
        this.planTradesData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(planTradeId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planTradeId: planTradeId,
      planStepId:this.planStepId,
      isEdit: true,
      newRecord: false
    };
    this.planTradeModalDialogueProvider.openDialog(dialogConfig);
    this.planTradeModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planTradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.planStepId);
      }
    })
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planTradeId: null,
      planStepId:this.planStepId,
      isEdit: true,
      newRecord: true,
      selectedPlanId:this.selectedPlanId
    };
    this.planTradeModalDialogueProvider.openDialog(dialogConfig);
    this.planTradeModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planTradeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords(this.planStepId);
      }
    })
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePlan(id);
      },
      key: "planTradeGrid"
    });
  }

  deletePlan(id: any) {
    this.planTradeService.deletePlanTrade(id).subscribe((res: any) => {
      if (res.code == 409) {
        this.messageService.add({ key: 'planTradeDelete', severity: 'warn', detail: 'The Trade is associated with other records. Please change the Trade before deleting the record.' });
      } else {
        this.messageService.add({ key: 'planTradeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.planStepId);
      }
    },
      error => {

      }
    );
  }

}
