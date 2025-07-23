import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { EnumService } from 'src/app/services/enum.service';
import { SiteService } from 'src/app/services/site.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { EqStdDTO } from '../../../eq-std/model/eqStdDto';
import { EqStdService } from '../../../eq-std/services/eq-std.services';
import { EquipmentService } from '../../../equipment/services/equipment.services';
import { AddWrProblemTypeProvider } from '../../../work-request/provider/add-problem-type.provider';
import { MatDialogConfig } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { SiteFilterInputDTO } from 'src/app/ui/site/modal/SiteFilterInputDTO.model';
import { EnumList } from 'src/app/model/enum-list.model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UtilConstant } from 'src/common/UtilConstant';
@Component({
  selector: 'app-add-sla-request',
  templateUrl: './add-sla-request.component.html',
  styleUrls: ['./add-sla-request.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddSlaRequestComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddSlaRequestComponent),
      multi: true
    }
  ]
})
export class AddSlaRequestComponent implements OnInit {
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPriority: EnumList[] = [];
  enumProbTypes: any[] = [];
  subscriptions: Subscription[] = [];
  slaRequestFormPanel: UntypedFormGroup;
  enumSites: SiteFilterInputDTO[] = [];
  enumSiteData: SiteFilterInputDTO[] = [];
  enumAllBL: BuildingFilterInputDTO[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  eqStdData: any[] = [];
  allEqData: any[] = [];
  eqData: any[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  displayProblemType: string = '';
  @Input() isNew!: boolean;
  useTabletProtrait = false;
  limitSite: number = 0;
  offsetSite: number = 0;
  limitBl: number = 0;
  offsetBl: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedSite: any = {};
  selectedBl: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private siteSrv: SiteService,
    private blSrv: BuildingService,
    private eqStdService: EqStdService,
    private eqService: EquipmentService,
    private enumsrv: EnumService,
    private addPbTypeProvider: AddWrProblemTypeProvider,
    private bps: BreakpointService
  ) {
    this.slaRequestFormPanel = this.formBuilder.group({
      slaRequestParametersId: [''],
      problemTypeString: ['', [Validators.required]],
      probTypeId: [null],
      siteId: ['',],
      blId: [''],
      flId: [''],
      rmId: [''],
      eqStdId: [],
      eqId: [],
    });

    this.subscriptions.push(
      this.slaRequestFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadEnums();
    this.loadEqStandard();
    this.loadequipments();
  }
  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla'.toLocaleUpperCase());
        this.enumPriority = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'priority'.toLocaleUpperCase());
        this.enumPriority.unshift(new EnumList(null, "", "", 'Make a selection', null));
      },
      error => {
      }
    );
  }

  loadEqStandard() {
    this.eqStdService.getAllEqStds().subscribe((res: any) => {
      this.eqStdData = res.map((t: any) => { t.displayName = t.description != null ? t.eqStd + " - " + t.description : t.eqStd; return t })
      this.eqStdData.unshift(new EqStdDTO("Make a Selection", '', '', 0))
    })
  }


  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.allEqData = res;
        this.eqData = this.allEqData;
        this.eqData.unshift(new Object({ eqId: "Make a selection", description: '' }))
      }
    });
  }

  onAddProblemType() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      newRecord: true
    };
    this.addPbTypeProvider.openDialog(dialogConfig);
    this.addPbTypeProvider.onDialogueClosed.pipe(take(1)).subscribe((result: any) => {
      if (result) {
        if (result.data) {
          this.slaRequestFormPanel.patchValue({
            probTypeId: result.data.problemTypeId
          });
          this.displayPbTypeFun(result);
          this.displayProblemType = "";
        }
      }
    });
  }

  displayPbTypeFun(pbTypeData: any) {
    if (pbTypeData) {
      this.displayProblemType = this.displayProblemType + pbTypeData.label + " | "
      if (pbTypeData.parent) {
        this.displayPbTypeFun(pbTypeData.parent);
      } else {
        this.displayProblemType = this.displayProblemType.split(" | ").reverse().join(" | ").slice(3);
        this.slaRequestFormPanel.patchValue({
          problemTypeString: this.displayProblemType
        });
      }
    }
  }

  onChangeSite(event: any) {
    if (event.siteId !== "" && event.siteId !== null) {

      this.selectedSite = event;
      this.selectedBl = {};
      setTimeout(() => {
        this.slaRequestFormPanel.patchValue({
          blId: null,
          flId: null,
          rmId: null,
        });
      }, 0);
    } else {
      this.selectedSite = {};
      this.selectedBl = {};
    }
  }

  onSelectBl(event: any) {
    if (event.blId != null && event.blId != '') {
      this.selectedBl = event;
      const siteData = {
        siteId: event.siteId,
        siteName: event.siteNameString,
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);
      setTimeout(() => {
        this.slaRequestFormPanel.patchValue({
          siteId: event.siteId,
          flId: null,
          rmId: null
        });
      }, 0);
    } else {

    }
  }

  onChangeEqStd(event: any) {
    if (event.eqStdId) {
      this.eqData = this.allEqData.filter((t: any) => t.eqStdId === event.eqStdId);
    } else {
      setTimeout(() => {
        this.slaRequestFormPanel.patchValue({
          eqId: null
        });
      }, 0);
      this.eqData = this.allEqData;
    }
  }

  onSelectEq(event: any) {
    if (event.eqId) {
      setTimeout(() => {
        this.slaRequestFormPanel.patchValue({
          eqStd: event.eqStd
        });
      }, 0);
    } else {
      setTimeout(() => {
        this.slaRequestFormPanel.patchValue({
          eqStd: null
        });
      }, 0);
    }
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const me = this;
    const validationErros: VaildationError[] = [];

    return validationErros;
  }

  get value(): any {
    const slaDetails: any = {
      slaRequestParametersId: this.slaRequestFormPanel.controls.slaRequestParametersId.value,
      probTypeId: this.slaRequestFormPanel.controls.probTypeId.value,
      problemTypeString: this.slaRequestFormPanel.controls.problemTypeString.value,
      eqStdId: this.slaRequestFormPanel.controls.eqStdId.value,
      eqId: this.slaRequestFormPanel.controls.eqId.value,
      siteId: this.slaRequestFormPanel.controls.siteId.value,
      blId: this.slaRequestFormPanel.controls.blId.value,
      flId: this.slaRequestFormPanel.controls.flId.value,
      rmId: this.slaRequestFormPanel.controls.rmId.value,
    };
    return slaDetails;
  }

  set value(value: any) {
    if (value.siteId) {
      const siteData = {
        siteId: value.siteId,
        siteName: value.siteSiteName
      }
      this.selectedSite = siteData;
      this.updateSiteList(siteData);
    }
    if (value.blId) {
      const blData: any = {
        blId: value.blId,
        blNameString: value.blBlName,
        site: value.siteId
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
    }
    setTimeout(() => {
      this.slaRequestFormPanel.patchValue({
        slaRequestParametersId: value.slaRequestParametersId,
        probTypeId: value.probTypeId,
        problemTypeString: value.problemTypeString,
        eqStdId: value.eqStdId,
        eqId: value.eqId,
        siteId: value.siteId,
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
      });
    });
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any) {

    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.slaRequestFormPanel.reset();
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  onChange: any = () => { };
  onTouched: any = () => { };

  validate(_: UntypedFormControl) {
    return this.slaRequestFormPanel.valid ? null : { slaRequestFormPanel: { valid: false } };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.bps.unregister(this);
  }

  scrollToEndSite() {
    this.offsetSite = this.limitSite;
    this.limitSite += this.scrollLimit;
    this.filterCriteria.limit = this.limitSite;
    this.filterCriteria.offset = this.offsetSite;
    this.siteSrv.getAllSiteByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumSites = res;
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

  updateSiteList(siteData: any) {
    if (siteData.siteId) {
      this.enumSites = this.enumSites.filter(t => t.siteId !== siteData.siteId);
      this.enumSites = this.enumSites.filter(t => t.siteId !== null);
      this.enumSites.unshift(siteData);
    }
    this.enumSites.unshift(new SiteFilterInputDTO(null, 'Make a selection'));
  }

  updateBlList(blData: any) {
    if (blData.blId) {
      this.enumBL = this.enumBL.filter(t => t.blId !== blData.blId);
      this.enumBL = this.enumBL.filter(t => t.blId !== null);
      this.enumBL.unshift(blData);
    }
    this.enumBL.unshift(new BuildingFilterInputDTO(null, 'Make a selection', null));
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

}
