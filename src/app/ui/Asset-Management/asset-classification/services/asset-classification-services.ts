import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';



@Injectable({
  providedIn: 'root'
})
export class AssetClassificationService {

  constructor(
    private service: DataService<any>,
  ) { }


  public getAll() {
    return this.service.getAll('assetClassification', 'getList');
  }

  public getById(id: any) {
    return this.service.getSingleById("assetClassification", "getById", id);
  }

  public save(data: any): Observable<any> {
    return this.service.add('assetClassification', 'save', data);
  }
 
}
