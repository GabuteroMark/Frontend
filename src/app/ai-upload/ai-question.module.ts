import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AIUploadComponent } from './ai-upload.component';
import { AIQuestionDisplayComponent } from './ai-question-display.component';
import { TopicApprovalComponent } from './topic-approval.component';
import { SubmissionHistoryComponent } from './submission-history.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FilterByLevelPipe } from './filter-by-level.pipe';

const routes: Routes = [
  { path: '', component: AIUploadComponent },
  { path: 'ai-question-display', component: AIQuestionDisplayComponent },
  { path: 'topic-approval', component: TopicApprovalComponent },
  { path: 'history', component: SubmissionHistoryComponent }
];

@NgModule({
  declarations: [AIUploadComponent, AIQuestionDisplayComponent, TopicApprovalComponent, SubmissionHistoryComponent, FilterByLevelPipe],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class AIQuestionModule { }
