import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignSecurityGroupComponent } from './assign-security-group.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    AssignSecurityGroupComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [AssignSecurityGroupComponent]
})
export class AssignSecurityGroupModule { }
