import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddConnectorComponent } from './add-connector.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from 'src/app/directive/directive/directive.module';



@NgModule({
  declarations: [
    AddConnectorComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule
  ],
  exports: [AddConnectorComponent]
})
export class AddConnectorModule { }
