import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class AddWorkRequestService {

    constructor(
        private addWorkRequestService: DataService<any>
    ) { }

    public saveWorkRequest(data: any): Observable<any> {
        return this.addWorkRequestService.add('wr', 'saveWr', data);
    }

    public getAllWr(): Observable<any> {
        return this.addWorkRequestService.getAll('wr', 'getAll');
    }

    public getAllWrByFilter(filteData:any): Observable<any> {
        return this.addWorkRequestService.search('wr', 'getAllByFilter',filteData);
    }

    public getAllWrByFilterPaginated(filteData:any) {
        return this.addWorkRequestService.search('wr', 'getAllByFilterPaginated',filteData);
    }

    public getWrById(id:any): Observable<any> {
        return this.addWorkRequestService.getSingleById('wr','getWrById',id);
    }

    public getRequestLogByRequestId(requestId:any): Observable<any> {
        return this.addWorkRequestService.getAllById('requestLog','getByRequestId',requestId);
    }

    public getEscaltionDateAndTime(dateAndTime: any) : Observable<any>{
        return this.addWorkRequestService.add('wr', 'getEscaltionDateAndTime', dateAndTime);
    }

    public getAllStatusWithCount(filteData:any){
        return this.addWorkRequestService.search('wr', 'getAllStatusWithCount',filteData);
    }

}
