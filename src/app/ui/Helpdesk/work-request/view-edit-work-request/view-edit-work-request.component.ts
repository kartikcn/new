import { Component, Input, OnInit } from '@angular/core';
import { UtilConstant } from 'src/common/UtilConstant';
import { AddWorkRequestService } from '../service/add-work-request.services';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { ProblemTypeService } from '../../problem-type/services/problem-type..service';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SiteService } from 'src/app/services/site.service';
import { SiteFilterInput } from 'src/app/ui/site/modal/siteFilterInput.model';
import { AuthService } from 'src/app/services/auth.service';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { RMFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/rmFilterInput.model';
import { Equipment } from '../../equipment/modal/DTO/equipmentDto.modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { WrCommentsProvider } from '../provider/wr-comments-provider';
import { EquipmentService } from '../../equipment/services/equipment.services';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { RoomFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/RoomFilterInputDTO.model';
import { FloorFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/FloorFilterInputDTO.model';
import { BuildingFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/BuildingFilterInputDTO.model';

interface StatusCount {
  status: string;
  count: number;
}
@Component({
  selector: 'app-view-edit-work-request',
  templateUrl: './view-edit-work-request.component.html',
  styleUrls: ['./view-edit-work-request.component.scss'],
  providers: [MessageService],
})
export class ViewEditWorkRequestComponent implements OnInit {

  rowCount: number = UtilConstant.ROW_COUNT;
  allWorkRequestData: any[] = []
  enumStauts: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumStatusData: EnumList[] = [];
  allEmployees: any[] = []
  enumEm: any[] = [];
  fullName: any;
  nodes: any[] = [];
  problemTypeData: any[] = [];
  displayProblemTypeString: string = '';
  problemTypeString: any = "";
  noGrp: boolean = false;
  isGrp: boolean = true;
  requestedData: any[] = [];
  approvedData: any[] = [];
  rejectedData: any[] = [];
  inProcessData: any[] = [];
  completeData: any[] = [];
  closedData: any[] = [];
  statusData: any[] = [];
  allSitesData: any[] = [];
  enumBL: BuildingFilterInputDTO[] = [];
  enumAllBl: BuildingFilterInput[] = [];
  enumFL: FloorFilterInputDTO[] = [];
  enumRM: RoomFilterInputDTO[] = [];
  enumAllEquipment: any[] = [];
  enumEquipment: Equipment[] = [];
  enumAllFL: FLFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  compId: number = 0;
  filterPanel!: UntypedFormGroup;
  updateForm!: UntypedFormGroup;
  reqitems: MenuItem[] = [];
  cancelledData: any[] = [];
  isReload: boolean = false;
  displayForm: boolean = false;
  previousAction: string = '';
  cancelledReason: string | null = null;
  rejctReason: string | null = null;
  holdReason: string | null = null;
  selectedRequest!: any;
  eqData: any[] = [];
  allRequests: any[] = [];
  loading: boolean = false;
  enumStatusFilter: EnumList[] = [];
  holdDialog: UntypedFormGroup;
  displayHoldScreen: boolean = false;
  onHoldForAccessData: any[] = [];
  onHoldForPartsData: any[] = [];
  onHoldForLabourData: any[] = [];
  isUpdateFormValid: boolean = false;
  panelExpanded: boolean = true;
  loggedInUser: string = '';
  loggedInTechnicianId: any;
  showRequestsTypeList: any[] = [{ label: "Preventive Maintenance", value: "ppm" },
  { label: "Facilities Helpdesk", value: "facilities" },
  { label: "All", value: "all" }]
  @Input() showType: string = "facilities";
  useTabletProtrait = false;
  statusCountData: StatusCount[] = [];
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
  constructor(
    private wrServ: AddWorkRequestService,
    private enumsrv: EnumService,
    private employeeService: EmployeeService,
    private problemTypeService: ProblemTypeService,
    private messageService: MessageService,
    private siteService: SiteService,
    private blService: BuildingService,
    private authServ: AuthService,
    private formBuilder: UntypedFormBuilder,
    private confirmationService: ConfirmationService,
    private wrCommentsProvider: WrCommentsProvider,
    private eqService: EquipmentService,
    private router: Router,
    private datePipe: DatePipe,
    private authSrv: AuthService,
    private bps: BreakpointService
  ) {
    this.loggedInUser = this.authServ.getLoggedInUserId();
    this.loggedInTechnicianId = this.authServ.getLoggedInTechnicianId();
    this.filterPanel = this.formBuilder.group({
      siteId: [null],
      blId: [null],
      flId: [null],
      rmId: [null],
      eqId: [null],
      wrId: [null],
      status: [null],
      showType: [this.showType]
    });

    this.updateForm = this.formBuilder.group({
      cancelledReason: [null,],
      rejectReason: [null,],
      holdReason: [null]
    })

    this.reqitems = [
      {
        icon: 'pi-ellipsis-v',
        items: [
        ]
      }
    ];

    this.holdDialog = this.formBuilder.group({
      hold: [null, [Validators.required]],
      reason: [null, [Validators.required]]
    })

  }

  ngOnInit(): void {
    this.bps.register(this);
    this.setShowType();
    this.loadAllEnums();
    this.loadAllEmployee();
    this.loadAllProblemType();
    this.loadequipments();
    this.loadRequests();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
  }

  setShowType() {
    setTimeout(() => {
      this.filterPanel.patchValue({
        showType: this.showType
      });
      //this.loadAllWorkRequest();
      this.loadAllStatusCountDataByFilter();
    })
  }

  loadAllEnums() {
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        if (res) {
          this.enumList = res;
          this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
          this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
          this.enumStatusFilter = [...this.enumStatusData];
          this.enumStatusFilter.unshift(new EnumList(null, "", "", 'Make a selection', null));
        }
      })
  }

  loadAllEmployee() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
      }
      else {
        this.allEmployees = [];
      }
    })
  }

  loadAllProblemType() {
    this.problemTypeService.getAll().subscribe((res: any) => {
      if (res) {
        this.nodes = res;
      }
    })
  }

  getEnumByEnumId(enumKey: any) {
    return this.enumStatusData.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emId;
        } else {
          return em.firstName + ' - ' + em.emId;
        }
      })
    }
    return this.fullName;
  }

  loadAllStatusCountDataByFilter() {
    this.statusCountData = [];
    let filterData = {
      siteId: this.filterPanel.controls.siteId.value,
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      wrId: this.filterPanel.controls.wrId.value,
      status: this.filterPanel.controls.status.value,
      showRequestType: this.filterPanel.controls.showType.value,
      problemType: null,
      dateRequestedFrom: null,
      dateRequestedTo: null,
      requestedFor: null,
      technicianId: null,
    }
    this.loading = true;
    this.isReload = false;
    this.wrServ.getAllStatusWithCount(filterData).subscribe((res: any) => {
      if (res) {
        this.statusCountData = res;
      }
      this.loading = false;
      this.isReload = true;
    })
  }

  getIdByStatus(status: any) {
    return this.enumStatusData.find((t: any) => t.enumValue === status)?.enumKey
  }

  getEnumById(id: any) {
    return this.enumStatusData.find((t: any) => t.id === id)?.enumValue
  }

  onViewWorkRequest(event: any) {
    let status = event.data.status;
    let isRequestor = event.data.isRequestor;
    let isApprover = event.data.isApprover;
    let isSupervisor = event.data.isSupervisor;
    let isTechnician = event.data.technician;
    if (event.data) {
      this.authSrv.setPreviousUrl(this.router.url);
      this.router.navigate(['/work-request-details'], {
        queryParams: {
          requestId: event.data.wrId, index: 0, status: status, viewDetails: true,
          isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician
        }
      })
    }
  }

  onTabClose(event: any) {
  }

  onTabOpen(event: any) {
    this.statusData = [];
    let statusName = this.statusCountData[event.index].status;

    let filterData = {
      siteId: this.filterPanel.controls.siteId.value,
      blId: this.filterPanel.controls.blId.value,
      flId: this.filterPanel.controls.flId.value,
      rmId: this.filterPanel.controls.rmId.value,
      eqId: this.filterPanel.controls.eqId.value,
      wrId: this.filterPanel.controls.wrId.value,
      status: statusName,
      showRequestType: this.filterPanel.controls.showType.value,
      problemType: null,
      dateRequestedFrom: null,
      dateRequestedTo: null,
      requestedFor: null,
      technicianId: null,
    }
    this.wrServ.getAllWrByFilter(filterData).subscribe((res: any) => {
      if (res.code === 409) {
        this.messageService.add({ key: 'error', severity: 'warn', summary: res.text, });
      } else {
        this.statusData = res;
      }
    })
  }

  findStatusCount(status: any) {

    let result = this.statusCountData.find(each => each.status == status);
    return `${status}(${result?.count})`;
  }

  setMenuList(event: any, menu: Menu, record: any) {
    this.reqitems[0].items = [];
    this.selectedRequest = record;
    let status = record.status;
    switch (status?.toLowerCase()) {
      case 'requested':
        if (record.isApprover === '1') {
          this.reqitems[0].items?.push({
            'label': 'Approve',
            command: (event) => {
              this.confirmDialog(record, "Approve");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Reject',
            command: (event) => {
              this.updateRequest(record, "Reject");
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }

        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });

        break;
      case 'approved':
        if (record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Issue',
            command: (event) => {
              this.confirmDialog(record, 'Issue')
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }
        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });
        break;
      case 'rejected':

        break;
      case 'on hold for access':

        if (record.isSupervisor === '1' || record.isTechnician === '1') {
          this.reqitems[0].items?.push({
            'label': 'Resume',
            command: (event) => {
              this.confirmDialog(record, "Resume");
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }


        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });

        break;
      case 'on hold for parts':

        if (record.isSupervisor === '1' || record.isTechnician === '1') {
          this.reqitems[0].items?.push({
            'label': 'Resume',
            command: (event) => {
              this.confirmDialog(record, "Resume");
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }


        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });

        break;
      case 'on hold for labour':

        if (record.isSupervisor === '1' || record.isTechnician === '1') {
          this.reqitems[0].items?.push({
            'label': 'Resume',
            command: (event) => {
              this.confirmDialog(record, "Resume");
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }


        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });

        break;
      case 'in process':

        if (record.isSupervisor === '1' || record.isTechnician === "1") {
          this.reqitems[0].items?.push({
            'label': 'Hold',
            command: (event) => {
              this.openHoldDialog()
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Complete',
            command: (event) => {
              this.confirmDialog(record, "Complete");
            }
          });
        }

        if (record.isRequestor === '1' || record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Cancel',
            command: (event) => {
              this.updateRequest(record, "Cancel");
            }
          });

          this.reqitems[0].items?.push({
            'label': 'Edit',
            command: (event) => {
              this.onEditRequest(record);
            }
          });
        }

        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });

        break;
      case 'completed':
        if (record.isSupervisor === '1') {
          this.reqitems[0].items?.push({
            'label': 'Close',
            command: (event) => {
              this.confirmDialog(record, "Close");
            }
          });
        }

        this.reqitems[0].items?.push({
          'label': 'Comments',
          command: (event) => {
            this.onAddComments();
          }
        });
        break;
      case 'cancelled':

        break;
      case 'close':
        break;
      default:
        break;
    }

    this.reqitems[0].items?.push({
      'label': 'Details',
      command: (event) => {
        this.openDetails(record);
      }
    });
    menu.toggle(event);
  }

  openDetails(record: any) {
    if (record) {
      let status = record.status;
      this.authSrv.setPreviousUrl(this.router.url);
      this.router.navigate(['/work-request-details'], { queryParams: { requestId: record.wrId, index: 0, action: "details", status: status, viewDetails: true, } })
    }
  }

  onEditRequest(record: any) {
    if (record) {
      let status = record.status;
      let isRequestor = record.isRequestor;
      let isApprover = record.isApprover;
      let isSupervisor = record.isSupervisor;
      let isTechnician = record.technician;
      this.authSrv.setPreviousUrl(this.router.url);
      this.router.navigate(['/work-request-details'], {
        queryParams: {
          requestId: record.wrId, index: 0, action: "edit", status: status, viewDetails: true,
          isRequestor: isRequestor, isApprover: isApprover, isSupervisor: isSupervisor, isTechnician: isTechnician
        }
      })
    }

  }

  confirmDialog(data: any, action: any): void {
    this.confirmationService.confirm({
      message: "Are you sure that you want to " + action,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateRequest(data, action);
      },

    });
  }

  updateRequest(record: any, action: any) {
    this.selectedRequest = record;
    switch (action.toLowerCase()) {
      case 'approve':
        let enumStatusAprd = "Approved";
        record.status = enumStatusAprd;
        record.dateResponded = this.datePipe.transform(new Date(), "yyyy-MM-dd");
        record.timeResponded = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.saveWorkRequest(record);
        break;
      case 'reject':
        this.updateForm.reset();
        this.previousAction = "Reject";
        this.displayForm = true;
        break;
      case 'cancel':
        this.updateForm.reset();
        this.previousAction = "Cancel";
        this.displayForm = true;
        break;
      case 'on hold for access':
        this.updateForm.reset();
        this.selectedRequest.status = "On Hold For Access";
        this.selectedRequest.comments = this.holdDialog.controls.reason.value;
        this.saveWorkRequest(this.selectedRequest);
        break;
      case 'on hold for parts':
        this.updateForm.reset();
        this.selectedRequest.status = "On Hold For Parts";
        this.selectedRequest.comments = this.holdDialog.controls.reason.value;
        this.saveWorkRequest(this.selectedRequest);

        break;
      case 'on hold for labour':
        this.updateForm.reset();
        this.selectedRequest.status = "On Hold For Labour";
        this.selectedRequest.comments = this.holdDialog.controls.reason.value;
        this.saveWorkRequest(this.selectedRequest);
        break;
      case 'issue':
        let enumStatusInprs = "In Process";
        record.status = enumStatusInprs;
        this.saveWorkRequest(record);
        break;
      case 'complete':
        let enumStatusCmpld = "Completed";
        record.status = enumStatusCmpld;
        record.dateCompleted = this.datePipe.transform(new Date(), "yyyy-MM-dd");
        record.timeCompleted = this.datePipe.transform(new Date(), "HH:mm:ss");
        record.completeBy = this.authServ.getLoggedInUserEMId();
        record.loggedInTechnicianId = this.loggedInTechnicianId;
        this.saveWorkRequest(record);
        break;
      case 'resume':
        let enumStatusInprs1 = "In Process";
        record.status = enumStatusInprs1;
        this.saveWorkRequest(record);
        break;
      case 'close':
        let enumStatusClose = "Close";
        record.status = enumStatusClose;
        this.saveWorkRequest(record);
        break;

      default:
        break;
    }
  }

  saveWorkRequest(record: any) {
    this.wrServ.saveWorkRequest(record).subscribe((res: any) => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({ key: 'wrSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        //this.loadAllWorkRequest();
        this.loadAllStatusCountDataByFilter();
      }
    })
  }

  saveReason() {
    this.cancelledReason = this.updateForm.controls.cancelledReason.value;
    this.rejctReason = this.updateForm.controls.rejectReason.value;
    if (this.previousAction === "Cancel") {
      this.selectedRequest.status = "Cancelled";
      this.selectedRequest.comments = this.cancelledReason;
      this.saveWorkRequest(this.selectedRequest);
      this.displayForm = false;
    } else if (this.previousAction === "Reject") {
      this.selectedRequest.status = "Rejected";
      this.selectedRequest.dateResponded = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      this.selectedRequest.timeResponded = this.datePipe.transform(new Date(), "HH:mm:ss");
      this.selectedRequest.comments = this.rejctReason;
      this.saveWorkRequest(this.selectedRequest);
      this.displayForm = false;
    }
  }

  cancelCancellationReason() {
    this.displayForm = false;
  }

  onAddComments() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      wrId: this.selectedRequest.wrId
    }
    this.wrCommentsProvider.openDialog(dialogConfig);
    this.wrCommentsProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'wrSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
      }
    });
  }

  onSelectBlCode($event: any) {
    if ($event.blId != null && $event.blId != '') {
      this.selectedBl = $event;
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null,
          siteId: $event.siteId,
        });
        this.selectedFl = {};
      }, 0);
    } else {
      this.selectedBl = {};
      this.selectedFl = {};
    }
  }

  onSelectFlCode($event: any) {
    if ($event.flId != null && $event.flId != '') {
      this.selectedFl = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          rmId: null,
        });
        this.selectedRm = {};
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null,
          flId: null,
        });
      }, 0);
      this.selectedRm = {};
    }
   
  }

  onSelectRmCode($event: any) {
    if ($event.rmId != null && $event.rmId != '') {
      this.selectedRm = $event;
      const blData: any = {
        blId: $event.blId,
        blNameString: $event.blNameString,
        site: null
      }
      this.selectedBl = blData;
      this.updateBlList(blData);
      const flData: any = {
        flId: $event.flId,
        flNameString: $event.flNameString,
        blId: $event.blId,
        blNameString: $event.blNameString,
      }
      this.selectedFl = flData;;
      this.updateFlList(flData);
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          flId: $event.flId,
        });
      }, 0);
    } else {
     this.selectedRm = {}
    }
  }

  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.eqData = res;
        this.eqData.unshift(new Object({ eqCode: "Make a selection", description: '', eqId: null }))
      }
    });
  }

  loadRequests() {
    this.wrServ.getAllWr().subscribe((res: any) => {
      this.allRequests = res;
      this.allRequests.unshift(new Object({ wrId: "Make a selection" }));
    })
  }

  onSelectWrId(event: any) {
    if (event.wrId === 'Make a selection' || event.wrId === "") {
      setTimeout(() => {
        this.filterPanel.patchValue({
          wrId: null,
        });
      }, 0);
    }
  }

  onSearch() {
    // this.loadAllWorkRequest();
    this.loadAllStatusCountDataByFilter();
  }

  openHoldDialog() {
    this.holdDialog.reset();
    this.displayHoldScreen = true;
  }

  closeHoldDialog() {
    this.displayHoldScreen = false;
  }

  confirmHoldType() {
    this.displayHoldScreen = false;
    let record = this.selectedRequest;
    let action = this.holdDialog.controls.hold.value;
    this.updateRequest(record, action);
  }

  chanageReason(event: any) {
    this.isUpdateFormValid = false;
    if (event.target.value && event.target.value.length > 0) {
      this.isUpdateFormValid = true;
    } else {
      this.isUpdateFormValid = false;
    }
  }

  logRequest() {
    this.authSrv.setPreviousUrl(this.router.url);
    this.router.navigate(['/add-work-request'], {
      queryParams: {
        requestId: 0,

      }
    })
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  scrollToEndBl() {
    this.offsetBl = this.limitBl;
    this.limitBl += this.scrollLimit;
    this.filterCriteria.limit = this.limitBl;
    this.filterCriteria.offset = this.offsetBl;
    this.blService.getALLBuildingByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumBL = res;
      this.updateBlList(this.selectedBl);
    })
  }

  scrollToEndFl() {
    this.offsetFl = this.limitFl;
    this.limitFl += this.scrollLimit;
    this.filterCriteria.limit = this.limitFl;
    this.filterCriteria.offset = this.offsetFl;
    this.blService.getALLFloorByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumFL = res;
      this.updateFlList(this.selectedFl);
    })
  }

  scrollToEndRm() {
    this.offsetRm = this.limitRm;
    this.limitRm += this.scrollLimit;
    this.filterCriteria.limit = this.limitRm;
    this.filterCriteria.offset = this.offsetRm;
    this.blService.getALLRoomByScroll(this.filterCriteria).subscribe((res: any) => {
      this.enumRM = res;
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
    if(rmData.rmId) {
      this.enumRM = this.enumRM.filter(t => t.rmId !== rmData.rmId);
      this.enumRM = this.enumRM.filter(t => t.rmId !== null);
      this.enumRM.unshift(rmData)  
    }
    this.enumRM.unshift(new RoomFilterInputDTO(null, 'Make a selection', null, null));
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


  onClear() {
    this.filterPanel.reset();
    this.filterCriteria = {
      fieldName: null, value: null, matchMode: "contains", limit: 0, offset: 0
    };
    this.setShowType();
    this.selectedBl = {};
    this.selectedFl = {};
    this.selectedRm = {};

  }

}
