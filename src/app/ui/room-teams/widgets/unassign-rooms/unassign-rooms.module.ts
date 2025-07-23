import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGModule } from 'src/app/material/primemg.module';
import { UnassignRoomsComponent } from './unassign-rooms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';
import { AntDesignModule } from 'src/app/material/ant-design.module';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [
    UnassignRoomsComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatCardModule,
    MaterialModule,
    AntDesignModule,
    DirectiveModule,
  ],
  providers: [ ConfirmationService
  ],
  exports: [UnassignRoomsComponent]
})
export class UnAssignRoomsModule { }