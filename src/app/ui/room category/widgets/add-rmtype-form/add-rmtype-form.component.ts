import { Component, OnInit, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS } from '@angular/forms';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { RmcatFilterInput } from '../../../rmcat/modal/rmcatFilterInput.model';
import { RmcatService } from '../../../../services/rmcat.service';

@Component({
  selector: 'app-add-rmtype-form',
  templateUrl: './add-rmtype-form.component.html',
  styleUrls: ['./add-rmtype-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRmtypeFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRmtypeFormComponent),
      multi: true
    }
  ]
})
export class AddRmtypeFormComponent implements ControlValueAccessor, OnDestroy {

  rmTypeFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew!: boolean;
  enumRmcats: RmcatFilterInput[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmcatSrv: RmcatService,
  ) {
    this.rmTypeFormPanel = this.formBuilder.group({
      rmCat: ['', [Validators.required,this.checkUserExistsValidator()]],
      rmType: ['', [Validators.required,this.checkUserExistsValidator()]],
      rmTypeDesc: [''],
      highlightColor : ['#a6a6a6']
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.rmTypeFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadRmcats();
  }

  loadRmcats() {
    this.rmcatSrv.getALLRmcats().subscribe((res: any[]) => {
      this.enumRmcats = res;
      this.enumRmcats = res.map((i: any) => { i.rmCatDesc = i.rmCat + ' - ' + i.rmCatDesc; return i; });
      this.enumRmcats.unshift(new RmcatFilterInput('', 'Make a selection'));
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
    const flDetails: any = {
      rmCat: this.rmTypeFormPanel.controls.rmCat.value,
      rmType: this.rmTypeFormPanel.controls.rmType.value,
      rmTypeDesc: this.rmTypeFormPanel.controls.rmTypeDesc.value,
      highlightColor : this.rmTypeFormPanel.controls.highlightColor.value,
    };
    return flDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.rmTypeFormPanel.patchValue({
        rmCat: value.rmCat,
        rmType: value.rmType,
        rmTypeDesc: value.rmTypeDesc,
        highlightColor:value.highlightColor??'#a6a6a6',
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
      this.rmTypeFormPanel.reset();
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

  checkUserExistsValidator(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
        this.rmTypeFormPanel.controls['rmType'].setErrors(null);
        this.rmTypeFormPanel.clearAsyncValidators();
        this.rmTypeFormPanel.updateValueAndValidity();
        let rmStandard = this.rmTypeFormPanel.controls.rmCat.value;
        let rmType = this.rmTypeFormPanel.controls.rmType.value

        this.rmcatSrv.validateRmType(rmType,rmStandard).subscribe((res:any)=>{
          if (res && res.text == "true"){
            this.rmTypeFormPanel.controls['rmType'].setErrors({ 'incorrect': true });
            this.rmTypeFormPanel.updateValueAndValidity();
            return { 'incorrect': true };
          }
          else{
            return null;
          }
        });
        
      }
      return null;
    };
  }

  // communicate the inner form validation to the parent form
  validate(_: UntypedFormControl) {
    return this.rmTypeFormPanel.valid ? null : { rmTypeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
