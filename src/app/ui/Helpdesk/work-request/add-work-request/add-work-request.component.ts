import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EnumList } from 'src/app/model/enum-list.model';
import { SvgRoomDataInput } from 'src/app/model/svgroomdatainput.model';
import { VaildationError } from 'src/app/model/vaildationerror.model';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { EnumService } from 'src/app/services/enum.service';
import { SiteService } from 'src/app/services/site.service';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { EmployeeDetails } from 'src/app/ui/employee/model/employee-details.model';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { SiteFilterInputDTO } from 'src/app/ui/site/modal/SiteFilterInputDTO.model';
import { SvgViewComponent } from 'src/app/ui/svg-view/svg-view.component';
import { UtilConstant } from 'src/common/UtilConstant';
import { Equipment } from '../../equipment/modal/DTO/equipmentDto.modal';
import { EquipmentService } from '../../equipment/services/equipment.services';
import { ProblemDescriptionService } from '../../help-desk-problem-description/services/problem-description.services';
import { SLARequestServices } from '../../sla-request-parameters/services/sla-request-parameters.service';
import { AddWrProblemTypeProvider } from '../provider/add-problem-type.provider';
import { AddWorkRequestService } from '../service/add-work-request.services';

@Component({
  selector: 'app-add-work-request',
  templateUrl: './add-work-request.component.html',
  styleUrls: ['./add-work-request.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddWorkRequestComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddWorkRequestComponent),
      multi: true
    },
    MessageService
  ],
})

