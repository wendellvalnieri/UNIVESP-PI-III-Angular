export interface Agendamento {
    id: number;
    nome_usuario: string;
    nome_servico: string;
    servico_id: number;
    usuario_id: number;
    data: string;
    horario: string;
    status: string;
    preco: number;
    observacoes?: string;
    data_reserva: string;
    hora_reserva: string;
    imagem: string;
}