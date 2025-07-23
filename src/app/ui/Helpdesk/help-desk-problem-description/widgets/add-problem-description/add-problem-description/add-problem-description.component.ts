import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProblemDescriptionService } from '../../../services/problem-description.services';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-add-problem-description',
  templateUrl: './add-problem-description.component.html',
  styleUrls: ['./add-problem-description.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddProblemDescriptionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddProblemDescriptionComponent),
      multi: true
    }
  ]
})

export class AddProblemDescriptionComponent implements OnInit {
  pbDescriptionFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  currentDate: any;
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: ProblemDescriptionService,
  ) {
    this.pbDescriptionFormPanel = this.formBuilder.group({
      pdId: ['',],
      pdDescription: ['', [Validators.required]],

    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.pbDescriptionFormPanel.valueChanges.subscribe(value => {
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
   
  
    /// Start Preparing Entered Data Model
    get value(): any {
      const pdDetails: any = {
        pdId: this.pbDescriptionFormPanel.controls.pdId.value,
        pdDescription: this.pbDescriptionFormPanel.controls.pdDescription.value,
      };
      return pdDetails;
   }
  
    set value(value: any) {
      setTimeout(() => {
        this.pbDescriptionFormPanel.patchValue({
          pdId: value.pdId,
          pdDescription: value.pdDescription,
         });
      });
      this.onChange(value);
      this.onTouched();
   }
    
  
  writeValue(value:any) {
      
      if (value) {
        this.value = value;
      }
      if (value === null) {
        this.pbDescriptionFormPanel.reset();
      }
   }
    
  
  registerOnChange(fn:any) {
      this.onChange = fn;
    }
  registerOnTouched(fn: any) {
      this.onTouched = fn;
    }
    onChange: any = () => { };
    onTouched: any = () => { };
  
    // communicate the inner form validation to the parent form
  validate(_: UntypedFormControl) {
      return this.pbDescriptionFormPanel.valid ? null : { clientFormPanel: { valid: false } };
    }
  
  ngOnDestroy() {
      this.subscriptions.forEach(s => s.unsubscribe());
  }

}
