import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface Comment { // Day8
  id?: number;
  author: string;
  message: string;
  createdDate?: Date;
}

export interface BugStats { // Day9
  openVsResolved  : {
    open : number;
    resolved : number;
  }
  bugsByProject : {
    [project : string] : number;
  }
  bugsByStatus : {
    [status : string] : number;
  }
}

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: Date;
  assignedTo?: string;
  comments?: Comment[];
}

@Injectable({ providedIn: "root" })
export class BugService {
  private apiUrl = "https://localhost:7028/api/Bug/async";

  constructor(private http: HttpClient) {}

  getBugStats(): Observable<BugStats> {
    return this.http.get<BugStats>(`${this.apiUrl}/stats`).pipe(
      catchError((err) => {
        console.error("Error fetching bug stats", err);
        return throwError(() => new Error("Failed to fetch bug stats"));
      })
    );
  } // Day9

  addComment(bugId: number, comment: Comment) : Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${bugId}/comments`, comment).pipe(
      catchError((err) => {
        console.error("Error adding comment", err);
        return throwError(() => new Error("Failed to add comment"));
      })
    );
  } // Day8

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

  getBug(id: number): Observable<Bug> {
    return this.http.get<Bug>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => {
        console.error("Error fetching bug", err);
        return throwError(() => new Error("Failed to fetch bug"));
      })
    );
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
