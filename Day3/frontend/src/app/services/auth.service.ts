import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs"; 
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7028/api/Auth/login';

  // ✅ Inject HttpClient here
  constructor(private http: HttpClient) {}

  // ✅ Login method
  login(userName: string, passWord: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { userName, passWord }).pipe(
      catchError((error) => { 
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed. Please try again later.'));
      })
    );
  }
}
