import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UsersService } from 'src/app/services/users.service';
import { UserModalDialogueProvider } from '../provider/user.provider';
import { UserFilterInput } from './usersFilterInput.model';
import { UtilConstant } from '../../../../common/UtilConstant';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

declare var $ : any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {

  userFilterPanel: UntypedFormGroup;
  confirmationResult: any;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[]=[];
  enumCC_stat: EnumList[] = [];
  enumUsers: UserFilterInput[]=[];
  enumUserRoles: any[]=[];
  GLACCList: EnumList[] = [];
  user_data: any[] = [];
  enumStatusList : any[]=[];
  enumStatus: EnumList[] = [];
  selectedUser!:UserFilterInput;
  value: any;
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  isUserList: boolean = true;
  rowCount: number = UtilConstant.ROW_COUNT;
  userStatus:EnumList[]=[];
  useTabletProtrait = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["userId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  filterData:UserFilterInput= {id:"",name:"",userRole:"",status:null};

  constructor(
    private fb: UntypedFormBuilder,
    private enumsrv: EnumService,
    private userSrv:UsersService,
    private authSrv:AuthService,
    private userModalDialogueProvider: UserModalDialogueProvider,
    private bps : BreakpointService
  ) { 
    this.userFilterPanel = this.fb.group({
      user_id: [""],
      userRole:[""],
      status:[""],
    });
  }

  ngOnInit() {
    this.bps.register(this);
    this.loadUsers();
    this.loadEnums();
    this.afterRefreshPanel();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  loadUsers(){
    this.userSrv.getALLUsers().subscribe((res:any)=>{
      this.enumUsers = res;
      this.enumUserRoles = res;
      this.enumUserRoles = this.enumUserRoles.map((i:any) => {i.userRole = i.userRole ; return i.userRole});
      this.enumUserRoles = this.enumUserRoles.filter((item, i, ar) => ar.indexOf(item) === i);
     
      this.enumUserRoles.unshift(new UserFilterInput('', '','Make a selection' ,null));
    });
  }
 
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'fm_users'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'user_status'.toLocaleUpperCase());
        this.userStatus  = this.enumStatus;
        this.enumStatusList = this.enumStatus.map((i:any) => { i.status =  i.enumValue; return i.enumValue; });
        this.enumStatusList.unshift("Make a Selection");
      },
      error => {
      }
    );
  }
  getNameIntials(firstName:string,lastName:string){
    return firstName.charAt(0) + lastName.charAt(0);
  }

  onClear() {
    for (var fieldId in this.userFilterPanel.controls) {
      this.userFilterPanel.controls[fieldId].setValue(null);
    }
    this.isUserList = true;
    this.user_data = [];
    this.userListPanelRefresh();
  }
  getIdByName(status:any,userStatus: any){
    return  status ? this.enumList.find(t => t.enumValue == status && t.fieldName == userStatus) != null ? this.enumList.find(t => t.enumValue == status && t.fieldName == userStatus)?.enumKey : '' : '';
  }
  onFilter(formData: UntypedFormGroup) {
    var code = formData.controls.user_id.value;
    var role = formData.controls.userRole.value;
    var status = formData.controls.status.value;
    status = this.getIdByName(status, "user_status");
    let postData = {
      id: code,
      name: "",
      userRole: role,
      status: status,
    }
    this.filterData = {...postData};
    this.loadRecords(postData);
  }
  loadRecords(data: UserFilterInput) {
    this.loading = true;
    this.isUserList = true;
    let finaldata ={...data,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList}};
    this.isFiltered= false;
    this.userSrv.getUserListPaginated(finaldata).subscribe((res: any) => {
      if (res) {
        this.isUserList = false;
        this.isFiltered= false;
        this.user_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.isUserList = true;
        this.user_data = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }
  getNameById(enumKey: any, fieldName: string) {
    return enumKey ? this.enumList.find(t => t.enumKey == enumKey && t.fieldName == fieldName) != null ? this.enumList.find(t => t.enumKey == enumKey && t.fieldName == fieldName)?.enumValue : '' : '';
  }

  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      user_name: 0,
      isEdit: true,
      newRecord:true,
      title:"Add"
    };
    this.userModalDialogueProvider.openDialog(dialogConfig);
    this.userModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.afterRefreshPanel();
        this.loadUsers();
      }
    });
  }
  openEditItem(userId:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      userId: userId,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.userModalDialogueProvider.openDialog(dialogConfig);
    this.userModalDialogueProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result == true){
        this.afterRefreshPanel();
      }
    });
  }
 
  afterRefreshPanel() {
    this.onClear();
    this.userListPanelRefresh();
  }
  userListPanelRefresh(){
    let postData = {
      id: "",
      name: "",
      userRole: "",
    }
    this.loadRecords(postData);
  }

  writeValue(value:any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
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
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.bps.unregister(this);
  }
  /// Start Of UI Related Non-Trivial Functionality ///
  clear(table:Table){
    table.clear()
  }
  onRowSelect(event:any){
    this.openEditItem(event.data.userName);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.filterData);
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined) {
          let filterCriteria ={};
          if(field == "userrolesRoleName"){
            filterCriteria = { fieldName: "userroles.roleName", value: filterValue, matchMode: matchMode };
          }else if(field == "employeeFirstName"){
            filterCriteria = { fieldName: "emEmployee.firstName", value: filterValue, matchMode: matchMode };
          }
          else {
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords(this.filterData);
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria:any){
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if(filterCriteria['value']==null){
      if(index !==-1){
        this.filterCriteriaList.splice(index, 1);
      }
    }else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }

}
