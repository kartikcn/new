import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from '../../background-loc/services/bl.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BuildingFilterInput } from '../../background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from '../../background-loc/model/DTO/flFilterInput.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { BLModalDialogueProvider } from '../../background-loc/provider/bl.provider';
import { FLModalDialogueProvider } from '../../background-loc/provider/fl.provider';
import { RMFilterInputDTO } from '../../background-loc/model/DTO/rmFilterInput.model';
import { RMModalDialogueProvider } from '../../background-loc/provider/rm.provider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { SvgViewComponent } from '../../svg-view/svg-view.component';
import { SvgViewService } from '../../svg-view/services/svg-view.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-link-room-svg',
  templateUrl: './link-room-svg.component.html',
  styleUrls: ['./link-room-svg.component.scss'],
  providers: [MessageService]
})
export class LinkRoomSvgComponent implements OnInit, AfterViewInit {

  fileName: string = "";
  elementIdName: string = "";
  compId!: number;
  svgFlList: any[] = [];
  fileString: string | ArrayBuffer = "";
  displayBlFlUpdate: boolean = false;
  displayRmUpdate: boolean = false;
  allBl: any[] = [];
  allFL: any[] = [];
  rmData: any[] = [];
  blAndFlForm: UntypedFormGroup;
  rmForm: UntypedFormGroup;
  enumBL: BuildingFilterInput[] = [];
  enumFL: any[] = [];
  enumAllFL: any[] = [];
  isBuildingSelected: boolean = false;
  isFloorSelected: boolean = false;
  isRoomSelected: boolean = false;
  isNewBuilding: boolean = false;
  selectedFloorData: any[] = [];
  selectedRoomData: any[] = [];
  roomAlreadyAssignedElement: boolean = false;
  roomWithElementId: any[] = [];
  reader = new FileReader();
  isRoomIdChanged: boolean = false;
  defaultLoadColor: string = "#0000FF";
  assignedColor: string = "#ff0000";
  @ViewChild(SvgViewComponent, { static: false }) svgViewComp!: SvgViewComponent;
  viewSvg: boolean = false;
  isLinkRoomSvg: boolean = false;
  allSVGElementsData: any[] = [];
  showSpinner: boolean = true;
  constructor(
    private blServ: BuildingService,
    private authSrv: AuthService,
    private svgviewSrv: SvgViewService,
    private formBuilder: UntypedFormBuilder,
    private blProvider: BLModalDialogueProvider,
    private flProvider: FLModalDialogueProvider,
    private rmProvider: RMModalDialogueProvider,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
  ) {
    this.blAndFlForm = this.formBuilder.group({
      blId: [null, [Validators.required]],
      flId: [null, [Validators.required]]
    })
    this.rmForm = this.formBuilder.group({
      rmId: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.compId = this.authSrv.getLoggedInUserCompId();
    this.loadBuilding();
    this.loadFloor();
    this.messageService.clear();
  }

  ngAfterViewInit() {
    if (this.viewSvg) {
      this.svgViewComp;
    }
  }

  onChange(event: any) {
    this.blAndFlForm.patchValue({
      blId: null,
      flId: null
    });
    this.rmForm.patchValue({
      rmId: null
    })
    let filename = event.target.files[0].name;
    this.fileName = filename.split('.').slice(0, -1).join('.');
    
    this.reader.readAsText(event.target.files[0]);
    this.reader.onload = () => {
      this.fileString = this.reader.result!;
    }
    this.showSpinner = true;
    this.spinner.show();
    let ext = filename.match(/\.([^\.]+)$/)![1];
    if (ext == "svg") {
      this.blServ.checkSvgNameExists(this.fileName).subscribe((res: any) => {
        if (res.text == "true") {
          this.getFloorOfSvg();
          this.displayBlFlUpdate = false;
          this.isLinkRoomSvg = true;
          setTimeout(() => {
            setTimeout(() => {
              setTimeout(() => {
                this.viewSvg = true;
                this.cdr.detectChanges();
                this.svgViewComp.loadSvgFile();
                this.spinner.hide();
                this.showSpinner = false;
              }, 10)
            }, 10)
          }, 10)
        } else {
          this.displayBlFlUpdate = true;
          this.svgFlList = [];
          this.allSVGElementsData = [];
          this.loadFloor();
          this.spinner.hide();
          this.showSpinner = false;
        }
      })
    } else {
      alert('It is an unsupported file format.Please choose only SVG file.');
      this.onClearSvg();
      this.spinner.hide();
      this.showSpinner = false;
    }
  }

  addRoomOnClickListener(elementN: any) {
    this.elementIdName = elementN;
    if (this.elementIdName.includes('room')) {
      this.roomWithElementId = this.allSVGElementsData.filter((each: any) => each.svgElementId == this.elementIdName);
      this.getAllRoomsOfSvg();
      setTimeout(() => {
        if (this.roomWithElementId.length > 0) {
          this.roomAlreadyAssignedElement = true;
          this.rmData.unshift({
            id: this.roomWithElementId[0].rmId, name: this.roomWithElementId[0].rmId + ' - ' + this.roomWithElementId[0].rmName,
            rmId: this.roomWithElementId[0].rmId, compId: this.compId
          });
          this.rmForm.patchValue({
            rmId: this.roomWithElementId[0].rmId
          })
          this.isRoomIdChanged = false;
        }
        else {
          this.roomAlreadyAssignedElement = false;
          this.rmForm.patchValue({
            rmId: null
          })
          this.isRoomIdChanged = true;
        }
        this.displayRmUpdate = true;
      }, 10)
    }
  }

  onClearSvg() {
    let svgInput = document.getElementById("svgUpload");
    (svgInput! as HTMLInputElement).value = '';
    let obj = document.getElementById("svg-container");
    if (obj != null) {
      obj!.innerHTML = "";
    }
    this.svgFlList = [];
    this.fileName = "";
    this.blAndFlForm.patchValue({
      blId: null,
      flId: null
    });
    this.rmForm.patchValue({
      rmId: null
    })
    this.isBuildingSelected = false;
    this.isFloorSelected = false;
    this.isRoomSelected = false;
    this.isNewBuilding = false;
    this.selectedFloorData = [];
    this.selectedRoomData = [];
    this.roomAlreadyAssignedElement = false;
    this.roomWithElementId = [];
    this.isRoomIdChanged = false;
  }

  getFloorOfSvg() {
    this.svgFlList = [];
    let data: any = {
      id: '',
      name: '',
      blId: '',
      compId: this.compId,
      svgName: this.fileName
    }
    this.svgviewSrv.getFloorBySvgName(data).subscribe((res: any) => {
      if (res != null) {
        let data = {
          blId: res[0].blId,
          flId: res[0].flId
        }
        this.svgFlList.push(data);
        this.getAllRoomsOfSvg();
      }
    })
  }
  getAllRoomsOfSvg() {
    this.allSVGElementsData = [];
    this.rmData = [];
    let data: any = {
      id: '',
      name: '',
      blId: '',
      compId: this.compId,
      svgName: this.fileName
    }
    this.svgviewSrv.getRoomBySvgName(data).subscribe((res: any) => {
      if (res != null) {
        this.allSVGElementsData = res;
        this.rmData = res.filter((rm: any) => rm.svgElementId === null);
        this.rmData.map(rm => rm.id = rm.rmId);
        this.rmData.map((i: any) => { i.name = i.rmId + ' - ' + i.rmName; return i; });
        this.rmData.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
      }
    })
  }

  loadBuilding() {
    this.blServ.getALLBuilding().subscribe((res: any) => {
      this.enumBL = res;
      this.enumBL = res.map((i: any) => { i.name = i.blNameString; return i; });
      this.enumBL.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
    });
  }

  loadFloor() {
    this.blServ.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL.map((i: any) => { i.flName = i.name; return i; });
      this.enumAllFL.map((i: any) => { i.name = i.flNameString; return i; });
      this.enumFL = this.enumAllFL.filter((f: any) => f.svgName === null)
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    });
  }

