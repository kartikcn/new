import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { SubDepartmentService } from '../division-department/services/subDepartment.services';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-highlight-by-sub-department',
  templateUrl: './highlight-by-sub-department.component.html',
  styleUrls: ['./highlight-by-sub-department.component.scss'],
  providers: [MessageService]
})
export class HighlightBySubDepartmentComponent {
  numDepartment:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithSubDept :any[]=[];
  subdepartmentFloorData:any[]=[];
  accordionSubDepartment:any[]=[];
  enumSubDepartment:any[]=[];
  selectedSubDepartmentId:number|null=null;
  selectedSubDepartmentCode:string="";
  chartImg: any[] = [];
  selectedblId:number|null=null;
  selectedflId:number|null=null;
  selectedblCode:string="";
  selectedflCode:string="";
  blockDefs: ElementRef | undefined;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: FormBuilder,
    private blSrv: BuildingService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
    private subDeptService: SubDepartmentService
  ) {
    this.filterPanel = this.formBuilder.group({
      subDepId :[null,[Validators.required]]
    });
   }

  ngOnInit(): void {
    this.loadAllFloorData();
    this.loadAllSubDepartments();
  }

  loadAllSubDepartments(){
    this.subDeptService.getAllSubDepartments().subscribe((res: any) => {
      if (res) {
        this.enumSubDepartment = res.map((each:any)=>{ each.name= each.divisionDivCode+"-"+each.departmentDepCode+"-"+each.subDepCode; return each;});
        this.accordionSubDepartment=[...this.enumSubDepartment];
        this.enumSubDepartment.unshift({ name: 'Make a Selection', depId: null, divId: null, subDepId: null });
      }
    })
  }

  loadAllFloorData(){
    let data={
      depId:null,
      divId:null,
      subDepId:null
    }
    this.subDeptService.getSubDepartmentAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithSubDept = res;
    })
  }

  onSearch(){
    this.accordionSubDepartment=[];
    this.subdepartmentFloorData = [];
    this.cdr.detectChanges();
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedSubDepartmentCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedSubDepartmentId=null;
    this.viewSvg= false;
    this.showSpinner= false;
    let subDepId = this.filterPanel.controls.subDepId.value;
    if(subDepId!=null){
      let filterData = this.enumSubDepartment.filter((each:any)=> each.subDepId==subDepId);
      this.accordionSubDepartment = [...filterData];
    }else{
      let filterData = this.enumSubDepartment.filter((each:any)=> each.subDepId!=null);
      this.accordionSubDepartment = [...filterData];
    }
  }

  onClear(){
    this.enumSubDepartment=[];
    this.displayNoFloorPlanInfo= false;
    this.viewSvg= false;
    this.showSpinner= false;
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.allFloorsWithSubDept =[];
    this.subdepartmentFloorData=[];
    this.accordionSubDepartment=[];
    this.selectedSubDepartmentId=null;
    this.selectedSubDepartmentCode="";
    this.filterPanel.patchValue({
      subDepId :null
    });
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.loadAllFloorData();
    this.loadAllSubDepartments();
  }

  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    let color = this.getSubDepartmentColor(event.data.subDepId);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedblCode = event.data.blCode;
    this.selectedflCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"subDepartment",this.selectedSubDepartmentId,null)
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }

  onTabClose(event:any){
    this.subdepartmentFloorData = [];
    this.selectedSubDepartmentId=null;
    this.selectedSubDepartmentCode="";
  }

  onTabOpen(event:any){
    this.subdepartmentFloorData = [];
    this.selectedSubDepartmentId=null;
    this.selectedSubDepartmentCode="";
    let selectedTab = this.accordionSubDepartment[event.index];
    this.subdepartmentFloorData = this.allFloorsWithSubDept.filter((each:any)=> each.subDepId== selectedTab.subDepId);
    this.selectedSubDepartmentId = selectedTab.subDepId;
    this.selectedSubDepartmentCode=selectedTab.subDepCode;
  }

  getSubDepartmentColor(subDepId:any){
    let departmentDetails = this.accordionSubDepartment.filter((each:any)=> each.subDepId== subDepId);
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
    if(this.selectedSubDepartmentCode!=""){
      titlestring = this.selectedSubDepartmentCode
    }else{
      titlestring = "Sub Department"
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


  getTotalAreaofSubDepartment(divId:any,depId:any,subDepId:any){
    let area=0;
    this.allFloorsWithSubDept.forEach((dept:any)=>{
      if(dept.depId==depId && dept.divId==divId && dept.subDepId==subDepId){
        area += dept.totalArea
      }
    });
    return area;
  }

}
