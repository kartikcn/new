import { Injectable } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';
import { EmployeeOutput } from '../../user/model/employeOutput.model';
import { AuthService } from 'src/app/services/auth.service';
import { PaginationObj } from 'src/app/model/pagination-model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  getALLEmp() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private empService: DataService<any>,
    private empDetailService: DataService<EmployeeOutput>,
    private authSrv:AuthService
    
  ) { }

  
  public getAllEmployeeList(){
    return this.empService.getAll('em', 'getAllEm');
  }

  public getAllEmployeeListPaginated(data:any){
    return this.empService.search('em', 'getAllEmPaginated',data);
  }

  public getEmById(id: any) {
    return this.empService.getSingleById('em', 'getEmById', id);
  }

  public saveEmployee(data: EmployeeOutput) {
    return this.empService.add('em', 'saveEmp', data);
  }
  public getAllUnAssignEmployees(emId:any){
    return this.empService.getAllById('em','getAllUnAssign',emId);
  }
  public checkEmployeeExists(em_id:any){
    return this.empService.getSingleById('em', 'check', em_id);
  }

  public getAllEmpByComp(){
    return this.empService.getAll('em', 'getAllEmp');
  }

  public getReportsByFilter(data:any) {
    return this.empService.search('em', 'resportsByGroup', data);
  }

  public getReportsByFilterPaginated(data:any) {
    return this.empService.search('em', 'resportsByGroupPaginated', data);
  }

  public getEmployeeByFilter(data: any) {
    return this.empService.search('em', 'reportfilter', data);
  }


  public getspaceutilization(data:any){
    return this.empService.search('em','spaceutilizationbygroup',data);
  }

  public getALLmployeeByScroll(data:any) {
    return this.empService.search("em", "getAllEmByScroll",data);
  }

}
