import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { DepartmentService } from '../../services/department.services';
import { DivisionService } from '../../services/division.services';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { SubDepartmentService } from '../../services/subDepartment.services';
import { UtilConstant } from 'src/common/UtilConstant';


@Component({
  selector: 'app-add-sub-department',
  templateUrl: './add-sub-department.component.html',
  styleUrls: ['./add-sub-department.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddSubDepartmentComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddSubDepartmentComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddSubDepartmentComponent {
  title: string = '';
  subDepartmentFormPanel!: UntypedFormGroup;
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
  enumDepartments: any[] = [];
  allDepartmentsData: any[]=[];
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
    private subDepartmentService: SubDepartmentService

  ) {
    this.subDepartmentFormPanel = this.formBuilder.group({
      subDepId: [null, [Validators.required]],
      subDepCode:['',[Validators.required]],
      divId: [null, [Validators.required]],
      depId: [null, [Validators.required]],
      subDepHead: [''],
      description: [''],
      highlightColor: ['#a6a6a6'],
      
    });
    this.subscriptions.push(
      this.subDepartmentFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
   // this.loadAllEmployees();
    this.loadDivisionCodes();
    this.loadDepartmentCodes();
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
      this.enumEm.unshift({ fullName: 'Make a selection', emId: null });
    })
  }

  loadDivisionCodes() {
    this.divisionService.getAllDivisions().subscribe((res: any) => {
      this.enumDivisions = res.map((obj:any) => ({
        ...obj,
        displayDivId: obj.divCode +" - " +obj.description
      }));
      this.enumDivisions.unshift({ divId:null ,displayDivId:'Make a selection'});
    })
  }

  loadDepartmentCodes() {
    this.departmentService.getAllDepartments().subscribe((res: any) => {
      this.enumDepartments = res.map((obj:any) => ({
        ...obj,
        displayDepId: obj.depCode +" - " +obj.description
      }));
      this.allDepartmentsData=[...this.enumDepartments];
      this.enumDepartments.unshift({ depId:null, divId:null,displayDepId:'Make a selection'});
    })
  }

  onSelectDivision(event:any){
    if (event.divId != null) {
      setTimeout(() => {
        this.subDepartmentFormPanel.patchValue({
          depId: null,
        });
        this.enumDepartments = this.allDepartmentsData.filter((each:any)=> each.divId == event.divId);
        this.enumDepartments.unshift({ depId:null, divId:null,displayDepId:'Make a selection'});
      }, 10);
    }
    else {
      this.enumDepartments = [...this.allDepartmentsData];
      this.enumDepartments.unshift({ depId:null, divId:null,displayDepId:'Make a selection'});
    }
  }

  setFormData(data: any) {
    if(data.subDepHead) {
      this.employeeService.getEmById(data.subDepHead).subscribe((res:any) => {
       this.createEm(res.em);
      })
    }
    this.subDepartmentFormPanel.patchValue({
      subDepId: data.subDepId,
      subDepCode:data.subDepCode,
      divId: data.divId,
      depId: data.depId,
      subDepHead :  data.subDepHead,
      description : data.description,
      highlightColor: data.highlightColor??'#a6a6a6',
    });
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
    return this.subDepartmentFormPanel.valid ? null : { subDepartmentFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  cancel(){
    this.parentFun.emit(false);
  }

  saveRecords(){
    this.messageService.clear();
    let data ={
      subDepId: this.subDepartmentFormPanel.controls.subDepId.value,
      divId: this.subDepartmentFormPanel.controls.divId.value,
      depId: this.subDepartmentFormPanel.controls.depId.value,
      subDepCode:this.subDepartmentFormPanel.controls.subDepCode.value,
      description: this.subDepartmentFormPanel.controls.description.value,
      highlightColor: this.subDepartmentFormPanel.controls.highlightColor.value,
      subDepHead: this.subDepartmentFormPanel.controls.subDepHead.value,
    }
    this.subDepartmentService.saveSubDepartment(data).subscribe((res:any)=>{
      if(res.subDepCode){
        this.parentFun.emit(res.subDepId);
      }else if (res.code!=200){
        this.messageService.add({ key: 'save', severity: 'error', summary: 'error', detail: res.text });
      }
    })
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
