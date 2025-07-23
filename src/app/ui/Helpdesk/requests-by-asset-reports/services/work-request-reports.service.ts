import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class WorkRequestReportService {

  constructor(
    private workRequestReportSrv: DataService<any>,
  ) { }

  public getRequestCountByEquipmentId(filterdata:any): Observable<any[]> {
   
    return this.workRequestReportSrv.search('wr','getRequestCountByEqId',filterdata);
}
public getRequestByEquipmentId(filterdata:any) {
   
  return this.workRequestReportSrv.search('wr','getRequestByEqId',filterdata);
}
}