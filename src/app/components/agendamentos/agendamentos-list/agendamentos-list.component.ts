import { Component, OnInit } from '@angular/core';
import { Servico } from '../../../models/servico.model';
import { AgendamentosService } from '../../../services/agendamentos.service';
import { Agendamento } from '../../../models/agendamento.model';

@Component({
    selector: 'app-agendamentos-list',
    templateUrl: './agendamentos-list.component.html',
    styleUrls: ['./agendamentos-list.component.scss']
})
export class AgendamentosListComponent implements OnInit {
    agendamentos: Agendamento[] = [];
    loading: boolean = true;
    error: string = '';

    constructor(private agendamentosService: AgendamentosService) { }

    ngOnInit(): void {
        this.loadAgendamentos();
    }

    loadAgendamentos(): void {
        this.loading = true;
        this.agendamentosService.getAll().subscribe({
            next: (data: any) => {
                this.agendamentos = data.data;
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar agendamentos. Por favor, tente novamente.';
                this.loading = false;
            }
        });
    }
}