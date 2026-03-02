import { Component, OnInit } from '@angular/core';
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
  subjects: Subject[] = [];
  selectedSubjectId: number | null = null;
  loading = false;
  errorMsg = '';
  successMsg = '';

  // For submissions list
  myRequests: TopicRequest[] = [];

  constructor(
    private aiService: AIQuestionService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadGradeLevels();
    this.loadMySubmissions();
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

  loadMySubmissions() {
    const account = this.accountService.accountValue;
    if (!account) return;

    this.aiService.getTopicRequests({ accountId: Number(account.id), role: account.role })
      .subscribe({
        next: requests => this.myRequests = requests,
        error: err => console.error(err)
      });
  }

  onAcademicLevelChange() {
    this.selectedGradeLevelId = null;
    this.selectedSubjectId = null;
    this.subjects = [];
    this.filteredGradeLevels = [];
    this.successMsg = '';
    this.errorMsg = '';
    this.filterGradeLevels();
  }

  onGradeLevelChange() {
    this.selectedSubjectId = null;
    this.subjects = [];
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedGradeLevelId) return;

    this.aiService.getSubjects(this.selectedGradeLevelId).subscribe({
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
    if (!this.selectedFile || !this.selectedGradeLevelId || !this.selectedSubjectId || !account) {
      this.errorMsg = 'Please select file, grade level, and subject';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.aiService.submitTopicRequest(this.selectedFile, Number(account.id), this.selectedGradeLevelId, this.selectedSubjectId)
      .subscribe({
        next: res => {
          this.loading = false;
          this.successMsg = '✅ Topic submitted for Admin approval successfully!';
          this.selectedFile = null;
          this.loadMySubmissions();
        },
        error: err => {
          this.errorMsg = 'Server error submitting topic';
          console.error(err);
          this.loading = false;
        }
      });
  }
}