import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class CostTypeService {

    constructor(
        private costTypeService: DataService<any>,

    ) { }

    public getAllCostTypes() {
        return this.costTypeService.getAll('costtype', 'getAll');
    }

    public getAllCostTypesPaginated(data:any) {
        return this.costTypeService.search('costtype', 'getAllPaginated',data);
    }

    public getByCostType(costType: any) {
        return this.costTypeService.getSingleById("costtype", "getByCostType", costType);
    }

    public saveCostType(data: any): Observable<any> {
        return this.costTypeService.add('costtype', 'save', data);
    }

    public checkExist(costType: any) {
        return this.costTypeService.getSingleById('costtype', 'checkExist', costType);
    }

    public deleteByCostType(costType: any) {
        return this.costTypeService.deleteById("costtype", "deleteByCostType", costType);
    }

}
