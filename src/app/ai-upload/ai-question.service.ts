import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradeLevel { id: number; name: string; academicLevel?: string; }
export interface Subject { id: number; name: string; gradeLevelName?: string; }

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
  gradeLevelName?: string;
  subjectName?: string;
  firstName?: string;
  lastName?: string;
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

  constructor(private http: HttpClient) { }

  getGradeLevels(): Observable<GradeLevel[]> {
    return this.http.get<GradeLevel[]>(`${this.apiUrl}/grade-levels`);
  }

  getSubjects(gradeLevelId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects?gradeLevelId=${gradeLevelId}`);
  }

  // Teacher submits for approval
  submitTopicRequest(file: File, accountId: number, gradeLevelId: number, subjectId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId.toString());
    formData.append('gradeLevelId', gradeLevelId.toString());
    formData.append('subjectId', subjectId.toString());
    return this.http.post<any>(`${this.apiUrl}/topic-requests`, formData);
  }

  // Admin/Teacher gets requests
  getTopicRequests(params: { accountId?: number; role?: string }): Observable<TopicRequest[]> {
    let url = `${this.apiUrl}/topic-requests?`;
    if (params.accountId) url += `accountId=${params.accountId}&`;
    if (params.role) url += `role=${params.role}`;
    return this.http.get<TopicRequest[]>(url);
  }

  // Admin Approval
  approveTopic(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/topic-requests/${id}/approve`, {});
  }

  // Admin Rejection
  rejectTopic(id: number, remarks: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/topic-requests/${id}/reject`, { remarks });
  }

  getGeneratedPDFs(subjectId: number): Observable<GeneratedPDF[]> {
    return this.http.get<GeneratedPDF[]>(`${this.apiUrl}/generated-pdfs/${subjectId}`);
  }
}