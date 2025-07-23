import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAssignScreensComponent } from './user-assign-screens.component';
import { PrimeNGModule } from 'src/app/material/primemg.module';



@NgModule({
  declarations: [
    UserAssignScreensComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports: [UserAssignScreensComponent]
})
export class UserAssignScreensModule { }
