import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { forkJoin, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SLARequestServices } from '../../services/sla-request-parameters.service';
import { WrStatusCardsComponent } from '../wr-status-cards/wr-status-cards.component';
import { EnumService } from 'src/app/services/enum.service';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-add-edit-sla',
  templateUrl: './add-edit-sla.component.html',
  styleUrls: ['./add-edit-sla.component.scss'],
  providers: [MessageService]
})
export class AddEditSlaComponent implements OnInit {

  frmSLATab: UntypedFormGroup;
  priorityForm!: UntypedFormGroup;
  value: any;
  subscriptions: Subscription[] = [];
  isNew: boolean = true;
  confirmationResult: any;
  isEdit: boolean = true;
  title: string = 'Add';
  compId!: number;
  slaRequestParametersId: number = 0;
  slaResponseParametersId: number = 0;
  slaResponseParameters: any[] = []
  updateResponseParameters: any[] = []
  slaRequest: any[] = [];
  tab_name_clicked: string = 'SLA';
  isReadOnly: boolean = true;
  displayCancelScreen: boolean = false;
  activeTabIndex = 0;
  enumPriority: any[] = [];
  filteredPriorities!: any[];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumIsDefault: EnumList[] = [];
  enumAutoIssue: EnumList[] = [];
  enumAutoApproval: EnumList[] = [];
  idForIsDefaultNo: any = 0;
  idForIsDefaultYes: any = 0;
  idForAutoIssueNo: any = 0;
  idForAutoApprovalNo: any = 0;
  idForAutoApprovalYes: any = 0;
  editPriority : boolean = false;
  priorityHeading: string = '';
  selectedPriority!: any | null;
  priorityExistErrror: string = '';
  refresh: boolean = false;
  enumNotifyRequestor:EnumList[] = [];
  idForNotifyRequestorNo: any = 0;
  @ViewChild('tabview') tabview!: TabView;
  @ViewChild(WrStatusCardsComponent, { static: false }) wrStatusCardspanel!: WrStatusCardsComponent;
  technicianTeamWarning : boolean = false;
  isDefaultSla : boolean = false;
  enableAutoApprove : boolean = false;
  @Output() notifyAutoApprove : EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyAutoIssue: EventEmitter<any> = new EventEmitter<any>();
  enumWr : EnumList[]=[];
  enumStatus : EnumList[]=[];
  idForApproved : any;
  idForApprovalStepType : any;
  approvalStepWarning : boolean = false;
  idForRequested : any;
  idForRejected : any;
  enumSlaSteps : EnumList[]=[];
  enumStepType : EnumList[]=[];
  useTabletProtrait = false;
  params:any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: SLARequestServices,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private authSrv: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private enumsrv: EnumService,
    private confirmationService: ConfirmationService,
    private bps : BreakpointService
  ) {
    this.frmSLATab = this.formBuilder.group({
      slaRequestPanel: [],
      slaResponsePanel: [],
    });
    this.priorityForm = this.formBuilder.group({
      priority: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.initialLoadValues();
  }

  initialLoadValues(){
    this.route.queryParams.subscribe((params: any) => {
      if (params) {
        this.slaRequest = params.slaRequest;
        this.params = params;
        this.slaRequestParametersId = parseInt(params.slaRequestParametersId);
        this.isDefaultSla = params.isDefaultSla === "true";
      }
    })
    this.loadEnums();
    this.getAllResponseParams();
  }

  notify(): void {
    let previousSlaRequest = this.frmSLATab.controls.slaRequestPanel.value;
    let previousSlaResponse = this.frmSLATab.controls.slaResponsePanel.value;
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.initialLoadValues();
    setTimeout(() => {
      this.frmSLATab.patchValue({
        slaRequestPanel: previousSlaRequest,
        slaResponsePanel: previousSlaResponse
      });
    }, 10);
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));

        // this.enumSlaSteps = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase());
        this.enumStepType =  this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'step_type'.toLocaleUpperCase());
        this.enumStepType.forEach(t => {
          if(t.enumValue === "Approval") {
            this.idForApprovalStepType = t.enumKey;
          }
        })
        
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.enumStatus.forEach(t => {
          if(t.enumValue === "Approved") {
            this.idForApproved = t.enumKey;
          }
          if(t.enumValue === "Requested"){
            this.idForRequested = t.enumKey;
          }
          if(t.enumValue === "Rejected"){
            this.idForRejected = t.enumKey;
          }
        })

        // this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase());

        this.enumIsDefault = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'is_default'.toLocaleUpperCase());
        this.enumIsDefault.forEach(t => {
          if(t.enumValue === "No") {
            this.idForIsDefaultNo = t.enumKey;
          }else{
            this.idForIsDefaultYes = t.enumKey;
          }
        })
        this.enumAutoIssue = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_issue'.toLocaleUpperCase());
        this.enumAutoIssue.forEach(t => {
          if(t.enumValue === "No") {
            this.idForAutoIssueNo = t.enumKey;
          }
        })
        this.enumAutoApproval = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_approval'.toLocaleUpperCase());
        this.enumAutoApproval.forEach(t => {
          if(t.enumValue === "No") {
            this.idForAutoApprovalNo = t.enumKey;
          }else{
            this.idForAutoApprovalYes = t.enumKey;
          }
        })

        this.enumNotifyRequestor = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'notify_requestor'.toLocaleUpperCase());
        
        this.enumNotifyRequestor.forEach(t => {
          if(t.enumValue === "No") {
            this.idForNotifyRequestorNo = t.enumKey;
          }
        })
        this.setData();
      },
      error => {
      }
    );
  }

  setData() {
    const calls = [];
    if (this.slaRequestParametersId != 0) {
      calls.push(this.service.getSLARequestById(this.slaRequestParametersId));
    }
    else {
      calls.push(of(null));
    }
    forkJoin(...calls).subscribe(results => {
      if (results[0] == null) {
        var slaData = {
          slaRequestParametersId: null,
          probTypeId: null,
          problemTypeString: null,
          eqStd: null,
          eqId: null,
          siteId: null,
          blId: null,
          flId: null,
          rmId: null,
          compId: 1,
        };
        this.slaResponseParameters = [];
        this.slaResponseParameters.push({ priority: "Routine Work" });
        this.setResponseNull('Routine Work');

        setTimeout(() => {
          this.frmSLATab.patchValue({
            slaRequestPanel: slaData
          });

        }, 0);
      } else {
        this.slaRequestParametersId = results[0].slaRequestParametersId;
        this.slaResponseParameters = results[0].slaResponseParameters;
        this.updateResponseParameters = [...results[0].slaResponseParameters];
        this.slaResponseParameters = this.slaResponseParameters.sort((a, b) => a.slaResponseParametersId - b.slaResponseParametersId);
        if (this.slaResponseParameters.length != 0) {
          this.slaResponseParametersId = results[0].slaResponseParameters[this.activeTabIndex].slaResponseParametersId;
          this.enableAutoApprove = true;
          setTimeout(() => {
            this.frmSLATab.patchValue({
              slaRequestPanel: results[0],
              slaResponsePanel: this.slaResponseParameters[this.activeTabIndex]
            });
            this.wrStatusCardspanel.slaResponseParameters = this.slaResponseParameters[this.activeTabIndex];
            this.wrStatusCardspanel.loadStepsBySlaResponseParamId(this.slaResponseParameters[this.activeTabIndex]);
          }, 0);
        } else {
          this.slaRequestParametersId = results[0].slaRequestParametersId;
          this.slaResponseParametersId = 0
          this.enableAutoApprove = false;
          this.updateResponseParameters = [];
          setTimeout(() => {
            this.frmSLATab.patchValue({
              slaRequestPanel: results[0],
            });
            this.slaResponseParameters.push({ priority: "Routine Work" });
            this.setResponseNull("Routine Work");
          }, 0);
        }
      }
    });
  }

  saveSlaRequest() {
    if (this.frmSLATab.controls.slaRequestPanel.valid && !this.isDefaultSla) {
      const data: any = this.frmSLATab.controls.slaRequestPanel.value;
      data.slaRequestParametersId = this.slaRequestParametersId;
      data.isActive = "Yes";
      this.service.saveSLARequest(data).subscribe((res: any) => {
        this.messageService.clear();
        if (res.slaRequestParametersId > 0) {
          this.slaRequestParametersId = res.slaRequestParametersId;
          this.saveSlaResponse();
        } else if (res.text === "SLA already exists") {
          this.messageService.add({ key: 'SLArequest', severity: 'warn', summary: 'Warning', detail: 'SLA Request already exists' });
        }
      },
        error => {
        }
      );
    }else{
      this.saveSlaResponse();
    }

  }

  getIdByStatus(value: any) {
    return this.enumIsDefault.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey
  }

  getAutoIssueId(value : any){
    return this.enumAutoIssue.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey
  }

  getAutoApproval(value : any){
    return this.enumAutoApproval.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey
  }

  getIdNotifyRequestor(value: any){
    return this.enumNotifyRequestor.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey
  }

  updateAllOtherPriorities(id: any) {
    if (id !== null) {
      const filterData = this.updateResponseParameters.filter(eachRecord => eachRecord.slaResponseParametersId !== id);
      if (filterData.length > 0) {
        const newFilterData = filterData.map(each => {
          return {
            ...each,
            isDefault: this.getIdByStatus('No')
          }
        })
        if (newFilterData.length > 0) {
          this.service.updateAllOtherPriorities(newFilterData).subscribe((resp: any) => {
            console.log(resp);
          })
        }
      }
    } else {
      if (this.updateResponseParameters.length > 0) {
        const AllData = this.updateResponseParameters.map(each => {
          return {
            ...each,
            isDefault: this.getIdByStatus('No')
          }
        })
        if (AllData.length > 0) {
          this.service.updateAllOtherPriorities(AllData).subscribe((resp: any) => {
            console.log(resp);
          })
        }
      }
    }

  }

  saveSlaResponse() {
    if (this.frmSLATab.controls.slaResponsePanel.valid) {
      const slaProp: any = this.frmSLATab.controls.slaResponsePanel.value;
      slaProp.slaRequestParametersId = this.slaRequestParametersId;
      slaProp.slaResponseParametersId = this.slaResponseParameters[this.activeTabIndex].slaResponseParametersId;
      if (
        slaProp.autoIssue === true &&
        (
          (!slaProp.teamId || slaProp.teamId === null || slaProp.teamId === 0) &&
          (!slaProp.technicianId || slaProp.technicianId === '')
        )
      ) {
        this.technicianTeamWarning = true;
      }
      else{
        this.technicianTeamWarning = false;
        if ((slaProp.slaResponseParametersId && slaProp.slaResponseParametersId > 0 && slaProp.slaResponseParametersId !== null)) {
          this.service.getSlaStepsList(slaProp.slaResponseParametersId).subscribe((res: any) => {
            let stepsList: any[] = [];
            stepsList = [...res];
            const approvalStepList = stepsList.filter((eachRecord: any) => eachRecord.wrStatus === this.idForRequested && eachRecord.stepType === this.idForApprovalStepType);
            const approvedRequestedRejectedList = stepsList.filter((eachRecord: any) => eachRecord.wrStatus === this.idForApproved || eachRecord.wrStatus === this.idForRequested || eachRecord.wrStatus === this.idForRejected);
            const requestedRejectedList = stepsList.filter((eachRecord: any) => eachRecord.wrStatus === this.idForRejected || eachRecord.wrStatus === this.idForRequested)
            let wrStatus = '';
            if (approvalStepList.length === 0 && slaProp.autoIssue === false && slaProp.autoApproval === false) {
              this.approvalStepWarning = true;
            } else {
              this.approvalStepWarning = false;
              if (slaProp.autoIssue === true && approvedRequestedRejectedList.length > 0) {
                wrStatus = 'Requested, Approved, Rejected';
                this.confirmation(wrStatus, slaProp);
              } else if (slaProp.autoApproval === true && requestedRejectedList.length > 0) {
                wrStatus = 'Requested, Rejected';
                this.confirmation(wrStatus, slaProp);
              } else {
                this.slaResponseSaveApi(slaProp);
              }
            }
          })
      }else {
        this.slaResponseSaveApi(slaProp);
        }
      }
    }
  }

  confirmation(wrStatus: any, slaProp: any) {
    this.confirmationService.confirm({
      message: `Steps will be removed from ${wrStatus} Status. Do you want to continue?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.slaResponseSaveApi(slaProp);
      },
      key: "autoIssueApproveWarining"
    });
  }

  slaResponseSaveApi(slaProp: any){
    const slaRequestData: any = this.frmSLATab.controls.slaRequestPanel.value;
    slaProp.priority = this.slaResponseParameters[this.activeTabIndex]['priority'];
      slaProp.timeToResponse = parseFloat(slaProp.timeToResponse);
      slaProp.timeToComplete = parseFloat(slaProp.timeToComplete);
      slaProp.workingDays = this.setWorkingsDaysValue(slaProp);
      slaProp.dayStartTime = this.convertToTime(slaProp.dayStartTime);
      slaProp.dayEndTime = this.convertToTime(slaProp.dayEndTime);
      slaProp.isDefault = slaProp.isDefault === true ? 'Yes' : 'No';
      slaProp.notifyRequestor = slaProp.notifyRequestor === true ? "Yes":  "No";
      slaProp.canWorkOnHoliday = slaProp.canWorkOnHoliday === true ? 1 : 0;
      slaProp.autoIssue = slaProp.autoIssue === true ? 'Yes' : 'No';
      slaProp.autoApproval = slaProp.autoApproval === true ? 'Yes' : 'No';
      if ('Yes' === slaProp.isDefault) {
        this.updateAllOtherPriorities(slaProp.slaResponseParametersId);
    }
    this.service.saveSLAResponse(slaProp).subscribe((res: any) => {
      this.messageService.clear();
      if (res.status != 202) {
        this.slaResponseParametersId = res.slaResponseParametersId;   
        this.enableAutoApprove = true;      
        this.getAllResponseParams();
        if(slaRequestData.slaRequestParametersId === 0){
          this.messageService.add({ key: 'SLArequest', severity: 'success', summary: 'SLA Request saved successfully', detail: 'Record saved successfully' });
        }
        if(slaProp.slaResponseParametersId > 0){
          this.messageService.add({ key: 'SLAresponse', severity: 'success', summary: 'SLA Response saved successfully', detail: 'Record saved successfully' });
        }
        this.setData();
      }else{
        this.enableAutoApprove = true;
      }
    },
      error => {
      }
    );
  }

  setWorkingsDaysValue(slaProp: any) {
    var workingDay = '';

    if (!slaProp.sun)
      workingDay = '0,';
    else
      workingDay = '1,';

    if (!slaProp.mon)
      workingDay += '0,';
    else
      workingDay += '1,';

    if (!slaProp.tue)
      workingDay += '0,';
    else
      workingDay += '1,';

    if (!slaProp.wed)
      workingDay += '0,';
    else
      workingDay += '1,';

    if (!slaProp.thus)
      workingDay += '0,';
    else
      workingDay += '1,';

    if (!slaProp.fri)
      workingDay += '0,';
    else
      workingDay += '1,';

    if (!slaProp.sat)
      workingDay += '0';
    else
      workingDay += '1';

    return workingDay;
  }

  convertToTime(value: any) {
    if (value != null) {
      return this.datePipe.transform(value, "HH:mm:ss");
    } else {
      return '';
    }
  }

  onTabChange(event: any) {
    this.frmSLATab.controls.slaResponsePanel.reset();
    const selectedRecord = this.slaResponseParameters[event.index]
    this.activeTabIndex = event.index;
    if (selectedRecord.slaResponseParametersId && selectedRecord.slaRequestParametersId) {
      this.slaResponseParametersId = selectedRecord.slaRequestParametersId;
      setTimeout(() => {
        this.frmSLATab.patchValue({
          slaResponsePanel: selectedRecord
        });
        this.wrStatusCardspanel.slaResponseParameters = selectedRecord;
        this.wrStatusCardspanel.loadStepsBySlaResponseParamId(selectedRecord);
      }, 0);
    } else {
      this.slaResponseParametersId = 0;
      this.frmSLATab.controls.slaResponsePanel.reset();
      this.setResponseNull(selectedRecord.priority);
      this.wrStatusCardspanel.loadStepsBySlaResponseParamId(null);
    }
  }

  addPriority() {
    this.priorityHeading = 'Add Priority';
    this.priorityForm.reset();
    this.priorityExistErrror = '';
    this.displayCancelScreen = true;
    this.editPriority = false;
  }

  savePriority() {
    const priorityToShow = this.priorityForm.controls.priority.value
    if(this.editPriority){
      this.slaResponseParameters[this.activeTabIndex]['priority'] = priorityToShow;
      this.priorityForm.patchValue({
        priority: priorityToShow
      })
    }else{
      this.slaResponseParameters.push({ priority: priorityToShow });
      setTimeout(() => {
        this.slaResponseParametersId = 0;
        this.activeTabIndex = this.tabview.tabs.length - 1;
        this.setResponseNull(priorityToShow);
        this.wrStatusCardspanel.loadStepsBySlaResponseParamId(null);
      }, 0);
      this.priorityForm.patchValue({
        priority: priorityToShow
      })
    }
    this.displayCancelScreen = false;
    this.priorityForm.reset();
    this.enableAutoApprove = false;
    this.saveAllSlaData();
  }

  cancelPriority() {
    this.displayCancelScreen = false;
  }

  clickBack() {
    const prevUrl = this.authSrv.getPreviousUrl();
    this.authSrv.setPreviousUrl("");
    this.router.navigate([prevUrl]);
  }

  setResponseNull(priority: any) {
    const data = {
      slaRequestParametersId: this.slaRequestParametersId,
      slaResponseParametersId: null,
      priority: priority,
      timeToResponseDays : 1,
      timeToResponseHours: 0,
      timeToCompleteDays: 2,
      timeToCompleteHours: 0,
      completeType: null,
      respondType: null,
      workingDays: "0,1,1,1,1,1,0",
      dayStartTime: "09:00:00",
      dayEndTime: "18:00:00",
      canWorkOnHoliday: 0,
      isDefault: priority === 'Routine Work' ? this.idForIsDefaultYes :  this.idForIsDefaultNo,
      autoIssue: this.idForAutoIssueNo,
      autoApproval:this.idForAutoApprovalYes,
      notifyRequestor:this.idForNotifyRequestorNo,
    };
    setTimeout(() => {
      this.frmSLATab.patchValue({
        slaResponsePanel: data
      });
    }, 0);
  }

  onChangePriority(term: any) {
    this.filteredPriorities = this.enumPriority.filter(
      (rec) => rec.toLowerCase().includes(term.query.toLowerCase())
    );
    this.filteredPriorities = this.filteredPriorities.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  getAllResponseParams() {
    this.service.getAllSLAResponses().subscribe((res: any) => {
      this.enumPriority = res.map((t: any) => {
        return t.priority;
      });
    })
  }

  checkPriorityExists(event: any) {
    this.priorityExistErrror = '';
    console.log(event.target.value)
    let isPriorityExists = this.slaResponseParameters.filter((rec: any) => {
      if (rec.priority.toLocaleUpperCase() === event.target.value.toLocaleUpperCase()) {
        return rec;
      }
    }
    );

    if (isPriorityExists.length > 0) {
      this.priorityExistErrror = "Priority already exists.";
    }
  }

  onEditPriorityName(event: any){
    this.priorityHeading = "Edit Priority";
    this.displayCancelScreen = true;
    this.priorityExistErrror = '';
    this.editPriority = true;
    this.priorityForm.patchValue({
      priority: this.slaResponseParameters[this.activeTabIndex]['priority'],
    })
  }

  saveAllSlaData(){
    if(this.frmSLATab.controls.slaRequestPanel.valid){
      this.saveSlaRequest();
    }
  }

	onClickWarningTeamOrTechnician(){
	this.technicianTeamWarning = false;
	}

  onChangeAutoApprove(event: any) {
    const updatedSlaResponseForAutoApproval = {
      ...this.slaResponseParameters[this.activeTabIndex],
      autoApproval : event.checked ? this.getAutoApproval('Yes') : this.getAutoApproval('No'),
      autoIssue : this.frmSLATab.controls.slaResponsePanel.value.autoIssue === true ? this.getAutoIssueId('Yes') : this.getAutoIssueId('No'),

    }
    this.wrStatusCardspanel.slaResponseParameters = updatedSlaResponseForAutoApproval;
    this.wrStatusCardspanel.loadStepsBySlaResponseParamId(updatedSlaResponseForAutoApproval);
  }

  onChangeAutoIssue(event: any) {
    const updatedSlaResponseForAutoIssue = {
      ...this.slaResponseParameters[this.activeTabIndex],
      autoIssue : event.checked ? this.getAutoIssueId('Yes') : this.getAutoIssueId('No'),
      autoApproval :  this.frmSLATab.controls.slaResponsePanel.value.autoApproval === true ? this.getAutoApproval('Yes') : this.getAutoApproval('No')
    }
    this.wrStatusCardspanel.slaResponseParameters = updatedSlaResponseForAutoIssue;
    this.wrStatusCardspanel.loadStepsBySlaResponseParamId(updatedSlaResponseForAutoIssue);
  }

  onClickApprovalWaring(){
    this.approvalStepWarning = false;
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}
