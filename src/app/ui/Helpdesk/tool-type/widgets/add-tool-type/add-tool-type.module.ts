import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToolTypeComponent } from './add-tool-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    AddToolTypeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    DirectiveModule,
  ],
  exports: [AddToolTypeComponent]
})
export class AddToolTypeModule { }
