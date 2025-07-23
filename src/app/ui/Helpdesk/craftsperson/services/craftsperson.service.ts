import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from '../../../../services/data.service';
import { Craftsperson } from '../model/craftsperson.model';

@Injectable({
    providedIn: 'root'
})
export class CraftspersonService {

    constructor(
        private service: DataService<any>,
        private cfService: DataService<Craftsperson>

    ) { }

    public getAllCraftsperson() {
        return this.service.getAll('craftsperson', 'getAllCraftsperson');
    }

    public getAllCraftspersonPaginated(data:any) {
        return this.service.search('craftsperson', 'getAllCraftspersonPaginated',data);
    }

    public getCraftspersonById(id: any) {
        return this.service.getSingleById("craftsperson", "getCraftspersonByCfId", id);
    }

    public saveCraftsperson(cf: Craftsperson): Observable<Craftsperson> {
        return this.cfService.add('craftsperson', 'saveCraftsperson', cf);
    }

    public deleteById(cfId: any) {
        return this.cfService.getSingleById("craftsperson", "deleteByCfId", cfId);
    }

    public checkCFExistsByName(name: any) {
        return this.cfService.getSingleById("craftsperson", "checkByName", name);
    }

    public checkCFExistsByEmail(email: any) {
        return this.cfService.getSingleById("craftsperson", "checkByEmail", email);
    }

    public getUnAssignedTechnician(technicianId: any) {
        return this.cfService.getAllById('craftsperson', 'getAllUnAssign', technicianId);
    }

    public getAllCraftspersonByTradeId(tradeId:any) {
        return this.cfService.getAllById('craftsperson', 'getAllTechnicians', tradeId);
    }
}
