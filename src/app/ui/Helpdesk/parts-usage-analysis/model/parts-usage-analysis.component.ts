import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PartsService } from '../../parts/services/parts.service';
import { PartsUsageanalysisService } from '../services/parts-usage-analysis.service';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { Router } from '@angular/router';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';
@Component({
  selector: 'app-parts-usage-analysis',
  templateUrl: './parts-usage-analysis.component.html',
  styleUrls: ['./parts-usage-analysis.component.scss'],
  providers: [MessageService]
})
export class PartsUsageAnalysisComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  partsData: any[] = [];
  requestsData: any[] = [];
  enumStauts: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  allEmployees: any[] = []
  enumEm: any[] = [];
  fullName: any;
  partsUsageanalysisData:any[]=[];
  enumStatusData: EnumList[] = [];
  req_array: any[] = [];
  enumStatusFilter: EnumList[] = [];
  isErr: boolean = false;
  errorMsg: string = '';
  isTableRecordLoading = false;
  isShow = false;
  showRequestsTypeList:any[] = [{label:"Preventive Maintenance",value:"ppm"},
  {label:"Facilities Helpdesk",value:"facilities"},
  {label:"All",value:"all"}]
  @Input()showType:string = "facilities";
  useTabletProtrait = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["requestPartId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  constructor(
    private partService: PartsService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private partsUsageanalysisService:PartsUsageanalysisService,
    private enumsrv: EnumService,
    private employeeService: EmployeeService, 
    private router: Router,  
    private bps : BreakpointService
  ) {
  this.filterPanel = this.formBuilder.group({
      partId: [null],
      dateFrom: [null],
      dateTo: [null],
      showType : [this.showType]
     });
   }

  ngOnInit(): void {
    this.bps.register(this);
    setTimeout(() => {
      this.filterPanel.patchValue({
        dateFrom: firstDay,
        dateTo: lastDay,
        showType: this.showType
      });
      this.loadRecords();
    });
    this.loadParts();
    this.loadAllEnums();
    this.loadAllEmployee();
   var date = new Date();
   var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
   var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //this.loadRecords();
}

notify(): void {
  this.useTabletProtrait = BreakpointService.useTabletProtrait;
}

loadRecords() {
  const filterData = this.getFilterData();
  this.getRequestByPartCode(filterData);
}

getFilterData(){
  var fromDate = this.filterPanel.controls.dateFrom.value;
  var toDate = this.filterPanel.controls.dateTo.value;
  var   partId= this.filterPanel.controls.partId.value;
 
  var filterData = {
  
    "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
    "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
    "partId": partId,
    "showRequestType": this.filterPanel.controls.showType.value
  
  };
  return filterData;
}

 loadParts() {
    this.partService.getAllParts().subscribe((res: any) => {
      if (res) {
        this.partsData = [...res];
        this.partsData.unshift({partId:null,partCode:"Make a Selection"});
      } else {
        this.partsData = [];
      }
    })
  }

  getRequestByPartCode(filter:any) {
    this.loading = true
    let data={...filter,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteria}};
    this.partsUsageanalysisService.getRequestByPartCode(data).subscribe((res:any) => {
      this.loading = false;
      if(res){
        this.isFiltered= false;
        this.totalElements = res.totalElements ? res.totalElements : 0;
        this.partsUsageanalysisData = res.content.map((each: any) => {
          return {
            ...each,
            formateDatedAssigned: this.datePipe.transform(each.dateAssigned, 'dd MMM yyyy')
          }
        })
      }
    }, error => {
      this.loading = false
      this.partsUsageanalysisData=[];
    });
  }

  onSearch()
  {
    const filterData = this.getFilterData();
    this.getRequestByPartCode(filterData);
  }

  loadAllEnums() {
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        if (res) {
          this.enumList = res;
          this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
          // this.enumStauts = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
          this.enumStatusData = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
          this.enumStatusFilter = [...this.enumStatusData];
          this.enumStatusFilter.unshift(new EnumList(null, "", "", 'Make a selection',null));
        }
      })
  }
  
  getEnumByEnumId(enumKey: any) {
    return this.enumStatusData.find((t: any) => t.enumKey === enumKey)?.enumValue
  }
  
  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emCode;
        } else {
          return em.firstName + ' - ' + em.emCode;
        }
      })
    }
    return this.fullName[0];
  }
  loadAllEmployee() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
      }
      else {
        this.allEmployees = [];
      }
    })
  }

  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.filterPanel.controls['dateFrom'].setErrors(null);
        this.filterPanel.controls['dateTo'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();

        var dateFrom = new Date(this.filterPanel.controls['dateFrom'].value);
        var dateTo = new Date(this.filterPanel.controls['dateTo'].value);

        if (dateFrom.getTime() >= dateTo.getTime() && this.filterPanel.controls['dateTo'].value != null) {
          this.isErr = true;
          this.filterPanel.controls['dateFrom'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.errorMsg = 'Date created to should be greater than date created from.'
          return { 'incorrect': true };
        } else {
          this.isErr = false
          return null;
        }
      }
      return null;
    };
  }

  onClick(partId: any) {
    var fromDate = this.filterPanel.controls.dateFrom.value;
    var toDate = this.filterPanel.controls.dateTo.value;
    var   partId= this.filterPanel.controls.partId.value;
  
    var filterData = {
      "compId":1,
      "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
     "partId":partId
    };
    this.onRowClick(filterData);
  }
  onRowClick(event: any) {
    this.isShow = this.isTableRecordLoading = true;
    let postData = {
      ...event
    }
  this.getRequestByPartCode(postData);
  }
  exportExcel() {
    if (this.partsUsageanalysisData.length === 0) {
      var excelHeaders: string[] = [ "Part Code","Date Assigned","Estimated Quantity","Quantity Used","Request Code"];
      let options: XLSX.JSON2SheetOpts = { header: excelHeaders };
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], options); // Provide empty data array
  
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "partsUsageanalysisReports");
    } else {
      this.getDestructuredData(() => {
        let options: XLSX.JSON2SheetOpts = { header: excelHeaders };
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.req_array);
  
        worksheet['!cols'] = [
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 }
        ];
  
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "partsUsageanalysisDataReports");
      });
    }
  }
  getDestructuredData(callback: () => void) {
    if (!this.partsUsageanalysisData || this.partsUsageanalysisData.length === 0) {
      this.req_array = [];
      callback();
      return;
    }
  
    this.req_array = this.partsUsageanalysisData.map((item: any) => ({
     
              "Part Code": item['partPartCode'],
              "Date Assigned": this.datePipe.transform(item['dateAssigned'],"dd MMM yyyy"),
              "Estimated Quantity":item['reqQuantity'],
              "Quantity Used": item['actualQuantityUsed'],
              "Request Code": item['requestId'],
             }));
  
    callback();
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  onClickView(data : any){
    const wrId = data.requestId;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details",  viewDetails:true, isNavigationFromReport : true} })
      );
    window.open(url, '_blank');
  }

  onClear(){
    this.filterPanel.patchValue({
      wrId: null,
      dateFrom : null,
      dateTo : null ,
      showType: this.showType
    });
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          if(field=="partPartCode"){
            this.filterCriteria = { fieldName: "part_code", value: filterValue, matchMode: matchMode };
          }else if(field=="formateDatedAssigned"){
            this.filterCriteria = { fieldName: "dateAssigned", value: filterValue, matchMode: matchMode };
          }else if(field=="requestId"){
            this.filterCriteria = { fieldName: "request_id", value: filterValue, matchMode: matchMode };
          }
          else{
            this.filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords();
    }
    this.isFiltered = true;
  }
}
