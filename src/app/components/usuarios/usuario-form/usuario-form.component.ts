import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
    usuarioForm: FormGroup;
    isEditMode: boolean = false;
    usuarioId: string = '';
    loading: boolean = false;
    submitted: boolean = false;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private usuariosService: UsuariosService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.usuarioForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
            first_name: ['', [Validators.required]],
            last_name: [''],
            email: ['', [Validators.required, Validators.email]],
            is_active: [true],
            is_staff: [false],
            is_superuser: [false]
        });
    }

    ngOnInit(): void {
        this.usuarioId = this.route.snapshot.params['id'];
        this.isEditMode = !!this.usuarioId;

        if (this.isEditMode) {
            this.loading = true;
            // Remove password validation in edit mode
            this.usuarioForm.get('password')?.clearValidators();
            this.usuarioForm.get('password')?.updateValueAndValidity();

            this.usuariosService.getById(this.usuarioId).subscribe({
                next: (usuario) => {
                    this.usuarioForm.patchValue({
                        username: usuario.username,
                        first_name: usuario.first_name,
                        last_name: usuario.last_name,
                        email: usuario.email,
                        is_active: usuario.is_active,
                        is_staff: usuario.is_staff,
                        is_superuser: usuario.is_superuser
                    });
                    this.loading = false;
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao carregar usuário. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.usuarioForm.invalid) {
            return;
        }

        this.loading = true;
        const usuarioData: Usuario = {
            username: this.usuarioForm.value.username,
            password: this.usuarioForm.value.password,
            first_name: this.usuarioForm.value.first_name,
            last_name: this.usuarioForm.value.last_name,
            email: this.usuarioForm.value.email,
            is_active: this.usuarioForm.value.is_active,
            is_staff: this.usuarioForm.value.is_staff,
            is_superuser: this.usuarioForm.value.is_superuser,
        };

        if (this.isEditMode) {
            // Don't send the password if it's empty in edit mode
            if (!usuarioData.password) {
                delete usuarioData.password;
            }

            this.usuariosService.update(this.usuarioId, usuarioData).subscribe({
                next: () => {
                    this.router.navigate(['/usuarios']);
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao atualizar usuário. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        } else {
            this.usuariosService.create(usuarioData).subscribe({
                next: () => {
                    this.router.navigate(['/usuarios']);
                },
                error: (error) => {
                    this.errorMessage = 'Erro ao criar usuário. Por favor, tente novamente.';
                    this.loading = false;
                }
            });
        }
    }
}