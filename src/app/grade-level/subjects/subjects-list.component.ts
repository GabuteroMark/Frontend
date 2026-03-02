import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GradeLevelService } from '@app/_services/grade-level.service';

interface Subject {
  id: number;
  name: string;
}

interface SubjectPDF {
  id: number;
  name: string;
  downloadUrl: string;
  createdAt: string;
}

@Component({
  selector: 'app-subjects-list',
  templateUrl: './subjects-list.component.html'
})
export class SubjectsListComponent implements OnInit {
  subjects: Subject[] = [];
  loading = false;
  gradeLevelId = 0;
  gradeLevelName = '';
  academicLevel = '';

  showPdfModal = false;
  pdfsForSubject: SubjectPDF[] = [];
  selectedSubjectName = '';
  loadingPDFs = false; // ✅ loading indicator for PDFs

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private gradeLevelService: GradeLevelService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('gradeLevelId');
    if (!id) {
      alert('Grade Level ID missing');
      this.router.navigate(['/grade-level']);
      return;
    }
    this.gradeLevelId = Number(id);

    // Fetch parent grade level details
    this.gradeLevelService.getById(this.gradeLevelId).subscribe(res => {
      this.gradeLevelName = res.name;
    });

    // Read academicLevel from queryParams
    this.route.queryParams.subscribe(params => {
      this.academicLevel = params.academicLevel || '';
    });

    this.loadSubjects();
  }

  loadSubjects(): void {
    this.loading = true;
    this.http.get<Subject[]>(`http://localhost:4000/api/grade-levels/${this.gradeLevelId}/subjects`)
      .subscribe({
        next: (res) => {
          this.subjects = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  addSubject(): void {
    this.router.navigate([`/grade-level/${this.gradeLevelId}/subjects/add`], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }

  editSubject(id?: number): void {
    if (!id) return;
    this.router.navigate([`/grade-level/${this.gradeLevelId}/subjects/edit/${id}`], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }

  deleteSubject(id?: number): void {
    if (!id) return;
    if (!confirm('Delete section?')) return;

    this.http.delete(`http://localhost:4000/api/grade-levels/${this.gradeLevelId}/subjects/${id}`)
      .subscribe({
        next: () => this.loadSubjects(),
        error: err => console.error(err)
      });
  }

  viewSubjectPDFs(subjectId: number, subjectName: string) {
    this.selectedSubjectName = subjectName;
    this.showPdfModal = true;
    this.pdfsForSubject = [];
    this.loadingPDFs = true;

    // ✅ Fetch PDFs for this subject
    this.http.get<SubjectPDF[]>(`http://localhost:4000/api/subjects/${subjectId}/pdfs`)
      .subscribe({
        next: (res) => {
          this.pdfsForSubject = res || [];
          this.loadingPDFs = false;
        },
        error: (err) => {
          console.error(err);
          this.pdfsForSubject = [];
          this.loadingPDFs = false;
        }
      });
  }

  closePdfModal() {
    this.showPdfModal = false;
  }

  downloadPDF(pdf: SubjectPDF) {
    const link = document.createElement('a');
    link.href = `http://localhost:4000${pdf.downloadUrl}`;
    link.download = pdf.name;
    link.click();
  }

  goBack(): void {
    this.router.navigate(['/grade-level'], {
      queryParams: { academicLevel: this.academicLevel }
    });
  }
}