import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GradeLevelRoutingModule } from './grade-level-routing.module';
import { GradeLevelListComponent } from './grade-level-list.component';
import { GradeLevelAddEditComponent } from './grade-level-add-edit.component';

@NgModule({
  declarations: [
    GradeLevelListComponent,
    GradeLevelAddEditComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GradeLevelRoutingModule
  ]
})
export class GradeLevelModule {}
