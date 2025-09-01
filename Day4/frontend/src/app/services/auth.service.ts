import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ✅ Keep this as a string (your API endpoint)
  private apiUrl = 'https://localhost:7028/api/Auth/login';

  constructor(private http: HttpClient) {}

  /**
   * Login user with username & password
   */
  login(username: string, password: string): Observable<any> {
    // 👇 Adjust keys (userName / password) to match your C# backend DTO
    return this.http.post<any>(this.apiUrl, { userName: username, password: password }).pipe(
      tap((res) => {
        console.log("Login response:", res);

        // ✅ Handle token property name differences
        const token = res.token || res.jwtToken || res.access_token;

        if (token) {
          localStorage.setItem('token', token);
        } else {
          console.warn("No token found in response!");
        }
      }),
      catchError((error) => {
        console.error("Error during login:", error);
        return throwError(() => new Error('Login failed. Please try again later.'));
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
