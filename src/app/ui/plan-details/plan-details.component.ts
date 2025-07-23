import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddEditPlanComponent } from '../ppm-plan/widgets/add-edit-plan/add-edit-plan.component';
import { AddEditPlanStepsComponent } from '../ppm-plan/widgets/add-edit-plan-steps/add-edit-plan-steps/add-edit-plan-steps.component';
import { DocumentsListComponent } from '../documents-list/modal/documents-list.component';
import { PpmPlanService } from '../ppm-plan/services/ppm-plan-services';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { PlanTradeComponent } from '../plan-trade/modal/plan-trade.component';
import { PlanPartComponent } from '../plan-part/modal/plan-part.component';
import { PlanToolComponent } from '../plan-tool/modal/plan-tool.component';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
  providers: [MessageService]
})
export class PlanDetailsComponent implements OnInit {
  //planData: any = { planId: null };
  plnStepData: any[] = [];
  planStepId: any = 0;
  // index: number = 0;
  selectedTab: string = 'Plan';
  docBucketId: number = 0;
  useTabletProtrait = false;
  @Input() hideBackButton:boolean = false;
  @Input()  planData: any = { planId: null };
  @ViewChild(AddEditPlanComponent, { static: false }) addEditPlanComponent!: AddEditPlanComponent;
  @ViewChild(AddEditPlanStepsComponent, { static: false }) addEditPlanStepsComponent!: AddEditPlanStepsComponent;
  @ViewChild(DocumentsListComponent, { static: false }) documentsListComponent!: DocumentsListComponent;
  @ViewChild(PlanTradeComponent, { static: false }) planTradeComponent!: PlanTradeComponent;
  @ViewChild(PlanToolComponent, { static: false }) planToolComponent!: PlanToolComponent;
  @ViewChild(PlanPartComponent, { static: false }) planPartComponent!: PlanPartComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private ppmPlanService: PpmPlanService,
    private messageService: MessageService,
    private authSrv: AuthService,
    private bps : BreakpointService
  ) {

    this.route.queryParams.subscribe(params => {
      if (params.planId != null) {
        this.planData.planId = params.planId;
      } else {
        this.planData.planId = null;
      }
    });
  }

  ngOnInit(): void {
    this.bps.register(this);
  }

  ngAfterViewInit() {
    if (this.planData.planId) {
      this.loadPlanSteps(this.planData.planId);
      this.loadPlanDetails(this.planData.planId);
    }
  }

  notify(): void {
    this.useTabletProtrait = BreakpointService.useTabletProtrait;
    this.refreshAllDetails();
  }

  refreshAllDetails() {
    if (this.addEditPlanComponent) {
      let planDetails = this.addEditPlanComponent.formPPmDetail.controls.planFormPanel.value;
      let stepDetails = this.addEditPlanStepsComponent.formPPmDetail.controls.planStepFormPanel.value;
      setTimeout(() => {
        this.addEditPlanComponent.formPPmDetail.patchValue({ planFormPanel: planDetails });
        this.addEditPlanStepsComponent.formPPmDetail.patchValue({ planFormPanel: stepDetails });
        this.documentsListComponent.data = {
          tableName: 'plan_step',
          fieldName: 'doc_bucket_id',
          pkField: 'plan_step_id',
          docBucketId: this.docBucketId,
          pkValue: this.planStepId
        }
        this.documentsListComponent.loadDocumentsByDocBucketId(this.docBucketId);
        this.planTradeComponent.loadRecords(this.planStepId);
        this.planToolComponent.loadRecords(this.planStepId);
        this.planPartComponent.loadRecords(this.planStepId);
      }, 100);
    }
  }

  loadPlanDetails(planId: any) {
    this.addEditPlanComponent.loadData(planId);
  }

  loadPlanSteps(planId: any) {
    this.plnStepData = [];
    this.planStepId = 0;
    this.ppmPlanService.getAllPlanSteps(planId).subscribe((res: any) => {
      if (res.length) {
        this.plnStepData = res;
        this.planStepId = this.plnStepData[0].planStepId;
        this.docBucketId = this.plnStepData[0].docBucketId;
        this.planTradeComponent.loadRecords(this.planStepId);
        // this.planToolComponent.loadRecords( this.planStepId);
        // this.planPartComponent.loadRecords( this.planStepId);
      }
      else {
        this.plnStepData = [];
        this.planStepId = 0;
      }
    });
  }


  handleChange(event: any) {
    if (event != null) {
      // this.index = event.index;
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Plan":
        this.addEditPlanComponent.loadData(this.planData.planId);
        break;
      case "Step":
        this.addEditPlanStepsComponent.loadData(this.planData.planId, this.planStepId);
        break;
      case "Documents":
        this.documentsListComponent.data = {
          tableName: 'plan_step',
          fieldName: 'doc_bucket_id',
          pkField: 'plan_step_id',
          docBucketId: this.docBucketId,
          pkValue: this.planStepId
        }
        this.documentsListComponent.loadDocumentsByDocBucketId(this.docBucketId);
        break;
      case "Trades":
        this.planTradeComponent.loadRecords(this.planStepId);
        break;
      case "Tools":
        this.planToolComponent.loadRecords(this.planStepId);
        break;
      case "Parts":
        this.planPartComponent.loadRecords(this.planStepId);
        break;
    }
  }

  setDocBucketId(docBucketId: any) {
    this.docBucketId = docBucketId;
  }

  setPlanId(planId: any) {
    this.messageService.clear();
    this.planData.planId = planId;
    this.addEditPlanComponent.loadData(this.planData.planId)
    this.messageService.add({ key: 'planDetails', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
  }

  setPlanStepId(planStep: any) {
    this.messageService.clear();
    this.planStepId = planStep.planStepId;
    this.docBucketId = planStep.docBucketId;
    this.addEditPlanStepsComponent.loadData(this.planData.planId, this.planStepId);
    this.planTradeComponent.loadRecords(this.planStepId);
    this.messageService.add({ key: 'planDetails', severity: 'success', summary: 'Record saved successfully', detail: 'Record saved successfully' });
  }

  clickBack() {
   this.router.navigate(['/define-plan']);
  }

  ngOnDestroy() {
    this.bps.unregister(this);
  }

}
