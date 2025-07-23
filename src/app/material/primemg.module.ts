

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FieldsetModule} from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { LevelStatusModule } from '../core/level-status/level-status.module';
import { MenuModule } from 'primeng/menu';
import { TimelineModule } from 'primeng/timeline';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';

@NgModule({
        declarations: [],
        imports: [ CommonModule,
                AccordionModule,
        TableModule,
                NzDividerModule,
                CalendarModule,
                SliderModule,
                DialogModule,
                MultiSelectModule,
                ContextMenuModule,
                DropdownModule,
                ButtonModule,
                ToastModule,
                InputTextModule,
                ProgressBarModule,
                PanelModule,
                CardModule,
                ConfirmDialogModule,
                CheckboxModule,
                PasswordModule,
                FieldsetModule,
                ChipModule,
                DividerModule,
                NzDrawerModule,
                NzDescriptionsModule,
                InputSwitchModule,
                FileUploadModule,
                LevelStatusModule,
                MenuModule,
                TimelineModule,
                OverlayPanelModule,
                TooltipModule,
                TabViewModule,
                MenuModule,
                ChartModule

],
        exports: [
                AccordionModule,
                TableModule,
                NzDividerModule,
                CalendarModule,
                SliderModule,
                DialogModule,
                MultiSelectModule,
                ContextMenuModule,
                DropdownModule,
                ButtonModule,
                ToastModule,
                InputTextModule,
                ProgressBarModule,
                PanelModule,
                CardModule,
                ConfirmDialogModule,
                CheckboxModule,
                PasswordModule,
                FieldsetModule,
                ChipModule,
                DividerModule,
                NzDrawerModule,
                NzDescriptionsModule,
          InputSwitchModule,
          FileUploadModule,
                LevelStatusModule,
                TabViewModule,
                OverlayPanelModule,
                TooltipModule,
                MenuModule,
                ChartModule

        ],
        providers: [],
})

export class PrimeNGModule { }
