import { ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { TermsService } from '../terms/services/terms.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { RmTransService } from '../allocate-div-dep-room/services/rmtrans.service';
import { BuildingService } from '../background-loc/services/bl.service';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../employee/services/employee.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-allocate-emp-room',
  templateUrl: './allocate-emp-room.component.html',
  styleUrls: ['./allocate-emp-room.component.scss'],
  providers: [MessageService]
})
export class AllocateEmpRoomComponent {
  showTerms:boolean=false;
  filterPanel!: UntypedFormGroup;
  emfilterPanel!: UntypedFormGroup;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumTerm :any[]=[];
  allRoomData:any[]=[];
  selectedDepartmentId:number|null=null;
  selectedDivisionId:number|null=null;
  selectedDepartmentCode:string='';
  selectedDivisionCode:string='';
  selectedSubDepartmentId: number|null=null;
  selectedSubDepartmentCode:string='';
  selectedScreens:any[]=[];
  showRoomDetailsTable: boolean = false;
  allRmTransData :any[]=[];
  selectedTerm:any;
  enumTemporaryValue!:number;
  displaySpaceError:boolean = false;
  displaydepterror:boolean = false;
  emData:any[]=[];
  allemData:any[]=[];
  enumEm:any[]=[];
  selectedEmId:string='';
  displayRoomDetails:boolean = false;
  displayRoomData:any[]=[];
  assignRoomSelectedScreens:any[]=[];
  requiredValue!:any;
  roomnospaceerror:boolean = false;
  displayspaceerrormsg:string='';
  roomSelectionMessage:string='';
  selectedEmName:string='';
  useTabletProtrait = false;
  selectedEmCode = '';
  paginationObjEm:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["emId"],
    sortOrder:"ASC"
  }
  totalElementsEm:number = 0;
  filterCriteriaListEm :any[]=[];
  isFilteredEm:boolean = false;
  paginationObjRm:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["rmId"],
    sortOrder:"ASC"
  }
  totalElementsRm:number = 0;
  filterCriteriaListRm :any[]=[];
  isFilteredRm:boolean = false;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;

  constructor(
    private messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private termservice : TermsService,
    private blServ: BuildingService,
    private authSrv: AuthService,
    private datePipe:DatePipe,
    private rmtransservice:RmTransService,
    private enumservice: EnumService,
    private confirmationService: ConfirmationService,
    private empServ: EmployeeService,
    private bps : BreakpointService
  ) {
    this.emfilterPanel = this.formBuilder.group({
      emId:[null]
    })
    this.filterPanel = this.formBuilder.group({
      term: [null, [Validators.required]],
      dateFrom: [null],
      dateTo:[null],
    });
   }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadEnumTempValue();
    // this.loadAllEmpoloyees();
    this.loadEmployeesPaginated();
    // this.scrollToEndEm();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }


  onEmRowSelect(event:any){
    this.requiredValue="";
    this.selectedScreens=[];
    this.allRoomData=[];
    this.showRoomDetailsTable = false;
    this.displayRoomDetails= false;
    this.showTerms = false;
    this.selectedDivisionCode = "";
    this.selectedDepartmentCode = "";
    this.selectedSubDepartmentCode = "";
    this.selectedDivisionId = null;
    this.selectedDepartmentId = null;
    this.selectedSubDepartmentId = null;
    this.selectedEmId = "";
    this.selectedEmName = "";
    this.selectedEmCode = '';
    if((event.data.divId!=null&&event.data.divId!='')&&(event.data.depId!=null&&event.data.depId!='')&&(event.data.subDepId!=null&&event.data.subDepId!='')){
      this.displaydepterror= false;
      this.loadAllTerms();
      this.selectedDivisionId = event.data.divId;
      this.selectedDepartmentId = event.data.depId;
      this.selectedSubDepartmentId = event.data.subDepId;
      this.selectedDivisionCode = event.data.divisionDivCode;
      this.selectedDepartmentCode = event.data.departmentDepCode;
      this.selectedSubDepartmentCode = event.data.subDepartmentSubDepCode;
      this.selectedEmId = event.data.emId;
      this.selectedEmName= event.data.fullName;
      this.selectedEmCode = event.data.emCode;
      this.showTerms = true;
    }else{
      this.displaydepterror= true;
    }
    
  }

  onSelectEmployee(event:any){
    this.loadEmployeesPaginated();
  }

  loadAllTerms(){
    this.enumTerm=[];
    this.filterPanel.patchValue({
      term:null,
      dateFrom: null,
      dateTo: null,
    })
    this.termservice.getAllTerms().subscribe((res:any)=>{
      this.enumTerm = res;
    })
  }

  loadEnumTempValue(){
    this.enumservice.getEnums().subscribe((res:any)=>{
      let rmtranstypeEnumList = res.filter((t:any) => 
      t.tableName.toLocaleUpperCase() === 'rm_trans'.toLocaleUpperCase() &&
      t.fieldName.toLocaleUpperCase() === 'type'.toLocaleUpperCase() && 
      t.enumValue.toLocaleUpperCase()==='Temporary'.toLocaleUpperCase());
      this.enumTemporaryValue = rmtranstypeEnumList[0].enumKey;
    })
    }

    loadAllEmpoloyees(){
      this.empServ.getAllEmployeeList().subscribe((res:any)=>{
        this.enumEm = res.map((each:any)=>{
          each.fullName = each.firstName + " " + each.lastName;
          each.displayName = each.emCode + ' - ' + each.fullName
          return each;
        });
      })
    }

    loadEmployeesPaginated(){
    let data ={emId:this.emfilterPanel.controls.emId.value,filterDto:{paginationDTO:this.paginationObjEm,filterCriteria:this.filterCriteriaListEm}};
    this.isFilteredEm = false;
    this.empServ.getAllEmployeeListPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFilteredEm = false;
        let content =  res.content ? res.content : [];
        this.totalElementsEm = res.totalElements ? res.totalElements : 0;
        this.emData =content.map((each:any)=>{each.fullName = each.firstName + " " + each.lastName;return each; });
      }
    });
    }

  onSelectTerm(event:any){
    this.allRmTransData=[];
    this.filterPanel.patchValue({
      dateFrom: this.formatDate(event.dateFrom),
      dateTo: this.formatDate(event.dateTo),
    })
    this.selectedTerm=event;
    this.getAllRmTrans();
  }

  getAllRmTrans(){
    this.allRmTransData=[];
    this.rmtransservice.getAllRmTrans().subscribe((res:any)=>{
      this.allRmTransData= res;
    })
  }

  onSearch(){
    this.requiredValue="";
    this.selectedScreens=[];
    this.allRoomData=[];
    this.showRoomDetailsTable = false;
    this.displayRoomDetails= false;
    if(this.selectedEmName!='' && this.selectedEmId!=''){
      this.roomSelectionMessage=`Select Rooms to be allocated for ${this.selectedEmCode} | ${this.selectedEmName}`;
    }else if (this.selectedEmName=='' && this.selectedEmId!=''){
      this.roomSelectionMessage=`Select Rooms to be allocated for ${this.selectedEmCode}`;
    }
    this.loadAllocationRoomData();
    this.getAllRmTrans();
  }

  loadAllocationRoomData(){
    let dateFrom = this.datePipe.transform(this.filterPanel.controls.dateFrom.value, "yyyy-MM-dd");
    let dateTo = this.datePipe.transform(this.filterPanel.controls.dateTo.value, "yyyy-MM-dd");
    let data ={
      dateFrom:dateFrom,
      dateTo:dateTo,
      divId:this.selectedDivisionId,
      depId:this.selectedDepartmentId,
      subDepId:this.selectedSubDepartmentId,
      filterDto:{paginationDTO:this.paginationObjRm,filterCriteria:this.filterCriteriaListRm}
    }
    this.isFilteredRm = false;
    this.blServ.getdepartmentallocation(data).subscribe((res:any)=>{
      if(res){
        this.isFilteredRm = false;
        this.allRoomData =  res.content ? res.content : [];
        this.totalElementsRm = res.totalElements ? res.totalElements : 0;
        this.allRoomData = this.allRoomData.map( (each:any) => {
        return {...each,"required":0}
      });
      this.showRoomDetailsTable=true;
      }
    })
  }

  formatDate(date: any) {
    if (date != null) {
      var d = new Date(date);
      return d;
    } else {
      return null;
    }
    
  }

  checkDates(control: any){
    if (control !== undefined && control != null) {
      this.filterPanel.controls['dateTo'].setErrors(null);
      this.filterPanel.clearAsyncValidators();
      this.filterPanel.updateValueAndValidity();
      let dateFrom = this.formatDate(this.filterPanel.controls.dateFrom.value);
      let dateTo = this.formatDate(this.filterPanel.controls.dateTo.value);
      if(dateFrom!= null && dateTo!=null && dateTo<=dateFrom){
        this.filterPanel.controls['dateTo'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          return { 'incorrect': true };
      }else {
        return null;
      }
      }
      return null;
    }

    assignConfirm() {
      this.displayRoomData=[];
      this.displayRoomData = [...this.selectedScreens];
      this.displayRoomDetails = true;
      this.assignRoomSelectedScreens=[...this.displayRoomData];
    }

    saveConfirm(){
       this.confirmationService.confirm({
        message: "Are you sure you want to allocate the selected rooms",
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onAssign();
        },
        key: "emrmGrid"
      });
    }

    onAssign(){
      let check = this.checkRequirements(this.assignRoomSelectedScreens);
      if(check){
        this.messageService.clear();
        const saveRequests:any[] = [];
        this.assignRoomSelectedScreens.forEach((screen:any)=>{
          let rmtrans = this.getRmTransId(screen);
          let tid = rmtrans.id;
          let obj ={
            rmTransId:tid,
            blId:screen.blId,
            flId:screen.flId,
            rmId:screen.rmId,
            divId:this.selectedDivisionId,
            depId:this.selectedDepartmentId,
            subDepId:this.selectedSubDepartmentId,
            emId:this.selectedEmId,
            termId:this.selectedTerm.termId,
            type:this.enumTemporaryValue,
            dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value, "yyyy-MM-dd"),
            dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value, "yyyy-MM-dd"),
            allocation:tid==0?screen.required:screen.required+rmtrans.allocation
          }
          saveRequests.push(this.rmtransservice.saveRmTrans(obj));
        });
        forkJoin(saveRequests)
        .subscribe((res: any[]) => {
          this.displayRoomDetails= false;
          this.messageService.add({ key: 'emprmMsg', severity: 'success', summary: 'Record updated', detail: 'Room updated successfully' });
          this.onSearch();
        }, (error: any) => {
          console.error('Failed to save records:', error);
        });
      }else{
      }
    }

    getRmTransId(screen:any){
      let match = this.allRmTransData.find( elem => elem.blId==screen.blId&&elem.flId==screen.flId&&elem.rmId==screen.rmId&&
        elem.divId==this.selectedDivisionId&&elem.depId==this.selectedDepartmentId&& elem.subDepId==this.selectedSubDepartmentId && elem.dateFrom==this.datePipe.transform(this.filterPanel.controls.dateFrom.value, "yyyy-MM-dd")
        &&elem.dateTo==this.datePipe.transform(this.filterPanel.controls.dateTo.value, "yyyy-MM-dd") && elem.emId==this.selectedEmId
        &&elem.termId==this.selectedTerm.termId);
      if(match){
        return {"id":match.rmTransId,"allocation":match.allocation};
      }else{
        return {"id":0,"allocation":0};
      }
     
    }

    checkRequirements(myList:any): boolean {
      for (const obj of myList) {
        if (obj.required > obj.available || obj.required<1) {
          return false;
        }
      }
      return true;
    }

    onRequiredEntry(room:any){
      if(!(room.required<=room.available && room.required>0)){
        if(room.required>room.available){
          this.displayspaceerrormsg=`The selected room "${room.blCode} ${room.flCode} ${room.rmCode}" requested space should not exceed the available space.`;
        }else if (room.required==0){
          this.displayspaceerrormsg="The required space must be greater than zero."
        }
        this.displaySpaceError = true;
        room.required =0;
      }
    }

    onCheck(event:any){
      event.data.required=0;
      // event.data.isSelected=!event.data.isSelected;
    }

    closespaceerrorDialog(){
      this.displayspaceerrormsg='';
      this.displaySpaceError=false;
    }

    closedepterrorDialog(){
      this.displaydepterror=false;
    }

    onCancelRoomDetailsBox(){
      this.displayRoomDetails = false;
      this.assignRoomSelectedScreens=[];
      this.displayRoomData.forEach((room:any)=>{
        room.required=0;
        // room.isSelected=false;
      });
      this.requiredValue='';
    }

    onApplyRequiredValue(){
      let valid = this.checkApplyRequiredValue();
      if(valid){
        this.assignRoomSelectedScreens=[...this.displayRoomData];
        this.assignRoomSelectedScreens.forEach((screen:any)=>{
          // screen.isSelected= true;
          screen.required = this.requiredValue;
        })
      }
    }

    checkApplyRequiredValue(){
      this.displayspaceerrormsg='';
      let check = true;
      var errorrooms='';
      let count =0;
      for(let room of this.displayRoomData){
        if(this.requiredValue>room.available){
          count ++;
          if(count ==1){
            errorrooms += `"${room.blCode} ${room.flCode} ${room.rmCode}"`;
          }else{
            errorrooms += `,"${room.blCode} ${room.flCode} ${room.rmCode}"`;
          }
        }
      }
      for(let room of this.displayRoomData){
        if(this.requiredValue>room.available || this.requiredValue<1){
          if(this.requiredValue>room.available){
            this.displayspaceerrormsg="The selected room "+errorrooms+" requested space should not exceed the available space.";
           
          }else if(this.requiredValue<1){
            this.displayspaceerrormsg="The required space must be greater than zero.";
          }
          this.displaySpaceError= true;
          check = false;
          return check;
        }
      }
      return check;
    }

    checkRequiredValue(){
      if(typeof(this.requiredValue)=="number"){
        return true;
      }else{
        return false;
      }
    }

    closenospaceerrorDialog(){
      this.roomnospaceerror= false;
    }

    onCheckAvailable(room:any){
      this.roomnospaceerror= false;
      if(room.available==0){
        let selectedscreencopy = [...this.selectedScreens];
        this.selectedScreens = [];
        this.roomnospaceerror = true;
        // room.isSelected = false;
        let indexval = selectedscreencopy.findIndex((obj:any)=>{return obj.blId==room.blId&&obj.flId==room.flId&&obj.rmId==room.rmId});
        if(indexval != -1){
          selectedscreencopy.splice(indexval,1);
          this.selectedScreens=[...selectedscreencopy];
        }
      }
    }

    onEmployeeInnerFilter(event:any){
      if(this.isFilteredEm){
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let filterCriteriaEm = { fieldName: field, value: filterValue, matchMode: matchMode };
            this.updateFilterCriteriaListEm(filterCriteriaEm);
          }
        });
        this.paginationObjEm.pageSize = 0;
        this.loadEmployeesPaginated();
      }
      this.isFilteredEm = true;
    }

    updateFilterCriteriaListEm(filterCriteria:any){
      let index = this.filterCriteriaListEm.findIndex(item => item.fieldName === filterCriteria['fieldName']);
      if(filterCriteria['value']==null){
        if(index !==-1){
          this.filterCriteriaListEm.splice(index, 1);
        }
      }else {
        if (index !== -1) {
          this.filterCriteriaListEm[index] = filterCriteria;
        } else {
          this.filterCriteriaListEm.push(filterCriteria);
        }
      }
    }

    onPageChangeEmployee(event:any){
      const pageNo = event.first ? event.first / event.rows : 0;
      const pageSize = event.rows;
      this.paginationObjEm.pageNo = pageNo;
      this.paginationObjEm.pageSize = pageSize;
      this.loadEmployeesPaginated();
    }

    onRoomInnerFilter(event:any){
      if(this.isFilteredRm){
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let filterCriteriaRm ={};
            if(field=="blCode"){
              filterCriteriaRm = { fieldName: "bl_code", value: filterValue, matchMode: matchMode };
            }else if(field=="flCode"){
              filterCriteriaRm = { fieldName: "fl_code", value: filterValue, matchMode: matchMode };
            }else if(field=="rmCode"){
              filterCriteriaRm = { fieldName: "rm_code", value: filterValue, matchMode: matchMode };
            }
            this.updateFilterCriteriaListRm(filterCriteriaRm);
          }
        });
        this.paginationObjRm.pageNo=0
        this.selectedScreens =[];
        this.loadAllocationRoomData();
      }
      this.isFilteredRm = true;
    }

    updateFilterCriteriaListRm(filterCriteria:any){
      let index = this.filterCriteriaListRm.findIndex(item => item.fieldName === filterCriteria['fieldName']);
      if(filterCriteria['value']==null){
        if(index !==-1){
          this.filterCriteriaListRm.splice(index, 1);
        }
      }else {
        if (index !== -1) {
          this.filterCriteriaListRm[index] = filterCriteria;
        } else {
          this.filterCriteriaListRm.push(filterCriteria);
        }
      }
    }

    onPageChangeRoom(event:any){
      const pageNo = event.first ? event.first / event.rows : 0;
      const pageSize = event.rows;
      this.paginationObjRm.pageNo = pageNo;
      this.paginationObjRm.pageSize = pageSize;
      this.selectedScreens =[];
      this.loadAllocationRoomData();
    }

    ngOnDestroy() {
      this.bps.unregister(this);
    }

    scrollToEndEm() {
      this.offsetEm = this.limitEm;
      this.limitEm += this.scrollLimit;
      this.filterCriteria.limit = this.limitEm;
      this.filterCriteria.offset = this.offsetEm;
      this.empServ.getALLmployeeByScroll(this.filterCriteria).subscribe((res:any) => {
        this.enumEm = res;
        this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
      })
    }
  
    searchEm(event: any) {
      this.filterCriteria = {};
      this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
      this.scrollToEndEm();
    }
  
    updateEmList(emData:any) {
      this.enumEm = this.enumEm.filter(e => e.emId != emData.emId);
      this.enumEm = this.enumEm.filter(e => e.emId != null);
      this.enumEm.unshift(emData);
      this.enumEm.unshift({emId:null, firstName:'Make a selection',emCode:null});
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
