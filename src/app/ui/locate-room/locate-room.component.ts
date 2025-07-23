import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { BuildingFilterInputDTO } from '../background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from '../background-loc/model/DTO/RoomFilterInputDTO.model';
import { BuildingService } from '../background-loc/services/bl.service';
import { SvgViewComponent } from '../svg-view/svg-view.component';

@Component({
  selector: 'app-locate-room',
  templateUrl: './locate-room.component.html',
  styleUrls: ['./locate-room.component.scss']
})
export class LocateRoomComponent implements OnInit {
  filterPanel!: UntypedFormGroup;
  allBl: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  enumRm: any[] = [];
  showSpinner: boolean = true;
  viewSvg: boolean = false;
  noSVGFound:boolean = false;
  useTabletProtrait = false;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private blServ: BuildingService,
    private bps : BreakpointService
  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]],
      rmId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }


  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
        rmId: null,
      });
    }, 10);
    if ($event.blId != null) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode(event: any) {
    if (event.flId != null) {
      this.selectedFl = event;
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      this.selectedRm = {};
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          rmId: null,
        });
      }, 10);
    }
    else {
      this.selectedFl = {};
      this.selectedRm = {};
    }
  }

  onSelectRmCode(event: any) {
    if (event.rmId != null) {
      const blData: any = {
        blId: event.blId,
        blNameString: event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      const flData: any = {
        flId: event.flId,
        flNameString: event.flNameString,
        blId: event.blId,
        blNameString: event.blNameString,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          flId: event.flId,
        });
      }, 10);
    }
  }


  onSearch() {
    this.viewSvg = false;
    let blId = this.filterPanel.controls.blId.value;
    let flId = this.filterPanel.controls.flId.value;
    let rmId = this.filterPanel.controls.rmId.value;
    if(rmId!=null){
      this.noSVGFound = false;
      this.svgInputData  = new SvgRoomDataInput(blId,flId,rmId,true,false,false,false,true,"",null,"","",null,null);
      this.viewSvg = true;
      
    }else{
      this.noSVGFound = true;
      this.viewSvg = false;
    }
  }

  onClear() {
    this.viewSvg = false;
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      rmId: null,
    });
    this.selectedBl = {};
    this.selectedFl = {};
    this.selectedRm = {};
    this.svgInputData = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  }

  ngOnDestroy() {
    this.bps.unregister(this);
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

  scrollToEndRm() {
    this.offsetRm = this.limitRm;
    this.limitRm += this.scrollLimit;
    this.filterCriteria.limit = this.limitRm;
    this.filterCriteria.offset = this.offsetRm;
    this.blServ.getALLRoomByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumRm = res;
      this.updateRmList(this.selectedRm);
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

  searchRm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "rmName", value: event.term, matchMode: "contains" };
    this.scrollToEndRm();
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
  updateRmList(rmData: any) {
    if (rmData.rmId) {
      this.enumRm = this.enumRm.filter(t => t.rmId !== rmData.rmId);
      this.enumRm = this.enumRm.filter(t => t.rmId !== null);
      this.enumRm.unshift(rmData)
    }
    this.enumRm.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
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

  onOpenRm() {
    this.limitRm = 0;
    this.offsetRm = 0;
    if (this.selectedFl.flId) {
      this.filterCriteria = { fieldName: "fl.flId", value: this.selectedFl.flId, matchMode: "equals", limit: 0, offset: 0 }
    } else if (this.selectedBl.blId) {
      this.filterCriteria = { fieldName: "bl.blId", value: this.selectedBl.blId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
    }
    this.scrollToEndRm();
  }

}
