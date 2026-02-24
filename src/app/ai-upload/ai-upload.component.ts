import { Component, OnInit } from '@angular/core';
import { AIQuestionService, GradeLevel, Subject, Question } from './ai-question.service';

@Component({
  selector: 'app-ai-upload',
  templateUrl: './ai-upload.component.html'
})
export class AIUploadComponent implements OnInit {
  selectedFile: File | null = null;
  gradeLevels: GradeLevel[] = [];
  selectedGradeLevelId: number | null = null;
  subjects: Subject[] = [];
  selectedSubjectId: number | null = null;
  loading = false;
  errorMsg = '';

  generatedQuestions: Question[] = [];
  downloadUrl: string = '';

  // ✅ Added property to store generated PDFs
  generatedPDFs: any[] = [];

  // ✅ Added property for success message / indicator
  successMsg: string = '';

  constructor(private aiService: AIQuestionService) {}

  ngOnInit(): void {
    this.loadGradeLevels();
  }

  loadGradeLevels() {
    this.aiService.getGradeLevels().subscribe({
      next: levels => this.gradeLevels = levels,
      error: err => console.error(err)
    });
  }

  onGradeLevelChange() {
    this.selectedSubjectId = null;
    this.subjects = [];
    this.generatedQuestions = [];
    this.downloadUrl = '';
    this.generatedPDFs = [];
    this.successMsg = ''; // ✅ clear success message when changing grade level
    if (!this.selectedGradeLevelId) return;

    this.aiService.getSubjects(this.selectedGradeLevelId).subscribe({
      next: subs => this.subjects = subs,
      error: err => console.error(err)
    });
  }

  onSubjectChange() {
    this.generatedQuestions = [];
    this.downloadUrl = '';
    this.successMsg = ''; // ✅ clear success message when changing subject
    this.loadGeneratedPDFs(); // ✅ load PDFs automatically for this subject
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  generateQuestions() {
    if (!this.selectedFile || !this.selectedGradeLevelId || !this.selectedSubjectId) {
      this.errorMsg = 'Please select file, grade level, and subject';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.successMsg = ''; // ✅ reset success message while generating

    this.aiService.uploadPDF(this.selectedFile, this.selectedGradeLevelId, this.selectedSubjectId)
      .subscribe({
        next: res => {
          this.generatedQuestions = res.questions;
          this.downloadUrl = res.downloadUrl;
          this.loading = false;

          // ✅ Show success message / indicator
          this.successMsg = '✅ PDF generated successfully!';

          // ✅ refresh PDF list automatically for subject
          this.loadGeneratedPDFs();
        },
        error: err => {
          this.errorMsg = 'Server error generating PDF';
          console.error(err);
          this.loading = false;
        }
      });
  }

  downloadPDF() {
    if (!this.downloadUrl) return;
    const link = document.createElement('a');
    link.href = `http://localhost:5000${this.downloadUrl}`;
    link.download = 'Generated_Questions.pdf';
    link.click();
  }

  // ✅ New function to load generated PDFs for selected subject
  loadGeneratedPDFs() {
    if (!this.selectedSubjectId) return;

    this.aiService.getGeneratedPDFs(this.selectedSubjectId)
      .subscribe({
        next: pdfs => {
          this.generatedPDFs = pdfs;

          // ✅ if PDFs exist, show indicator automatically
          if (pdfs.length > 0 && !this.successMsg) {
            this.successMsg = '✅ Latest PDF is ready for download';
            this.downloadUrl = pdfs[0].downloadUrl;
          }
        },
        error: err => console.error(err)
      });
  }
}