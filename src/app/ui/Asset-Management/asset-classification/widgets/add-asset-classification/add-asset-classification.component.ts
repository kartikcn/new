import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AssetClassificationService } from '../../services/asset-classification-services';
import { MessageService } from 'primeng/api';
import { VaildationError } from 'src/app/model/vaildationerror.model';

@Component({
  selector: 'app-add-asset-classification',
  templateUrl: './add-asset-classification.component.html',
  styleUrls: ['./add-asset-classification.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddAssetClassificationComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddAssetClassificationComponent),
      multi: true
    }
  ]
})
export class AddAssetClassificationComponent {

  assetClassFormPanel!: FormGroup;
  subscriptions: Subscription[] = [];
  selectedRecord!: any;
  openedNodeData!: any;
  parentAssetClassification: String = '';
  newRecord: boolean = true;
  title: string = '';
  @Input() isNew!: boolean;
  @Output() parentFun = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private assetClassificationSrv: AssetClassificationService,
    private messageService: MessageService,
  ) {
    this.assetClassFormPanel = this.formBuilder.group({
      assetClassId: [null],
      assetClass: ['', [Validators.required]],
      description: [''],
      hierarchyId: [null],
      parentId: [null],
    });

    this.subscriptions.push(
      this.assetClassFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
  }

  setFormData(data: any, action: any, parentProblems:string) {
    this.title = action;
    setTimeout(() => {
      this.assetClassFormPanel.patchValue({
        assetClassId: data.assetClassId,
        assetClass: data.assetClass,
        description: data.description,
        hierarchyId: data.hierarchyId,
        parentId: this.selectedRecord && action === "Add" ? this.selectedRecord.assetClassId : data.parentId,
      });
    }, 0);
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const probTypeDetails: any = {
      assetClassId: this.assetClassFormPanel.controls.assetClassId.value,
      assetClass: this.assetClassFormPanel.controls.assetClass.value,
      description: this.assetClassFormPanel.controls.description.value,
      hierarchyId: this.assetClassFormPanel.controls.hierarchyId.value,
      parentId: this.assetClassFormPanel.controls.parentId.value,
    };
    return probTypeDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.assetClassFormPanel.patchValue({
        assetClassId: value.assetClassId,
        assetClass: value.assetClass,
        description: value.description,
        hierarchyId: value.hierarchyId,
        parentId: value.parentId,
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
      this.assetClassFormPanel.reset();
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

  validate(_: FormControl) {
    return this.assetClassFormPanel.valid ? null : { assetClassFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancel() {
    this.parentFun.emit("Cancel");
  }

  saveRecords() {
    const data = {
      assetClassId: this.assetClassFormPanel.controls.assetClassId.value,
      assetClass: this.assetClassFormPanel.controls.assetClass.value,
      description: this.assetClassFormPanel.controls.description.value,
      hierarchyId: this.assetClassFormPanel.controls.hierarchyId.value ? this.assetClassFormPanel.controls.hierarchyId.value : 0,
      parentId: this.assetClassFormPanel.controls.parentId.value,
    }
    this.assetClassificationSrv.save(data).subscribe((res: any) => {
      if (res.assetClassId) {
        this.parentFun.emit("Save");
      } else {
        this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }

}
