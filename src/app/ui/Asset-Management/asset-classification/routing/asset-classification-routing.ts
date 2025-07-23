import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AssetClassificationComponent } from '../modal/asset-classification.component';

const routes: Routes = [
        { path: '', component: AssetClassificationComponent }
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
export class AssetClassificationRoutingModule { }
