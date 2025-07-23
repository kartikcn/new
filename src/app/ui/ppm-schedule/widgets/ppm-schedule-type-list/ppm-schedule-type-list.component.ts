import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumService } from 'src/app/services/enum.service';
import { UtilConstant } from 'src/common/UtilConstant';
import { PlanScheduleService } from '../../services/plan-schedule-services';
import { Router, ActivatedRoute } from '@angular/router';
import { PpmScheduleTypeComponent } from '../ppm-schedule-type/ppm-schedule-type.component';
import { EnumList } from 'src/app/model/enum-list.model';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-ppm-schedule-type-list',
  templateUrl: './ppm-schedule-type-list.component.html',
  styleUrls: ['./ppm-schedule-type-list.component.scss'],
  providers: [MessageService]
})
export class PpmScheduleTypeListComponent {
  enumList: EnumList[] = [];
  enumPlanScheduleData: EnumList[] = [];
  planScheduleList: any[] = [];
  isHide: Boolean = true;
  loading: boolean = false;
  value: any;
  rowCount: number = UtilConstant.ROW_COUNT;
  showChild: boolean = false;
  formTitle: string = '';
  displayScheduleExist: boolean = false;
  scheduleExistsMsg: string = '';
  selectedSchedule: any;
  maxDate: any;
  gridTitle:string = "";
  enumIsActiveData: EnumList[] = [];
  planId:any;
  useTabletProtrait = false;
  selectedPlanLocEq:any = null;
  @Input() planLocEqId: number = 0;
  @Input() hideBackButton:boolean = false;
  @ViewChild(PpmScheduleTypeComponent) ppmScheduleTypeComponent!: PpmScheduleTypeComponent;
  constructor(
    private enumsrv: EnumService,
    private planScheduleService: PlanScheduleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private bps : BreakpointService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.queryParams.subscribe(params => {
      this.planLocEqId = params.planLocEqId;
      this.gridTitle = params.gridTitle;
      if(params.planId) {
        this.planId = params.planId
      } else {
        this.planId = null;
      }
      
    })
  }

  ngOnInit(): void {
    this.bps.register(this);
    this.loadEnums();
    this.loadRecords(this.planLocEqId);
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.cdr.detectChanges();
    this.showChild ? this.selectedPlanLocEq != null ? this.openEditItem(this.selectedPlanLocEq) : this.onAdd() : this.formTitle = ''; 
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumPlanScheduleData = this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plan_sched'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'type'.toLowerCase());
        this.enumIsActiveData =  this.enumList.map(x => Object.assign({}, x)).filter(t => t.tableName.toLocaleUpperCase() === 'plan_sched'.toLocaleUpperCase() && t.fieldName.toLowerCase() === 'is_active'.toLowerCase());
        this.enumPlanScheduleData.unshift(new EnumList(null, "", "", 'Make a selection',null));
      },
      error => {
        // this.loginError = error.errorDesc;
      }
    );
  }

  getEnumByById(enumKey: any) {
    return enumKey ? this.enumPlanScheduleData.find(t => t.enumKey == enumKey) != null ? this.enumPlanScheduleData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }

  getEnumIsActiveById(enumKey: any) {
    return enumKey ? this.enumIsActiveData.find(t => t.enumKey == enumKey) != null ? this.enumIsActiveData.find(t => t.enumKey == enumKey)?.enumValue : '' : '';
  }


  loadRecords(id: any) {
    this.loading = true;
    this.planScheduleList = [];
    this.planLocEqId = id;
    this.planScheduleService.getPlanScheduleById(id).subscribe((res: any) => {
      if (res.status != 202) {
        this.planScheduleList = res;
      }
      else {
        this.planScheduleList = [];
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }

  openEditItem(data: any) {
    this.selectedPlanLocEq = data;
    this.showChild = false;
    this.displayScheduleExist = false;
    this.showChild = true;
    this.formTitle = `Edit Schedule - ${data.planScheduleId}`;
    this.setFormData(data);
    this.ppmScheduleTypeComponent.isEdit = true;
  }

  onAdd() {
    this.selectedPlanLocEq = null;
    this.showChild = true;
    this.formTitle = "Add Schedule";
    this.ppmScheduleTypeComponent.isEdit = false;
    this.setFormData(null);
  }

  setFormData(ScheduleData: any) {
    let planScheduleList: any[] = this.planScheduleList;
    if (ScheduleData) {
      planScheduleList = this.planScheduleList.filter(t => t.planScheduleId != ScheduleData.planScheduleId)
    }
    let data = {
      planLocEqId: this.planLocEqId,
      planScheduleId: null,
      isEdit: false,
      newRecord: true,
      scheduleData: ScheduleData,
      scheduleDataList: this.planScheduleList
    }
    this.ppmScheduleTypeComponent.data = JSON.parse(JSON.stringify(data));
    this.ppmScheduleTypeComponent.scheduleDataList = planScheduleList;
    this.ppmScheduleTypeComponent.planLocEqId = this.planLocEqId;
    this.ppmScheduleTypeComponent.today = ScheduleData ? new Date(ScheduleData.dateStart) : new Date();
    this.ppmScheduleTypeComponent.isMsgAcptd = false;
    this.ppmScheduleTypeComponent.displaySchedulePreview = false;
    this.ppmScheduleTypeComponent.getScheduleTypesByPlanLocEqId();
  }

  onDelete(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePlanSchedule(id);
      },
      key: "planScheduleList"
    });
  }

  deletePlanSchedule(id: any) {
    this.planScheduleService.deletePlanSchedule(id).subscribe((res: any) => {
      if (res.text === "could not execute statement" && res.code == 409) {
        this.messageService.add({ key: 'scheduleDelete', severity: 'warn', detail: 'The Plan is associated with other records. Please change the Plan before deleting the record.' });
      } else {
        this.messageService.add({ key: 'scheduleSave', severity: 'success', summary: 'Record deleted successfully', detail: 'Record deleted successfully' });
        this.loadRecords(this.planLocEqId);
      }
    },
      error => {

      }
    );

  }

  clickBack() {
    this.router.navigate(["define-schedule"],{ queryParams: {
     planId:this.planId
    }});
  }

  update(event: any) {
    this.showChild = false;
    this.formTitle = "";
    if (event === 'save') {
      this.loadRecords(this.planLocEqId);
      this.messageService.clear();
      this.messageService.add({ key: 'scheduleSave', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
    }
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}
