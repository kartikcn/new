import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTeamComponent } from './add-team.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [
    AddTeamComponent
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
    DirectiveModule
  ],
  exports: [AddTeamComponent]
})
export class AddTeamModule { }
