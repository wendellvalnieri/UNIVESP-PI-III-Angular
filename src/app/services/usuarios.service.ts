import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    private baseUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.baseUrl);
    }

    getById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
    }

    create(usuario: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(this.baseUrl, usuario);
    }

    update(id: string, usuario: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}