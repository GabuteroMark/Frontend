import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIUploadComponent } from './ai-upload.component';
import { AIQuestionDisplayComponent } from './ai-question-display.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AIUploadComponent },
  { path: 'ai-question-display', component: AIQuestionDisplayComponent }
];

@NgModule({
  declarations: [AIUploadComponent, AIQuestionDisplayComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class AIQuestionModule {}
