import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { LogoutComponent } from './logout/logout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found/page-not-found.component';
import { DataTablesModule } from 'angular-datatables';
import { MaterialModule } from './material/material.module';
import { ConfirmBoxDialogModule } from './confirm-box-dialog/confirm-box-dialog.module';
import { DataService } from './services/data.service';
import { UserModule } from './ui/user/user.module';
import { MaterialCssVarsModule } from 'angular-material-css-vars';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import { AntDesignModule } from './material/ant-design.module';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import hi from '@angular/common/locales/hi';
import { FormsModule } from '@angular/forms';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SharedService } from './services/shared.service';
// import { SiteModule } from './ui/site/site.module';
import { LocationModule } from './ui/location/location.module';
import { BackLocModule } from './ui/background-loc/background-loc.module';
import { RoomsModule } from './ui/room category/rooms.module';
import { DefineEmpModule } from './ui/employee/define-employee.module';
import { DirectiveModule } from './directive/directive/directive.module';
import { CookieService } from 'ngx-cookie-service';
import { UserProfileModule } from './ui/user-profile/user-profile/user-profile.module';
import { AuthInterceptor } from './helper/auth.interceptor';
import { PasswordResetModule } from './ui/password-reset/password-reset.module';
import { HolidayModule } from './ui/holidays/holidays.module';
import { EmStdModule } from './ui/emstd/emstd.module';
import { ImageCropperComponent, ImageCropperModule } from 'ngx-image-cropper';import { ResourcesModule } from './ui/resources/resources.module';
import { VisitorsModule } from './ui/visitors/visitors.module';
import { RmResourcesModule } from './ui/rm-resources/rm-resources.module';
import { RmConfigModule } from './ui/rm-config/rm-config/rm-config.module';
import { MarkReservModule } from './ui/mark-reserv/mark-reserv.module';
import { MarkHotelModule } from './ui/mark-hotel/mark-hotel.module';
import {MessagesAllModule} from './ui/messages/modal/messages.module';
import { SecurityGroupModule } from './ui/security-group/security-group.module';
import { UserSecurityGroupModule } from './ui/user-security-group/user-security-group.module';
import { UserListModule } from './ui/user-security-group/widgets/user-list/user-list.module';
import { ToolTypeModule } from './ui/Helpdesk/tool-type/tool-type.module';
import { ToolsModule } from './ui/Helpdesk/tools/tools.module';
import { EquipmentModule } from './ui/Helpdesk/equipment/equipment.module';
import { EqStdModule } from './ui/Helpdesk/eq-std/eq-std.module';
import { TeamModule } from './ui/Helpdesk/team/team.module';
import { WorkTeamsModule } from './ui/Helpdesk/work-teams/work-teams.module';
import { ProblemTypeModule } from './ui/Helpdesk/problem-type/problem-type.module';
import { TreeModule } from 'primeng/tree';
import { TradesModule } from './ui/Helpdesk/trades/trades.module';
import { CraftspersonModule } from './ui/Helpdesk/craftsperson/craftsperson.module';
import { BookingReportsModule } from './ui/booking/widgets/booking-reports/booking-reports.module';
import { SlaRequestParametersModule } from './ui/Helpdesk/sla-request-parameters/sla-request-parameters.module';
import { AddEditSlaModule } from './ui/Helpdesk/sla-request-parameters/widgets/add-edit-sla/add-edit-sla.module';
import { CosttypeModule } from './ui/Helpdesk/costtype/costtype.module';
import { PartsModule } from './ui/Helpdesk/parts/parts.module';
import { BookingReportsByMonthModule } from './ui/booking/widgets/booking-reports-by-month/booking-reports-by-month.module';
import { WorkRequestModule } from './ui/Helpdesk/work-request/work-request.module';
import { WorkRequestDetailsModule } from './ui/Helpdesk/work-request-details/work-request-details.module';
import { RequestTechnicianModule } from './ui/Helpdesk/work-request-details/widgets/request-technician/request-technician.module';
import { RequestToolsModule } from './ui/Helpdesk/work-request-details/widgets/request-tools/request-tools.module';
import { DivisionDepartmentModule } from './ui/division-department/division-department.module';
import { RmCatRmTypeModule } from './ui/rmcat-rmtype/rmcat-rmtype.module';

