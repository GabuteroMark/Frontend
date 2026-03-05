import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIQuestionService, GradeLevel, Subject, Question, TopicRequest } from './ai-question.service';
import { AccountService } from '@app/_services/account.service';
import { SectionService } from '@app/_services/section.service';
import { Role } from '@app/_models';

@Component({
  selector: 'app-ai-upload',
  templateUrl: './ai-upload.component.html'
})
export class AIUploadComponent implements OnInit {
  selectedFiles: File[] = [];
  academicLevels: string[] = ['Primary Education', 'Secondary Education', 'Senior High School', 'Tertiary Education'];
  selectedAcademicLevel: string = '';
  gradeLevels: GradeLevel[] = [];
  filteredGradeLevels: GradeLevel[] = [];
  selectedGradeLevelId: number | null = null;
  sections: any[] = [];
  selectedStrand: string | null = null;
  selectedSectionId: number | null = null;
  subjects: Subject[] = [];
  selectedSubjectId: number | null = null;

  strands = ['GAS', 'ABM', 'STEM', 'HUMMS', 'TVL'];
  yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private aiService: AIQuestionService,
    private sectionService: SectionService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const account = this.accountService.accountValue;
    if (account && account.role === Role.Coordinator && account.assignedLevel) {
      this.academicLevels = [account.assignedLevel];
      this.selectedAcademicLevel = account.assignedLevel;
    }
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
    this.selectedStrand = null;
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
    this.selectedStrand = null;
    this.selectedSectionId = null;
    this.selectedSubjectId = null;
    this.sections = [];
    this.subjects = [];
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedGradeLevelId) return;

    // If it's SHS or Tertiary, we wait for Strand/Year selection
    const g = this.filteredGradeLevels.find(x => x.id == this.selectedGradeLevelId);
    if (g && (g.name.includes('Grade 11') || g.name.includes('Grade 12') || this.selectedAcademicLevel === 'Tertiary Education')) {
      return;
    }

    this.aiService.getSections(this.selectedGradeLevelId).subscribe({
      next: secs => this.sections = secs,
      error: err => console.error(err)
    });
  }

  onStrandChange() {
    this.selectedSectionId = null;
    this.selectedSubjectId = null;
    this.sections = [];
    this.subjects = [];
    this.successMsg = '';
    this.errorMsg = '';
    if (!this.selectedGradeLevelId || !this.selectedStrand) return;

    this.aiService.getSections(this.selectedGradeLevelId, this.selectedStrand).subscribe({
      next: secs => {
        if (this.selectedAcademicLevel?.toLowerCase() === 'tertiary education') {
          // Strictly only allow 1st and 2nd Semester for Tertiary
          this.sections = secs.filter(s => s.name === '1st Semester' || s.name === '2nd Semester');

          // AUTO-INITIALIZE: If semesters are missing, create them!
          const has1st = this.sections.some(s => s.name === '1st Semester');
          const has2nd = this.sections.some(s => s.name === '2nd Semester');

          if (!has1st) {
            this.sectionService.create(this.selectedGradeLevelId!, '1st Semester', this.selectedStrand!).subscribe(() => this.onStrandChange());
            return;
          }
          if (!has2nd) {
            this.sectionService.create(this.selectedGradeLevelId!, '2nd Semester', this.selectedStrand!).subscribe(() => this.onStrandChange());
            return;
          }
        } else {
          this.sections = secs;
        }
      },
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
    this.selectedFiles = Array.from(event.target.files) as File[];
  }

  submitTopicRequest() {
    const account = this.accountService.accountValue;
    // Strict subject validation: selectedSubjectId is always required
    if (this.selectedFiles.length === 0 || !this.selectedGradeLevelId || !this.selectedSectionId || !this.selectedSubjectId || !account) {
      this.errorMsg = 'Please fulfill all required fields';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.aiService.submitTopicRequest(
      this.selectedFiles,
      Number(account.id),
      Number(this.selectedGradeLevelId),
      Number(this.selectedSectionId),
      Number(this.selectedSubjectId)
    )
      .subscribe({
        next: res => {
          this.loading = false;
          this.successMsg = `✅ ${this.selectedFiles.length} topic(s) submitted for Admin approval successfully!`;
          this.selectedFiles = [];
          // Reset file input if needed (manual reset via template variable is better but this is the logic)
        },
        error: err => {
          this.errorMsg = 'Server error submitting topic';
          console.error(err);
          this.loading = false;
        }
      });
  }
}