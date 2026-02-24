import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GradeLevelListComponent } from './grade-level-list.component';
import { GradeLevelAddEditComponent } from './grade-level-add-edit.component';

const routes: Routes = [
  { path: '', component: GradeLevelListComponent },
  { path: 'add', component: GradeLevelAddEditComponent },
  { path: 'edit/:id', component: GradeLevelAddEditComponent },

  {
    path: ':gradeLevelId/subjects',
    loadChildren: () =>
      import('./subjects/subjects.module').then(m => m.SubjectsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeLevelRoutingModule {}
