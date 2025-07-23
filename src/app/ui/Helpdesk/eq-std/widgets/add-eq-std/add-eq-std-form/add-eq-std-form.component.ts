import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { AuthService } from 'src/app/services/auth.service';
import { EqStdService } from '../../../services/eq-std.services';

@Component({
  selector: 'app-add-eq-std-form',
  templateUrl: './add-eq-std-form.component.html',
  styleUrls: ['./add-eq-std-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEqStdFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddEqStdFormComponent),
      multi: true
    }
  ]
})
export class AddEqStdFormComponent implements OnInit {
  eqStdFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  presentEqStandard:string  = '';
  @Input() isNew!:boolean;
  constructor(
    private authSrv: AuthService,
    private formBuilder: UntypedFormBuilder,
    private eqStdService: EqStdService
  ) {
    this.eqStdFormPanel = this.formBuilder.group({
      eqStd: ['',[Validators.required]],
      eqStdId: [null],
      description: [''],
    });
    this.subscriptions.push(
      this.eqStdFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
   }

  ngOnInit(): void {
  }

  get value(): any {
    const eqStdDetails: any = {
      eqStd: this.eqStdFormPanel.controls.eqStd.value,
      description: this.eqStdFormPanel.controls.description.value,
      eqStdId: this.eqStdFormPanel.controls.eqStdId.value,
    };
    return eqStdDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.eqStdFormPanel.patchValue({
        eqStd: value.eqStd,
        description: value.description,
        eqStdId: value.eqStdId,
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
      this.eqStdFormPanel.reset();
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

  validate(_: UntypedFormControl) {
    return this.eqStdFormPanel.valid ? null : { eqStdFormPanel: { valid: false } };
  }
  public isValid() {
    return this.getValidationErrors().length === 0;
  }
  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
