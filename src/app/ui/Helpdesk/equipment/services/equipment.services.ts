import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';
import { EquipmentComponent } from '../modal/equipment.component';


@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(
    private equipmentService: DataService<any>,
    private resourceDetailService: DataService<EquipmentComponent>

  ) { }


  public getAllEquipments() {
    return this.equipmentService.getAll('equipment', 'getAll');
  }

  public getAllEquipmentsPaginated(data:any) {
    return this.equipmentService.search('equipment', 'getAllPaginated',data);
  }

  public getEquipmentById(id: any) {
    return this.equipmentService.getSingleById("equipment", "getEquipmentById", id);
  }

  public saveEquipment(data: any): Observable<any> {
    return this.equipmentService.add('equipment', 'save', data);
  }
  public validateEquipmentId(title: any) {
    return this.equipmentService.getSingleById('equipment', 'check', title);
  }
  
  public deleteById(eqId: any) {
    return this.equipmentService.deleteById("equipment", "deleteById", eqId);
  }

  public getLinkedEquipmentPlanId(planId: any) {
    return this.equipmentService.getSingleById("equipment", "getLinked", planId);
  }

  public getUnLinkedEquipmentPlanId(planId: any) {
    return this.equipmentService.getSingleById("equipment", "getUnLinked", planId);
  }

  public getAllLogsById(eqId:any) {
    return this.equipmentService.getAllById("equipment", "getAllLogs", eqId)
  }

}
