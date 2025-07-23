import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { UtilConstant } from 'src/common/UtilConstant';
import { ArrangementDialogueProvider } from '../provider/arrangement.provider';
import { ArrangementService } from '../services/arrangement.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-arrangement',
  templateUrl: './arrangement.component.html',
  styleUrls: ['./arrangement.component.scss']
})
export class ArrangementComponent implements OnInit {

  arrangementRecords: [] = [];
  loadingRec: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["arrangementId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private arrangeSrv: ArrangementService,
    private arrangementProvider: ArrangementDialogueProvider,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.loadingRec = true;
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.arrangeSrv.getAllArrangementsPaginated(data).subscribe((res: any) => {
      if (res) {
        this.loadingRec = false;
        this.isFiltered= false;
        this.arrangementRecords = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
      else {
        this.loadingRec = true;
        this.arrangementRecords = [];
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
      arrangementId:0,
      arrangementType: "",
      description: "",
      isEdit: true,
      newRecord: true,
      title: "Add"
    };
    this.arrangementProvider.openDialog(dialogConfig);
    this.arrangementProvider.onDialogueClosed.subscribe((result: any) => {
      if (result == true) {
        this.loadRecords();
      }
    });
  }

  openEditItem(arrange: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      arrangementId:arrange.arrangementId,
      arrangementType: arrange.arrangementType,
      description: arrange.description,
      isEdit: true,
      newRecord: false,
      title: "Edit"
    };
    this.arrangementProvider.openDialog(dialogConfig);
    this.arrangementProvider.onDialogueClosed.subscribe((result: any) => {
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
