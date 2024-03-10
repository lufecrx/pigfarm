import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  PaginationModule,
  DropdownModule,
  ModalModule,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

import { ManagerRoutingModule } from './manager-routing.module';
import { ListPigsComponent } from './list-pigs/list-pigs.component';
import { EditPigComponent } from './edit-pig/edit-pig.component';
import { WeightControlComponent } from './weight-control/weight-control.component';

import { UtilsPipesModule } from 'src/app/shared/utils-pipes/utils-pipes.module';


@NgModule({
  declarations: [
    ListPigsComponent,
    EditPigComponent,
    WeightControlComponent,
  ],
  imports: [
    ManagerRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    AvatarModule,
    TableModule,
    FormsModule,
    PaginationModule,
    DropdownModule,
    ModalModule,
    UtilsPipesModule,
  ]
})
export class ManagerModule {
}
