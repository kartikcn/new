import { Component, Input, NgZone, OnInit } from '@angular/core';
import { SLARequestServices } from '../../services/sla-request-parameters.service';
import { AddSlaRequestDialogueProvider } from '../../providers/add-sla-request-steps-provider';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-wr-status-cards',
  templateUrl: './wr-status-cards.component.html',
  styleUrls: ['./wr-status-cards.component.scss'],
  providers: [MessageService]
})
export class WrStatusCardsComponent implements OnInit {
  wrStatus: EnumList[] = [];
  slaStepsData: any[] = [];
  stepsWithStatusData: any[] = [];
  slaResponseParametersId: number = 0;
  wrStepsData: any[] = [];
  slaResponseParameters!: any;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumAutoIssue: EnumList[] = [];
  enumAutoApproval: EnumList[] = [];
  idForAutoIssueYes: any = 0;
  idForAutoApprovalYes: any = 0;
  enumWr:EnumList[] =[];
  enumWrSteps: EnumList[] = [];
  enumStepType:EnumList[] = [];
  @Input() refresh: any;
  constructor(
    private slaReqSrv: SLARequestServices,
    private addSlaRequestDialogueProvider: AddSlaRequestDialogueProvider,
    private zone: NgZone,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumsrv: EnumService,
  ) { }

  ngOnInit(): void {
    this.stepsWithStatusData = [];
    this.loadEnums();
  }

  loadWrStatus() {
    this.wrStatus = [];
    this.stepsWithStatusData = [];
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.wrStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        // this.enumWrSteps = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase());
        this.enumStepType = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'step_type'.toLocaleUpperCase());
        this.getCombinedData();
      }
    )
  }

  loadStepsBySlaResponseParamId(data: any) {
    this.slaStepsData = [];
    if (data) {
      this.slaResponseParametersId = data.slaResponseParametersId;
      this.slaReqSrv.getSlaStepsList(data.slaResponseParametersId).subscribe((res: any) => {
        this.slaStepsData = res;
        this.loadWrStatus();
      })
    } else {
      this.slaResponseParametersId = 0;
      this.wrStatus = [];
      this.slaStepsData = [];
      this.getCombinedData();
    }
  }

  getCombinedData() {
    this.zone.run(() => {
      this.stepsWithStatusData = [];
      if (this.wrStatus.length > 0) {
        const combinedArray = this.wrStatus.map((wrStatus) => {
          const stepsForStatus = this.slaStepsData.filter((step) => step.wrStatus === wrStatus.enumKey);
          const isHidden = this.shouldMakeReadOnly(wrStatus)
          return { status: wrStatus, steps: stepsForStatus, hide: isHidden };
        });
        this.stepsWithStatusData = combinedArray;
      }
    });
  }

  getStepNameByStepId(stepId: any) {
    return this.wrStepsData.find((t: any) => t.stepId === stepId)?.step;
  }

  addSteps(status: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      wrStatus: status,
      slaResponseParametersId: this.slaResponseParametersId,
      isEdit: false,
      newRecord: true
    };
    this.addSlaRequestDialogueProvider.openDialog(dialogConfig);
    this.addSlaRequestDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result && result.slaRequestStepsId && result.slaRequestStepsId > 0) {
        this.messageService.add({ key: 'saveStep', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadStepsBySlaResponseParamId(result);
      }else if(result && result.text && result.text.length > 0){
        this.messageService.add({ key: 'saveStep', severity: 'warn', summary: 'Warning', detail: 'SLA Steps already exists' });
      }
    });
  }

  onEdit(step: any,status:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      step: step,
      wrStatus: status,
      slaResponseParametersId: this.slaResponseParametersId,
      isEdit: true,
      newRecord: false
    };
    this.addSlaRequestDialogueProvider.openDialog(dialogConfig);
    this.addSlaRequestDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result && result.slaRequestStepsId && result.slaRequestStepsId > 0) {
        this.messageService.add({ key: 'saveStep', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadStepsBySlaResponseParamId(result);
      }else if(result.text.length > 0){
        this.messageService.add({ key: 'saveStep', severity: 'warn', summary: 'Warning', detail: 'SLA Steps already exists' });
      }
    });
  }


  onDelete(slaRequestStep: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete(slaRequestStep);
      },
      key: "mygrid"
    });
  }

  delete(slaRequestStep: any) {
    this.slaReqSrv.deleteSlaRequestStep(slaRequestStep.slaRequestStepsId).subscribe((res: any) => {
      if (res.text === "Record Deleted") {
        //this.messageService.add({ key: 'saveStep', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadStepsBySlaResponseParamId(slaRequestStep);
      }
    });
  }

  shouldMakeReadOnly(wrStatus: any) {

    if (this.slaResponseParameters.autoIssue === this.idForAutoIssueYes) {
      if (wrStatus.enumValue === "Requested" || wrStatus.enumValue === "Approved" || wrStatus.enumValue === "Rejected") {
        this.deleteSteps(wrStatus.wrStatusId)
        return true;
      } else {
        return false;
      }
    } else if (this.slaResponseParameters.autoApproval === this.idForAutoApprovalYes && this.slaResponseParameters.autoIssue != this.idForAutoIssueYes) {
      if (wrStatus.enumValue === "Requested" || wrStatus.enumValue === "Rejected") {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.wrStatus = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        // this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase());
        this.enumAutoIssue = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_issue'.toLocaleUpperCase());
        this.enumAutoIssue.forEach(t => {
          if (t.enumValue === "Yes") {
            this.idForAutoIssueYes = t.enumKey;
          }
        })
        this.enumAutoApproval = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_approval'.toLocaleUpperCase());
        this.enumAutoApproval.forEach(t => {
          if (t.enumValue === "Yes") {
            this.idForAutoApprovalYes = t.enumKey;
          }
        })
        //this.loadWrSteps();
      },
      error => {
      }
    );
  }
  deleteSteps(wrStatusId:any) {
    this.slaStepsData.forEach(t => {
        if(t.wrStatus === wrStatusId) {
          this.delete(t)
        }
    })
  }

   getStepTypeEnumById(enumKey: any) {
    return this.enumStepType.find((t: any) => t.enumKey === enumKey)?.enumValue;
  }
}
