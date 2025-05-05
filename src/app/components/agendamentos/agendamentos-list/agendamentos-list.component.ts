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
    agendamentosOriginal: any[] = [];
    loading: boolean = true;
    error: string = '';
    statusSelecionado = 'todos';
    constructor(private agendamentosService: AgendamentosService) { }

    ngOnInit(): void {
        this.loadAgendamentos();
    }

    loadAgendamentos(): void {
        this.loading = true;
        this.agendamentosService.getAll().subscribe({
            next: (data: any) => {
                const response = data.data;
                const agrupados = this.processarEAgruparReservas(response);

                this.agendamentosOriginal = Object.values(agrupados).flat();

                this.agendamentos = [...this.agendamentosOriginal];

                this.loading = false;
            },
            error: (error) => {
                this.error = 'Erro ao carregar agendamentos. Por favor, tente novamente.';
                this.loading = false;
            }
        });
    }

    processarEAgruparReservas(reservas: any[]): any {
        const agora = new Date();

        const reservasProcessadas = reservas.map(reserva => {
            const reservaAtualizada = { ...reserva };

            const [ano, mes, dia] = reserva.data_reserva.split('T')[0].split('-').map(Number);
            const [hora, minuto] = reserva.hora_reserva.split(':').map(Number);
            const dataHoraReserva = new Date(ano, mes - 1, dia, hora, minuto);

            if (dataHoraReserva < agora && reserva.status === 'agendado') {
                reservaAtualizada.status = 'finalizado';
            }

            return reservaAtualizada;
        });

        const reservasAgrupadas: any = {};

        reservasProcessadas.forEach(reserva => {
            if (!reservasAgrupadas[reserva.status]) {
                reservasAgrupadas[reserva.status] = [];
            }

            reservasAgrupadas[reserva.status].push(reserva);
        });

        return reservasAgrupadas;
    }

    filtrarPorStatus(): void {
        if (this.statusSelecionado === 'todos') {
            this.agendamentos = [...this.agendamentosOriginal];
        } else {
            this.agendamentos = this.agendamentosOriginal.filter(
                agendamento => agendamento.status === this.statusSelecionado
            );
        }
    }

    contarAgendamentosPorStatus(status: string): number {
        if (this.agendamentosOriginal.length == 0) return 0;
        return this.agendamentosOriginal.filter(
            agendamento => agendamento.status === status
        ).length;
    }

    ordenarPorDataHoraDecrescente(reservas: any[]): any[] {
        return [...reservas].sort((a, b) => {
            const dataA = new Date(`${a.data_reserva.split('T')[0]}T${a.hora_reserva}`);
            const dataB = new Date(`${b.data_reserva.split('T')[0]}T${b.hora_reserva}`);

            return dataB.getTime() - dataA.getTime();
        });
    }
}