import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { AddRoleComponent } from './add-role.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AddEmstdComponent } from './add-emstd.component';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddEmstdComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatCardModule,
    PrimeNGModule,
    DirectiveModule
  ],
  exports:[AddEmstdComponent]
})
export class AddEmStdModule { }
