import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root'
})
export class SummeryRequestReportsService {

  constructor(
    private helpDeskreportsService: DataService<any>,

  ) { }

  public getReportsByFilter(filteData: any): Observable<any> {
    return this.helpDeskreportsService.search('helpdesk', 'resportsByGroup', filteData);
  }

  public getRequestTechncianOrTeamReport(data : any) : Observable<any> {
    return this.helpDeskreportsService.search('helpdesk', 'getRequestTechnicianOrTeamReport', data);
}

}
