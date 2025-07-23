import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { BuildingService } from '../services/bl.service';
import { BuildingFilterInput } from '../model/DTO/blFilterInput.model';
import { BlListComponent } from '../widgets/bl-list/bl-list.component';
import { FlListComponent } from '../widgets/fl-list/fl-list.component';
import { RmListComponent } from '../widgets/rm-list/rm-list.component';
import { SiteComponent } from '../../site/modal/site.component';
import { SiteService } from 'src/app/services/site.service';
import { BuildingFilterInputDTO } from '../model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from '../model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from '../model/DTO/RoomFilterInputDTO.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UtilConstant } from 'src/common/UtilConstant';

declare var $: any;
@Component({
  selector: 'app-background-loc',
  templateUrl: './background-loc.component.html',
  styleUrls: ['./background-loc.component.scss']
})
export class BackgroundLocComponent implements OnInit {

  filterPanel: UntypedFormGroup;
  confirmationResult: any;
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBL: BuildingFilterInputDTO[] = [];
  enumComp: BuildingFilterInput[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  enumRM: RoomFilterInputDTO[] = [];
  enumALLRM: RoomFilterInputDTO[] = [];
  enumSite: any[] = [];
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  tab_name_clicked: string = "";
  selectedSiteId: number | null = null;
  selectSiteId: number | null = null;
  SiteIdLoading = false;
  SiteIdInput$ = new Subject<string>();
  selectedBlId: number | null = null;
  BlIdLoading = false;
  BlIdInput$ = new Subject<string>();
  selectedFlId: number | null = null;
  FlIdLoading = false;
  FlIdInput$ = new Subject<string>();
  selectedRmId: number | null = null;
  RmIdLoading = false;
  RmIdInput$ = new Subject<string>();
  CompIdLoading = false;
  CompIdInput$ = new Subject<string>();
  selectedSiteName: string = '';
  selectedBlName: string = '';
  selectedFlName: string = '';
  useTabletProtrait = false;
  limitSite: number = 0;
  offsetSite: number = 0;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  selectedSite: any = {};
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  @ViewChild(SiteComponent, { static: false }) sitePanel!: SiteComponent;
  @ViewChild(BlListComponent, { static: false }) blListPanel!: BlListComponent;
  @ViewChild(FlListComponent, { static: false }) flListPanel!: FlListComponent;
  @ViewChild(RmListComponent, { static: false }) rmListPanel!: RmListComponent;
  constructor(
    private fb: UntypedFormBuilder,
    private blSrv: BuildingService,
    private siteService: SiteService,
    private cdRef: ChangeDetectorRef,
    private bps: BreakpointService
  ) {
    this.filterPanel = this.fb.group({
      blId: [null],
      flId: [null],
      rmId: [null],
      siteId: [null],
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
    for (var fieldId in this.filterPanel.controls) {
      this.filterPanel.controls[fieldId].setValue(null);
    }
   
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  onSelectSiteCode(event: any) {
    setTimeout(() => {
      this.filterPanel.patchValue({
        blId: null,
        flId: null,
        rmId: null
      });
    }, 10);
    if (event.siteId != null) {

      this.selectedSite = event;
      this.selectedBl = {};
    } else {
      this.selectedSite = {};
    }
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
      const siteData = {
        siteId: $event.siteId,
        siteNameString: $event.siteNameString,
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);
      this.selectedFl = {};
      setTimeout(() => {
        this.filterPanel.patchValue({
          siteId: $event.siteId,
        });
      }, 10);
    }
    else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode(event: any) {

    if (event.flId != null) {
      this.selectedFl = event;
      const siteData = {
        siteId: event.siteId,
        siteNameString: event.siteNameString,
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);

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
          siteId: event.siteId,
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

  ngAfterViewInit() {
    this.onFilter();
    this.tab_name_clicked = 'Site';
    $("#tabContent,#Site").show();
    this.cdRef.detectChanges();
  }
  onClear() {
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.selectedSiteId = null;
    this.selectedBlId = null;
    this.selectedFlId = null;
    this.selectedRmId = null;
    this.blListPanel.isHide = true;
    this.flListPanel.isHide = true;
    this.rmListPanel.isHide = true;
    this.filterPanel.patchValue({
      blId: null,
      flId: null,
      rmId: null,
      siteId: null
    });
    this.onFilter();
    this.selectedSite = {};
    this.selectedBl = {};
    this.selectedFl = {};
    this.selectedRm = {};

  }
  onFilter() {
    var siteId = this.filterPanel.controls.siteId.value;
    var blId = this.filterPanel.controls.blId.value;
    var flId = this.filterPanel.controls.flId.value;
    var rmId = this.filterPanel.controls.rmId.value;
    this.selectSiteId = siteId;
    this.selectedBlId = blId;
    this.selectedFlId = flId;
    let siteData = {
      siteId: siteId,
      siteCode: null,
      siteName: null,
      filterDto: { paginationDTO: {}, filterCriteria: [] }
    }
    let blData = {
      blId: blId,
      name: null,
      siteId: siteId,
    };
    let flData = {
      flId: flId,
      name: null,
      blId: blId,
      siteId: siteId,
    };
    let rmData = {
      rmId: rmId,
      name: null,
      flId: flId,
      blId: blId,
      siteId: siteId,
    };
    this.sitePanel.loadRecords(siteData);
    this.blListPanel.loadRecords(blData);
    this.flListPanel.loadRecords(flData);
    this.rmListPanel.loadRecords(rmData);
  }

  openClickTab(event: any, name: any) {
    this.loadTabData(name);
    event.preventDefault();

  }

  loadTabData(name: any) {
    this.hidePrevTab(this.tab_name_clicked);
    this.tab_name_clicked = name;
    $("#tabContent").hide();

    switch (this.tab_name_clicked) {
      case "Site": {
        $("#tabContent,#Site").show();
        break;
      }
      case "Building": {
        if (this.selectedSiteName != "") {
          this.blListPanel.selectedSite = 'Site : ' + this.selectedSiteName;
          this.blListPanel.isHide = false;
        } else {
          this.blListPanel.selectedSite = "";
          this.blListPanel.isHide = true;
        }
        var blId = this.filterPanel.controls.blId.value
        let blData = {
          blId: blId ? blId : 0,
          name: '',
          siteId: this.selectedSiteId ? this.selectedSiteId : 0,
        }
        this.blListPanel.loadRecords(blData);//BuildingFilterInput
        $("#tabContent,#Building").show();
        break;
      }
      case "Floor": {
        this.flListPanel.isHide = true;
        if (this.selectedSiteName != "") {
          this.flListPanel.selectedSite = 'Site : ' + this.selectedSiteName;
          this.flListPanel.isHide = false;
        } else {
          this.flListPanel.selectedSite = '';
        }
        if (this.selectedBlName != "") {
          this.flListPanel.selectedBldg = 'Building : ' + this.selectedBlName;
          this.flListPanel.isHide = false;
        } else {
          this.flListPanel.selectedBldg = '';
          this.selectedBlId = this.filterPanel.controls.blId.value;
        }
        var flId = this.filterPanel.controls.flId.value;
        let flData = {
          flId: flId ? flId : 0,
          siteId: this.selectedSiteId ? this.selectedSiteId : 0,
          blId: this.selectedBlId ? this.selectedBlId : 0,
        }
        this.flListPanel.loadRecords(flData);//FLFilterInputDTO
        $("#tabContent,#Floor").show();
        break;
      }
      case "Room": {
        this.rmListPanel.isHide = true;
        if (this.selectedSiteName != "") {
          this.rmListPanel.selectedSite = 'Site : ' + this.selectedSiteName;
          this.rmListPanel.isHide = false;
        } else {
          this.rmListPanel.selectedSite = '';
        }
        if (this.selectedBlName != "") {
          this.rmListPanel.selectedBldg = 'Building : ' + this.selectedBlName;
          this.rmListPanel.isHide = false;
        } else {
          this.rmListPanel.selectedBldg = '';
          this.selectedBlId = this.filterPanel.controls.blId.value;
        }
        if (this.selectedFlId != null) {
          this.rmListPanel.selectedFloor = 'Floor : ' + this.selectedFlId;
          this.rmListPanel.isHide = true;
        } else {
          this.rmListPanel.selectedFloor = '';
          this.selectedFlId = this.filterPanel.controls.flId.value;
        }
        var rmId = this.filterPanel.controls.rmId.value;
        let rmData = {
          rmId: rmId ? rmId : 0,
          flId: this.selectedFlId ? this.selectedFlId : 0,
          blId: this.selectedBlId ? this.selectedBlId : 0,
        }
        this.rmListPanel.loadRecords(rmData);
        $("#tabContent,#Room").show();
        break;
      }
      default: {
        break;
      }
    }

  }

  hidePrevTab(name: any) {
    switch (name) {
      case "Site": {
        $("#Site").hide();
        break;
      }
      case "Building": {
        $("#Building").hide();
        break;
      }
      case "Floor": {
        $("#Floor").hide();
        break;
      }
      case "Room": {
        $("#Room").hide();
        break;
      }
      default: {
        break;
      }
    }
  }

  loadBuildingTab(data: any) {
    $("#Site").hide();
    let blData = {
      blId: 0,
      name: "",
      siteId: data.siteId ? data.siteId : 0,
    };
    this.selectedSiteId = data.siteId;
    this.selectedSiteName = data.siteName;
    this.blListPanel.selectedSite = this.selectedSiteName != '' ? 'Site : ' + this.selectedSiteName : '';
    this.blListPanel.isHide = false;
    this.blListPanel.loadRecords(blData);
    this.tab_name_clicked = "Building";
    $("#tabContent,#Building").show();

  }

  loadFloorTab(data: any) {
    if (data == true) {
      this.selectedSiteId = null;
      this.selectedSiteName = "";
      this.blListPanel.isHide = true;
      let blData = {
        blId: 0,
        name: "",
        siteId: 0,
      };
      this.blListPanel.loadRecords(blData); //BuildingFilterInput
    } else {

      $("#Building").hide();
      let flData = {
        flId: 0,
        name: null,
        blId: data.blId,
      };
      this.selectedBlId = data.blId;
      this.flListPanel.selectedSite = this.selectedSiteName != '' ? 'Site : ' + this.selectedSiteName : '';
      this.flListPanel.selectedBldg = 'Building : ' + data.blName;
      this.selectedBlName = data.blName;
      this.flListPanel.isHide = false;
      this.flListPanel.loadRecords(flData);
      this.tab_name_clicked = "Floor";
      $("#tabContent,#Floor").show();
    }
  }

  loadRoomTab(data: any) {
    if (data == true) {
      this.selectedBlId = null;
      this.selectedFlId = null;
      this.selectedSiteId = null;
      this.selectedSiteName = "";
      this.selectedBlName = "";
      this.selectedFlName = "";
      this.flListPanel.isHide = true;
      let flData = {
        flId: 0,
        name: null,
        blId: 0,
      };
      this.flListPanel.loadRecords(flData);
    } else {
      $("#Floor").hide();
      let rmData = {
        rmId: data.rmId ? data.rmId : 0,
        flId: data.flId ? data.flId : 0,
        blId: data.blId ? data.blId : 0,
      };

      this.selectedBlId = data.blId;
      this.selectedFlId = data.flId;
      this.rmListPanel.selectedSite = this.selectedSiteName != "" ? 'Site : ' + this.selectedSiteName : '';
      this.rmListPanel.selectedBldg = 'Building : ' + data.blBlName;
      this.rmListPanel.selectedFloor = 'Floor : ' + data.flName;
      this.rmListPanel.isHide = false;

      this.rmListPanel.loadRecords(rmData);
      this.tab_name_clicked = "Room";
      $("#tabContent,#Room").show();
    }
  }

  updateRoomTab(event: any) {
    if (event == true) {
      this.selectedBlId = null;
      this.selectedFlId = null;
      this.selectedSiteId = null;
      this.selectedSiteName = "";
      this.selectedBlName = "";
      this.selectedFlName = "";
    }
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onSelectRmCode(event: any) {
    if (event.rmId != null) {
      this.selectedRm = event;
      const siteData = {
        siteId: event.siteId,
        siteNameString: event.siteNameString,
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);
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
          siteId: event.siteId
        });
      }, 10);
    } else {
    }
  }

  scrollToEndSite() {
    this.offsetSite = this.limitSite;
    this.limitSite += this.scrollLimit;
    this.filterCriteria.limit = this.limitSite;
    this.filterCriteria.offset = this.offsetSite;
    this.siteService.getAllSiteByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumSite = res;
      this.updateSiteList(this.selectedSite);
    })
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
      this.enumRM = res;
      this.updateRmList(this.selectedRm);
    })
  }

  searchSite(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "siteName", value: event.term, matchMode: "contains" };
    this.scrollToEndSite();
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

  updateSiteList(siteData: any) {
    if(siteData.siteId) {
      this.enumSite = this.enumSite.filter(t => t.siteId !== siteData.siteId);
      this.enumSite = this.enumSite.filter(t => t.siteId !== null);
      this.enumSite.unshift(siteData);  
    }
    this.enumSite.unshift(new Object({ siteId: null, siteNameString: 'Make a selection' }));
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
      this.enumRM = this.enumRM.filter(t => t.rmId !== rmData.rmId);
      this.enumRM = this.enumRM.filter(t => t.rmId !== null);
      this.enumRM.unshift(rmData)  
    }
    this.enumRM.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
  }

  onOpenSite() {
    this.limitSite = 0;
    this.offsetSite = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndSite();
  }

  onOpenBl() {
    this.limitBl = 0;
    this.offsetBl = 0;
    if (this.selectedSite.siteId) {
      this.filterCriteria = { fieldName: "site.siteId", value: this.selectedSite.siteId, matchMode: "equals", limit: 0, offset: 0 }
    } else {
      this.filterCriteria = {
        fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
      };
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
