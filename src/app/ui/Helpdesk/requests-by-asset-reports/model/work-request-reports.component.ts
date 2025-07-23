import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BuildingFilterInput } from 'src/app/ui/background-loc/model/DTO/blFilterInput.model';
import { FLFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/flFilterInput.model';
import { BuildingService } from 'src/app/ui/background-loc/services/bl.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { EquipmentService } from '../../equipment/services/equipment.services';
import { WorkRequestReportService } from '../services/work-request-reports.service';
import { RMFilterInputDTO } from 'src/app/ui/background-loc/model/DTO/rmFilterInput.model';
import { AddTableComponent } from '../widgets/add-table/add-table.component';
import { JSON2SheetOpts } from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-work-request-reports',
  templateUrl: './work-request-reports.component.html',
  styleUrls: ['./work-request-reports.component.scss'],
  providers: [MessageService],
})
export class WorkRequestReportsComponent implements OnInit {

 
  filterPanel!: UntypedFormGroup;
  isTableRecordLoading = false;
  tableRecord: any[] = [];
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  workrequestreportData: any[] = [];
  loadingRec: boolean = false;
  enumBL: BuildingFilterInput[] = [];
 enumAllBl: BuildingFilterInput[] = [];
  enumFL: FLFilterInputDTO[] = [];
  filter: any;
  enumAllFL: FLFilterInputDTO[] = [];
  allRmDdata: any[] = [];
  rm_data: any[] = [];
  eqData:any[]=[];
  req_array: any[] = [];
  isShow = false;
  isErr: boolean = false;
  errorMsg: string = '';
  compId: number = 0;
  @ViewChild(AddTableComponent, { static: false }) addTableComponent!: AddTableComponent;
constructor(
    private blService: BuildingService,
    private datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private eqService: EquipmentService,
    private workRequestReportSrv:WorkRequestReportService
  ) { 

    this.filterPanel = this.formBuilder.group({
     
      blId: [null],
      flId: [null],
      rmId: [null],
      eqId: [null],
      wrId: [null],
      dateFrom: [new Date(new Date().getFullYear(), new Date().getMonth(), 1), [Validators.required]],
      dateTo: [new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadRecords();
    this.loadBuilding();
    this.loadFloors();
    this.loadequipments();
  }
  loadBuilding() {
    this.blService.getALLBuilding().subscribe((res: any) => {
      this.enumAllBl = res;
      this.enumAllBl = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumAllBl.unshift(new BuildingFilterInput('', 'Make a selection', '', this.compId));
      this.enumBL = this.enumAllBl;
    });
  }
  loadFloors() {
    this.blService.getALLFloor().subscribe((res: any) => {
      this.enumAllFL = res;
      this.enumAllFL = res.map((i: any) => { i.name = i.id + ' - ' + i.name; return i; });
      this.enumAllFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.enumFL = this.enumAllFL;

    });
  }
  setFromateDate(date: Date) {
    if (date != null) {
      var date = new Date(date);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");
    } else {
      return null;
    }
  }

  onSelectBlCode($event: any) {
    if ($event.id != null && $event.id != '') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null,
          siteId: $event.siteId,
        });
        this.filterFloorCode($event.id);
      }, 0);
    } else {
      this.enumFL = this.enumAllFL
      setTimeout(() => {
        this.filterPanel.patchValue({
          flId: null,
          rmId: null,
          blId: null
        });
      }, 0);
    }
  }

  filterFloorCode(bl_id: any) {
    if (bl_id != null) {
      this.enumFL = [];
      this.enumFL = this.enumAllFL.filter(t => t.blId == bl_id)
      this.enumFL.unshift(new FLFilterInputDTO('', 'Make a selection', '', this.compId));
      this.rm_data = this.allRmDdata.filter(t => t.blId == bl_id)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
    }
  }

  onSelectFlCode($event: any) {
    if ($event.id != null && $event.id != '') {
      setTimeout(() => {
        this.filterPanel.patchValue({
          blId: $event.blId,
          rmId: null,
        });
        this.filterRmCode($event.id, $event.blId);
      }, 10);
    }
    else {
      setTimeout(() => {
        this.filterPanel.patchValue({
          rmId: null
        });
      }, 0);
      this.enumFL = this.enumAllFL;
    }
  }
  filterRmCode(flId: any, blId: any) {
    if (flId != null) {
      this.rm_data = [];
      this.rm_data = this.allRmDdata.filter(t => t.blId == blId);
      this.rm_data = this.rm_data.filter(t => t.flId == flId)
      this.rm_data.unshift(new RMFilterInputDTO('', 'Make a selection', '', '', this.compId));
    }
  }
 
  loadequipments() {
    this.eqService.getAllEquipments().subscribe((res: any) => {
      if (res.status != 202) {
        this.eqData = res;
      }
    });
  }
 
  loadRecords() {
    var fromDate = this.filterPanel.controls.dateFrom.value;
    var toDate = this.filterPanel.controls.dateTo.value;
    var   blId= this.filterPanel.controls.blId.value;
    var flId= this.filterPanel.controls.flId.value;
    var eqId= this.filterPanel.controls.eqId.value;
    var filterData = {
      "compId":1,
      "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
      "blId": blId,
      "flId":flId,
      "eqId":eqId,
    };
    this.loadData(filterData);
}

  loadData(filter: any) {
    this.loadingRec = true
    this.workRequestReportSrv.getRequestCountByEquipmentId(filter).subscribe((res: any[]) => {
      console.log(res);
      this.loadingRec = false
      this.workrequestreportData = res;
    }, error => {
      this.loadingRec = false;
      this.workrequestreportData = [];
    });
  }
  onSearch() {
    this.loadRecords();
  }
  checkDateValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && control.value != null) {
        this.filterPanel.controls['dateFrom'].setErrors(null);
        this.filterPanel.controls['dateTo'].setErrors(null);
        this.filterPanel.clearAsyncValidators();
        this.filterPanel.updateValueAndValidity();

        var dateFrom = new Date(this.filterPanel.controls['dateFrom'].value);
        var dateTo = new Date(this.filterPanel.controls['dateTo'].value);

        if (dateFrom.getTime() >= dateTo.getTime() && this.filterPanel.controls['dateTo'].value != null) {
          this.isErr = true;
          this.filterPanel.controls['dateFrom'].setErrors({ 'incorrect': true });
          this.filterPanel.updateValueAndValidity();
          this.errorMsg = 'Date created to should be greater than date created from.'
          return { 'incorrect': true };
        } else {
          this.isErr = false
          return null;
        }
      }
      return null;
    };
  }

  onClick(eqId: any) {
    var fromDate = this.filterPanel.controls.dateFrom.value;
    var toDate = this.filterPanel.controls.dateTo.value;
   var blId= this.filterPanel.controls.blId.value;
   var flId= this.filterPanel.controls.flId.value;
    var filterData = {
      "compId":1,
      "fromDate": this.datePipe.transform(fromDate, "yyyy-MM-dd"),
      "toDate": this.datePipe.transform(toDate, "yyyy-MM-dd"),
      "blId": blId,
      "flId":flId,
      "eqId":eqId,
    };
    this.onRowClick(filterData);
  }
onRowClick(event: any) {
  this.isShow = this.isTableRecordLoading = true;
  let postData = {
    ...event
  }
this.getRequestByEquipmentId(postData);
}
  getRequestByEquipmentId(postData: any) {
  this.workRequestReportSrv.getRequestByEquipmentId(postData).subscribe((res: any[]) => {
    this.isTableRecordLoading = false;

    this.addTableComponent.getRequestData(res);
  }, error => {
    this.isTableRecordLoading = false;
  });
}

getDestructuredData(req_data: any) {
  this.req_array = req_data.map((item: any) => {
    return {
     "Assest Name": item['eqId'],
      "request Count": item['requestCount'],
     }
  })
}

exportExcel() {
  this.getDestructuredData(this.workrequestreportData);
  var excelHeaders: string[] = [ "Assest Name","Request Count",];
  let options: JSON2SheetOpts = { header: excelHeaders };
  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(this.req_array);

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
     
    ]
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "requests");
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