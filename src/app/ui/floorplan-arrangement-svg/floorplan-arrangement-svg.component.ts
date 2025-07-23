import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { ArrangementService } from '../arrangement/services/arrangement.service';
import { BuildingFilterInput } from '../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { RmConfigService } from '../rm-config/rm-config/services/rm-config.service';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';

@Component({
  selector: 'app-floorplan-arrangement-svg',
  templateUrl: './floorplan-arrangement-svg.component.html',
  styleUrls: ['./floorplan-arrangement-svg.component.scss']
})
export class FloorplanArrangementSvgComponent implements OnInit, AfterViewInit {
  filterPanel!: UntypedFormGroup;
  compId!: number;
  allBl: any[] = [];
  enumBL: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  viewSvg: boolean = false;
  allSVGElementsData: any[] = [];
  allDisplaySVGElementsData: any[] = [];
  roomDetails: any[] = [];
  availableRmConfigRoom: any[] = [];
  focusParticularRoom: boolean = false;
  fileString: string = '';
  allArragements: any[] = [];
  floorPlanArrangementList: any[] = [];
  allRoomsList: any[] = [];
  displayNoFloorPlanInfo: boolean = false;
  selectedArrangements: any[] = [];
  showSpinner: boolean = true;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private svgViewSrv: SvgViewService,
    private arrangeSrv: ArrangementService,
    private rmConfigSrv: RmConfigService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
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
    this.loadAllArrangement();
  }

  ngAfterViewInit() {
    if (this.viewSvg) {
      this.svgViewComp;
    }
  }

  loadAllArrangement() {
    this.arrangeSrv.getAllArrangements().subscribe((res: any) => {
      this.allArragements = res;
    })
  }

  loadAllBuilding() {
    this.blServ.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      this.enumBL = res.map((i: any) => { i.name = i.blNameString; return i; });
      this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
    });
  }

  loadAllFloor() {
    this.blServ.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL = res.map((i: any) => { i.name = i.flNameString; return i; });
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


  onSearch() {
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    this.displayNoFloorPlanInfo = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    this.selectedArrangements = [];
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
        if (res.fileName!="error") {
          this.fileString = res.fileContent;
          this.loadAllSVGData(blId, flId);
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

  loadAllSVGData(blId: string, flId: string) {
    this.allSVGElementsData = [];
    this.allDisplaySVGElementsData = [];
    this.floorPlanArrangementList = [];
    let data = {
      flId: flId,
      blId: blId,
      compId: this.compId,
    }
    this.rmConfigSrv.getRmConfigByBlAndFlId(data).subscribe((res: any) => {
      if (res) {
        this.allSVGElementsData = res.filter((each: any) => each.rmSvgElementId !== null)
          .map((each: any) => {
            let match = this.allArragements.find(obj2 => obj2.arrangementType === each.arrangementType);
            return { ...each, ...match };
          });
        this.allDisplaySVGElementsData = this.allSVGElementsData;
        this.allSVGElementsData.forEach((el:any)=>{
          let idObj:SvgElementIdType ={
            roomElementId:el.rmSvgElementId,
            assetElementId : null
          }
          let colorObj: SvgElementColorType ={
            roomColor:el.highlightColor,
            assetColor: null
          }
          let contentData:SvgRoomContentData ={
            blId:parseInt(blId),
            flId:parseInt(flId),
            rmId:el.rmId,
            label:[],
            showLabel:false,
            highlightRoom:true,
            svgElementId : idObj,
            color:colorObj,
            rmCode:'',
            zoomAtRoom:false
          }
          this.svgRoomData.content.push(contentData);
        });
        this.svgRoomData.blId = parseInt(blId);
        this.svgRoomData.flId = parseInt(flId);
        this.svgRoomData.locate = "room";
        this.floorPlanArrangementList = Array.from(new Set(this.allSVGElementsData.map(item => item.arrangementType + "-" + item.highlightColor)))
          .map(combination => {
            let [arrangementType, colorCode] = combination.split("-");
            return { arrangementType: arrangementType, colorCode: colorCode };
          });

        this.viewSvg = true;
        this.cdr.detectChanges();
        this.spinner.hide();
        this.showSpinner = false;
      }
    })
  }

  onClear() {
    this.viewSvg = false;
    this.showSpinner = true;
    this.allSVGElementsData = [];
    this.allDisplaySVGElementsData = [];
    this.fileString = '';
    this.floorPlanArrangementList = [];
    this.displayNoFloorPlanInfo = false;
    this.selectedArrangements = [];
    this.filterPanel.patchValue({
      blId: null,
      flId: null
    });
    this.svgRoomData = new SvgRoomData(null,null,"",[]);
  }
  
  checkboxChange($event: any) {
    this.viewSvg = false;
    this.allDisplaySVGElementsData = [];
    this.allDisplaySVGElementsData = this.allSVGElementsData.filter(each =>
      this.selectedArrangements.some(eachArr => eachArr.arrangementType === each.arrangementType)
    );
    this.svgRoomData.content=[];
    this.allDisplaySVGElementsData.forEach((el:any)=>{
      let idObj:SvgElementIdType ={
        roomElementId:el.rmSvgElementId,
        assetElementId : null
      }
      let colorObj: SvgElementColorType ={
        roomColor:el.highlightColor,
        assetColor: null
      }
      let contentData:SvgRoomContentData ={
        blId:el.blId,
        flId:el.flId,
        rmId:el.rmId,
        label:[],
        showLabel:false,
        highlightRoom:true,
        svgElementId : idObj,
        color:colorObj,
        rmCode:'',
        zoomAtRoom:false
      }
      this.svgRoomData.content.push(contentData);
    })
    this.showSpinner = true;
    this.spinner.show();
    this.viewSvg = true;
    this.cdr.detectChanges();
    this.svgViewComp.loadSvgFile();
    this.spinner.hide();
    this.showSpinner = false;
  }

}
