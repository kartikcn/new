import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';



@Injectable({
  providedIn: 'root'
})
export class ProblemTypeService {

  constructor(
    private problemTypeService: DataService<any>,
  ) { }


  public getAll() {
    return this.problemTypeService.getAll('problemType', 'getList');
  }

  public getById(id: any) {
    return this.problemTypeService.getSingleById("problemType", "getById", id);
  }

  public save(data: any): Observable<any> {
    return this.problemTypeService.add('problemType', 'save', data);
  }
 
}
