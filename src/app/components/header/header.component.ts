import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    isAuthenticated: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.authService.token$.subscribe(token => {
            this.isAuthenticated = !!token;
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}