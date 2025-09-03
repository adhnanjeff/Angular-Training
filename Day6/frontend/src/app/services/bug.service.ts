import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: Date;
}

@Injectable({ providedIn: "root" })
export class BugService {
  private apiUrl = "https://localhost:7028/api/Bug/async";

  constructor(private http: HttpClient) {}

  // Get all bugs
  getBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error("Error fetching bugs", err);
        return throwError(() => new Error("Failed to fetch bugs"));
      })
    );
  }
}
