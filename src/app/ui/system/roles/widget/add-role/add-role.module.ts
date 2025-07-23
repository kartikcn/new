import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoleComponent } from './add-role.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddRoleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    PrimeNGModule,
    AntDesignModule,
    DirectiveModule
  ],
  exports:[AddRoleComponent]
})
export class AddRoleModule { }
