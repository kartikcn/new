import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { Department } from '../../model/model.department';
import { DepartmentService } from '../../services/department.services';
import { DivisionService } from '../../services/division.services';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';


@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddDepartmentComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddDepartmentComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddDepartmentComponent implements OnInit,OnChanges {
  title: string = '';
  departmentFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord: boolean = true;
  @Input() isNew: boolean = false;
  @Input() action :string ='';
  @Input() formData:any;
  @Output() parentFun = new EventEmitter();
  processList: any[] = []
  allEmployees: any[] = []
  enumEm: any[] = []
  enumDivisions: any[] = [];
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  selectedEm = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private divisionService: DivisionService,
    private authSrv: AuthService,
    private messageService: MessageService,

  ) {
    this.departmentFormPanel = this.formBuilder.group({
      depId: [null, [Validators.required]],
      depCode:['',[Validators.required]],
      depHead: ['', [Validators.required]],
      description: [''],
      highlightColor: ['#a6a6a6'],
      divId: ['', [Validators.required]]
    });
    this.subscriptions.push(
      this.departmentFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.loadDivisionCodes();
  }

  ngOnChanges() {
    this.title = this.action;
    if(this.formData){
      this.setFormData(this.formData);
    }
  }

  setFormData(data: any) {
    if(data.depHead) {
      this.employeeService.getEmById(data.depHead).subscribe((res:any) => {
       this.createEm(res.em);
      })
    }
    this.departmentFormPanel.patchValue({
      depId: data.depId,
      depCode:data.depCode,
      depHead: data.depHead,
      description: data.description,
      highlightColor: data.highlightColor??'#a6a6a6',
      divId:data.divId,
    });
  }

  loadDivisionCodes() {
    this.divisionService.getAllDivisions().subscribe((res: any) => {
      this.enumDivisions = res.map((obj:any) => ({
        ...obj,
        displayDivId: obj.divCode +" - " +obj.description
      }));
      this.enumDivisions.unshift({ divId:null, description: "",  colorCode: "", divHead: "" ,displayDivId:'Make a selection'});
    })
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.departmentFormPanel.controls).forEach(key => {
      let field = this.departmentFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }

  get value(): Department {
    const records: Department = {
      depId: this.departmentFormPanel.controls.depId.value,
      depCode:this.departmentFormPanel.controls.depCode.value,
      description: this.departmentFormPanel.controls.description.value,
      highlightColor: this.departmentFormPanel.controls.highlightColor.value,
      depHead: this.departmentFormPanel.controls.depHead.value,
      divId: this.departmentFormPanel.controls.divId.value,
    }
    return records;
  }

  set value(value: Department) {
    setTimeout(() => {
      this.departmentFormPanel.patchValue({
        depId: value.depId,
        depCode:value.depCode,
        description: value.description,
        highlightColor: value.highlightColor??'#a6a6a6',
        depHead: value.depHead,
        divId: value.divId,
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
      this.departmentFormPanel.reset();
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
    return this.departmentFormPanel.valid ? null : { departmentFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveRecords(){
    this.messageService.clear();
    let data ={
      depId: this.departmentFormPanel.controls.depId.value,
      depCode:this.departmentFormPanel.controls.depCode.value,
      description: this.departmentFormPanel.controls.description.value,
      highlightColor: this.departmentFormPanel.controls.highlightColor.value,
      depHead: this.departmentFormPanel.controls.depHead.value,
      divId: this.departmentFormPanel.controls.divId.value,
    }
    this.departmentService.saveDepartment(data).subscribe((res:any)=>{
      if(res.depCode){
        this.parentFun.emit(res.depId);
      }else if (res.code!=200){
        this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
      }
    })
  }

  cancel(){
    this.parentFun.emit(false);
  }

  scrollToEndEm() {
    this.offsetEm = this.limitEm;
    this.limitEm += this.scrollLimit;
    this.filterCriteria.limit = this.limitEm;
    this.filterCriteria.offset = this.offsetEm;
    this.employeeService.getALLmployeeByScroll(this.filterCriteria).subscribe((res:any) => {
      this.enumEm = res;
      this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
      this.updateEmList(this.selectedEm);
    })
  }

  searchEm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
    this.scrollToEndEm();
  }

  createEm(em:any) {
    const emData = {
      emId: em.emId,
      emCode: em.emCode,
      firstName: em.firstName
    }
    this.selectedEm = emData;
    this.updateEmList(emData);
  }

  updateEmList(emData:any) {
    if(emData.emId){
      this.enumEm = this.enumEm.filter(e => e.emId != emData.emId);
      this.enumEm = this.enumEm.filter(e => e.emId != null);
      this.enumEm.unshift(emData);
      this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
    }
   
  }

  openEm() {
    this.limitEm = 0;
    this.offsetEm = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndEm();
  }

}
