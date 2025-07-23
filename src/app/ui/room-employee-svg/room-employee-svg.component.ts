import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingFilterInput } from '../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../background-loc/model/DTO/flFilterInput.model';
import { RMFilterInputDTO } from '../background-loc/model/DTO/rmFilterInput.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { EmployeeService } from '../employee/services/employee.service';
import { RmConfigService } from '../rm-config/rm-config/services/rm-config.service';
import { SvgViewService } from '../svg-view/services/svg-view.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';
import { SvgRoomData } from 'src/app/model/svgroomdata.model';
import { SvgRoomContentData } from 'src/app/model/svgroomcontentdata.model';
import { SvgElementIdType } from 'src/app/model/svgelementidtype.model';
import { SvgElementColorType } from 'src/app/model/svgelementcolortype.model';

@Component({
  selector: 'app-room-employee-svg',
  templateUrl: './room-employee-svg.component.html',
  styleUrls: ['./room-employee-svg.component.scss']
})
export class RoomEmployeeSvgComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  compId!: number;
  allBl: any[] = [];
  enumBL: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  isRoomView: boolean = true;
  isEmployeeView: boolean = false;
  enumEm: any[] = [];
  allEmployees: any[] = [];
  viewSvg: boolean = false;
  fileString: string = '';
  fileName: string = '';
  defaultLoadColor: string = "";
  assignedColor: string = "#ff0000";
  roomDetails: any[] = [];
  svgRoomData : SvgRoomData = new SvgRoomData(null,null,"",[]);
  noSVGFound: boolean = false;
  showSpinner: boolean = true;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private rmConfigSrv: RmConfigService,
    private authSrv: AuthService,
    private emSrv: EmployeeService,
    private svgViewSrv: SvgViewService,
    private blServ: BuildingService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) {
    this.filterPanel = this.formBuilder.group({
      viewFor: ['Room'],
      blId: [null],
      flId: [null],
      rmId: [null],
      emId: [null]
    });
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadAllBuilding();
    this.loadAllFloor();
    this.loadAllRoom();
    this.loadAllEmployees();
    this.onRoom();

  }

  ngAfterViewInit() {
    if (this.viewSvg) {
      this.svgViewComp;
    }
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

  loadAllRoom() {
    this.blServ.getALLRoom().subscribe((res: any[]) => {
      this.allRmDdata = res;
      this.allRmDdata = res.map((i: any) => { i.name = i.rmNameString; return i; });
      this.allRmDdata.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
      this.rm_data = this.allRmDdata;
    });
  }

  loadAllEmployees() {
    this.emSrv.getAllEmployeeList().subscribe((res: any) => {
      this.allEmployees = res;
      this.enumEm = this.allEmployees.map(({ emId, firstName, lastName, blId, flId, rmId }) => ({ emId, firstName, lastName, blId, flId, rmId }));
      this.enumEm.map((i: any) => { i.fullName = i.firstName + ' ' + i.lastName; return i; })
    })
  }

  onRoom() {
    this.isRoomView = true;
    this.isEmployeeView = false;
    let blField = this.filterPanel.controls['blId'];
    let flField = this.filterPanel.controls['flId'];
    let rmField = this.filterPanel.controls['rmId'];
    let emField = this.filterPanel.controls['emId'];
    emField.setValidators(null);
    blField.setValidators([Validators.required]);
    flField.setValidators([Validators.required]);
    rmField.setValidators([Validators.required]);
    emField.updateValueAndValidity();
    blField.updateValueAndValidity();
    flField.updateValueAndValidity();
    rmField.updateValueAndValidity();
  }

  onEmployee() {
    let blId = this.filterPanel.controls['blId'].value;
    let flId = this.filterPanel.controls['flId'].value;
    let rmId = this.filterPanel.controls['rmId'].value;
    let emId = this.filterPanel.controls['emId'].value;
    if (blId !== null && flId !== null && rmId !== null && emId !== null) {
      this.isRoomView = true;
      this.isEmployeeView = true;
    } else {
      this.isRoomView = false;
      this.isEmployeeView = true;
    }
    let blField = this.filterPanel.controls['blId'];
    let flField = this.filterPanel.controls['flId'];
    let rmField = this.filterPanel.controls['rmId'];
    let emField = this.filterPanel.controls['emId'];
    blField.setValidators(null);
    flField.setValidators(null);
    rmField.setValidators(null);
    emField.setValidators([Validators.required]);
    blField.updateValueAndValidity();
    flField.updateValueAndValidity();
    rmField.updateValueAndValidity();
    emField.updateValueAndValidity();
  }

  onSelectBlCode($event: any) {
    if ($event.id != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null
        });
        this.loadFloorCode($event.id);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null
        });
      }, 10);
      this.enumFL = this.enumAllFL;
      this.rm_data = this.allRmDdata;
    }
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.rm_data = this.allRmDdata.filter(t => t.blId == bl_id)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
    }
  }

  onSelectFlCode(event: any) {
    if (event.id != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          rmId: null,
        });
        this.loadRmCode(event.id, event.blId);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null
        });
      }, 10);
      this.rm_data = this.allRmDdata;
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    }
  }

  loadRmCode(flId: any, blId: any) {
    if (flId != null) {
      this.rm_data = [];
      this.rm_data = this.allRmDdata.filter(t => t.blId == blId && t.flId == flId);
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
    }
  }

  onSelectRmCode(event: any) {
    if (event.id != null) {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          flId: event.flId,
        });
      }, 10);
    }
  }

  onSearch() {
    this.roomDetails = [];
    this.noSVGFound = false;
    this.viewSvg = false;
    this.showSpinner = true;
    this.spinner.show();
    this.fileName = '';
    this.fileString = '';
    this.svgRoomData = new SvgRoomData(null,null,"",[]);
    if (this.isRoomView && !this.isEmployeeView) {
      let blId = this.filterPanel.controls.blId.value;
      let flId = this.filterPanel.controls.flId.value;
      let rmId = this.filterPanel.controls.rmId.value;
      this.getRoomDetails(blId, flId, rmId,"");
      let data = {
        id: flId,
        blId: blId,
        compId: this.compId,
        name: '',
        flInfo: '',
        svgName: '',
        units : '',
      }
      setTimeout(() => {
        if (this.svgRoomData.content[0].svgElementId !== null) {
          this.svgViewSrv.getSVGFile(data).subscribe((res: any) => {
            if (res.code != 409) {
              this.fileName = res.fileName;
              this.fileString = res.fileContent;
              this.filterPanel.patchValue({
                emId: null
              })
              this.viewSvg = true;
              this.cdr.detectChanges();
              this.spinner.hide();
              this.showSpinner = false;
            }
            else{
              this.spinner.hide();
              this.showSpinner = false;
              this.noSVGFound = true;
            }
          })
        } else {
          this.spinner.hide();
          this.showSpinner = false;
          this.noSVGFound = true;
        }
      }, 100)
    }
    else if (this.isEmployeeView) {
      let emId = this.filterPanel.controls.emId.value;
      const emArray = this.enumEm.filter(each => each.emId == emId);
      if(emArray[0].blId == null){
        this.filterPanel.patchValue({
          blId:null,
          flId:null,
          rmId:null
        })
      }else{
        this.loadFloorCode(emArray[0].blId);
        this.loadRmCode(emArray[0].flId, emArray[0].blId);
        this.filterPanel.patchValue({
          blId:emArray[0].blId,
          flId:emArray[0].flId,
          rmId:emArray[0].rmId
        })
      }
      if (emArray[0].blId !== null && emArray[0].flId !== null && emArray[0].rmId !== null) {
        this.getRoomDetails(emArray[0].blId, emArray[0].flId, emArray[0].rmId,emArray[0].fullName);
        let data = {
          id: emArray[0].flId,
          blId: emArray[0].blId,
          compId: this.compId,
          name: '',
          flInfo: '',
          svgName: '',
          units:''
        }
        setTimeout(() => {
          if (this.svgRoomData.content[0].svgElementId  !== null) {
            this.roomDetails[0].em = emArray;
            this.svgViewSrv.getSVGFile(data).subscribe((res: any) => {
              if (res.code != 409) {
                this.fileName = res.fileName;
                this.fileString = res.fileContent;
                this.isRoomView = true;
                this.viewSvg = true;
                this.cdr.detectChanges();
                this.spinner.hide();
                this.showSpinner = false;
              }
              else{
                this.noSVGFound = true;
                this.spinner.hide();
                this.showSpinner = false;
              }
              (error:any) => {
                console.log(error);
              }
            })
          } else {
            this.noSVGFound = true;
            this.spinner.hide();
            this.showSpinner = false;
          }
        }, 100)
      } else {
        this.noSVGFound = true;
        this.spinner.hide();
        this.showSpinner = false;
      }
    }
  }

  getRoomDetails(blId: any, flId: any, rmId: any,empLabel:string) {
    let data = {
      id: rmId,
      name: '',
      blId: blId,
      flId: flId,
      svgElementId: '',
      compId: this.compId
    }
    this.blServ.getRmById(data).subscribe((res: any) => {
      let idObj:SvgElementIdType ={
        roomElementId:res.rm.svgElementId,
        assetElementId : null
      }
      let colorObj: SvgElementColorType ={
        roomColor:"#ff0000",
        assetColor: null
      }
      let contentData:SvgRoomContentData ={
        blId:blId,
        flId:flId,
        rmId:res.rm.rmId,
        label:empLabel!=""?[res.rm.rmId,empLabel]:[res.rm.rmId],
        showLabel:true,
        highlightRoom:true,
        svgElementId : idObj,
        color:colorObj,
        rmCode:'',
        zoomAtRoom:false
      }
      this.svgRoomData.content.push(contentData);
      this.roomDetails.push(res);
    })
    this.svgRoomData.blId = blId;
    this.svgRoomData.flId = flId;
    this.svgRoomData.locate = "room";
  }

  onClear() {
    this.roomDetails = [];
    this.viewSvg = false;
    this.fileName = '';
    this.fileString = '';
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      rmId: null,
      emId: null
    });
    if (this.isRoomView && this.isEmployeeView) {
      this.isRoomView = false;
    };
    this.svgRoomData = new SvgRoomData(null,null,"",[]);
  }

}
