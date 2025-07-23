import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserUnassignScreensComponent } from './user-unassign-screens.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    UserUnassignScreensComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [UserUnassignScreensComponent]
})
export class UserUnassignScreensModule { }
