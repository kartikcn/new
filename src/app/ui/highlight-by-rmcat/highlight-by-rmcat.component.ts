import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { RmcatService } from 'src/app/services/rmcat.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-highlight-by-rmcat',
  templateUrl: './highlight-by-rmcat.component.html',
  styleUrls: ['./highlight-by-rmcat.component.scss'],
  providers: [MessageService]
})
export class HighlightByRmcatComponent implements OnInit{
  enumRmCat:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithRmCat :any[]=[];
  rmcatFloorData:any[]=[];
  accordionRmCat:any[]=[];
  selectedRmcat:string ="";
  selectedRmCatId:number|null=null;
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
      rmCat :[null,[Validators.required]]
    });
   }

   ngOnInit(): void {
    this.loadAllFloorData();
    this.loadAllRmCat();
    // this.loadAllRooms();
  }

  loadAllRmCat(){
    this.rmcatSrv.getALLRmcats().subscribe((res:any)=>{
      this.enumRmCat = res;
      this.accordionRmCat = [...this.enumRmCat];
      this.enumRmCat.unshift({rmcatId:null,rmCat:'Make a selection'});
    });
  }

  loadAllFloorData(){
    let data={
      rmcatId:null,
      rmCat:'',
      rmCatDesc:'',
      highlightColor:''
    }
    this.rmcatSrv.getRmCatAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithRmCat = res;
    })
  }
  
  onSearch(){
    this.accordionRmCat=[];
    this.rmcatFloorData = [];
    this.cdr.detectChanges();
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedblCode="";
    this.selectedflCode="";
    this.selectedRmcat="";
    this.selectedRmCatId=null;
    this.viewSvg= false;
    this.showSpinner= false;
    let rmcatId = this.filterPanel.controls.rmCat.value;
    if(rmcatId!=null){
      let filterData = this.enumRmCat.filter((each:any)=> each.rmcatId==rmcatId);
      this.accordionRmCat = [...filterData];
    }else{
      let filterData = this.enumRmCat.filter((each:any)=> each.rmcatId!=null);
      this.accordionRmCat = [...filterData];
    }
  }

  onClear(){
    this.enumRmCat=[];
    this.displayNoFloorPlanInfo= false;
    this.viewSvg= false;
    this.showSpinner= false;
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.allFloorsWithRmCat =[];
    this.rmcatFloorData=[];
    this.accordionRmCat=[];
    this.selectedRmcat="";
    this.filterPanel.patchValue({
      rmCat :null
    });
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedblCode="";
    this.selectedflCode="";
    this.loadAllFloorData();
    this.loadAllRmCat();
  }
  

  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    let color = this.getRmCatColor(event.data.rmcatId);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedblCode = event.data.blCode;
    this.selectedflCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"rmcat",this.selectedRmCatId,null);
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }

  onTabClose(event:any){
    this.rmcatFloorData = [];
    this.selectedRmcat="";
    this.selectedRmCatId =null;
  }

  onTabOpen(event:any){
    this.rmcatFloorData = [];
    this.selectedRmcat="";
    this.selectedRmCatId =null;
    let selectedTab = this.accordionRmCat[event.index];
    this.rmcatFloorData = this.allFloorsWithRmCat.filter((each:any)=> each.rmcatId== selectedTab.rmcatId);
    this.selectedRmcat = selectedTab.rmCat;
    this.selectedRmCatId = selectedTab.rmcatId;
  }

  getRmCatColor(rmcatId:any){
    let rmcatDetails = this.accordionRmCat.filter((each:any)=> each.rmcatId== rmcatId);
    let rmcatColor = rmcatDetails[0].highlightColor;
    return rmcatColor;
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
    },200)
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    let titlestring ="";
    if(this.selectedRmcat!=""){
      titlestring = this.selectedRmcat
    }else{
      titlestring = "Room Category"
    }
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${titlestring}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlightrmcatmsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
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

  getTotalAreaofRmCat(rmcatId:any){
    let area=0;
    this.allFloorsWithRmCat.forEach((rmcat:any)=>{
      if(rmcat.rmcatId==rmcatId){
        area += rmcat.totalArea
      }
    });
    return area;
  }
}
