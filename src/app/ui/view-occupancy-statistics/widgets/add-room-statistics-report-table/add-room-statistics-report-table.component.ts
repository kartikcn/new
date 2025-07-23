import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { RMModalDialogueProvider } from 'src/app/ui/background-loc/provider/rm.provider';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-add-room-statistics-report-table',
  templateUrl: './add-room-statistics-report-table.component.html',
  styleUrls: ['./add-room-statistics-report-table.component.scss']
})
export class AddRoomStatisticsReportTableComponent {
  @Input() data:any;
  rm_data:any=[];
  rm_array : any[]=[];
  rowCount: number = UtilConstant.ROW_COUNT;
  constructor(
    private rmProvider: RMModalDialogueProvider,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.rm_data = this.data;
    this.cdr.detectChanges();
  }

  viewItem(rm: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '750px';
    dialogConfig.data = {
      isView: true,
      bl_id: rm.blId,
      fl_id: rm.flId,
      rm_id: rm.rmId,
      isEdit: true,
      newRecord: false
    };
    this.rmProvider.openDialog(dialogConfig);
    this.rmProvider.onDialogueClosed.subscribe((result: any) => {
    })
  }

  exportExcel(){
    this.getDestructuredData(this.rm_data);
    var excelHeaders: string[]=[];
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.rm_array);
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
        excelHeaders =  [ "Building Code","Floor Code","Room Code","Division","Department","Total Space","Occupied Space","Available Space","Occupancy (%)"]   
      const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
      headers.forEach(header => {
        worksheet[header.position] = { v: header.v };
      });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "room");
    });
    }
  
    getDestructuredData(data: any) {
      this.rm_array = data.map((item: any) => {
        return {
          "Building Code": item['blId'],
          "Floor Code": item['flId'],
          "Room Code":item['rmId'],
          "Division":item['divId'],
          "Department":item['depId'],
          "Total Space":item['totalSpace'],
          "Occupied Space":item['occupiedSpace'],
          "Available Space":item['availableSpace'],
          "Occupancy (%)":item['occupiedPercentage'],
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
