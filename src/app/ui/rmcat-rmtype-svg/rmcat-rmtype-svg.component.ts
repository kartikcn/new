import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { PaginationObj } from 'src/app/model/pagination-model';
import { SvgElementOnClickData } from 'src/app/model/svgelementonclickdata.interface';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { EnumService } from 'src/app/services/enum.service';
import { RmcatService } from 'src/app/services/rmcat.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-rmcat-rmtype-svg',
  templateUrl: './rmcat-rmtype-svg.component.html',
  styleUrls: ['./rmcat-rmtype-svg.component.scss'],
  providers: [MessageService]
})
export class RmcatRmtypeSvgComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  allBl: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  viewSvg: boolean = false;
  showSpinner: boolean = false;
  displayNoFloorPlanInfo: boolean = false;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  rmcatdata:any[]=[];
  rmtypeData:any[]=[];
  showrmtypetable:boolean = false;
  selectedRmCat:string='';
  selectedRmType:string='';
  selectedRmCatId:number|null=null;
  selectedRmTypeId:number|null=null;
  selectedSvgElementIds :any[]=[];
  roomSelectedSvgElementIds :any[]=[];
  allSVGRoomsData:any[]=[];
  selectionMessage:string='';
  selectionHighlightColor:string='';
  selectedRoomsMessage:string='';
  allRoomData:any[]=[];
  selectedRooms:any[]=[];
  commonAreaTypeNoneEnumValue!: number;
  showrmcattable: boolean = false;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  searchedSvgRoomData: SvgRoomData = new SvgRoomData(null, null, "", []);
  enumView = [
    {
      id: 'list',
      value: 'List',
    },
    {
      id: 'svg',
      value: 'SVG'
    }
  ]
  enableAssignButton: boolean = false;
  enableUnAssignButton: boolean = false;
  enableClearButton: boolean = false;
  paginationObjRmCat: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: ["rmcatId"],
    sortOrder: "ASC"
  }
  totalElementsRmCat: number = 0;
  isFilteredRmCat: boolean = false;
  filterCriteriaListRmCat: any[] = [];
  isSortedRmCat: boolean = false;
  paginationObjRmType: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: ["rmtypeId"],
    sortOrder: "ASC"
  }
  totalElementsRmType: number = 0;
  isFilteredRmType: boolean = false;
  filterCriteriaListRmType: any[] = [];
  isSortedRmType: boolean = false;
  paginationObjRm: PaginationObj = {
    pageNo: 0,
    pageSize: this.rowCount,
    sortBy: ["rmId"],
    sortOrder: "ASC"
  }
  totalElementsRm:number = 0;
  isFilteredRm:boolean = false;
  filterCriteriaListRm :any[]=[];
  isSortedRm : boolean = false;
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  selectedBl: any = {};
  selectedFl: any = {};
  constructor(
    private blServ: BuildingService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private rmcatSrv: RmcatService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private enumservice: EnumService,
  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null],
      flId: [null],
      view: [null],
    });
  }

  ngOnInit(): void {
    this.loadAllRmCat();
    this.loadNoneCommonAreaEnum();
    this.filterPanel.patchValue({
      view: this.enumView[0].id
    });
    this.showrmcattable = true;
    this.loadGridData();
  }

 

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
     this.selectedBl = {};
     this.selectedBl = {};
    }
  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      this.selectedFl = event;
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
        });
      }, 10);
    }
    else {

    }
  }

  loadAllRmCat() {
    let data = { paginationDTO: this.paginationObjRmCat, filterCriteria: this.filterCriteriaListRmCat };
    this.isFilteredRmCat = false;
    this.rmcatSrv.getALLRmcatsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFilteredRmCat = false;
        this.rmcatdata = res.content ? res.content : [];
        this.totalElementsRmCat = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.rmcatdata = [];
      }
    })
  }

  onSearch() {
    this.showrmcattable = false;
    this.selectionMessage = '';
    this.selectionHighlightColor = '';
    this.selectedRoomsMessage = '';
    this.selectedSvgElementIds = [];
    this.roomSelectedSvgElementIds = [];
    this.displayNoFloorPlanInfo = false;
    this.showrmtypetable = false;
    this.selectedRmCat = '';
    this.selectedRmType = '';
    this.selectedRmCatId = null;
    this.selectedRmTypeId = null;
    this.viewSvg = false;
    this.selectedRooms = [];
    this.showSpinner = true;
    this.spinner.show();
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let view = this.filterPanel.controls.view.value;
    if(view=='svg'){
      if(blId!=null && flId !=null){
        this.svgInputData = new SvgRoomDataInput(blId,flId,null,false,false,false,true,false,"",null,"","rmcat-rmtype",null,null);
        this.selectionMessage = "Please select a Room Category";
        this.viewSvg = true;
      }else{
        this.spinner.hide();
        this.showSpinner = false;
        this.selectionMessage = "Please select Building and Floor";
        this.displayNoFloorPlanInfo = true;
      }
    } else {
      this.loadGridData();
      this.spinner.hide();
      this.showSpinner = false;
      this.selectionMessage = "Please select a Room Category";
    }
    this.showrmcattable= true;
  }

  onClear() {
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.viewSvg = false;
    this.showSpinner = false;
    this.displayNoFloorPlanInfo = false;
    this.showrmcattable = false;
    this.selectedSvgElementIds =[];
    this.roomSelectedSvgElementIds=[];
    this.selectedRooms=[];
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
    this.searchedSvgRoomData =  new SvgRoomData(null,null,"",[]);
    this.showrmtypetable= false;
    this.selectedRmCat='';
    this.selectedRmType='';
    this.selectedRmCatId=null;
    this.selectedRmTypeId=null;
    this.allSVGRoomsData=[];
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      view: this.enumView[0].id
    });
    this.selectionMessage = '';
    this.selectionHighlightColor = '';
    this.selectedRoomsMessage = '';
    this.paginationObjRmCat = {
      pageNo: 0,
      pageSize: this.rowCount,
      sortBy: ["rmcatId"],
      sortOrder: "ASC"
    }
    this.totalElementsRmCat = 0;
    this.filterCriteriaListRmCat = [];
    this.isFilteredRmCat = false;
    this.paginationObjRmType = {
      pageNo: 0,
      pageSize: this.rowCount,
      sortBy: ["rmtypeId"],
      sortOrder: "ASC"
    }
    this.totalElementsRmType = 0;
    this.filterCriteriaListRmType = [];
    this.isFilteredRmType = false;
    this.paginationObjRm = {
      pageNo: 0,
      pageSize: this.rowCount,
      sortBy: ["rmId"],
      sortOrder: "ASC"
    }
    this.totalElementsRm = 0;
    this.filterCriteriaListRm = [];
    this.isFilteredRm = false;
    this.loadAllRmCat();
    this.onSearch();
   this.selectedBl = {};
   this.selectedFl = {};
  }

  roomOnClickListener(data: SvgElementOnClickData) {
    this.selectedRoomsMessage = '';
    let svgelid ='';
    if(data.elementIdName!=null && data.elementIdName!=""){
      if(data.elementIdName.startsWith("label")){
        svgelid = data.elementIdName.substring("label_".length)
      }else{
        svgelid = data.elementIdName;
      }
      if(!this.selectedSvgElementIds.includes(svgelid)){
        this.selectedSvgElementIds.push(svgelid);
      }
      this.selectedSvgElementIds.forEach((id:string)=>{
        data.svgRoomData.content.forEach((svgData:any)=>{
          if(svgData.svgElementId.roomElementId==id){
            this.roomSelectedSvgElementIds.push(id);
            if(this.selectionHighlightColor.length>0){
              svgData.highlightRoom=true;
              svgData.color.roomColor=this.selectionHighlightColor;
            }else{
              svgData.highlightRoom=false;
              svgData.color.roomColor="";
            }
            if(this.selectedRoomsMessage.length==0){
              this.selectedRoomsMessage += "Selected Rooms : " + svgData.rmCode;
            }else{
              this.selectedRoomsMessage += ", "+svgData.rmCode;
            }
          }
        })
      })
      this.allSVGRoomsData = [...data.allSVGRoomsData]
      this.cdr.detectChanges();
      this.svgViewComp.loadByDetails();
    }
  }

  onAssigntoRooms(){
    this.messageService.clear();
    let saveRoomData: any[] = [];
    const saveRequests: any[] = [];
    if (this.viewSvg) {
      this.roomSelectedSvgElementIds.forEach((id: string) => {
        const matchingObj = this.allSVGRoomsData.find(rm => rm.svgElementId == id);
        if (matchingObj) {
          saveRoomData.push(matchingObj);
        }
      })
      saveRoomData.forEach((room: any) => {
        if (this.selectedRmCatId != null) {
          room.rmcatId = this.selectedRmCatId;
        }
        if (this.selectedRmTypeId != null) {
          room.rmtypeId = this.selectedRmTypeId;
        } else {
          room.rmtypeId = null;
        }
        saveRequests.push(this.blServ.updateRoomProp(room));
      })
    } else {
      saveRoomData = [...this.selectedRooms];
      saveRoomData.forEach((room: any) => {
        if (this.selectedRmCatId != null) {
          room.rmcatId = this.selectedRmCatId;
        }
        if (this.selectedRmTypeId != null) {
          room.rmtypeId = this.selectedRmTypeId;
        } else {
          room.rmtypeId = null;
        }
        saveRequests.push(this.blServ.updateRoomProp(room));
      })
    }
    forkJoin(saveRequests)
      .subscribe((res: any[]) => {
        this.messageService.add({ key: 'rmcatrmtypesvgMsg', severity: 'success', summary: 'Record updated', detail: 'Room updated successfully' });
        this.onSearch();
      }, (error: any) => {
        console.error('Failed to save records:', error);
      });
  }

  userConfirmUnAssign(): void {
    this.confirmationService.confirm({
      message: 'This will remove the selected room\'s category and type. Do you wish to continue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onUnAssigntoRooms();
      },
      key: "rmcatrmtypesvgGrid"
    });
  }

  onrmcatrowselect(event:any){
    this.rmtypeData=[];
    this.selectedSvgElementIds=[];
    this.roomSelectedSvgElementIds=[];
    this.selectedRooms=[];
    this.showrmtypetable = true;
    this.selectedRmCat = event.data.rmCat;
    this.selectedRmCatId = event.data.rmcatId;
    this.selectionMessage = "Please select a Room Type";
    this.loadRmType(event.data.rmcatId);
    this.cdr.detectChanges();
  }

  loadRmType(rmcatId: number | null) {
    let data = {
      rmcatId: rmcatId,
      filterDto: { paginationDTO: this.paginationObjRmType, filterCriteria: this.filterCriteriaListRmType }
    }
    this.isFilteredRmType = false;
    this.rmcatSrv.getRmTypeListPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFilteredRmType = false;
        this.rmtypeData = res.content ? res.content : [];
        this.totalElementsRmType = res.totalElements ? res.totalElements : 0;
      }
    })
  }

  onrmtyperowselect(event: any) {
    this.selectedRmType = event.data.rmType;
    this.selectedRmTypeId = event.data.rmtypeId;
    this.selectionHighlightColor = event.data.highlightColor;
    this.selectionMessage ="Please select rooms to be assigned for "+this.selectedRmCat+" | "+ this.selectedRmType;
    this.selectedSvgElementIds=[];
    this.roomSelectedSvgElementIds=[];
    this.selectedRooms=[];
    this.cdr.detectChanges();
  }

  onCancelSelection() {
    if (this.viewSvg) {
      this.onSearch();
    } else {
      this.selectedRooms = [];
    }
  }

  onUnAssigntoRooms(){
     this.messageService.clear();
    let saveRoomData:any[]=[];
    const saveRequests:any[] = [];
    if(this.viewSvg){
      this.roomSelectedSvgElementIds.forEach((id:string)=>{
        const matchingObj = this.allSVGRoomsData.find(rm => rm.svgElementId ==id);
        if(matchingObj){
          saveRoomData.push(matchingObj);
        }
      })
      saveRoomData.forEach((room: any) => {
        room.rmcatId = null;
        room.rmtypeId = null;
        saveRequests.push(this.blServ.updateRoomProp(room));
      })
    } else {
      saveRoomData = [...this.selectedRooms];
      saveRoomData.forEach((room: any) => {
        room.rmcatId = null;
        room.rmtypeId = null;
        saveRequests.push(this.blServ.updateRoomProp(room));
      })
    }
    forkJoin(saveRequests)
      .subscribe((res: any[]) => {
        this.messageService.add({ key: 'rmcatrmtypesvgMsg', severity: 'success', summary: 'Record updated', detail: 'Room updated successfully' });
        this.onSearch();
      }, (error: any) => {
        console.error('Failed to save records:', error);
      });
  }

  loadGridData() {
    this.loadAllRoom();
    this.selectionMessage = "Please select a Room Category";
  }

  loadAllRoom() {
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let data = {
      blId: blId,
      flId: flId,
      filterDto: { paginationDTO: this.paginationObjRm, filterCriteria: this.filterCriteriaListRm }
    }
    this.isFilteredRm = false;
    this.blServ.getRmListByPagination(data).subscribe((res: any) => {
      this.isFilteredRm = false;
      let content = res.content ? res.content : [];
      this.totalElementsRm = res.totalElements ? res.totalElements : 0;
      this.allRoomData = content.filter((each: any) => each.commonAreaType == this.commonAreaTypeNoneEnumValue);
    });
  }

  loadNoneCommonAreaEnum() {
    this.enumservice.getEnums().subscribe((res: any) => {
      let commonareaEnumList = res.filter((t: any) =>
        t.tableName.toLocaleUpperCase() === 'rm'.toLocaleUpperCase() &&
        t.fieldName.toLocaleUpperCase() === 'common_area_type'.toLocaleUpperCase() &&
        t.enumValue.toLocaleUpperCase() === 'None'.toLocaleUpperCase());
      this.commonAreaTypeNoneEnumValue = commonareaEnumList[0].enumKey;
    })
  }

  onPageChangeRmCat(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObjRmCat.pageNo = pageNo;
    this.paginationObjRmCat.pageSize = pageSize;
    this.loadAllRmCat();
  }

  onSortRmCat(event: any) {
    //this.isSortedRmCat = true;
  }

  onInnerFilterRmCat(event: any) {
    this.isSortedRmCat = false;
    setTimeout(() => {
      if (this.isFilteredRmCat && !this.isSortedRmCat) {
        this.isSortedRmCat = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined) {
            let filterCriteriaRmCat = { fieldName: field, value: filterValue, matchMode: matchMode };
            this.updateFilterCriteriaListRmCat(filterCriteriaRmCat);
          }
        });
        this.paginationObjRmCat.pageNo = 0;
        this.loadAllRmCat();
      }
      this.isFilteredRmCat = true;
    }, 0);
  }

  updateFilterCriteriaListRmCat(filterCriteria: any) {
    let index = this.filterCriteriaListRmCat.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if (filterCriteria['value'] == null) {
      if (index !== -1) {
        this.filterCriteriaListRmCat.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.filterCriteriaListRmCat[index] = filterCriteria;
      } else {
        this.filterCriteriaListRmCat.push(filterCriteria);
      }
    }
  }

  onPageChangeRmType(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObjRmType.pageNo = pageNo;
    this.paginationObjRmType.pageSize = pageSize;
    this.loadRmType(this.selectedRmCatId);
  }

  onSortRmType(event: any) {
    // this.isSortedRmType= true;
  }

  onInnerFilterRmType(event: any) {
    this.isSortedRmType = false;
    setTimeout(() => {
      if (this.isFilteredRmType && !this.isSortedRmType) {
        this.isSortedRmType = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined) {
            let filterCriteriaRmType = { fieldName: field, value: filterValue, matchMode: matchMode };
            this.updateFilterCriteriaListRmType(filterCriteriaRmType);
          }
        });
        this.paginationObjRmType.pageNo = 0;
        this.loadRmType(this.selectedRmCatId);
      }
      this.isFilteredRmType = true;
    }, 0);
  }

  updateFilterCriteriaListRmType(filterCriteria: any) {
    let index = this.filterCriteriaListRmType.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if (filterCriteria['value'] == null) {
      if (index !== -1) {
        this.filterCriteriaListRmType.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.filterCriteriaListRmType[index] = filterCriteria;
      } else {
        this.filterCriteriaListRmType.push(filterCriteria);
      }
    }
  }

  onPageChangeRm(event: any) {
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObjRm.pageNo = pageNo;
    this.paginationObjRm.pageSize = pageSize;
    this.selectedRooms = [];
    this.loadAllRoom();
  }

  onSortRm(event: any) {
    // this.isSortedRm = true;
  }

  onInnerFilterRm(event: any) {
    this.isSortedRm = false;
    setTimeout(() => {
      if (this.isFilteredRm && !this.isSortedRm) {
        this.isSortedRm = false;
        Object.keys(event.filters).forEach((field) => {
          const filterValue = event.filters[field][0].value;
          const matchMode = event.filters[field][0].matchMode;
          if (filterValue !== undefined) {
            let filterCriteriaRm = {};
            if (field == "blBlCode") {
              filterCriteriaRm = { fieldName: 'bl.blCode', value: filterValue, matchMode: matchMode };
            } else if (field == "flFlCode") {
              filterCriteriaRm = { fieldName: 'fl.flCode', value: filterValue, matchMode: matchMode };
            } else if (field == 'rmcatRmCat') {
              filterCriteriaRm = { fieldName: 'rmcat.rmCat', value: filterValue, matchMode: matchMode };
            } else if (field == 'rmtypeRmType') {
              filterCriteriaRm = { fieldName: 'rmtype.rmType', value: filterValue, matchMode: matchMode };
            } else {
              filterCriteriaRm = { fieldName: field, value: filterValue, matchMode: matchMode };
            }
            this.updateFilterCriteriaListRm(filterCriteriaRm);
          }
        });
        this.paginationObjRm.pageNo = 0;
        this.selectedRooms = [];
        this.loadAllRoom();
      }
      this.isFilteredRm = true;
    }, 0);
  }

  updateFilterCriteriaListRm(filterCriteria: any) {
    let index = this.filterCriteriaListRm.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if (filterCriteria['value'] == null) {
      if (index !== -1) {
        this.filterCriteriaListRm.splice(index, 1);
      }
    } else {
      if (index !== -1) {
        this.filterCriteriaListRm[index] = filterCriteria;
      } else {
        this.filterCriteriaListRm.push(filterCriteria);
      }
    }
  }



  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blServ.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blServ.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }


  searchBl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "blName", value: event.term, matchMode: "contains" };
    this.scrollToEndBl();
  }

  searchFl(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "flName", value: event.term, matchMode: "contains" };
    this.scrollToEndFl();
  }

  loadSvgDetails() {
    if (this.viewSvg) {
      this.svgViewComp.loadByDetails();
    }
  }

  updateBlList(blData: any) {
    if (blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
  }

  updateFlList(flData: any) {
    if (flData.flId) {
      this.enumFL = this.enumFL.filter(t => t.flId !== flData.flId);
      this.enumFL = this.enumFL.filter(t => t.flId !== null);
      this.enumFL.unshift(flData);
    }
    this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection', null));
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    }
    this.scrollToEndBl();
  }

  onOpenFl() {
    this.limitFl = 0;
    this.offsetFl = 0;
    if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndFl();
  }

}
