import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIQuestionService, GradeLevel, Subject, Question, TopicRequest } from './ai-question.service';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-ai-upload',
  templateUrl: './ai-upload.component.html'
})
export class AIUploadComponent implements OnInit {
  selectedFile: File | null = null;
  academicLevels: string[] = ['Primary Education', 'Secondary Education', 'Senior High School', 'Tertiary Education'];
  selectedAcademicLevel: string = '';
  gradeLevels: GradeLevel[] = [];
  filteredGradeLevels: GradeLevel[] = [];
  selectedGradeLevelId: number | null = null;
  sections: any[] = [];
  selectedSectionId: number | null = null;
  subjects: Subject[] = [];
  selectedSubjectId: number | null = null;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private aiService: AIQuestionService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGradeLevels();
  }

  loadGradeLevels() {
    this.aiService.getGradeLevels().subscribe({
      next: levels => {
        this.gradeLevels = levels;
        this.filterGradeLevels();
      },
      error: err => console.error(err)
    });
  }

  filterGradeLevels() {
    if (!this.selectedAcademicLevel) {
      this.filteredGradeLevels = [];
    } else {
      this.filteredGradeLevels = this.gradeLevels.filter((g: GradeLevel) =>
        g.academicLevel?.trim().toLowerCase() === this.selectedAcademicLevel.trim().toLowerCase()
      );
    }
  }

  onAcademicLevelChange() {
    this.selectedGradeLevelId = null;
    this.selectedSectionId = null;
    this.selectedSubjectId = null;
    this.sections = [];
    this.subjects = [];
    this.filteredGradeLevels = [];
    this.successMsg = '';
    this.errorMsg = '';
    this.filterGradeLevels();
  }

  onGradeLevelChange() {
    this.selectedSectionId = null;
    this.selectedSubjectId = null;
    this.sections = [];
    this.subjects = [];
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedGradeLevelId) return;

    this.aiService.getSections(this.selectedGradeLevelId).subscribe({
      next: secs => this.sections = secs,
      error: err => console.error(err)
    });
  }

  onSectionChange() {
    this.selectedSubjectId = null;
    this.subjects = [];
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedSectionId) return;

    this.aiService.getSubjects(this.selectedSectionId).subscribe({
      next: subs => this.subjects = subs,
      error: err => console.error(err)
    });
  }

  onSubjectChange() {
    this.successMsg = '';
    this.errorMsg = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  submitTopicRequest() {
    const account = this.accountService.accountValue;
    if (!this.selectedFile || !this.selectedGradeLevelId || !this.selectedSectionId || !this.selectedSubjectId || !account) {
      this.errorMsg = 'Please select file, grade level, section, and subject';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.aiService.submitTopicRequest(this.selectedFile, Number(account.id), this.selectedGradeLevelId, this.selectedSectionId, this.selectedSubjectId)
      .subscribe({
        next: res => {
          this.loading = false;
          this.successMsg = '✅ Topic submitted for Admin approval successfully!';
          this.selectedFile = null;
        },
        error: err => {
          this.errorMsg = 'Server error submitting topic';
          console.error(err);
          this.loading = false;
        }
      });
  }
}