import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { AppParams } from '../model/app-params.model';
import { AppParamsDTO } from '../model/app-params.dto';

@Injectable({
        providedIn: 'root'
})
export class AppParamsService {

        EVENT: string = "";
        API_NAME: string = "ap";
        constructor(
                private AppParamsSrv: DataService<any>,
                private AppParamsSaveSrv: DataService<AppParamsDTO>
        ) { }

        public getAppParamById(id: any): Observable<AppParams> {
                this.EVENT = "get"
                return this.AppParamsSrv.getSingleById(this.API_NAME, this.EVENT, id);
        }
        public getAppParamByCode(id: any): Observable<AppParams> {
                this.EVENT = "getByCode"
                return this.AppParamsSrv.getSingleById(this.API_NAME, this.EVENT, id);
        }
        public getAllAppParams(): Observable<AppParams[]> {
                this.EVENT = "all"
                return this.AppParamsSrv.getAll(this.API_NAME, this.EVENT);
        }
        public getAllAppParamsPaginated(data:any){
                this.EVENT = "allPaginated"
                return this.AppParamsSrv.search(this.API_NAME, this.EVENT,data);
        }
        public saveAppParam(data: AppParamsDTO) {
                this.EVENT = "save"
                return this.AppParamsSaveSrv.add(this.API_NAME, this.EVENT, data);
        }
        public deleteAppParamById(data: any) {
                this.EVENT = "delete"
                return this.AppParamsSrv.deleteById(this.API_NAME, this.EVENT, data);
        }
        public checkAppParamExists(item: any) {
                this.EVENT = "check"
                return this.AppParamsSrv.getSingle(this.API_NAME, this.EVENT, item);
        }

        public getAppParamByParamId(id: any): Observable<AppParams> {
                this.EVENT = "getbyparamid"
                return this.AppParamsSrv.getSingleById(this.API_NAME, this.EVENT, id);
        }
        
}
