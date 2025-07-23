import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS} from '@angular/forms';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { EmStdService } from 'src/app/ui/emstd/service/emstd.service';
import { EnumsOutput } from 'src/app/model/enums-output.model';

declare var $: any;
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEmployeeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddEmployeeComponent),
      multi: true
    }
  ]
})
export class AddEmployeeComponent implements ControlValueAccessor, OnDestroy {

  frmEmployeeDetails: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  loadedEmcode:string|null =null;
  enumList: any[] = [];
  enumClonedList: any[] = [];
  enumInitial: any[] = [];
  enumGender: any[] = [];
  enumEmStandard: any[] = [];
  enumEmStatus: any[] = [];
  currentDate: any;
  // enumLineMngr: EmpFilterInput[]=[];
  enumLineMngr: any[]=[];
  enumccCode:any[]=[];
  @Input() isEdit: boolean = false;
 
  
  compId!: number;
  @Input() isNew:boolean=false;

  constructor(
    private enumsrv: EnumService,
    private formBuilder: UntypedFormBuilder,
    private emSrv: EmployeeService,
    private emstdSrv:EmStdService,
    
  ) {
   // this.currentDate = this.datePipe.transform(new Date(), "yyyy/MM/dd hh:mm:ss");
    /// Start Of Building Form 
    this.frmEmployeeDetails = this.formBuilder.group({

      emId: [null],
      emCode:["", [Validators.required]],
      initials: ['', [Validators.required]],
      firstName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      maidenName: [''],
      aliasName: [''],
      email: ['', [Validators.required,Validators.email]],
      emstdId: [null, [Validators.required]],
      emStatus: ['', [Validators.required]],
      idNumber: [''],
      birthDate: [''],
      gender: ['', [Validators.required]],
      compName: [''],
      dateJoin: [''],
      dateLeave: Date,
      lineMngr:[null],


    });
    
    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.frmEmployeeDetails.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
    
  }

  ngOnInit() {
    this.loadEnums();
    this.loadEmstd();
    this.checkFormMode();
    this.loadEmployee();
    
  }
  loadEmstd(){
    this.emstdSrv.getEmStd().subscribe((res)=>{
      this.enumEmStandard = res.map((i)=>{
        i.emStdDesc = i.emStd + " - " + (i.emStdDesc.length > 20 ? i.emStdDesc.substr(0,18)+"..." : i.emStdDesc);
        return i;
    });

      this.enumEmStandard.unshift({ emstdId: null, emStdDesc:"Make a selection"});
    });
  }
 
  loadEmployee(){
    this.emSrv.getAllEmpByComp().subscribe((res: any[])=>{
      this.enumLineMngr = res.map(i=>{i.firstName = i.emCode + " - "+ i.firstName; return i;});
      // this.enumLineMngr.unshift(new EmpFilterInput(null, "Make a selection",0 ));
    })
  }
  /// Start Of Form Validation Related Code
  public isValid() {
    return this.getValidationErrors().length === 0;
  }
  
  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];
    Object.keys(this.frmEmployeeDetails.controls).forEach(key => {
      let field = this.frmEmployeeDetails.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors:null;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
            validationErros.push(new VaildationError(key, keyError, controlErrors[keyError]));
          });
        }
      });
    return validationErros;
  }
  /// End Of Form Validation Related Code

  /// Start Of Reference Data Initiation
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: any[]) => {
        this.enumList = res;
        this.enumClonedList =  this.enumList.map(x => Object.assign({}, x));
        this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'em'.toLocaleUpperCase());
        this.enumEmStatus = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'em_status'.toLocaleUpperCase());
        this.enumInitial = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'initials'.toLocaleUpperCase());
        this.enumGender = this.enumClonedList.filter(t => t.fieldName.toLocaleUpperCase() === 'gender'.toLocaleUpperCase());

        // this.enumInitial.unshift(new Enums('', '', '', 'Make a selection'));
        // this.enumEmStatus.unshift(new Enums('', '', '', 'Make a selection'));
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }

  /// Start Preparing Entered Data Model
  get value(): EmployeeDetails {
    const details: EmployeeDetails = {
      emId: this.frmEmployeeDetails.controls.emId.value,
      initials: this.frmEmployeeDetails.controls.initials.value,
      firstName :this.frmEmployeeDetails.controls.firstName.value,
      lastName :this.frmEmployeeDetails.controls.lastName.value,
      maidenName :this.frmEmployeeDetails.controls.maidenName.value,
      aliasName :this.frmEmployeeDetails.controls.aliasName.value,
      email :this.frmEmployeeDetails.controls.email.value,
      emstdId :this.frmEmployeeDetails.controls.emstdId.value,
      emStatus :this.frmEmployeeDetails.controls.emStatus.value,
      idNumber :this.frmEmployeeDetails.controls.idNumber.value,
      birthDate :this.frmEmployeeDetails.controls.birthDate.value,
      gender :this.frmEmployeeDetails.controls.gender.value,
      compName :this.frmEmployeeDetails.controls.compName.value,
      dateJoin :this.frmEmployeeDetails.controls.dateJoin.value,
      dateLeave: this.frmEmployeeDetails.controls.dateLeave.value,
      lineMngr: this.frmEmployeeDetails.controls.lineMngr.value,
      emCode:this.frmEmployeeDetails.controls.emCode.value
      }
    return details;
    }
  
  set value(value: EmployeeDetails) {
      setTimeout(() => {
        this.frmEmployeeDetails.patchValue({
          emId: value.emId,
          initials: value.initials,
          firstName: value.firstName,
          lastName: value.lastName,
          maidenName: value.maidenName,
          aliasName: value.aliasName,
          email: value.email,
          emstdId: value.emstdId,
          emStatus: value.emStatus,
          idNumber: value.idNumber,
          birthDate: value.birthDate,
          gender: value.gender,
          compName: value.compName,
          dateJoin: value.dateJoin,
          dateLeave: value.dateLeave,
          lineMngr:value.lineMngr,
          emCode:value.emCode
        });
        this.loadedEmcode= value.emCode;
        this.onChange(value);
        this.onTouched();
      }, 0);
    }

  checkFormMode() {
    if (this.isEdit == false) {
      this.frmEmployeeDetails.disable()
    } else {
      this.frmEmployeeDetails.enable()
    }
  }

  writeValue(value:any) {
    
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.frmEmployeeDetails.reset();
    }
  }
  

  registerOnChange(fn:any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  // communicate the inner form validation to the parent form
  validate(_: UntypedFormControl) {
    return this.frmEmployeeDetails.valid ? null : { frmEmployeeDetails: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
