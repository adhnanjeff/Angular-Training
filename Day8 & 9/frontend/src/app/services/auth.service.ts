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
    return this.http.post<any>(this.apiUrl, { userName: username, password: password }).pipe(
      tap((res) => {
        console.log("Login response:", res);
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

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post<any>('https://localhost:7028/api/Auth/register', { 
      userName: username, 
      password: password, 
      role: role 
    }).pipe(
      catchError((error) => {
        console.error("Error during registration:", error);
        return throwError(() => new Error('Registration failed. Please try again later.'));
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

  /**
   * Check if user is authenticated (alias for isLoggedIn)
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  /**
   * Store JWT token
   */
  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
 
  // Day 5 - Role-based access
  getUserRole(): string | null {
  const token = this.getToken();
  if (!token) return null;
 
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded token payload role:", payload.role);
 
    return (
      payload.role ||
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null
    );
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}}
