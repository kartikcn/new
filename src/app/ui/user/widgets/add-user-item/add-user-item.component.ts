import { Component, forwardRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl, NG_VALIDATORS} from '@angular/forms';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { UserOutput } from '../../model/userOutput.model';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { Craftsperson } from 'src/app/ui/Helpdesk/craftsperson/model/craftsperson.model';
import { CraftspersonService } from 'src/app/ui/Helpdesk/craftsperson/services/craftsperson.service';


declare var $: any;
@Component({
  selector: 'app-add-user-items',
  templateUrl: './add-user-item.component.html',
  styleUrls: ['./add-user-item.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddUserComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddUserComponent),
      multi: true
    }
  ]
})
export class AddUserComponent implements ControlValueAccessor, OnDestroy {

  userFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  newRecord:boolean=true;

  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  enumUsers: Enums[] = [];
  enumStatus: Enums[] = [];
  enumRole: any[] = [];
  user_name_exists:boolean=false;
  enumEmp:any[]=[];
  isCreateNewEmployee: boolean = true;
  isCreateNewEmployeeChkBox:boolean=false;
  isShow:boolean=false;
  isCompanyShow = false;
  technicianData: any[]=[];
  
 @Input() isNew!:boolean;
  @Input() isProfile:boolean=false;
  @Output() notifyParent = new EventEmitter();
  
  constructor(
    private enumsrv: EnumService,
    private formBuilder: UntypedFormBuilder,
    private userSrv: UsersService,
    private authSrv:AuthService,
    private emSrv:EmployeeService,
    private technicianServ: CraftspersonService

    
  ) {
    /// Start Of Building Form 
    this.userFormPanel = this.formBuilder.group({
      userId: [null],
      userName: ['', [Validators.required, this.checkUserExistsValidator(),Validators.email]],
      userStatus: ['',[Validators.required]],
      userRoleId: ['', [Validators.required]],
      deviceId: ['', ],
      ipAddress: [''],
      emId: ['', [Validators.required]],
      technicianId: ['']
    });
    
    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.userFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  
  
  ngOnInit() {
    this.user_name_exists = false;
    this.loadEnums();
    this.loadUserRoles();
   // this.setComp();
    const id = 0;
    this.loadUnAssignedTechnician(id);
    this.loadUnAssignEmployee(id);

  }
  setComp(){
    // const compId = this.authSrv.getLoggedInUserCompId();
    // if (compId == 1){
    //   this.isCompanyShow = true;
    //   this.loadCompany();
    // }
    // setTimeout(() => {
    //   this.userFormPanel.patchValue({
    //     compId: compId
    //   });
    // }, 0);
  }
  // loadCompany(){
  //   this.compSrv.getAllCompany().subscribe((res:CompanyInput[])=>{
  //     this.enumCompany = res;
      
  //   })
  // }
  loadUserRoles(): void {
    this.userSrv.getUserRole().subscribe((res: any) => {
      this.enumRole = res;
    });
  }

   /// Start Of Form Validation Related Code
  public isValid() {
    return this.getValidationErrors().length === 0;
  }
  
  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    Object.keys(this.userFormPanel.controls).forEach(key => {
      let field = this.userFormPanel.get(key);
      const controlErrors: ValidationErrors | null = field != null ? field.errors : null;
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
      (res: Enums[]) => {
        this.enumList = res;
        this.enumClonedList =  this.enumList.map(x => Object.assign({}, x));
        this.enumUsers = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'fm_users'.toLocaleUpperCase());
        this.enumStatus = this.enumUsers.filter(t => t.fieldName.toLocaleUpperCase() === 'user_status'.toLocaleUpperCase());

        this.enumStatus.unshift(new Enums(null, "", "", 'Make a selection'));
        this.populateUserStatus();
        
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }
  populateUserStatus():void{
    if(this.isNew){
      setTimeout(() => {
        this.userFormPanel.patchValue({
          userStatus: 1
        });
      }, 0);
    }
  }

  checkUserExistsValidator(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null && control.value.length > 1 && this.isNew) {
        this.userFormPanel.controls['userName'].setErrors(null);
        this.userFormPanel.clearAsyncValidators();
        this.userFormPanel.updateValueAndValidity();
        this.userSrv.validateUserName(control.value).subscribe((res:any)=>{
          if (res && res.text == "true"){
            this.userFormPanel.controls['userName'].setErrors({ 'incorrect': true });
            this.userFormPanel.updateValueAndValidity();
            return { 'incorrect': true };
          }
          else{
            return null;
          }
        });
        
      }
      return null;
    };
  }

