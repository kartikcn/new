import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-asset-insurance',
  templateUrl: './asset-insurance.component.html',
  styleUrls: ['./asset-insurance.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetInsuranceComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AssetInsuranceComponent),
      multi: true
    }
  ]
})
export class AssetInsuranceComponent {

  eqInsurance: FormGroup;
  subscriptions: Subscription[] = [];

  @Input() isNew: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.eqInsurance = this.formBuilder.group({
       insuranceNum: [null],
       insuranceFromDate: [null],
       insuranceCost: [null],
       insuranceToDate:[null],
    
    });
    this.subscriptions.push(
      this.eqInsurance.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
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
    const eqLocationDetails: any = {
       insuranceNum: this.eqInsurance.controls.insuranceNum.value,
       insuranceFromDate: this.eqInsurance.controls.insuranceFromDate.value,
       insuranceCost: this.eqInsurance.controls.insuranceCost.value,
       insuranceToDate: this.eqInsurance.controls.insuranceToDate.value,
    };
    return eqLocationDetails;
  }
  
  set value(value: any) {
    setTimeout(() => {
      this.eqInsurance.patchValue({
         insuranceNum: value.insuranceNum,
         insuranceFromDate: value.insuranceFromDate ? this.formatDate(value.insuranceFromDate):null,
         insuranceCost: value.insuranceCost,
         insuranceToDate: value.insuranceToDate? this.formatDate(value.insuranceToDate):null,
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
      this.eqInsurance.reset();
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => {};
  onTouched: any = () => {}   

  validate(_: FormControl) {
    return this.eqInsurance.valid ? null : { eqFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  formatDate(date: any) {
    if (date != null) {
      var dateCreated = new Date(date);
      return dateCreated;
    } else {
      return null;
    }
  }

}
