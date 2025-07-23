import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';


@Injectable({
  providedIn: 'root'
})
export class RequestTechnicianLogService {

  constructor(
    private requestTechnicianLogService: DataService<any>,

  ) { }

  public saveRequestTechnicianLog(data: any) {
    return this.requestTechnicianLogService.add('RequestTechnicianLog', 'save', data);
  }

  public deleteByRequestTechnicanLogId(requestTechnicianLogId: any) {
    return this.requestTechnicianLogService.deleteById("requestTechnicianLog", "deleteByRequestId", requestTechnicianLogId);
  }

  public getAllByRequestId(requestId: any) {
    return this.requestTechnicianLogService.getAllById('requestTechnicianLog', 'getAllByRequestId', requestId);
  }

  public getByRequestTechnicianId(requestId: any) {
    return this.requestTechnicianLogService.getSingleById("requestTechnicianLog", "getByRequestId", requestId);
  }

  public RequestTechnicianLogId() {
    return this.requestTechnicianLogService.getAll('requestTechnicianLog', 'getAll');
  }






}
