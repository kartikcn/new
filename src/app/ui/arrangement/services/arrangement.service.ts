import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { Arrangement } from "../model/arrangement.model";


@Injectable({
    providedIn: 'root'
})
export class ArrangementService{
    constructor(
        private ArrangementSrv:DataService<Arrangement>,
        private service:DataService<any>
        ){}

    public getAllArrangements():Observable<Arrangement[]>{
        return this.ArrangementSrv.getAll("arrangement","getAll");
    }

    public getAllArrangementsPaginated(data:any){
        return this.ArrangementSrv.search("arrangement","getAllPaginated",data);
    }

    public getArrangementByType(id:any){
        return this.service.getSingleById("arrangement","getByType",id)
    }

    public updateArrangement(data:Arrangement):Observable<Arrangement>{
        return this.ArrangementSrv.add("arrangement","save",data);
    }

    public checkArrangementTypeExists(data:any) {
        return this.service.getSingle("arrangement", "isExist", data);
    }
}