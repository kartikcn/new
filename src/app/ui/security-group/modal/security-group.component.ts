import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { SgDialogueProvider } from '../providers/securityGroup-provider';
import { SgServices } from '../services/securityGroup.service';
import { PaginationObj } from 'src/app/model/pagination-model';

declare var $: any;
@Component({
  selector: 'app-security-group',
  templateUrl: './security-group.component.html',
  styleUrls: ['./security-group.component.scss'],
  providers: [MessageService]
})
export class SecurityGroupComponent implements OnInit {
  rowCount: number = UtilConstant.ROW_COUNT;
  Sg_data: any[] = [];
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["securityGroupId"],
    sortOrder:"ASC"
  }
  filterCriteriaList :any[]=[];
  isFiltered:boolean = false;
  constructor(
    private sgService: SgServices,
    private messageService: MessageService,
    private sgDialogueProvider: SgDialogueProvider,
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.isFiltered= false;
    this.sgService.getScurityGroupPaginated(data).subscribe((res: any) => {
      if(res){
        this.isFiltered= false;
        this.Sg_data = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }
    })
  }

  editSgItem(securityGroupId: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      securityGroupId: securityGroupId,
      isEdit: true,
      newRecord: false
    };
    this.sgDialogueProvider.openDialog(dialogConfig);
    this.sgDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'sgGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadRecords();
      }
    })
  }

  addSgItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      securityGroupId: 0,
      isEdit: true,
      newRecord: true
    };
    this.sgDialogueProvider.openDialog(dialogConfig);
    this.sgDialogueProvider.onDialogueClosed.subscribe((result: any) => {
      this.messageService.clear();
      if (result) {
        this.messageService.add({ key: 'sgGrid', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
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
      Object.keys(event.filters).forEach((field) => {
        const filterValue = event.filters[field][0].value;
        const matchMode = event.filters[field][0].matchMode;
        if (filterValue !== undefined ) {
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
