import { Component, EventEmitter, Output } from '@angular/core';
import { UtilConstant } from 'src/common/UtilConstant';
import { LinkPlanToLocationOrAssetService } from '../../../services/link-plan-to-location.services';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocationPlanDialogueProvider } from '../providers/location-plan-providers';
import { LinkMultipleLocationDialogueProvider } from '../providers/link-multiple-location-providers';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-location-plan-list',
  templateUrl: './location-plan-list.component.html',
  styleUrls: ['./location-plan-list.component.scss'],
  providers: [MessageService]
})
export class LocationPlanListComponent {
  rowCount: number = UtilConstant.ROW_COUNT;
  planLocData: any[] = [];
  planId: any = 0;
  header: string = "";
  @Output() parentFun = new EventEmitter();
  useTabletProtrait = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["planLocEqId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  constructor(
    private linkPlanToLocationOrAssetSrv: LinkPlanToLocationOrAssetService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private locationPlanDialogueProvider: LocationPlanDialogueProvider,
    private linkMultipleLocationDialogueProvider :LinkMultipleLocationDialogueProvider,
    private bps : BreakpointService
  ) {
  }

  ngOnInit(): void {
    this.bps.register(this);
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if(this.useTabletProtrait){
      this.rowCount = UtilConstant.ROW_COUNT_FIVE_LIMIT
    }else{
      this.rowCount = UtilConstant.ROW_COUNT;
    }
  }

  loadLocationPlans(planId: any) {
    this.planId = planId;
    this.planLocData =[];
    let data={planId:planId,filterDto:{paginationDTO:this.paginationObj,filterCriteria:this.filterCriteria}};
    this.linkPlanToLocationOrAssetSrv.getLocPlansByPlanIdPaginated(data).subscribe((res: any) => {
      if(res){
        this.isFiltered= false;
        this.planLocData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    })
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '1000px';
    dialogConfig.data = {
      planId: this.planId,
      isEdit: false,
      newRecord: true,
      planLocEqData: null
    };
    this.linkMultipleLocationDialogueProvider.openDialog(dialogConfig);
    this.linkMultipleLocationDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Locations linked successfully.', detail: 'Locations linked successfully.' });
        this.loadLocationPlans(this.planId);
      }
    });
  }

  openEditItem(planLocEqData: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '350px';
    dialogConfig.data = {
      planLocEqId: planLocEqData.planLocEqId,
      planId: this.planId,
      isEdit: true,
      newRecord: false,
      planLocEqData: planLocEqData
    };
    this.locationPlanDialogueProvider.openDialog(dialogConfig);
    this.locationPlanDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Location linked successfully', detail: 'Record linked successfully' });
        this.loadLocationPlans(this.planId);
      }
    });
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete(id);
      },
      key: "planListGrid"
    });
  }

  delete(id: any) {
    this.linkPlanToLocationOrAssetSrv.deleteById(id).subscribe((res: any) => {
      this.messageService.clear();
      if (res.code == 200) {
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadLocationPlans(this.planId);
      } else {
        this.messageService.add({ key: 'planDelete', severity: 'warn', summary: 'Warning',detail: 'The Plan-Location  is associated with Plan Schedules.',sticky: true });
      }
    })
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadLocationPlans(this.planId);
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          this.filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
        }
      });
      this.loadLocationPlans(this.planId);
    }
    this.isFiltered = true;
  }


}
