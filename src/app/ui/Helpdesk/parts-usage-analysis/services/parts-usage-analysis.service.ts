import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class PartsUsageanalysisService {

  constructor(
    private partsUsageanalysisService: DataService<any>,
  ) { }

public getRequestByPartCode(filterdata:any) {
   
  return this.partsUsageanalysisService.search('wr','getRequestByPartCode',filterdata);
}

public getRequestByBugdet(filterdata:any) :Observable<any[]> {
   
    return this.partsUsageanalysisService.search('wr','getAllBudgetByRequestId', filterdata);
  }
}