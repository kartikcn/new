import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SpaceDashboardComponent } from './space-dashboard.component';
import { SpaceDashboardRoutingModule } from './routing/space-dashboard.routing';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SpaceAllocationStatisticsByBlFlModule } from '../space-allocation-statistics-by-bl-fl/space-allocation-statistics-by-bl-fl.module';
import { SpaceAllocationStatisticsByDivDepModule } from '../space-allocation-statistics-by-div-dep/space-allocation-statistics-by-div-dep.module';


@NgModule({
  declarations: [
    SpaceDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ConfirmBoxDialogModule,
    NgSelectModule,
    NgxSpinnerModule,
    RadioButtonModule,
    MatTooltipModule,
    NgxChartsModule,
    SpaceDashboardRoutingModule,
    SelectButtonModule,
    SpaceAllocationStatisticsByBlFlModule,
    SpaceAllocationStatisticsByDivDepModule
  ],
  exports: [SpaceDashboardComponent]
})
export class SpaceDashboardModule { }