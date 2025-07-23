import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { CraftspersonService } from 'src/app/ui/Helpdesk/craftsperson/services/craftsperson.service';
import { DatePipe } from '@angular/common';
import { RequestTechnicianService } from '../services/request_technician.service';

@Component({
  selector: 'app-add-request-technicians',
  templateUrl: './add-request-technicians.component.html',
  styleUrls: ['./add-request-technicians.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestTechniciansComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestTechniciansComponent),
      multi: true
    }
  ]
})
export class AddRequestTechniciansComponent implements OnInit {
  today: Date = new Date();
  reqTechnicianFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  hoursRequired!: number;
  technicianData: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumRequestTechnicianData: Enums[] = [];
  enumTechnicianId: any[] = [];
  technicianExist: boolean = false;
  enableDetailsBtn: boolean = false;
  previousTechnician: any;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private cfSrv: CraftspersonService,
    private datePipe: DatePipe,
    private reqiestTechnicianSrv: RequestTechnicianService,

  ) {
    this.reqTechnicianFormPanel = this.formBuilder.group({
      technicianId: [null, [Validators.required]],
      hoursRequired: [null, [Validators.required, Validators.min(1)]],
      dateAssign: [null, [Validators.required]],
      timeAssign: [null, [Validators.required]],
      requestTechnicianId: [null],
      requestId: [null],
      actualHoursStd: [null],
      actualHoursDouble: [null],
      actualHoursOvertime: [null],
      totalHours: [null],
      teamId: [null]
    });

    this.subscriptions.push(
      this.reqTechnicianFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {
    this.loadTechinician();
    if(this.isView) {
      this.reqTechnicianFormPanel.disable();
    }
  }
  get value(): any {
    const trequestTechnician: any = {
      technicianId: this.reqTechnicianFormPanel.controls.technicianId.value,
      hoursRequired: this.reqTechnicianFormPanel.controls.hoursRequired.value,
      requestTechnicianId: this.reqTechnicianFormPanel.controls.requestTechnicianId.value,
      requestId: this.reqTechnicianFormPanel.controls.requestId.value,
      dateAssign: this.reqTechnicianFormPanel.controls.dateAssign.value,
      timeAssign: this.reqTechnicianFormPanel.controls.timeAssign.value,
      actualHoursStd: this.reqTechnicianFormPanel.controls.actualHoursStd.value,
      actualHoursDouble: this.reqTechnicianFormPanel.controls.actualHoursDouble.value,
      actualHoursOvertime: this.reqTechnicianFormPanel.controls.actualHoursOvertime.value,
      teamId: this.reqTechnicianFormPanel.controls.teamId.value
    };
    return trequestTechnician;
  }

  set value(value: any) {
    setTimeout(() => {
      this.reqTechnicianFormPanel.patchValue({
        technicianId: value.technicianId,
        hoursRequired: value.hoursRequired,
        dateAssign: this.formatDate(value.dateAssign),
        timeAssign: this.convertToTime(value.timeAssign),
        requestTechnicianId: value.requestTechnicianId,
        requestId: value.requestId,
        actualHoursStd: value.actualHoursStd,
        actualHoursDouble: value.actualHoursDouble,
        actualHoursOvertime: value.actualHoursOvertime,
        totalHours: parseFloat(value.actualHoursStd) + parseFloat(value.actualHoursDouble) + parseFloat(value.actualHoursOvertime),
        teamId: value.teamId
      });
    });
    this.onChange(value);
    this.onTouched();
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

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.reqTechnicianFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.reqTechnicianFormPanel.valid ? null : { reqTechnicianFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadTechinician() {
    this.cfSrv.getAllCraftsperson().subscribe((res: any) => {
      if (res) {
        this.technicianData = res;
      } else {
        this.technicianData = []
      }
    })
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

  onChangeHours(event: any) {
    let actualHoursStd = this.reqTechnicianFormPanel.controls.actualHoursStd.value;
    let actualHoursDouble = this.reqTechnicianFormPanel.controls.actualHoursDouble.value;
    let actualHoursOvertime = this.reqTechnicianFormPanel.controls.actualHoursOvertime.value;
    let totalHours = parseFloat(actualHoursStd) + parseFloat(actualHoursDouble) + parseFloat(actualHoursOvertime);
    setTimeout(() => {
      this.reqTechnicianFormPanel.patchValue({
        totalHours: totalHours,
      });
    });
  }

  selectTechnician(event: any) {
    if (this.previousTechnician != event.cfId) {
      let requestId = this.reqTechnicianFormPanel.controls.requestId.value;
      let technicianId = event.cfId;
      this.reqiestTechnicianSrv.checkTechnicianExist(requestId, technicianId).subscribe((res: any) => {
        this.technicianExist = false;
        if (res) {
          this.technicianExist = true;
        } else {
          this.technicianExist = false;
        }
      })
    }
  }
}
