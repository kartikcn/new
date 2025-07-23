import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumList } from 'src/app/model/enum-list.model';
import { EnumService } from 'src/app/services/enum.service';
import { PpmPlanService } from 'src/app/ui/ppm-plan/services/ppm-plan-services';
import { UtilConstant } from 'src/common/UtilConstant';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-ppm-plans-list',
  templateUrl: './ppm-plans-list.component.html',
  styleUrls: ['./ppm-plans-list.component.scss'],
  providers: [MessageService]
})
export class PpmPlansListComponent {
  enumList: EnumList[] = [];
  enumPlanData: EnumList[] = [];
  planData: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  locTypeId:any = 0;
  @Output() parentFun = new EventEmitter();
  useTabletProtrait = false;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["planId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  @Input() planTypeData:string='';
  constructor(
    private enumsrv: EnumService,
    private ppmPlanService: PpmPlanService,
    private bps : BreakpointService
  ) {
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadEnums();
   // this.loadRecords();
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    if(this.useTabletProtrait){
      this.rowCount = UtilConstant.ROW_COUNT_FIVE_LIMIT
    }else{
      this.rowCount = UtilConstant.ROW_COUNT;
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase() 
        && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
        this.enumPlanData.forEach(t => t.enumValue.toLocaleLowerCase() === "Location".toLocaleLowerCase() ? this.locTypeId = t.enumKey : '')
      },
      error => {
      }
    );
  }

  getEnumByById(enumKey: any) {
    return enumKey ? this.enumPlanData.find(t => t.enumKey == enumKey) != null ? this.enumPlanData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  loadRecords(planType:any) {
    this.loading = true;
    this.planTypeData = planType;
    //this.planData = [];
    let filterCriteria = { fieldName: "planType", value: planType, matchMode: "equals" };
          this.updateFilterCriteriaList(filterCriteria);
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.ppmPlanService.getAllPlansPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.planData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
        // if(planType == "Location"){
        //   this.planData = content.filter((t:any) => t.planType === this.locTypeId)
        // } else {
        //   this.planData = content.filter((t:any) => t.planType !== this.locTypeId);
        // }
       
      }
      else {
        this.planData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  setPlanData(planData:any) {
    this.planData = planData;
  }
   
  onRowSelect(event:any) {
    this.parentFun.emit(event.data);
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords(this.planTypeData);
  }

  onInnerFilter(event: any) {
    if (this.isFiltered) {
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if(filterValue !== undefined){
          let filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          this.updateFilterCriteriaList(filterCriteria);
        }
      });
      this.paginationObj.pageNo = 0;
      this.loadRecords(this.planTypeData);
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
