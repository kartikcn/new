import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeModalDialogueProvider } from 'src/app/ui/employee/provider/employee.provider';
import { UtilConstant } from 'src/common/UtilConstant';
import * as FileSaver from 'file-saver';
import { MatDialogConfig } from '@angular/material/dialog';
import { EnumList } from 'src/app/model/enum-list.model';

@Component({
  selector: 'app-add-emp-report-table',
  templateUrl: './add-emp-report-table.component.html',
  styleUrls: ['./add-emp-report-table.component.scss']
})
export class AddEmpReportTableComponent {
  @Input() data:any;
  em_data:any=[];
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumEmStatus: EnumList[] = [];
  rowCount: number = UtilConstant.ROW_COUNT;
  em_array : any[]=[];
  showTable : boolean = false;
  constructor(
    private empProvider: EmployeeModalDialogueProvider,
    private enumsrv: EnumService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadEnums();
    this.em_data = this.data;
    this.cdr.detectChanges();
  }

  getNameById(id: any) {
    return id ? this.enumEmStatus.find(t => t.enumKey === id) != null ? this.enumEmStatus.find(t => t.enumKey === id)?.enumValue : '' : '';
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumClonedList = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'em'.toLocaleUpperCase());
        this.enumEmStatus = this.enumClonedList.filter(t =>t.tableName.toLocaleUpperCase() === 'em'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'em_status'.toLocaleUpperCase());
        this.showTable = true;
      },
     
    );
  }

  viewItem(em_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      em_id: em_id,
      isEdit: false,
      newRecord: false
    };
    this.empProvider.openDialog(dialogConfig);
    this.empProvider.onDialogueClosed.subscribe((result: any) => {
    })
  }

  exportExcel(){
  this.getDestructuredData(this.em_data);
  var excelHeaders: string[]=[];
  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(this.em_array);
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 }
      ];
      excelHeaders =  [ "Employee Code","First Name","Last Name","Email", "Employee Standard", "Status"]   
    const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
    headers.forEach(header => {
      worksheet[header.position] = { v: header.v };
    });
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "employee");
  });
  }

  getDestructuredData(data: any) {
    this.em_array = data.map((item: any) => {
      console.log(item);
      return {
        "Employee Code": item['emCode'],
        "First Name": item['firstName'],
        "Last Name":item['lastName'],
        "Email":item['email'],
        "Employee Standard" : item['emStdEmStd'],
        "Status" : this.getNameById(item['emStatus'])
      }
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  
}
