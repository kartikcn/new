import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SupervisorDashboardModule } from 'src/app/ui/facilities-helpdesk-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { SpaceDashboardModule } from 'src/app/ui/space-dashboard/space-dashboard.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    WelcomeRoutingModule,
    PrimeNGModule,
    NgxSpinnerModule,
    SupervisorDashboardModule,
    AntDesignModule,
    SpaceDashboardModule
  ],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent]
})
export class WelcomeModule { }
