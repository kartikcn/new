import { Component, EventEmitter, Input, OnChanges, OnInit, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, UntypedFormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { RmcatService } from 'src/app/services/rmcat.service';
import { RmcatFilterInput } from 'src/app/ui/rmcat/modal/rmcatFilterInput.model';
import { RmcatTreeFilterInput } from 'src/app/ui/rmcat/modal/rmcatTreeFilterInput.model';

@Component({
  selector: 'app-add-rmtype-fortree',
  templateUrl: './add-rmtype-fortree.component.html',
  styleUrls: ['./add-rmtype-fortree.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRmtypeFortreeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRmtypeFortreeComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddRmtypeFortreeComponent implements OnInit,OnChanges {
  title: string = '';
  rmTypeFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  @Input() isNew: boolean = false;
  @Input() action :string ='';
  @Input() formData:any;
  @Output() parentFun = new EventEmitter();
  enumRmcats: RmcatTreeFilterInput[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmcatSrv: RmcatService,
    private messageService: MessageService,
  ) {

    this.rmTypeFormPanel = this.formBuilder.group({
      rmtypeId:[null,[Validators.required]],
      rmcatId: [null, [Validators.required]],
      rmType: ['', [Validators.required]],
      rmTypeDesc: [''],
      highlightColor : ['#a6a6a6']
    });
    this.subscriptions.push(
      this.rmTypeFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadRmcats();
  }

  ngOnChanges() {
    this.title = this.action;
    if(this.formData){
      this.setFormData(this.formData);
    }
  }

  loadRmcats() {
    this.rmcatSrv.getALLRmcats().subscribe((res: any[]) => {
      this.enumRmcats = res;
      // this.enumRmcats = res.map((i: any) => { i.rmCatDesc = i.rmCat + ' - ' + i.rmCatDesc; return i; });
      this.enumRmcats.unshift(new RmcatTreeFilterInput(null, 'Make a selection'));
    });
  }

  setFormData(data: any) {
    this.rmTypeFormPanel.patchValue({
      rmtypeId:data.rmtypeId,
      rmcatId: data.rmcatId,
      rmType: data.rmType,
      rmTypeDesc: data.rmTypeDesc,
      highlightColor:data.highlightColor??'#a6a6a6',
    });
  }


  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.rmTypeFormPanel.controls).forEach(key => {
      let field = this.rmTypeFormPanel.get(key);
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
      rmtypeId:this.rmTypeFormPanel.controls.rmtypeId.value,
      rmcatId: this.rmTypeFormPanel.controls.rmcatId.value,
      rmType: this.rmTypeFormPanel.controls.rmType.value,
      rmTypeDesc: this.rmTypeFormPanel.controls.rmTypeDesc.value,
      highlightColor : this.rmTypeFormPanel.controls.highlightColor.value,
    }
    return records;
  }

  set value(value: any) {
    setTimeout(() => {
      this.rmTypeFormPanel.patchValue({
        rmtypeId:value.rmtypeId,
        rmcatId: value.rmcatId,
        rmType: value.rmType,
        rmTypeDesc: value.rmTypeDesc,
        highlightColor:value.highlightColor??'#a6a6a6',
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

  validate(_: UntypedFormControl) {
    return this.rmTypeFormPanel.valid ? null : { divisionFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveRecords(){
    this.messageService.clear();
    let data ={
      rmtypeId:this.rmTypeFormPanel.controls.rmtypeId.value,
      rmcatId: this.rmTypeFormPanel.controls.rmcatId.value,
      rmType: this.rmTypeFormPanel.controls.rmType.value,
      rmTypeDesc: this.rmTypeFormPanel.controls.rmTypeDesc.value,
      highlightColor : this.rmTypeFormPanel.controls.highlightColor.value,
    }
    this.rmcatSrv.saveRmType(data).subscribe((res:any)=>{
      if(res.rmType){
        this.parentFun.emit('save');
      }else if(res.code!=200){
        this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }
  cancel(){
    this.parentFun.emit('cancel');
  }

  // checkRmTypeExist(control: any) {
  //     if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
  //       this.rmTypeFormPanel.controls['rmType'].setErrors(null);
  //       this.rmTypeFormPanel.clearAsyncValidators();
  //       this.rmTypeFormPanel.updateValueAndValidity();
  //       let rmStandard = this.rmTypeFormPanel.controls.rmCat.value;
  //       let rmType = this.rmTypeFormPanel.controls.rmType.value
  //       this.rmcatSrv.validateRmType(rmStandard,rmType).subscribe((res:any)=>{
  //         if (res && res.text == "true"){
  //           this.rmTypeFormPanel.controls['rmType'].setErrors({ 'incorrect': true });
  //           this.rmTypeFormPanel.updateValueAndValidity();
  //           return { 'incorrect': true };
  //         }
  //         else{
  //           return null;
  //         }
  //       });
  //     }
  //   };
  
}
