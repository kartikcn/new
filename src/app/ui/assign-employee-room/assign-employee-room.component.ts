import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingFilterInput } from '../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeService } from '../employee/services/employee.service';
import { EmployeeOutput } from '../user/model/employeOutput.model';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';

@Component({
  selector: 'app-assign-employee-room',
  templateUrl: './assign-employee-room.component.html',
  styleUrls: ['./assign-employee-room.component.scss'],
  providers: [MessageService]
})
export class AssignEmployeeRoomComponent {
  filterPanel!: UntypedFormGroup;
  compId!: number;
  allBl: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  rowCount: number = 5;
  viewSvg: boolean = false;
  fileString: string = '';
  showSpinner: boolean = false;
  displayNoFloorPlanInfo:boolean = false;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  rmcatdata:any[]=[];
  rmtypeData:any[]=[];
  showrmtypetable:boolean = false;
  selectedRmCat:string='';
  selectedRmType:string='';
  selectedSvgElementId :string ='';
  allSVGRoomsData:any[]=[];
  allowSave:boolean = false;
  selectionMessage:string='';
  selectionHighlightColor:string='';
  selectedRoomsMessage:string='';
  commonAreaTypeNoneEnumValue!: number;
  selectedEmployeeId:string='';
  selectedEmployeeName: string ='';
  selectedEmployee: any;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private svgViewSrv: SvgViewService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private enumservice: EnumService,
    private employeeservice : EmployeeService
  ) { 
    this.filterPanel = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    // this.compId = this.authSrv.getLoggedInUserCompId();
    // this.loadAllBuilding();
    // this.loadAllFloor();
    this.scrollToEndBl();
    this.scrollToEndFl();
    this.loadNoneCommonAreaEnum();
  }

  loadAllBuilding() {
    this.blServ.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      this.enumBL = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      //this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
    });
  }

  loadAllFloor() {
    this.blServ.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL = res.map((i: any) => { i.name = i.blId + '-' + i.id + ' - ' + i.name; return i; });
      //this.enumAllFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.enumFL = this.enumAllFL;
    });
  }

  loadNoneCommonAreaEnum(){
    this.enumservice.getEnums().subscribe((res:any)=>{
      let commonareaEnumList = res.filter( (t:any) => 
        t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
        t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase() && 
        t.enumValue.toLocaleUpperCase()==='None'.toLocaleUpperCase());
        this.commonAreaTypeNoneEnumValue = commonareaEnumList[0].id;
    })
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
      });
      this.loadFloorCode($event.id);
    }, 10);
    if ($event.id != null) {
      this.loadFloorCode($event.id);

    }
    else {
      this.limitFl = 0;
      this.offsetFl = 0;
      this.filterCriteria = { fieldName:null, value: null, matchMode: "contains", limit: 0, offset: 0 }
      this.scrollToEndFl();
    }
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      // this.enumFL = [];
      // this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)
      // this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.limitFl = 0;
      this.offsetFl = 0;
      this.filterCriteria = { fieldName: "bl.blId", value: bl_id, matchMode: "equals", limit: 0, offset: 0 }
      this.scrollToEndFl();
    }
  }

  onSelectFlCode(event: any) {
    if (event.id != null) {
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
      }
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {
      // this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    }
  }


  onSearch(){
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    this.selectionMessage='';
    this.selectionHighlightColor='';
    this.selectedRoomsMessage='';
    this.selectedSvgElementId ='';
    this.displayNoFloorPlanInfo = false;
    this.allowSave = false;
    this.showrmtypetable= false;
    this.selectedRmCat='';
    this.selectedRmType='';
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
          setTimeout(() => {
            this.fileString = res.fileContent;
            this.viewSvg = true;
            this.cdr.detectChanges();
            this.spinner.hide();
            this.showSpinner = false;
            this.selectionMessage = "Please select Employee";
          }, 1000);
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
    this.blServ.getRmList(data).subscribe((res:any)=>{
      if(res){
        this.allSVGRoomsData = res.filter( (each:any) => each.svgElementId!=null && each.commonAreaType==this.commonAreaTypeNoneEnumValue);
        this.allSVGRoomsData.forEach((rm:any)=>{
          let idObj:SvgElementIdType ={
            roomElementId:rm.svgElementId,
            assetElementId : null
          }
          let colorObj: SvgElementColorType ={
            roomColor:"#ff6666",
            assetColor: null
          }
          let contentData:SvgRoomContentData ={
            blId:parseInt(blId),
            flId:parseInt(flId),
            rmId:rm.rmId,
            label:[rm.rmId],
            showLabel:true,
            highlightRoom:true,
            svgElementId :idObj,
            color:colorObj,
            rmCode:'',
            zoomAtRoom:false
          }
          this.svgRoomData.content.push(contentData);
        })
        this.svgRoomData.blId = parseInt(blId);
        this.svgRoomData.flId = parseInt(flId);
        this.svgRoomData.locate ="room";
      }
    })
  }

  onClear(){
    this.viewSvg= false;
    this.showSpinner = false;
    this.displayNoFloorPlanInfo = false;
    this.selectedSvgElementId ='';
    this.svgRoomData  = new SvgRoomData(null,null,"",[]);
    this.showrmtypetable= false;
    this.selectedRmCat='';
    this.selectedRmType='';
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

  getData(event:any){
    this.selectedEmployeeId = event.data.emId;
    this.selectedEmployeeName = event.data.firstName;
    this.allowSave = true;
    this.selectionMessage ="Please select a room assign to : "+this.selectedEmployeeName;
    this.employeeservice.getEmById(this.selectedEmployeeId).subscribe((res:any)=>{
      if(res){
        this.selectedEmployee = res;
      }
    })
  }

  roomOnClickListener(elementN: any) {
    if(this.allowSave){
      this.selectedRoomsMessage = '';
    let svgelid ='';
    if(elementN.startsWith("label")){
      svgelid = elementN.substring("label_".length)
    }else{
      svgelid = elementN;
    }
    this.selectedSvgElementId = svgelid;
    this.svgRoomData.content.forEach((svgData:any)=>{
      if(svgData.svgElementId.roomElementId==this.selectedSvgElementId){
        svgData.highlightRoom=true;
        svgData.color.roomColor="#6666ff";
        this.selectedRoomsMessage = "Selected Room : " + svgData.rmId;
      }else{
        svgData.highlightRoom=true;
        svgData.color.roomColor="#ff6666";
      }
    })
    this.cdr.detectChanges();
    this.svgViewComp.loadByDetails();
    }
  }

  onAssigntoRooms(){
    this.messageService.clear();
    const matchingObj = this.allSVGRoomsData.find(rm => rm.svgElementId ==this.selectedSvgElementId);
    let empData: EmployeeOutput= this.selectedEmployee;
    empData.employeeLocation.blId = matchingObj.blId;
    empData.employeeLocation.flId = matchingObj.flId;
    empData.employeeLocation.rmId = matchingObj.rmId;
    this.employeeservice.saveEmployee(empData).subscribe((res:any)=>{
      if(res.code ==200){
        this.messageService.add({ key: 'employeeroomMsg', severity: 'success', summary: 'Record updated', detail: 'Employee updated successfully' });
        this.onSearch();
      }
    })
  }

  onCancelSelection(){
    this.onSearch();
  }
  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blServ.getALLBuildingByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumBL = res;
     this.enumBL.unshift(new BuildingFilterInputDTO(null,'Make a selection',null));
    })
   }

   scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blServ.getALLFloorByScroll(this.filterCriteria).subscribe((res:any) => {
     this.enumFL = res;
     this.enumFL.unshift(new FloorFilterInputDTO(null,'Make a selection',null));
    })
   }

   searchBl(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
   }

   searchFl(event:any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
   }

   updateBlList(blData:any) {
    this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
      this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
   }

   updateFlList(flData:any) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
      this.enumFL = this.enumFL.filter(t => t.flId !== null);
      this.enumFL.unshift(flData);
      this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',null));
   }
   
}
