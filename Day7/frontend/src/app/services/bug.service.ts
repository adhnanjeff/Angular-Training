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
  postBugs(bug : Bug) {
    return this.http.post<Bug>(this.apiUrl, bug).pipe(
      catchError((err) => {
        console.error("Error posting bug", err);
        return throwError(() => new Error("Failed to post bug"));
      })
    );
  }
  updateCurrentBugs(id: number, bug: Bug) {
    return this.http.put<Bug>(`${this.apiUrl}/${id}`, bug).pipe(
      catchError((err) => {
        console.error("Error updating bug", err);
        return throwError(() => new Error("Failed to update bug"));
      })
    );
  }

  deleteBugs(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

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
