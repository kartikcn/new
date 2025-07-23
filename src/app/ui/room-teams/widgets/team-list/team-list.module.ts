import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { TeamListComponent } from './team-list.component';



@NgModule({
  declarations: [
    TeamListComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    AntDesignModule
  ],
  exports:[TeamListComponent]
})
export class TeamListModule { }