import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpDeskProblemDescriptionComponent } from './modal/help-desk-problem-description.component';
import { HelpDeskProblemDescriptionRoutingModule } from './routing/help-desk-problem-description.routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditProblemDescriptionModule } from './widgets/add-edit-problem-description/add-edit-problem-description.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
  declarations: [
    HelpDeskProblemDescriptionComponent
  ],
  imports: [
    CommonModule,
    HelpDeskProblemDescriptionRoutingModule,
    PrimeNGModule,
    AddEditProblemDescriptionModule,
    MatTooltipModule,
    PaginatorModule
  ]
})
export class HelpDeskProblemDescriptionModule { }
