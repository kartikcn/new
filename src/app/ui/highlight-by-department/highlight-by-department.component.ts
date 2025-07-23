import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { DepartmentService } from '../division-department/services/department.services';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-highlight-by-department',
  templateUrl: './highlight-by-department.component.html',
  styleUrls: ['./highlight-by-department.component.scss'],
  providers: [MessageService]
})
export class HighlightByDepartmentComponent implements OnInit {
  enumDepartment:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithDept :any[]=[];
  departmentFloorData:any[]=[];
  accordionDepartment:any[]=[];
  selectedDepartmentId:number|null=null;
  selectedDepartmentCode:string="";
  chartImg: any[] = [];
  selectedblId:number|null=null;
  selectedflId:number|null=null;
  selectedblCode:string="";
  selectedflCode:string="";
  blockDefs: ElementRef | undefined;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: FormBuilder,
    private departmentSrv : DepartmentService,
    private blSrv: BuildingService,
    private spinner: NgxSpinnerService,
    private svgViewSrv: SvgViewService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
  ) {
    this.filterPanel = this.formBuilder.group({
      depId :[null,[Validators.required]]
    });
   }

  ngOnInit(): void {
    this.loadAllFloorData();
    this.loadAllDepartments();
  }

  loadAllDepartments(){
    this.departmentSrv.getAllDepartmentsWithDivCode().subscribe((res:any)=>{
      this.enumDepartment = res.map((each:any)=>{each.name=each.divisionDivCode+"-"+each.depCode; return each;} );
      this.accordionDepartment = [...this.enumDepartment];
      this.enumDepartment.unshift({depId:null,name:'Make a selection',divId:null})
    });
  }

  loadAllFloorData(){
    let data={
      depId:null,
      description:'',
      depHead:null,
      divId:null
    }
    this.departmentSrv.getDepartmentAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithDept = res;
    })
  }
  
  onSearch(){
    this.accordionDepartment=[];
    this.departmentFloorData = [];
    this.cdr.detectChanges();
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedDepartmentCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedDepartmentId=null;
    this.viewSvg= false;
    this.showSpinner= false;
    let depId = this.filterPanel.controls.depId.value;
    if(depId!=null){
      let filterData = this.enumDepartment.filter((each:any)=> each.depId==depId);
      this.accordionDepartment = [...filterData];
    }else{
      let filterData = this.enumDepartment.filter((each:any)=> each.depId!=null);
      this.accordionDepartment = [...filterData];
    }
  }

  onClear(){
    this.enumDepartment=[];
    this.displayNoFloorPlanInfo= false;
    this.viewSvg= false;
    this.showSpinner= false;
    this.svgInputData  = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.allFloorsWithDept =[];
    this.departmentFloorData=[];
    this.accordionDepartment=[];
    this.selectedDepartmentId=null;
    this.selectedDepartmentCode="";
    this.filterPanel.patchValue({
      depId :null
    });
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.loadAllFloorData();
    this.loadAllDepartments();
  }
  

  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    let color = this.getDepartmentColor(event.data.depId);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedblCode = event.data.blCode;
    this.selectedflCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"department",this.selectedDepartmentId,null)
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }

  onTabClose(event:any){
    this.departmentFloorData = [];
    this.selectedDepartmentId=null;
    this.selectedDepartmentCode="";
  }

  onTabOpen(event:any){
    this.departmentFloorData = [];
    this.selectedDepartmentId=null;
    this.selectedDepartmentCode="";
    let selectedTab = this.accordionDepartment[event.index];
    this.departmentFloorData = this.allFloorsWithDept.filter((each:any)=> each.depId== selectedTab.depId);
    this.selectedDepartmentId = selectedTab.depId;
    this.selectedDepartmentCode=selectedTab.depCode;
  }

  getDepartmentColor(depId:any){
    let departmentDetails = this.accordionDepartment.filter((each:any)=> each.depId== depId);
    let deptColor = departmentDetails[0].highlightColor;
    return deptColor;
  }

  exportToPdf(){
    this.showSpinner = true;
    this.spinner.show();
    this.cdr.detectChanges();
    setTimeout(()=>{
      if (this.contentElement) {
        this.showSpinner = true;
        this.spinner.show();
        const divElement: HTMLElement = this.contentElement.nativeElement;
        this.updateSvgBeforePdf();
        html2canvas(divElement).then((canvas: any) => {
          const imgData = canvas.toDataURL('image/png');
          this.chartImg = [];
          this.chartImg.push(imgData);
          this.printPDF();
          this.svgViewComp.loadSvgFile();
          this.spinner.hide();
          this.showSpinner = false;
        });
      }
    },200)
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    let titlestring ="";
    if(this.selectedDepartmentCode!=""){
      titlestring = this.selectedDepartmentCode
    }else{
      titlestring = "Department"
    }
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${titlestring}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlightdeptmsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
        var file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  getSelectedBlandFlHeader(){
    return `Building: ${this.selectedblCode} | Floor: ${this.selectedflCode}`;
  }

  updateSvgBeforePdf(){
    let assetlayerblocks :string[]=[];
      const divElement: HTMLElement = this.contentElement.nativeElement;
      const blockDefs = this.contentElement.nativeElement.querySelector('#block_defs');
      const svgElement = document.getElementById('svg-container');
      const useElements = svgElement!.getElementsByTagName('use');
      const keyValuePairs: { [key: string]: string } = {};
      for (let i = 0; i < useElements.length; i++) {
        const useElement = useElements[i];
        let href = useElement.getAttribute('href')?.substring(1);
        const strokeWidth = useElement.getAttribute('stroke-width');
        if (href && strokeWidth) {
          keyValuePairs[href] = strokeWidth;
        }
      }
      if(blockDefs != null){
        const childElements = blockDefs.children;
        for (let i = 0; i < childElements.length; i++) {
          let blockid = childElements[i].getAttribute("id");
          childElements[i].setAttribute("class","pdf-export");
          let swval = keyValuePairs[blockid];
          if(swval){
            childElements[i].setAttribute("stroke-width",swval)
          }
        }
      }
  }

  getTotalAreaofDepartment(divId:any,depId:any){
    let area=0;
    this.allFloorsWithDept.forEach((dept:any)=>{
      if(dept.depId==depId && dept.divId==divId){
        area += dept.totalArea
      }
    });
    return area;
  }

}
