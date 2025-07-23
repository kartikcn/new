import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PpmPlanService {
   
    constructor(
        private ppmPlanService: DataService<any>,
    ) { }

    public getAllPlans() {
        return this.ppmPlanService.getAll('plan', 'getAll');
    }
    public getAllPlansPaginated(data:any) {
        return this.ppmPlanService.search('plan', 'getAllPaginated',data);
    }

    public getPlanById(id: any) {
        return this.ppmPlanService.getSingleById('plan', 'getPlanById', id);
    }

    public savePlan(data: any): Observable<any> {
        return this.ppmPlanService.add('plan', 'save', data);
    }

    public deletePlan(id: any) {
        return this.ppmPlanService.getSingleById('plan', 'deletePlanById', id);
    }

    public checkIsPlanNameExists(planName:any) {
        return this.ppmPlanService.getSingleById('plan','checkExist',planName)
    }

    public getAllPlanSteps(planId:any) {
        return this.ppmPlanService.getAllById('planStep', 'getAllByPlanId',planId);
    }

    public getPlanStepById(id: any) {
        return this.ppmPlanService.getSingleById('planStep', 'getplanStepById', id);
    }

    public savePlanStep(data: any): Observable<any> {
        return this.ppmPlanService.add('planStep', 'save', data);
    }

    public deletePlanStep(id: any) {
        return this.ppmPlanService.getSingleById('planStep', 'deletePlanStepById', id);
    }

    checkIsStepCodeExists(planId: any, stepCode: any) {
       return this.ppmPlanService.getAllByIds('planStep','checkExist',planId,stepCode);
    }
    
}
