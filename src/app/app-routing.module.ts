import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServicosListComponent } from './components/servicos/servicos-list/servicos-list.component';
import { ServicoFormComponent } from './components/servicos/servico-form/servico-form.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'servicos',
        component: ServicosListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'servicos/novo',
        component: ServicoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'servicos/:id',
        component: ServicoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'servicos/editar/:id',
        component: ServicoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'usuarios',
        component: UsuariosListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'usuarios/novo',
        component: UsuarioFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'usuarios/editar/:id',
        component: UsuarioFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }