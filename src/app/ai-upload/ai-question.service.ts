import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradeLevel { id: number; name: string; }
export interface Subject { id: number; name: string; }

export interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
}

export interface GeneratedPDF {
  id: number;
  filePath: string;
  downloadUrl: string;
  createdAt: string;
  questions: Question[];
}

@Injectable({ providedIn: 'root' })
export class AIQuestionService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getGradeLevels(): Observable<GradeLevel[]> {
    return this.http.get<GradeLevel[]>(`${this.apiUrl}/grade-levels`);
  }

  getSubjects(gradeLevelId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects?gradeLevelId=${gradeLevelId}`);
  }

  uploadPDF(file: File, gradeLevelId: number, subjectId: number): Observable<{ downloadUrl: string; questions: Question[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('gradeLevelId', gradeLevelId.toString());
    formData.append('subjectId', subjectId.toString());
    return this.http.post<{ downloadUrl: string; questions: Question[] }>(`${this.apiUrl}/upload`, formData);
  }

  getGeneratedPDFs(subjectId: number): Observable<GeneratedPDF[]> {
    return this.http.get<GeneratedPDF[]>(`${this.apiUrl}/generated-pdfs/${subjectId}`);
  }
}