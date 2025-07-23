import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlanToolService {
   
    constructor(
        private planToolService: DataService<any>,
    ) { }

    public getAllPlanTools(planStepId:any) {
        return this.planToolService.getAllById('planTool', 'getByPlanStepId',planStepId);
    }

    public getPlanToolById(id: any) {
        return this.planToolService.getSingleById('planTool', 'getplanToolById', id);
    }

    public savePlanTool(data: any): Observable<any> {
        return this.planToolService.add('planTool', 'save', data);
    }

    public deletePlanTool(id: any) {
        return this.planToolService.getSingleById('planTool', 'deleteplanToolById', id);
    }

    public checkIsPlanToolExists(planStepId:any, toolId:any) {
        return this.planToolService.getAllByIds('planTool','checkExist',planStepId,toolId)
    }

}
