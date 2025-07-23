import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToolsComponent } from './add-tools.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AddToolsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MaterialModule,
    AntDesignModule,
    DirectiveModule,
    InputNumberModule,
    MatTooltipModule,
    PrimeNGModule
  ],
  exports: [AddToolsComponent]
})
export class AddToolsModule { }
