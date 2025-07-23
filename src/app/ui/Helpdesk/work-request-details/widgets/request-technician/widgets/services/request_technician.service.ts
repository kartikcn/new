import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class RequestTechnicianService {

    constructor(
        private requestTechnicianService: DataService<any>,

    ) { }

    public saveRequestTechnician(data: any) {
        return this.requestTechnicianService.add('RequestTechnician', 'save', data);
    }
    public getAllRequestTechnician(id: any) {
        return this.requestTechnicianService.getAllById('RequestTechnician', 'getAll', id);
    }

    public getByrequestTechnicianId(requestTechnicianId: any) {
        return this.requestTechnicianService.getSingleById("RequestTechnician", "getByRequestId", requestTechnicianId);
    }

    public deleteByRequestTechnician(requestTechnicianId: any) {
        return this.requestTechnicianService.deleteById("RequestTechnician", "deleteByRequestId", requestTechnicianId);
    }

    public checkTechnicianExist(requestId:any,technicianId:any) {
        return this.requestTechnicianService.getAllByIds("RequestTechnician", "checkExist", requestId,technicianId);
      }
}
