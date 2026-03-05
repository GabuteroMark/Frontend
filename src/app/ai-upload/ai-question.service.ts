import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface GradeLevel { id: number; name: string; academicLevel?: string; }
export interface Subject { id: number; name: string; sectionId?: number; sectionName?: string; gradeLevelName?: string; }

export interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
}

export interface TopicRequest {
  id: number;
  accountId: number;
  gradeLevelId: number;
  subjectId: number;
  fileName: string;
  filePath: string;
  status: string;
  aiStatus: string;
  remarks: string;
  createdAt: string;
  sectionId?: number;
  sectionName?: string;
  gradeLevelName?: string;
  academicLevel?: string;
  subjectName?: string;
  firstName?: string;
  lastName?: string;
  generatedPdfUrl?: string;
  requestFileUrl?: string;
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
  private mainApiUrl = `${environment.apiUrl}/api`;
  private aiApiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getGradeLevels(): Observable<GradeLevel[]> {
    return this.http.get<GradeLevel[]>(`${this.mainApiUrl}/grade-levels`);
  }

  getSections(gradeLevelId: number, strand?: string): Observable<any[]> {
    let url = `${this.mainApiUrl}/grade-levels/${gradeLevelId}/sections`;
    if (strand) {
      url += `?strand=${strand}`;
    }
    return this.http.get<any[]>(url);
  }

  getSubjects(sectionId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.mainApiUrl}/sections/${sectionId}/subjects`);
  }

  createSubject(sectionId: number, name: string): Observable<Subject> {
    return this.http.post<Subject>(`${this.mainApiUrl}/sections/${sectionId}/subjects`, { name });
  }

  // Teacher submits for approval
  submitTopicRequest(files: File[], accountId: number, gradeLevelId: number, sectionId: number, subjectId: number): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    formData.append('accountId', accountId.toString());
    formData.append('gradeLevelId', gradeLevelId.toString());
    formData.append('sectionId', sectionId.toString());
    formData.append('subjectId', subjectId.toString());
    return this.http.post<any>(`${this.aiApiUrl}/topic-requests`, formData);
  }

  // Admin/Teacher gets requests
  getTopicRequests(params: { accountId?: number; role?: string; academicLevel?: string }): Observable<TopicRequest[]> {
    let url = `${this.aiApiUrl}/topic-requests?`;
    if (params.accountId) url += `accountId=${params.accountId}&`;
    if (params.role) url += `role=${params.role}&`;
    if (params.academicLevel) url += `academicLevel=${encodeURIComponent(params.academicLevel)}`;
    return this.http.get<TopicRequest[]>(url);
  }

  // Admin Approval
  approveTopic(id: number): Observable<any> {
    return this.http.post<any>(`${this.aiApiUrl}/topic-requests/${id}/approve`, {});
  }

  // Admin Rejection
  rejectTopic(id: number, remarks: string): Observable<any> {
    return this.http.post<any>(`${this.aiApiUrl}/topic-requests/${id}/reject`, { remarks });
  }

  getGeneratedPDFs(subjectId: number): Observable<GeneratedPDF[]> {
    return this.http.get<GeneratedPDF[]>(`${this.aiApiUrl}/generated-pdfs/${subjectId}`);
  }

  getRequestFiles(id: number): Observable<{ name: string, url: string }[]> {
    const url = `${this.aiApiUrl}/topic-requests/${id}/files`;
    console.log(`[DEBUG] Calling getRequestFiles URL: ${url}`);
    return this.http.get<{ name: string, url: string }[]>(url);
  }
}