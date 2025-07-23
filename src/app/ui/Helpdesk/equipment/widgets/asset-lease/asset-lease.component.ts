import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-asset-lease',
  templateUrl: './asset-lease.component.html',
  styleUrls: ['./asset-lease.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetLeaseComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AssetLeaseComponent),
      multi: true
    }
  ]
})
export class AssetLeaseComponent {
  eqLease: FormGroup;
  subscriptions: Subscription[] = [];

  @Input() isNew: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.eqLease = this.formBuilder.group({
       leaseNum: [null],
       leaseFromDate: [null],
       leaseCost: [null],
       leaseToDate:[null],
    
    });
    this.subscriptions.push(
      this.eqLease.valueChanges.subscribe(value => {
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
       leaseNum: this.eqLease.controls.leaseNum.value,
       leaseFromDate: this.eqLease.controls.leaseFromDate.value,
       leaseCost: this.eqLease.controls.leaseCost.value,
       leaseToDate: this.eqLease.controls.leaseToDate.value,
    };
    return eqLocationDetails;
  }
  
  set value(value: any) {
    setTimeout(() => {
      this.eqLease.patchValue({
         leaseNum: value.leaseNum,
         leaseFromDate: value.leaseFromDate ? this.formatDate(value.leaseFromDate):null,
         leaseCost: value.leaseCost,
         leaseToDate: value.leaseToDate? this.formatDate(value.leaseToDate):null,
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
      this.eqLease.reset();
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
    return this.eqLease.valid ? null : { eqFormPanel: { valid: false } };
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
