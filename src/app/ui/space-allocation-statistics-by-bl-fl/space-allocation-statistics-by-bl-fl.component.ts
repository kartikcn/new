import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { DepartmentService } from '../division-department/services/department.services';
import { DivisionService } from '../division-department/services/division.services';
import { ReportBarChartModel } from '../view-employee-report/model/report-bar-chart.model';
import html2canvas from 'html2canvas';
import { SubDepartmentService } from '../division-department/services/subDepartment.services';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';

class roomfilter{
  blId: null|number;
  flId:null|number;
  divId:null|number;
  depId:null|number;
  dateFrom:null|string;
  dateTo:null|string;
  viewBy:null|string;
  subDepId:null|number;
  constructor( blId: null|number,flId:null|number,divId:null|number,depId:null|number,dateFrom:null|string,
    dateTo:null|string,viewBy:null|string,subDepId:null|number) {
    this.blId = blId;
    this.flId = flId;
    this.divId = divId;
    this.depId = depId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.viewBy=viewBy;
    this.subDepId= subDepId;
}
}

@Component({
  selector: 'app-space-allocation-statistics-by-bl-fl',
  templateUrl: './space-allocation-statistics-by-bl-fl.component.html',
  styleUrls: ['./space-allocation-statistics-by-bl-fl.component.scss'],
  providers: [MessageService]
})

