import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmBoxDialogModule } from 'src/app/confirm-box-dialog/confirm-box-dialog.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaceTeamComponent } from './space-team.component';
import { SpaceTeamRoutingModule } from './routing/space-team.routing';
import { TeamModule } from '../Helpdesk/team/team.module';



@NgModule({
    declarations: [
        SpaceTeamComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ConfirmBoxDialogModule,
        NgSelectModule,
        MaterialModule,
        PrimeNGModule,
        AntDesignModule,
        MatTooltipModule,
        SpaceTeamRoutingModule,
        TeamModule
    ],
    exports: [SpaceTeamComponent],
    providers: []
})
export class SpaceTeamModule { }
