import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { RmcatService } from 'src/app/services/rmcat.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-highlight-by-rmtype',
  templateUrl: './highlight-by-rmtype.component.html',
  styleUrls: ['./highlight-by-rmtype.component.scss'],
  providers: [MessageService]
})
export class HighlightByRmtypeComponent {
  enumRmType:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithRmType :any[]=[];
  rmtypeFloorData:any[]=[];
  accordionRmType:any[]=[];
  selectedRmType:string ="";
  selectedrmtypeId:number|null=null
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
    private svgViewSrv: SvgViewService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
    private rmcatSrv : RmcatService
  ) {
    this.filterPanel = this.formBuilder.group({
      rmType :[null,[Validators.required]]
    });
   }

   ngOnInit(): void {
    this.loadAllFloorData();
    this.loadAllRmType();
  }

  loadAllRmType(){
    this.rmcatSrv.getRmTypeList({}).subscribe((res:any)=>{
      this.enumRmType = res.map((each:any)=>{each.name=each.rmcatRmCat+"-"+each.rmType; return each;} );;
      this.accordionRmType = [...this.enumRmType];
      this.enumRmType.unshift({rmtypeId:null,name:'Make a selection',rmcatId:null})
    });
  }

  loadAllFloorData(){
    let data={
      rmtypeId:null,
      rmcatId:null,
    }
    this.rmcatSrv.getRmTypeAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithRmType = res;
    })
  }
  
  onSearch(){
    this.accordionRmType=[];
    this.rmtypeFloorData = [];
    this.cdr.detectChanges();
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedRmType="";
    this.selectedrmtypeId=null;
    this.viewSvg= false;
    this.showSpinner= false;
    this.svgRoomData = new SvgRoomData(null,null,"",[]);
    let rmtypeId = this.filterPanel.controls.rmType.value;
    if( rmtypeId!=null){
      let filterData = this.enumRmType.filter((each:any)=> each.rmtypeId==rmtypeId);
      this.accordionRmType = [...filterData];
    }else{
      let filterData = this.enumRmType.filter((each:any)=> each.rmtypeId!=null);
      this.accordionRmType = [...filterData];
    }
  }

  onClear(){
    this.enumRmType=[];
    this.displayNoFloorPlanInfo= false;
    this.svgRoomData = new SvgRoomData(null,null,"",[]);
    this.viewSvg= false;
    this.showSpinner= false;
    this.allFloorsWithRmType =[];
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.rmtypeFloorData=[];
    this.accordionRmType=[];
    this.selectedRmType="";
    this.selectedrmtypeId=null;
    this.filterPanel.patchValue({
      rmType :null
    });
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedblId=null;
    this.selectedflId=null;
    this.loadAllFloorData();
    this.loadAllRmType();
  }
  

  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    let color = this.getRmTypeColor(event.data.rmtypeId);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedblCode = event.data.blCode;
    this.selectedflCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"rmtype",this.selectedrmtypeId,null)
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }

  onTabClose(event:any){
    this.rmtypeFloorData = [];
    this.selectedRmType="";
  }

  onTabOpen(event:any){
    this.rmtypeFloorData = [];
    this.selectedRmType="";
    let selectedTab = this.accordionRmType[event.index];
    this.rmtypeFloorData = this.allFloorsWithRmType.filter((each:any)=> each.rmtypeId== selectedTab.rmtypeId);
    this.selectedRmType = selectedTab.rmType;
    this.selectedrmtypeId = selectedTab.rmtypeId;
  }

  getRmTypeColor(rmtypeId:any){
    let rmtypeDetails = this.accordionRmType.filter((each:any)=> each.rmtypeId== rmtypeId);
    let rmtypeColor = rmtypeDetails[0].highlightColor;
    return rmtypeColor;
  }

  exportToPdf(){
    this.showSpinner = true;
    this.spinner.show();
    this.cdr.detectChanges();
    setTimeout(() => {
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
    },200);
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    let titlestring ="";
    if(this.selectedRmType!=""){
      titlestring = this.selectedRmType
    }else{
      titlestring = "Room Type"
    }
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${titlestring}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlightrmtypemsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
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

  getTotalAreaofRmType(rmcatId:any,rmtypeId:any){
    let area=0;
    this.allFloorsWithRmType.forEach((rmtype:any)=>{
      if(rmtype.rmcatId==rmcatId && rmtype.rmtypeId==rmtypeId){
        area += rmtype.totalArea
      }
    });
    return area;
  }
}
