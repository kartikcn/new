import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnAssignSecurityGroupComponent } from './un-assign-security-group.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { ConfirmationService } from 'primeng/api';



@NgModule({
  declarations: [
    UnAssignSecurityGroupComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  providers: [ ConfirmationService
  ],
  exports: [UnAssignSecurityGroupComponent]
})
export class UnAssignSecurityGroupModule { }
