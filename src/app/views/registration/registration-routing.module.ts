import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPigComponent } from './register-pig/register-pig.component';
import { RegisterWeightComponent } from './register-weight/register-weight.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Registration'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'register-pig'
      },
      {
        path: 'register-pig',
        component: RegisterPigComponent,
        data: {
          title: 'Register Pig'
        }
      },
      {
        path: 'register-weight',
        component: RegisterWeightComponent,
        data: {
          title: 'Register Weight'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {
}
