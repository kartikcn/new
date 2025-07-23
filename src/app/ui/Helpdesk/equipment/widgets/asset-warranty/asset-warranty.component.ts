import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-asset-warranty',
  templateUrl: './asset-warranty.component.html',
  styleUrls: ['./asset-warranty.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AssetWarrantyComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AssetWarrantyComponent),
      multi: true
    }
  ]
})
export class AssetWarrantyComponent {
  eqWarranty: FormGroup;
  subscriptions: Subscription[] = [];

  @Input() isNew: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.eqWarranty = this.formBuilder.group({
       warrantyFromDate: [null],
       warrantyToDate:[null],
    
    });
    this.subscriptions.push(
      this.eqWarranty.valueChanges.subscribe(value => {
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
       warrantyFromDate: this.eqWarranty.controls.warrantyFromDate.value,
       warrantyToDate: this.eqWarranty.controls.warrantyToDate.value,
    };
    return eqLocationDetails;
  }
  
  set value(value: any) {
    setTimeout(() => {
      this.eqWarranty.patchValue({
         warrantyFromDate: value.warrantyFromDate ? this.formatDate(value.warrantyFromDate):null,
         warrantyToDate: value.warrantyToDate? this.formatDate(value.warrantyToDate):null,
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
      this.eqWarranty.reset();
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
    return this.eqWarranty.valid ? null : { eqFormPanel: { valid: false } };
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
