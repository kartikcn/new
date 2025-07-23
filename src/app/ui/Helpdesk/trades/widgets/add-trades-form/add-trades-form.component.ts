import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { Trade } from '../../model/trade.model';
import { TradesService } from '../../services/trades.services';

@Component({
  selector: 'app-add-trades-form',
  templateUrl: './add-trades-form.component.html',
  styleUrls: ['./add-trades-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddTradesFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddTradesFormComponent),
      multi: true
    }
  ]
})

export class AddTradesFormComponent implements OnInit {

  tradeFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew!: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private tradesService: TradesService
  ) {
    this.tradeFormPanel = this.formBuilder.group({
      tradeId: [null],
      tradeCode: [null,[Validators.required]],
      rateHourly: ['', [Validators.required, Validators.min(0)]],
      rateDouble: ['', [Validators.required, Validators.min(0)]],
      rateOver: ['', [Validators.required, Validators.min(0)]],
      stdHoursAvail: ['', [Validators.required, Validators.min(0)]],
      description: [''],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.tradeFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
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
    const trade: any = { //Trade
      tradeId: this.tradeFormPanel.controls.tradeId.value,
      tradeCode: this.tradeFormPanel.controls.tradeCode.value,
      rateHourly: this.tradeFormPanel.controls.rateHourly.value,
      rateDouble: this.tradeFormPanel.controls.rateDouble.value,
      rateOver: this.tradeFormPanel.controls.rateOver.value,
      stdHoursAvail: this.tradeFormPanel.controls.stdHoursAvail.value,
      description: this.tradeFormPanel.controls.description.value,
    };
    return trade;
  }

  set value(value: any) {
    setTimeout(() => {//Trade
      this.tradeFormPanel.patchValue({
        tradeId: value.tradeId,
        tradeCode: value.tradeCode,
        rateHourly: value.rateHourly,
        rateDouble: value.rateDouble,
        rateOver: value.rateOver,
        stdHoursAvail: value.stdHoursAvail,
        description: value.description,
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
      this.tradeFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.tradeFormPanel.valid ? null : { tradeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
