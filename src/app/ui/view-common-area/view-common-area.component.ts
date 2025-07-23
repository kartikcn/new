import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { Accordion } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingService } from '../background-loc/services/bl.service';
import { BookingService } from '../booking/services/booking.services';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-view-common-area',
  templateUrl: './view-common-area.component.html',
  styleUrls: ['./view-common-area.component.scss'],
  providers: [MessageService]
})
export class ViewCommonAreaComponent {
  enumDivision:any[]=[];
  displayNoFloorPlanInfo:boolean = false;
  filterPanel!: FormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('accordion',{ static: false }) accordion!: Accordion;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  rowCount: number = UtilConstant.ROW_COUNT_FIVE_LIMIT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  allFloorsWithCommonArea :any[]=[];
  commonareaFloorData:any[]=[];
  accordionCommonArea:any[]=[];
  selectedCommonAreaId:string="" ;
  chartImg: any[] = [];
  selectedblId:number|null=null;
  selectedflId:number|null=null;
  selectedblCode:string="";
  selectedflCode:string="";
  blockDefs: ElementRef | undefined;
  enumCommonArea:any[]=[];
  enumKeyNoneType:string='';
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private enumsrv: EnumService,
    private blSrv: BuildingService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private bookingSrv: BookingService,
  ){
    this.filterPanel = this.formBuilder.group({
      commonAreaType :[null]
    });
  }

  ngOnInit(): void {
    this.loadCommonAreaDetails();
    this.loadCommonAreaEnums();
  }

  loadCommonAreaEnums(){
    this.enumsrv.getEnums().subscribe((res:any)=>{
      let enumAllCommonAreas = res.filter((t:any) =>t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase()
      && t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase());
      let notNoneCommonArea = enumAllCommonAreas.filter((t:any) => t.enumValue.toLocaleUpperCase()!== 'None'.toLocaleUpperCase());
      let noneCommonArea = enumAllCommonAreas.filter((t:any) => t.enumValue.toLocaleUpperCase() == 'None'.toLocaleUpperCase());
      this.enumKeyNoneType = noneCommonArea[0].enumKey;
      this.enumCommonArea = [...notNoneCommonArea];
      this.enumCommonArea.forEach((each:any)=>{
          if(each.enumValue =='Floor Level'){
            each.highlightColor = "#ff6666";
          }
          else if(each.enumValue=='Building Level'){
            each.highlightColor = "#6666ff";
          }
          else if (each.enumValue=='Site Level'){
            each.highlightColor = "#66ff66";
          }
        })
      this.accordionCommonArea = [...this.enumCommonArea];
      this.enumCommonArea.unshift({enumKey:null,enumValue:'Make a selection'});
    })
  }
  
  loadCommonAreaDetails(){
    let data ={
      commonAreaType : this.filterPanel.controls.commonAreaType.value
    }
     this.blSrv.getCommonAreaByFloor(data).subscribe((res:any)=>{
      this.allFloorsWithCommonArea = res.filter((each:any)=> each.totalArea!= null && each.totalArea!=0);
     })
  }

  onSearch(){
    this.accordionCommonArea=[];
    this.commonareaFloorData = [];
    this.cdr.detectChanges();
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedCommonAreaId="";
    this.viewSvg= false;
    this.showSpinner= false;
    let commonAreaType = this.filterPanel.controls.commonAreaType.value;
    if(commonAreaType!=null){
      let filterData = this.enumCommonArea.filter((each:any)=> each.enumKey==commonAreaType);
      this.accordionCommonArea = [...filterData];
    }else{
      let filterData = this.enumCommonArea.filter((each:any)=> each.enumKey!=null);
      this.accordionCommonArea = [...filterData];
    }
  }
  onClear(){
    this.enumCommonArea=[];
    this.displayNoFloorPlanInfo= false;
    this.viewSvg= false;
    this.showSpinner= false;
    this.allFloorsWithCommonArea =[];
    this.commonareaFloorData=[];
    this.accordionCommonArea=[];
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.selectedCommonAreaId="";
    this.filterPanel.patchValue({
      commonAreaType :null
    });
    this.selectedblId=null;
    this.selectedflId=null;
    this.selectedblCode="";
    this.selectedflCode="";
    this.cdr.detectChanges();
    this.loadCommonAreaDetails();
    this.loadCommonAreaEnums();
  }

  onTabOpen(event:any){
    this.commonareaFloorData = [];
    this.selectedCommonAreaId ="";
    let selectedTab = this.accordionCommonArea[event.index];
    this.commonareaFloorData = this.allFloorsWithCommonArea.filter((each:any)=> each.commonAreaType== selectedTab.enumKey);
    this.selectedCommonAreaId = selectedTab.enumKey;
  }
  onTabClose(event:any){
    this.commonareaFloorData = [];
    this.selectedCommonAreaId = "";
  }
  onViewSVGForFloor(event:any){
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    let color = this.getCommonAreaColor(event.data.commonAreaType);
    this.selectedblId = event.data.blId;
    this.selectedflId = event.data.flId;
    this.selectedblCode = event.data.blCode;
    this.selectedflCode = event.data.flCode;
    if(event.data.blId!=null && event.data.flId!=null){
      this.svgInputData =  new SvgRoomDataInput(event.data.blId,event.data.flId,null,false,false,false,true,false,"",null,color,"commonArea",this.selectedCommonAreaId,null)
      this.viewSvg = true;
    }else{
      this.displayNoFloorPlanInfo = true;
    }
  }
  
  getTotalAreaofCommonArea(ca:any){
    let area=0;
    this.allFloorsWithCommonArea.forEach((data:any)=>{
      if(data.commonAreaType==ca && data.totalArea!=null){
        area += data.totalArea
      }
    });
    return area;
  }

  getvaluefromid(id:any){
    let result = this.enumCommonArea.filter( each => each.enumKey==id);
    return result[0].enumValue;
  }

  getCommonAreaColor(id:any){
    let caDetails = this.accordionCommonArea.filter((each:any)=> each.enumKey==id);
    let caColor = caDetails[0].highlightColor;
    return caColor;
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
    }, 200);
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    let titlestring ="";
    if(this.selectedCommonAreaId!=""){
      titlestring = this.getvaluefromid(this.selectedCommonAreaId) + " Common Area"
    }else{
      titlestring = "Common Area"
    }
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${titlestring}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlightcamsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
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
  
}
