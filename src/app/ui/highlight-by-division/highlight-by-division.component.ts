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
import { DivisionService } from '../division-department/services/division.services';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-highlight-by-division',
  templateUrl: './highlight-by-division.component.html',
  styleUrls: ['./highlight-by-division.component.scss'],
  providers: [MessageService]
})
export class HighlightByDivisionComponent implements OnInit{
  enumDivision:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithDiv :any[]=[];
  divisionFloorData:any[]=[];
  accordionDivision:any[]=[];
  selectedDivisionId:number|null =null;
  selectedDivisionCode:string="";
  selectedBlCode:string="";
  selectedFlCode:string="";
  chartImg: any[] = [];
  selectedblId:number|null =null;
  selectedflId:number|null =null;
  blockDefs: ElementRef | undefined;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: FormBuilder,
    private divisionSrv : DivisionService,
    private blSrv: BuildingService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService
  ) {
    this.filterPanel = this.formBuilder.group({
      divId :[null,[Validators.required]]
    });
   }

   ngOnInit(): void {
    this.loadAllFloorData();
    this.loadAllDivisions();
  }
 
  loadAllDivisions(){
    this.divisionSrv.getAllDivisions().subscribe((res:any)=>{
      this.enumDivision = res;
      this.accordionDivision = [...this.enumDivision];
      this.enumDivision.unshift({divId:null,divCode:'Make a selection'})
    });
  }

  loadAllFloorData(){
    let data={
      divId:null,
      description:'',
      divHead:null
    }
    this.divisionSrv.getDivisionAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithDiv = res;
    })
  }
  
  onSearch(){
    this.accordionDivision=[];
    this.divisionFloorData = [];
    this.cdr.detectChanges();
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedDivisionId=null;
    this.viewSvg= false;
    this.showSpinner= false;
    let divId = this.filterPanel.controls.divId.value;
    if(divId!=null){
      let filterData = this.enumDivision.filter((each:any)=> each.divId==divId);
      this.accordionDivision = [...filterData];
    }else{
      let filterData = this.enumDivision.filter((each:any)=> each.divId!=null);
      this.accordionDivision = [...filterData];
    }
  }

  onClear(){
    this.enumDivision=[];
    this.displayNoFloorPlanInfo= false;
    this.viewSvg= false;
    this.showSpinner= false;
    this.svgInputData  = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.allFloorsWithDiv =[];
    this.divisionFloorData=[];
    this.accordionDivision=[];
    this.selectedDivisionId=null;
    this.filterPanel.patchValue({
      divId :null
    });
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedBlCode="";
    this.selectedFlCode="";
    this.selectedDivisionCode="";
    this.loadAllFloorData();
    this.loadAllDivisions();
  }

  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    let color = this.getDivisionColor(event.data.divId);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedBlCode = event.data.blCode;
    this.selectedFlCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"division",this.selectedDivisionId,null)
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }

  onTabClose(event:any){
    this.divisionFloorData = [];
    this.selectedDivisionId=null;
    this.selectedDivisionCode="";
  }

  onTabOpen(event:any){
    this.divisionFloorData = [];
    this.selectedDivisionId=null;
    let selectedTab = this.accordionDivision[event.index];
    this.divisionFloorData = this.allFloorsWithDiv.filter((each:any)=> each.divId== selectedTab.divId);
    this.selectedDivisionId = selectedTab.divId;
    this.selectedDivisionCode = selectedTab.divCode;
  }

  getDivisionColor(divId:any){
    let divisionDetails = this.accordionDivision.filter((each:any)=> each.divId== divId);
    let divColor = divisionDetails[0].highlightColor;
    return divColor;
  }

  exportToPdf(){
    this.showSpinner = true;
    this.spinner.show();
    this.cdr.detectChanges();
    setTimeout(() => {
      if (this.contentElement) {
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
      }else{
        this.spinner.hide();
        this.showSpinner = false;
      }
    },200)
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    let titlestring ="";
    if(this.selectedDivisionCode!=''){
      titlestring = this.selectedDivisionCode
    }else{
      titlestring = "Division"
    }
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${titlestring}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlightdivmsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
        var file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
  }

  getSelectedBlandFlHeader(){
    return `Building: ${this.selectedBlCode} | Floor: ${this.selectedFlCode}`;
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

  getTotalAreaofDivision(divId:any){
    let area=0;
    this.allFloorsWithDiv.forEach((div:any)=>{
      if(div.divId==divId){
        area += div.totalArea
      }
    });
    return area;
  }
}
