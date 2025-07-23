import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-holiday-form',
  templateUrl: './add-holiday-form.component.html',
  styleUrls: ['./add-holiday-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddHolidayFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddHolidayFormComponent),
      multi: true
    }
  ]
})
export class AddHolidayFormComponent implements ControlValueAccessor, OnDestroy {

  holidayFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  //isNew!: boolean=true;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe:DatePipe
  ) {
    this.holidayFormPanel = this.formBuilder.group({
      holidayDate: ['', [Validators.required]],
      holidaysId: [0,],
      holidayDesc: ['', [Validators.required]],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.holidayFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }
  /// End Of Form Validation Related Code
  get value(): any {
    const holidayDetails: any = {
      holidayDate: this.holidayFormPanel.controls.holidayDate.value,
      holidaysId: this.holidayFormPanel.controls.holidaysId.value,
      holidayDesc: this.holidayFormPanel.controls.holidayDesc.value,

    };
    return holidayDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.holidayFormPanel.patchValue({
        holidayDate: value.holidayDate != null ? this.setDate(value.holidayDate) : '',
        holidaysId: value.holidaysId,
        holidayDesc: value.holidayDesc,

      });
    });
    this.onChange(value);
    this.onTouched();
  }

  setDate(date: any) {
    var val = new Date(date);
    var userTimezoneOffset = val.getTimezoneOffset() * 60000;
    let fdate =  new Date(val.getTime() - userTimezoneOffset);
   return  this.datePipe.transform(fdate,'dd MMM yyyy');
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.holidayFormPanel.reset();
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

  // communicate the inner form validation to the parent form
  validate(_: UntypedFormControl) {
    return this.holidayFormPanel.valid ? null : { holidayFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
