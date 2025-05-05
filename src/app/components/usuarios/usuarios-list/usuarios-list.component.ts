import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Component({
    selector: 'app-usuarios-list',
    templateUrl: './usuarios-list.component.html',
    styleUrls: ['./usuarios-list.component.scss'],
})
export class UsuariosListComponent implements OnInit {
    usuarios: Usuario[] = [];
    loading: boolean = true;
    error: string = '';

    constructor(
        private usuariosService: UsuariosService,
        private http: HttpClient
    ) { }

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
    async enviarMensagem(token_message: string) {
        const { value: formValues, isDismissed } = await Swal.fire({
            title: 'Preencha os campos',
            html: `
            <input id="swal-input1" class="swal2-input" placeholder="Título">
            <input id="swal-input2" class="swal2-input" placeholder="Mensagem">
          `,
            focusConfirm: false,
            showCancelButton: true,
            preConfirm: () => {
                return [
                    (document.getElementById('swal-input1') as HTMLInputElement).value,
                    (document.getElementById('swal-input2') as HTMLInputElement).value
                ];
            }
        });

        if (!isDismissed && formValues) {
            console.log('Form values:', formValues);
            const data = {
                push_key: token_message,
                data: {
                    title: formValues[0],
                    message: formValues[1]
                }
            };

            this.http.post<any>(`${environment.apiUrl}/notificacoes`, data).subscribe({
                next: (data: any) => {
                    console.log(data);
                    Swal.fire({
                        text: "Sucesso"
                    })

                },
                error: (error) => {
                    this.error = 'Erro ao enviar notificação'
                }
            });
        }
    }
}