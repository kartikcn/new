import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';



@Injectable({
  providedIn: 'root'
})
export class RmConfigService {
  
  

  constructor(
    private rmConfigService: DataService<any>,
    private rmConfigDetailService: DataService<any>

  ) { }


  public getRmConfig(data:any) {
    return this.rmConfigService.search('rmConfig', 'getById',data);
  }
  
  public saveRmConfig(data: any): Observable<any> {
    return this.rmConfigDetailService.add('rmConfig', 'save', data);
  }
  public deleteRmConfigById(id: any) {
    
    return this.rmConfigService.deleteById('rmConfig', 'delete', id);
}

  getAvailableRooms(filterData: any) {
    return this.rmConfigService.search('rmConfig','getRmConfigList',filterData);
  }
  
  getAllFilterData() {
   return this.rmConfigService.getAll('rmConfig','getAllFilterData');
  }
   public checkRmArrangementExists(data:any){
    return this.rmConfigService.search('rmConfig','checkRmConfig',data);
   }

   public getRoomsList(id:any){
    return this.rmConfigDetailService.getAllById("rmConfig","getRoomsList",id);
   }

   public getReservableRoomsPaginated(data:any){
    return this.rmConfigDetailService.search("rmConfig","getReservRmPaginated",data);
   }

   public getAvailableRoomsForRecurrence(data:any){
    return this.rmConfigService.search('rmConfig','recurrence',data);
   }

   public getRmConfigsByIds(data:any) {
    return this.rmConfigService.search('rmConfig', 'getallByIds',data);
  }

  public getRmConfigByBlAndFlId(data:any) {
    return this.rmConfigService.search('rmConfig', 'getallbyblandfl',data);
  }
}
