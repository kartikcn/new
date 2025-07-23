import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { hierarchy } from 'd3';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { ProblemTypeService } from '../../services/problem-type..service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-problem-type',
  templateUrl: './add-problem-type.component.html',
  styleUrls: ['./add-problem-type.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddProblemTypeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddProblemTypeComponent),
      multi: true
    }
  ]
})
export class AddProblemTypeComponent implements OnInit {
  probTypeFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  selectedRecord!: any;
  openedNodeData!: any;
  parentProbType: String = '';
  newRecord: boolean = true;
  title: string = '';
  @Input() isNew!: boolean;
  @Output() parentFun = new EventEmitter();
  constructor(
    private formBuilder: UntypedFormBuilder,
    private probTypeService: ProblemTypeService,
    private messageService: MessageService,
  ) {
    this.probTypeFormPanel = this.formBuilder.group({
      problemTypeId: [null],
      probType: ['', [Validators.required]],
      description: [''],
      hierarchyId: [null],
      parentId: [null],
    });

    this.subscriptions.push(
      this.probTypeFormPanel.valueChanges.subscribe(value => {
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
      this.probTypeFormPanel.patchValue({
        problemTypeId: data.problemTypeId,
        probType: data.probType,
        description: data.description,
        hierarchyId: data.hierarchyId,
        parentId: this.selectedRecord && action === "Add" ? this.selectedRecord.problemTypeId : data.parentId,
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
      problemTypeId: this.probTypeFormPanel.controls.problemTypeId.value,
      probType: this.probTypeFormPanel.controls.probType.value,
      description: this.probTypeFormPanel.controls.description.value,
      hierarchyId: this.probTypeFormPanel.controls.hierarchyId.value,
      parentId: this.probTypeFormPanel.controls.parentId.value,
    };
    return probTypeDetails;
  }

  set value(value: any) {
    setTimeout(() => {
      this.probTypeFormPanel.patchValue({
        problemTypeId: value.problemTypeId,
        probType: value.probType,
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
      this.probTypeFormPanel.reset();
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
    return this.probTypeFormPanel.valid ? null : { probTypeFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancel() {
    this.parentFun.emit("Cancel");
  }

  saveRecords() {
    const data = {
      problemTypeId: this.probTypeFormPanel.controls.problemTypeId.value,
      probType: this.probTypeFormPanel.controls.probType.value,
      description: this.probTypeFormPanel.controls.description.value,
      hierarchyId: this.probTypeFormPanel.controls.hierarchyId.value ? this.probTypeFormPanel.controls.hierarchyId.value : 0,
      parentId: this.probTypeFormPanel.controls.parentId.value,
    }
    this.probTypeService.save(data).subscribe((res: any) => {
      if (res.problemTypeId) {
        this.parentFun.emit("Save");
      } else {
        this.messageService.add({ key: 'error', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }
}
