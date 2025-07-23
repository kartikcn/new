import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { DivisionService } from '../division-department/services/division.services';
import { DepartmentService } from '../division-department/services/department.services';
import { UtilConstant } from 'src/common/UtilConstant';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import html2canvas from 'html2canvas';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-allocation-report-by-div-dep',
  templateUrl: './allocation-report-by-div-dep.component.html',
  styleUrls: ['./allocation-report-by-div-dep.component.scss'],
  providers: [MessageService]
})
export class AllocationReportByDivDepComponent {
  enumDivision:any[]=[];
  allDepartmentList:any[]=[];
  selectedDivisionDepartmentData:any[]=[];
  accordionDivision:any[]=[];
  allaccordionDivision:any[]=[];
  filterPanel!: UntypedFormGroup;
  myPieData:any[]=[];
  showPieChart:boolean = false;
  showdivdepaccordion:boolean = false;
  selectedDivId:number|null=null;
  selectedDepId:number|null=null;
  selectedDivCode:string="";
  selectedDepCode:string="";
  selectionMessage:string='';
  selectedAllocationData:any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  width = 850;
  height = 550;
  monthStart = new Date((new Date()).getFullYear(),(new Date()).getMonth(), 1);
  monthEnd = new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
  myPieOptions = {
    sliceVisibilityThreshold: 0 ,
    legend:{textStyle:{fontName:"Segoe UI"}},
  };
  viewByData: any[] = [
    {
      "id": 0,
      "lable": "Building",
      "value": "bl_id"
    },
    {
      "id": 1,
      "lable": "Floor",
      "value": "fl_id"
    }
  ];
  roomData:any[]=[];
  allroomavailablespaceData:any[]=[];
  showAllocatedPopup:boolean = false;
  showAllRoomsAvailableSpacePopup:boolean = false;
  chartImg: any[] = [];
  useTabletProtrait = false;
  useTabletLandscape = false;
  constructor(
    private formBuilder: FormBuilder,
    private divisionSrv : DivisionService,
    private blSrv: BuildingService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
    private departmentSrv : DepartmentService,
    private datePipe:DatePipe,
    private spinner: NgxSpinnerService,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      divId :[null],
      dateFrom:[null,[Validators.required]],
      dateTo:[null,[Validators.required]],
      viewBy :[null,[Validators.required]]
    });
   }

   ngOnInit(): void {
    this.bps.register(this);
    this.filterPanel.patchValue({
      dateFrom:this.monthStart,
      dateTo: this.monthEnd
    });
    this.loadAllDivision();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
    this.updatePieChartView();
  }

  loadAllDivision(){
    this.divisionSrv.getAllDivisions().subscribe((res:any)=>{
      this.enumDivision = res;
      this.enumDivision.unshift({divId:null,divCode:'Make a selection'})
    });
  }

  loadAllDivisionAndDepartmentWithArea(){
    this.allaccordionDivision=[];
    this.allDepartmentList=[];
    let data={
      dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
    }
    this.divisionSrv.getDivisionWithAllocatedArea(data).subscribe((res:any)=>{
      this.allaccordionDivision = res;
      this.getUpdatedDivDepList();
    });
    this.departmentSrv.getDepartmentWithAllocatedArea(data).subscribe((res:any)=>{
      this.allDepartmentList = res;
    });
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
      this.accordionDivision=[];
      this.showdivdepaccordion = false;
      this.showPieChart = false;
      this.selectedDivId=null;
      this.selectedDepId=null;
      this.selectedDepCode="";
      this.selectedDivCode="";
      this.selectionMessage='';
      this.loadAllDivisionAndDepartmentWithArea();
    }

    getUpdatedDivDepList(){
      let divId = this.filterPanel.controls.divId.value;
      if(divId != null){
        this.accordionDivision = this.allaccordionDivision.filter((each:any)=> each.divId == divId);
      }else{
        let filterData = this.allaccordionDivision.filter((each:any)=> each.divId!=null);
        this.accordionDivision = [...filterData];
      }
      this.showdivdepaccordion = true;
      this.cdr.detectChanges();
    }

    onClear(){
      this.filterPanel.patchValue({
        divId:null,
        dateFrom:this.monthStart,
        dateTo:this.monthEnd,
        viewBy:null
      });
      this.selectedDivisionDepartmentData=[];
      this.showPieChart = false;
      this.selectedAllocationData =[];
      this.showdivdepaccordion = false;
      this.roomData=[];
      this.allroomavailablespaceData=[];
      this.selectedDivId=null;
      this.selectedDepId=null;
      this.selectedDepCode="";
      this.selectedDivCode="";
      this.showAllocatedPopup = false;
      this.chartImg = [];
      this.showAllRoomsAvailableSpacePopup = false;
      this.myPieData=[];
      this.selectionMessage='';
    }

    onTabClose(event:any){}

    onTabOpen(event:any){
      this.selectedDivisionDepartmentData=[];
      let selectedTab = this.accordionDivision[event.index];
      this.selectedDivisionDepartmentData = this.allDepartmentList.filter((each:any)=> each.divId== selectedTab.divId);
    }

  onViewPieChartForDivision(event: any) {
    // this.selectedDivId = event.data.divId;
    // this.selectedDivCode = event.data.divCode;
    // this.selectedDepId = null;
    // this.selectedDepCode = "";
    // this.showPieChart = false;
    // let data = {
    //   dateFrom: this.datePipe.transform(this.filterPanel.controls.dateFrom.value, "yyyy-MM-dd"),
    //   dateTo: this.datePipe.transform(this.filterPanel.controls.dateTo.value, "yyyy-MM-dd"),
    //   blId: null,
    //   flId: null,
    //   divId: event.data.divId,
    //   depId: null,
    //   viewBy: this.filterPanel.controls.viewBy.value,
    // }
    // this.blSrv.getspaceallocationreportbyblfldivdep(data).subscribe((res: any) => {
    //   this.selectedAllocationData = res;
    //   this.selectionMessage = `Allocation for ${this.selectedDivCode} by ${this.getViewByLabelFromValue(this.filterPanel.controls.viewBy.value)}`;
    //   this.generatePieChartData();
    //   this.showPieChart = true;

    // })
    this.onViewPieChartForDepartment(event);
  }

    onViewPieChartForDepartment(event:any){
      this.selectedDivId=event.data.divId;
      this.selectedDepId=event.data.depId;
      this.selectedDivCode = event.data.divCode;
      this.selectedDepCode = event.data.depCode;
      this.showPieChart = false;
      let data={
        dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
        dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
        blId:null,
        flId:null,
        divId:event.data.divId,
        depId:event.data.depId,
        viewBy:this.filterPanel.controls.viewBy.value,
      }
      this.blSrv.getspaceallocationreportbyblfldivdep(data).subscribe((res:any)=>{
        this.selectedAllocationData = res;
        const depCodeSuffix = this.selectedDepCode ? `- ${this.selectedDepCode}` : '';
        this.selectionMessage = `Allocation for ${this.selectedDivCode} ${depCodeSuffix} by ${this.getViewByLabelFromValue(this.filterPanel.controls.viewBy.value)}`;
        this.generatePieChartData();
        this.showPieChart = true;
      })
    }

    generatePieChartData(){
      const angularpiechartdata:any[] =[];
      Object.values(this.selectedAllocationData).forEach((each: any, index: number) => {
      if(each.allocatedArea>0){
        let chartdata = [each.name.toString(),each.allocatedArea]
        angularpiechartdata.push(chartdata);
      }
    })
    this.myPieData = angularpiechartdata;
    this.cdr.detectChanges();
    }

    getViewByLabelFromValue(val:any){
      let selectedViewBy = this.viewByData.find( each => each.value==val);
      return selectedViewBy.lable
    }

    onSelectGooglePieChart(event:any){
      this.roomData = [];
      this.showAllocatedPopup = false;
      this.allroomavailablespaceData =[];
      this.showAllRoomsAvailableSpacePopup = false;
      let rowvalue = event.selection[0].row;
      let selectedvalue = this.myPieData[rowvalue][0];
      let viewBy = this.filterPanel.controls.viewBy.value;
      let allocationfilter = {blId:null,flId:null,divId:this.selectedDivId,depId:this.selectedDepId,dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),viewBy:''}
      if(viewBy=='bl_id'){
        allocationfilter.blId = this.searchInBlFlData(selectedvalue,null).blId;
      }else if (viewBy=='fl_id'){
        let parts = selectedvalue.split(/-(.+)/);
        let searchResultObj = this.searchInBlFlData(parts[0],parts[1]);
        allocationfilter.blId = searchResultObj.blId;
        allocationfilter.flId = searchResultObj.flId;
      }
      this.blSrv.getspaceallocationstaticticsroomdata(allocationfilter).subscribe((res:any)=>{
        if(res){
          this.roomData = res;
          this.showAllocatedPopup = true;
        }
      })
    }

    exportToPdf(){
      if (this.contentElement) {
        this.spinner.show();
        const divElement: HTMLElement = this.contentElement.nativeElement;
        html2canvas(divElement).then((canvas: any) => {
          const imgData = canvas.toDataURL('image/png');
          this.chartImg = [];
          this.chartImg.push(imgData);
          this.printPDF();
          this.spinner.hide();
        });
      }
    }

    printPDF() {
      this.messageService.clear();
      let headerstring = this.getSelectedDivandDepHeader();
      let titlestring ="";
      if(this.filterPanel.controls.viewBy.value=="bl_id"){
        titlestring = "Building"
      }else if(this.filterPanel.controls.viewBy.value=="fl_id"){
        titlestring = "Floor"
      }
      var reportDetails: any = {
        chartImg: this.chartImg,
        title: `Allocation by ${titlestring}`,
        heading :headerstring
      }
      this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
        if (res != null) {
          this.messageService.add({ key: 'highlightblflmsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
          var file = new Blob([res], { type: 'application/pdf' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
    }

    getSelectedDivandDepHeader(){
      let resultstring =''
      if(this.selectedDivCode!=''){
        resultstring += `Division: ${this.selectedDivCode}`;
      }
      if(this.selectedDepCode !=''){
        resultstring += ` | Department: ${this.selectedDepCode}`;
      }
      return resultstring;
    }

    searchInBlFlData(blCode:string,flCode:string|null){
      let returnData={
        blId:null,flId:null
      }
      returnData.blId = this.selectedAllocationData.find( each => each.blCode==blCode)?.blId;
      if(flCode!=null){
        returnData.flId = this.selectedAllocationData.find( each => each.blCode==blCode&&each.flCode==flCode)?.flId;
      }
      return returnData
     }

     updatePieChartView(){
      this.setMyPieOptions();
      if(this.useTabletProtrait){
        this.width = 400;
        this.height = 400;
      }else if(this.useTabletLandscape){
        this.width = 700;
        this.height = 400;
      }else{
        this.width = 850;
        this.height = 550;
      }
     }

     setMyPieOptions(){
      if(this.useTabletProtrait){
        this.myPieOptions = {
          sliceVisibilityThreshold: 0 ,
          // @ts-ignore
          legend:{textStyle:{fontName:"Segoe UI"},position: 'bottom',alignment: 'center',orientation: 'vertical',},
        };
      }
      else{
        this.myPieOptions = {
          sliceVisibilityThreshold: 0 ,
          legend:{textStyle:{fontName:"Segoe UI"},},
        };
      }
     }

     ngOnDestroy() {
      this.bps.unregister(this);
    }
}
