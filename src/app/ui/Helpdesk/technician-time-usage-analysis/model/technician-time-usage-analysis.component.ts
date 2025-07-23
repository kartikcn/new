import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilConstant } from 'src/common/UtilConstant';
import { CraftspersonService } from '../../craftsperson/services/craftsperson.service';
import { DatePipe } from '@angular/common';
import { TechnicianTimeUsageanalysisService } from '../services/technician-time-usage-analysis.services';
import { EnumService } from 'src/app/services/enum.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-technician-time-usage-analysis',
  templateUrl: './technician-time-usage-analysis.component.html',
  styleUrls: ['./technician-time-usage-analysis.component.scss']
})
export class TechnicianTimeUsageAnalysisComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  technicianData: any[] = [];
  technicanTimeUsageanalysisData:any[]=[];
  technicanData:any[]=[];
  enumWorkType: any[] = [];
  enumList: EnumList[] = [];
  req_array: any[] = [];
  enableDetailsBtn:boolean = false;
  enumTechRequLogData: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  isTableRecordLoading = false;
  isErr: boolean = false;
  errorMsg: string = '';
  isShow = false;
  totalActualHr:any[]=[];
  showDetails:boolean = false;
  showRequestsTypeList:any[] = [{label:"Preventive Maintenance",value:"ppm"},
  {label:"Facilities Helpdesk",value:"facilities"},
  {label:"All",value:"all"}]
  @Input()showType:string = "facilities";
  useTabletProtrait = false;
  constructor(
    private cfSrv: CraftspersonService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private enumsrv: EnumService,
    private technicianTimeUsageanalysisService:TechnicianTimeUsageanalysisService,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      technicianId: [null,[Validators.required]],
      dateFrom: [null],
      dateTo: [null],
      showType : [this.showType]
     });
   }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadTechinician();
    // this.loadRecords();
    this.loadEnums();
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setTimeout(() => {
     this.filterPanel.patchValue({
       dateFrom: firstDay,
       dateTo: lastDay,
       showType: this.showType
     });
 
   });
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }
  loadRecords() {
    const filterData = this.getFilterData();
    this.getRequestByTechnicianTime(filterData);
  }
  
  getFilterData(){
    var fromDate = this.filterPanel.controls.dateFrom.value;
    var toDate = this.filterPanel.controls.dateTo.value;
    var   technicianId= this.filterPanel.controls.technicianId.value;

    var filterData = {
    
      "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
      "technicianId": technicianId,
      "showRequestType": this.filterPanel.controls.showType.value
    
    };
    return filterData;
  }
  getRequestByTechnicianTime(filter:any) {
  
    this.loading = true
    this.technicianTimeUsageanalysisService.getRequestByTechnicianTime(filter).subscribe((res: any[]) => {
      this.loading = false;
     this.technicanTimeUsageanalysisData=res.map((each: any)=>{
      return {
        ...each,
        formatedScheduledDate : this.datePipe.transform(each.dateAssign, 'dd MMM yyyy')
      }
     })
    }, error => {
      this.loading = false
      this.technicanTimeUsageanalysisData=[];
    
    });
  }

  onSearch()
  {
    const filterData = this.getFilterData();
    this.getRequestByTechnicianTime(filterData);
  }
  loadTechinician() {
    this.cfSrv.getAllCraftsperson().subscribe((res: any) => {
      if (res) {
        this.technicianData = res;
      } else {
        this.technicianData = []
      }
    })
  }
  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumTechRequLogData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'request_technician_log'.toLocaleUpperCase());
        this.enumWorkType = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'request_technician_log'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'work_type'.toLocaleUpperCase());
      
      },
      error => {
      }
    );
  }
  getEnumById(enumKey: any) {
    return this.enumWorkType.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }
 onClick(technicianId:any)
  {
    var fromDate = this.filterPanel.controls.dateFrom.value;
    var toDate = this.filterPanel.controls.dateTo.value;
    var technicianId= this.filterPanel.controls.technicianId.value;
    var filterData = {
  
      "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
     "technicianId":technicianId
    };
    this.onRowClick(filterData);
  }
  onRowClick(event: any) {
    this.isShow = this.isTableRecordLoading = true;
    let postData = {
      ...event
    }
  this.getRequestByTechnicianTime(postData);
  }
  getWorkingHoursByTechnicianIdAndRequestId(requestId:any)
  {
    
    let filterdata= {
      requestId:requestId,
      technicianId:this.filterPanel.controls.technicianId.value
    }
    this.technicianTimeUsageanalysisService.getWorkingHoursByTechnicianIdAndRequestId(filterdata).subscribe((res:any) => {
      this.showDetails = true;

      this.technicanData=res;
    }, error => {
      this.loading = false
      this.technicanData=[];
    

     })
    }
    exportExcel() {
      if (this.technicanTimeUsageanalysisData.length === 0) {
        // Data is not present, only print the headings
        var excelHeaders: string[] = ["Technician Id",  "Technician Name", "Scheduled Date", "Scheduled Time", "Estimated Hours", "Work Type", "Actual Hours", "Request Code"];
        let options: XLSX.JSON2SheetOpts = { header: excelHeaders };
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], options); // Provide empty data array
    
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
        this.saveAsExcelFile(excelBuffer, "TechnicianTimeUsageAnalysisReports");
      } else {
        this.getDestructuredData(() => {
          var excelHeaders: string[] = ["Technician Id", "Technician Name", "Scheduled Date", "Scheduled Time", "Estimated Hours", "Work Type", "Actual Hours", "Request Code"];
          let options: XLSX.JSON2SheetOpts = { header: excelHeaders };
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.req_array);
    
          worksheet['!cols'] = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 }
          ];
    
          const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "TechnicianTimeUsageAnalysisReports");
        });
      }
    }
    getDestructuredData(callback: () => void) {
      if (!this.technicanTimeUsageanalysisData || this.technicanTimeUsageanalysisData.length === 0) {
        this.req_array = [];
        callback();
        return;
      }
    
      this.req_array = this.technicanTimeUsageanalysisData.map((item: any) => ({
        "Technician Id" : item.technicianId,
        "Technician Name" : this.getTechnicianName(item.technicianId),
        "Scheduled Date": this.datePipe.transform(item.dateAssign, "dd MMM yyyy"),
        "Scheduled Time": item.timeAssign,
        "Estimated Hours": item.hoursRequired,
        "Work Type": this.getEnumById(item.workType),
        "Actual Hours": item.actualHoursStd + item.actualHoursDouble + item.actualHoursOvertime,
        "Request Code": item.requestId
      }));
    
      callback();
    }
    saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

  getTechnicianName(id: any) {
    const data = this.technicianData.filter((each: any) => (each.cfId === id));
    return data[0].name;
  }

  onClear() {
    this.filterPanel.reset();
    setTimeout(() => {
     this.filterPanel.patchValue({
       showType: this.showType
     });
   });
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}