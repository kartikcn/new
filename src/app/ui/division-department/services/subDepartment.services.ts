import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
  })
  export class SubDepartmentService {
  
    constructor(
      private subDepartmentService: DataService<any>,
    ) { }

    public getAllSubDepartments() {
        return this.subDepartmentService.getAll('sub_department', 'getAll');
    }

    public getAllSubDepartmentsPaginated(data:any) {
      return this.subDepartmentService.search('sub_department', 'getAllPaginated',data);
  }

    public saveSubDepartment(data: any): Observable<any> {
        return this.subDepartmentService.add('sub_department', 'save', data);
    }

    public getSubDepartmentAreaByFloor(data:any){
      return this.subDepartmentService.search("sub_department", "getareabyfloor", data);
    }

    public getSubDepartmentWithAllocatedArea(data:any){
      return this.subDepartmentService.search("sub_department", "getallocatedarea", data);
  }

}  