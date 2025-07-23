import { Component, Input, OnInit,forwardRef } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { RequestTechnicianLog } from '../../model/request-technician-log.model';
import { RequestTechnicianService } from '../../../request-technician/widgets/services/request_technician.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-add-request-technician-log',
  templateUrl: './add-request-technician-log.component.html',
  styleUrls: ['./add-request-technician-log.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestTechnicianLogComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestTechnicianLogComponent),
      multi: true
    }
  ]
})

export class AddRequestTechnicianLogComponent implements OnInit {
  requestTechnicianLogFormPanel!: UntypedFormGroup;
  today: Date = new Date();
  subscriptions: Subscription[] = [];
  technicianData: any[] = [];
  enumWorkType: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumTechRequLogData: EnumList[] = [];
  enumResourceType: any[] = [];
  newRecord: boolean = true;
  dateStarted!: string;
  requestId: any
  reqTechLogData: any[] = [];
  showTechncianField: boolean = true;
  showEmpyoyeeFiled: boolean = false;
  employeeData: any[] = [];
  showOtherField: boolean = false;
  isDefaultTechnician:any;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;

  isRequestor:boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  selectedEmOrTechncianOrOther : boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private requestTechnicianService: RequestTechnicianService,
    private enumsrv: EnumService,
    private emService: EmployeeService,
    private autServ : AuthService
  ) {
    this.requestTechnicianLogFormPanel = this.formBuilder.group({
      requestTechnicianLogId: [''],
      actualHoursStd: [null, [Validators.required]],
      actualHoursDouble: [null, [Validators.required]],
      actualHoursOvertime: [null, [Validators.required]],
      workType: [null, [Validators.required]],
      dateStarted: [null, [this.checkDateValidator()]],
      dateFinished: [null, [this.checkDateValidator()]],
      timeStarted: [null, [this.checkTimeValidator()]],
      timeFinished: [null, [this.checkTimeValidator()]],
      requestId: [null],
      technicianId: [null],
      resourceType: [null, [Validators.required]],
      emId: [null],
      other: [null]
    });

    this.subscriptions.push(
      this.requestTechnicianLogFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadEnums();
    if(this.isView) {
      this.requestTechnicianLogFormPanel.disable();
    }
  }

  loadRequestTechnicians(requestId: any) {
    this.requestTechnicianService.getAllRequestTechnician(requestId).subscribe((res: any) => {
      if (res) {
        this.reqTechLogData = res;
        this.patchTechncianOnly();
      } else {
        this.reqTechLogData = [];
      }

    })

  }

  onChange: any = () => { };
  onTouched: any = () => { };

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const requestTechnicianLog: RequestTechnicianLog = {
      requestTechnicianLogId: this.requestTechnicianLogFormPanel.controls.requestTechnicianLogId.value,
      actualHoursStd: this.requestTechnicianLogFormPanel.controls.actualHoursStd.value,
      actualHoursDouble: this.requestTechnicianLogFormPanel.controls.actualHoursDouble.value,
      actualHoursOvertime: this.requestTechnicianLogFormPanel.controls.actualHoursOvertime.value,
      dateStarted: this.requestTechnicianLogFormPanel.controls.dateStarted.value,
      dateFinished: this.requestTechnicianLogFormPanel.controls.dateFinished.value,
      timeStarted: this.requestTechnicianLogFormPanel.controls.timeStarted.value,
      timeFinished: this.requestTechnicianLogFormPanel.controls.timeFinished.value,
      workType: this.requestTechnicianLogFormPanel.controls.workType.value,
      requestId: this.requestTechnicianLogFormPanel.controls.requestId.value,
      technicianId: this.requestTechnicianLogFormPanel.controls.technicianId.value,
      resourceType: this.requestTechnicianLogFormPanel.controls.resourceType.value,
      emId: this.requestTechnicianLogFormPanel.controls.emId.value,
      other: this.requestTechnicianLogFormPanel.controls.other.value
    };
    return requestTechnicianLog;
  }

  set value(value: any) {
    if (this.getEnumIdByResourceType(value.resourceType)?.toLocaleUpperCase() === 'Technician'.toLocaleUpperCase()) {
      this.showTechncianField = true;
      this.showEmpyoyeeFiled = false;
      this.showOtherField = false;
    } else if (this.getEnumIdByResourceType(value.resourceType)?.toLocaleUpperCase() === "Facilities Manager".toLocaleUpperCase() ||
      this.getEnumIdByResourceType(value.resourceType)?.toLocaleUpperCase() === "Facilities Supervisor".toLocaleUpperCase()) {
      this.showTechncianField = false;
      this.showEmpyoyeeFiled = true;
      this.showOtherField = false;
      this.loadEmployee();
    }else if(this.getEnumIdByResourceType(value.resourceType)?.toLocaleUpperCase() === "Other".toLocaleUpperCase()){
      this.showTechncianField = false;
      this.showEmpyoyeeFiled = false;
      this.showOtherField = true;
    }
    if(value.technicianId || value.emId || value.other){
      this.selectedEmOrTechncianOrOther = true;
    }else{
      this.selectedEmOrTechncianOrOther = false;
    }

    setTimeout(() => {
      this.requestTechnicianLogFormPanel.patchValue({
        requestTechnicianLogId: value.requestTechnicianLogId,
        actualHoursStd: value.actualHoursStd,
        actualHoursDouble: value.actualHoursDouble,
        dateStarted: this.formatDate(value.dateStarted),
        dateFinished: this.formatDate(value.dateFinished),
        timeStarted: this.convertToTime(value.timeStarted),
        timeFinished: this.convertToTime(value.timeFinished),
        actualHoursOvertime: value.actualHoursOvertime,
        workType: value.workType,
        requestId: value.requestId,
        technicianId: value.technicianId,
        resourceType: value.resourceType == null?this.isDefaultTechnician :value.resourceType,
        emId: value.emId,
        other: value.other,
        

      });
    });
    this.onChange(value);
    this.onTouched();
  }


  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.requestTechnicianLogFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.requestTechnicianLogFormPanel.valid ? null : { partsFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumTechRequLogData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'request_technician_log'.toLocaleUpperCase());
        this.enumWorkType = this.enumTechRequLogData.filter(t => t.fieldName.toLocaleUpperCase() === 'work_type'.toLocaleUpperCase());
        this.enumResourceType = this.enumTechRequLogData.filter(t => t.fieldName.toLocaleUpperCase() === 'resource_type'.toLocaleUpperCase());
        this.enumResourceType.forEach(t => {
          if (t.enumValue === 'Technician') {
            this.isDefaultTechnician = t.enumKey;
          }
        })
      },
      error => {
      }
    );
  }
  formatDate(date: Date | null) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
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

  getEnumById(enumKey: any) {
    return this.enumWorkType.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  getEnumIdByResourceType(enumKey: any) {
    return this.enumResourceType.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  onSelect(event: any) {
    this.requestTechnicianLogFormPanel.patchValue({
      technicianId: null,
      emId: null,
      other: null
    })
    this.selectedEmOrTechncianOrOther = false;
    if (event.enumValue.toLocaleUpperCase() === "Technician".toLocaleUpperCase()) {
      this.showTechncianField = true;
      this.showEmpyoyeeFiled = false;
      this.showOtherField = false
    }
    else if (event.enumValue.toLocaleUpperCase() === "Facilities Manager".toLocaleUpperCase() ||
    event.enumValue.toLocaleUpperCase() === "Facilities Supervisor".toLocaleUpperCase()) {
      this.showTechncianField = false;
      this.showEmpyoyeeFiled = true;
      this.showOtherField = false
      this.loadEmployee();
    }
    else if (event.enumValue.toLocaleUpperCase() === 'Other'.toLocaleUpperCase()) {
      this.showTechncianField = false;
      this.showEmpyoyeeFiled = false;
      this.showOtherField = true;
    }
  }

  loadEmployee() {
    this.employeeData = [];
    this.emService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.employeeData = res;
        this.employeeData = res.map((i: any) => { i.fullName = i.emCode + ' - ' + i.firstName + " " + i.lastName; return i; });
        this.employeeData.unshift(new EmployeeDetails({ fullName: 'Make a selection', emId: "", initials: "", firstName: "", lastName: "", maidenName: "", aliasName: "", email: "", emStd: "", emStatus: 0, idNumber: "", birthDate: null, gender: 0, compName: "", dateJoin: "", dateLeave: "", compId: 0, emPhoto: "", ccCode: 0, lineMngr: "", emPhotoMobile: "" }));

      } else {
        this.employeeData = []
      }
    })
  }

  onSelectTechnician(event: any) {
    if (event.technicianId!== null && event.technicianId!== '') {
      this.selectedEmOrTechncianOrOther = true;
    } else {
      this.selectedEmOrTechncianOrOther = false;
    }
  }


  onSelectEmId(event: any) {
    if (event.emId !== null && event.emId !== '') {
      this.selectedEmOrTechncianOrOther = true;
    } else {
      this.selectedEmOrTechncianOrOther = false;
    }
  }

