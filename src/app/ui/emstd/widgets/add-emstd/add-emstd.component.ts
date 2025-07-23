import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormBuilder, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { EmStd } from '../../model/emstd.model';
import { EmStdService } from '../../service/emstd.service';

@Component({
  selector: 'app-add-emstd',
  templateUrl: './add-emstd.component.html',
  styleUrls: ['./add-emstd.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEmstdComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddEmstdComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddEmstdComponent implements OnInit, ControlValueAccessor, OnDestroy  {

  emstdFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];

  @Input("isNew") isNew:boolean=false;
  @Input("dataRec") dataRec!:EmStd|null;
  @Input("role_title") role_title: string = "Employee Standard";
  @Output() notifyParent = new EventEmitter<string>();
  
  

  constructor(private emstdSrv:EmStdService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService) {

    this.emstdFormPanel = this.formBuilder.group({
      emstdId:[null],
      emStd: [null, [Validators.required]],
      emStdDesc:[''],
      highlightColor : ['#a6a6a6']
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.emstdFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }
  ngOnInit(): void {
    if (!this.isNew && this.dataRec != null){
      this.preLoadData(this.dataRec);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.preLoadData(this.dataRec);
  }
 
  preLoadData(rec: EmStd|null):void{
    this.writeValue(rec);
  }
 
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  /// Start Preparing Entered Data Model
  get value(): EmStd {
    const details: EmStd = {
      emstdId:this.emstdFormPanel.controls.emstdId.value,
      emStd: this.emstdFormPanel.controls.emStd.value,
      emStdDesc: this.emstdFormPanel.controls.emStdDesc.value,
      highlightColor : this.emstdFormPanel.controls.highlightColor.value,
    }
    return details;
  }

  set value(value: EmStd) {
    setTimeout(() => {
      this.emstdFormPanel.patchValue({
        emstdId:value.emstdId,
        emStd: value.emStd,
        emStdDesc: value.emStdDesc,
        highlightColor:value.highlightColor??'#a6a6a6',
      });

      this.onChange(value);
      this.onTouched();
    }, 0);
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.emstdFormPanel.reset();
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
 
  onSaveRecord():void{
    this.messageService.clear();
    if(this.emstdFormPanel.valid){
      const record = this.emstdFormPanel.value;
      this.emstdSrv.saveRecord(record).subscribe((res)=>{
        if(res.code==200){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res.text });
          setTimeout(() => {
            this.notifyParent.emit("save");
          }, 1000);
        }else{
          this.messageService.add({ severity: 'error', summary: 'error', detail: res.text });
        }
      }
      )
    }
  }
  onCancel(){
    this.notifyParent.emit("cancel");
  }

}

