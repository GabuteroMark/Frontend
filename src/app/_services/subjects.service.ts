import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subject {
  id?: number;
  name: string;
  gradeLevelId: number;
}

export interface SubjectPDF {
  id: number;
  name: string;
  downloadUrl: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectsService {
  private baseUrl = 'http://localhost:4000/api';

  constructor(private http: HttpClient) {}

  getAll(gradeLevelId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.baseUrl}/grade-levels/${gradeLevelId}/subjects`);
  }

  getById(id: number): Observable<Subject> {
    return this.http.get<Subject>(`${this.baseUrl}/subjects/${id}`);
  }

  create(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(
      `${this.baseUrl}/grade-levels/${subject.gradeLevelId}/subjects`,
      { name: subject.name }
    );
  }

  update(id: number, subject: Subject): Observable<Subject> {
    return this.http.put<Subject>(
      `${this.baseUrl}/grade-levels/${subject.gradeLevelId}/subjects/${id}`,
      { name: subject.name }
    );
  }

  delete(gradeLevelId: number, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/grade-levels/${gradeLevelId}/subjects/${id}`);
  }

  getPDFs(subjectId: number): Observable<SubjectPDF[]> {
    return this.http.get<SubjectPDF[]>(`${this.baseUrl}/subjects/${subjectId}/pdfs`);
  }
}