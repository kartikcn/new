import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { RMFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/rmFilterInput.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { LinkPlanToLocationOrAssetService } from '../../services/link-plan-to-location.services';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';

@Component({
  selector: 'app-link-multiple-locations',
  templateUrl: './link-multiple-locations.component.html',
  styleUrls: ['./link-multiple-locations.component.scss']
})
export class LinkMultipleLocationsComponent {

  filterPanel: FormGroup;
  newRecord: boolean = true;
  enumList: Enums[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumAllRm: RoomFilterInputDTO[] = [];
  enumRm: RoomFilterInputDTO[] = [];
  selectedData: any[] = [];
  blCheckBox: boolean = true;
  floorCheckBox: boolean = true;
  roomCheckBox: boolean = true;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedKey: any = "id";
  selectedScreens: any[] = [];
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
  scrollLimit:number = UtilConstant.SCROLL_LIMIT;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LinkMultipleLocationsComponent>,
    private blSrv: BuildingService,
    private confirmationService: ConfirmationService,
    private linkPlanToLocationOrAssetService: LinkPlanToLocationOrAssetService,
    private authSrv: AuthService
  ) {
    this.filterPanel = this.formBuilder.group({
      blId: [null],
      flId: [null],
      rmId: [null],

    });
  }

  ngOnInit(): void {
    this.loadBuilding();
    this.loadFloor();
    this.loadRoom();
  }

  loadBuilding() {
    this.blSrv.getALLBuilding().subscribe((res: any) => {
      this.enumAllBl = res;
      // this.enumAllBl = res.map((i: any) => { i.name = i.blNameString; return i; });
     // this.enumAllBl = this.enumAllBl.map((i: any) => { i.blId = i.id; return i; });
     // this.enumBL = res;
      // this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
    });
  }

  loadFloor() {
    this.blSrv.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      // this.enumAllFL = res.map((i: any) => { i.name = i.flNameString; return i; });
      //this.enumAllFL = this.enumAllFL.map((i: any) => { i.flId = i.id; return i; });
     // this.enumFL = this.enumAllFL;
      // this.enumFL.unshift(new FloorFilterInputDTO(null, 'Make a selection',  null));
    });
  }

  loadRoom() {
    this.blSrv.getALLRoom().subscribe((res: any) => {
      this.enumAllRm = res;
      // this.enumAllRm = res.map((i: any) => { i.name = i.rmNameString; return i; });
      //this.enumAllRm = this.enumAllRm.map((i: any) => { i.rmId = i.id; return i; });
     // this.enumRm = this.enumAllRm;
      this.selectedData = this.enumAllRm;
      // this.enumRm.unshift(new RoomFilterInputDTO(null, 'Make a selection' , null, null));
    });
  }

  onSelectBlCode($event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        flId: null,
        rmId: null,
      });
    }, 10);
    if ($event.blId) {
      this.selectedBl = $event;
      this.selectedFl = {};
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }

  }

  onSelectFlCode(event: any) {
    if (event.flId) {
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
    if (event.rmId) {
      this.selectedRm = event;
      const blData:any = {
        blId:event.blId,
        blNameString:event.blNameString,
        site:null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);

      const flData:any = {
        flId:event.flId,
        flNameString:event.flNameString,
        blId:event.blId,
        blNameString:event.blNameString,
      }
      this.selectedFl = flData;
      this.updateFlList(flData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: event.blId,
          flId: event.flId,
        });
      }, 10);
    } else {
      
    }
  }

  onSearch() {
    this.updateSelectedData()
  }

  onClear() {
    this.filterPanel.reset();
    this.selectedBl = {};
    this.selectedFl = {};
    this.selectedRm = {};
    this.blCheckBox = true;
    this.floorCheckBox = true;
    this.roomCheckBox = true;
    this.loadBuilding();
    this.loadFloor();
    this.loadRoom();
  }

  updateSelecteType(type: any) {

    if (type === 'bl') {
      if (!this.blCheckBox) {
        this.floorCheckBox = false;
        this.roomCheckBox = false;
      }
    } else if (type === 'fl') {
      if (!this.floorCheckBox) {
        this.roomCheckBox = false;
      } else {
        this.blCheckBox = true;
      }
    } else if (type === 'rm') {
      if (this.roomCheckBox) {
        this.blCheckBox = true;
        this.floorCheckBox = true;
      }
    }

    this.updateSelectedData()
  }

  updateSelectedData() {
    this.selectedData = [];
    this.selectedScreens = [];

    if (this.blCheckBox && !this.floorCheckBox && !this.roomCheckBox) {
      this.selectedData = this.selectedData.concat(this.enumAllBl);
      this.filterSelectedData();
    }

    // Check if the fl checkbox is selected
    if (this.floorCheckBox && !this.roomCheckBox) {
      this.blCheckBox = true;
      this.selectedData = this.selectedData.concat(this.enumAllFL);
      this.filterSelectedData();
    }

    // Check if the rm checkbox is selected
    if (this.roomCheckBox) {
      this.blCheckBox = true;
      this.floorCheckBox = true;
      this.selectedData = this.selectedData.concat(this.enumAllRm);
      this.filterSelectedData();
    }

  }

  filterSelectedData() {
    const blId = this.filterPanel.controls.blId.value;
    const flId = this.filterPanel.controls.flId.value;
    const rmId = this.filterPanel.controls.rmId.value;

    blId ? this.selectedData = this.selectedData.filter((i: any) => i.blId == blId) : '';
    flId ? this.selectedData = this.selectedData.filter((i: any) => i.flId == flId) : '';
    rmId ? this.selectedData = this.selectedData.filter((i: any) => i.rmId == rmId) : '';
  }

  Link() {
    const selectedLocPlans: any[] = [];
    this.selectedScreens.forEach(rec => {
      let planLocData = {
        blId: rec.blId,
        flId: rec.flId ? rec.flId : null,
        rmId: rec.rmId ? rec.rmId : null,
        planId: this.data.planId,
        eqId:null
      }
      selectedLocPlans.push(planLocData);
    })
   
    this.linkPlanToLocationOrAssetService.save(selectedLocPlans).subscribe((res: any) => {
      if (res.code === 200) {
        this.dialogRef.close(true);
      }
    })
  }

  confirmDialog(): void {
    this.confirmationService.confirm({
      message: UtilConstant.CANCEL_Msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dialogRef.close(false);
      },
      key: 'multipleLocation'
    });
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blSrv.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blSrv.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  scrollToEndRm() {
    this.offsetRm = this.limitRm;
    this.limitRm += this.scrollLimit;
    this.filterCriteria.limit = this.limitRm;
    this.filterCriteria.offset = this.offsetRm;
    this.blSrv.getALLRoomByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumRm = res;
      this.updateRmList(this.selectedRm);
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

   searchRm(event:any) {
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
    if(rmData.rmId) {
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
