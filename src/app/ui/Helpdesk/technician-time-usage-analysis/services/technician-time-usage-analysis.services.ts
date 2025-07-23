import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class TechnicianTimeUsageanalysisService {

  constructor(
    private technicianTimeUsageanalysisService: DataService<any>,
  ) { }

public getRequestByTechnicianTime(filterdata:any) {
   
  return this.technicianTimeUsageanalysisService.search('wr','getRequestByTechnicianTimeUsageAnalysis',filterdata);
}
public getWorkingHoursByTechnicianIdAndRequestId(filterdata:any) {
   
  return this.technicianTimeUsageanalysisService.search('wr','getWorkingHoursByTechnicianIdAndRequestId',filterdata);
}
}