import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";


export const RoleGuard = (expectedRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const role = auth.getUserRole(); // Assuming AuthService returns the role

    if (auth.isLoggedIn() && role === expectedRole) {
      return true;
    } else {
      // Better to return UrlTree instead of navigating here
      router.navigate(['/unauthorized']);
      return false;
    }
  };
};
