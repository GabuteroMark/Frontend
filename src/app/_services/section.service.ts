import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface Section {
    id?: number;
    name: string;
    gradeLevelId: number;
    strand?: string;
}

@Injectable({ providedIn: 'root' })
export class SectionService {
    private baseUrl = `${environment.apiUrl}/api/grade-levels`;

    constructor(private http: HttpClient) { }

    getAll(gradeLevelId: number, strand?: string): Observable<Section[]> {
        let url = `${this.baseUrl}/${gradeLevelId}/sections`;
        if (strand) {
            url += `?strand=${strand}`;
        }
        return this.http.get<Section[]>(url);
    }

    getById(id: number): Observable<Section> {
        return this.http.get<Section>(`${environment.apiUrl}/api/sections/${id}`);
    }

    create(gradeLevelId: number, name: string, strand?: string): Observable<Section> {
        return this.http.post<Section>(`${this.baseUrl}/${gradeLevelId}/sections`, { name, strand });
    }

    update(gradeLevelId: number, sectionId: number, name: string, strand?: string): Observable<Section> {
        return this.http.put<Section>(`${this.baseUrl}/${gradeLevelId}/sections/${sectionId}`, { name, strand });
    }

    delete(gradeLevelId: number, sectionId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${gradeLevelId}/sections/${sectionId}`);
    }
}