  onSelectBlCode($event: any) {
    if ($event.id != null && $event.id != "") {
      setTimeout(() => {
        this.blAndFlForm.patchValue({
          flId: null,
        });
        this.loadFloorCode($event.id);
      }, 10);
      this.isBuildingSelected = true;
    }
    else {
      this.enumFL = [];
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.isBuildingSelected = false;
    }
  }

  onSelectFlCode($event: any) {
    this.selectedFloorData = [];
    if ($event.id || $event.flId) {
      this.isFloorSelected = true;
      this.selectedFloorData.push({
        flId: $event.id ? $event.id : $event.flId,
        flName: $event.flName,
        blId: $event.blId,
        compId: this.compId,
        flInfo: $event.flInfo,
        svgName: this.fileName
      });
    }
    else {
      this.isFloorSelected = false;
      this.selectedFloorData = [];
    }
  }

  onSelectRoom($event: any) {
    this.selectedRoomData = [];
    if ($event.id || $event.rmId) {
      this.isRoomSelected = true;
      this.selectedRoomData.push({
        blId: $event.blId,
        flId: $event.flId,
        rmId: $event.rmId,
        rmName: $event.rmName,
        rmCat: $event.rmCat,
        rmType: $event.rmType,
        rmInfo: $event.rmInfo,
        rmArea: $event.rmArea,
        compId: this.compId,
        svgElementId: this.elementIdName,
        isReservable: $event.isReservable,
        isHotelable: $event.isHotelable,
        rmPhoto1: $event.rmPhoto1,
        rmPhoto2: $event.rmPhoto2
      });
    }
    else {
      this.isRoomSelected = false;
      this.selectedRoomData = [];
    }

    if (this.roomWithElementId[0].rmId == $event.rmId) {
      this.isRoomIdChanged = false;
    } else {
      this.isRoomIdChanged = true;
    }
  }

  loadFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id && t.svgName === null)
        .map((i) => {
          if (!i.name.includes(i.id + ' - ')) { i.name = i.name; }
          return i;
        });
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
    }
  }

  saveBlAndFl() {
    this.messageService.clear();
    this.svgFlList = [];
    this.showSpinner = true;
    this.spinner.show();
    this.blServ.saveFloor(this.selectedFloorData[0]).subscribe((res: any) => {
      if (res != null) {
        this.displayBlFlUpdate = false;
        this.isLinkRoomSvg = true;
        this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Floor added', detail: 'The floor was added successfully' });
        this.svgFlList = this.selectedFloorData;
        this.viewSvg = true;
        this.cdr.detectChanges();
        this.svgViewComp.loadSvgFile();
        this.spinner.hide();
        this.showSpinner = false;
      }
    })
  }

  cancelBlAndFl() {
    this.displayBlFlUpdate = false;
    this.onClearSvg();
  }

  saveRoom() {
    this.messageService.clear();
    this.updateUnassignRoom();
    this.blServ.saveRoom(this.selectedRoomData[0]).subscribe((res: any) => {
      if (res != null) {
        this.messageService.clear();
        this.displayRmUpdate = false;
        if (this.roomAlreadyAssignedElement) {
          this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Room updated', detail: 'The room was updated successfully' });
        } else {
          this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Room added', detail: 'The room was added successfully' });
        }
        this.getAllRoomsOfSvg();
        this.isRoomSelected = false;
        setTimeout(() => {
          //this.svgViewComp.loadRoomColors();
        }, 10)
      }
    })
  }

  cancelRoom() {
    this.displayRmUpdate = false;
  }

  onAddNewBuilding() {
    this.messageService.clear();
    this.isNewBuilding = true;
    this.isBuildingSelected = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      bl_id: null,
      isEdit: true,
      newRecord: true
    };
    this.blProvider.openDialog(dialogConfig);
    this.displayBlFlUpdate = false;
    this.blProvider.onDialogueClosed.subscribe((result: any) => {
      this.displayBlFlUpdate = true;
      this.messageService.clear();
      if (result != "Cancel") {
        this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Building Added', detail: 'The building was added successfully' });
        this.loadBuilding();
        this.blAndFlForm.patchValue({
          blId: result[1].blId,
          flId: null,
        });
        this.isBuildingSelected = true;
        setTimeout(() => {
          this.loadFloorCode(result[1].blId);
        }, 100)
      }
    })
  }

  onAddNewFloor() {
    this.messageService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      fl_id: null,
      bl_id: this.blAndFlForm.controls.blId.value,
      isEdit: true,
      newRecord: true,
      isSvg: true
    };
    this.flProvider.openDialog(dialogConfig);
    this.displayBlFlUpdate = false;
    this.flProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      this.displayBlFlUpdate = true;
      if (result != "Cancel") {
        this.loadFloor();
        setTimeout(() => {
          this.loadFloorCode(result.blId);
        }, 100)

        this.blAndFlForm.patchValue({
          blId: result.blId,
          flId: result.flId
        });
        this.onSelectFlCode(result);
        this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Floor Added', detail: 'The floor was added successfully' });
      }
    })
  }

  onAddNewRoom() {
    this.messageService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      bl_id: this.svgFlList[0].blId,
      fl_id: this.svgFlList[0].flId,
      rm_id: null,
      isEdit: true,
      newRecord: true,
      isSvg: true
    };
    this.rmProvider.openDialog(dialogConfig);
    this.displayRmUpdate = false;
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      this.displayRmUpdate = true;
      if (result != "Cancel") {
        this.getAllRoomsOfSvg();
        this.rmForm.patchValue({
          rmId: result.rmId
        })
        this.onSelectRoom(result);
        this.messageService.add({ key: 'svgMessage', severity: 'success', summary: 'Room Added', detail: 'The room was added successfully' });
      }
    })
  }

  getval(e: any) {
    if (e.target.className.includes('p-dialog-header-close')) {
      this.onClearSvg();
    }
  }

  saveDialog() {
    let msg = "";
    if (this.roomAlreadyAssignedElement) {
      msg = "Are you sure you want to update from room " + this.roomWithElementId[0].rmId + " to room " +
        this.selectedRoomData[0].rmId + " ?"
    } else {
      msg = UtilConstant.UPDATE_SVG_ROOM;
    }
    this.confirmationService.confirm({
      message: msg,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'svgConfirm',
      accept: () => {
        this.saveRoom();
      }
    });
  }

  unassignRoom() {
    this.updateUnassignRoom();
    this.rmForm.patchValue({
      rmId: null
    })
    this.isRoomIdChanged = true;
    this.roomWithElementId = [];
    this.roomAlreadyAssignedElement = false;
    this.displayRmUpdate = false;
  }

  updateUnassignRoom() {
    if (this.roomAlreadyAssignedElement) {
      let updateData = {
        blId: this.roomWithElementId[0].blId,
        flId: this.roomWithElementId[0].flId,
        rmId: this.roomWithElementId[0].rmId,
        rmName: this.roomWithElementId[0].rmName,
        rmCat: this.roomWithElementId[0].rmCat,
        rmType: this.roomWithElementId[0].rmType,
        rmInfo: this.roomWithElementId[0].rmInfo,
        rmArea: this.roomWithElementId[0].rmArea,
        compId: this.compId,
        svgElementId: null,
        isReservable: this.roomWithElementId[0].isReservable,
        isHotelable: this.roomWithElementId[0].isHotelable,
        rmPhoto1: this.roomWithElementId[0].rmPhoto1,
        rmPhoto2: this.roomWithElementId[0].rmPhoto2

      }
      this.blServ.saveRoom(updateData).subscribe((res: any) => {
        this.getAllRoomsOfSvg();
        setTimeout(() => {
          //this.svgViewComp.loadRoomColors();
        }, 10)
      });
    }
  }

  unassignDialog() {
    this.confirmationService.confirm({
      message: UtilConstant.UnAssign_Warning,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      key: 'svgConfirm',
      accept: () => {
        this.unassignRoom();
      }
    });
  }

}
