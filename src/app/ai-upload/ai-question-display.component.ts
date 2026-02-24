import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from './ai-question.service';

@Component({
  selector: 'app-ai-question-display',
  templateUrl: './ai-question-display.component.html'
})
export class AIQuestionDisplayComponent implements OnInit {
  questions: Question[] = [];
  downloadUrl: string = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    if (state) {
      this.questions = state.questions || [];
      this.downloadUrl = state.downloadUrl || '';
    }
  }

  ngOnInit(): void {
    const stateStr = localStorage.getItem('aiQuestionsState');
    if (stateStr) {
      const state = JSON.parse(stateStr);
      this.questions = state.questions || [];
      this.downloadUrl = state.downloadUrl || '';
      localStorage.removeItem('aiQuestionsState');
    }
  }

  downloadPDF() {
    if (!this.downloadUrl) return;
    const link = document.createElement('a');
    link.href = `http://localhost:5000${this.downloadUrl}`;
    link.download = this.downloadUrl.split("/").pop() || 'Generated_Questions.pdf';
    link.click();
  }
}