import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { DivisionService } from '../division-department/services/division.services';
import { DepartmentService } from '../division-department/services/department.services';
import { TermsService } from '../terms/services/terms.service';
import { DatePipe } from '@angular/common';
import { RmTransService } from './services/rmtrans.service';
import { forkJoin } from 'rxjs';
import { SubDepartmentService } from '../division-department/services/subDepartment.services';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-allocate-div-dep-room',
  templateUrl: './allocate-div-dep-room.component.html',
  styleUrls: ['./allocate-div-dep-room.component.scss'],
  providers: [MessageService]
})
export class AllocateDivDepRoomComponent {
  filterPanel!: UntypedFormGroup;
  divisionfilterPanel!:UntypedFormGroup;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumTerm :any[]=[];
  subDepartmentData:any[]=[];
  allRoomData:any[]=[];
  selectedDepartmentId:number|null=null;
  selectedDivisionId:number|null=null;
  selectedSubDepartmentId: number|null=null;
  selectedSubDepartmentCode:string='';
  selectedDepartmentCode:string='';
  selectedDivisionCode:string='';
  showTerms:boolean = false;
  showRoomDetailsTable: boolean = false;
  selectedScreens:any[]=[];
  enumDivision:any[]=[];
  displaySpaceError:boolean = false;
  selectedTerm:any;
  enumTemporaryValue!:number;
  allRmTransData :any[]=[];
  displayRoomDetails:boolean = false;
  displayRoomData:any[]=[];
  assignRoomSelectedScreens:any[]=[];
  requiredValue!:any;
  roomnospaceerror:boolean = false;
  displayspaceerrormsg:string='';
  roomSelectionMessage:string='';
  useTabletProtrait = false;
  paginationObjDept:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["subDepId"],
    sortOrder:"ASC"
  }
  totalElementsDept:number = 0;
  isFilteredDept:boolean = false;
  filterCriteriaListDept :any[]=[];
  isSortedDept : boolean = false;
  paginationObjRm:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["rmId"],
    sortOrder:"ASC"
  }
  totalElementsRm:number = 0;
  isFilteredRm:boolean = false;
  filterCriteriaListRm :any[]=[];
  isSortedRm : boolean = false;
  firstIndexRmPaginator:number = 0;
  constructor(
    private blServ: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumservice: EnumService,
    private divisionservice : DivisionService,
    private termservice : TermsService,
    private datePipe:DatePipe,
    private rmtransservice:RmTransService,
    private subDepService: SubDepartmentService,
    private bps : BreakpointService
  ) { 
    this.filterPanel = this.formBuilder.group({
      term: [null, [Validators.required]],
      dateFrom: [null],
      dateTo:[null],
    });
    this.divisionfilterPanel = this.formBuilder.group({
      divId: [null],
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadAllDivisions();
    this.loadAllSubDepartments();
    this.loadEnumTempValue();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if(this.useTabletProtrait){
      this.rowCount = UtilConstant.ROW_COUNT_TEN_LIMIT;
    }else{
      this.rowCount = UtilConstant.ROW_COUNT;
    }
  }

  loadAllDivisions(){
    this.divisionservice.getAllDivisions().subscribe((res:any)=>{
      this.enumDivision = res;
      this.enumDivision.unshift({divId:null,divCode:'Make a selection'})
    });
  }
  

  loadAllSubDepartments(){
    let data = {divId:this.divisionfilterPanel.controls.divId.value,filterDto:{paginationDTO:this.paginationObjDept,filterCriteria:this.filterCriteriaListDept}};
    this.isFilteredDept = false;
    this.subDepService.getAllSubDepartmentsPaginated(data).subscribe((res:any)=>{
      if(res){
        this.isFilteredDept = false;
        this.subDepartmentData =  res.content ? res.content : [];
        this.totalElementsDept = res.totalElements ? res.totalElements : 0;
      }
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

  onSearch(){
    this.requiredValue="";
    this.selectedScreens=[];
    this.allRoomData=[];
    this.showRoomDetailsTable = false;
    this.displayRoomDetails= false;
    this.roomSelectionMessage= `Select Rooms to be allocated for ${this.selectedDivisionCode} | ${this.selectedDepartmentCode} | ${this.selectedSubDepartmentCode}`;
    this.firstIndexRmPaginator=0;
    this.paginationObjRm = {
      pageNo:0,
      pageSize:this.rowCount,
      sortBy:["rmId"],
      sortOrder:"ASC"
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

  ondepartmentrowselect(event:any){
    this.requiredValue="";
    this.selectedScreens=[];
    this.allRoomData=[];
    this.showRoomDetailsTable = false;
    this.displayRoomDetails= false;
    this.showTerms = false;
    this.selectedDepartmentId = null;
    this.selectedDivisionId = null;
    this.selectedDepartmentCode = "";
    this.selectedDivisionCode = "";
    this.selectedSubDepartmentCode = "";
    this.selectedSubDepartmentId = null;
    this.loadAllTerms();
    this.showTerms = true;
    this.selectedDepartmentId = event.data.depId;
    this.selectedDivisionId = event.data.divId;
    this.selectedDivisionCode = event.data.divisionDivCode ;
    this.selectedDepartmentCode = event.data.departmentDepCode ;
    this.selectedSubDepartmentId = event.data.subDepId;
    this.selectedSubDepartmentCode = event.data.subDepCode;
    this.firstIndexRmPaginator = 0;
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

  formatDate(date: any) {
    if (date != null) {
      var d = new Date(date);
      return d;
    } else {
      return null;
    }
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
     key: "divdeptsvgGrid"
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
          emId:null,
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
        this.messageService.add({ key: 'divdeptsvgMsg', severity: 'success', summary: 'Record updated', detail: 'Room updated successfully' });
        this.onSearch();
      }, (error: any) => {
        console.error('Failed to save records:', error);
      });
    }else{
    }
  }

  getAllRmTrans(){
    this.allRmTransData=[];
    this.rmtransservice.getAllRmTrans().subscribe((res:any)=>{
      this.allRmTransData= res;
    })
  }

  getRmTransId(screen:any){
    let match = this.allRmTransData.find( elem => elem.blId==screen.blId && elem.flId==screen.flId && elem.rmId==screen.rmId &&
      elem.divId==this.selectedDivisionId && elem.depId==this.selectedDepartmentId && elem.subDepId==this.selectedSubDepartmentId && elem.dateFrom==this.datePipe.transform(this.filterPanel.controls.dateFrom.value, "yyyy-MM-dd")
      && elem.dateTo==this.datePipe.transform(this.filterPanel.controls.dateTo.value, "yyyy-MM-dd") && elem.emId==null && elem.termId==
      this.selectedTerm.termId);
    if(match){
      return {"id":match.rmTransId,"allocation":match.allocation};
    }else{
      return {"id":0,"allocation":0};
    }
   
  }

  onSelectDivision(event:any){
    this.paginationObjDept.pageNo=0;
    this.filterCriteriaListDept=[];
    this.loadAllSubDepartments();
  }
 

  checkRequirements(myList:any): boolean {
    for (const obj of myList) {
      if (obj.required > obj.available || obj.required<1) {
        return false;
      }
    }
    return true;
  }

  

  onCheck(event:any){
    event.data.required=0;
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

  closespaceerrorDialog(){
    this.displayspaceerrormsg='';
    this.displaySpaceError=false;
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

    onCancelRoomDetailsBox(){
      this.displayRoomDetails = false;
      this.assignRoomSelectedScreens=[];
      this.displayRoomData.forEach((room:any)=>{
        room.required=0;
      });
      this.requiredValue='';
    }

    onApplyRequiredValue(){
      let valid = this.checkApplyRequiredValue();
      if(valid){
        this.assignRoomSelectedScreens=[...this.displayRoomData];
        this.assignRoomSelectedScreens.forEach((screen:any)=>{
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
      if(room.available<=0){
        let selectedscreencopy = [...this.selectedScreens];
        this.selectedScreens = [];
        this.roomnospaceerror = true;
        let indexval = selectedscreencopy.findIndex((obj:any)=>{return obj.blId==room.blId&&obj.flId==room.flId&&obj.rmId==room.rmId});
        if(indexval != -1){
          selectedscreencopy.splice(indexval,1);
          this.selectedScreens=[...selectedscreencopy];
        }
      }
    }

    onPageChangeDept(event: any){
      const pageNo = event.first ? event.first / event.rows : 0;
      const pageSize = event.rows;
      this.paginationObjDept.pageNo = pageNo;
      this.paginationObjDept.pageSize = pageSize;
      this.loadAllSubDepartments();
    }

    onSortDept(event: any) {
      this.isSortedDept = true;
    }

    onDepartmentInnerFilter(event: any){
      this.isSortedDept = false;
      setTimeout(() => {
        if(this.isFilteredDept && !this.isSortedDept){
          this.isSortedDept = false;
          Object.keys(event.filters).forEach((field) => {
            const filterValue = event.filters[field][0].value;
            const matchMode = event.filters[field][0].matchMode;
            if (filterValue !== undefined ) {
              let filterCriteriaDept={};
              if(field=="divisionDivCode"){
                filterCriteriaDept = { fieldName: "division.divCode", value: filterValue, matchMode: matchMode };
              } else if(field=="departmentDepCode"){
                filterCriteriaDept = { fieldName: "department.depCode", value: filterValue, matchMode: matchMode };
              }else{
                filterCriteriaDept = { fieldName: field, value: filterValue, matchMode: matchMode };
              }
              this.updateFilterCriteriaListDept(filterCriteriaDept);
            }
          });
          this.paginationObjDept.pageNo = 0;
          this.loadAllSubDepartments();
        }
        this.isFilteredDept = true;
      }, 0);
    }

    updateFilterCriteriaListDept(filterCriteria:any){
      let index = this.filterCriteriaListDept.findIndex(item => item.fieldName === filterCriteria['fieldName']);
      if(filterCriteria['value']==null){
        if(index !==-1){
          this.filterCriteriaListDept.splice(index, 1);
        }
      }else {
        if (index !== -1) {
          this.filterCriteriaListDept[index] = filterCriteria;
        } else {
          this.filterCriteriaListDept.push(filterCriteria);
        }
      }
    }

    onPageChangeRm(event: any){
      const pageNo = event.first ? event.first / event.rows : 0;
      const pageSize = event.rows;
      this.paginationObjRm.pageNo = pageNo;
      this.paginationObjRm.pageSize = pageSize;
      this.firstIndexRmPaginator = event.first;
      this.selectedScreens =[];
      this.loadAllocationRoomData();
    }

    onSortRm(event:any){
      this.isSortedRm= true;
    }

    onRoomInnerFilter(event: any){
      this.isSortedRm=false;
      setTimeout(() => {
        if(this.isFilteredRm && !this.isSortedRm){
          this.isSortedRm=false;
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
              }else{
                filterCriteriaRm = { fieldName: field, value: filterValue, matchMode: matchMode };
              }
              this.updateFilterCriteriaListRm(filterCriteriaRm);
            }
          });
          this.paginationObjRm.pageNo = 0;
          this.selectedScreens =[];
          setTimeout(() => {
            this.loadAllocationRoomData();
          }, 100);
          
        }
        this.isFilteredRm = true;
      }, 0);
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
  
    ngOnDestroy() {
      this.bps.unregister(this);
    }
  

}
