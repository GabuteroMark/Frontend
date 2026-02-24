import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  private baseUrl = 'http://localhost:4000/api/questions';

  constructor(private http: HttpClient) {}

  getQuestions(subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/subjects/${subjectId}/questions`
    );
  }

  saveAIQuestions(subjectId: number, questions: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/subjects/${subjectId}/questions/ai`,
      { questions }
    );
  }

  getSubjectById(subjectId: number): Observable<any> {
    return this.http.get<any>(
      `http://localhost:4000/branches/subjects/${subjectId}`
    );
  }
}