export class AddWorkRequestComponent implements OnInit {
  addWrFormPanel: UntypedFormGroup;
  subscriptions: Subscription[] = [];
  enumRequestedFor: any[] = [];
  enumAllSites: SiteFilterInputDTO[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInputDTO[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumRM: BuildingFilterInputDTO[] = [];
  enumAllEquipment: any[] = [];
  enumEquipment: any[] = [];
  enumAllFL: FloorFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  problemTypeData: any[] = [];
  dissabled!: false;
  showTimeToResponse: string = '';
  showTimeToCompleted: string = '';
  showAutoIssue: string = '';
  showAutoApproval: string = '';
  enumDeafultValue: EnumList[] = [];
  isPrivorityChecked: boolean = false;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumStatus: EnumList[] = [];
  enumSlaResponseParam: EnumList[] = [];
  enumAutoIssue: EnumList[] = [];
  enumIsDeafult: EnumList[] = [];
  enumAutoApproval: EnumList[] = [];
  enumRequested: EnumList[] = [];
  selectedPriority: any;
  selectedPriorityRec: any;
  enumWrSteps: EnumList[] = [];
  enumStepType: EnumList[] = [];
  status: any;
  emDefualtLoacation: any[] = [];
  displayProblemType: string = '';
  problemTypeId: number = 0;
  today: Date = new Date();
  @Input() isView: boolean = false;
  @Input() isDetails: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() afterSavedForm: boolean = false;
  @Input() editFields: boolean = true;
  selectedProblemDescription: any | undefined;
  problemDescriptionList: any[] = [];
  filteredProblemDescriptionList: any[] = [];
  setAssetReadOnly: boolean = false;
  parameters: any = {
    "siteId": null,
    "blId": null,
    "flId": null,
    "rmId": null,
    "eqId": null,
    "probTypeId": null,
    "emId": null,
  }
  slaData: any[] = [];
  slaResponseParameters: any[] = [];
  selectedCategory: any = null;
  escDateToRespond: any;
  escTimeToRespond: any;
  escTimeToComplete: any;
  escDateToComplete: any;
  displaySuccPopUp: boolean = false;
  requestId: any;
  slaResponseParametersId: number = 0;
  @ViewChild('op', { static: false }) op!: OverlayPanel;
  searchTextLower: string = '';
  rowCount: number = UtilConstant.ROW_COUNT;
  idDisabled: boolean = true;
  isEmpSelected: boolean = false;
  isAssetSelected: boolean = false;
  isRoomSelected: boolean = false;
  viewSvg: boolean = false;
  showSvg: boolean = false;
  showSpinnerParent: boolean = false;
  noSVGFound: boolean = false;
  allEmployees: any[] = [];
  svgDialogHeaderText: string = '';
  showMessage: boolean = false;
  docBucketId: number = 0;
  @ViewChild(SvgViewComponent, { static: true }) svgViewComponent!: SvgViewComponent;
  @Output() parentFun = new EventEmitter();
  svgDialogWidth = '';
  useTabletProtrait = false;
  limitBl: number = 0;
  offsetBl: number = 0;
  limitFl: number = 0;
  offsetFl: number = 0;
  limitRm: number = 0;
  offsetRm: number = 0;
  limitEm: number = 0;
  offsetEm: number = 0;
  filterCriteria: any = {
    fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
  };
  selectedBl: any = {};
  selectedFl: any = {};
  selectedRm: any = {};
  selectedEm: any = {};
  scrollLimit: number = UtilConstant.SCROLL_LIMIT;
  svgInputData :SvgRoomDataInput = new SvgRoomDataInput(null,null,null,false,false,false,false,false,"",null,"","",null,null);
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authSrv: AuthService,
    private enumsrv: EnumService,
    private emServ: EmployeeService,
    private confirmationService: ConfirmationService,
    private siteServ: SiteService,
    private blServ: BuildingService,
    private eqServ: EquipmentService,
    private wrServ: AddWorkRequestService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private addPbTypeProvider: AddWrProblemTypeProvider,
    private slaRequestParameterSer: SLARequestServices,
    private pdService: ProblemDescriptionService,
    private router: Router,
    private parentSpinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private bps: BreakpointService
  ) {
    this.addWrFormPanel = this.formBuilder.group({
      selectedPriority: new UntypedFormControl(),
      wrId: [0],
      parentWrId: [null],
      eqDescription: [null],
      completeByDate: [null],
      respondByDate: [null],
      status: [null],
      siteId: [null],
      blId: [null, [Validators.required]],
      flId: [null],
      rmId: [null],
      eqId: [null],
      probTypeId: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dateRequested: [null],
      timeRequested: [null],
      dateCompleted: [null],
      timeCompleted: [null],
      dateResponded: [null],
      timeResponded: [null],
      escDateResponded: [null],
      escTimeResponded: [null],
      escDateCompleted: [null],
      escTimeCompleted: [null],
      slaRequestParametersId: [null],
      requestedBy: [null],
      requestedFor: [null, [Validators.required]],
      dateToPerform: [new Date()],
      slaResponseParametersId: [null],
      respondedDateTime: [null],
      completedDateTime: [null],
      docBucketId: [null],
      scheduleId: [null],
      planId: [null],
      problemTypeString: [null]
    });
    this.subscriptions.push(
      this.addWrFormPanel.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadEnumsData();
    this.loadEquipments();
    this.addWrFormPanel.patchValue({
      dateRequested: new Date(),
      timeRequested: new Date(),
    })
    this.setAssetReadOnly = true;
    this.loadDefaultUser();
    if (this.isReadOnly) {
      this.addWrFormPanel.disable();
    }
    this.loadProblemDescription();
    this.disableDateTimeFields();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if (this.useTabletProtrait) {
      this.svgDialogWidth = '75vw';
    } else {
      this.svgDialogWidth = '50vw';
    }
  }

  loadProblemDescription() {
    this.pdService.getALLPds().subscribe((res: any[]) => {
      this.problemDescriptionList = res;
      this.filteredProblemDescriptionList = this.problemDescriptionList
    })
  }

  loadDefaultUser() {
    if (this.isDetails || this.isView) {
      //nothing to perform
    } else {
      const emId = this.authSrv.getLoggedInUserEMId();
      this.emServ.getEmById(emId).subscribe((res: any) => {
        const emData = this.createEmData(res.em);
        this.selectedEm = emData;
        this.updateEmList(emData);
        if (res.employeeLocation.blId !== null) {

          this.getBlById(res.employeeLocation.blId);
          if (res.employeeLocation.flId != null) {
            this.getFlById(res.employeeLocation.flId);
          }
          if (res.employeeLocation.rmId != null) {
            this.getRmById(res.employeeLocation.rmId);
          }
          this.isEmpSelected = true;
          this.isRoomSelected = true;
          setTimeout(() => {
            this.addWrFormPanel.patchValue({
              blId: res.employeeLocation.blId,
              flId: res.employeeLocation.flId,
              rmId: res.employeeLocation.rmId,
              siteId: res.employeeLocation.blSiteId,
              requestedFor: res.employeeDetails.emId,
              status: "Requested"
            });
            this.setAssetReadOnly = false;
            this.enumEquipment = this.enumAllEquipment.filter((eq: any) => eq.blId === res.employeeLocation.blId);
            this.enumEquipment.unshift(new Equipment('Make a selection', null, '', '', '', '', 0, '', ''));
          }, 0);
          this.parameters = {
            ...this.parameters,
            blId: res.employeeLocation.blId,
            flId: res.employeeLocation.flId,
            rmId: res.employeeLocation.rmId,
            siteId: res.employeeLocation.blSiteId,
            emId: null
          };
        } else if (res.employeeDetails.emId) {
          setTimeout(() => {
            this.addWrFormPanel.patchValue({
              requestedFor: res.employeeDetails.emId,
              status: "Requested"
            });
          }, 0)
          this.isEmpSelected = true;
        } else {
          this.isEmpSelected = false;
        }
        this.loadApplicableSla(this.parameters);
      })
    }

  }

  loadEnumsData() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        // this.enumSlaResponseParam = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase());
        this.enumAutoIssue = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_issue'.toLocaleUpperCase());
        this.enumAutoApproval = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'auto_approval'.toLocaleUpperCase());
        this.enumDeafultValue = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'sla_response_parameters'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'is_default'.toLocaleUpperCase());
        // this.enumWrSteps = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase());
        this.enumStepType = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr_steps'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'step_type'.toLocaleUpperCase());
      },
      error => {
      }
    );
  }

  loadRequestedForData() {
    this.emServ.getAllEmployeeList().subscribe((res: any) => {
      this.allEmployees = res.map((i: any) => { i.blCode = i.blBlCode; i.flCode = i.flFlCode; return i; });
      this.enumRequestedFor = res;
      this.enumRequestedFor = res.map((i: any) => { i.fullName = i.emCode + ' - ' + i.firstName + " " + i.lastName; return i; });
      this.enumRequestedFor.unshift(new EmployeeDetails({ fullName: 'Make a selection', emId: "", initials: "", firstName: "", lastName: "", maidenName: "", aliasName: "", email: "", emStd: "", emStatus: 0, idNumber: "", birthDate: null, gender: 0, compName: "", dateJoin: "", dateLeave: "", compId: 0, emPhoto: "", ccCode: 0, lineMngr: "", emPhotoMobile: "" }));
    });
  }

  loadEquipments() {
    this.eqServ.getAllEquipments().subscribe((res: any) => {
      this.enumAllEquipment = res;
      this.enumAllEquipment = res.map((i: any) => { i.displayEqId = i.eqCode; return i; });
      this.enumEquipment = [...this.enumAllEquipment];
    })
  }

  onSelectRequestedFor($event: any) {
    this.isEmpSelected = false;
    // this.isRoomSelected = false;
    const em_id = $event.emId;
    this.slaData = [];
    this.slaResponseParameters = [];
    if (em_id != "") {
      this.isEmpSelected = true;
      this.enumBL = this.enumBL
      this.enumFL = this.enumAllFL
      this.rm_data = this.allRmDdata
      this.emServ.getEmById(em_id).subscribe((res: any) => {
        const emData = this.createEmData(res.em);
        this.selectedEm = emData;
        this.updateEmList(emData);
        if (res.employeeLocation.blId) {
          this.getBlById(res.employeeLocation.blId);
          if (res.employeeLocation.flId != null) {
            this.getFlById(res.employeeLocation.flId);
          }
          if (res.employeeLocation.rmId != null) {
            this.getRmById(res.employeeLocation.rmId);
          }
          this.parameters = {
            ...this.parameters,
            blId: res.employeeLocation.blId,
            flId: res.employeeLocation.flId,
            rmId: res.employeeLocation.rmId,
            siteId: res.employeeLocation.blSiteId,
            emId: null
          };
          // Get Applicable Sla
          this.loadApplicableSla(this.parameters);
          this.isRoomSelected = true;
          setTimeout(() => {
            this.addWrFormPanel.patchValue({
              blId: res.employeeLocation.blId,
              flId: res.employeeLocation.flId ? res.employeeLocation.flId : null,
              rmId: res.employeeLocation.rmId ? res.employeeLocation.rmId : null,
              siteId: res.employeeLocation.blSiteId,
            })
          }, 0)
        } else {
          this.loadApplicableSla(this.parameters);
        }
      })
    } else {
      this.isEmpSelected = false;
    }
  }


  onSelectBlCode($event: any) {
    this.slaData = [];
    this.slaResponseParameters = []
    this.isRoomSelected = false;
    this.isAssetSelected = false;
    if ($event.blId != null && $event.blId != '') {
      this.selectedBl = $event;
      this.selectedFl = {};
      this.parameters = {
        ...this.parameters,
        blId: $event.blId,
        flId: null,
        rmId: null,
        siteId: $event.siteId,
        eqId: null
      };
      this.enumEquipment = this.enumAllEquipment.filter((eq: any) => eq.blId === $event.blId);
      this.enumEquipment.unshift(new Equipment('Make a selection', null, '', '', '', '', 0, '', ''));
      this.setAssetReadOnly = false;
      // Get Apllicable SLa
      this.loadApplicableSla(this.parameters);

      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          flId: null,
          rmId: null,
          siteId: $event.siteId,
          eqId: null,
          eqDescription: null
        });
      }, 0);
    }
    else {
      this.enumEquipment = [];
      this.setAssetReadOnly = true;
      this.parameters = {
        ...this.parameters,
        blId: null,
        siteId: null,
        flId: null,
        rmId: null,
        eqId: null,
      };
      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);
      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          flId: null,
          rmId: null,
          blId: null,
          siteId: null,
          eqId: null,
          eqDescription: null
        });
      }, 0);
      this.selectedBl = {};
     this.selectedFl = {};
    }
  }

  onSelectFlCode($event: any) {
    this.slaData = [];
    this.slaResponseParameters = []
    this.isRoomSelected = false;
    if ($event.flId != null && $event.flId != '') {
      this.selectedFl = $event;
      this.getBlById($event.blId);
      this.parameters = {
        ...this.parameters,
        blId: $event.blId,
        flId: $event.flId,
        siteId: $event.siteId,
        rmId: null,
      }
      // Get Applicable SLA.
      this.loadApplicableSla(this.parameters);

      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          blId: $event.blId,
          siteId: $event.siteId,
          rmId: null,
          eqId: null,
          eqDescription: null
        });
      }, 0);

      this.enumEquipment = this.enumAllEquipment.filter((eq: any) => eq.blId === $event.blId);
      this.enumEquipment.unshift(new Equipment('Make a selection', null, '', '', '', '', 0, '', ''));
      this.setAssetReadOnly = false;
    }
    else {
      this.isRoomSelected = false;
      this.parameters = {
        ...this.parameters,
        flId: null,
        rmId: null
      };

      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);

      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          rmId: null,
        });
      }, 0);
    }
   this.selectedRm = {};
  }

  onSelectRmCode($event: any) {
    this.isRoomSelected = false;
    this.slaData = [];
    this.slaResponseParameters = []
    if ($event.rmId != null && $event.rmId != '') {
      this.selectedRm = $event;
      this.getBlById($event.blId);
      this.getFlById($event.flId);
      this.isRoomSelected = true;
      this.parameters = {
        ...this.parameters,
        blId: $event.blId,
        flId: $event.flId,
        rmId: $event.rmId,
        siteId: $event.siteId,
      }

      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);

      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
          siteId: $event.siteId,
          eqId: null,
          eqDescription: null,
        });

      }, 0);
      this.enumEquipment = this.enumAllEquipment.filter((eq: any) => eq.blId === $event.blId);
      this.enumEquipment.unshift(new Equipment('Make a selection', null, '', '', '', '', 0, '', ''));
      this.setAssetReadOnly = false;
    } else {
      this.isRoomSelected = false;
      this.parameters = {
        ...this.parameters,
        rmId: null,
      };

      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);

      this.setAssetReadOnly = false;
    }
  }

  onSelectEqCode($event: any) {
    this.isAssetSelected = false;
    this.slaData = [];
    this.slaResponseParameters = []
    if ($event.eqId != null && $event.eqId !== '') {
      this.isAssetSelected = true;
      this.isRoomSelected = true;
      this.enumFL = this.enumAllFL
      this.rm_data = this.allRmDdata
      this.parameters = {
        ...this.parameters,
        blId: $event.blId,
        flId: $event.flId,
        rmId: $event.rmId,
        eqId: $event.eqId,
      }
      this.getBlById($event.blId);
      if ($event.flId != null) {
        this.getFlById($event.flId);
      }
      if ($event != null) {
        this.getRmById($event.rmId);
      }
      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);
      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          flId: $event.flId,
          rmId: $event.rmId,
          eqDescription: $event.description
        });
      }, 0);

    } else {
      this.isAssetSelected = false;
      this.parameters = {
        ...this.parameters,
        eqId: null,
      };

      // Get Applicable SLA
      this.loadApplicableSla(this.parameters);

      setTimeout(() => {
        this.addWrFormPanel.patchValue({
          eqId: null,
          eqDescription: null
        });
      }, 0);
    }
  }

  onAddProblemType() {
    this.slaData = [];
    this.slaResponseParameters = []
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      isEdit: false,
      newRecord: true
    };
    this.addPbTypeProvider.openDialog(dialogConfig);
    this.addPbTypeProvider.onDialogueClosed.pipe(take(1)).subscribe((result: any) => {
      if (result) {
        if (result.data) {
          this.problemTypeId = result.data.problemTypeId;
          this.parameters = {
            ...this.parameters,
            probTypeId: result.data.problemTypeId,
          };

          // Get Applicable SLA
          this.loadApplicableSla(this.parameters);

        }
        this.displayPbTypeFun(result);
        this.displayProblemType = "";
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
        this.addWrFormPanel.patchValue({
          problemTypeString: this.displayProblemType,
          probTypeId: pbTypeData.key
        });
      }
    }
  }

  public isValid() {
    return this.getValidationErrors().length === 0;
  }

  public getValidationErrors() {
    const validationErros: VaildationError[] = [];
    return validationErros;
  }

  get value(): any {
    const wrDetails: any = {
      wrId: this.addWrFormPanel.controls.wrId.value,
      parentWrId: this.addWrFormPanel.controls.parentWrId.value,
      status: this.addWrFormPanel.controls.status.value,
      siteId: this.addWrFormPanel.controls.siteId.value,
      blId: this.addWrFormPanel.controls.blId.value,
      flId: this.addWrFormPanel.controls.flId.value,
      rmId: this.addWrFormPanel.controls.rmId.value,
      eqId: this.addWrFormPanel.controls.eqId.value,
      probTypeId: this.addWrFormPanel.controls.probTypeId.value,
      description: this.addWrFormPanel.controls.description.value,
      dateRequested: this.addWrFormPanel.controls.dateRequested.value,
      timeRequested: this.addWrFormPanel.controls.timeRequested.value,
      dateCompleted: this.addWrFormPanel.controls.dateCompleted.value,
      timeCompleted: this.addWrFormPanel.controls.timeCompleted.value,
      dateResponded: this.addWrFormPanel.controls.dateResponded.value,
      timeRepsonded: this.addWrFormPanel.controls.timeRepsonded.value,
      slaRequestParametersId: this.addWrFormPanel.controls.slaRequestParametersId.value,
      requestedBy: this.addWrFormPanel.controls.requestedBy.value,
      requestedFor: this.addWrFormPanel.controls.requestedFor.value,
      dateToPerform: this.addWrFormPanel.controls.dateToPerform.value,
      eqDescription: this.addWrFormPanel.controls.eqDescription.value,
      completeByDate: this.addWrFormPanel.controls.completeByDate.value,
      respondByDate: this.addWrFormPanel.controls.respondByDate.value,
      slaResponseParametersId: this.addWrFormPanel.controls.slaResponseParametersId.value,
      respondedDateTime: this.addWrFormPanel.controls.respondedDateTime.value,
      completedDateTime: this.addWrFormPanel.controls.completedDateTime.value,
      docBucketId: this.addWrFormPanel.controls.docBucketId.value,
      scheduleId: this.addWrFormPanel.controls.scheduleId.value,
      planId: this.addWrFormPanel.controls.planId.value,
    };
    return wrDetails;
  }

  set value(value: any) {
    this.slaResponseParametersId = value.slaResponseParametersId ? value.slaResponseParametersId : 0;
    const dateRequestedToSet = value.dateRequested;
    const timeRequestedToSet = value.timeRequested;
    const dateTimeStringToSet = dateRequestedToSet + ' ' + timeRequestedToSet;
    const escRespondDateTime = (value.escDateResponded && value.escTimeResponded) && (value.escDateResponded + ' ' + value.escTimeResponded);
    const escCompleteDateTime = (value.escDateCompleted && value.escTimeCompleted) && (value.escDateCompleted + ' ' + value.escTimeCompleted);
    const respondedDateTime = (value.dateResponded && value.timeResponded) && (value.dateResponded + ' ' + value.timeResponded);
    const completedDateTime = (value.dateCompleted && value.timeCompleted) && (value.dateCompleted + ' ' + value.timeCompleted);
    this.docBucketId = value.docBucketId;
    this.problemTypeId = value.probTypeId;
    this.parameters = {
      ...this.parameters,
      eqId: value.eqId,
      blId: value.blId,
      flId: value.flId,
      rmId: value.rmId,
      siteId: value.siteId,
      probTypeId: value.probTypeId
    }

    // this.slaResponseParametersId === 0 ?this.loadApplicableSla(this.parameters):this.getSlaResponseParametersById(this.slaResponseParametersId);

    this.loadApplicableSla(this.parameters);

    setTimeout(() => {
      if (value.requestedFor) {
        this.getEmById(value.requestedFor);
      }
      if (value.blId !== null) {
        this.getBlById(value.blId);
        if (value.flId != null) {
          this.getFlById(value.flId);
        }
        if (value.rmId != null) {
          this.getRmById(value.rmId);
        }
        this.setAssetReadOnly = false;
        this.enumEquipment = this.enumAllEquipment.filter((eq: any) => eq.blId === value.blId);
        //this.enumEquipment.unshift(new Equipment('Make a selection', null, '', '', '', '', 0, '', this.compId));
      } else {
        this.setAssetReadOnly = true;
      }


      this.addWrFormPanel.patchValue({
        wrId: value.wrId,
        parentWrId: value.parentWrId,
        status: value.status ? value.status : 'Requested',
        siteId: value.siteId,
        blId: value.blId,
        flId: value.flId,
        rmId: value.rmId,
        eqId: value.eqId,
        problemTypeString: value.problemTypeString,
        description: value.description,
        dateRequested: new Date(value.dateRequested),
        timeRequested: new Date(dateTimeStringToSet),
        dateCompleted: value.dateCompleted,
        timeCompleted: value.timeCompleted,
        dateResponded: value.dateResponded,
        timeResponded: value.timeResponded,
        slaRequestParametersId: value.slaRequestParametersId,
        requestedBy: value.requestedBy,
        requestedFor: value.requestedFor,
        dateToPerform: new Date(value.dateToPerform),
        eqDescription: value.eqDescription,
        completeByDate: escCompleteDateTime && new Date(escCompleteDateTime),
        respondByDate: escRespondDateTime && new Date(escRespondDateTime),
        slaResponseParametersId: value.slaResponseParametersId,
        respondedDateTime: respondedDateTime && new Date(respondedDateTime),
        completedDateTime: completedDateTime && new Date(completedDateTime),
        docBucketId: value.docBucketId,
        scheduleId: value.scheduleId,
        planId: value.planId,
        probTypeId: value.probTypeId
      });

    }, 100);
    this.onChange(value);
    this.onTouched();
    this.setLocationIcon(value.rmId, value.eqId, value.requestedFor);
  }

  convertToTime(value: any) {
    if (value != null) {
      var currDate = new Date();
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      currDate.setHours(data[0]);
      currDate.setMinutes(data[1]);
      currDate.setSeconds(0);
      currDate.setMilliseconds(0);
      return this.datePipe.transform(currDate, "HH:mm:ss");
    } else {
      return '';
    }
  }

  getIdByStatus(status: any) {
    return this.enumStatus.find((t: any) => t.enumValue.toLocaleUpperCase() === status.toLocaleUpperCase())?.enumKey
  };

  onSaveWr() {
    if (this.addWrFormPanel.valid) {
      const data: any = this.addWrFormPanel.getRawValue();
      const loggedIn = this.authSrv.getLoggedInUserEMId() ? this.authSrv.getLoggedInUserEMId() : null;
      data.requestedBy = loggedIn;
      data.status = this.addWrFormPanel.controls.status.value ? this.addWrFormPanel.controls.status.value : "Requested";
      data.dateRequested = this.datePipe.transform(data.dateRequested, "yyyy-MM-dd");
      data.timeRequested = this.datePipe.transform(data.timeRequested, "HH:mm:ss");
      data.probType = this.problemTypeId;
      data.dateToPerform = this.datePipe.transform(data.dateToPerform, "yyyy-MM-dd");
      data.slaRequestParametersId = this.addWrFormPanel.controls.slaRequestParametersId.value ? this.addWrFormPanel.controls.slaRequestParametersId.value : this.slaData[0].slaRequestParametersId;
      data.escDateResponded = this.datePipe.transform(data.respondByDate, "yyyy-MM-dd");
      data.escTimeResponded = this.datePipe.transform(data.respondByDate, "HH:mm:ss");
      data.escDateCompleted = this.datePipe.transform(data.completeByDate, "yyyy-MM-dd");
      data.escTimeCompleted = this.datePipe.transform(data.completeByDate, "HH:mm:ss");
      data.selectedSlaRespParamId = this.selectedPriority;
      data.slaResponseParametersId = this.selectedPriority;
      this.wrServ.saveWorkRequest(data).subscribe((res: any) => {
        if (res.wrId > 0) {
          if (!this.afterSavedForm) {
            this.displaySuccPopUp = true;
            this.requestId = res.wrId;
          }
          else {
            this.parentFun.emit(res.wrId);
            this.messageService.clear();
            this.messageService.add({ key: 'wrSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
            this.showTimeToResponse = '';
            this.showTimeToCompleted = '';
            this.showAutoIssue = '';
            this.showAutoApproval = '';
            this.isPrivorityChecked = false;
          }
        } else {
          this.displaySuccPopUp = false;
        }
      },
        error => {
        }
      )
    }
  }

  onClear() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to clear?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clearWrFormPanel();
      },
      key: "wrGrid"
    });
  }

  clearWrFormPanel() {
    this.addWrFormPanel.reset();
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.setAssetReadOnly = true;
    this.loadDefaultUser();
    this.addWrFormPanel.patchValue({
      dateToPerform: new Date(),
      dateRequested: new Date(),
      timeRequested: new Date(),
    })
    this.parameters = {
      siteId: null,
      blId: null,
      flId: null,
      rmId: null,
      eqId: null,
      emId: null,
      probType: null,
    }
    this.slaData = [];
    this.slaResponseParameters = []
    this.enumBL = this.enumAllBl;
    this.enumFL = this.enumAllFL;
    this.rm_data = this.allRmDdata;
    this.limitBl = 0;
    this.offsetBl = 0;
    this.limitFl = 0;
    this.offsetFl = 0;
    this.limitRm = 0;
    this.offsetRm = 0;
    this.scrollToEndBl();
    this.scrollToEndFl();
    this.scrollToEndRm();
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
    if (value === null) {
      this.addWrFormPanel.reset();
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
    return this.addWrFormPanel.valid ? null : { addWrFormPanel: { valid: false } };
  }

  handleEscalationDateTime(id: any) {
    const requestTime = this.addWrFormPanel.controls.timeRequested.value;
    const requestDate = this.addWrFormPanel.controls.dateRequested.value;
    if (requestTime !== null && requestDate !== null) {
      const requestDateTime = {
        requestDate: this.datePipe.transform(requestDate, "yyyy-MM-dd"),
        requestTime: this.datePipe.transform(requestTime, "HH:mm:ss"),
        selectedSlaResponseId: id,
      }
      this.wrServ.getEscaltionDateAndTime(requestDateTime).subscribe((res: any) => {
        if (res) {
          this.addWrFormPanel.patchValue({
            respondByDate: new Date(res.responseDateTime),
            completeByDate: new Date(res.completeDateTime),
          })
        }
      })
    }
  }

  selectPriority(rec: any) {
    this.isPrivorityChecked = false;
    this.showTimeToResponse = '';
    this.showTimeToCompleted = '';
    this.showAutoIssue = '';
    this.showAutoApproval = '';
    this.selectedPriorityRec = [];
    this.selectedPriorityRec = rec;
    if (rec.timeToResponse != null && rec.timeToResponse > 0) {
      this.showTimeToResponse = `Response required in ${rec.timeToResponse} hours`;
    }
    if (rec.timeToComplete != null && rec.timeToComplete > 0) {
      this.showTimeToCompleted = `Completion required in ${rec.timeToComplete} hours`;
    }
    if (rec.autoIssue != null && rec.autoIssue > 0) {
      let enumValueForAutoIssue = this.getAutoIssue(rec.autoIssue)
      this.showAutoIssue = enumValueForAutoIssue === "Yes" ? `Request will be AutoIssue ` : '';
    }

    if (rec.autoApproval != null && rec.autoApproval > 0) {
      let enumValueForAutoApproval = this.getAutoApproval(rec.autoIssue)
      this.showAutoApproval = enumValueForAutoApproval === "Yes" ? `Request will be AutoApproval ` : '';
    }

    if (this.showTimeToResponse != '' || this.showTimeToCompleted != '' || this.showAutoIssue != '' || this.showAutoApproval != '' || rec.slaSteps.length > 0) {
      this.isPrivorityChecked = true;
    }
    this.handleEscalationDateTime(rec.slaResponseParametersId);
  }


  getAutoIssue(auto_issue: any) {
    return this.enumAutoIssue.find((t: any) => t.enumKey === auto_issue)?.enumValue
  }

  getAutoApproval(auto_approval: any) {
    return this.enumAutoApproval.find((t: any) => t.enumKey === auto_approval)?.enumValue
  }
  getIsdeafult(is_default: any) {
    return this.enumDeafultValue.find((t: any) => t.enumKey === is_default)?.enumValue
  }


  getDefaultPriority(SlaResponseParam: any[]) {

    if (this.slaResponseParametersId && this.slaResponseParametersId > 0) {
      const selectedResponseParam: any = this.slaResponseParameters.find((each: any) => each.slaResponseParametersId == this.slaResponseParametersId);

      if (!selectedResponseParam) {
        const defaultResponseParam: any = SlaResponseParam.find((each: any) => each.isDefault === "Yes");
        this.selectedPriority = defaultResponseParam.slaResponseParametersId;
      } else {
        this.selectedPriority = selectedResponseParam.slaResponseParametersId;
      }
      return;

    } else {
      SlaResponseParam.forEach(rec => {
        // let isDefault = this.getIsdeafult(rec.isDefault);
        if (rec.isDefault === "Yes") {
          this.slaResponseParameters = this.slaResponseParameters.filter((each: any) => each.slaResponseParametersId !== rec.slaResponseParametersId);
          this.slaResponseParameters.unshift(rec);
          this.selectedPriority = rec.slaResponseParametersId;
          this.handleEscalationDateTime(this.selectedPriority);
          this.selectPriority(rec);
          return;
        }
      })
    }

  }

  getStepTypeValue(stepType: any) {
    return this.enumStepType.find((t: any) => t.enumKey === stepType)?.enumValue
  }

  getPersonName(data: any) {
    let fullName = '';
    if (data.emId !== null) {
      const emData = this.enumRequestedFor.filter((e) => e.emId === data.emId);
      if (emData[0].firstName !== null && emData[0].lastName !== null) {
        fullName = emData[0].firstName + " " + emData[0].lastName
      } else if (emData[0].firstName === null && emData[0].lastName !== null) {
        fullName = emData[0].lastName;
      } else if (emData[0].firstName !== null && emData[0].lastName === null) {
        fullName = emData[0].firstName;
      } else {
        fullName = data.emId;
      }
    } else if (data.cfId !== null) {
      if (data.technicianData.name !== null) {
        fullName = data.technicianData.name
      } else {
        fullName = data.cfId;
      }
    } else if (data.teamId !== null) {
      fullName = data.teamId;
    }
    return fullName;
  }

  onRowSelectProblemDescription(event: any) {
    this.pdService.getPdById(event.data.pdId).subscribe((res: any) => {
      setTimeout(() => {
        if (this.addWrFormPanel != null) {
          this.addWrFormPanel.patchValue({
            description: res.pdDescription,
          });
        }
      }, 0);
    })
    this.toggleOp(event);
  }

  onCloseSucPopUp() {
    this.displaySuccPopUp = false;
    this.clearWrFormPanel();
  }

  onClickGoToDetails() {
    this.displaySuccPopUp = false;
    this.router.navigate(['/work-request-details'], {
      queryParams: {
        requestId: this.requestId,
        fromLoggRequestPage: true,
        action: 'afterSavedForm'
      }
    }
    )
  }

  loadApplicableSla(parameters: any) {
    this.slaRequestParameterSer.getApplicableSlaRequestParameters(parameters).subscribe((res) => {
      if (res.length > 0) {
        this.slaData = res
        if (this.slaData[0].slaResponseParameters.length > 0) {
          this.slaResponseParameters = this.slaData[0].slaResponseParameters;
          this.getDefaultPriority(this.slaData[0].slaResponseParameters);
        }
      } else {
        this.slaData = [];
        this.isPrivorityChecked = false;
        this.addWrFormPanel.patchValue({
          respondByDate: null,
          completeByDate: null
        })
      }
    })
  }

  getSlaResponseParametersById(slaResponseParametersId: any) {
    this.slaResponseParameters = [];
    this.slaRequestParameterSer.getSlaResponseParametersById(slaResponseParametersId).subscribe((res: any) => {
      this.slaResponseParameters.push(res);
      this.selectedPriority = res.slaResponseParametersId;
    })
  }

  filterTable(searchText: any) {
    this.searchTextLower = searchText.toLowerCase();
    this.filteredProblemDescriptionList = this.problemDescriptionList.filter(item =>
      item.pdDescription.toLowerCase().includes(this.searchTextLower)
    );
  }

  toggleOp(event: any) {
    this.op.toggle(event);
    this.filterTable("");
  }

  disableDateTimeFields() {
    this.addWrFormPanel.get('dateRequested')?.disable();
    this.addWrFormPanel.get('timeRequested')?.disable();
    this.addWrFormPanel.get('respondByDate')?.disable();
    this.addWrFormPanel.get('completeByDate')?.disable();
    this.addWrFormPanel.get('respondedDateTime')?.disable();
    this.addWrFormPanel.get('completedDateTime')?.disable();
  }

  setLocationIcon(rmId: any, eqId: any, emId: any) {
    rmId != null ? this.isRoomSelected = true : this.isRoomSelected = false;
    eqId != null ? this.isAssetSelected = true : this.isAssetSelected = false;
    emId != null ? this.isEmpSelected = true : this.isEmpSelected = false;
  }

  locateRoom(fieldType: string) {
    this.showSvg = false;
    this.showMessage = false;
    this.noSVGFound = false;
    this.viewSvg = false;
    this.svgDialogHeaderText = '';
    let emId = this.addWrFormPanel.controls.requestedFor.value;
    if (fieldType === 'em') {
      this.emServ.getEmById(emId).subscribe((res: any) => {
        const employee = res.em
        if (employee.blId !== null && employee.flId !== null && employee.rmId !== null) {
          this.svgDialogHeaderText = '';
          this.svgDialogHeaderText = `'${employee.firstName+" "+ employee.lastName}' is located in Building: ${employee.bl.blCode}, on Floor: ${employee.fl.flCode}. `;
          this.svgInputData  = new SvgRoomDataInput(employee.blId,employee.flId,employee.rmId,false,true,false,false,true,employee.firstName+" "+ employee.lastName,null,"","",null,null);
          this.viewSvg = true;
          this.showSvg = true;
        } else {
          this.noSVGFound = true;
          this.svgDialogHeaderText = 'No location details found';
          this.showMessage = true;
        }
      })
    } else if (fieldType === 'asset') {
      const assetId = this.addWrFormPanel.controls.eqId.value;
      const asset = this.enumEquipment.find(item => item.eqId === assetId);
      if (asset) {
      this.svgDialogHeaderText = '';
      this.svgDialogHeaderText = `'${asset.eqCode}' is located in Building: ${asset.bl.blCode}, on Floor: ${asset.fl.flCode}. `;
      this.svgInputData  = new SvgRoomDataInput(asset.blId,asset.flId,asset.rmId,false,false,true,false,true,"",asset,"","",null,null);
      this.viewSvg = true;
      this.showSvg = true;
      }
    } else if (fieldType === 'rm') {
      const roomId = this.addWrFormPanel.controls.rmId.value;
      const room = this.rm_data.find(item => item.rmId === roomId);
      if (room) {
        this.svgInputData  = new SvgRoomDataInput(room.blId,room.flId,room.rmId,true,false,false,false,true,"",null,"","",null,null);
        this.viewSvg = true;
        this.showSvg = true;
      }
    } else {
      this.noSVGFound = true;
      this.showMessage = true;
    }
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
      this.rm_data = res;
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
      this.rm_data = this.rm_data.filter(t => t.rmId !== rmData.rmId);
      this.rm_data = this.rm_data.filter(t => t.rmId !== null);
      this.rm_data.unshift(rmData)
    }
    this.rm_data.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
  }

  createBlData(bl: any) {
    const blData: any = {
      blId: bl.blId,
      blNameString: bl.blName != null ? bl.blCode + " - " + bl.blName : bl.blCode,
      site: null
    }
    return blData;
  }

  createFlData(fl: any) {
    const flData: any = {
      flId: fl.flId,
      flNameString: fl.flName != null ? fl.flCode + " - " + fl.flName : fl.flCode,
      blId: fl.blId,
      blNameString: fl.bl.blName != null ? fl.bl.blCode + " - " + fl.bl.blName : fl.bl.blCode,
    }
    return flData;
  }

  createRmData(rm: any) {
    const rmData = {
      rmId: rm.rmId,
      rmNameString: rm.rmName != null ? rm.rmCode + " - " + rm.rmName : rm.rmCode,
      flId: rm.flId,
      blId: rm.blId
    }
    return rmData;
  }

  getBlById(blId: any) {
    this.blServ.getBlById(blId).subscribe((res: any) => {
      const blData = this.createBlData(res.bl);
      this.selectedBl = blData;
      this.updateBlList(blData);
    })
  }

  getFlById(flId: any) {
    this.blServ.getFlById(flId).subscribe((res: any) => {
      const flData = this.createFlData(res);
      this.selectedFl = flData;
      this.updateFlList(flData);
    })
  }

  getRmById(rmId: any) {
    this.blServ.getRmById(rmId).subscribe((res: any) => {
      const rmData = this.createRmData(res.rm);
      this.selectedRm = rmData;
      this.updateRmList(rmData);
    })
  }


  getEmById(emId: any) {
    this.emServ.getEmById(emId).subscribe((res: any) => {
      const emData = this.createEmData(res.em);
      this.selectedEm = emData;
      this.updateEmList(emData);
      return res.em;
    })
  }

  scrollToEndEm() {
    this.offsetEm = this.limitEm;
    this.limitEm += this.scrollLimit;
    this.filterCriteria.limit = this.limitEm;
    this.filterCriteria.offset = this.offsetEm;
    this.emServ.getALLmployeeByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumRequestedFor = res;
      this.updateEmList(this.selectedEm);
    })
  }

  searchEm(event: any) {
    this.filterCriteria = {};
    this.filterCriteria = { fieldName: "firstName", value: event.term, matchMode: "contains" };
    this.scrollToEndEm();
  }

  createEmData(em: any) {
    const emData = {
      emId: em.emId,
      emCode: em.emCode,
      firstName: em.firstName
    }
    return emData;
  }

  updateEmList(emData: any) {
    if (emData.emId) {
      this.enumRequestedFor = this.enumRequestedFor.filter(e => e.emId != emData.emId);
      this.enumRequestedFor = this.enumRequestedFor.filter(e => e.emId != null);
      this.enumRequestedFor.unshift(emData);
    }
    this.enumRequestedFor.unshift({ emId: null, firstName: 'Make a selection', emCode: null });
  }

  closeSvgDialog(state:any){
    if(!state){
      this.viewSvg = false;
      this.showSvg = false;
    }
  }

  expandSvgDialog(maximized:any){
    this.parentSpinner.show()
    this.showSpinnerParent= true;
    setTimeout(() => {
    this.showSpinnerParent= false;
    this.parentSpinner.hide();
    }, 100);
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

  onOpenEm() {
    this.limitEm = 0;
    this.offsetEm = 0;
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.scrollToEndEm();
  }

}