import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { MatDialogConfig } from '@angular/material/dialog';
import { PlanToolModalDialogueProvider } from '../providers/plan-tool-providers';
import { PlanToolService } from '../services/plan-tool-services';

@Component({
  selector: 'app-plan-tool',
  templateUrl: './plan-tool.component.html',
  styleUrls: ['./plan-tool.component.scss'],
  providers:[MessageService]
})
export class PlanToolComponent implements OnInit {
  loading: boolean = false;
  planToolsData:any[]= [];
  rowCount: number = UtilConstant.ROW_COUNT;
  planStepId:number = 0;

  constructor(
    private  planToolService: PlanToolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private  planToolModalDialogueProvider: PlanToolModalDialogueProvider,
  ) {
  }


  ngOnInit(): void {
    // this.loadEnums();
    //this.loadRecords(this.planStepId);
  }

  loadRecords(planStepId:any) {
    this.planStepId = planStepId;
    this.loading = true;
    this. planToolsData = [];
    this. planToolService.getAllPlanTools(planStepId).subscribe((res: any) => {
      if (res.status != 202) {
        this. planToolsData = res;
      }
      else {
        this. planToolsData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem( planToolId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planToolId: planToolId,
      planStepId:this.planStepId,
      isEdit: true,
      newRecord: false
    };
    this. planToolModalDialogueProvider.openDialog(dialogConfig);
    this. planToolModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planToolSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      planToolId: null,
      planStepId:this.planStepId,
      isEdit: true,
      newRecord: true,
    };
    this. planToolModalDialogueProvider.openDialog(dialogConfig);
    this. planToolModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result) {
        this.messageService.clear();
        this.messageService.add({ key: 'planToolSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
        this.deleteTool(id);
      },
      key: "planToolGrid"
    });
  }

  deleteTool(id: any) {
    this. planToolService.deletePlanTool(id).subscribe((res: any) => {
      if (res.code == 409) {
        this.messageService.add({ key: 'planToolDelete', severity: 'warn', detail: 'The Tool is associated with other records. Please change the Tool before deleting the record.' });
      } else {
        this.messageService.add({ key: 'planToolSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.planStepId);
      }
    },
      error => {

      }
    );
  }

}
