import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { DepartmentService } from '../division-department/services/department.services';
import { DivisionService } from '../division-department/services/division.services';
import { ReportBarChartModel } from '../view-employee-report/model/report-bar-chart.model';
import { EnumService } from 'src/app/services/enum.service';
import html2canvas from 'html2canvas';
import { BookingService } from '../booking/services/booking.services';
import * as FileSaver from 'file-saver';

class roomfilter{
  blId: null|string;
  flId:null|string;
  divId:null|string;
  depId:null|string;
  dateFrom:null|string;
  dateTo:null|string;
  compId:null|number;
  viewBy:null|string;
  constructor( blId: null|string,flId:null|string,divId:null|string,depId:null|string,dateFrom:null|string,
    dateTo:null|string,compId:null|number,viewBy:null|string) {
    this.blId = blId;
    this.flId = flId;
    this.divId = divId;
    this.depId = depId;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.compId=compId;
    this.viewBy=viewBy;
}
}

@Component({
  selector: 'app-space-allocation-statistics',
  templateUrl: './space-allocation-statistics.component.html',
  styleUrls: ['./space-allocation-statistics.component.scss'],
  providers: [MessageService]
})

export class SpaceAllocationStatisticsComponent {
  filterPanel!: UntypedFormGroup;
  compId!: number;
  rowCount: number = UtilConstant.ROW_COUNT;
  departmentData:any[]=[];
  alldepartmentData:any[]=[];
  enumDivision:any[]=[];
  enumBL: any[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  showGrid:boolean = false;
  showGridLines:boolean = true;
  showAllocatedPopup:boolean = false;
  showAllRoomsPopup:boolean = false;
  gridblfldata:any[]=[];
  firstParamName:string='';
  secondParamName:string='';
  showSecondParam:boolean =false;
  roomData:any[]=[];
  allroomData:any[]=[];
  filter = new roomfilter(null,null,null,null,null,null,0,null);
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
    },
    {
      "id": 2,
      "lable": 'Division',
      "value": "div_id"
    },
    {
      "id": 3,
      "lable": 'Department',
      "value": "dep_id"
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
  view: any[] = [1200, 495];
  showXAxis:boolean = true;
  showXAxisLabel:boolean = true;
  xAxisLabel:string= '';
  barchartData : ReportBarChartModel[]=[];
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showYAxisLabel = true;
  yAxisLabel = 'Area (sq.ft)';
  showbarchart :boolean = false;
  colorScheme = {
    domain: ['#5AA454', '#C7B42C']
  };
  chartImg: any[] = [];
  enumCommonAreaNoneType!:number;
  grid_array :any[]=[];
  showOnlyAllocationArea:boolean = false;
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private divisionservice : DivisionService,
    private departmentservice : DepartmentService,
    private datePipe:DatePipe,
    private enumsrv: EnumService,
    private bookingSrv: BookingService,
    private messageService: MessageService,
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
    });
   
  }

  ngOnInit(): void {
    // this.compId = this.authSrv.getLoggedInUserCompId()
    this.loadAllBuilding();
    this.loadAllFloor();
    this.loadAllDivisions();
    this.loadAllDepartments();
    this.loadCommonAreaEnums();
   this.filterPanel.patchValue({
      displayType:this.displayTypeData[0].value,
      dateFrom:this.monthStart,
      dateTo: this.monthEnd
   })
  }

  loadAllDivisions(){
    this.enumDivision=[];
    this.divisionservice.getAllDivisions().subscribe((res:any)=>{
      this.enumDivision= res.map( (each:any) =>{ return {...each,"bindlabel":each.divId}} );
      this.enumDivision.unshift({divId:'',bindlabel:'Make a selection'})
    })
  }

  loadAllDepartments(){
    this.alldepartmentData=[];
    this.departmentservice.getAllDepartments().subscribe((res:any)=>{
      this.alldepartmentData = res.map( (each:any) =>{ return {...each,"bindlabel":each.depId}} );
      this.alldepartmentData.unshift({depId:'',bindlabel:'Make a selection'});
      this.departmentData=[...this.alldepartmentData];
     
    })
  }

  onSelectDivision(event:any){
    if (event.divId != null && event.divId!='') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          depId: null,
        });
        this.loadDepartmentCode(event.divId);
      }, 10);

    }
    else {
      this.departmentData = this.alldepartmentData;
    }
  }

  loadDepartmentCode(divId:any){
    if (divId != null && divId!='') {
      this.departmentData=[];
      this.departmentData = this.alldepartmentData.filter(t => t.divId == divId);
      this.departmentData.unshift({depId:'',bindlabel:'Make a selection'});
    }else{
      this.departmentData=[];
      this.departmentData = this.alldepartmentData;
    }
  }

  onSelectDepartment(event:any){
    if(event.depId!=null && event.depId!=''){
      this.filterPanel.patchValue({
        divId:event.divId
      })
    }else{
      this.filterPanel.patchValue({
        divId:null
      })
    }
  }

  loadAllBuilding() {
    this.blServ.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      this.enumBL.unshift({id:'',blNameString:'Make a selection'});
    });
  }

  loadAllFloor() {
    this.blServ.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL.unshift({id:'',flNameString:'Make a selection'});
      this.enumFL = this.enumAllFL;
    });
  }

  onSelectBlCode($event: any) {
    if ($event.id != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
        });
        this.loadFloorCode($event.id);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
        });
      }, 10);
      this.enumFL = this.enumAllFL;
    }
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)
      this.enumFL.unshift({id:'',flNameString:'Make a selection'});
    }
  }

  onSelectFlCode(event: any) {
    if (event.id != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {
      this.enumFL.unshift({id:'',flNameString:'Make a selection'});
    }
  }

  loadCommonAreaEnums(){
    this.enumsrv.getEnums().subscribe((res:any)=>{
      let resultCommonArea = res.filter((t:any) =>
        t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase()
        && t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase()
        && t.compId == this.compId && t.enumValue.toLocaleUpperCase() == 'None'.toLocaleUpperCase());
        this.enumCommonAreaNoneType = resultCommonArea[0].id
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
      this.showGrid = false;
      this.showbarchart = false;
      this.firstParamName='';
      this.showSecondParam = false;
      this.showOnlyAllocationArea = false;
      this.secondParamName='';
      let blId =this.filterPanel.controls.blId.value;
      let flId=this.filterPanel.controls.flId.value;
      let divId=this.filterPanel.controls.divId.value;
      let depId=this.filterPanel.controls.depId.value;
      let viewBy=this.filterPanel.controls.viewBy.value;
      let displayType = this.filterPanel.controls.displayType.value;
      this.filter.blId=blId!=null&&blId!=''?blId:null;
      this.filter.flId=flId!=null&&flId!=''?flId:null;
      this.filter.divId=divId!=null&&divId!=''?divId:null;
      this.filter.depId=depId!=null&&depId!=''?depId:null;
      this.filter.viewBy=viewBy;
      this.filter.dateFrom = this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd");
      this.filter.dateTo= this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd");
      this.filter.compId= this.compId;
      let data={
        compId:this.compId,
        dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
        dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
        blId:blId,
        flId:flId,
        divId:divId,
        depId:depId,
        viewBy:viewBy,
      }
      this.blServ.getspaceallocationstatictics(data).subscribe((res:any)=>{
        if(res){
          if(displayType=='grid'){
            this.gridblfldata = res;
          if(viewBy=='bl_id'){
            this.firstParamName='Building code';
            this.showSecondParam = false;
            this.showOnlyAllocationArea = false;
            this.secondParamName='';
            if(blId!=null && blId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.firstvalue== blId);
            }
          }else if(viewBy=='fl_id'){
            this.firstParamName='Building code';
            this.showSecondParam = true;
            this.showOnlyAllocationArea = false;
            this.secondParamName='Floor Code';
            if(blId!=null && blId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.firstvalue== blId);
            }
            if(flId!=null && flId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.secondvalue== flId);
            }
          }else if(viewBy=='div_id'){
            this.firstParamName='Division code';
            this.showSecondParam = false;
            this.showOnlyAllocationArea = true;
            this.secondParamName='';
            if(divId!=null && divId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.firstvalue== divId);
            }
          }else if(viewBy=='dep_id'){
            this.firstParamName='Division code';
            this.showSecondParam = true;
            this.showOnlyAllocationArea = true;
            this.secondParamName='Department Code';
            if(divId!=null && divId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.firstvalue== divId);
            }
            if(depId!=null && depId!=''){
              this.gridblfldata = this.gridblfldata.filter( (each:any) => each.secondvalue== depId);
            }
          }
          this.showGrid = true;
          }else{
            this.gridblfldata=res;
            if(viewBy=='bl_id' || viewBy=='div_id'){
              this.gridblfldata = this.gridblfldata.map( (each:any)=>{ return {...each,"name":each.firstvalue};});
            }else{
              this.gridblfldata = this.gridblfldata.map( (each:any)=>{ return {...each,"name":each.firstvalue+"-"+each.secondvalue};})
            }
            this.setChartData();
            this.showbarchart = true;
          }
          
        }
      })
    }

    changeViewBy(event:any){
      this.xAxisLabel = event.lable;
    }

    onSelectDisplayType(event:any){
    }

    getRoomData(room:any){
      this.showAllRoomsPopup = false;
      this.showAllocatedPopup = false;
      this.roomData=[];
      let viewByValue =this.filterPanel.controls.viewBy.value;
      if(viewByValue=='bl_id'){
        this.filter.blId=room.firstvalue;
      }else if(viewByValue=='fl_id'){
        this.filter.blId=room.firstvalue;
        this.filter.flId=room.secondvalue;
      }else if(viewByValue=='div_id'){
        this.filter.divId=room.firstvalue;
        
      }else if(viewByValue=='dep_id'){
        this.filter.divId=room.firstvalue;
        this.filter.depId=room.secondvalue;
      }
      this.blServ.getspaceallocationstaticticsroomdata(this.filter).subscribe((res:any)=>{
        if(res){
          this.roomData = res;
          this.showAllocatedPopup = true;
        }
      })
    }

    onClear(){
      this.gridblfldata=[];
      this.firstParamName='';
      this.secondParamName='';
      this.showSecondParam =false;
      this.showOnlyAllocationArea = false;
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
      });
      this.filter = {blId:null,flId:null,divId:null,depId:null,dateFrom:null,dateTo:null, compId:null,viewBy:null};
    }

    setChartData(){
      this.barchartData=[];
      const barChartData:any[] =[];
      Object.values(this.gridblfldata).forEach((each: any, index: number) => {
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
          let data ={id:'',name:'',blId:null,flId:null}
          let parts = event.series.split(/-(.+)/);
          if(viewByValue=="bl_id"){
            data.blId = parts[0];
          }else if (viewByValue =="fl_id"){
            data.blId = parts[0];
            data.flId = parts[1];
          }
          this.blServ.getRmList(data).subscribe((res:any)=>{
            this.allroomData = res.filter( (each:any) => each.commonAreaType==this.enumCommonAreaNoneType);
            this.showAllRoomsPopup = true;
          })
        }else if (event.name=="Allocated Area"){
          let parts = event.series.split(/-(.+)/);
          if(viewByValue=="bl_id"){
            this.filter.blId = parts[0];
          }else if (viewByValue =="fl_id"){
            this.filter.blId = parts[0];
            this.filter.flId = parts[1];
          }else if (viewByValue =="div_id"){
            this.filter.divId = parts[0];
          }else if (viewByValue == "dep_id"){
            this.filter.divId = parts[0];
            this.filter.depId = parts[1];
          }
          this.blServ.getspaceallocationstaticticsroomdata(this.filter).subscribe((res:any)=>{
            if(res){
              this.roomData = res;
              this.showAllocatedPopup = true;
            }
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
          if(this.showSecondParam && this.showOnlyAllocationArea){
          excelHeaders =  [this.firstParamName,this.secondParamName,"Allocated Area (sq.ft)"];
          }else if(this.showSecondParam && !this.showOnlyAllocationArea){
            excelHeaders =  [this.firstParamName,this.secondParamName,"Total Area (sq.ft)","Allocated Area (sq.ft)","Available Area (sq.ft)",
          "Allocation (%)"]  
          }else if (!this.showSecondParam && this.showOnlyAllocationArea){
            excelHeaders =  [this.firstParamName,"Allocated Area (sq.ft)"];
          }else if (!this.showSecondParam && !this.showOnlyAllocationArea){
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
        if(this.showSecondParam && this.showOnlyAllocationArea){
          return {
            [this.firstParamName]: item['firstvalue'],
            [this.secondParamName]: item['secondvalue'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
          }
        }else if(this.showSecondParam && !this.showOnlyAllocationArea){
          return {
            [this.firstParamName]: item['firstvalue'],
            [this.secondParamName]: item['secondvalue'],
            "Total Area (sq.ft)" : item['totalarea'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
            "Available Area (sq.ft)" : item['availablearea'] ,
            "Allocation (%)" : item['allocationpercentage']
          }
        }else if(!this.showSecondParam && this.showOnlyAllocationArea){
          return {
            [this.firstParamName]: item['firstvalue'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
          }
        }else if (!this.showSecondParam && !this.showOnlyAllocationArea){
          return {
            [this.firstParamName]: item['firstvalue'],
            "Total Area (sq.ft)" : item['totalarea'],
            "Allocated Area (sq.ft)" : item['occupiedarea'],
            "Available Area (sq.ft)" : item['availablearea'] ,
            "Allocation (%)" : item['allocationpercentage']
          }
        }else{
          return null;
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
}
