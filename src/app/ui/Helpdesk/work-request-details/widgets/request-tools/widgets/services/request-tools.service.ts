import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class RequestToolsService {

    constructor(
        private requestToolsService: DataService<any>,

    ) { }

    public saveRequestTools(data: any) {
        return this.requestToolsService.add('requestTools', 'save', data);
    }
    public getAllRequestTools(id: any) {
        return this.requestToolsService.getAllById('requestTools', 'getAll', id);

    }

    public getByrequestToolsId(reqToolsId: any) {
        return this.requestToolsService.getSingleById("requestTools", "getByRequestId", reqToolsId);
    }

    public deleteByRequestTools(reqToolsId: any) {
        return this.requestToolsService.deleteById("requestTools", "deleteByRequestId", reqToolsId);
    }
    public checkToolExist(requestId:any,toolId:any) {
        return this.requestToolsService.getAllByIds("requestTools", "checkExist", requestId,toolId);
      }
}
