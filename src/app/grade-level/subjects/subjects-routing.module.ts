import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectsListComponent } from './subjects-list.component';
import { SubjectsAddEditComponent } from './subjects-add-edit.component';
import { SubjectManagementComponent } from './subject-management.component';

const routes: Routes = [
  { path: '', component: SubjectsListComponent }, // Now Section List
  { path: 'add', component: SubjectsAddEditComponent }, // Add Section
  { path: 'edit/:sectionId', component: SubjectsAddEditComponent }, // Edit Section

  // New: Subject Management under a Section
  { path: ':sectionId/subjects', component: SubjectManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectsRoutingModule { }
