import { Component, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Enums } from 'src/app/model/enums.model';
import { TradesService } from 'src/app/ui/Helpdesk/trades/services/trades.services';
import { RequestTradeService } from '../../services/request-trade-services';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-add-request-trade',
  templateUrl: './add-request-trade.component.html',
  styleUrls: ['./add-request-trade.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRequestTradeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRequestTradeComponent),
      multi: true
    }
  ]
})
export class AddRequestTradeComponent {
  today: Date = new Date();
  reqTradeFormPanel!: FormGroup;
  subscriptions: Subscription[] = [];
  hoursRequired!: number;
  tradesData: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  previousTrade: any;
  tradeExists: boolean = false;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  @Input() isNew!: boolean;
  @Input() isView!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private tradeService: TradesService,
    private requestTradeService: RequestTradeService

  ) {
    this.reqTradeFormPanel = this.formBuilder.group({
      tradeId: [null, [Validators.required]],
      requestTradeId: [null],
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
      this.reqTradeFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadTrades();
    if(this.isView) {
      this.reqTradeFormPanel.disable();
    }
  }
  get value(): any {
    const requestTools: any = {
      tradeId: this.reqTradeFormPanel.controls.tradeId.value,
      requestTradeId: this.reqTradeFormPanel.controls.requestTradeId.value,
      hoursRequired: this.reqTradeFormPanel.controls.hoursRequired.value,
      requestId: this.reqTradeFormPanel.controls.requestId.value,
      dateAssign: this.reqTradeFormPanel.controls.dateAssign.value,
      timeAssign: this.reqTradeFormPanel.controls.timeAssign.value,
      actualHoursStd: this.reqTradeFormPanel.controls.actualHoursStd.value,
      actualHoursDouble: this.reqTradeFormPanel.controls.actualHoursDouble.value,
      actualHoursOvertime: this.reqTradeFormPanel.controls.actualHoursOvertime.value,
      addedBy: this.reqTradeFormPanel.controls.addedBy.value,
    };
    return requestTools;
  }

  set value(value: any) {
    setTimeout(() => {
      this.reqTradeFormPanel.patchValue({
        tradeId: value.tradeId,
        requestTradeId: value.requestTradeId,
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
      this.reqTradeFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: FormControl) {
    return this.reqTradeFormPanel.valid ? null : { reqTradeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadTrades() {
    this.tradeService.getAllTrades().subscribe((res: any) => {
      if (res) {
        this.tradesData = res;
      } else {
        this.tradesData = []
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
    let actualHoursStd = this.reqTradeFormPanel.controls.actualHoursStd.value;
    let actualHoursDouble = this.reqTradeFormPanel.controls.actualHoursDouble.value;
    let actualHoursOvertime = this.reqTradeFormPanel.controls.actualHoursOvertime.value;
    let totalHours = 0;
    totalHours = actualHoursStd ? totalHours + parseFloat(actualHoursStd):totalHours;
    totalHours = actualHoursDouble ? totalHours + parseFloat(actualHoursDouble):totalHours;
    totalHours = actualHoursOvertime ? totalHours + parseFloat(actualHoursOvertime):totalHours;
    setTimeout(() => {
      this.reqTradeFormPanel.patchValue({
        totalHours: totalHours,
      });
    });
  }

  selectTrade(event: any) {
    if (this.previousTrade != event.tradeId) {

      let requestId = this.reqTradeFormPanel.controls.requestId.value;
      let tradeId = event.tradeId;
      this.requestTradeService.checkTradeExist(requestId, tradeId).subscribe((res: any) => {
        this.tradeExists = false;
        if (res) {
          this.tradeExists = true;
        } else {
          this.tradeExists = false;
        }
      })
    }
  }

}
