import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credenciais, TokenResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:4333';
    private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
    public token$ = this.tokenSubject.asObservable();

    constructor(private http: HttpClient) { }

    login(credenciais: Credenciais): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(`${this.baseUrl}/token/`, credenciais)
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.access);
                    localStorage.setItem('refreshToken', response.refresh);
                    this.tokenSubject.next(response.access);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.tokenSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.tokenSubject.value;
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }
}