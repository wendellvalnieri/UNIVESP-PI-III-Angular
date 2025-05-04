import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credenciais, ResponseRequest } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;
    private tokenSubject: BehaviorSubject<string | null>;
    public token$: Observable<string | null>;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {

        const initialToken = localStorage.getItem('token');
        this.tokenSubject = new BehaviorSubject<string | null>(initialToken);
        this.token$ = this.tokenSubject.asObservable();
    }

    login(credenciais: Credenciais): Observable<ResponseRequest> {
        return this.http.post<ResponseRequest>(`${this.baseUrl}/auth/login`, credenciais).pipe(
            tap(response => {
                const token = response?.data?.token
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', token);
                this.tokenSubject.next(token);
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
