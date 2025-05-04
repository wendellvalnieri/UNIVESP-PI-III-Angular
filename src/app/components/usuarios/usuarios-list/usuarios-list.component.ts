import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-usuarios-list',
    templateUrl: './usuarios-list.component.html',
    styleUrls: ['./usuarios-list.component.scss'],
})
export class UsuariosListComponent implements OnInit {
    usuarios: Usuario[] = [];
    loading: boolean = true;
    error: string = '';

    constructor(private usuariosService: UsuariosService) { }

    ngOnInit(): void {
        this.loadUsuarios();
    }

    loadUsuarios(): void {
        this.loading = true;
        this.usuariosService.getAll().subscribe({
            next: (data) => {
                this.usuarios = data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar usuários. Por favor, tente novamente.';
                this.loading = false;
            }
        });
    }

    deleteUsuario(id: string): void {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            this.usuariosService.delete(id).subscribe({
                next: () => {
                    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
                },
                error: (error) => {
                    this.error = 'Erro ao excluir usuário. Por favor, tente novamente.';
                }
            });
        }
    }
}