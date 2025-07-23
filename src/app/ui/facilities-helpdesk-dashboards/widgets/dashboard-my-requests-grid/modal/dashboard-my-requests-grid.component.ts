import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { FilterMetadata } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { UtilConstant } from 'src/common/UtilConstant';
import { EnumList } from 'src/app/model/enum-list.model';
@Component({
  selector: 'app-dashboard-my-requests-grid',
  templateUrl: './dashboard-my-requests-grid.component.html',
  styleUrls: ['./dashboard-my-requests-grid.component.scss']
})
export class DashboardMyRequestsGridComponent implements OnInit {
  rowCount : number = UtilConstant.ROW_COUNT;
  requestsData: any[] = [];
  enumStatusData: EnumList[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumStatus: EnumList[] = [];
  filteredData: any[] = [];
  @Input() myRequestsData!: any;
  constructor(
    private enumsrv : EnumService,
    private router : Router,
    private datePipe: DatePipe,

  ) { }

  ngOnInit(): void {
    this.loadEnumsData();
  }

  loadEnumsData() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
      })
    }

    getValueById(enumKey: any) {
      return this.enumStatus.find((t: any) => t.enumKey === enumKey)?.enumValue;
    };

    onClickView(data : any){
      const wrId = data.wrId;
      const status = data.status;
    
      const url = this.router.serializeUrl(
        this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details", status: status, viewDetails:true, isNavigationFromReport : true} })
        );
        
      window.open(url, '_blank');
    }
}
