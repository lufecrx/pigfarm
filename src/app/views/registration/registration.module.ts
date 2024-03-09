import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterPigComponent } from './register-pig/register-pig.component';

import { RegistrationRoutingModule } from './registration-routing.module';

import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  NavbarModule,
  NavModule,
  SharedModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';

@NgModule({
  declarations: [
    RegisterPigComponent,
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    ButtonModule,
    ButtonGroupModule,
    GridModule,
    IconModule,
    CardModule,
    UtilitiesModule,
    DropdownModule,
    SharedModule,
    FormModule,
    NavbarModule,
    CollapseModule,
    NavModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegistrationModule {
}
