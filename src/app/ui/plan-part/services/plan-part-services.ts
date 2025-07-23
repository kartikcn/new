import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlanPartService {
   
    constructor(
        private planPartService: DataService<any>,
    ) { }

    public getAllPlanParts(planStepId:any) {
        return this.planPartService.getAllById('planPart', 'getByPlanStepId',planStepId);
    }

    public getPlanPartById(id: any) {
        return this.planPartService.getSingleById('planPart', 'getplanPartById', id);
    }

    public savePlanPart(data: any): Observable<any> {
        return this.planPartService.add('planPart', 'save', data);
    }

    public deletePlanPart(id: any) {
        return this.planPartService.getSingleById('planPart', 'deleteplanPartById', id);
    }

    public checkIsPlanPartExists(planStepId:any,partId:any) {
        return this.planPartService.getAllByIds('planPart','checkExist',planStepId,partId)
    }

}
