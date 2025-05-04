import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Servico } from '../../models/servico.model';
import { Usuario } from '../../models/usuario.model';
import { ResponseRequest } from '../../models/auth.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    servicosCount: number = 0;
    usuariosCount: number = 0;
    recentServicos: Servico[] = [];
    recentUsuarios: Usuario[] = [];
    loading: boolean = true;
    error: string = '';

    constructor(
        private servicosService: ServicosService,
        private usuariosService: UsuariosService
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.loading = true;

        // Load serviços count and recent items
        this.servicosService.getAll().subscribe({
            next: (response: any) => {
                const servicos = response.data as Servico[];
                this.servicosCount = servicos.length;
                this.recentServicos = servicos.slice(0, 5); // Get only the first 5 items
                this.checkLoadingComplete();
            },
            error: (error) => {
                this.error = 'Erro ao carregar dados de serviços.';
                this.loading = false;
            }
        });

        // Load usuários count and recent items
        this.usuariosService.getAll().subscribe({
            next: (usuarios) => {
                this.usuariosCount = usuarios.length;
                this.recentUsuarios = usuarios.slice(0, 5); // Get only the first 5 items
                this.checkLoadingComplete();
            },
            error: (error) => {
                this.error = 'Erro ao carregar dados de usuários.';
                this.loading = false;
            }
        });
    }

    private checkLoadingComplete(): void {
        // Check if all data is loaded
        if (this.recentServicos.length > 0 && this.recentUsuarios.length > 0) {
            this.loading = false;
        }
    }
}