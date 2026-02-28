import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeLevel } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class GradeLevelService {
    private baseUrl = 'http://localhost:4000/api/grade-levels'; // ✅ match backend

    constructor(private http: HttpClient) { }

    getAll(academicLevel?: string): Observable<GradeLevel[]> {
        let url = this.baseUrl;
        if (academicLevel) {
            url += `?academicLevel=${encodeURIComponent(academicLevel)}`;
        }
        return this.http.get<GradeLevel[]>(url);
    }

    getById(id: number): Observable<GradeLevel> {
        return this.http.get<GradeLevel>(`${this.baseUrl}/${id}`);
    }

    create(params: { name: string }): Observable<GradeLevel> {
        return this.http.post<GradeLevel>(this.baseUrl, params);
    }

    update(id: number, params: { name: string }): Observable<GradeLevel> {
        return this.http.put<GradeLevel>(`${this.baseUrl}/${id}`, params);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}