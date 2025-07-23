import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AddWorkRequestService } from '../../work-request/service/add-work-request.services';
import { DatePipe } from '@angular/common';
import { EnumService } from 'src/app/services/enum.service';
import { RequestLogComponent } from '../widgets/request-log/modal/request-log.component';
import { WrCommentsComponent } from '../widgets/wr-comments/wr-comments.component';
import { RequestPartsComponent } from '../widgets/request-parts/modal/request-parts.component';
import { RequestToolsComponent } from '../widgets/request-tools/request-tools.component';
import { RequestTechnicianComponent } from '../widgets/request-technician/model/request-technician.component';
import { RequestTechnicianLogComponent } from '../widgets/request-technician-log/modal/request-technician-log.component';
import { RequestOtherCostComponent } from '../widgets/request-other-cost/modal/request-other-cost.component';
import { BudgetAnalysisComponent } from '../../budget-analysis/model/budget-analysis.component';
import { RequestDocumentsComponent } from '../widgets/request-documents/modal/request-documents.component';
import { DocumentsListComponent } from 'src/app/ui/documents-list/modal/documents-list.component';
import { RequestTradesComponent } from '../widgets/request-trades/modal/request-trades.component';
import { EnumList } from 'src/app/model/enum-list.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-work-request-details',
  templateUrl: './work-request-details.component.html',
  styleUrls: ['./work-request-details.component.scss'],
  providers: [MessageService]
})
export class WorkRequestDetailsComponent implements OnInit {
  frmRequestDetail: UntypedFormGroup;
  timeLineEvent!: any[];
  index: number = 0;
  requestId!: number;
  enumList: EnumList[] = [];
  enumClonedList: EnumList[] = [];
  enumWr: EnumList[] = [];
  enumWrStatus: EnumList[] = [];
  logData: any[] = [];
  action!: any
  isReadOnly: boolean = false;
  status: any;
  title: String = "Request Id";
  makeDetailsReadOnly: boolean = false;
  isRequestor: boolean = false;
  isApprover: boolean = false;
  isTechnician: boolean = false;
  isSupervisor: boolean = false;
  selectedTab: String = '';
  afterSavedForm: boolean = true;
  viewDetails: boolean = false;
  isNavigationFromReport: boolean = false;
  hideFilterPanel: boolean = true;
  showRequiredTabs: boolean = true;
  isDetails: boolean = false;
  docBucketId: number = 0;
  isView:boolean = false;

