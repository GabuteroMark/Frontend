import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';
import { ActivityLog , ActivityLogsResponse } from '@app/_models/activity-log.model';

// Base URL for API calls
const baseUrl = `${environment.apiUrl}/api/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    private refreshTokenTimeout?: any;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        // Load initial account from local storage if needed
        const storedAccount = localStorage.getItem('account');
        this.accountSubject = new BehaviorSubject<Account | null>(
            storedAccount ? JSON.parse(storedAccount) : null
        );
        this.account = this.accountSubject.asObservable();

        // Start refresh token timer if account exists
        if (this.accountValue?.jwtToken) {
            this.startRefreshTokenTimer();
        }
    }

    public get accountValue() {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${baseUrl}/authenticate`, { email, password })
            .pipe(map(account => {
                // Save account to BehaviorSubject and local storage
                this.accountSubject.next(account);
                localStorage.setItem('account', JSON.stringify(account));
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        localStorage.removeItem('account');
        this.router.navigate(['/account/login']);
    }

    refreshToken() {
        return this.http.post<Account>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map(account => {
                this.accountSubject.next(account);
                localStorage.setItem('account', JSON.stringify(account));
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: Account) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }
     
    getAllAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(baseUrl);
    }

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }
    
    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    getAllActivityLogs(): Observable<ActivityLog[]> {
        return this.http.get<ActivityLogsResponse>(`${baseUrl}/activity-logs`).pipe(
            map(response => Array.isArray(response) ? response as ActivityLog[] : response.data || [])
        );
    }
    
    getActivityLogs(AccountId: string, filters: any = {}): Observable<any[]> {
        return this.http.post<any[]>(`${baseUrl}/${AccountId}/activity`, filters);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                if (account.id === this.accountValue?.id) {
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                    localStorage.setItem('account', JSON.stringify(account));
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                if (id === this.accountValue?.id)
                    this.logout();
            }));
    }

    // ====================
    // Private helper methods
    // ====================
    private startRefreshTokenTimer() {
        if (!this.accountValue || !this.accountValue.jwtToken) return;

        const jwtBase64 = this.accountValue.jwtToken.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60_000; // refresh 1 min before expiry

        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }
}