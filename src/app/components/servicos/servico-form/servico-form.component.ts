import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicosService } from '../../../services/servicos.service';
import { Servico } from '../../../models/servico.model';

@Component({
    selector: 'app-servico-form',
    templateUrl: './servico-form.component.html',
    styleUrls: ['./servico-form.component.scss']
})
export class ServicoFormComponent implements OnInit {
    servicoForm: FormGroup;
    isEditMode: boolean = false;
    isViewMode: boolean = false;
    servicoId: string = '';
    loading: boolean = false;
    submitted: boolean = false;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private servicosService: ServicosService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.servicoForm = this.fb.group({
            nome: ['', [Validators.required]],
            preco: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            descricao: [''],
            ativo: [true]
        });
    }

    ngOnInit(): void {
        this.servicoId = this.route.snapshot.params['id'];
        this.isEditMode = !!this.servicoId;

        this.isViewMode = location.href.includes("editar");
        this.route.params.subscribe(params => {
            this.servicoId = params['id'];
            this.isEditMode = !!this.servicoId;
        })

        if (this.isEditMode) {
            this.loading = true;
            this.servicosService.getById(this.servicoId).subscribe({
                next: (response: any) => {
                    const servico: Servico = response.data;
                    this.servicoForm.patchValue({
                        nome: servico.nome,
                        preco: servico.preco,
                        descricao: servico.descricao,
                        ativo: servico.ativo
                    });
                    this.loading = false;
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao carregar serviço. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.servicoForm.invalid) {
            return;
        }

        this.loading = true;
        const servicoData = {
            nome: this.servicoForm.value.nome,
            preco: this.servicoForm.value.preco,
            descricao: this.servicoForm.value.descricao,
            ativo: this.servicoForm.value.ativo
        };

        if (this.isEditMode) {
            this.servicosService.update(this.servicoId, servicoData).subscribe({
                next: () => {
                    this.router.navigate(['/servicos']);
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao atualizar serviço. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        } else {
            this.servicosService.create(servicoData).subscribe({
                next: () => {
                    this.router.navigate(['/servicos']);
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao criar serviço. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        }
    }
}