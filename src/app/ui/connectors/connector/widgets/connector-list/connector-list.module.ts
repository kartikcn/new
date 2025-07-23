import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorListComponent } from './connector-list.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AntDesignModule } from 'src/app/material/ant-design.module';


@NgModule({
  declarations: [
    ConnectorListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    MatTooltipModule
  ],
  exports: [ConnectorListComponent]
})
export class ConnectorListModule { }
