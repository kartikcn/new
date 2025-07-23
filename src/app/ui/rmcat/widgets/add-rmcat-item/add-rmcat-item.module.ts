import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MaterialModule } from 'src/app/material/material.module';
import { AddRmcatItemComponent } from './add-rmcat-item.component';
import { AntDesignModule } from '../../../../material/ant-design.module';

@NgModule({
  declarations: [AddRmcatItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule
  ],
  exports: [AddRmcatItemComponent]
})
export class AddRmcatItemModule { }
