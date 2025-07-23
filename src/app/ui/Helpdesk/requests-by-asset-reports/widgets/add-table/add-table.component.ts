import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { EnumList } from 'src/app/model/enum-list.model';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.scss']
})
export class AddTableComponent implements OnInit {
  [x: string]: any;
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumStatusData: EnumList[] = [];
  requestsData: any[] = [];
  enumStauts: any[] = [];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  allEmployees: any[] = []
  enumEm: any[] = [];
  enumStatusFilter: EnumList[] = [];
  req_array: any[] = [];
  fullName: any;
  @Input() data:any;
  @Input() isEscalatedData:boolean = false;
  constructor(
    private enumsrv: EnumService,
    private employeeService : EmployeeService,
    private router: Router,
    private datePripe : DatePipe
  ) { }

  ngOnInit(): void {
    this.requestsData = this.data;
    this.loadAllEnums();
    this.loadAllEmployee();
  }

getRequestData(data:any)
{
this.requestsData=data;
}
 
loadAllEnums() {
  this.enumsrv.getEnums().subscribe(
    (res: EnumList[]) => {
      if (res) {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumStauts = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.enumStatusFilter = [...this.enumStatusData];
        this.enumStatusFilter.unshift(new EnumList(null, "", "", 'Make a selection',null));
      }
    })
}

loadAllEmployee() {
  this.employeeService.getAllEmployeeList().subscribe((res: any) => {
    if (res) {
      this.allEmployees = res;
    }
    else {
      this.allEmployees = [];
    }
  })
}

getEnumByEnumId(enumKey: any) {
  return this.enumStatusData.find((t: any) => t.enumKey === enumKey)?.enumValue
}

getEmployeeFullName(id: any) {
  if (this.allEmployees) {
    this.enumEm = this.allEmployees.filter(em => em.emId === id);
    this.fullName = this.enumEm.map(em => {
      if (em.firstName.length > 0 && em.lastName.length > 0) {
        return em.firstName + " " + em.lastName + ' - ' + em.emCode;
      } else {
        return em.firstName + ' - ' + em.emCode;
      }
    })
  }
  return this.fullName[0];
}

getDestructuredData(req_data: any) {
  if(this.isEscalatedData){
    this.req_array = req_data.map((item: any) => {
      console.log(item);
      return {
        "Request Id": item['wrId'],
        "Requested Date": this.datePripe.transform(item['dateRequested'],'dd MMM yyyy'),
        "Problem Type":(item['problemTypeString']),
        "Status":this.getEnumByEnumId(item['status']),
        "Date To Respond" : item['escDateResponded'] ? this.datePripe.transform(item['escDateResponded'],'dd MMM yyyy') + ' ' + this.convertToDisplayTime(item['escTimeResponded']) : '' ,
        "Date Responded" : item['dateResponded'] ?  this.datePripe.transform(item['dateResponded'],'dd MMM yyyy') + ' ' + this.convertToDisplayTime(item['timeResponded']) : '',
        "Date To Complete" : item['escDateCompleted'] ?  this.datePripe.transform(item['escDateCompleted'],'dd MMM yyyy') + ' ' + this.convertToDisplayTime(item['escTimeCompleted']) : '',
        "Date Completed" : item['dateCompleted'] ?  this.datePripe.transform(item['dateCompleted'],'dd MMM yyyy') + ' ' + this.convertToDisplayTime(item['timeCompleted']) : '',
      }
    });
  }else{
    this.req_array = req_data.map((item: any) => {
      return {
        "Request Id": item['wrId'],
        "Requested Date": this.datePripe.transform(item['dateRequested'],'dd MMM yyyy'),
        "Requested For" : this.getEmployeeFullName(item['requestedFor']),
        "Problem Type":(item['problemTypeString']),
        "Status":this.getEnumByEnumId(item['status']),
      }
    });
  }
}
saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
    type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}

onClickView(data : any){
  const wrId = data.wrId;
  const status = data.status;

  const url = this.router.serializeUrl(
    this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details", status: status, viewDetails:true, isNavigationFromReport : true} })
    );
    
  window.open(url, '_blank');
}


exportExcel() {
  this.getDestructuredData(this.requestsData);
  var excelHeaders: string[]=[];

  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(this.req_array);
    if(this.isEscalatedData){
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];
      excelHeaders =  [ "Request Id","Requested Date","Problem Type","Status", "Date To Respond", "Date Responded", "Date To Complete", "Date Completed"]
    }else{
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];
      excelHeaders =  [ "Request Id","Requested Date","Requested For","Problem Type","Status"];
    }    

    // Insert the headers in the worksheet

    const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
    headers.forEach(header => {
      worksheet[header.position] = { v: header.v };
    });

    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "requests");
  });
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
