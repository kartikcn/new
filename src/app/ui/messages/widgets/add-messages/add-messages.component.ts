import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, UntypedFormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { AuthService } from 'src/app/services/auth.service';
import { Messages } from '../../model/messages.model';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-add-messages',
  templateUrl: './add-messages.component.html',
  styleUrls: ['./add-messages.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddMessagesComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddMessagesComponent),
      multi: true
    }
  ]
})

export class AddMessagesComponent implements ControlValueAccessor, OnDestroy {
  messagesFormPanel:UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew: boolean = false;
  processList :any[]=[]
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private msgSrv : MessagesService
  ) { 
    this.messagesFormPanel = this.formBuilder.group({
      msgId: [null, [Validators.required]],
      msgCode: ['', [Validators.required]],
      processId : [null, [Validators.required]],
      msgText: ['', [Validators.required]]
    });
    this.subscriptions.push(
      this.messagesFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.getAllProcesses();
  }

  // checkMsgIdValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //       this.messagesFormPanel.controls['msgId'].setErrors(null);
  //       this.messagesFormPanel.clearAsyncValidators();
  //       this.messagesFormPanel.updateValueAndValidity();
  //       this.msgSrv.checkMsgIdExists(control.value).subscribe((res: any) => {
  //         if (res && res.text == "true") {
  //           this.messagesFormPanel.controls['msgId'].setErrors({ 'incorrect': true });
  //           this.messagesFormPanel.updateValueAndValidity();
  //           return { 'incorrect': true };
  //         }
  //         else {
  //           return null;
  //         }
  //       });
  //       return null;
  //     }
  //     return null;
  //   };
  // }

  getAllProcesses(){
    this.msgSrv.getAllProcesses().subscribe((res:any[])=>{
      this.processList = res;
      this.processList.unshift({processId:null,processCode:"Make a selection"});
    })
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.messagesFormPanel.controls).forEach(key => {
      let field = this.messagesFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }

  get value(): Messages {
    const records: Messages = {    
      processId: this.messagesFormPanel.controls.processId.value,
      msgId: this.messagesFormPanel.controls.msgId.value,
      msgText : this.messagesFormPanel.controls.msgText.value,
      msgCode : this.messagesFormPanel.controls.msgCode.value,
    }
    return records;
  }

  set value(value: Messages) {
    setTimeout(() => {
      this.messagesFormPanel.patchValue({
        processId: value.processId,
        msgId: value.msgId,
        msgText: value.msgText,
        msgCode: value.msgCode
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
      this.messagesFormPanel.reset();
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
    return this.messagesFormPanel.valid ? null : { messagesFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
