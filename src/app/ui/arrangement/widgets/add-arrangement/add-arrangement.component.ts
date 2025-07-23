import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, UntypedFormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { Arrangement } from '../../model/arrangement.model';
import { ArrangementService } from '../../services/arrangement.service';


@Component({
  selector: 'app-add-arrangement',
  templateUrl: './add-arrangement.component.html',
  styleUrls: ['./add-arrangement.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddArrangementComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddArrangementComponent),
      multi: true
    }
  ]
})

export class AddArrangementComponent implements ControlValueAccessor, OnDestroy {
  arrangementFormPanel:UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew: boolean = false;
  processList :any[]=[]
  constructor(
    private formBuilder: UntypedFormBuilder,
    private arrangeSrv:ArrangementService
  ) { 
    this.arrangementFormPanel = this.formBuilder.group({
      arrangementId: [null,[Validators.required]],
      arrangementType: ['', [Validators.required]],
      description : ['', [Validators.required]],
      highlightColor : ['#a6a6a6',[Validators.required]]
    });
    this.subscriptions.push(
      this.arrangementFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    
  }

  // checkArrangementTypeValidator(control: any) {
  //     if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //       this.arrangementFormPanel.controls['arrangementType'].setErrors(null);
  //       this.arrangementFormPanel.clearAsyncValidators();
  //       this.arrangementFormPanel.updateValueAndValidity();
  //       this.arrangeSrv.checkArrangementTypeExists(control.value).subscribe((res: any) => {
  //         if (res && res.text == "true") {
  //           this.arrangementFormPanel.controls['arrangementType'].setErrors({ 'incorrect': true });
  //           this.arrangementFormPanel.updateValueAndValidity();
  //           return { 'incorrect': true };
  //         }
  //         else {
  //           return null;
  //         }
  //       });
  //     }
  // }

 

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.arrangementFormPanel.controls).forEach(key => {
      let field = this.arrangementFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }

  get value(): Arrangement {
    const records: Arrangement = {    
      arrangementId: this.arrangementFormPanel.controls.arrangementId.value,
      arrangementType: this.arrangementFormPanel.controls.arrangementType.value,
      description : this.arrangementFormPanel.controls.description.value,
      highlightColor : this.arrangementFormPanel.controls.highlightColor.value
    }
    return records;
  }

  set value(value: Arrangement) {
    setTimeout(() => {
      this.arrangementFormPanel.patchValue({
        arrangementId: value.arrangementId,
        arrangementType: value.arrangementType,
        description: value.description,
        highlightColor : value.highlightColor??'#a6a6a6'
      });
      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.arrangementFormPanel.reset();
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
    return this.arrangementFormPanel.valid ? null : { arrangementFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
