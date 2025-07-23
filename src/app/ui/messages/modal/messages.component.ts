import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { MessagesDialogueProvider } from '../provider/messages.provider';
import { MessagesService } from '../services/messages.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [MessageService]
})
export class MessagesComponent implements OnInit {
  messagesRecords: [] = [];
  loadingRec: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["msgId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private msgSrv: MessagesService,
    private msgDialogue: MessagesDialogueProvider,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loadingRec = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.msgSrv.getAllMessagesPaginated(data).subscribe((res: any) => {
      if (res) {
        this.loadingRec = false;
        this.isFiltered= false;
        this.messagesRecords = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.loadingRec = true;
        this.messagesRecords = [];
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
      msgId: 0,
      processId: null,
      msgCode:"",
      msgText: "",
      isEdit: true,
      newRecord: true,
      title: "Add"
    };
    this.msgDialogue.openDialog(dialogConfig);
    this.msgDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
      }
    });
  }

  openEditItem(msg: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      msgId: msg.msgId,
      processId: msg.processId,
      msgText: msg.msgText,
      msgCode:msg.msgCode,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.msgDialogue.openDialog(dialogConfig);
    this.msgDialogue.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
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
    if(this.isFiltered){
      this.filterCriteria = {};
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
          let filterCriteria = {};
          if(field=="fmprocessesProcessCode"){
            filterCriteria = { fieldName: "fmprocesses.processCode", value: filterValue, matchMode: matchMode };
          }else{
            filterCriteria = { fieldName: field, value: filterValue, matchMode: matchMode };
          }
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
