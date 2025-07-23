import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ToolTypeDialogueProvider } from '../providers/tool-type.oroviders';
import { ToolTypeService } from '../services/tool-type.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-tool-type',
  templateUrl: './tool-type.component.html',
  styleUrls: ['./tool-type.component.scss'],
  providers: [MessageService]
})
export class ToolTypeComponent implements OnInit {
  toolTypeData: any[] = [];
  value: any;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["toolTypeId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toolTypeProvider: ToolTypeDialogueProvider,
    private service: ToolTypeService,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    this.isFiltered = false;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.service.getAllToolTypesPaginated(data).subscribe((res: any) => {
      if (res) {
        this.isFiltered= false;
        this.toolTypeData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.toolTypeData = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  onEdit(id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      toolTypeId: id,
      isEdit: true,
      newRecord: false
    };
    this.toolTypeProvider.openDialog(dialogConfig);
    this.toolTypeProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'message', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      toolTypeId: null,
      isEdit: true,
      newRecord: true
    };
    this.toolTypeProvider.openDialog(dialogConfig);
    this.toolTypeProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'message', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    });
  }

  onDelete(toolType: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete '+toolType.toolType+'?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteToolType(toolType.toolTypeId);
      },
      key: "toolTypeGrid"
    });
  }

  deleteToolType(id: any) {
    this.service.deleteById(id).subscribe((res: any) => {
      this.messageService.clear();
      if (res != null && res.code == 200) {
        this.messageService.add({ key: 'message', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords();
      } else {
        this.messageService.add({ key: 'message', severity: 'error', summary: 'error', detail: res.text });
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