  @ViewChild(RequestLogComponent, { static: false }) requestLogComponent!: RequestLogComponent;
  @ViewChild(WrCommentsComponent, { static: false }) wrCommentsComponent!: WrCommentsComponent;
  @ViewChild(RequestPartsComponent, { static: false }) requestPartsComponent!: RequestPartsComponent;
  @ViewChild(RequestToolsComponent, { static: false }) requestToolsComponent!: RequestToolsComponent;
  @ViewChild(RequestTechnicianComponent, { static: false }) requestTechnicianComponent!: RequestTechnicianComponent;
  @ViewChild(RequestTechnicianLogComponent, { static: false }) requestTechnicianLogComponent!: RequestTechnicianLogComponent;
  @ViewChild(RequestOtherCostComponent, { static: false }) requestOtherCostComponent!: RequestOtherCostComponent;
  @ViewChild(BudgetAnalysisComponent, { static: false }) budgetAnalysisComponent!: BudgetAnalysisComponent;
  @ViewChild(RequestDocumentsComponent, { static: false }) requestDocumentComponent!: RequestDocumentsComponent;
  @ViewChild(DocumentsListComponent, { static: false }) documentsListComponent!: DocumentsListComponent;
  @ViewChild(RequestTradesComponent, { static: false }) requestTradesComponent!: RequestTradesComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private wrSrv: AddWorkRequestService,
    private datePipe: DatePipe,
    private enumsrv: EnumService,
    private authSrv:AuthService,

  ) {
    this.frmRequestDetail = this.formBuilder.group({
      addWrFormPanel: []
    });

    this.route.queryParams.subscribe(params => {
      if (params.requestId != null) {
        this.requestId = parseInt(params.requestId);
        this.index = params.index;
        this.action = params.action;
        this.status = params.status;
        this.viewDetails = params.viewDetails
        this.isNavigationFromReport = params.isNavigationFromReport
      } else {
        this.requestId = 0;
        this.index = 0;

      }
    });
  }

  ngOnInit(): void {
    this.title = this.title + " : " + this.requestId;
    if (this.action === 'details' || this.status === 'Rejected'
      || this.status === 'Completed' || this.status === 'Cancelled'
      || this.status === 'Close') {
      this.isReadOnly = true;
      this.isDetails = true;
    }

    if (this.action === 'afterSavedForm') {
      this.afterSavedForm = true
    } else {
      // this.afterSavedForm = false;
    }
    this.loadEnums();
    this.loadRequestDetails(this.requestId);
  }

  loadRequestDetails(wrId: any) {
    let filterData = {
      siteId: null,
      blId: null,
      flId: null,
      rmId: null,
      eqId: null,
      wrId: wrId,
      status: null,
      problemType: null,
      dateRequestedFrom: null,
      dateRequestedTo: null,
      requestedFor: null,
      technicianId: null,

    }
    this.wrSrv.getAllWrByFilter(filterData).subscribe((res: any) => {
      if (res) {
        if (res[0].status === this.getIdByEnumValue("Requested")) {
          this.showRequiredTabs = true;
          this.isView = false;
        } else {
          this.showRequiredTabs = false;
          this.isView = true;
        }
        this.isRequestor = res[0].isRequestor === "1" ? true : false;
        this.isApprover = res[0].isApprover === "1" ? true : false;
        this.isTechnician = res[0].isTechnician === "1" ? true : false;
        this.isSupervisor = res[0].isSupervisor === "1" ? true : false;
        this.docBucketId = res[0].docBucketId;
        this.makeReadOnly(this.isRequestor, this.isApprover, this.isTechnician, this.isSupervisor);
        setTimeout(() => {
          this.frmRequestDetail.patchValue({
            addWrFormPanel: res[0]
          });
        }, 0);
      }
    })
  }
  makeReadOnly(isRequestor: any, isApprover: any, isTechnician: any, isSupervisor: any,) {
    if ((isApprover || isTechnician) && (!isRequestor && !isSupervisor)) {
      this.makeDetailsReadOnly = true;
    }
  }

  loadEnums() {
    this.enumList = [];
    this.enumsrv.getEnums().subscribe(
      (res: EnumList[]) => {
        this.enumList = res;
        this.enumClonedList = this.enumList.map(x => Object.assign({}, x));
        // this.enumWr = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase());
        this.enumWrStatus = this.enumClonedList.filter(t => t.tableName.toLocaleUpperCase() === 'wr'.toLocaleUpperCase() && t.fieldName.toLocaleUpperCase() === 'status'.toLocaleUpperCase());
        this.getTimeLineById(this.requestId);
      }
    );
  }

  handleChange(event: any) {
    if (event != null) {
      this.index = event.index;
      this.selectedTab = event.originalEvent.target.innerText;
    }
    switch (this.selectedTab) {
      case "Details":
        break;
      case "Technician":
        this.requestTechnicianComponent.requestId = this.requestId;
        this.requestTechnicianComponent.isRequestor = this.isRequestor;
        this.requestTechnicianComponent.isApprover = this.isApprover;
        this.requestTechnicianComponent.isTechnician = this.isTechnician;
        this.requestTechnicianComponent.isSupervisor = this.isSupervisor;
        this.requestTechnicianComponent.loadRecords(this.requestId)
        break;
      case "Tools":
        this.requestToolsComponent.requestId = this.requestId;
        this.requestToolsComponent.isRequestor = this.isRequestor;
        this.requestToolsComponent.isApprover = this.isApprover;
        this.requestToolsComponent.isTechnician = this.isTechnician;
        this.requestToolsComponent.isSupervisor = this.isSupervisor;
        this.requestToolsComponent.loadRecords(this.requestId)
        break;
      case "Work Log":
        this.requestTechnicianLogComponent.requestId = this.requestId;
        this.requestTechnicianLogComponent.isRequestor = this.isRequestor;
        this.requestTechnicianLogComponent.isApprover = this.isApprover;
        this.requestTechnicianLogComponent.isTechnician = this.isTechnician;
        this.requestTechnicianLogComponent.isSupervisor = this.isSupervisor;
        this.requestTechnicianLogComponent.loadRecords(this.requestId);
        break
      case "Parts":
        this.requestPartsComponent.requestId = this.requestId;
        this.requestPartsComponent.isRequestor = this.isRequestor;
        this.requestPartsComponent.isApprover = this.isApprover;
        this.requestPartsComponent.isTechnician = this.isTechnician;
        this.requestPartsComponent.isSupervisor = this.isSupervisor;
        this.requestPartsComponent.loadRecords(this.requestId);
        break;
      case "Comments":
        this.wrCommentsComponent.requestId = this.requestId;
        this.wrCommentsComponent.loadWrComments(this.requestId);
        break;
      case "Other Cost":
        this.requestOtherCostComponent.isRequestor = this.isRequestor;
        this.requestOtherCostComponent.isApprover = this.isApprover;
        this.requestOtherCostComponent.isTechnician = this.isTechnician;
        this.requestOtherCostComponent.isSupervisor = this.isSupervisor;
        this.requestOtherCostComponent.requestId = this.requestId;
        this.requestOtherCostComponent.loadRecords(this.requestId);
        break;
      case "Budget Summary":
        let filterData = {
          "wrId": this.requestId
        }
        this.budgetAnalysisComponent.getRequestBugdet(filterData);
        break;
      case "Request Log":
        this.requestLogComponent.loadRequestLogData(this.requestId);
        break;
      case "Documents":
        this.documentsListComponent.data = {
          tableName: 'wr',
          fieldName: 'doc_bucket_id',
          pkField: 'wr_id',
          docBucketId: this.docBucketId,
          pkValue: this.requestId
        }
        this.documentsListComponent.loadDocumentsByRequestIdAndDocBucketId(this.requestId,this.docBucketId ? this.docBucketId : 0);
        break;
      case "Trades":
        this.requestTradesComponent.requestId = this.requestId;
        this.requestTradesComponent.isRequestor = this.isRequestor;
        this.requestTradesComponent.isApprover = this.isApprover;
        this.requestTradesComponent.isTechnician = this.isTechnician;
        this.requestTradesComponent.isSupervisor = this.isSupervisor;
        this.requestTradesComponent.loadRecords(this.requestId)
        break;

    }
  }

  setEventDetails() {
    this.timeLineEvent = [];
    for (let i = 0; i < this.enumWrStatus.length; i++) {
      var field = this.enumWrStatus[i];
      var date = this.getDateByStatus(field.enumKey);
      var icon = date ? 'pi pi-circle-on' : 'pi pi-circle-off';
      var color = date ? 'green' : '#673AB7';
      var status = field.enumValue
      var event = {
        status: status,
        date: this.datePipe.transform(date, "dd MMM yyyy"),
        icon: icon,
        color: color
      };

      if ((this.status === "On Hold For Access" && status === "On Hold For Access") || (this.status === "On Hold For Parts" && status === "On Hold For Parts")
        || (this.status === "On Hold For Labour" && status === "On Hold For Labour")) {
        this.timeLineEvent.push(event);
        break; // stop the loop here
      }

      else if ((this.status === "In Process" && status === "On Hold For Access") || (this.status === "In Process" && status === "On Hold For Parts")
        || (this.status === "In Process" && status === "On Hold For Labour")) {
        // this.timeLineEvent.push(event);
        // var InProcessData = [...this.timeLineEvent]

      } else if ((status === "Rejected" && date === "")) {

      } else if ((status === "Rejected" && date)) {
        this.timeLineEvent.pop();
        this.timeLineEvent.push(event);
        break;
      }
      else if ((status === "On Hold For Access" && date === "")) {

      }
      else if ((status === "On Hold For Parts" && date === "")) {

      }
      else if ((status === "On Hold For Labour" && date === "")) {

      } else if ((status === "Cancelled" && date === "")) {

      } else if ((status === "Cancelled" && date)) {
        this.timeLineEvent = this.timeLineEvent.filter(t => t.date !== null);
        this.timeLineEvent.push(event);
      } else {
        this.timeLineEvent.push(event);
      }
    }
  }

  getTimeLineById(requestId: any) {
    this.wrSrv.getRequestLogByRequestId(requestId).subscribe((res: any) => {
      this.logData = res;
      this.logData = this.logData.sort((a: any, b: any) => b.requestLogId - a.requestLogId);
      this.setEventDetails();
    })
  }

  getDateByStatus(stat: any) {
    var res = this.logData.find(t => t.status == stat);
    res = res != null && res != 'undefined' ? res.dateChanged : '';
    return res;
  }

  clickBack() {
    const prevUrl = this.authSrv.getPreviousUrl();
    this.authSrv.setPreviousUrl("");
    this.router.navigate([prevUrl]);
  }

  logRequest() {
    this.router.navigate(['/add-work-request'], {
      queryParams: {
        requestId: 0,
      }
    })
  }

  getIdByEnumValue(value: any) {
    return this.enumWrStatus.find((t: any) => t.enumValue.toLocaleUpperCase() === value.toLocaleUpperCase())?.enumKey;
  }

  setDocBucketId(docBucketId: any) {
    this.docBucketId = docBucketId;
  }

  reloadDetails(requestId:any) {
    this.loadRequestDetails(requestId);
    this.getTimeLineById(requestId);
  }

}
