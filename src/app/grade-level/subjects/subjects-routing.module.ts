import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsListComponent } from './subjects-list.component';
import { SubjectsAddEditComponent } from './subjects-add-edit.component';

const routes: Routes = [
  { path: '', component: SubjectsListComponent },
  { path: 'add', component: SubjectsAddEditComponent },
  { path: 'edit/:subjectId', component: SubjectsAddEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectsRoutingModule {}
