import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { AssignRoomsComponent } from './assign-rooms.component';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';


@NgModule({
  declarations: [
    AssignRoomsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    SliderModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    DirectiveModule,
  ],
  exports: [AssignRoomsComponent]
})
export class AssignRoomsModule { }
