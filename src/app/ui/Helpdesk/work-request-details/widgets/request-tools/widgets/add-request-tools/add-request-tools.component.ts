import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { ToolsService } from 'src/app/ui/Helpdesk/tools/services/tools.services';
import { RequestToolsService } from '../services/request-tools.service';

@Component({
  selector: 'app-add-request-tools',
  templateUrl: './add-request-tools.component.html',
  styleUrls: ['./add-request-tools.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestToolsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestToolsComponent),
      multi: true
    }
  ]
})
export class AddRequestToolsComponent implements OnInit {
  today: Date = new Date();
  reqToolsFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  hoursRequired!: number;
  toolsData: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  previousTools: any;
  toolsExist: boolean = false;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: ToolsService,
    private requestToolsService: RequestToolsService

  ) {
    this.reqToolsFormPanel = this.formBuilder.group({
      toolId: [null, [Validators.required]],
      reqToolId: [null],
      hoursRequired: [null, [Validators.required,Validators.min(1)]],
      dateAssign: [null],
      timeAssign: [null],
      requestId: [null],
      actualHoursStd: [null],
      actualHoursDouble: [null],
      actualHoursOvertime: [null],
      totalHours: [null],
      addedBy:[null]

    });

    this.subscriptions.push(
      this.reqToolsFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadTools();
    if(this.isView) {
      this.reqToolsFormPanel.disable();
    }
  }
  get value(): any {
    const requestTools: any = {
      toolId: this.reqToolsFormPanel.controls.toolId.value,
      reqToolId: this.reqToolsFormPanel.controls.reqToolId.value,
      hoursRequired: this.reqToolsFormPanel.controls.hoursRequired.value,
      requestId: this.reqToolsFormPanel.controls.requestId.value,
      dateAssign: this.reqToolsFormPanel.controls.dateAssign.value,
      timeAssign: this.reqToolsFormPanel.controls.timeAssign.value,
      actualHoursStd: this.reqToolsFormPanel.controls.actualHoursStd.value,
      actualHoursDouble: this.reqToolsFormPanel.controls.actualHoursDouble.value,
      actualHoursOvertime: this.reqToolsFormPanel.controls.actualHoursOvertime.value,
      addedBy: this.reqToolsFormPanel.controls.addedBy.value,
    };
    return requestTools;
  }

  set value(value: any) {
    setTimeout(() => {
      this.reqToolsFormPanel.patchValue({
        toolId: value.toolId,
        reqToolId: value.reqToolId,
        hoursRequired: value.hoursRequired,
        dateAssign: this.formatDate(value.dateAssign),
        timeAssign: this.convertToTime(value.timeAssign),
        requestId: value.requestId,
        actualHoursStd: value.actualHoursStd,
        actualHoursDouble: value.actualHoursDouble,
        actualHoursOvertime: value.actualHoursOvertime,
        totalHours: parseFloat(value.actualHoursStd) + parseFloat(value.actualHoursDouble) + parseFloat(value.actualHoursOvertime),
        addedBy: value.addedBy,

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
      this.reqToolsFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.reqToolsFormPanel.valid ? null : { reqToolsFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadTools() {
    this.service.getAllTools().subscribe((res: any) => {
      if (res) {
        this.toolsData = res;
      } else {
        this.toolsData = []
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
    let actualHoursStd = this.reqToolsFormPanel.controls.actualHoursStd.value;
    let actualHoursDouble = this.reqToolsFormPanel.controls.actualHoursDouble.value;
    let actualHoursOvertime = this.reqToolsFormPanel.controls.actualHoursOvertime.value;
    let totalHours = 0;
    totalHours = actualHoursStd ? totalHours + parseFloat(actualHoursStd):totalHours;
    totalHours = actualHoursDouble ? totalHours + parseFloat(actualHoursDouble):totalHours;
    totalHours = actualHoursOvertime ? totalHours + parseFloat(actualHoursOvertime):totalHours;
    setTimeout(() => {
      this.reqToolsFormPanel.patchValue({
        totalHours: totalHours,
      });
    });
  }

  selectTool(event: any) {
    if (this.previousTools != event.toolsId) {

      let requestId = this.reqToolsFormPanel.controls.requestId.value;
      let toolId = event.toolsId;
      this.requestToolsService.checkToolExist(requestId, toolId).subscribe((res: any) => {
        this.toolsExist = false;
        if (res) {
          this.toolsExist = true;
        } else {
          this.toolsExist = false;
        }
      })
    }
  }



}
