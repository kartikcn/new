import { Component, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
///import { Subscription } from 'rxjs/internal/Observable/';
import { UtilConstant } from 'src/common/UtilConstant';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { SideNavService } from './services/side-nav.service';
import { TokenStorageService } from './services/tokenStorage.service';
import { EmployeeService } from './ui/employee/services/employee.service';
import { UserPasswordModalDialogueProvider } from './ui/user-profile/provider/user-change-pwd.provider';
import { UserProfileModalDialogueProvider } from './ui/user-profile/provider/user-profile.provider';
import { EmployeeOutput } from './ui/user/model/employeOutput.model';
import { MatDialogConfig } from '@angular/material/dialog';
//import { Subscription } from 'rxjs/dist/types/internal/Subscription';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isMobile: boolean = false;
  isLogin: boolean = false;
  pageTitle: string = "";
  sideNavItems: any[] = [];
  loggedInUserName: string = "";
  userProfilePic: string = "";
  emPhoto: string = "";
  planName: string = "";
  compName: string = "";
  islimitExceed: boolean = false;
  isLimitInfo: boolean = false;
  plan_exceed_msg = UtilConstant.PLAN_LIMIT_EXHAUSTED_MSG;
  plan_exceed_warning_msg = UtilConstant.PLAN_LIMIT_Warning_MSG;
  openIndex: number = 0;
  title:String = 'fms';
 // private readonly mediaWatcher: Subscription;
  constructor(public media: MediaObserver,
    private tokenService: TokenStorageService,
    private ss: SharedService,
    private sideNavSrv: SideNavService,
    private authSrv: AuthService,
    private userProfileModalDialogueProvider: UserProfileModalDialogueProvider,
    private userPasswordModalDialogueProvider: UserPasswordModalDialogueProvider,
    private cookieSrv: CookieService,
    private emSrv: EmployeeService,
    private router: Router,
  ) {

    // this.mediaWatcher = media.media$.subscribe((change: MediaChange) => {
    //   if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
    //     this.isMobile = true;
    //   }
    //   else {
    //     this.isMobile = false;
    //   }
    // });
    this.emPhoto = "";
  }

  preinit(): void {
    this.buildSideNav();
    this.getEmployeeDetails()
    this.pageTitle = this.cookieSrv.get("pageTitle");
  }

  ngOnInit(): void {
    this.isCollapsed = false;
    this.ss.getEmittedValue().subscribe(item => {
      this.emPhoto = "";
      this.isLogin = item;
      if (this.isLogin) {
        this.preinit();
      }
    });
    if (this.tokenService.getToken()) {
      this.isLogin = true;
      this.preinit();
    } else {
      this.cookieSrv.deleteAll();
      this.isLogin = false;
    }
  }
  getEmployeeDetails() {
    this.emSrv.getEmById(this.authSrv.getLoggedInUserEMId()).subscribe((res: EmployeeOutput) => {
      this.loggedInUserName = res.employeeDetails.firstName + " " + res.employeeDetails.lastName;
      this.emPhoto = res.employeeDetails.emPhotoMobile != null ? res.employeeDetails.emPhotoMobile : "";
      if (this.emPhoto.length > 0)
        this.userProfilePic = "data:image/png;base64," + this.emPhoto;
    });

  }
  buildSideNav(): void {
    let postData = {
      "userRoleId": this.authSrv.getLoggedInUserRole()
    }
    this.sideNavSrv.getSideMenu(postData).subscribe((res: any) => {
      this.sideNavItems = res.menuItems;
      this.sideNavItems.forEach(each => {
        if (each.subProcessItem.length > 0) {
          each.subProcessItem.forEach((ev: any) => ev.sdv = false)
        }
        each.dv = false
        return each;
      })
    })
  }

  openHandler(item: any) {
    for (const i of this.sideNavItems) {
      if (i.title != item.title) {
        i.dv = false;
        if (i.subProcessItem.length > 0) {
          for (let j = 0; j < i.subProcessItem.length; j++) {
            i.subProcessItem[j].sdv = false;
          }
        }
      }
      else {
        i.dv = true;
      }
    }
  }

  setPageTitle(title: any) {
    this.cookieSrv.set("pageTitle", title);
    this.pageTitle = title;
  }

  openUserChangePasswordPanel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      user_name: this.authSrv.getLoggedInUserName(),
      isEdit: true,
      newRecord: false,
    };
    this.userPasswordModalDialogueProvider.openDialog(dialogConfig);
    this.userPasswordModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
    });
  }

  onclickHome() {
    this.setPageTitle("Home");
    this.router.navigateByUrl("/welcome");
  }

  openUserProfilePanel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '550px';
    dialogConfig.data = {
      user_name: this.authSrv.getLoggedInUserId(),
      isEdit: true,
      newRecord: false,
      title: "Profile",
      isProfile: true
    };
    this.userProfileModalDialogueProvider.openDialog(dialogConfig);
    this.userProfileModalDialogueProvider.onDialogueClosed.subscribe((result: any) => {
    });
  }

  openSubMenuHandler(sub: any) {
    this.sideNavItems.forEach(eachItem => {
      if (eachItem.dv) {
        eachItem.subProcessItem.forEach((subItem: any) => {
          if (subItem.title == sub.title) {
            subItem.sdv = true;
          } else {
            subItem.sdv = false;
          }
        })
      }
    })
  }


}
