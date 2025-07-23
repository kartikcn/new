import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, UntypedFormBuilder, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserRoles } from '../../model/user-role.model';
import { RoleService } from '../../service/role.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddRoleComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddRoleComponent),
      multi: true
    },
    MessageService
  ]
})
export class AddRoleComponent implements OnInit, ControlValueAccessor, OnDestroy  {

  roleFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];

  @Input("isNew") isNew:boolean=false;
  @Input("dataRec") dataRec!:UserRoles|null;
  @Input("role_title") role_title: string = "User Role";
  @Output() notifyParent = new EventEmitter<string>();
  
  

  constructor(private userRoleSrv:RoleService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService) {

    this.roleFormPanel = this.formBuilder.group({
      roleName: [null, [Validators.required]],
      roleTitle:[''],
      userRoleId:[0,]
    });

    // End Of Building Form
    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.roleFormPanel.valueChanges.subscribe(value => {
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
  preLoadData(rec: UserRoles|null):void{
    this.writeValue(rec);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  /// Start Preparing Entered Data Model
  get value(): UserRoles {
    const details: UserRoles = {

      roleName: this.roleFormPanel.controls.roleName.value,
      roleTitle: this.roleFormPanel.controls.roleTitle.value,
      userRoleId: this.roleFormPanel.controls.value
    }
    return details;
  }

  set value(value: UserRoles) {
    setTimeout(() => {
      this.roleFormPanel.patchValue({
        roleName: value.roleName,
        roleTitle: value.roleTitle,
        userRoleId:value.userRoleId
        
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
      this.roleFormPanel.reset();
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
    if(this.roleFormPanel.valid){
      let record :UserRoles= this.roleFormPanel.value;
      if(record.userRoleId== null){
        record.userRoleId = 0;
      }
      this.userRoleSrv.saveRecord(record).subscribe((res)=>{
        if(res.code == 200){

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record saved successfully', life:1500 });
          this.notifyParent.emit("save");
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Role name must be unique', life:1500 });
        }
      },error=>{
        console.error(error);
      })
    }
  }
  onCancel(){
    this.notifyParent.emit("cancel");
  }

}
