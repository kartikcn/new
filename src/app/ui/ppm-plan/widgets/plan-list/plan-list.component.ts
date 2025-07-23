import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { PpmPlanService } from '../../services/ppm-plan-services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { EnumList } from 'src/app/model/enum-list.model';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss'],
  providers: [MessageService]
})
export class PlanListComponent implements OnInit {
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumPlanData: EnumList[] = [];
  planData: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
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
  @Output() parentFun = new EventEmitter();
  constructor(
    private enumsrv: EnumService,
    private ppmPlanService: PpmPlanService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadEnums();
    this.loadRecords();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumPlanData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plans'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'plan_type'.toLowerCase());
        this.enumPlanData.unshift(new EnumList(null, "", "", 'Make a selection',""));
      },
      error => {
      }
    );
  }

  getEnumByById(enumKey: any) {
    return enumKey ? this.enumPlanData.find(t => t.enumKey == enumKey) != null ? this.enumPlanData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  loadRecords() {
    this.loading = true;
    //this.planData = [];
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.ppmPlanService.getAllPlansPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.planData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
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

  openEditItem(planId: any) {
    this.router.navigate(['/plan-details'], {
      queryParams: {
        planId: planId,
      },skipLocationChange: true
    })
  }

  onAdd() {
    this.router.navigate(['/plan-details'], {
      queryParams: {
        planId: null,
      },skipLocationChange: true
    })
  }

  onRowSelect(event: any) {
    this.parentFun.emit(event.data);
  }

  onClearState() {
    this.parentFun.emit(true);
  }

  onDelete(plan: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+plan.planName+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePlan(plan.planId);
      },
      key: "planListGrid"
    });
  }

  deletePlan(id: any) {
    this.ppmPlanService.deletePlan(id).subscribe((res: any) => {
      if (res.code == 200) {
        this.messageService.add({ key: 'planSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'planDelete', severity: 'error', detail: res.text });
      }
    });
  }

  onPageChange(event:any){
    const pageNo = event.first ? event.first / event.rows : 0;
    const pageSize = event.rows;
    this.paginationObj.pageNo = pageNo;
    this.paginationObj.pageSize = pageSize;
    this.loadRecords();
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
      this.loadRecords();
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
