import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Agendamento } from '../models/agendamento.model';

@Injectable({
    providedIn: 'root'
})
export class AgendamentosService {
    private baseUrl = `${environment.apiUrl}/reservas`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Agendamento[]> {
        return this.http.get<Agendamento[]>(this.baseUrl);
    }

    getById(id: string): Observable<Agendamento> {
        return this.http.get<Agendamento>(`${this.baseUrl}/${id}`);
    }

    create(item: Agendamento): Observable<Agendamento> {
        return this.http.post<Agendamento>(this.baseUrl, item);
    }

    update(id: string, item: Partial<Agendamento>): Observable<Agendamento> {
        return this.http.put<Agendamento>(`${this.baseUrl}/${id}`, item);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}