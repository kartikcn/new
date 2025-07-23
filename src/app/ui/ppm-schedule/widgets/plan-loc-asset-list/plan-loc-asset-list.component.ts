import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';
import { AuthService } from 'src/app/services/auth.service';
import { EnumService } from 'src/app/services/enum.service';
import { LinkPlanToLocationOrAssetService } from 'src/app/ui/link-plan-to-location/services/link-plan-to-location.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-plan-loc-asset-list',
  templateUrl: './plan-loc-asset-list.component.html',
  styleUrls: ['./plan-loc-asset-list.component.scss'],
  providers: [MessageService]
})
export class PlanLocAssetListComponent {
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPlanData: EnumList[] = [];
  planData: any[] = [];
  selectedScreens: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  selectedRoom: String = '';
  compId: number = 0;
  selectedEvent: any;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["planLocEqId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  @Output() parentFun = new EventEmitter();
  constructor(
    private enumsrv: EnumService,
    private linkPlanToLocationOrAssetService: LinkPlanToLocationOrAssetService,
    private authSrv: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadEnums();
    this.compId = this.authSrv.getLoggedInUserCompId();
   // this.loadData();
  }

  loadData() {
   // this.planData=[];
    let data = {paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.linkPlanToLocationOrAssetService.getAllPaginated(data).subscribe((res: any) => {
      if(res){
      this.isFiltered= false;
      this.planData = res.content ? res.content : [];
      this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    })
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
      },
      error => {
      }
    );
  }

  getEnumById(enumKey: any) {
    return enumKey ? this.enumPlanData.find(t => t.enumKey == enumKey) != null ? this.enumPlanData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event);
  }

  getPlanLocAssetByPlanId(planId:any) {
    
    this.linkPlanToLocationOrAssetService.getLocPlansByPlanId(planId).subscribe((res: any) => {
      this.planData = res;
    })
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadData();
  }

  onInnerFilter(event: any) {
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria = {};
          if(field=="planName"){
            filterCriteria = { fieldName: "plan.planName", value: filterValue, matchMode: matchMode };
          }else if(field=="planType"){
            filterCriteria = { fieldName: "plan.planType", value: filterValue, matchMode: matchMode };
          }else if(field=="planDescription"){
            filterCriteria = { fieldName: "plan.description", value: filterValue, matchMode: matchMode };
          }else if(field=="blName"){
            filterCriteria = { fieldName: "bl.blCode", value: filterValue, matchMode: matchMode };
          }else if(field=="flName"){
            filterCriteria = { fieldName: "fl.flCode", value: filterValue, matchMode: matchMode };
          }else if(field=="rmName"){
            filterCriteria = { fieldName: "rm.rmCode", value: filterValue, matchMode: matchMode };
          }else if(field=="eqCode"){
            filterCriteria = { fieldName: "eq.eqCode", value: filterValue, matchMode: matchMode };
          }else{
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadData();
    }
    this.isFiltered = true;
  }

  updateFilterCriteriaList(filterCriteria:any){
    let index = this.filterCriteriaList.findIndex(item => item.fieldName === filterCriteria['fieldName']);
    if(filterCriteria['value']==null){
      if(index !==-1){
        this.filterCriteriaList.splice(index, 1);
      }
    }else {
      if (index !== -1) {
        this.filterCriteriaList[index] = filterCriteria;
      } else {
        this.filterCriteriaList.push(filterCriteria);
      }
    }
  }

}
