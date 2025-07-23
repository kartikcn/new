import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GenerateRequestsComponent } from '../modal/generate-requests.component';
import { ShowRequestDetailsComponent } from '../widgets/show-rquest-details/show-request-details.component';

const routes: Routes = [
        { path: '', component: ShowRequestDetailsComponent }
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
export class ShowRequestDetailsRoutingModule { }
