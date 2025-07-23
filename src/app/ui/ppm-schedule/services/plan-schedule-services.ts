import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlanScheduleService {

    constructor(
        private planScheduleService: DataService<any>,
    ) { }

    public getPlanScheduleById(id: any) {
        return this.planScheduleService.getAllById('planSchedule', 'getPlanScheduleById', id);
    }

    public savePlanSchedule(data: any): Observable<any> {
        return this.planScheduleService.add('planSchedule', 'save', data);
    }

    public getCountOfOccurence(data: any): Observable<any> {
        return this.planScheduleService.add('planSchedule', 'getListOfOccurances', data);
    }

    public deletePlanSchedule(id:any) {
        return this.planScheduleService.getSingleById('planSchedule', 'delete', id)
    }

    public getRequestsList(data:any) {
        return this.planScheduleService.search('planSchedule','scheduleList',data);
    }

    public generateRequests(data:any) {
        return this.planScheduleService.search('planSchedule','generateRequest',data);
    }

    public checkIsScheduleGenerated(id:any) {
        return this.planScheduleService.getSingleById('planSchedule', 'checkSchedGenerated', id)
    }

    public getPmPlannerData(data:any) {
        return this.planScheduleService.search('planSchedule','planner',data);
    }

    public getPmPlannerRequestDetails(data:any) {
        return this.planScheduleService.search('planSchedule','getPlanRequestDetails',data);
    }
    public getForecastDetails(data:any) {
        return this.planScheduleService.search('planSchedule','forecast',data);
    }

    public getForecastPlanDetails(data:any) {
        return this.planScheduleService.search('forecast','details',data);
    }

    public getPlannerRequestSelectionInfo(data:any) {
        return this.planScheduleService.search('planSchedule','getplannerreqselectioninfo',data);
    }

}
