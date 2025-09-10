import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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
    return this.http.get<BugStats>(`${this.apiUrl}/stats`);
  }

  addComment(bugId: number, comment: Comment) : Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${bugId}/comments`, comment);
  }

  postBugs(bug : Bug) {
    return this.http.post<Bug>(this.apiUrl, bug);
  }

  updateCurrentBugs(id: number, bug: Bug) {
    return this.http.put<Bug>(`${this.apiUrl}/${id}`, bug);
  }

  deleteBugs(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteMultipleBugs(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/batch`, { body: ids });
  }

  getBug(id: number): Observable<Bug> {
    return this.http.get<Bug>(`${this.apiUrl}/${id}`);
  }

  getBugs(): Observable<Bug[]> {
    return this.http.get<Bug[]>(this.apiUrl);
  }
}