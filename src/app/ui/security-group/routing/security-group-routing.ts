import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SecurityGroupComponent } from '../modal/security-group.component';



const routes: Routes = [
        { path: '', component: SecurityGroupComponent }
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
export class SecurityGroupRoutingModule { }
