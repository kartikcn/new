import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { CostTypeDialogueProvider } from '../provider/costtype.provider';
import { CostTypeService } from '../services/costtype.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-costtype',
  templateUrl: './costtype.component.html',
  styleUrls: ['./costtype.component.scss'],
  providers: [MessageService]
})
export class CosttypeComponent implements OnInit {

  costTypeData: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["costTypeId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private costTypeProvider: CostTypeDialogueProvider,
    private costTypeService: CostTypeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();

  }

  loadRecords() {
    this.loading = true;
    let data = {paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.costTypeService.getAllCostTypesPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.costTypeData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.costTypeData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      isEdit: false,
      costTypeId: null,
      newRecord: true
    };
    this.costTypeProvider.openDialog(dialogConfig);
    this.costTypeProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'costTypeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onEdit(costTypeId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      costTypeId: costTypeId,
      isEdit: true,
      newRecord: false
    };
    this.costTypeProvider.openDialog(dialogConfig);
    this.costTypeProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result === true) {
        this.messageService.add({ key: 'costTypeSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onDelete(costType: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+costType.costType+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCostType(costType.costTypeId);
      },
      key: "costTypegrid"
    });
  }

  deleteCostType(costTypeId: any) {
    this.costTypeService.deleteByCostType(costTypeId).subscribe((res: any) => {
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'costTypeSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'costTypeSave', severity: 'error', summary: 'error', detail: res.text });
      }
    },
      error => {
      }
    );
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
