import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {

    constructor(
        private departmentService: DataService<any>,

    ) { }

    public getAllDepartments() {
        return this.departmentService.getAll('department', 'getAll');
    }

    public getById(divId: any) {
        return this.departmentService.getSingleById("department", "getById", divId);
    }

    public saveDepartment(data: any): Observable<any> {
        return this.departmentService.add('department', 'save', data);
    }

    public deleteById(divId: any) {
        return this.departmentService.deleteById("department", "deleteById", divId);
    }

    public checkDepartmentExists(divId: any) {
        return this.departmentService.getSingleById("department", "check", divId);
    }

    public getDepartmentList(data:any){
        return this.departmentService.search("department", "list", data);
    }

    public getDepartmentAreaByFloor(data:any){
        return this.departmentService.search("department", "getareabyfloor", data);
    }

    public getDepartmentWithAllocatedArea(data:any){
        return this.departmentService.search("department", "getallocatedarea", data);
    }

    public getAllDepartmentsWithDivCode() {
        return this.departmentService.getAll('department', 'getallwithdivcode');
    }
    
}
