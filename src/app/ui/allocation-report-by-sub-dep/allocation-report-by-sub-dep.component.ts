import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { SubDepartmentService } from '../division-department/services/subDepartment.services';
import html2canvas from 'html2canvas';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-allocation-report-by-sub-dep',
  templateUrl: './allocation-report-by-sub-dep.component.html',
  styleUrls: ['./allocation-report-by-sub-dep.component.scss'],
  providers: [MessageService]
})
export class AllocationReportBySubDepComponent {
  enumSubDepartment:any[]=[];
  accordionSubDepartment:any[]=[]
  filterPanel!: UntypedFormGroup;
  myPieData:any[]=[];
  showPieChart:boolean = false;
  showsubdepaccordion:boolean = false;
  selectedDivId:number|null=null;
  selectedDepId:number|null=null;
  selectedSubDepId:number|null=null;
  selectedDivCode:string='';
  selectedDepCode:string='';
  selectedSubDepCode:string='';
  selectionMessage:string='';
  selectedAllocationData:any[]=[];
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
    private blSrv: BuildingService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
    private datePipe:DatePipe,
    private spinner: NgxSpinnerService,
    private subDeptService: SubDepartmentService,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      subDepId :[null],
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
    this.loadAllSubDepartments();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
    this.updatePieChartView();
  }

  loadAllSubDepartments(){
    this.subDeptService.getAllSubDepartments().subscribe((res: any) => {
      if (res) {
        this.enumSubDepartment = res.map((each:any)=>{ each.name= each.divisionDivCode+"-"+each.departmentDepCode+"-"+each.subDepCode; return each;});
        this.enumSubDepartment.unshift({ name: 'Make a Selection', depId: null, divId: null, subDepId: null });
      }
    })
  }

  loadAllSubDepartmentWithArea(){
    this.accordionSubDepartment=[];
    let data={
      dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
    }
    this.subDeptService.getSubDepartmentWithAllocatedArea(data).subscribe((res:any)=>{
      this.accordionSubDepartment = res.map((each:any)=>{ each.name= each.divCode+"-"+each.depCode+"-"+each.subDepCode; return each;});;
      this.getUpdatedSubDepList();
    });
   
  }

  getUpdatedSubDepList(){
    let subDepId = this.filterPanel.controls.subDepId.value;
    if(subDepId != null){
      this.accordionSubDepartment = this.accordionSubDepartment.filter((each:any)=> each.subDepId == subDepId);
    }
    this.showsubdepaccordion = true;
      this.cdr.detectChanges();
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
      this.showsubdepaccordion = false;
      this.showPieChart = false;
      this.selectedDivId=null;
      this.selectedDepId=null;
      this.selectedSubDepId=null;
      this.selectionMessage='';
      this.loadAllSubDepartmentWithArea();
    }


    onClear(){
      this.filterPanel.patchValue({
        subDepId:null,
        dateFrom:this.monthStart,
        dateTo:this.monthEnd,
        viewBy:null
      });
      this.showPieChart = false;
      this.selectedAllocationData =[];
      this.showsubdepaccordion = false;
      this.roomData=[];
      this.allroomavailablespaceData=[];
      this.selectedDivId=null;
      this.selectedDepId=null;
      this.selectedSubDepId=null;
      this.showAllocatedPopup = false;
      this.selectedDivCode='';
      this.selectedDepCode='';
      this.selectedSubDepCode='';
      this.chartImg = [];
      this.showAllRoomsAvailableSpacePopup = false;
      this.myPieData=[];
      this.selectionMessage='';
    }
    

    onViewPieChartForSubDept(event:any){
    this.selectedDivId=event.data.divId;
    this.selectedDepId=event.data.depId;
    this.selectedSubDepId=event.data.subDepId;
    this.selectedDivCode = event.data.divCode;
    this.selectedDepCode = event.data.depCode;
    this.selectedSubDepCode = event.data.subDepCode;
    this.showPieChart = false;
    let data={
      dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
      blId:null,
      flId:null,
      divId:event.data.divId,
      depId:event.data.depId,
      subDepId:event.data.subDepId,
      viewBy:this.filterPanel.controls.viewBy.value,
    }
    this.blSrv.getspaceallocationreportbyblfldivdep(data).subscribe((res:any)=>{
      this.selectedAllocationData = res;
      this.selectionMessage = `Allocation for ${event.data.name} by ${this.getViewByLabelFromValue(this.filterPanel.controls.viewBy.value)}`;
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
      let allocationfilter = {blId:null,flId:null,divId:this.selectedDivId,depId:this.selectedDepId,subDepId:this.selectedSubDepId,dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
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
      let headerstring = `Division: ${this.selectedDivCode} | Department: ${this.selectedDepCode} | Sub Department: ${this.selectedSubDepCode}`;
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
