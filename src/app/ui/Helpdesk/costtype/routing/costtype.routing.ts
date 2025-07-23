import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CosttypeComponent } from '../modal/costtype.component';

const routes: Routes = [
    { path: '', component: CosttypeComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CosttypeRoutingModule { }
