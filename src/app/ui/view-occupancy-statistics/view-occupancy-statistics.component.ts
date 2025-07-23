import { Component } from '@angular/core';
import { UtilConstant } from 'src/common/UtilConstant';
import { SpaceUtilizationStatisticsFilterInputDTO } from './model/SpaceUtilizationStatisticsFilterInputDTO.model';
import { EmployeeService } from '../employee/services/employee.service';
import * as FileSaver from 'file-saver';
import { BuildingService } from '../background-loc/services/bl.service';

@Component({
  selector: 'app-view-occupancy-statistics',
  templateUrl: './view-occupancy-statistics.component.html',
  styleUrls: ['./view-occupancy-statistics.component.scss']
})
export class ViewOccupancyStatisticsComponent {
  selectedOptions:any[]=[];
  showTable:boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  isTableRecordLoading : boolean = false;
  resultData : any[]=[];
  columnData : any[]=[];
  filterData :SpaceUtilizationStatisticsFilterInputDTO =  new SpaceUtilizationStatisticsFilterInputDTO(false,false,false,false);
  grid_array : any[]=[];
  showPopUpGrid : boolean = false;
  roomData : any[] = [];
  constructor(
    private emService : EmployeeService,
    private blService : BuildingService
  ){

  }
  ngOnInit(): void {
    this.onloadData();
  }

  checkboxSelected(event:any){
    this.isTableRecordLoading = true;
    this.resultData = [];
    this.columnData = [];
    this.filterData = new SpaceUtilizationStatisticsFilterInputDTO(false,false,false,false);
    this.selectedOptions.forEach((option:any)=>{
      if(option == 'building'){
        this.filterData.building = true;
      }
      if(option == 'floor'){
        this.filterData.building = true;
        this.filterData.floor = true;
        if(!this.selectedOptions.includes('building')){
          this.selectedOptions.push('building');
        }
      }
      if(option == 'division'){
        this.filterData.division = true;
      }
      if(option == 'department'){
        this.filterData.division = true;
        this.filterData.department = true;
        if(!this.selectedOptions.includes('division')){
          this.selectedOptions.push('division');
        }
      }
    });
    if(!this.filterData.division && !this.filterData.department && !this.filterData.building && !this.filterData.floor){
      this.resultData = [];
      this.isTableRecordLoading = false;
      this.showTable = true;
    }else{
      this.emService.getspaceutilization(this.filterData).subscribe((res:any) => {
        this.resultData = res;
        this.generateColumnData();
        this.showTable = true;
        this.isTableRecordLoading = false;
      })
    }
  }

  onloadData(){
    this.isTableRecordLoading = true;
    this.selectedOptions.push('division');
    this.filterData = new SpaceUtilizationStatisticsFilterInputDTO(false,false,false,false);
    this.filterData.division = true;
    this.emService.getspaceutilization(this.filterData).subscribe((res:any) => {
      this.resultData = res;
      this.generateColumnData();
      this.showTable = true;
      this.isTableRecordLoading = false;
    })
  }

  generateColumnData(){
    if(this.filterData.division){
      this.columnData.push({field:'division',header:'Division'});
    }
    if(this.filterData.department){
      this.columnData.push({field:'department',header:'Department'});
    }
    if(this.filterData.building){
      this.columnData.push({field:'building',header:'Building'});
    }
    if(this.filterData.floor){
      this.columnData.push({field:'floor',header:'Floor'});
    }
    this.columnData.push({field:'totalSpace',header:'Total Seats'});
    this.columnData.push({field:'occupiedSpace',header:'Occupied Seats'});
    this.columnData.push({field:'availableSpace',header:'Available Seats'});
    this.columnData.push({field:'occupiedPercentage',header:'Occupancy (%)'});
  }

  onClear(){
    this.selectedOptions =[];
    this.showTable = false;
    this.isTableRecordLoading = false;
    this.resultData =[];
    this.columnData =[];
    this.onloadData();
    this.showPopUpGrid = false;
  }

  exportExcel(){
    this.getDestructuredData(this.resultData);
    var excelHeaders: string[]=[];
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.grid_array);
      worksheet['!cols'] = [];
      for (let i = 0; i < this.columnData.length; i++) {
        worksheet['!cols'][i] = { wch: 20 };
      }
      excelHeaders = this.columnData.map(obj => obj['header']);
      const headers = excelHeaders.map((header, index) => ({ v: header, position: String.fromCharCode(65 + index) + 1 }));
      headers.forEach(header => {
        worksheet[header.position] = { v: header.v };
      });
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "occupancy_statistics");
    });
  }
    getDestructuredData(data: any) {
      this.grid_array = data.map((item: any) => {
        let obj:any ={};
        if(this.filterData.division){
          obj["Division"] = item['division']
        }
        if(this.filterData.department){
          obj["Department"] = item['department']
        }
        if(this.filterData.building){
          obj["Building"] = item['building']
        }
        if(this.filterData.floor){
          obj["Floor"] = item['floor']
        }
        obj["Total Seats"] = item['totalSpace']
        obj["Occupied Seats"] = item['occupiedSpace']
        obj["Available Seats"] = item['availableSpace']
        obj["Occupancy (%)"] = item['occupiedPercentage']
        return obj;
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

    onClickCount(data:any){
      this.showPopUpGrid = false;
      let obj:any={};
      if(data.division){
        obj.divId = data.division;
      }
      if(data.department){
        obj.depId = data.department;
      }
      if(data.building){
        obj.blId = data.building;
      }
      if(data.floor){
        obj.flId = data.floor;
      }
      if(this.filterData.division){
        obj.division = true;
      }else{
        obj.division = false;
      }if(this.filterData.department){
        obj.department = true;
      }else{
        obj.department = false;
      }if(this.filterData.building){
        obj.building = true;
      }else{
        obj.building = false;
      }if(this.filterData.floor){
        obj.floor = true;
      }else{
        obj.floor = false;
      }
      this.blService.getspaceutilizationrmdata(obj).subscribe((res:any)=>{
      this.roomData = res;
      this.showPopUpGrid = true;
      })
    }
}
