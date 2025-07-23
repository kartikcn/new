import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { shareReplay } from "rxjs/operators";
import { DataService } from "src/app/services/data.service";

@Injectable({
  providedIn: 'root'
})
export class SLARequestServices {

  constructor(
    private service: DataService<any>,
    
    
  ) { }

  public getAllSLARequests(){
    return this.service.getAll('slaRequestParameters', 'getAll');
  }

  public getAllSLARequestsPaginated(data:any){
    return this.service.search('slaRequestParameters', 'getAllPaginated',data);
  }

  public getSLARequestById(id: any) {
    return this.service.getSingleById("slaRequestParameters", "getSlaRequestParametersById",id);
  }

  public saveSLARequest(data: any): Observable<any> {
    return this.service.add('slaRequestParameters', 'saveSlaRequestParameters', data);
  }

  public checkSlaRequestExists(data: any) {
    return this.service.search('slaRequestParameters', 'checkSlaExist', data);
  }

  public getAllSLAResponses() {
    return this.service.getAll('slaResponseParameter', 'getList');
  }
  
  public getSLAResponseByIds(seqId: any) {
    return this.service.getSingleById("slaResponseParameter", "getById", seqId);
  }
 
  public saveSLAResponse(data: any): Observable<any> {
    return this.service.add('slaResponseParameter', 'save', data);
  }
  
  public getAllPriorities(data:any):Observable<any[]>{
    if (data == null || data === '') {
      return of([]);
    }
    return this.service.getAllById('slaResponseParameter',"search",data);
  }

  searchPriorities(term: string) {
    return this.getAllPriorities(term).pipe(shareReplay(2));
  }

  getAllWrStatus() {
    return this.service.getAll("wrStatus","getList");
  }

  public saveSLASteps(data: any): Observable<any> {
    return this.service.add('slaRequestStep', 'save', data);
  }

  public getSlaStepsList(slaResponseParametersId: any) {
    return this.service.getAllById('slaRequestStep', 'getAll', slaResponseParametersId);
  }

  public deleteSlaRequestStep(slaRequestStepsId:any) {
    return this.service.getSingleById('slaRequestStep','delete',slaRequestStepsId)
  }

  public getApplicableSlaRequestParameters(data:any){
    return this.service.search('slaRequestParameters',"getApplicableSla",data);
  }

  public getAllSLAResponseBySlaRequestId(slaRequestId: any) {
    return this.service.getSingleById("slaResponseParameter", "getBySlaRequestId", slaRequestId);
  }

  public updateAllOtherPriorities(data: any){
    return this.service.add('slaResponseParameter', 'updateAllPriorities', data);
  }

  public getSlaResponseParametersById(id:any) {
    return this.service.getSingleById("slaResponseParameter", "getById", id);
  }
}
