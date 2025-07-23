import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddConnectorFldsComponent } from './add-connector-flds.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddConnectorFldsComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule
  ],
  exports: [AddConnectorFldsComponent]
})
export class AddConnectorFldsModule { }