export class SpaceAllocationStatisticsByBlFlComponent {
  filterPanel!: UntypedFormGroup;
  rowCount: number = UtilConstant.ROW_COUNT;
  departmentData:any[]=[];
  alldepartmentData:any[]=[];
  enumAllSubDepartment: any[] = [];
  enumSubDepartment: any[] = [];
  enumDivision:any[]=[];
  enumBL: any[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  showGrid:boolean = false;
  showGridLines:boolean = false;
  showAllocatedPopup:boolean = false;
  showAllRoomsPopup:boolean = false;
  gridblfldata:any[]=[];
  chartblfldata:any[]=[];
  firstParamName:string='';
  secondParamName:string='';
  showSecondParam:boolean =false;
  roomData:any[]=[];
  allroomData:any[]=[];
  filter = new roomfilter(null,null,null,null,null,null,null,null);
  viewByData: any[] = [
    {
      "id": 0,
      "lable": 'Building',
      "value": "bl_id"
    },
    {
      "id": 1,
      "lable": 'Floor',
      "value": "fl_id"
    }
  ];

  displayTypeData: any = [
    {
      "id": 0,
      "lable": 'Grid',
      "value": "grid"
    },
    {
      "id": 1,
      "lable": 'Bar Chart',
      "value": "bar_chart"
    }
  ]
  monthStart = new Date((new Date()).getFullYear(),(new Date()).getMonth(), 1);
  monthEnd = new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  view: any[] = [1000, 495];
  showXAxis:boolean = true;
  showXAxisLabel:boolean = true;
  xAxisLabel:string= '';
  barchartData : ReportBarChartModel[]=[];
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showYAxisLabel = true;
  yAxisLabel = 'Area (sq.ft)';
  showbarchart :boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#C7B42C']
  };
  chartImg: any[] = [];
  enumCommonAreaNoneType!:number;
  grid_array :any[]=[];
  legendItems:any[]=[
    {name:"Total Area", color:"#5AA454"},
    {name:"Allocated Area", color:"#C7B42C"}
  ];
  @Input() isDashboardUse: boolean = false;
  @Input() dashboardDateRange:any;
  useTabletProtrait = false;
  useTabletLandscape = false;
  paginationObjRm:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["rmId"],
    sortOrder:"ASC"
  }
  totalElementsRm:number = 0;
  filterCriteriaListRm :any[]=[];
  isFilteredRm:boolean = false;
  limitBl:number = 0;
  offsetBl:number = 0;
  limitFl:number = 0;
  offsetFl:number = 0;
  filterCriteria:any = {
    fieldName: null, value: null, matchMode: "contains",limit:0,offset:0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private blServ: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private divisionservice : DivisionService,
    private departmentservice : DepartmentService,
    private datePipe:DatePipe,
    private enumsrv: EnumService,
    private bookingSrv: BookingService,
    private messageService: MessageService,
    private subDeptService: SubDepartmentService,
    private bps : BreakpointService
  ) { 
    this.filterPanel = this.formBuilder.group({
      divId:[null],
      depId: [null],
      dateFrom: [null,[Validators.required]],
      dateTo:[null,[Validators.required]],
      blId: [null],
      flId:[null],
      viewBy: [null,[Validators.required]],
      displayType: [null],
      subDepId: [null]
    });
   
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadAllDivisions();
    this.loadAllDepartments();
    this.loadSubDepartment();
    this.loadCommonAreaEnums();
   this.filterPanel.patchValue({
      displayType:this.displayTypeData[0].value,
      dateFrom:this.monthStart,
      dateTo: this.monthEnd
   })
   this.checkIsDashboardUse();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
  }

  loadAllDivisions(){
    this.enumDivision=[];
    this.divisionservice.getAllDivisions().subscribe((res:any)=>{
      this.enumDivision= res;
      this.enumDivision.unshift({divId:null,divCode:'Make a selection'})
    })
  }

  loadAllDepartments(){
    this.alldepartmentData=[];
    this.departmentservice.getAllDepartments().subscribe((res:any)=>{
      this.alldepartmentData = res;
      this.alldepartmentData.unshift({depId:null,depCode:'Make a selection',divId:null});
      this.departmentData=[...this.alldepartmentData];
     
    })
  }

  loadSubDepartment() {
    this.enumAllSubDepartment = [];
    this.subDeptService.getAllSubDepartments().subscribe((res: any) => {
      if (res) {
        this.enumAllSubDepartment = res;
        this.enumAllSubDepartment.unshift({ subDepCode: 'Make a Selection', depId: null, divId: null, subDepId: null });
        this.enumSubDepartment = [...this.enumAllSubDepartment];
      }
    })
  }


  onSelectDivision(event:any){
    if (event.divId != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          depId: null,
          subDepId: null
        });
        this.loadDepartmentCode(event.divId);
        this.loadSubDepartmentCode(event.divId,null);
      }, 10);

    }
    else {
      this.departmentData = [...this.alldepartmentData];
    }
  }

  loadDepartmentCode(divId:any){
    if (divId != null) {
      this.departmentData=[];
      this.departmentData = this.alldepartmentData.filter(t => t.divId == divId);
      this.departmentData.unshift({depId:null,depCode:'Make a selection',divId:null});
    }else{
      this.departmentData=[];
      this.departmentData = [...this.alldepartmentData];
    }
  }

  loadSubDepartmentCode(divId: any, depId: any) {
    this.enumSubDepartment = [];
    if (divId != null) {
      this.enumSubDepartment = this.enumAllSubDepartment.filter(t => t.divId == divId);
    }
    if (depId != null) {
      this.enumSubDepartment = this.enumSubDepartment.filter(t => t.depId == depId);
    }
    this.enumSubDepartment.unshift({ subDepCode: 'Make a Selection', depId: null, divId: null, subDepId: null });
  }

  onSelectDepartment(event:any){
    if(event.depId!=null){
      this.filterPanel.patchValue({
        divId:event.divId
      });
      this.loadSubDepartmentCode(event.divId, event.depId);
    }else{
      this.filterPanel.patchValue({
        divId:null
      })
      this.enumSubDepartment = [...this.enumAllSubDepartment];
    }
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
     this.selectedBl = {};
     this.selectedFl = {};
    }
  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      const blData:any = {
        blId:event.blId,
        blNameString:event.blNameString,
        site:null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {
     
    }
  }

  loadCommonAreaEnums(){
    this.enumsrv.getEnums().subscribe((res:any)=>{
      let resultCommonArea = res.filter((t:any) =>
        t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase()
        && t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase()
         && t.enumValue.toLocaleUpperCase() == 'None'.toLocaleUpperCase());
        this.enumCommonAreaNoneType = resultCommonArea[0].enumKey
    })
  }

  checkDates(control: any){
    if (control !== undefined && control != null) {
      this.filterPanel.controls['dateTo'].setErrors(null);
      this.filterPanel.clearAsyncValidators();
      this.filterPanel.updateValueAndValidity();
      let dateFrom = this.formatDate(this.filterPanel.controls.dateFrom.value);
      let dateTo = this.formatDate(this.filterPanel.controls.dateTo.value);
      if(dateFrom!= null && dateTo!=null ){
        if(dateTo<=dateFrom){
          this.filterPanel.controls['dateTo'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          return { 'incorrect': true };
        }else{
          return null;
        }
      }
      else {
        this.filterPanel.controls['dateTo'].setErrors({ 'isnull': true });
        this.filterPanel.updateValueAndValidity();
        return null;
      }
      }
      return null;
    }

    formatDate(date: any) {
      if (date != null) {
        var d = new Date(date);
        return d;
      } else {
        return null;
      }
    }

    onSearch(){
      this.gridblfldata =[];
      this.chartblfldata=[];
      this.showGrid = false;
      this.showbarchart = false;
      this.firstParamName='';
      this.showSecondParam = false;
      this.secondParamName='';
      let blId =this.filterPanel.controls.blId.value;
      let flId=this.filterPanel.controls.flId.value;
      let divId=this.filterPanel.controls.divId.value;
      let depId=this.filterPanel.controls.depId.value;
      let viewBy=this.filterPanel.controls.viewBy.value;
      let displayType = this.filterPanel.controls.displayType.value;
      let subDepId = this.filterPanel.controls.subDepId.value;
      this.filter.blId=blId!=null?blId:null;
      this.filter.flId=flId!=null?flId:null;
      this.filter.divId=divId!=null?divId:null;
      this.filter.depId=depId!=null?depId:null;
      this.filter.viewBy=viewBy;
      this.filter.subDepId=subDepId!=null?subDepId:null;
      this.filter.dateFrom = this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd");
      this.filter.dateTo= this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd");
      let data={
        dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
        dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
        blId:blId,
        flId:flId,
        divId:divId,
        depId:depId,
        viewBy:viewBy,
        subDepId:subDepId
      }
      if(displayType=='grid'){
        this.loadGridBlFlData();
      }else{
        this.blServ.getspaceallocationstatictics(data).subscribe((res:any)=>{
          if(res){
              this.chartblfldata=res;
              if(viewBy=='bl_id'){
                this.chartblfldata = this.chartblfldata.map( (each:any)=>{ return {...each,"name":each.firstvalue};});
              }else{
                this.chartblfldata = this.chartblfldata.map( (each:any)=>{ return {...each,"name":each.firstvalue+"-"+each.secondvalue};})
              }
              this.setChartData();
              this.showbarchart = true;
          }
        })
      }
     
    }

    loadGridBlFlData(){
      let viewBy=this.filterPanel.controls.viewBy.value;
      let data={
        dateFrom:this.filter.dateFrom,dateTo:this.filter.dateTo,blId:this.filter.blId,flId:this.filter.flId,divId:this.filter.divId,
        depId:this.filter.depId,viewBy:this.filter.viewBy,subDepId:this.filter.subDepId,filterDto:{paginationDTO:this.paginationObjRm,filterCriteria:this.filterCriteriaListRm}
      }
      this.isFilteredRm = false;
      this.blServ.getspaceallocationstaticticsPaginated(data).subscribe((res:any)=>{
        if(res){
          this.isFilteredRm = false;
          let content = res.content ? res.content : [];
          this.totalElementsRm = res.totalElements ? res.totalElements : 0;
            this.gridblfldata = content;
          if(viewBy=='bl_id'){
            this.firstParamName='Building code';
            this.showSecondParam = false;
            this.secondParamName='';
            if(this.filter.blId!=null ){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.blId== this.filter.blId);
            }
          }else if(viewBy=='fl_id'){
            this.firstParamName='Building code';
            this.showSecondParam = true;
            this.secondParamName='Floor Code';
            if(this.filter.blId!=null ){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.blId== this.filter.blId);
            }
            if(this.filter.flId!=null ){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.flId== this.filter.flId);
            }
          }
          this.showGrid = true;
        }
      })
    }

    changeViewBy(event:any){
      this.xAxisLabel = event.lable;
    }

    getRoomData(room:any){
      this.showAllRoomsPopup = false;
      this.showAllocatedPopup = false;
      //this.roomData=[];
      let viewByValue =this.filterPanel.controls.viewBy.value;
      if(viewByValue=='bl_id'){
        this.filter.blId=room.blId;
      }else if(viewByValue=='fl_id'){
        this.filter.blId=room.blId;
        this.filter.flId=room.flId;
      }
      this.isFilteredRm=false;
      this.blServ.getspaceallocationstaticticsroomdata(this.filter).subscribe((res:any)=>{
        if(res){
          this.isFilteredRm=false;
          this.roomData = [...res];
          this.showAllocatedPopup = true;
        }
        this.filter.blId=null;
        this.filter.flId=null;
      })
    }

    onClear(){
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
      this.gridblfldata=[];
      this.chartblfldata=[];
      this.firstParamName='';
      this.secondParamName='';
      this.showSecondParam =false;
      this.roomData=[];
      this.allroomData=[];
      this.showGrid= false;
      this.showbarchart = false;
      this.showAllocatedPopup=false;
      this.showAllRoomsPopup = false;
      this.chartImg=[];
      this.filterPanel.patchValue({
        divId:null,
        depId: null,
        dateFrom:this.monthStart,
        dateTo: this.monthEnd,
        blId: null,
        flId:null,
        viewBy: null,
        displayType: this.displayTypeData[0].value,
        subDepId:null
      });
      this.filter = {blId:null,flId:null,divId:null,depId:null,dateFrom:null,dateTo:null,viewBy:null,subDepId:null};
      this.selectedBl = {};
      this.selectedFl = {};
    }

    setChartData(){
      this.barchartData=[];
      const barChartData:any[] =[];
      Object.values(this.chartblfldata).forEach((each: any, index: number) => {
       if(each.occupiedarea>0){
        let series = [{"name":"Total Area","value":each.totalarea},{"name":"Allocated Area","value":each.occupiedarea}];
        let dataobj = {
          name:each.name,
          series:series
        }
        barChartData.push(dataobj);
       }
      })
      if(barChartData.length < 5){
        let empty = '  ';
        for(let i=0; i<5-barChartData.length; i++){
          barChartData.push({
                name: empty.repeat(i+1),
                series :[{"name":"Total Area","value":0},{"name":"Allocated Area","value":0}]
            })
        }
    }
      this.barchartData = barChartData;
      this.cdr.detectChanges();
    }
    
     onSelectBarChart( event:any){
      this.roomData=[];
      this.allroomData=[];
      this.showAllocatedPopup = false;
      this.showAllRoomsPopup = false;
      let viewByValue =this.filterPanel.controls.viewBy.value;
      if(typeof event === "object" && event !== null){
        if(event.name=="Total Area"){
          let data ={blId:null,flId:null}
          let parts = event.series.split(/-(.+)/);
          if(viewByValue=="bl_id"){
            data.blId = this.searchInBlFlData(parts[0],null).blId;
          }else if (viewByValue =="fl_id"){
            let searchResultObj = this.searchInBlFlData(parts[0],parts[1]);
            data.blId = searchResultObj.blId;
            data.flId = searchResultObj.flId;
          }
          this.blServ.getRmList(data).subscribe((res:any)=>{
            this.allroomData = res.filter( (each:any) => each.commonAreaType==this.enumCommonAreaNoneType);
            this.showAllRoomsPopup = true;
          })
        }else if (event.name=="Allocated Area"){
          let parts = event.series.split(/-(.+)/);
          if(viewByValue=="bl_id"){
            this.filter.blId = this.searchInBlFlData(parts[0],null).blId;
          }else if (viewByValue =="fl_id"){
            let searchResultObj = this.searchInBlFlData(parts[0],parts[1]);
            this.filter.blId = searchResultObj.blId;
            this.filter.flId = searchResultObj.flId;
          }
          this.blServ.getspaceallocationstaticticsroomdata(this.filter).subscribe((res:any)=>{
            if(res){
              this.roomData = res;
              this.showAllocatedPopup = true;
            }
            this.filter.blId = null;
            this.filter.flId = null;
          })
        }
        }
     }

     exportChartToPDF(){
      const divElement: HTMLElement = this.chartContainer.nativeElement;
      html2canvas(divElement).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        this.chartImg = [];
        this.chartImg.push(imgData);
        this.printPDF();
      });
     }

     printPDF() {
      this.messageService.clear();
      var reportDetails: any = {
        chartImg: this.chartImg,
        title: 'View By ' + this.getlabelfromviewbyvalue(this.filterPanel.controls.viewBy.value),
      }
      this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
        if (res != null) {
          this.messageService.add({ key: 'spaceallocationMsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
          var file = new Blob([res], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
    }

     exportGridToExcel(){
      this.getDestructuredData(this.gridblfldata);
      let excelHeaders: string[]=[];
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.grid_array);
        worksheet['!cols'] = [];
        let lengthObj = Object.keys(this.gridblfldata[0]).length;
        for( let i =0;i<lengthObj;i++){
          worksheet['!cols'].push( { wch: 20 });
        }
        if(this.showSecondParam){
            excelHeaders =  [this.firstParamName,this.secondParamName,"Total Area (sq.ft)","Allocated Area (sq.ft)","Available Area (sq.ft)",
          "Allocation (%)"]  
          }else {
            excelHeaders =  [this.firstParamName,"Total Area (sq.ft)","Allocated Area (sq.ft)","Available Area (sq.ft)", "Allocation (%)"]   
          }
        const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
        headers.forEach(header => {
          worksheet[header.position] = { v: header.v };
        });
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "allocation");
      });
     }

     getDestructuredData(data: any) {
      this.grid_array = data.map((item: any) => {
        if(this.showSecondParam ){
          return {
            [this.firstParamName]: item['blCode'],
            [this.secondParamName]: item['flCode'],
            "Total Area (sq.ft)" : item['totalarea'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
            "Available Area (sq.ft)" : item['availablearea'] ,
            "Allocation (%)" : item['allocationpercentage']
          }
        }else{
          return {
            [this.firstParamName]: item['blCode'],
            "Total Area (sq.ft)" : item['totalarea'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
            "Available Area (sq.ft)" : item['availablearea'] ,
            "Allocation (%)" : item['allocationpercentage']
          }
        }
      });
    }
  
    saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

     getlabelfromviewbyvalue(value:any){
      let result = this.viewByData.filter((each:any)=>each.value==value);
      return result[0].lable
     }

     checkactive(event:any){
      event.entries=[];
      event.value=null;
     }

     searchInBlFlData(blCode:string,flCode:string|null){
      let returnData={
        blId:null,flId:null
      }
      returnData.blId = this.chartblfldata.find( each => each.blCode==blCode)?.blId;
      if(flCode!=null){
        returnData.flId = this.chartblfldata.find( each => each.blCode==blCode&&each.flCode==flCode)?.flId;
      }
      return returnData
     }

     checkIsDashboardUse(){
      if(this.isDashboardUse){
        this.view=[500,400];
        this.filterPanel.patchValue({
          divId:null,
          depId: null,
          dateFrom:this.dashboardDateRange.dateFrom,
          dateTo: this.dashboardDateRange.dateTo,
          blId: null,
          flId:null,
          subDepId:null,
          viewBy: this.viewByData[0].value,
          displayType: this.displayTypeData[1].value,
        });
        this.onSearch();
      }
     }

     onPageChangeRm(event:any){
      const pageNo = event.first ? event.first / event.rows : 0;
      const pageSize = event.rows;
      this.paginationObjRm.pageNo = pageNo;
      this.paginationObjRm.pageSize = pageSize;
      this.loadGridBlFlData();
     }

     onRoomInnerFilter(event:any){
      if(this.isFilteredRm){
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined ) {
            let fieldname='';
            if(field=="firstvalue" ){
              fieldname="bl_code";
            }else{
              fieldname="fl_code";
            }
              let filterCriteriaRm = { fieldName: fieldname, value: filterValue, matchMode: matchMode };
              this.updateFilterCriteriaList(filterCriteriaRm);
          }
        });
        this.paginationObjRm.pageNo = 0;
        setTimeout(() => {
          this.loadGridBlFlData();
        }, 100);
        
      }
      this.isFilteredRm = true;
     }

     updateFilterCriteriaList(filterCriteria:any){
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

    scrollToEndBl() {
      this.offsetBl = this.limitBl;
      this.limitBl += this.scrollLimit;
      this.filterCriteria.limit = this.limitBl;
      this.filterCriteria.offset = this.offsetBl;
      this.blServ.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
        this.enumBL = res;
        this.updateBlList(this.selectedBl);
      })
    }
  
    scrollToEndFl() {
      this.offsetFl = this.limitFl;
      this.limitFl += this.scrollLimit;
      this.filterCriteria.limit = this.limitFl;
      this.filterCriteria.offset = this.offsetFl;
      this.blServ.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
        this.enumFL = res;
        this.updateFlList(this.selectedFl);
      })
    }
  
  
    searchBl(event: any) {
      this.filterCriteria = {};
      this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
      this.scrollToEndBl();
    }
  
    searchFl(event: any) {
      this.filterCriteria = {};
      this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
      this.scrollToEndFl();
    }
  
    updateBlList(blData: any) {
      if (blData.blId) {
        this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
        this.enumBL = this.enumBL.filter(t => t.blId !== null);
        this.enumBL.unshift(blData);
      }
      this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
    }
  
    updateFlList(flData: any) {
      if (flData.flId) {
        this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
        this.enumFL = this.enumFL.filter(t => t.flId !== null);
        this.enumFL.unshift(flData);
      }
      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
    }
  
    onOpenBl() {
      this.limitBl = 0;
      this.offsetBl = 0;
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      }
      this.scrollToEndBl();
    }
  
    onOpenFl() {
      this.limitFl = 0;
      this.offsetFl = 0;
      if (this.selectedBl.blId) {
        this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
      } else {
        this.filterCriteria = {
          fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
        };
      }
      this.scrollToEndFl();
    }
  
  
}
