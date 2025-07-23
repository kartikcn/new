import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LocateAssetComponent } from '../locate-asset.component';

const routes: Routes = [
    { path: '', component:  LocateAssetComponent}
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
export class LocateAssetRoutingModule { }