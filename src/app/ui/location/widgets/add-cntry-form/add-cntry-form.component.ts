import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CountryService } from 'src/app/services/country.service';

declare var $: any;
@Component({
  selector: 'app-add-cntry-form',
  templateUrl: './add-cntry-form.component.html',
  styleUrls: ['./add-cntry-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddCntryFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddCntryFormComponent),
      multi: true
    }
  ]
})
export class AddCntryFormComponent implements ControlValueAccessor, OnDestroy {

  cntryFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew!: boolean;
  enumList: Enums[] = [];
  presentCtry:String = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private ctryService:CountryService
  ) {
    this.cntryFormPanel = this.formBuilder.group({
      ctryId: [null],
      ctryCode:[null,[Validators.required]],
      ctryName: [null]
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.cntryFormPanel.valueChanges.subscribe(value => {
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
    const cntryDetails: any = {
      ctryId: this.cntryFormPanel.controls.ctryId.value,
      ctryCode: this.cntryFormPanel.controls.ctryCode.value,
      ctryName: this.cntryFormPanel.controls.ctryName.value,
    };
    return cntryDetails;
  }

  set value(value: any) {
    this.presentCtry = value.ctryCode;
    setTimeout(() => {
      this.cntryFormPanel.patchValue({
        ctryId: value.ctryId,
        ctryCode: value.ctryCode,
        ctryName: value.ctryName,
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
      this.cntryFormPanel.reset();
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
    return this.cntryFormPanel.valid ? null : { cntryFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
