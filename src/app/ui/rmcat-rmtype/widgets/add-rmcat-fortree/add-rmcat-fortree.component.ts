
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, forwardRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { RmcatService } from 'src/app/services/rmcat.service';

@Component({
  selector: 'app-add-rmcat-fortree',
  templateUrl: './add-rmcat-fortree.component.html',
  styleUrls: ['./add-rmcat-fortree.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRmcatFortreeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRmcatFortreeComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddRmcatFortreeComponent implements OnInit,OnChanges {
  title: string = '';
  rmcatFormPanel!: UntypedFormGroup;
  compId!:number ;
  subscriptions: Subscription[] = [];
  @Input() isNew: boolean = false;
  @Input() action :string ='';
  @Input() formData:any;
  @Output() parentFun = new EventEmitter();
  processList: any[] = []
  allEmployees: any[] = []
  enumEm: any[] = []

  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmcatservice:RmcatService,
    private messageService: MessageService,
  ) {

    this.rmcatFormPanel = this.formBuilder.group({
      rmcatId:[null,[Validators.required]],
      rmCat: ['', [Validators.required]],
      rmCatDesc: [''],
      highlightColor : ['#a6a6a6']
    });
    this.subscriptions.push(
      this.rmcatFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.title = this.action;
    if(this.formData){
      this.setFormData(this.formData);
    }
  }

  setFormData(data: any) {
    this.rmcatFormPanel.patchValue({
      rmcatId:data.rmcatId,
      rmCat: data.rmCat,
      rmCatDesc: data.rmCatDesc,
      highlightColor : data.highlightColor??'#a6a6a6'
    });
  }

  // checkRmCatExist(control: any) {
  //     if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //       this.rmcatFormPanel.controls['rmCat'].setErrors(null);
  //       this.rmcatFormPanel.clearAsyncValidators();
  //       this.rmcatFormPanel.updateValueAndValidity();
  //       let rmStandard = this.rmcatFormPanel.controls.rmCat.value;
  //       this.rmcatservice.validateRmCat(rmStandard).subscribe((res:any)=>{
  //         if (res && res.text == "true"){
  //           this.rmcatFormPanel.controls['rmCat'].setErrors({ 'incorrect': true });
  //           this.rmcatFormPanel.updateValueAndValidity();
  //           return { 'incorrect': true };
  //         }
  //         else{
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
    Object.keys(this.rmcatFormPanel.controls).forEach(key => {
      let field = this.rmcatFormPanel.get(key);
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
      rmcatId:this.rmcatFormPanel.controls.rmcatId.value,
      rmCat: this.rmcatFormPanel.controls.rmCat.value,
      rmCatDesc: this.rmcatFormPanel.controls.rmCatDesc.value,
      highlightColor : this.rmcatFormPanel.controls.highlightColor.value,
    }
    return records;
  }

  set value(value: any) {
    setTimeout(() => {
      this.rmcatFormPanel.patchValue({
        rmcatId:value.rmcatId,
        rmCat: value.rmCat,
        rmCatDesc: value.rmCatDesc,
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
      this.rmcatFormPanel.reset();
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
    return this.rmcatFormPanel.valid ? null : { divisionFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveRecords(){
    this.messageService.clear();
    let data ={
      rmcatId: this.rmcatFormPanel.controls.rmcatId.value,
      rmCat: this.rmcatFormPanel.controls.rmCat.value,
      rmCatDesc: this.rmcatFormPanel.controls.rmCatDesc.value,
      highlightColor : this.rmcatFormPanel.controls.highlightColor.value,
    }
    this.rmcatservice.saveRmcat(data).subscribe((res:any)=>{
      if(res.rmCat){
        this.parentFun.emit('save');
      }else if (res.code!=200){
        this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }
  cancel(){
    this.parentFun.emit('cancel');
  }
}
