import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CraftspersonService } from '../../../craftsperson/services/craftsperson.service';
import { TeamService } from '../../../team/services/team.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { EnumService } from 'src/app/services/enum.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { SLARequestServices } from '../../services/sla-request-parameters.service';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-add-sla-request-steps',
  templateUrl: './add-sla-request-steps.component.html',
  styleUrls: ['./add-sla-request-steps.component.scss'],
  providers: [MessageService]
})
export class AddSlaRequestStepsComponent implements OnInit {
  allStepsData: any[] = [];
  stepsData: any[] = []
  slaStepsForm: UntypedFormGroup;
  techniciansData: any[] = [];
  teamsData: any[] = [];
  emData: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumslaRequestSteps: EnumList[] = [];
  enumNotifyResponsable: EnumList[] = [];
  enumNotifyRequestor: EnumList[] = [];
  enumNotifySupervisor: EnumList[] = [];
  enumNotifyOthers: EnumList[] = [];
  enumIdNotifyResponsable: any = 0;
  enumIdNotifyResponsableYes: any = 0;
  enumIdNotifyResponsableNo: any = 0
  enumNotidyRequestorYes: any = 0;
  enumNotidyRequestorNo: any = 0;
  enumIdNotifyRequestor: any = 0;
  enumIdNotifySupervisor: any = 0;
  enumIdNotifyOthers: any = 0;
  emailError: string = '';
  enumWrStep: EnumList[] = [];
  enumWrStepType: EnumList[] = [];
  stepTypeData: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumWrStatus: EnumList[] = [];
  makeReadOnly: boolean = false;
  enumTeam: EnumList[] = [];
  enumTeamType: EnumList[] = [];
  employeeTypeId: any = 0;
  allTeamsData: any[] = [];
  approvalStepTypeId: any = 0;
  isStepTypeApproval: boolean = false;
  hideTechnician: boolean = false;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSlaRequestStepsComponent>,
    private formBuilder: UntypedFormBuilder,
    private cfService: CraftspersonService,
    private teamService: TeamService,
    private empServ: EmployeeService,
    private enumsrv: EnumService,
    private confirmationService: ConfirmationService,
    private slaRequestService: SLARequestServices,
  ) {
    this.slaStepsForm = this.formBuilder.group({
      slaRequestStepsId: [],
      stepId: [null], 
      teamId: [null, [Validators.required]],
      emId: [null, [Validators.required]],
      cfId: [null, [Validators.required]],
      otherEmails: [null],
      notifyResponsable: [],
      notifyRequestor: [],
      notifySupervisor: [],
      notifyOthers: [],
      stepType: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.hideTechnician = false;
    this.loadEnums();
    this.loadTeams();
    this.loadStepTypes();
    this.loadTechnicians();
    this.scrollToEndEm();
    if (this.data.isEdit && this.data.step) {
      this.setData(this.data.step);
      if (this.data.step.emId !== null) {
        this.slaStepsForm.controls['teamId'].clearValidators();
        this.slaStepsForm.controls['cfId'].clearValidators();
        this.slaStepsForm.updateValueAndValidity();
      } else if (this.data.step.cfId !== null) {
        this.slaStepsForm.controls['teamId'].clearValidators();
        this.slaStepsForm.controls['emId'].clearValidators();
        this.slaStepsForm.updateValueAndValidity();
      } else if (this.data.step.teamId !== null) {
        this.slaStepsForm.controls['cfId'].clearValidators();
        this.slaStepsForm.controls['emId'].clearValidators();
        this.slaStepsForm.updateValueAndValidity();
      }
    }
  }

  loadTechnicians() {
    this.cfService.getAllCraftsperson().subscribe((res: any) => {
      if (res.status != 202) {
        this.techniciansData = res;
      }
      else {
        this.techniciansData = [];
      }
    })
  }

  loadTeams() {
    this.teamService.getAllTeams().subscribe((res: any) => {
      if (res.status != 202) {
        this.allTeamsData = res;
        if (this.isStepTypeApproval) {
          this.teamsData = this.allTeamsData.filter(t => t.teamType === this.employeeTypeId);
        } else {
          this.teamsData = this.allTeamsData;
        }
      }
      else {
        this.teamsData = [];
      }
    })
  }

  loadEmployee() {
    this.empServ.getAllEmployeeList().subscribe((res: any) => {
      if (res.status != 202) {
        this.emData = res.map((i: any) => { i.name = i.emCode + (i.firstName ? ' - ' + i.firstName + ' ' + (i.lastName ? i.lastName : '') : (i.lastName ? '-' + i.lastName : '')); return i; });
      }
      else {
        this.emData = [];
      }
    });
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // enums wr_steps
        // this.enumWrStep = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase());
        this.enumWrStepType = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'step_type'.toLocaleUpperCase());
        this.enumWrStepType.map(item => {
          if (item.enumValue === "Approval") {
            this.approvalStepTypeId = item.enumKey;
          }
        })
        // enums Wr 
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumWrStatus = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());

        // this.enumslaRequestSteps = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_request_steps'.toLocaleUpperCase());
        this.enumNotifyResponsable = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_request_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'notify_responsable'.toLocaleUpperCase());
        this.enumNotifyResponsable.map(item => {
          if (item.enumValue === "No") {
            this.enumIdNotifyResponsable = item.enumKey;
            this.enumIdNotifyResponsableNo = item.enumKey;
          } else {
            this.enumIdNotifyResponsableYes = item.enumKey;
          }
        })
        this.enumNotifyRequestor = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_request_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'notify_requestor'.toLocaleUpperCase());
        this.enumNotifyRequestor.map(item => {
          if (item.enumValue === "No") {
            this.enumIdNotifyRequestor = item.enumKey
            this.enumNotidyRequestorNo = item.enumKey;
          } else {
            this.enumNotidyRequestorYes = item.enumKey;
          }
        })
        this.enumNotifySupervisor = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_request_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'notify_supervisor'.toLocaleUpperCase());
        this.enumNotifySupervisor.map(item => {
          if (item.enumValue === "No") {
            this.enumIdNotifySupervisor = item.enumKey;
          }
        })
        this.enumNotifyOthers = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'sla_request_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'notify_others'.toLocaleUpperCase());
        this.enumNotifyOthers.map(item => {
          if (item.enumValue === "No") {
            this.enumIdNotifyOthers = item.enumKey;
          }
        })

        this.enumTeam = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'team'.toLocaleUpperCase());
        this.enumTeamType = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'team'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'team_type'.toLocaleUpperCase());
        this.enumTeamType.map(item => {
          if (item.enumValue === "Employee") {
            this.employeeTypeId = item.enumKey;
          }
        })
      },
      error => {
      }
    );
  }

  getEnumValueById(enumKey: any) {
    return this.enumWrStatus.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  loadStepTypes() {
    this.stepTypeData = [];
    if (this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Requested'.toLocaleUpperCase()) {
      this.enumWrStepType.map((t: any) => {
        if ((t.enumValue.toLocaleUpperCase() === 'Approval'.toLocaleUpperCase()) ||
          (t.enumValue.toLocaleUpperCase() === 'Notification'.toLocaleUpperCase())) {
          this.stepTypeData.push(t);
          this.setDefault()
        }
      })
    } else if (this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Approved'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Rejected'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Cancelled'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Close'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'On Hold For Access'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'On Hold For Parts'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'On Hold For Labour'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'In Process'.toLocaleUpperCase() ||
      this.getEnumValueById(this.data.wrStatus)?.toLocaleUpperCase() === 'Completed'.toLocaleUpperCase()) {
      this.enumWrStepType.map((t: any) => {
        if ((t.enumValue.toLocaleUpperCase() === 'Notification'.toLocaleUpperCase())) {
          this.stepTypeData.push(t);
          setTimeout(() => {
            this.slaStepsForm.patchValue({
              stepType: t.enumKey,
              notifyResponsable: this.enumIdNotifyResponsableYes
            })
          }, 0);
          this.makeReadOnly = true;
        }
      })
    }
  }

  setDefault() {
    setTimeout(() => {
      this.slaStepsForm.patchValue({
        notifyResponsable: this.enumIdNotifyResponsableYes,
      });
    });
  }

  setData(value: any) {
    if (value.stepType === this.approvalStepTypeId) {
      this.isStepTypeApproval = true;
      this.hideTechnician = true;
    } else {
      this.isStepTypeApproval = false;
      this.hideTechnician = false;
    }
    setTimeout(() => {
      if(value.emId) {
        const emData = {
          emId: value.em.emId,
          emCode:value.em.emCode,
          firstName:value.em.firstName
        }
        this.updateEmList(emData);
      }
      this.slaStepsForm.patchValue({
        slaRequestStepsId: value.slaRequestStepsId,
        stepId: value.stepId,
        teamId: value.teamId,
        cfId: value.cfId,
        emId: value.emId,
        otherEmails: value.otherEmails,
        notifyResponsable: value.notifyResponsable,
        notifyRequestor: value.notifyRequestor,
        notifySupervisor: value.notifySupervisor,
        notifyOthers: value.notifyOthers,
        stepType: value.stepType
      });

    }, 10);
  }

  get value(): any {
    const toolsDetails: any = {
      stepId: this.slaStepsForm.controls.stepId.value,
      teamId: this.slaStepsForm.controls.teamId.value,
      cfId: this.slaStepsForm.controls.cfId.value,
      emId: this.slaStepsForm.controls.emId.value,
      otherEmails: this.slaStepsForm.controls.otherEmails.value,
      notifyResponsable: this.slaStepsForm.controls.notifyResponsable.value,
      notifyRequestor: this.slaStepsForm.controls.notifyRequestor.value,
      notifySupervisor: this.slaStepsForm.controls.notifySupervisor.value,
      notifyOthers: this.slaStepsForm.controls.notifyOthers.value,
      stepType: this.slaStepsForm.controls.stepType.value,
    };
    return toolsDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      if (value.emId != null) {

      }
      this.slaStepsForm.patchValue({
        slaRequestStepsId: value.slaRequestStepsId,
        stepId: value.stepId,
        teamId: value.teamId,
        cfId: value.cfId,
        emId: value.emId,
        otherEmails: value.otherEmails,
        notifyResponsable: value.notifyResponsable,
        notifyRequestor: value.notifyRequestor,
        notifySupervisor: value.notifySupervisor,
        notifyOthers: value.notifyOthers,
        stepType: value.stepType
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  save() {
    if (this.slaStepsForm.valid) {
      const slaRequestStepData = {
        slaRequestStepsId: this.slaStepsForm.controls.slaRequestStepsId.value ? this.slaStepsForm.controls.slaRequestStepsId.value : 0,
        stepId: this.slaStepsForm.controls.stepId.value,
        teamId: this.slaStepsForm.controls.teamId.value,
        cfId: this.slaStepsForm.controls.cfId.value,
        emId: this.slaStepsForm.controls.emId.value,
        otherEmails: this.slaStepsForm.controls.otherEmails.value,
        notifyResponsable: this.slaStepsForm.controls.notifyResponsable.value,
        notifyRequestor: this.slaStepsForm.controls.notifyRequestor.value,
        notifySupervisor: this.slaStepsForm.controls.notifySupervisor.value,
        notifyOthers: this.slaStepsForm.controls.notifyOthers.value,
        slaResponseParametersId: this.data.slaResponseParametersId,
        wrStatus: this.data.wrStatus,
        stepType: this.slaStepsForm.controls.stepType.value,
      }

      this.slaRequestService.saveSLASteps(slaRequestStepData).subscribe((res: any) => {
        if (res) {
          this.dialogRef.close(res);
        }
      })
    }
  }

  changeTeam(event: any) {
    setTimeout(() => {
      this.slaStepsForm.patchValue({
        teamId: event.teamId,
        cfId: null,
        emId: null,
        stepId: null
      });
    });
    this.slaStepsForm.controls['teamId'].clearValidators();
    this.slaStepsForm.controls['emId'].clearValidators();
    this.slaStepsForm.controls['cfId'].clearValidators();
    this.slaStepsForm.controls['stepId'].clearValidators();
    this.slaStepsForm.updateValueAndValidity();
  }

  changeEmployee(event: any) {
    setTimeout(() => {
      this.slaStepsForm.patchValue({
        teamId: null,
        cfId: null,
        emId: event.emId,
        stepId: null
      });
    });
    this.slaStepsForm.controls['teamId'].clearValidators();
    this.slaStepsForm.controls['emId'].clearValidators();
    this.slaStepsForm.controls['cfId'].clearValidators();
    this.slaStepsForm.controls['stepId'].clearValidators();
    this.slaStepsForm.updateValueAndValidity();
  }

  changeTechnician(event: any) {
    setTimeout(() => {
      this.slaStepsForm.patchValue({
        teamId: null,
        cfId: event.cfId,
        emId: null,
        stepId: null
      });
    });
    this.slaStepsForm.controls['teamId'].clearValidators();
    this.slaStepsForm.controls['emId'].clearValidators();
    this.slaStepsForm.controls['cfId'].clearValidators();
    this.slaStepsForm.controls['stepId'].clearValidators();
    this.slaStepsForm.updateValueAndValidity();
  }

  changeOtherSteps(event: any) {
    setTimeout(() => {
      this.slaStepsForm.patchValue({
        teamId: null,
        cfId: null,
        emId: null,
        stepId: event.stepId
      });
    });
    this.slaStepsForm.controls['teamId'].clearValidators();
    this.slaStepsForm.controls['emId'].clearValidators();
    this.slaStepsForm.controls['cfId'].clearValidators();
    this.slaStepsForm.controls['stepId'].clearValidators();
    this.slaStepsForm.updateValueAndValidity();
  }

  changeEmails(event: any) {
    this.emailError = '';
    if (event.target.value) {
      const emails = event.target.value.split(',');
      const invalidEmails = [];
      for (let email of emails) {
        email = email.trim();
        if (email === '' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          invalidEmails.push(email);
        }
      }
      if (invalidEmails.length > 0) {
        this.emailError = "Enter valid email(s)"
      } else {
        this.emailError = '';
        setTimeout(() => {
          this.slaStepsForm.patchValue({
            teamId: null,
            cfId: null,
            emId: null,
          });
        });
      }
    }


  }

  cancel() {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close();
      },
      key: "positionDialog"
    });
  }

  changeNotifyResponsible(event: any) {
    if (event.value === this.enumIdNotifyResponsableYes) {
      setTimeout(() => {
        this.slaStepsForm.patchValue({
          notifyRequestor: this.enumNotidyRequestorYes,
        });
      });
    } else {
      setTimeout(() => {
        this.slaStepsForm.patchValue({
          notifyRequestor: this.enumNotidyRequestorNo,
        });
      });
    }
  }

  selectStepType(event: any) {
    this.hideTechnician = false;
    if (event.enumKey) {
      this.stepsData = this.allStepsData.filter(t => t.stepType === event.enumKey);
      if (event.enumValue.toLocaleUpperCase() === 'Notification'.toLocaleUpperCase()) {
        this.teamsData = this.allTeamsData;
        this.makeReadOnly = true;
        this.slaStepsForm.patchValue({
          notifyResponsable: this.enumIdNotifyResponsableYes
        });
      } else if (event.enumValue.toLocaleUpperCase() === 'Approval'.toLocaleUpperCase()) {
        this.slaStepsForm.patchValue({
          teamId: null
        });
        this.slaStepsForm.updateValueAndValidity();
        this.teamsData = this.allTeamsData.filter(t => t.teamType === this.employeeTypeId);
        this.makeReadOnly = false;
        this.hideTechnician = true;
      }
      else {
        this.makeReadOnly = false;
        this.teamsData = this.allTeamsData;
      }
    } else {
      this.stepsData = this.allStepsData;
      this.teamsData = this.allTeamsData;
      this.hideTechnician = false;
    }
    
  }

  scrollToEndEm() {
    this.offsetEm = this.limitEm;
    this.limitEm += this.scrollLimit;
    this.filterCriteria.limit = this.limitEm;
    this.filterCriteria.offset = this.offsetEm;
    this.empServ.getALLmployeeByScroll(this.filterCriteria).subscribe((res:any) => {
      this.emData = res;
      this.emData.unshift({emId:null, firstName:'Make a selection',emCode:null});
    })
  }

  searchEm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
    this.scrollToEndEm();
  }

  updateEmList(emData:any) {
    this.emData = this.emData.filter(e => e.emId != emData.emId);
    this.emData = this.emData.filter(e => e.emId != null);
    this.emData.unshift(emData);
    this.emData.unshift({emId:null, firstName:'Make a selection',emCode:null});
  }

}