import { HelpDeskProblemDescriptionModule } from './ui/Helpdesk/help-desk-problem-description/help-desk-problem-description.module';
import { SlaEscalatedSummaryReportsModule } from './ui/Helpdesk/facilities-helpdesk-reports/sla-escalated-summary-reports/sla-escalated-summary-reports.module';
import { WorkRequestReportsModule } from './ui/Helpdesk/requests-by-asset-reports/work-request-reports.module';
import { RoomTeamsModule } from './ui/room-teams/room-teams.module';
import { DivDeptSvgModule } from './ui/div-dept-svg/div-dept-svg.module';
import { RmcatRmtypeSvgModule } from './ui/rmcat-rmtype-svg/rmcat-rmtype-svg.module';
import { HightlightRoomsModule } from './ui/highlight-rooms/highlight-rooms.module';
import { SummeryRequestReportsModule } from './ui/Helpdesk/summery-request-report/summery-request-reports.module';
import { PartsUsageAnalysisModule } from './ui/Helpdesk/parts-usage-analysis/parts-usage-analysis.module';
import { TechnicianTimeUsageAnalysisModule } from './ui/Helpdesk/technician-time-usage-analysis/technician-time-usage-analysis.module';
import { SlaEscalationAnalysisModule } from './ui/Helpdesk/sla-escalation-analysis/sla-escalation-analysis.module';
import { BudgetAnalysisModule } from './ui/Helpdesk/budget-analysis/budget-analysis.module';
import { TechnicianDashboardModule } from './ui/facilities-helpdesk-dashboards/technician-dashboard/technician-dashboard.module';
import { SupervisorDashboardModule } from './ui/facilities-helpdesk-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import { FinancialYearModule } from './ui/financial-year/financial-year.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PpmPlanModule } from './ui/ppm-plan/ppm-plan.module';
import { PlanDetailsModule } from './ui/plan-details/plan-details.module';
import { LinkPlanToLocationModule } from './ui/link-plan-to-location/link-plan-to-location.module';
import { LinkPlanToAssetModule } from './ui/link-plan-to-asset/link-plan-to-asset.module';
import { PpmScheduleModule } from './ui/ppm-schedule/ppm-schedule.module';
import { TermsModule } from './ui/terms/terms.module';
import { SpaceTeamModule } from './ui/space-team/space-team.module';
import { EmpTeamsModule } from './ui/emp-teams/emp-teams.module';
import { AllocateDivDepRoomModule } from './ui/allocate-div-dep-room/allocate-div-dept-room.module';
import { AllocateEmpRoomModule } from './ui/allocate-emp-room/allocate-emp-room.module';
import { HighlightByDivisionModule } from './ui/highlight-by-division/highlight-by-division.module';
import { HighlightByDepartmentModule } from './ui/highlight-by-department/highlight-by-department.module';
import { HighlightByRmCatModule } from './ui/highlight-by-rmcat/highlight-by-rmcat.module';
import { HighlightByRmTypeModule } from './ui/highlight-by-rmtype/highlight-by-rmtype.module';
import { ViewCommonAreaModule } from './ui/view-common-area/view-common-area.module';
import { ViewRoomReportModule } from './ui/view-room-report/view-room-report.module';
import { ViewEmployeeReportModule } from './ui/view-employee-report/view-employee-report.module';
import { LocateEmployeeModule } from './ui/locate-employee/locate-employee.module';
import { LocateRoomModule } from './ui/locate-room/locate-room.module';
import { LocateAssetModule } from './ui/locate-asset/locate-asset.module';
import { AllocationReportByBlFlModule } from './ui/allocation-report-by-bl-fl/allocation-report-by-bl-fl.module';
import { AllocationReportByDivDepModule } from './ui/allocation-report-by-div-dep/allocation-report-by-div-dep.module';
import { SpaceAllocationStatisticsModule } from './ui/space-allocation-statistics/space-allocation-statistics.module';
import { GenerateRequestsModule } from './ui/generate-requests/generate-requests.module';
import { SpaceDashboardModule } from './ui/space-dashboard/space-dashboard.module';
import { EnvServiceProvider } from './env.service.provider';
import { ItemListModule } from './ui/Inventory/item-list/item-list.module';
import { BudgetTermsModule } from './ui/Inventory/budget-terms-list/budget-terms.module';
import { CenterBudgetModule } from './ui/Inventory/center-budget-list/center-budget.module';
import { CenterUsageModule } from './ui/Inventory/center-usage/center-usage.module';
import { CenterBudgetTermReportModule } from './ui/Inventory/report/center-budget-term-reports/center-budget-term-report.module';


registerLocaleData(hi);

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    PageNotFoundComponent,
   
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    PasswordResetModule,
    ConfirmBoxDialogModule,
    HttpClientModule,
    NgbModule,
   MaterialModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      closeButton: true,
      positionClass: "toast-top-right",
      preventDuplicates: false
    }),
    NgxSpinnerModule,
    NgSelectModule,
    DataTablesModule,
     MaterialCssVarsModule.forRoot({
       isAutoContrast: true,
       darkThemeClass: 'isDarkTheme',
       lightThemeClass: 'isLightTheme'
     }),
    AntDesignModule,
    FormsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    DirectiveModule,
    ImageCropperModule,
    MessagesAllModule,
    MatTooltipModule,
    NgxChartsModule ,
    ItemListModule,
    BudgetTermsModule,
    CenterBudgetModule,
    CenterUsageModule,
    CenterBudgetTermReportModule
   ],
  providers: [EnvServiceProvider,DatePipe,
    CookieService,CurrencyPipe,
    { provide: DataService, useClass: DataService },
    { provide: SharedService, useClass: SharedService},
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  exports: [
    NgxSpinnerModule,
  ],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
