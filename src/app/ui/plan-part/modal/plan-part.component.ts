import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { PlanPartService } from '../services/plan-part-services';
import { PlanPartModalDialogueProvider } from '../providers/plan-part-provider';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-part',
  templateUrl: './plan-part.component.html',
  styleUrls: ['./plan-part.component.scss'],
  providers: [MessageService]
})
export class PlanPartComponent implements OnInit {
  loading: boolean = false;
  planPartsData: any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  planStepId: number = 0;

  constructor(
    private planPartService: PlanPartService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private planPartModalDialogueProvider: PlanPartModalDialogueProvider,
  ) {
  }


  ngOnInit(): void {
   
  }

  loadRecords(planStepId: any) {
    this.planStepId = planStepId;
    this.loading = true;
    this.planPartsData = [];
    this.planPartService.getAllPlanParts(planStepId).subscribe((res: any) => {
      if (res.status != 202) {
        this.planPartsData = res;
      }
      else {
        this.planPartsData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(planPartId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planPartId: planPartId,
      planStepId: this.planStepId,
      isEdit: true,
      newRecord: false
    };
    this.planPartModalDialogueProvider.openDialog(dialogConfig);
    this.planPartModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planPartSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      planPartId: null,
      planStepId: this.planStepId,
      isEdit: true,
      newRecord: true,
    };
    this.planPartModalDialogueProvider.openDialog(dialogConfig);
    this.planPartModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planPartSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      key: "planPartGrid"
    });
  }

  deletePlan(id: any) {
    this.planPartService.deletePlanPart(id).subscribe((res: any) => {
      if (res.code == 409) {
        this.messageService.add({ key: 'planPartDelete', severity: 'warn', detail: 'The Part is associated with other records. Please change the Part before deleting the record.' });
      } else {
        this.messageService.add({ key: 'planPartSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.planStepId);
      }
    },
      error => {

      }
    );
  }

}