  /// Start Preparing Entered Data Model
  get value(): UserOutput {
    const records: UserOutput = {
      userId: this.userFormPanel.controls.userId.value,
      userName: this.userFormPanel.controls.userName.value,
      userStatus: this.userFormPanel.controls.userStatus.value,
      userRoleId: this.userFormPanel.controls.userRoleId.value,
      deviceId: this.userFormPanel.controls.deviceId.value,
      ipAddress: this.userFormPanel.controls.ipAddress.value,
      emId: this.userFormPanel.controls.emId.value,
      compId: this.authSrv.getLoggedInUserCompId(),
      technicianId: this.userFormPanel.controls.technicianId.value
    }
    return records;
  }
  
  set value(value:UserOutput ) { 
      setTimeout(() => {
        this.userFormPanel.patchValue({
          userName: value.userName,
          userId: value.userId,
          userStatus: value.userStatus,
          userRoleId: value.userRoleId,
          deviceId: value.deviceId,
          ipAddress: value.ipAddress,
          emId: value.emId,
          compId:value.compId,
          technicianId: value.technicianId,
        });
        this.isCreateEmp(value.emId);
        this.loadUnAssignEmployee(value.emId ? value.emId : 0);
        this.setComp();
        this.onChange(value);
        this.onTouched();
      }, 0);
    }

  writeValue(value:any) {
    
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.userFormPanel.reset();
      this.isCreateEmp(null);
      this.loadUnAssignEmployee(0);
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
    return this.userFormPanel.valid ? null : { userFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onCheckBoxChange(event:any){
    
      this.isShow = event.checked ? true:false;
      if(this.isShow){
        this.userFormPanel.patchValue({"emId":"0"});
      }
      else{
        this.userFormPanel.patchValue({ "emId": "" });
      }
    this.notifyParentPanel(this.isShow,"0");
    
  }
  notifyParentPanel(isShow:boolean,em_id:string){
    let data = {
      "showEmpPanel": isShow,
      "em_id": em_id
    }
    this.notifyParent.emit(data);
  }
  onChangeEmp(isShow:boolean,em_id:any){
    this.notifyParentPanel(isShow,em_id);
    
  }

  isCreateEmp(em_id:any){
    if(em_id != null){
      this.isCreateNewEmployeeChkBox = false;
      
    }
    else{
      this.isCreateNewEmployeeChkBox = this.isCreateNewEmployee =true;
    }
  }
  loadUnAssignEmployee(emId:any):void{
    this.emSrv.getAllUnAssignEmployees(emId).subscribe((res:any)=>{
      this.enumEmp = res;
   //   this.enumEmp =  this.enumEmp.map(i=>{i.name = i.emCode + " - "+ i.name; return i;});

      this.enumEmp.unshift({id:null,  name:'Make a selection'});
    })
  }
  onSelectEmploye(event:any){
    if (event && event.id != null){
      this.onChangeEmp(true,event.id);
      this.isCreateNewEmployeeChkBox = false;
    }
    else{
      this.isCreateNewEmployeeChkBox = true;
      this.onChangeEmp(false, "0");
    }
    
  }

  loadUnAssignedTechnician(technicianId: any){
    this.technicianServ.getUnAssignedTechnician(technicianId).subscribe((res: any)=>{
      if(res){
        this.technicianData = res;
        this.technicianData.unshift(new Craftsperson(null, "Make a selection", "", "", 0, 0, 0, "", 0, 0, 0, 0, 0,""));
      }else{
        this.technicianData = []
      }
    })
  }
}