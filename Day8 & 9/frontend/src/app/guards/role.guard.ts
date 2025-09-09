import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const RoleGuard = (expectedRole: string): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        
        if (!authService.isLoggedIn()) {
            router.navigate(['/login']);
            return false;
        }
        
        const userRole = authService.getUserRole();
        if (userRole === expectedRole) {
            return true;
        } else {
            router.navigate(['/unauthorized']);
            return false;
        }
    }
}