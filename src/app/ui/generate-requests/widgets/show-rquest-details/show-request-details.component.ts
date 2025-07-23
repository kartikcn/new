import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enums } from 'src/app/model/enums.model';
import { EnumService } from 'src/app/services/enum.service';
import { EmployeeService } from 'src/app/ui/employee/services/employee.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-show-request-details',
  templateUrl: './show-request-details.component.html',
  styleUrls: ['./show-request-details.component.scss'],
  providers: [MessageService]
})

export class ShowRequestDetailsComponent {
  loading: boolean = false;
  rowCount: number = UtilConstant.ROW_COUNT;
  enumStatusData: Enums[] = [];
  requestsData: any[] = [];
  enumStauts: any[] = [];
  enumList: Enums[] = [];
  enumClonedList: Enums[] = [];
  allEmployees: any[] = []
  enumEm: any[] = [];
  enumStatusFilter: Enums[] = [];
  req_array: any[] = [];
  fullName: any;
  @Input() data:any
  constructor(
    private enumsrv: EnumService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.route.queryParamMap.subscribe(params => {
      const dataParam = params.get('data');
    if (dataParam) {
      this.data = JSON.parse(dataParam);
      
    } 
  });
}

  ngOnInit(): void {
   this.requestsData = this.data;
    this.loadAllEnums();
    this.loadAllEmployee();
    this.getRequestData();
  }

  getRequestData() {
    this.requestsData = this.data;
  }

  loadAllEnums() {
    this.enumsrv.getEnums().subscribe(
      (res: Enums[]) => {
        if (res) {
          this.enumList = res;
          this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
          // this.enumStauts = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
          this.enumStatusData = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
          this.enumStatusFilter = [...this.enumStatusData];
          this.enumStatusFilter.unshift(new Enums(null, "", "", 'Make a selection'));
        }
      })
  }

  loadAllEmployee() {
    this.employeeService.getAllEmployeeList().subscribe((res: any) => {
      if (res) {
        this.allEmployees = res;
      }
      else {
        this.allEmployees = [];
      }
    })
  }

  getEnumByEnumId(id: any) {
    return this.enumStatusData.find((t: any) => t.id === id)?.enumValue
  }

  getEmployeeFullName(id: any) {
    if (this.allEmployees) {
      this.enumEm = this.allEmployees.filter(em => em.emId === id);
      this.fullName = this.enumEm.map(em => {
        if (em.firstName.length > 0 && em.lastName.length > 0) {
          return em.firstName + " " + em.lastName + ' - ' + em.emId;
        } else {
          return em.firstName + ' - ' + em.emId;
        }
      })
    }
    return this.fullName[0];
  }

  convertToDisplayTime(value: any) {
    if (value != null) {
      var data = value.split(':');
      var time = data[0] + ':' + data[1];
      return time;
    } else {
      return '';
    }
  }

  onClickView(data : any){
    const wrId = data.wrId;
    const status = data.status;
  
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/work-request-details"], { queryParams: { requestId: wrId, index: 0, action: "details", status: status, viewDetails:true, isNavigationFromReport : true} })
      );
      
    window.open(url, '_blank');
  }

  clickBack() {
    this.router.navigate(["/generate-requests"]);
  }
}
