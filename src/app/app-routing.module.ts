import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogoutComponent } from "./logout/logout.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found/page-not-found.component";
import { UserComponent } from "./ui/user/modal/user.component";
import { LocationComponent } from "./ui/location/modal/location.component";
import { LogintrythatComponent } from "./logintrythat/logintrythat.component";
import { BackgroundLocComponent } from "./ui/background-loc/modal/background-loc.component";
import { RommsComponent } from "./ui/room category/modal/romms.component";
import { DefineEmployeeComponent } from "./ui/employee/modal/define-employee.component";
import { AuthGuard } from "./helper/auth.guard";
import { PasswordResetComponent } from "./ui/password-reset/password-reset.component";
const routes: Routes = [
  {
    path: "welcome",
    loadChildren: () =>
      import("./pages/welcome/welcome.module").then((m) => m.WelcomeModule),
    canActivate: [AuthGuard],
  },
  { path: "user", component: UserComponent, canActivate: [AuthGuard] },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "logintrythat",
    component: LogintrythatComponent,
    pathMatch: "full",
  },
  {
    path: "roles",
    loadChildren: () =>
      import("./ui//system/roles/role.module").then((m) => m.RoleModule),
  },
  {
    path: "user-procs",
    loadChildren: () =>
      import("./ui/system/user-procs/modal/user-procs.module").then(
        (m) => m.UserProcsModule
      ),
    canActivate: [AuthGuard],
  },
  { path: "geo-loc", component: LocationComponent, canActivate: [AuthGuard] },
  {
    path: "back-loc",
    component: BackgroundLocComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "password-reset",
    component: PasswordResetComponent,
    pathMatch: "full",
  },
  { path: "room-cat", component: RommsComponent, canActivate: [AuthGuard] },
  {
    path: "define-employee",
    component: DefineEmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "holidays",
    loadChildren: () =>
      import("../app/ui/holidays/holidays.module").then((m) => m.HolidayModule),
    canActivate: [AuthGuard],
  },
  { path: "logout", component: LogoutComponent },
  {
    path: "emstd",
    loadChildren: () =>
      import("../app/ui/emstd/emstd.module").then((m) => m.EmStdModule),
    canActivate: [AuthGuard],
  },
  {
    path: "resources",
    loadChildren: () =>
      import("../app/ui/resources/resources.module").then(
        (m) => m.ResourcesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "visitors",
    loadChildren: () =>
      import("../app/ui/visitors/visitors.module").then(
        (m) => m.VisitorsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "rm-resources",
    loadChildren: () =>
      import("../app/ui/rm-resources/rm-resources.module").then(
        (m) => m.RmResourcesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "rm-config",
    loadChildren: () =>
      import("../app/ui/rm-config/rm-config/rm-config.module").then(
        (m) => m.RmConfigModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "app-params",
    loadChildren: () =>
      import("../app/ui/app-params/app-params.module").then(
        (m) => m.AppParamsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "mark-reserv",
    loadChildren: () =>
      import("../app/ui/mark-reserv/mark-reserv.module").then(
        (m) => m.MarkReservModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "mark-hotel",
    loadChildren: () =>
      import("../app/ui/mark-hotel/mark-hotel.module").then(
        (m) => m.MarkHotelModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "messages",
    loadChildren: () =>
      import("../app/ui/messages/modal/messages.module").then(
        (m) => m.MessagesAllModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "booking",
    loadChildren: () =>
      import("../app/ui/booking/booking.module").then((m) => m.BookingModule),
    canActivate: [AuthGuard],
  },
  {
    path: "arrangement",
    loadChildren: () =>
      import("../app/ui/arrangement/modal/arrangement.module").then(
        (m) => m.ArrangementAllModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "edit-booking",
    loadChildren: () =>
      import("../app/ui/edit-booking/edit-booking.module").then(
        (m) => m.EditBookingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "approve-booking",
    loadChildren: () =>
      import("../app/ui/approve-booking/approve-booking.module").then(
        (m) => m.ApproveBookingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "check-booking",
    loadChildren: () =>
      import("../app/ui/check-booking/check-booking.module").then(
        (m) => m.CheckBookingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "link-room-svg",
    loadChildren: () =>
      import("../app/ui/link-room-svg/link-room-svg.module").then(
        (m) => m.LinkRoomSvgModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "security-group",
    loadChildren: () =>
      import("../app/ui/security-group/security-group.module").then(
        (m) => m.SecurityGroupModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "user-security-group",
    loadChildren: () =>
      import("../app/ui/user-security-group/user-security-group.module").then(
        (m) => m.UserSecurityGroupModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "room-employee-svg",
    loadChildren: () =>
      import("../app/ui/room-employee-svg/room-employee-svg.module").then(
        (m) => m.RoomEmployeeSvgModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "floorplan-arrangement-svg",
    loadChildren: () =>
      import(
        "../app/ui/floorplan-arrangement-svg/floorplan-arrangement-svg.module"
      ).then((m) => m.FloorplanArrangementSvgModule),
    canActivate: [AuthGuard],
  },
  {
    path: "tool-type",
    loadChildren: () =>
      import("../app/ui/Helpdesk/tool-type/tool-type.module").then(
        (m) => m.ToolTypeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "tools",
    loadChildren: () =>
      import("../app/ui/Helpdesk/tools/tools.module").then(
        (m) => m.ToolsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "asset",
    loadChildren: () =>
      import("../app/ui/Helpdesk/equipment/equipment.module").then(
        (m) => m.EquipmentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "aststd",
    loadChildren: () =>
      import("../app/ui/Helpdesk/eq-std/eq-std.module").then(
        (m) => m.EqStdModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "team",
    loadChildren: () =>
      import("../app/ui/Helpdesk/team/team.module").then((m) => m.TeamModule),
    canActivate: [AuthGuard],
  },
  {
    path: "work-teams",
    loadChildren: () =>
      import("../app/ui/Helpdesk/work-teams/work-teams.module").then(
        (m) => m.WorkTeamsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "problem-type",
    loadChildren: () =>
      import("../app/ui/Helpdesk/problem-type/problem-type.module").then(
        (m) => m.ProblemTypeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "trades",
    loadChildren: () =>
      import("../app/ui/Helpdesk/trades/trades.module").then(
        (m) => m.TradesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "technician",
    loadChildren: () =>
      import("./ui/Helpdesk/craftsperson/craftsperson.module").then(
        (m) => m.CraftspersonModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "add-work-request",
    loadChildren: () =>
      import("./ui/Helpdesk/work-request/work-request.module").then(
        (m) => m.WorkRequestModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "booking-reports",
    loadChildren: () =>
      import(
        "./ui/booking/widgets/booking-reports/booking-reports.module"
      ).then((m) => m.BookingReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "define-sla",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/sla-request-parameters/sla-request-parameters.module"
      ).then((m) => m.SlaRequestParametersModule),
    canActivate: [AuthGuard],
  },
  {
    path: "add-edit-sla",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/sla-request-parameters/widgets/add-edit-sla/add-edit-sla.module"
      ).then((m) => m.AddEditSlaModule),
    canActivate: [AuthGuard],
  },
  {
    path: "cost-type",
    loadChildren: () =>
      import("./ui/Helpdesk/costtype/costtype.module").then(
        (m) => m.CosttypeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "parts",
    loadChildren: () =>
      import("./ui/Helpdesk/parts/parts.module").then((m) => m.PartsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "booking-reports-by-month",
    loadChildren: () =>
      import(
        "./ui/booking/widgets/booking-reports-by-month/booking-reports-by-month.module"
      ).then((m) => m.BookingReportsByMonthModule),
    canActivate: [AuthGuard],
  },
  {
    path: "view-edit-work-request",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/work-request/view-edit-work-request/view-edit-work-request.module"
      ).then((m) => m.ViewEditWorkRequestModule),
    canActivate: [AuthGuard],
  },
  {
    path: "work-request-details",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/work-request-details/work-request-details.module"
      ).then((m) => m.WorkRequestDetailsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "division-department",
    loadChildren: () =>
      import("./ui/division-department/division-department.module").then(
        (m) => m.DivisionDepartmentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "emp-teams",
    loadChildren: () =>
      import("./ui/emp-teams/emp-teams.module").then((m) => m.EmpTeamsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "rmcat-rmtype",
    loadChildren: () =>
      import("./ui/rmcat-rmtype/rmcat-rmtype.module").then(
        (m) => m.RmCatRmTypeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "locate-room",
    loadChildren: () =>
      import("./ui/locate-room/locate-room.module").then(
        (m) => m.LocateRoomModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "locate-employee",
    loadChildren: () =>
      import("./ui/locate-employee/locate-employee.module").then(
        (m) => m.LocateEmployeeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "rmcat-rmtype-svg",
    loadChildren: () =>
      import("./ui/rmcat-rmtype-svg/rmcat-rmtype-svg.module").then(
        (m) => m.RmcatRmtypeSvgModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "div-dept-svg",
    loadChildren: () =>
      import("./ui/div-dept-svg/div-dept-svg.module").then(
        (m) => m.DivDeptSvgModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "problem-description",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/help-desk-problem-description/help-desk-problem-description.module"
      ).then((m) => m.HelpDeskProblemDescriptionModule),
    canActivate: [AuthGuard],
  },
  {
    path: "escalated-summary-reports",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/facilities-helpdesk-reports/sla-escalated-summary-reports/sla-escalated-summary-reports.module"
      ).then((m) => m.SlaEscalatedSummaryReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "request-summary-reports",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/summery-request-report/summery-request-reports.module"
      ).then((m) => m.SummeryRequestReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "request-by-asset-reports",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/requests-by-asset-reports/work-request-reports.module"
      ).then((m) => m.WorkRequestReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "parts-usage-analysis",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/parts-usage-analysis/parts-usage-analysis.module"
      ).then((m) => m.PartsUsageAnalysisModule),
    canActivate: [AuthGuard],
  },
  {
    path: "room-teams",
    loadChildren: () =>
      import("./ui/room-teams/room-teams.module").then(
        (m) => m.RoomTeamsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-rooms",
    loadChildren: () =>
      import("./ui/highlight-rooms/highlight-rooms.module").then(
        (m) => m.HightlightRoomsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "technician-time-usage-analysis",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/technician-time-usage-analysis/technician-time-usage-analysis.module"
      ).then((m) => m.TechnicianTimeUsageAnalysisModule),
    canActivate: [AuthGuard],
  },
  {
    path: "sla-escaltion-analysis",
    loadChildren: () =>
      import(
        "./ui/Helpdesk/sla-escalation-analysis/sla-escalation-analysis.module"
      ).then((m) => m.SlaEscalationAnalysisModule),
    canActivate: [AuthGuard],
  },
  {
    path: "budget-analysis",
    loadChildren: () =>
      import("./ui/Helpdesk/budget-analysis/budget-analysis.module").then(
        (m) => m.BudgetAnalysisModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "technician-dashboard",
    loadChildren: () =>
      import(
        "./ui/facilities-helpdesk-dashboards/technician-dashboard/technician-dashboard.module"
      ).then((m) => m.TechnicianDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-by-department",
    loadChildren: () =>
      import(
        "./ui/highlight-by-department/highlight-by-department.module"
      ).then((m) => m.HighlightByDepartmentModule),
    canActivate: [AuthGuard],
  },
  {
    path: "supervisor-dashboard",
    loadChildren: () =>
      import(
        "./ui/facilities-helpdesk-dashboards/supervisor-dashboard/supervisor-dashboard.module"
      ).then((m) => m.SupervisorDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: "financial-year",
    loadChildren: () =>
      import("./ui/financial-year/financial-year.module").then(
        (m) => m.FinancialYearModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-by-division",
    loadChildren: () =>
      import("./ui/highlight-by-division/highlight-by-division.module").then(
        (m) => m.HighlightByDivisionModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-by-rmcat",
    loadChildren: () =>
      import("./ui/highlight-by-rmcat/highlight-by-rmcat.module").then(
        (m) => m.HighlightByRmCatModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-by-rmtype",
    loadChildren: () =>
      import("./ui/highlight-by-rmtype/highlight-by-rmtype.module").then(
        (m) => m.HighlightByRmTypeModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "view-employee-report",
    loadChildren: () =>
      import("./ui/view-employee-report/view-employee-report.module").then(
        (m) => m.ViewEmployeeReportModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "view-room-report",
    loadChildren: () =>
      import("./ui/view-room-report/view-room-report.module").then(
        (m) => m.ViewRoomReportModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "locate-asset",
    loadChildren: () =>
      import("./ui/locate-asset/locate-asset.module").then(
        (m) => m.LocateAssetModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "view-common-area",
    loadChildren: () =>
      import("./ui/view-common-area/view-common-area.module").then(
        (m) => m.ViewCommonAreaModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "view-occupancy-statistics",
    loadChildren: () =>
      import(
        "./ui/view-occupancy-statistics/view-occupancy-statistics.module"
      ).then((m) => m.ViewOccupancyStatisticsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "assign-employee-room",
    loadChildren: () =>
      import("./ui/assign-employee-room/assign-employee-room.module").then(
        (m) => m.AssignEmployeeRoomModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "allocate-div-dep-room",
    loadChildren: () =>
      import("./ui/allocate-div-dep-room/allocate-div-dept-room.module").then(
        (m) => m.AllocateDivDepRoomModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "allocate-emp-room",
    loadChildren: () =>
      import("./ui/allocate-emp-room/allocate-emp-room.module").then(
        (m) => m.AllocateEmpRoomModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "terms",
    loadChildren: () =>
      import("./ui/terms/terms.module").then((m) => m.TermsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "space-team",
    loadChildren: () =>
      import("./ui/space-team/space-team.module").then(
        (m) => m.SpaceTeamModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "define-plan",
    loadChildren: () =>
      import("./ui/ppm-plan/ppm-plan.module").then((m) => m.PpmPlanModule),
    canActivate: [AuthGuard],
  },
  {
    path: "plan-details",
    loadChildren: () =>
      import("./ui/plan-details/plan-details.module").then(
        (m) => m.PlanDetailsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "link-plan-to-location",
    loadChildren: () =>
      import("./ui/link-plan-to-location/link-plan-to-location.module").then(
        (m) => m.LinkPlanToLocationModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "link-plan-to-asset",
    loadChildren: () =>
      import("./ui/link-plan-to-asset/link-plan-to-asset.module").then(
        (m) => m.LinkPlanToAssetModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-schedule",
    loadChildren: () =>
      import("./ui/ppm-schedule/ppm-schedule.module").then(
        (m) => m.PpmScheduleModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "allocation-report-by-bl-fl",
    loadChildren: () =>
      import(
        "./ui/allocation-report-by-bl-fl/allocation-report-by-bl-fl.module"
      ).then((m) => m.AllocationReportByBlFlModule),
    canActivate: [AuthGuard],
  },
  {
    path: "define-schedule",
    loadChildren: () =>
      import("./ui/ppm-schedule/ppm-schedule.module").then(
        (m) => m.PpmScheduleModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "schedule-details",
    loadChildren: () =>
      import(
        "./ui/ppm-schedule/widgets/ppm-schedule-type-list/ppm-schedule-type-list.module"
      ).then((m) => m.PpmScheduleTypeListModule),
    canActivate: [AuthGuard],
  },
  {
    path: "generate-requests",
    loadChildren: () =>
      import("./ui/generate-requests/generate-requests.module").then(
        (m) => m.GenerateRequestsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "show-requests",
    loadChildren: () =>
      import(
        "./ui/generate-requests/widgets/show-rquest-details/show-rquest-details.module"
      ).then((m) => m.ShowRquestDetailsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "space-allocation-statistics",
    loadChildren: () =>
      import(
        "./ui/space-allocation-statistics/space-allocation-statistics.module"
      ).then((m) => m.SpaceAllocationStatisticsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "link-assets-to-plan",
    loadChildren: () =>
      import("./ui/link-assets-to-plan/link-assets-to-plan.module").then(
        (m) => m.LinkAssetsToPlanModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "allocation-report-by-div-dep",
    loadChildren: () =>
      import(
        "./ui/allocation-report-by-div-dep/allocation-report-by-div-dep.module"
      ).then((m) => m.AllocationReportByDivDepModule),
    canActivate: [AuthGuard],
  },
  {
    path: "space-allocation-statistics-by-bl-fl",
    loadChildren: () =>
      import(
        "./ui/space-allocation-statistics-by-bl-fl/space-allocation-statistics-by-bl-fl.module"
      ).then((m) => m.SpaceAllocationStatisticsByBlFlModule),
    canActivate: [AuthGuard],
  },
  {
    path: "space-allocation-statistics-by-div-dep",
    loadChildren: () =>
      import(
        "./ui/space-allocation-statistics-by-div-dep/space-allocation-statistics-by-div-dep.module"
      ).then((m) => m.SpaceAllocationStatisticsByDivDepModule),
    canActivate: [AuthGuard],
  },
  {
    path: "pm-planner",
    loadChildren: () =>
      import("./ui/pm-planner/pm-planner.module").then(
        (m) => m.PmPlannerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forecast-details",
    loadChildren: () =>
      import("./ui/forecast-details/forecast-details.module").then(
        (m) => m.ForecastDetailsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "forecast",
    loadChildren: () =>
      import("./ui/forecast-reports/forecast-reports.module").then(
        (m) => m.ForecastReportsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "space-dashboard",
    loadChildren: () =>
      import("./ui/space-dashboard/space-dashboard.module").then(
        (m) => m.SpaceDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-request-console",
    loadChildren: () =>
      import("./ui/ppm-requests-console/ppm-requests-console.module").then(
        (m) => m.PpmRequestsConsoleModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-request-summary-reports",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/summary-request-reports-ppm/summary-request-reports-ppm.module"
      ).then((m) => m.SummaryRequestReportsPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-escalated-summary-reports",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/sla-escalation-summary-reports-ppm/sla-escalation-summary-reports-ppm.module"
      ).then((m) => m.SlaEscalationSummaryReportsPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-parts-usage-analysis",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/part-usage-analysis-ppm/part-usage-analysis-ppm.module"
      ).then((m) => m.PartUsageAnalysisPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-sla-escaltion-analysis",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/sla-escalation-analysis-ppm/sla-escalation-analysis-ppm.module"
      ).then((m) => m.SlaEscalationAnalysisPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-technician-time-usage-analysis",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/technician-time-usage-analysis-ppm/technician-time-usage-analysis-ppm.module"
      ).then((m) => m.TechnicianTimeUsageAnalysisPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "ppm-budget-analysis",
    loadChildren: () =>
      import(
        "./ui/PPM-Reports/budget-analysis-ppm/budget-analysis-ppm.module"
      ).then((m) => m.BudgetAnalysisPpmModule),
    canActivate: [AuthGuard],
  },
  {
    path: "highlight-by-sub-department",
    loadChildren: () =>
      import(
        "./ui/highlight-by-sub-department/highlight-by-sub-department.module"
      ).then((m) => m.HighlightBySubDepartmentModule),
    canActivate: [AuthGuard],
  },
  {
    path: "allocation-report-by-sub-dep",
    loadChildren: () =>
      import(
        "./ui/allocation-report-by-sub-dep/allocation-report-by-sub-dep.module"
      ).then((m) => m.AllocationReportBySubDepModule),
    canActivate: [AuthGuard],
  },
  {
    path: "connector",
    loadChildren: () =>
      import("./ui/connectors/connector/connector.module").then(
        (m) => m.ConnectorModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "asset-classification",
    loadChildren: () =>
      import(
        "./ui/Asset-Management/asset-classification/asset-classification.module"
      ).then((m) => m.AssetClassificationModule),
    canActivate: [AuthGuard],
  },
  {
    path: "asset-details",
    loadChildren: () =>
      import("./ui/Helpdesk/equipment/asset-details/asset-details.module").then(
        (m) => m.AssetDetailsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "item-list",
    loadChildren: () =>
      import("./ui/Inventory/item-list/item-list.module").then(
        (m) => m.ItemListModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "budget-term",
    loadChildren: () =>
      import("./ui/Inventory/budget-terms-list/budget-terms.module").then(
        (m) => m.BudgetTermsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "center-budget",
    loadChildren: () =>
      import("./ui/Inventory/center-budget-list/center-budget.module").then(
        (m) => m.CenterBudgetModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "center-usage",
    loadChildren: () =>
      import("./ui/Inventory/center-usage/center-usage.module").then(
        (m) => m.CenterUsageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "inventory-report",
    loadChildren: () =>
      import(
        "./ui/Inventory/report/center-budget-term-reports/center-budget-term-report.module"
      ).then((m) => m.CenterBudgetTermReportModule),
    canActivate: [AuthGuard],
  },

  { path: "**", component: PageNotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
