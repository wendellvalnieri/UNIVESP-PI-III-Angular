import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Credenciais, TokenResponse } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;
    private isBrowser: boolean;
    private tokenSubject: BehaviorSubject<string | null>;
    public token$: Observable<string | null>;

    constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        const initialToken = this.isBrowser ? localStorage.getItem('token') : null;
        this.tokenSubject = new BehaviorSubject<string | null>(initialToken);
        this.token$ = this.tokenSubject.asObservable();
    }

    login(credenciais: Credenciais): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(`${this.baseUrl}/token/`, credenciais).pipe(
            tap(response => {
                if (this.isBrowser) {
                    localStorage.setItem('token', response.access);
                    localStorage.setItem('refreshToken', response.refresh);
                }
                this.tokenSubject.next(response.access);
            })
        );
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
        this.tokenSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.tokenSubject.value;
    }

    getToken(): string | null {
        return this.tokenSubject.value;
    }
}
