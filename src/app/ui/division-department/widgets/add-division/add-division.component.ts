import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { Division } from '../../model/division.model';
import { DivisionService } from '../../services/division.services';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddDivisionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddDivisionComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddDivisionComponent implements OnInit,OnChanges {
  title: string = '';
  divisionFormPanel!: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  @Input() isNew: boolean = false;
  @Input() action :string ='';
  @Input() formData:any;
  @Output() parentFun = new EventEmitter();
  processList: any[] = []
  allEmployees: any[] = []
  enumEm: any[] = []
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  selectedEm = {};
  constructor(
    private formBuilder: UntypedFormBuilder,
    private divisionService: DivisionService,
    private employeeService: EmployeeService,
    private authSrv: AuthService,
    private messageService: MessageService,
    
  ) {

    this.divisionFormPanel = this.formBuilder.group({
      divId: [null, [Validators.required]],
      divCode:['', [Validators.required]],
      divHead: [null, [Validators.required]],
      description: [''],
      highlightColor: ['#a6a6a6']
    });
    this.subscriptions.push(
      this.divisionFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    //this.loadAllEmployees();
  }

  ngOnChanges() {
    this.title = this.action;
    if(this.formData){
      this.setFormData(this.formData);
    }
    
  }

  loadAllEmployees() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      this.allEmployees = res;
      this.enumEm = this.allEmployees;
      this.enumEm.map((i: any) => {
        if (i.firstName.length > 0 && i.lastName.length > 0) {
          return i.fullName = i.firstName + ' ' + i.lastName;
        } else {
          return i.lastName;
        }
      })
      this.enumEm.unshift(new EmployeeDetails({ fullName: 'Make a selection', emId: null, initials: "", firstName: "", lastName: "", maidenName: "", aliasName: "", email: "", emStd: "", emStatus: 0, idNumber: "", birthDate: null, gender: 0, compName: "", dateJoin: "", dateLeave: "", emPhoto: "", ccCode: 0, lineMngr: "", emPhotoMobile: "",emCode:"" }));
    })
  }

  setFormData(data: any) {
    if(data.divHead) {
      this.employeeService.getEmById(data.divHead).subscribe((res:any) => {
       this.createEm(res.em);
      })
    }
    this.divisionFormPanel.patchValue({
      divId: data.divId,
      divCode:data.divCode,
      divHead: data.divHead,
      description: data.description,
      highlightColor: data.highlightColor??'#a6a6a6',
    });
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.divisionFormPanel.controls).forEach(key => {
      let field = this.divisionFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
        });
      }
    });
    return validationErros;
  }

  get value(): Division {
    const records: Division = {
      divId: this.divisionFormPanel.controls.divId.value,
      divCode: this.divisionFormPanel.controls.divCode.value,
      description: this.divisionFormPanel.controls.description.value,
      highlightColor: this.divisionFormPanel.controls.highlightColor.value,
      divHead: this.divisionFormPanel.controls.divHead.value
    }
    return records;
  }

  set value(value: Division) {
    if(value.divHead) {
      this.employeeService.getEmById(value.divHead).subscribe((res:any) => {
       this.createEm(res.em);
      })
    }
    setTimeout(() => {
      this.divisionFormPanel.patchValue({
        divId: value.divId,
        divCode:value.divCode,
        description: value.description,
        highlightColor: value.highlightColor??'#a6a6a6',
        divHead: value.divHead,
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
      this.divisionFormPanel.reset();
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
    return this.divisionFormPanel.valid ? null : { divisionFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveRecords(){
    this.messageService.clear();
    let data ={
      divId: this.divisionFormPanel.controls.divId.value,
      divCode: this.divisionFormPanel.controls.divCode.value,
      description: this.divisionFormPanel.controls.description.value,
      highlightColor: this.divisionFormPanel.controls.highlightColor.value,
      divHead: this.divisionFormPanel.controls.divHead.value
    }
    this.divisionService.saveDivision(data).subscribe((res:any)=>{
      if(res.divCode){
        this.parentFun.emit(res.divId);
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
