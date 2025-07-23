import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingFilterInput } from '../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { DivisionService } from '../division-department/services/division.services';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { DepartmentService } from '../division-department/services/department.services';
import { forkJoin } from 'rxjs';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';

@Component({
  selector: 'app-div-dept-svg',
  templateUrl: './div-dept-svg.component.html',
  styleUrls: ['./div-dept-svg.component.scss'],
  providers: [MessageService]
})
export class DivDeptSvgComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  compId!: number;
  allBl: any[] = [];
  enumBL: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  rowCount: number = 5;
  viewSvg: boolean = false;
  fileString: string = '';
  showSpinner: boolean = false;
  displayNoFloorPlanInfo:boolean = false;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  showdepttable:boolean = false;
  selectedDivision:string='';
  selectedDepartment:string='';
  selectedSvgElementIds :any[]=[];
  allSVGRoomsData:any[]=[];
  allowSave:boolean = false;
  divdata:any[]=[];
  deptdata:any[]=[];
  selectionMessage:string='';
  selectionHighlightColor:string='';
  selectedRoomsMessage:string='';
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private svgViewSrv: SvgViewService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private divisionservice:DivisionService,
    private departmentservice:DepartmentService
  ) { 
    this.filterPanel = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadAllBuilding();
    this.loadAllFloor();
    this.loadAllDivision();
  }

  loadAllBuilding() {
    this.blServ.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      this.enumBL = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
    });
  }

  loadAllFloor() {
    this.blServ.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL = res.map((i: any) => { i.name = i.blId + '-' + i.id + ' - ' + i.name; return i; });
      this.enumAllFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.enumFL = this.enumAllFL;
    });
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
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
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
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    }
  }

  loadAllDivision(){
    this.divisionservice.getAllDivisions().subscribe((res:any)=>{
      if(res){
        this.divdata = res;
      }
    });
  }

  onSearch(){
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    this.selectedSvgElementIds=[];
    this.selectionMessage='';
    this.selectionHighlightColor='';
    this.selectedRoomsMessage='';
    this.displayNoFloorPlanInfo = false;
    this.allowSave = false;
    this.showdepttable= false;
    this.selectedDivision='';
    this.selectedDepartment='';
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
            this.selectionMessage = "Please select Division/Department";
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
    this.allSVGRoomsData=[];
    let data={
      id:'',
      name:'',
      blId:blId,
      flId:flId,
      svgElementId:'',
      compId:this.compId
    }
    this.blServ.getrmwithdivordepcolor(data).subscribe((res:any)=>{
      if(res){
        this.allSVGRoomsData = res.filter( (each:any) => each.svgElementId!=null);
        this.allSVGRoomsData.forEach((rm:any)=>{
          let labeldata =[];
          if(rm.depId!=null && rm.depId!=''){
            // labeldata.push(`Department:${rm.depId}`);
            labeldata.push(rm.depId);
          }
          if(rm.divId!=null && rm.divId!=''){
            // labeldata.push(`Division:${rm.divId}`);
            labeldata.push(rm.divId);
          }
          // labeldata.push(`RoomId:${rm.rmId}`);
          labeldata.push(rm.rmId);
          let idObj:SvgElementIdType ={
            roomElementId:rm.svgElementId,
            assetElementId :null
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
      }
    })
  }

  onClear(){
    this.viewSvg= false;
    this.showSpinner = false;
    this.displayNoFloorPlanInfo = false;
    this.selectedSvgElementIds =[];
    this.svgRoomData  = new SvgRoomData(null,null,"",[]);
    this.showdepttable= false;
    this.selectedDivision='';
    this.selectedDepartment='';
    this.allSVGRoomsData=[];
    this.allowSave = false;
    this.filterPanel.patchValue({
      blId:null,
      flId: null,
    });
    this.selectionMessage='';
    this.selectionHighlightColor='';
    this.selectedRoomsMessage='';
  }

  onAssigntoRooms(){
    this.messageService.clear();
    let saveRoomData:any[]=[];
    const saveRequests:any[] = [];
    this.selectedSvgElementIds.forEach((id:string)=>{
      const matchingObj = this.allSVGRoomsData.find(rm => rm.svgElementId ==id);
      if(matchingObj){
        saveRoomData.push(matchingObj);
      }
    })
    saveRoomData.forEach((room:any)=>{
      if(this.selectedDivision!=''){
        room.divId = this.selectedDivision;
      }
      if(this.selectedDepartment!='')
      {
        room.depId = this.selectedDepartment;
      }else{
        room.depId = null;
      }
      saveRequests.push(this.blServ.updateRoomProp(room));
    })
    forkJoin(saveRequests)
      .subscribe((res: any[]) => {
        this.messageService.add({ key: 'divdeptsvgMsg', severity: 'success', summary: 'Record updated', detail: 'Room updated successfully' });
        this.onSearch();
      }, (error: any) => {
        console.error('Failed to save records:', error);
      });
  }

  // userConfirm(){
  //   let msg ='';
  //   if(this.selectedDivision!='' && this.selectedDepartment!=''){
  //     msg = 'Are you sure that you want to assign Division: '+this.selectedDivision+' and Department: '+
  //     this.selectedDepartment +' to the selected rooms?'
  //   }
  //   else if (this.selectedDivision!='' && this.selectedDepartment==''){
  //     msg = 'Are you sure that you want to assign Division: '+this.selectedDivision+' to the selected rooms?'
  //   }
  //   this.confirmationService.confirm({
  //     message: msg,
  //     header: 'Confirmation',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.onAssigntoRooms();
  //     },
  //     key: "divdeptsvgGrid"
  //   });
  // }

  roomOnClickListener(elementN: any){
    if(this.allowSave){
      this.selectedRoomsMessage = '';
    let svgelid ='';
    if(elementN.startsWith("label")){
      svgelid = elementN.substring("label_".length)
    }else{
      svgelid = elementN;
    }
    if(!this.selectedSvgElementIds.includes(svgelid)){
      this.selectedSvgElementIds.push(svgelid);
    }
    this.selectedSvgElementIds.forEach((id:string)=>{
      this.svgRoomData.content.forEach((svgData:any)=>{
        if(svgData.svgElementId.roomElementId==id){
          svgData.highlightRoom=true;
          svgData.color.roomColor=this.selectionHighlightColor;
          if(this.selectedRoomsMessage.length==0){
            this.selectedRoomsMessage += "Selected Rooms : " + svgData.rmId;
          }else{
            this.selectedRoomsMessage += ", "+svgData.rmId;
          }
        }
      })
    })
    this.cdr.detectChanges();
    this.svgViewComp.loadByDetails();
    }
  }

  ondivrowselect(event:any){
    this.deptdata=[];
    this.showdepttable = true;
    this.allowSave = true;
    this.selectedDivision = event.data.divId;
    this.selectionHighlightColor = event.data.highlightColor;
    this.selectionMessage ="Please select a room assign to : "+this.selectedDivision;
    let data={
      depId:'',
      description:'',
      depHead:'',
      divId:event.data.divId,
    }
    this.departmentservice.getDepartmentList(data).subscribe((res:any)=>{
      if(res){
        this.deptdata = res;
      }
    })
  }
  ondeptrowselect(event:any){
    this.selectedDepartment = event.data.depId;
    this.allowSave = true;
    this.selectionHighlightColor = event.data.highlightColor;
    this.selectionMessage ="Please select a room  assign to "+this.selectedDivision+" | "+ this.selectedDepartment;
    if(this.selectedSvgElementIds.length>0){
      this.selectedSvgElementIds.forEach((id:string)=>{
        this.svgRoomData.content.forEach((svgData:any)=>{
          if(svgData.svgElementId.roomElementId==id){
            svgData.highlightRoom=true;
            svgData.color.roomColor=this.selectionHighlightColor;
          }
        })
      })
      this.cdr.detectChanges();
      this.svgViewComp.loadByDetails();
    }
  }

  onCancelSelection(){
    this.onSearch();
  }
}
