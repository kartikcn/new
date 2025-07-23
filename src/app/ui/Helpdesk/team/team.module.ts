import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './modal/team.component';
import { TeamRoutingModule } from './routing/team.routing';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AddEditTeamModule } from './widgets/add-edit-team/add-edit-team.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatorModule } from 'primeng/paginator';



@NgModule({
    declarations: [
        TeamComponent
    ],
    imports: [
        CommonModule,
        TeamRoutingModule,
        PrimeNGModule,
        AddEditTeamModule,
        MatTooltipModule,
        PaginatorModule
    ],
    exports: [TeamComponent],
    providers: []
})
export class TeamModule { }
