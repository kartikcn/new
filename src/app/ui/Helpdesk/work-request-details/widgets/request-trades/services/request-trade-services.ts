import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class RequestTradeService {

    constructor(
        private requestTradeService: DataService<any>,

    ) { }

    public saveRequestTrade(data: any) {
        return this.requestTradeService.add('requestTrade', 'save', data);
    }

    public getAllRequestTrades(id: any) {
        return this.requestTradeService.getAllById('requestTrade', 'getAllByRequestId', id);

    }

    public getByrequestTradeId(requestTradeId: any) {
        return this.requestTradeService.getSingleById("requestTrade", "getById", requestTradeId);
    }

    public deleteByRequestTrade(requestTradeId: any) {
        return this.requestTradeService.deleteById("requestTrade", "delete", requestTradeId);
    }
    public checkTradeExist(requestId:any,toolId:any) {
        return this.requestTradeService.getAllByIds("requestTrade", "checkExist", requestId,toolId);
      }
}
