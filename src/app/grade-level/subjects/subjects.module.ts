import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SubjectsRoutingModule } from './subjects-routing.module';

import { SubjectsListComponent } from './subjects-list.component';
import { SubjectsAddEditComponent } from './subjects-add-edit.component';

@NgModule({
  declarations: [
    SubjectsListComponent,
    SubjectsAddEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SubjectsRoutingModule
  ]
})
export class SubjectsModule {}
