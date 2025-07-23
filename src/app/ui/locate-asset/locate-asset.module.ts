import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SvgViewModule } from '../svg-view/svg-view.module';
import { LocateAssetRoutingModule } from './routing/locate-asset.routing';
import { LocateAssetComponent } from './locate-asset.component';


@NgModule({
    declarations: [
        LocateAssetComponent
    ],
    imports: [
        CommonModule,
        NgSelectModule,
        PrimeNGModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        LocateAssetRoutingModule,
        SvgViewModule,
        NgxSpinnerModule,
    ],
    exports: [LocateAssetComponent],
    providers: []
})
export class LocateAssetModule { }