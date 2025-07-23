import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { AppParams } from './model/app-params.model';
import { AppParamsService } from './services/app-params.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { AppParamsDialogueProvider } from './provider/app-params.provider';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-app-params',
  templateUrl: './app-params.component.html',
  styleUrls: ['./app-params.component.scss'],
  providers:[MessageService]
})
export class AppParamsComponent implements OnInit {

  appParamsRecords : AppParams[] = [];
  loadingRec: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["paramId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private apSrv: AppParamsService,
    private apModalDialogue: AppParamsDialogueProvider,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loadingRec = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.apSrv.getAllAppParamsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.loadingRec = false;
        this.isFiltered= false;
        this.appParamsRecords = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.loadingRec = true;
        this.appParamsRecords = [];
      }
    },
      error => {
        this.loadingRec = false;
      }
    );
  }

  addRecord() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      appParamsId:0,
      paramId: "",
      isEdit: true,
      newRecord: true,
      title: "Add"
    };
    this.apModalDialogue.openDialog(dialogConfig);
    this.apModalDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();

      }
    });
  }
  openEditItem(appParam: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      appParamsId:appParam.appParamsId,
      paramId: appParam.paramId,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.apModalDialogue.openDialog(dialogConfig);
    this.apModalDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
      }
    });
  }
  deleteRecord(appParam: any ) {
    this.userDeleteConfirm(appParam);
  }
  userDeleteConfirm(appParam: any): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete [ ' + appParam.paramId + ' ] ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAppParam(appParam.appParamsId);
      },
    });
  }
  deleteAppParam(paramId: number) {
    this.apSrv.deleteAppParamById(paramId).subscribe((res: any) => {
      if (res.code == 200) {
        this.messageService.add({ severity: 'success', summary: 'Record deleted', detail: 'Record deleted' });
        setTimeout(() => {
          this.loadRecords();
        }, 3);
      }else{
        this.messageService.add({  severity: 'error', summary: 'error', detail: res.text });
      }
    })
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
