import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs"; 
import { catchError } from "rxjs/operators";

export interface Bug {
    id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    createdOn: string;
    projectId: number;
}

@Injectable({
    providedIn: 'root'
})
export class BugService {
    private apiUrl = 'https://localhost:7028/api/Bug/async';

    constructor(private http: HttpClient) {}

    getBugs(): Observable<Bug[]> {
        return this.http.get<Bug[]>(this.apiUrl).pipe(
            catchError((error) => { 
                console.error('Error fetching bugs:', error);
                return throwError(() => new Error('Error fetching bugs. Please try again later.'));
            })
        );
    }
}
