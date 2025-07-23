import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-security-group-form',
  templateUrl: './add-security-group-form.component.html',
  styleUrls: ['./add-security-group-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddSecurityGroupFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddSecurityGroupFormComponent),
      multi: true
    }
  ]
})
export class AddSecurityGroupFormComponent implements OnInit {
  sgFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = []
  errorMsg: string = '';
  tempTitle: string = '';
  @Input() isNew!: boolean;
  constructor(
    private formBuilder: UntypedFormBuilder,
  ) {
    this.sgFormPanel = this.formBuilder.group({
      securityGroupId:[0,],
      groupName: ['', [Validators.required]],
      description: ['',],
    });
    this.subscriptions.push(
      this.sgFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
  }

  get value(): any {
    const SgDetails: any = {
      securityGroupId: this.sgFormPanel.controls.securityGroupId.value,
      groupName: this.sgFormPanel.controls.groupName.value,
      description: this.sgFormPanel.controls.description.value,
    };
    return SgDetails;
  }
  
  set value(value: any) {
    setTimeout(() => {
      this.sgFormPanel.patchValue({
        securityGroupId: value.securityGroupId,
        groupName: value.groupName,
        description: value.description,
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
      this.sgFormPanel.reset();
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
    return this.sgFormPanel.valid ? null : { sgFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
