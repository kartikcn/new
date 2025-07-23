import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelStatusComponent } from './level-status.component';



@NgModule({
  declarations: [LevelStatusComponent],
  exports:[LevelStatusComponent],
  imports: [
    CommonModule
  ]
})
export class LevelStatusModule { }
