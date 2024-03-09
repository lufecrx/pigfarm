import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPigsComponent } from './list-pigs/list-pigs.component';
import { EditPigComponent } from './edit-pig/edit-pig.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Manager'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list-pigs'
      },
      {
        path: 'list-pigs',
        component: ListPigsComponent,
        data: {
          title: 'List Pigs',
        },
      },
      {
        path: 'edit-pig',
        component: EditPigComponent,
        data: {
          title: 'Edit Pig',
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule {
}
