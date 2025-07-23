import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UtilConstant } from 'src/common/UtilConstant';
import { ProblemDescriptionDialogueProvider } from '../providers/help-desk-pd-provider';
import { ProblemDescriptionService } from '../services/problem-description.services';
import { PaginationObj } from 'src/app/model/pagination-model';

@Component({
  selector: 'app-help-desk-problem-description',
  templateUrl: './help-desk-problem-description.component.html',
  styleUrls: ['./help-desk-problem-description.component.scss'],
  providers: [MessageService]
})
export class HelpDeskProblemDescriptionComponent implements OnInit {
  PdData:any[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  totalElements:number = 0;
  paginationObj:PaginationObj = {
    pageNo:0,
    pageSize:this.rowCount,
    sortBy:["pdId"],
    sortOrder:"ASC"
  }
  filterCriteria:any = {};
  isFiltered:boolean = false;
  filterCriteriaList :any[]=[];
  constructor(
    private pdProvider: ProblemDescriptionDialogueProvider,
    private confirmationService: ConfirmationService,
    private pdService: ProblemDescriptionService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadAllRecords();
  }

  loadAllRecords(){
    let data={paginationDTO:this.paginationObj,filterCriteria:this.filterCriteriaList};
    this.pdService.getALLPdsPaginated(data).subscribe((res:any)=>{
      if(res){
        this.isFiltered= false;
        this.PdData = res.content ? res.content : [];
        this.totalElements = res.totalElements ? res.totalElements : 0;
      }else{
        this.PdData = [];
      }
    })
  }

  editPdItem(pdId:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      pdId: pdId,
      isEdit: true,
      newRecord: false
    };
    this.pdProvider.openDialog(dialogConfig);
    this.pdProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result.code === 200){
        this.messageService.clear();
        this.messageService.add({ key: 'pdMessage', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadAllRecords();
      }
    })
  }

  addPdItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      pdId: null,
      isEdit: true,
      newRecord: true
  };
    this.pdProvider.openDialog(dialogConfig);
    this.pdProvider.onDialogueClosed.subscribe((result:any)=>{
      if(result.code === 200){
        this.messageService.clear();
        this.messageService.add({ key: 'pdMessage', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
        this.loadAllRecords();
      }
  })
}

onDelete(id: any) {
  this.confirmationService.confirm({
    message: 'Are you sure that you want to delete ' + '?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.deletePd(id);
    },
    key: "pdGrid"
  });
}

deletePd(id: any) {
  this.pdService.deleteById(id).subscribe((res: any) => {
    if (res != null && res.code == 200) {
      this.messageService.add({ key: 'pdMessage', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
     this.loadAllRecords();
    }else{
      this.messageService.add({ key: 'pdMessage', severity: 'error', summary: 'error', detail: res.text });
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
  this.loadAllRecords();
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
    this.loadAllRecords();
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
