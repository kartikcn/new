import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CountryFilterInput } from '../../modal/countryFilterInput.model';
import { CountryService } from '../../../../services/country.service';
import { RegnService } from '../../services/regn.service';

declare var $: any;
@Component({
  selector: 'app-add-regn-form',
  templateUrl: './add-regn-form.component.html',
  styleUrls: ['./add-regn-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRegnFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRegnFormComponent),
      multi: true
    }
  ]
})
export class AddRegnFormComponent implements ControlValueAccessor, OnDestroy {

  regnFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumCntry: CountryFilterInput[] = [];
  presentRegn:string = "";
  previousCtry:number = 0;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private cntrySrv: CountryService,
    private regnService: RegnService
  ) {
    this.regnFormPanel = this.formBuilder.group({
      regnId: [null],
      regnCode: ['', [Validators.required]],
      regnName: [null],
      ctryId: ['', [Validators.required]],
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.regnFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadCntry()
  }

  loadCntry() {
    this.cntrySrv.getALLCountry().subscribe((res: any) => {
      this.enumCntry = res;
      this.enumCntry = res.map((i: any) => { i.name = i.name ? i.ctryCode + ' - ' + i.name:i.ctryCode; return i; });
      this.enumCntry.unshift(new CountryFilterInput('', 'Make a selection'));
    });
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
    const regnDetails: any = {
      regnId: this.regnFormPanel.controls.regnId.value,
      regnCode : this.regnFormPanel.controls.regnCode.value,
      regnName: this.regnFormPanel.controls.regnName.value,
      ctryId: this.regnFormPanel.controls.ctryId.value,
    };
    return regnDetails;
  }

  set value(value: any) {
    this.presentRegn = value.regnCode;
    this.previousCtry = value.ctryId;
    setTimeout(() => {
      this.regnFormPanel.patchValue({
        regnId: value.regnId,
        regnCode: value.regnCode,
        regnName: value.regnName,
        ctryId: value.ctryId,
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
      this.regnFormPanel.reset();
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
    return this.regnFormPanel.valid ? null : { regnFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  checkRegnCodeExist(control: any) {
    if (control.value !== undefined && control.value != null && control.value.length > 1 &&
       this.presentRegn.toLocaleLowerCase() != control.value.toLocaleLowerCase() && 
       this.previousCtry != this.regnFormPanel.controls.ctryId.value) {
      this.regnFormPanel.controls['regnCode'].setErrors(null);
      this.regnFormPanel.clearAsyncValidators();
      this.regnFormPanel.updateValueAndValidity();
      let regnData = {
        id:0,
        name:'',
        code:this.regnFormPanel.controls.regnCode.value,
        cntryId:this.regnFormPanel.controls.ctryId.value ? this.regnFormPanel.controls.ctryId.value : 0
      }
      this.regnService.validateRegn(regnData).subscribe((res: any) => {
        if (res && res.text == "true") {
          this.regnFormPanel.controls['regnCode'].setErrors({ 'incorrect': true });
          this.regnFormPanel.updateValueAndValidity();
          return { 'incorrect': true };
        }
        else {
          return null;
        }
      });
    }
  }

}
