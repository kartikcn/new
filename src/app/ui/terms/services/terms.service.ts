import { Injectable } from "@angular/core";
import { DataService } from "src/app/services/data.service";

@Injectable({
    providedIn: 'root'
})

export class TermsService{
    constructor(
        private termsService: DataService<any>,
    ) { }

    public getAllTerms(){
        return this.termsService.getAll('terms','all');
    }

    public getAllTermsPaginated(data:any){
        return this.termsService.search('terms','allPaginated',data);
    }

    public saveTerm(data:any){
        return this.termsService.add('terms','save',data);
    }

    public deleteTerm(data:any){
        return this.termsService.delete('terms','delete',data);
    }

    public checkTermExists(term:string){
        return this.termsService.getSingleById('terms','check',term);
    }


}