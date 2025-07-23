import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlanTradeService {
   
    constructor(
        private planTradeService: DataService<any>,
    ) { }

    public getAllPlanTrades(planStepId:any) {
        return this.planTradeService.getAllById('planTrade', 'getByPlanStepId',planStepId);
    }

    public getPlanTradeById(id: any) {
        return this.planTradeService.getSingleById('planTrade', 'getPlanTradeById', id);
    }

    public savePlanTrade(data: any): Observable<any> {
        return this.planTradeService.add('planTrade', 'save', data);
    }

    public deletePlanTrade(id: any) {
        return this.planTradeService.getSingleById('planTrade', 'deletePlanTradeById', id);
    }

    public checkIsPlanTradeExists(planStepId:any,tradeId:any) {
        return this.planTradeService.getAllByIds('planTrade','checkExist',planStepId,tradeId)
    }

}
