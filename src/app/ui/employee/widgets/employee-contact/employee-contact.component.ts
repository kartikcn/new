import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeeContact } from '../../model/employee-contact.model';

@Component({
  selector: 'app-employee-contact',
  templateUrl: './employee-contact.component.html',
  styleUrls: ['./employee-contact.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmployeeContactComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmployeeContactComponent),
      multi: true
    }
  ]
})
export class EmployeeContactComponent implements ControlValueAccessor, OnDestroy {

  frmEmployeeContact: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  @Input() isNew: boolean = false;
  @Input() isEdit:boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
  ) { 
    // this.currentDate = this.datePipe.transform(new Date(), "yyyy/MM/dd hh:mm:ss");
    /// Start Of Building Form 
    this.frmEmployeeContact = this.formBuilder.group({

      // phoneHome: [''],
      phoneWork: [''],
      phonePersonal: [''],
      faxNum: [''],
      altContactName: [''],
      altContactPhone: [''],

    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.frmEmployeeContact.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  

  ngOnInit(): void {
  }

  /// Start Preparing Entered Data Model
  get value(): EmployeeContact {
    const details: EmployeeContact = {
      // phoneHome: this.frmEmployeeContact.controls.phoneHome.value,
      phoneWork: this.frmEmployeeContact.controls.phoneWork.value,
      phonePersonal: this.frmEmployeeContact.controls.phonePersonal.value,
      faxNum: this.frmEmployeeContact.controls.faxNum.value,
      altContactName: this.frmEmployeeContact.controls.altContactName.value,
      altContactPhone: this.frmEmployeeContact.controls.altContactPhone.value,
    }
    return details;
  }

  set value(value: EmployeeContact) {
    setTimeout(() => {
      this.frmEmployeeContact.patchValue({
        // phoneHome: value.phoneHome,
        phoneWork: value.phoneWork,
        phonePersonal: value.phonePersonal,
        faxNum: value.faxNum,
        altContactName: value.altContactName,
        altContactPhone: value.altContactPhone,
        
      });
      this.checkFormMode()
      this.onChange(value);
      this.onTouched();
    }, 0);
  }
  checkFormMode(){
    if (this.isEdit == false){
      this.frmEmployeeContact.disable()
    }else{
      this.frmEmployeeContact.enable()
    }
  }
  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.frmEmployeeContact.reset();
      this.checkFormMode();
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
    return this.frmEmployeeContact.valid ? null : { frmEmployeeContact: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
