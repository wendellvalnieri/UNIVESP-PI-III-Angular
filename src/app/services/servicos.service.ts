import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico.model';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})

export class ServicosService {
    private baseUrl = `${environment.apiUrl}/servicos`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Servico[]> {
        return this.http.get<Servico[]>(this.baseUrl);
    }

    getById(id: string): Observable<Servico> {
        return this.http.get<Servico>(`${this.baseUrl}/${id}`);
    }

    create(servico: Partial<Servico>): Observable<Servico> {
        return this.http.post<Servico>(this.baseUrl, servico);
    }

    update(id: string, servico: Partial<Servico>): Observable<Servico> {
        return this.http.put<Servico>(`${this.baseUrl}/${id}`, servico);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}