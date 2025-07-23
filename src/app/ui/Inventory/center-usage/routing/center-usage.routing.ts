import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CenterUsageListComponent } from '../center-usage-list/center-usage-list.component';



const routes: Routes = [
    { path: '', component: CenterUsageListComponent }
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
export class CenterUsageRoutingModule{ 


}
