import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GradeLevelService } from '@app/_services/grade-level.service';
import { SectionService } from '@app/_services/section.service';
import { AIQuestionService } from '@app/ai-upload/ai-question.service';
import { environment } from '@environments/environment';

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
    selector: 'app-subject-management',
    templateUrl: './subject-management.component.html'
})
export class SubjectManagementComponent implements OnInit {
    subjects: Subject[] = [];
    loading = false;
    gradeLevelId = 0;
    sectionId = 0;
    sectionName = 'Loading...';
    gradeLevelName = 'Loading...';
    academicLevel = '';

    showPdfModal = false;
    pdfsForSubject: SubjectPDF[] = [];
    selectedSubjectName = '';
    loadingPDFs = false;
    autoOpenSubjectId: number | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private gradeLevelService: GradeLevelService,
        private sectionService: SectionService,
        private aiService: AIQuestionService
    ) { }

    ngOnInit(): void {
        const glId = this.route.snapshot.paramMap.get('gradeLevelId') || this.route.parent?.snapshot.paramMap.get('gradeLevelId');
        const secId = this.route.snapshot.paramMap.get('sectionId');

        console.log('NG_ON_INIT SubjectManagement:', { glId, secId });

        if (!glId || !secId) {
            console.error('Missing route parameters:', { glId, secId });
            this.router.navigate(['/grade-level']);
            return;
        }

        this.gradeLevelId = Number(glId);
        this.sectionId = Number(secId);

        // 1. Fetch Grade Level
        this.gradeLevelService.getById(this.gradeLevelId).subscribe({
            next: (res) => {
                this.gradeLevelName = res.name;
                if (!this.academicLevel && res.academicLevel) {
                    this.academicLevel = res.academicLevel;
                }
            },
            error: (err) => {
                console.error('Grade Level Fetch Error:', err);
                this.gradeLevelName = 'Error';
            }
        });

        // 2. Fetch Section
        this.sectionService.getById(this.sectionId).subscribe({
            next: (res) => {
                if (res) this.sectionName = res.name;
                console.log('Section Metadata Loaded:', this.sectionName);
            },
            error: (err) => {
                console.error('Section Fetch Error:', err);
                this.sectionName = 'Error';
            }
        });

        // 3. Handle Query Params
        this.route.queryParams.subscribe(params => {
            console.log('Query Params:', params);
            if (params.academicLevel) this.academicLevel = params.academicLevel;
            if (params.sectionName) this.sectionName = params.sectionName;

            if (params.openPdfModal) {
                this.autoOpenSubjectId = Number(params.openPdfModal);
            }

            this.loadSubjects();
        });
    }

    loadSubjects(): void {
        console.log('Loading subjects for sectionId:', this.sectionId);
        this.loading = true;
        this.http.get<Subject[]>(`${environment.apiUrl}/api/sections/${this.sectionId}/subjects`)
            .subscribe({
                next: (res) => {
                    console.log('Subjects fetched for section:', this.sectionId, res);
                    this.subjects = res || [];
                    this.loading = false;

                    if (this.autoOpenSubjectId) {
                        const targetSub = this.subjects.find(s => s.id === this.autoOpenSubjectId);
                        if (targetSub) {
                            console.log('Auto-opening PDF modal for subject:', targetSub.name);
                            this.viewSubjectPDFs(targetSub.id, targetSub.name);
                        } else {
                            console.warn('Auto-open subject not found:', this.autoOpenSubjectId, 'among', this.subjects);
                        }
                        this.autoOpenSubjectId = null;
                    }
                },
                error: (err) => {
                    console.error('Error loading subjects:', err);
                    this.loading = false;
                }
            });
    }

    addSubject(): void {
        alert('To add/edit subjects, please use the separate Subject management.');
    }

    viewSubjectPDFs(subjectId: number, subjectName: string) {
        this.selectedSubjectName = subjectName;
        this.showPdfModal = true;
        this.pdfsForSubject = [];
        this.loadingPDFs = true;

        this.aiService.getGeneratedPDFs(subjectId)
            .subscribe({
                next: (res: any) => {
                    this.pdfsForSubject = res || [];
                    this.loadingPDFs = false;
                },
                error: (err) => {
                    console.error('Error fetching PDFs:', err);
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
        link.href = `http://localhost:5000${pdf.downloadUrl}`;
        link.target = '_blank';
        link.download = pdf.name;
        link.click();
    }

    goBack(): void {
        this.router.navigate([`/grade-level/${this.gradeLevelId}/sections`], {
            queryParams: { academicLevel: this.academicLevel }
        });
    }
}