getEnumIdByValue(value : any){
  return this.enumResourceType.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey;
}

patchTechncianOnly(){
  if(!this.isSupervisor && this.isTechnician){
    const loggedTechnicianId = this.autServ.getLoggedInTechnicianId()
    this.requestTechnicianLogFormPanel.patchValue({
      resourceType : this.getEnumIdByValue('Technician'),
      technicianId: loggedTechnicianId
    });
    this.selectedEmOrTechncianOrOther = true;
  }
}

  onChangeOther(event: any) {
    if (event.target.value.length > 0) {
      this.selectedEmOrTechncianOrOther = true;
    } else {
      this.selectedEmOrTechncianOrOther = false;
    }
  }

  checkTimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value !== "") {
        this.requestTechnicianLogFormPanel.controls['timeStarted'].setErrors(null);
        this.requestTechnicianLogFormPanel.clearAsyncValidators();
        this.requestTechnicianLogFormPanel.updateValueAndValidity();
        var startTime = this.requestTechnicianLogFormPanel.controls['timeStarted'].value;
        var endTime = this.requestTechnicianLogFormPanel.controls['timeFinished'].value;
        if (startTime != null && endTime != null) {
          if (startTime > endTime) {
            this.requestTechnicianLogFormPanel.controls['timeStarted'].setErrors({ 'incorrect': true });
            this.requestTechnicianLogFormPanel.updateValueAndValidity();
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

  checkDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value !== "") {
        this.requestTechnicianLogFormPanel.controls['dateStarted'].setErrors(null);
        this.requestTechnicianLogFormPanel.controls['dateFinished'].setErrors(null);
        this.requestTechnicianLogFormPanel.clearAsyncValidators();
        this.requestTechnicianLogFormPanel.updateValueAndValidity();
        
        var startDate = this.requestTechnicianLogFormPanel.controls['dateStarted'].value;
        var endDate = this.requestTechnicianLogFormPanel.controls['dateFinished'].value;
  
        if (startDate != null && endDate != null) {
          if (startDate > endDate) {
            this.requestTechnicianLogFormPanel.controls['dateStarted'].setErrors({ 'incorrect': true });
            this.requestTechnicianLogFormPanel.controls['dateFinished'].setErrors({ 'incorrect': true });
            this.requestTechnicianLogFormPanel.updateValueAndValidity();
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
  

}
