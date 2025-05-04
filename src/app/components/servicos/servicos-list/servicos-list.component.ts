import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../../services/servicos.service';
import { Servico } from '../../../models/servico.model';
import { ResponseRequest } from '../../../models/auth.model';

@Component({
    selector: 'app-servicos-list',
    templateUrl: './servicos-list.component.html',
    styleUrls: ['./servicos-list.component.scss']
})
export class ServicosListComponent implements OnInit {
    servicos: Servico[] = [];
    loading: boolean = true;
    error: string = '';

    constructor(private servicosService: ServicosService) { }

    ngOnInit(): void {
        this.loadServicos();
    }

    loadServicos(): void {
        this.loading = true;
        this.servicosService.getAll().subscribe({
            next: (data: any) => {
                this.servicos = data.data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar serviços. Por favor, tente novamente.';
                this.loading = false;
            }
        });
    }

    deleteServico(id: string): void {
        if (confirm('Tem certeza que deseja excluir este serviço?')) {
            this.servicosService.delete(id).subscribe({
                next: () => {
                    this.servicos = this.servicos.filter(servico => servico.id !== id);
                },
                error: (error) => {
                    this.error = 'Erro ao excluir serviço. Por favor, tente novamente.';
                }
            });
        }
    }
}