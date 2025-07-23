import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SpaceTeamComponent } from '../space-team.component';

const routes: Routes = [
        { path: '', component: SpaceTeamComponent }
];

@NgModule({
        imports: [
                CommonModule,
                RouterModule.forChild(routes)
        ],
        exports: [
                RouterModule
        ],
        declarations: []
})
export class SpaceTeamRoutingModule { }
