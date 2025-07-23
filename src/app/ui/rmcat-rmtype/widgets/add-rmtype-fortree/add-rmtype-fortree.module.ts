import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AntDesignModule } from '../../../../material/ant-design.module';

import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddRmtypeFortreeComponent } from './add-rmtype-fortree.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';

@NgModule({
  declarations: [AddRmtypeFortreeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports: [AddRmtypeFortreeComponent]
})
export class AddRmtypeFortreeModule { }
