import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { CostType } from '../../model/costtype.model';
import { CostTypeService } from '../../services/costtype.service';

@Component({
  selector: 'app-add-costtype',
  templateUrl: './add-costtype.component.html',
  styleUrls: ['./add-costtype.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddCosttypeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddCosttypeComponent),
      multi: true
    }
  ]
})
export class AddCosttypeComponent implements OnInit {

  costTypeFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private costTypeService: CostTypeService
  ) {
    this.costTypeFormPanel = this.formBuilder.group({
      costType: ['', [Validators.required]],
      costTypeId:[null],
      description: [null],
    });

    this.subscriptions.push(
      this.costTypeFormPanel.valueChanges.subscribe(value => {
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

  checkExistCostType(control: any) {
    if (control.value !== undefined && control.value != null && control.value.length > 1) {
      this.costTypeFormPanel.controls['costType'].setErrors(null);
      this.costTypeFormPanel.clearAsyncValidators();
      this.costTypeFormPanel.updateValueAndValidity();
      this.costTypeService.checkExist(control.value).subscribe((res: any) => {
        if (res && res.text === "true") {
          this.costTypeFormPanel.controls['costType'].setErrors({ 'incorrect': true });
          this.costTypeFormPanel.updateValueAndValidity();
          return { 'incorrect': true };
        }
        else {
          return null;
        }
      });
    }
  }

  get value(): any { //CostType
    const costType: any = {
      costType: this.costTypeFormPanel.controls.costType.value,
      description: this.costTypeFormPanel.controls.description.value,
      costTypeId: this.costTypeFormPanel.controls.costTypeId.value,
    };
    return costType;
  }

  set value(value: any) {
    setTimeout(() => {
      this.costTypeFormPanel.patchValue({
        costType: value.costType,
        description: value.description,
        costTypeId: value.costTypeId,
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
      this.costTypeFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  validate(_: UntypedFormControl) {
    return this.costTypeFormPanel.valid ? null : { costTypeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
