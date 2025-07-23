import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumList } from 'src/app/model/enum-list.model';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { AddWorkRequestService } from 'src/app/ui/Helpdesk/work-request/service/add-work-request.services';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-request-log',
  templateUrl: './request-log.component.html',
  styleUrls: ['./request-log.component.scss'],
  providers: [MessageService]
})
export class RequestLogComponent implements OnInit {
  requestLogData:any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumWrStatus: EnumList[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  constructor(
    private enumsrv: EnumService,
    private wrSrv: AddWorkRequestService,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.loadEnums();
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumWrStatus = this.enumWr.filter(t => t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        },
     error => {
     }
    );
  }

  loadRequestLogData(requestId:any) {
    this.wrSrv.getRequestLogByRequestId(requestId).subscribe((res:any) => {
      this.requestLogData = res;
      this.requestLogData = this.requestLogData.sort((a, b) => a.requestLogId - b.requestLogId);
      this.requestLogData = this.requestLogData.map((each: any) =>{
          if(each.changedBy === null){
            return{
              ...each,
              userUserName : 'System',
              formatedDateChanged : this.datePipe.transform(each.dateChanged, 'dd MMMM yyyy')
            }
          }else{
            return {
              ...each,
              formatedDateChanged : this.datePipe.transform(each.dateChanged, 'dd MMMM yyyy')
            };
          }
      } )
    })
  }
 
  getEnumById(enumKey: any) {
    return this.enumWrStatus.find((t: any) => t.enumKey === enumKey)?.enumValue
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }


}
