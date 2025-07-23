import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { Home } from './model/Home.model';
import { WelcomeService } from './services/welcome.service';
import { SupervisorDashboardComponent } from 'src/app/ui/facilities-helpdesk-dashboards/supervisor-dashboard/modal/supervisor-dashboard.component';
import { AppParamsService } from 'src/app/ui/app-params/services/app-params.service';
import { UtilConstant } from 'src/common/UtilConstant';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  title: string = "Welcome";
  intervalId: any;
  autoRefreshTime: any = 60;
  homeDashboard: Home = new Home();
  showEmptyPage: boolean = true;
  isFacilitiesDeskTabActive = true;
  isSpaceTabActive = false;
  isHelpdeskTabActive = false;
  isOrderTabActive = false;
  isAccountTabActive = false;
  @ViewChild(SupervisorDashboardComponent, { static: false }) supervisorDashboardComponent!: SupervisorDashboardComponent;
  constructor(private ss: SharedService,
    private authService: AuthService,
    private welcomeSrv: WelcomeService,
    private spinner: NgxSpinnerService,
    private appParamsServ: AppParamsService,) { }

  ngOnInit() {
    setTimeout(() => {
      this.ss.change(this.authService.isLoggedIn());
    });
    this.spinner.show();
    const filter = {
      "userName": this.authService.getLoggedInUserId(),
      "userRole": this.authService.getLoggedInUserRole()
    }
    this.welcomeSrv.getUserDashboard(filter).subscribe((res: Home) => {
      this.homeDashboard = res;
      const isAnyKeyGreaterThanOne = Object.values(this.homeDashboard).some(value => value > 0);
      isAnyKeyGreaterThanOne ? this.showEmptyPage = false : this.showEmptyPage = true;
      this.spinner.hide();
    }, error => {
      this.homeDashboard = new Home();
      this.spinner.hide();
    })
    this.getDashBoardAutoRefreshTimeInterval();
  }

  getDashBoardAutoRefreshTimeInterval() {
    const paramId = UtilConstant.DASHBOARD_AUTO_REFRESH_TIME_INTERVAL;
    this.appParamsServ.getAppParamByCode(paramId).subscribe((res: any) => {
      this.autoRefreshTime = res.paramValue;
      // clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        // Call a function to perform the rendering logic here
        this.supervisorDashboardComponent.loadWrRecords();
      }, this.autoRefreshTime * 60 * 1000);
    })
  }

  onTabChange(event: any): void {
    
    // Activate the selected tab
    switch (event.index) {
      case 0:
        this.isFacilitiesDeskTabActive = true;
        break;
      case 1:
        this.isSpaceTabActive = true;
        break;
      case 2:
        this.isHelpdeskTabActive = true;
        break;
      case 3:
        this.isOrderTabActive = true;
        break;
      case 4:
        this.isAccountTabActive = true;
        break;
      // Add cases for other tabs

      default:
        break;
    }
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
