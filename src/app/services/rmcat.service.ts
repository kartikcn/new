import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RmcatDetailsList } from '../model/rmcat-details-list.model';
import { RmcatFilterInput } from '../ui/rmcat/modal/rmcatFilterInput.model';
import { DataService } from './data.service';
import { RmTypeList } from '../ui/room category/model/rmtype-list.model';
//import { RmTypeFilterInputDTO } from '../ui/room category/model/DTO/rmtypeFilterInput.model';





@Injectable({
  providedIn: 'root'
})
export class RmcatService {
 
  constructor(
    private siteService: DataService<any>,
    private rmcatService: DataService<any>,
    private rmcatDetailService: DataService<RmcatDetailsList>,
    private rmTypeService: DataService<RmTypeList>
    
  ) { }

  public getRmcatList(data:RmcatFilterInput){
    return this.rmcatService.search('rmcat', 'list', data);
  }

  public getRmTypeList(data: any) {
    return this.rmTypeService.search('rmtype', 'list', data);
  }

  public getRmTypeListPaginated(data: any) {
    return this.rmTypeService.search('rmtype', 'listPaginated', data);
  }

  public getRmcatById(id:any){
    return this.rmcatDetailService.getSingleById('rmcat', 'get',id);
  }

  public getRmTypeById(rmcat: any, rmtype: any) {
    return this.rmTypeService.getAllByIds('rmType', 'getRmType', rmcat, rmtype);
  }
   public getALLRmcats() {
     return this.rmcatService.getAll('rmcat', 'getList');
   }

   public getALLRmcatsPaginated(data:any) {
    return this.rmcatService.search('rmcat', 'getListPaginated',data);
  }

   public saveRmcat(rmcat: RmcatDetailsList): Observable<RmcatDetailsList> {
     return this.rmcatDetailService.add('rmcat', 'saveRmcat', rmcat);
  }

  public saveRmType(rmcat: RmTypeList): Observable<RmTypeList> {
    return this.rmTypeService.add('rmType', 'saveRmtype', rmcat);
  }
  public deleteRoomType(data:any){
    return this.rmcatService.getAllByIds('rmType', 'delete', data.id, data.rmCat);
  }
  public deleteRoomCat(rm_cat: string) {
    return this.rmcatService.deleteById('rmcat', 'delete', rm_cat);
  }

  public getALLRmTypes() {
    return this.rmTypeService.getAll('rmType', 'getList');
  }
  public validateRmType(rmStandard: any,rmType:any ){
    return this.rmTypeService.getAllByIds('rmType','check' ,rmStandard, rmType);
  }

  public getAllRmCatTreeList(){
    return this.rmTypeService.getAll('rmcat', 'gettreelist');
  }

  public validateRmCat(rmCat: any){
    return this.rmcatService.getAllById('rmcat','check' ,rmCat);
  }

  public getRmCatAreaByFloor(data:any){
    return this.rmcatService.search("rmcat", "getareabyfloor", data);
  }

  public getRmTypeAreaByFloor(data:any){
    return this.rmcatService.search("rmType", "getareabyfloor", data);
  }
}
