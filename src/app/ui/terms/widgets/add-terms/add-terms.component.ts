import { DatePipe } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-add-terms',
  templateUrl: './add-terms.component.html',
  styleUrls: ['./add-terms.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddTermsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddTermsComponent),
      multi: true
    }
  ]
})
export class AddTermsComponent {
  termFormPanel:UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew: boolean = false;
  processList :any[]=[]
  constructor(
    private formBuilder: UntypedFormBuilder,
    private datePipe:DatePipe,
  ) { 
    this.termFormPanel = this.formBuilder.group({
     
      term: ['', [Validators.required]],
      dateFrom : [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      comments :[null]
    });
    this.subscriptions.push(
      this.termFormPanel.valueChanges.subscribe(value => {
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
    const validationErros: VaildationError[] = [];
    Object.keys(this.termFormPanel.controls).forEach(key => {
      let field = this.termFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }

  get value(): any {
    const records: any = {    
      term: this.termFormPanel.controls.term.value,
      dateFrom: this.termFormPanel.controls.dateFrom.value,
      dateTo : this.termFormPanel.controls.dateTo.value,
      comments :this.termFormPanel.controls.comments.value,
    }
    return records;
  }

  set value(value: any) {
    setTimeout(() => {
      this.termFormPanel.patchValue({
        term: value.term,
        dateFrom: this.datePipe.transform(this.formatDate(value.dateFrom),'dd MMM yyyy'),
        dateTo : this.datePipe.transform(this.formatDate(value.dateTo),'dd MMM yyyy'),
        comments : value.comments
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
      this.termFormPanel.reset();
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
    return this.termFormPanel.valid ? null : { termFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  formatDate(date: any) {
    if (date != null) {
      var d = new Date(date);
      // var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      // var a = new Date(date.getTime() - userTimezoneOffset);
      return d;
    } else {
      return null;
    }
  }

  checkDates(control: any){
    if (control !== undefined && control != null) {
      this.termFormPanel.controls['dateTo'].setErrors(null);
      this.termFormPanel.clearAsyncValidators();
      this.termFormPanel.updateValueAndValidity();
      let dateFrom = this.formatDate(this.termFormPanel.controls.dateFrom.value);
      let dateTo = this.formatDate(this.termFormPanel.controls.dateTo.value);
      if(dateFrom!= null && dateTo!=null && dateTo<=dateFrom){
        this.termFormPanel.controls['dateTo'].setErrors({ 'incorrect': true });
          this.termFormPanel.updateValueAndValidity();
          return { 'incorrect': true };
      }else {
        return null;
      }
      }
      return null;
    }
  
    
}
