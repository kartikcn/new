import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgViewComponent } from '../svg-view/svg-view.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { BookingService } from '../booking/services/booking.services';
import { UtilConstant } from 'src/common/UtilConstant';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';


@Component({
  selector: 'app-highlight-rooms',
  templateUrl: './highlight-rooms.component.html',
  styleUrls: ['./highlight-rooms.component.scss'],
  providers: [MessageService]
})
export class HighlightRoomsComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  @ViewChild('content', { static: false }) contentElement!: ElementRef;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  compId!: number;
  allBl: any[] = [];
  enumBL: any[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  enumParam:any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  viewSvg: boolean = false;
  fileString: string = '';
  showSpinner: boolean = false;
  displayNoFloorPlanInfo:boolean = false;
  allSVGRoomsData:any[]=[];
  selectedParamData:any[]=[];
  selectedParamName:string=''
  showSecondParam:boolean = false;
  selectedSecondParamName:string='';
  chartImg: any[] = [];
  blockDefs: ElementRef | undefined;
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private svgViewSrv: SvgViewService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private bookingSrv: BookingService,
  ) { 
    this.filterPanel = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
      parameter :[null,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadAllBuilding();
    this.loadAllFloor();
    this.loadAllParameters();
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

  loadAllParameters(){
    this.enumParam.push({id:'',name:'Make a selection'});
    this.enumParam.push({id:'division',name:'Division'});
    this.enumParam.push({id:'department',name:'Department'});
    this.enumParam.push({id:'rmcat',name:'Room Category'});
    this.enumParam.push({id:'rmtype',name:'Room Type'});
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

  onSearch(){
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    this.selectedParamName = this.getParameterName(this.filterPanel.controls.parameter.value)
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    this.getAllRoomsOfSvg(blId,flId);
    let flData = this.enumFL.filter((i: any) => i.blId == blId && i.id == flId);
    //@ts-ignore
    if (flData[0].svgName != null) {
      let data = {
        id: flId,
        blId: blId,
        name: '',
        compId: this.compId,
        svgName: '',
        flInfo: '',
        units:''
      }
      this.svgViewSrv.getSVGFile(data).subscribe((res: any) => {
        if (res.code != 409) {
          setTimeout(()=>{
            this.fileString = res.fileContent;
            this.viewSvg = true;
            this.cdr.detectChanges();
            this.spinner.hide();
            this.showSpinner = false;
          },0)
        }
        else{
          this.spinner.hide();
          this.showSpinner = false;
          this.displayNoFloorPlanInfo = true;
        }
      })
    } else {
      this.spinner.hide();
      this.showSpinner = false;
      this.displayNoFloorPlanInfo = true;
    }
  }

  getAllRoomsOfSvg(blId:string,flId:string){
    this.svgRoomData  = new SvgRoomData(null,null,"",[]);
    this.selectedParamData=[];
    this.allSVGRoomsData=[];
    let selectedparam = this.filterPanel.controls.parameter.value;
    let parameterName='';
    let allParamData=[];
    if(selectedparam.toLowerCase()=='division'){
      parameterName='division';
      this.showSecondParam = false;
    }
    else if(selectedparam.toLowerCase()=='department'){
      parameterName='department';
      this.showSecondParam = true;
      this.selectedSecondParamName='Division';
    }
    else if(selectedparam.toLowerCase()=='rmcat'){
      parameterName='rmcat';
      this.showSecondParam = false;
    }
    else if(selectedparam.toLowerCase()=='rmtype'){
      parameterName='rmtype';
      this.showSecondParam = true;
      this.selectedSecondParamName='Room Category';
    }
    let data={
      id:'',
      name:'',
      blId:blId,
      flId:flId,
      svgElementId:'',
      compId:this.compId,
      parameterName:parameterName
    }
    this.blServ.getrmwithparametercolor(data).subscribe((res:any)=>{
      if(res){
        this.allSVGRoomsData = res.filter( (each:any) => each.svgElementId!=null);
        this.allSVGRoomsData.forEach((rm:any)=>{
          let labeldata =[];
          if(parameterName=='division'){
            labeldata.push(rm.divId);
          }else if(parameterName=='department'){
            labeldata.push(rm.depId);
            labeldata.push(rm.divId);
          }else if(parameterName=='rmcat'){
            labeldata.push(rm.rmCat);
          }else if(parameterName=='rmtype'){
            labeldata.push(rm.rmType);
            labeldata.push(rm.rmCat);
          }
          labeldata.push(rm.rmId);
          let idObj:SvgElementIdType ={
            roomElementId:rm.svgElementId,
            assetElementId : null
          }
          let colorObj: SvgElementColorType ={
            roomColor:rm.highlightColor,
            assetColor: null
          }
          let contentData:SvgRoomContentData ={
            blId:parseInt(blId),
            flId:parseInt(flId),
            rmId:rm.rmId,
            label:[...labeldata],
            showLabel:true,
            highlightRoom:rm.highlightColor!=null?true:false,
            svgElementId : idObj,
            color:colorObj,
            rmCode:'',
            zoomAtRoom:false
          }
          this.svgRoomData.content.push(contentData);
        })
        this.svgRoomData.blId = parseInt(blId);
        this.svgRoomData.flId = parseInt(flId);
        this.svgRoomData.locate = "room";
        allParamData = this.allSVGRoomsData.map((rm:any)=>{
            let paramname='';
            let secondparamname='';
            if(parameterName=='division'){
              paramname=rm.divId;
            }else if(parameterName=='department'){
              paramname=rm.depId;
              secondparamname= rm.divId;
            }else if(parameterName=='rmcat'){
              paramname=rm.rmCat;
            }else if(parameterName=='rmtype'){
              paramname=rm.rmType;
              secondparamname= rm.rmCat;
            }
            return {
              paramname:paramname,
              highlightColor:rm.highlightColor,
              area:rm.rmArea,
              secondparamname:secondparamname
            }
          });
          const paramnameMap: { [paramname: string]: {
            paramname: string;
            area: number;
            highlightColor: string;
            secondparamname: string;
          }} = {};   
          for (const obj of allParamData) {
            const { paramname, area, highlightColor, secondparamname } = obj;
            if (paramname === null) {
              continue;
            }
            if (!paramnameMap[paramname]) {
              paramnameMap[paramname] = {
                paramname,
                area: area,
                highlightColor,
                secondparamname
              };
            }
            else 
              paramnameMap[paramname].area += area;
          }
          this.selectedParamData = Object.values(paramnameMap);
      }
    })
  }

  onClear(){
    this.viewSvg= false;
    this.showSpinner = false;
    this.displayNoFloorPlanInfo = false;
    this.svgRoomData  = new SvgRoomData(null,null,"",[]);
    this.allSVGRoomsData=[];
    this.selectedParamData=[];
    this.filterPanel.patchValue({
      blId:null,
      flId: null,
      parameter:null
    });
    this.selectedParamName='';
    this.viewSvg = false;
    this.fileString = '';
    this.showSpinner= false;
    this.displayNoFloorPlanInfo = false;
  }

  getParameterName(id:string){
    let paramobj = this.enumParam.filter((each:any)=> each.id==id);
    if(paramobj.length>0){
      return paramobj[0].name;
    }else{
      return '';
    }
  }

  exportToPdf(){
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
  }

  printPDF() {
    this.messageService.clear();
    let headerstring = this.getSelectedBlandFlHeader();
    var reportDetails: any = {
      chartImg: this.chartImg,
      title: `Hightlight Rooms by ${this.selectedParamName}`,
      heading :headerstring
    }
    this.bookingSrv.printPdf(reportDetails).subscribe((res: any) => {
      if (res != null) {
        this.messageService.add({ key: 'highlingroomsmsg', severity: 'success', summary: 'PDF Created', detail: 'PDF created successfully' });
        var file = new Blob([res], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    })
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
  
  getSelectedBlandFlHeader(){
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let blstring ='';
    let flstring = '';
    let bldata = this.enumBL.filter((i: any) =>  i.id == blId );
    let fldata = this.enumFL.filter((i: any) =>  i.id == flId );
    if(bldata[0].name != null && bldata[0].name != ''){
      blstring = `Building: ${bldata[0].id} - ${bldata[0].name}`;
    }else{
      blstring = `Building: ${bldata[0].id}`;
    }
    if(fldata[0].name != null && fldata[0].name != ''){
      flstring = ` | Floor: ${fldata[0].id} - ${fldata[0].name}`;
    }else{
      flstring = ` | Floor: ${fldata[0].id}`;
    }
    return `${blstring}${flstring}`;
  }

}
