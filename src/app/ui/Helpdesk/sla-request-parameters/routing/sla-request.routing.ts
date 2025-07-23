import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SlaRequestParametersComponent } from '../model/sla-request-parameters.component';

const routes: Routes = [
  { path: '', component: SlaRequestParametersComponent }
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
export class SLARequestRoutingModule { }
