import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { SLARequestServices } from '../../services/sla-request-parameters.service';
import { CraftspersonService } from '../../../craftsperson/services/craftsperson.service';
import { Craftsperson } from '../../../craftsperson/model/craftsperson.model';
import { TeamService } from '../../../team/services/team.service';
import { Team } from '../../../team/model/team.model';
import { WrStatusCardsComponent } from '../wr-status-cards/wr-status-cards.component';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-add-sla-response',
  templateUrl: './add-sla-response.component.html',
  styleUrls: ['./add-sla-response.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddSlaResponseComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddSlaResponseComponent),
      multi: true
    }
  ]
})
export class AddSlaResponseComponent implements OnInit {
  subscriptions: Subscription[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPriority: EnumList[] = [];
  selectedDays: string[] = [];
  previousPriorities: any[] = [];
  wrStatus: any[] = [];
  stepsData: any[] = [];
  slaStepsData: any[] = [];
  enumIsDefault: EnumList[] = [];
  enumIsDefaultYes: any;
  enumIsDefaultNo: any;
  enumAutoIssue: EnumList[] = [];
  enumAutoApproval: EnumList[] = [];
  idForAutoIssueYes: any = 0;
  idForAutoApprovalYes: any = 0;
  allowOnWorkOnHolidays:any[] = [{label: 'Yes', value: 1}, {label: 'No', value: 0}];
  displayStepsScreen: boolean = false;
  stepsForm!: UntypedFormGroup;
  slaResponseFormPanel: UntypedFormGroup;
  displayWarningYes: boolean = false;
  displayWarningNo: boolean = false;
  dataBySlaRequestId: any[] = [];
  displayWarningMsg: string = '';
  enumNotifyRequestor:EnumList[] = [];
  @Input() isNew!: boolean;
  makeReadOnly: boolean = true;
  autoAproveReadOnly: boolean = false;
  technicianData : any[]=[];
  teamsHavingtechnician: any[]=[];
  @Input() enableAutoApprove!: boolean;
  @ViewChild(WrStatusCardsComponent, { static: false }) wrStatusCardspanel!: WrStatusCardsComponent;
  @Output() notifyAutoApprove: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyAutoIssue: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: UntypedFormBuilder,
    private enumsrv: EnumService,
    private slaReqSrv: SLARequestServices,
    private technicianService: CraftspersonService,
    private teamService: TeamService
  ) {
    this.slaResponseFormPanel = this.formBuilder.group({
      slaRequestParametersId: [''],
      slaResponseParametersId: [''],
      timeToResponseDays: [null],
      timeToResponseHours: [null],
      timeToCompleteDays : [null],
      timeToCompleteHours : [null],
      priority: ['',],
      canWorkOnHoliday: [''],
      workingDays: [''],
      dayStartTime: ['', [Validators.required, this.checkTimeValidator()]],
      dayEndTime: ['', [Validators.required, this.checkTimeValidator()]],
      sun: [''],
      mon: [''],
      tue: [''],
      wed: [''],
      thus: [''],
      fri: [''],
      sat: [''],
      isDefault: [],
      autoIssue: [],
      autoApproval: [],
      notifyRequestor:[],
      technicianId: [null],
      teamId : [null]
    });

    this.stepsForm = this.formBuilder.group({
      stepId: [null, [Validators.required]],
    })

    this.subscriptions.push(
      this.slaResponseFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadEnums();
    // this.loadWrStatus();
    // this.loadWrSteps();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase());
        this.enumIsDefault = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'is_default'.toLocaleUpperCase());
        this.enumIsDefault = this.enumIsDefault.map(t => {
          return {
            ...t,
            disabled: false,
          }
        });
        this.enumIsDefault.forEach(t => {
          if (t.enumValue === "Yes") {
            this.enumIsDefaultYes = t.enumKey;
          } else {
            this.enumIsDefaultNo = t.enumKey;
          }
        })
        this.enumAutoIssue = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'auto_issue'.toLocaleUpperCase());
        this.enumAutoIssue = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'auto_issue'.toLocaleUpperCase());
        this.enumAutoIssue.forEach(t => {
          if (t.enumValue === "Yes") {
            this.idForAutoIssueYes = t.enumKey;
          }
        })
        this.enumAutoApproval = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'auto_approval'.toLocaleUpperCase());
        this.enumAutoApproval.forEach(t => {
          if (t.enumValue === "Yes") {
            this.idForAutoApprovalYes = t.enumKey;
          }
        })

        this.enumNotifyRequestor = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'notify_requestor'.toLocaleUpperCase());
      },
      error => {
      }
    );
  }

  loadWrStatus() {
    this.slaReqSrv.getAllWrStatus().subscribe((res: any) => {
      this.wrStatus = res;
    })
  }


  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }

  get value(): any {
    const slaDetails: any = {
      slaRequestParametersId: this.slaResponseFormPanel.controls.slaRequestParametersId.value,
      slaResponseParametersId: this.slaResponseFormPanel.controls.slaResponseParametersId.value,
      timeToComplete: this.slaResponseFormPanel.controls.timeToComplete.value,
      timeToResponseDays : this.slaResponseFormPanel.controls.timeToResponseDays.value,
      timeToResponseHours : this.slaResponseFormPanel.controls.timeToResponseHours.value,
      timeToCompleteDays :  this.slaResponseFormPanel.controls.timeToCompleteDays.value,
      timeToCompleteHours :  this.slaResponseFormPanel.controls.timeToCompleteHours.value,
      priority: this.slaResponseFormPanel.controls.priority.value,
      canWorkOnHoliday: this.slaResponseFormPanel.controls.canWorkOnHoliday.value,
      workingDays: this.slaResponseFormPanel.controls.workingDays.value,
      dayStartTime: this.slaResponseFormPanel.controls.dayStartTime.value,
      dayEndTime: this.slaResponseFormPanel.controls.dayEndTime.value,
      isDefault: this.slaResponseFormPanel.controls.isDefault.value,
      autoIssue: this.slaResponseFormPanel.controls.autoIssue.value,
      autoApproval: this.slaResponseFormPanel.controls.autoApproval.value,
      notifyRequestor: this.slaResponseFormPanel.controls.notifyRequestor.value, 
      technicianId: this.slaResponseFormPanel.controls.technicianId.value,
      teamId: this.slaResponseFormPanel.controls.teamId.value,
    };
    return slaDetails;
  }

  set value(value: any) {
    if ((value.autoIssue && value.autoIssue === this.idForAutoIssueYes && this.idForAutoIssueYes)){
      this.autoAproveReadOnly = true;
      this.makeReadOnly = false;
      this.loadAllTechnicians();
      this.loadTeamsHavingTechnicians();
    }else{
      this.autoAproveReadOnly = false;
      this.makeReadOnly = true; 
    }
    setTimeout(() => {
      this.slaResponseFormPanel.patchValue({
        slaRequestParametersId: value.slaRequestParametersId,
        slaResponseParametersId: value.slaResponseParametersId,
        timeToResponseDays  : value.timeToResponseDays,
        timeToResponseHours : value.timeToResponseHours,
        timeToCompleteDays : value.timeToCompleteDays,
        timeToCompleteHours : value.timeToCompleteHours,
        priority: value.priority,
        canWorkOnHoliday: value.canWorkOnHoliday === 1 ? true : false,
        workingDays: value.workingDays,
        dayStartTime: this.convertToTime(value.dayStartTime),
        dayEndTime: this.convertToTime(value.dayEndTime),
        isDefault: value.isDefault.toLocaleUpperCase() === 'Yes'.toLocaleUpperCase() ? true : false,
        autoIssue: value.autoIssue.toLocaleUpperCase()==='Yes'.toLocaleUpperCase() ? true : false,
        autoApproval: value.autoApproval.toLocaleUpperCase() === 'Yes'.toLocaleUpperCase() ? true : false,
        notifyRequestor: value.notifyRequestor.toLocaleUpperCase() === 'Yes'.toLocaleUpperCase() ? true : false,
        technicianId: value.technicianId,
        teamId: value.teamId,
      });
      if (value.workingDays != null) {
        this.setCheckBoxValues(value.workingDays, value.canWorkOnHoliday);
      } else {
        this.setCheckBoxValues("0,0,0,0,0,0,0", '0');
      }
    });
    this.onChange(value);
    this.onTouched();
  }

  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      return currDate;
    } else {
      return null;
    }

  }

  setCheckBoxValues(data: any, allowOnWork: any) {
    var checkBoxValue = data.split(',');
    setTimeout(() => {
      this.slaResponseFormPanel.patchValue({
        sun: checkBoxValue[0] == '1' ? true : false,
        mon: checkBoxValue[1] == '1' ? true : false,
        tue: checkBoxValue[2] == '1' ? true : false,
        wed: checkBoxValue[3] == '1' ? true : false,
        thus: checkBoxValue[4] == '1' ? true : false,
        fri: checkBoxValue[5] == '1' ? true : false,
        sat: checkBoxValue[6] == '1' ? true : false,
      });
    });
  }

  checkTimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value !== "") {
        this.slaResponseFormPanel.controls['dayStartTime'].setErrors(null);
        this.slaResponseFormPanel.clearAsyncValidators();
        this.slaResponseFormPanel.updateValueAndValidity();
        var startTime = this.slaResponseFormPanel.controls['dayStartTime'].value;
        var endTime = this.slaResponseFormPanel.controls['dayEndTime'].value;
        if (startTime != null && endTime != null) {
          if (startTime > endTime) {
            this.slaResponseFormPanel.controls['dayStartTime'].setErrors({ 'incorrect': true });
            this.slaResponseFormPanel.updateValueAndValidity();
            return { 'incorrect': true };
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
      return null;
    };
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.slaResponseFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  validate(_: UntypedFormControl) {
    return this.slaResponseFormPanel.valid ? null : { slaResponseFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  changeAutoIssue(event: any) {
    if (event.checked === true) {
      this.makeReadOnly = false;
      this.autoAproveReadOnly = true
      this.loadAllTechnicians();
      this.loadTeamsHavingTechnicians()
      setTimeout(() => {
        this.slaResponseFormPanel.patchValue({
          autoApproval: true
        });
      });
    }else{
      this.makeReadOnly = true;
      this.autoAproveReadOnly = false;
      setTimeout(() => {
        this.slaResponseFormPanel.patchValue({
          teamId: null,
          technicianId: null
        });
      });
    }
    this.callAutoIssueParent(event);
  }

  checkAutoApprove(event: any){
    this.callAutoApproveParent(event);
  }

  getEnumValueById(id: any) {
    return this.enumIsDefault.find((t: any) => t.id === id)?.enumValue
  }

  getIsDefaultEnumIdByValue(value: any){
    return this.enumIsDefault.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey;
  }

  getNotifyRequestorById(id : any){
    return this.enumNotifyRequestor.find((t: any) => t.id === id)?.enumValue;
  }

  getAutoIssueById(id: any){
    return this.enumAutoIssue.find((t: any) => t.id === id)?.enumValue;
  }

  getAutoApprovalById(id: any){
    return this.enumAutoApproval.find((t: any) => t.id === id)?.enumValue;
  }

  onClickIsDefault(event: any) {
    this.slaReqSrv.getAllSLAResponseBySlaRequestId(this.slaResponseFormPanel.value.slaRequestParametersId).subscribe((res: any) => {
      if (res) {
        this.dataBySlaRequestId = res;
      }
      setTimeout(() => {
        if(event.checked === true){
          const  isDefaultYes =  this.dataBySlaRequestId.some(eachRecord => eachRecord.slaResponseParametersId === this.slaResponseFormPanel.value.slaResponseParametersId && eachRecord.isDefault ===  this.slaResponseFormPanel.value.isDefault)
          if(!isDefaultYes){
            this.checkAnyDefaultPriorityByYes(res, this.slaResponseFormPanel.value.isDefault);
          }
        }
        else {
          let isDefaultNoData: boolean = false;
          const data = this.dataBySlaRequestId.filter(each => each.slaResponseParametersId !== this.slaResponseFormPanel.controls.slaResponseParametersId.value)
          if (data) {
            isDefaultNoData = data.some(eachRecord => this.getEnumValueById(eachRecord.isDefault)?.toLocaleUpperCase() === 'Yes'.toLocaleUpperCase())
            if (!isDefaultNoData) {
              this.displayWarningNo = true;
              this.displayWarningMsg = "At least one priority should be set as the default.";
              setTimeout(() => {
                this.slaResponseFormPanel.patchValue({
                  isDefault: false,
                });
              });
            }
          }
        }
      });

    })
  }

  checkAnyDefaultPriorityByYes(res: any[], isDefaultYes: any) {
    let isDefaultCheck : any;
    if(isDefaultYes){
      isDefaultCheck = this.getIsDefaultEnumIdByValue('Yes')
    }else{
      isDefaultCheck = this.getIsDefaultEnumIdByValue('No')
    }
    const data = res.filter(eachResponse => eachResponse.isDefault === isDefaultCheck);
    if (data.length > 0) {
      this.displayWarningYes = true;
      this.displayWarningMsg = "Would you like to proceed? Note that one priority has already been set as the default"
    }
  }


  clickDisplayWarningYes() {
    if (this.displayWarningYes) {
      setTimeout(() => {
        this.slaResponseFormPanel.patchValue({
          isDefault: true,
        });
      });
      this.displayWarningYes = false;
    } else if (this.displayWarningNo) {
      setTimeout(() => {
        this.slaResponseFormPanel.patchValue({
          isDefault: false,
        });
      });
      this.displayWarningNo = false
      this.displayWarningYes = false;
    }

  }

  clickDisplayWarningNo() {
    if (this.displayWarningYes) {
      this.displayWarningYes = false;
      this.displayWarningNo = false;
      setTimeout(() => {
        this.slaResponseFormPanel.patchValue({
          isDefault: false,
        });
      });
    }else if(this.displayWarningNo){
      this.displayWarningYes = false;
      this.displayWarningNo = false;
    }
  }

  handleCancel(){
    setTimeout(() => {
      this.slaResponseFormPanel.patchValue({
        isDefault: true,
      });
    });
    this.displayWarningNo = false;
    this.displayWarningYes = false;
  }

  loadAllTechnicians(){
    this.technicianService.getAllCraftsperson().subscribe((res: any) => {
      if (res) {
        this.technicianData = res;
        this.technicianData.unshift(new Craftsperson(null, "Make a selection", "", "", 0, 0, 0, "", 0, 0, 0, 0, 0,""));
      }
      else {
        this.technicianData = [];
      }
  })
}

loadTeamsHavingTechnicians(){
  this.teamService.getTeamsHavingTechnician().subscribe((res)=>{
    if(res.length > 0){
      this.teamsHavingtechnician = res;
      this.teamsHavingtechnician.unshift(new Team(null,'','','Make a selection'));
    }else{
      this.teamsHavingtechnician = [];
    }
  })
}

onSelectTechnician(event: any){
  if(event.cfId !== null && event.cfId !== ''){
    this.slaResponseFormPanel.patchValue({
      teamId: null,
    })
  }
  
}

onSelectTeam(event: any){
  if(event.teamId !== null && event.teamId.toLocaleUpperCase() !== 'Make a selection'.toLocaleUpperCase() && event.teamId !== ''){
    this.slaResponseFormPanel.patchValue({
      technicianId: null
    })
  }
}

callAutoApproveParent(event : any) {
  this.notifyAutoApprove.emit(event); // Emit the event with the data
}

callAutoIssueParent(event : any){
  this.notifyAutoIssue.emit(event)
}

}
