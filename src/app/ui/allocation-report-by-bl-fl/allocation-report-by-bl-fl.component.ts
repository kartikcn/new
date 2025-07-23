import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import html2canvas from 'html2canvas';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-allocation-report-by-bl-fl',
  templateUrl: './allocation-report-by-bl-fl.component.html',
  styleUrls: ['./allocation-report-by-bl-fl.component.scss'],
  providers: [MessageService],
})
export class AllocationReportByBlFlComponent {
  filterPanel!: UntypedFormGroup;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumBL: any[] = [];
  allfloorData :any[]=[];
  accordionBuilding:any[]=[];
  selectedBuldingFloorData:any[]=[];
  showPieChart : boolean = false;
  selectedAllocationData :any[]=[];
  showblflaccordion:boolean = false;
  roomData:any[]=[];
  allroomavailablespaceData:any[]=[];
  selectedBlId:number|null=null;
  selectedFlId:number|null=null;
  selectedBlCode:string="";
  selectedFlCode:string="";
  showAllocatedPopup:boolean = false;
  chartImg: any[] = [];
  divisionData:any[]=[];
  departmentData:any[]=[];
  showAllRoomsAvailableSpacePopup:boolean = false;
  viewByData: any[] = [
    {
      "id": 0,
      "lable": "Division",
      "value": "div_id"
    },
    {
      "id": 1,
      "lable": "Department",
      "value": "dep_id"
    },
    {
      "id": 2,
      "lable": "Sub Department",
      "value": "sub_dep_id"
    }
  ];
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  width = 850;
  height = 550;
  myPieData:any[]=[];
  selectionMessage:string='';
  monthStart = new Date((new Date()).getFullYear(),(new Date()).getMonth(), 1);
  monthEnd = new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0);
  myPieOptions = {
    sliceVisibilityThreshold: 0 ,
    legend:{textStyle:{fontName:"Segoe UI"},},
  };
  
  useTabletProtrait = false;
  useTabletLandscape = false;
  constructor(
    private blServ: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private bookingSrv: BookingService,
    private messageService: MessageService,
    private datePipe:DatePipe,
    private spinner: NgxSpinnerService,
    private bps : BreakpointService
  ) { 
    this.filterPanel = this.formBuilder.group({
      blId: [null],
      dateFrom:[null,[Validators.required]],
      dateTo:[null,[Validators.required]],
      viewBy :[null,[Validators.required]]
    });
   
  }
  ngOnInit(): void {
    this.bps.register(this);
    this.loadAllBuildingwithArea();
    this.loadFloorwithArea();
    this.filterPanel.patchValue({
      dateFrom:this.monthStart,
      dateTo: this.monthEnd
    })
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.useTabletLandscape = BreakpointService.useTabletLandscape;
    this.updatePieChartView();
  }

  loadAllBuildingwithArea() {
    this.blServ.getallbuildingwitharea().subscribe((res: any) => {
      this.enumBL = res.map((each:any)=> {
        if(each.blName != null && each.blName !=''){
          each.bindlabel= `${each.blCode} - ${each.blName}`;
        }else{
          each.bindlabel= `${each.blCode}`;
        }
        return each;
      });
      this.accordionBuilding =[...this.enumBL];
      this.enumBL.unshift({blId:null,bindlabel:'Make a selection'});
    });
  }

  loadFloorwithArea(){
    this.blServ.getallfloorwitharea().subscribe((res:any)=>{
      this.allfloorData = res;
    })
  }

  onSearch(){
    this.accordionBuilding=[];
    this.showblflaccordion = false;
    this.showPieChart = false;
    this.cdr.detectChanges();
    this.selectedBlId=null;
    this.selectedFlId=null;
    this.selectionMessage='';
    let blId = this.filterPanel.controls.blId.value;
    if(blId != null){
      this.accordionBuilding = this.enumBL.filter((each:any)=> each.blId == blId);
    }else{
      let filterData = this.enumBL.filter((each:any)=> each.blId!=null);
      this.accordionBuilding = [...filterData];
    }
    this.showblflaccordion = true;
    this.cdr.detectChanges();
  }

  onClear(){
    this.filterPanel.patchValue({
      blId:null,
      dateFrom:this.monthStart,
      dateTo:this.monthEnd,
      viewBy:null
    });
    this.selectedBuldingFloorData=[];
    this.showPieChart = false;
    this.selectedAllocationData =[];
    this.showblflaccordion = false;
    this.roomData=[];
    this.allroomavailablespaceData=[];
    this.selectedBlId=null;
    this.selectedFlId=null;
    this.selectedBlCode = "";
    this.selectedFlCode = "";
    this.showAllocatedPopup = false;
    this.chartImg = [];
    this.showAllRoomsAvailableSpacePopup = false;
    this.myPieData=[];
    this.selectionMessage='';
  }

  onTabClose(event:any){}

  onTabOpen(event:any){
    this.selectedBuldingFloorData=[];
    let selectedTab = this.accordionBuilding[event.index];
    this.selectedBuldingFloorData = this.allfloorData.filter((each:any)=> each.blId== selectedTab.blId);
  }

  onViewPieChartForBuilding(event:any){
    this.onViewPieChartForFloor(event);
  }

  onViewPieChartForFloor(event:any){
    this.selectedBlId=event.data.blId;
    this.selectedFlId=event.data.flId;
    this.selectedBlCode = event.data.blCode;
    this.selectedFlCode = event.data.flCode;
    this.showPieChart = false;
    let data={
      dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),
      blId:event.data.blId,
      flId:event.data.flId,
      divId:null,
      depId:null,
      viewBy:this.filterPanel.controls.viewBy.value,
    }
    this.blServ.getspaceallocationreportbyblfldivdep(data).subscribe((res:any)=>{
      this.selectedAllocationData = res;
      const flCodeSuffix = this.selectedFlCode ? `- ${this.selectedFlCode}` : '';
      this.selectionMessage = `Allocation for ${this.selectedBlCode} ${flCodeSuffix} by ${this.getViewByLabelFromValue(this.filterPanel.controls.viewBy.value)}`;
      this.generatePieChartData();
      this.showPieChart = true;
    })
  }

  generatePieChartData(){
    const angularpiechartdata:any[] =[];
    Object.values(this.selectedAllocationData).forEach((each: any, index: number) => {
      if(each.allocatedArea>0){
        let chartdata = [each.name,each.allocatedArea]
        angularpiechartdata.push(chartdata);
      }
    })
    this.myPieData = angularpiechartdata;
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
      let headerstring = this.getSelectedBlandFlHeader();
      let titlestring ="";
      if(this.filterPanel.controls.viewBy.value=="div_id"){
        titlestring = "Division"
      }else if(this.filterPanel.controls.viewBy.value=="dep_id"){
        titlestring = "Department"
      }else if(this.filterPanel.controls.viewBy.value=="sub_dep_id"){
        titlestring = "Sub Department"
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

    getSelectedBlandFlHeader(){
      let resultstring =''
      if(this.selectedBlCode!=''){
        resultstring += `Building: ${this.selectedBlCode}`;
      }
      if(this.selectedFlCode !=''){
        resultstring += ` | Floor: ${this.selectedFlCode}`;
      }
      return resultstring;
    }

    onSelectGooglePieChart(event:any){
      this.roomData = [];
      this.showAllocatedPopup = false;
      this.allroomavailablespaceData =[];
      this.showAllRoomsAvailableSpacePopup = false;
      let rowvalue = event.selection[0].row;
      let selectedvalue = this.myPieData[rowvalue][0];
      let viewBy = this.filterPanel.controls.viewBy.value;
      let allocatiofilter = {blId:this.selectedBlId,flId:this.selectedFlId,divId:null,depId:null,subDepId:null,dateFrom:this.datePipe.transform(this.filterPanel.controls.dateFrom.value,"yyyy-MM-dd"),
      dateTo:this.datePipe.transform(this.filterPanel.controls.dateTo.value,"yyyy-MM-dd"),viewBy:''}
      if(selectedvalue!='Available Area'){
        if(viewBy=='div_id'){
          allocatiofilter.divId = this.searchInDivDepData(selectedvalue,null,null).divId;
        }else if (viewBy=='dep_id'){
          let parts = selectedvalue.split('-');
          let searchResultObj = this.searchInDivDepData(parts[0],parts[1],null);
          allocatiofilter.divId = searchResultObj.divId;
          allocatiofilter.depId = searchResultObj.depId;
        }else if(viewBy=='sub_dep_id'){
          let parts = selectedvalue.split('-');
          let searchResultObj = this.searchInDivDepData(parts[0],parts[1],parts[2]);
          allocatiofilter.divId = searchResultObj.divId;
          allocatiofilter.depId = searchResultObj.depId;
          allocatiofilter.subDepId = searchResultObj.subDepId;
        }
        this.blServ.getspaceallocationstaticticsroomdata(allocatiofilter).subscribe((res:any)=>{
          if(res){
            this.roomData = res;
            this.showAllocatedPopup = true;
          }
        })
      }else if(selectedvalue=='Available Area'){
        this.blServ.getroomspaceavailibilitydetails(allocatiofilter).subscribe((res:any)=>{
          this.allroomavailablespaceData=res;
          this.showAllRoomsAvailableSpacePopup = true;
        })
      }
    }

    getViewByLabelFromValue(val:any){
      let selectedViewBy = this.viewByData.find( each => each.value==val);
      return selectedViewBy.lable
    }

    searchInDivDepData(divCode:string,depCode:string|null,subDepCode:string|null){
      let returnData={
        divId:null,depId:null,subDepId:null
      }
      returnData.divId = this.selectedAllocationData.find( each => each.divCode==divCode)?.divId;
      if(depCode!=null){
        returnData.depId = this.selectedAllocationData.find( each => each.depCode==depCode && each.divCode==divCode)?.depId;
      }if(subDepCode!=null){
        returnData.subDepId = this.selectedAllocationData.find( each => each.subDepCode==subDepCode && each.depCode==depCode && each.divCode==divCode)?.subDepId;
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
